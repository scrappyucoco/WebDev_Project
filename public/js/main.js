/* ==========================================================================
   ALICIA'S SPECIAL BATCHOY - VANILLA JAVASCRIPT ENGINE
   Modules:
   1. Mobile navigation toggle
   2. Unified menu search + category filter
   3. Branch switcher, map, peak-hours visualizer & READ-ONLY Google
      Places API (New) review board
   4. Contact & catering form validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     Shared helpers
     ------------------------------------------------------------------------ */
  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g,
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  /* ------------------------------------------------------------------------
     Module 1: Mobile hamburger navigation toggle
     ------------------------------------------------------------------------ */
  const mobileToggleBtn = document.getElementById('mobile_toggle_btn');
  const navMenu = document.getElementById('nav_menu');
  const toggleIcon = document.getElementById('toggle_icon');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');

      if (toggleIcon) {
        toggleIcon.src = isExpanded ? 'icons/x.svg' : 'icons/menu.svg';
      }
    });
  }

  /* ------------------------------------------------------------------------
     Module 2: Unified search + category filter (our_menu.html)
     ------------------------------------------------------------------------ */
  const searchInput = document.getElementById('menu_search_input');
  const searchClearBtn = document.getElementById('search_clear_btn');
  const filterBtns = document.querySelectorAll('.filter_btn');
  const menuCards = document.querySelectorAll('#menu_grid .card_item');
  const noResultsMsg = document.getElementById('no_results_msg');

  let activeCategory = 'all';

  function filterMenuItems() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    menuCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const titleEl = card.querySelector('.card_item_title');
      const titleText = titleEl ? titleEl.textContent : '';
      const categoryTextEl = card.querySelector('.category_badge');
      const categoryText = categoryTextEl ? categoryTextEl.textContent : '';
      const searchText = `${card.getAttribute('data-title') || ''} ${titleText} ${categoryText}`.toLowerCase();

      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
      const matchesSearch = !query || searchText.includes(query);
      const isVisible = matchesCategory && matchesSearch;

      card.style.display = isVisible ? 'flex' : 'none';

      if (isVisible) {
        visibleCount++;
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (searchClearBtn) {
      searchClearBtn.classList.toggle('visible', query.length > 0);
    }
  }

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');

      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        activeCategory = btn.getAttribute('data-filter');
        filterMenuItems();
      });
    });

    const requestedFilter = window.location.hash.slice(1);
    const requestedFilterBtn = document.getElementById(requestedFilter);
    if (requestedFilterBtn && requestedFilterBtn.classList.contains('filter_btn')) {
      requestedFilterBtn.click();
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterMenuItems);

    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && searchInput.value) {
        searchInput.value = '';
        filterMenuItems();
      }
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        filterMenuItems();
        searchInput.focus();
      }
    });
  }

  if (menuCards.length) {
    filterMenuItems();
  }

  /* ------------------------------------------------------------------------
     Module 3: Dynamic branch switcher, map & Google review board
     ------------------------------------------------------------------------ */
  const branchSelector = document.getElementById('branch_selector');

  if (branchSelector) {
    initBranchFinder();
  }

  function initBranchFinder() {
    const mapIframe = document.getElementById('branch_map_iframe');
    const branchNameEl = document.getElementById('branch_name');
    const branchAddressEl = document.getElementById('branch_address');
    const branchPhoneLink = document.getElementById('branch_phone_link');
    const branchHoursEl = document.getElementById('branch_hours');
    const peakHoursText = document.getElementById('peak_hours_text');
    const peakHoursTrack = document.getElementById('peak_hours_track');
    const branchRatingValue = document.getElementById('branch_rating_value');
    const branchRatingStars = document.getElementById('branch_rating_stars');
    const branchRatingCount = document.getElementById('branch_rating_count');
    const writeReviewBtn = document.getElementById('write_review_btn');
    const reviewsGrid = document.getElementById('reviews_grid');
    const reviewBoardSubtitle = document.getElementById('review_board_subtitle');
    const placesApiKeyMeta = document.querySelector('meta[name="google-places-api-key"]');
    const placesApiKey = placesApiKeyMeta ? placesApiKeyMeta.getAttribute('content').trim() : '';

    /*
     * Branch metadata and official Google Place IDs.
     * Ratings and reviews are requested directly from Google Places API.
     */
    const BRANCHES = {
      jaro: {
        name: 'Jaro Branch',
        address: 'PHH5+364, Washington St, Jaro, Iloilo City, Iloilo',
        phone: '+63 999 880 5529',
        hours: '7:00 AM – 8:30 PM',
        placeId: 'ChIJo-Rcjt_krjMRBcx5Ct4SNIY',
        peakSummary: '12:00 PM – 2:00 PM & 5:00 PM – 8:00 PM',
        peaks: [[12, 14], [17, 20]],
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0887488709322!2d122.5580657!3d10.727638100000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aee4df8e5ce4a3%3A0x863412de0a79cc05!2sAlicia's%20Restaurant%20%26%20Catering!5e0!3m2!1sen!2sph!4v1795422888259!5m2!1sen!2sph"
      },
      lapaz: {
        name: 'La Paz Branch',
        address: 'PH6C+W67, La Paz, Iloilo City, Iloilo',
        phone: '+63 939 989 3302',
        hours: '7:00 AM – 8:00 PM',
        placeId: 'ChIJQ8u_u-LlrjMRF7ykE2KFggE',
        peakSummary: '1:00 PM – 2:00 PM & 4:00 PM – 6:00 PM',
        peaks: [[13, 14], [16, 18]],
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.284057977187!2d122.56762157582476!3d10.712559789432447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aee5e2bbbfcb43%3A0x182856213a4bc17!2sALICIA%20BATCHOY%20LAPAZ%20BRANCH!5e0!3m2!1sen!2sph!4v1795422969778!5m2!1sen!2sph"
      },
      smallville: {
        name: 'Smallville Branch',
        address: 'Red Square Building, San Jose St, Mandurriao, Iloilo City, 5000 Iloilo',
        phone: '+63 947 898 4117',
        hours: '7:00 AM – 11:00 PM',
        placeId: 'ChIJmUz1KADlrjMRCGxobjWcFb8',
        peakSummary: '12:00 PM – 2:00 PM & 5:00 PM – 9:00 PM',
        peaks: [[12, 14], [17, 21]],
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.3838490283015!2d122.5486546758239!3d10.704847589439378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aee50028f54c99%3A0xbf159c356e686c08!2sAlicia's%20Special%20Batchoy%20Smallville!5e0!3m2!1sen!2sph!4v1795422986614!5m2!1sen!2sph"
      },
      arevalo: {
        name: 'Villa Arevalo Branch',
        address: 'Heritage House, 1927 Avanceña-Sayson, Quezon St, Iloilo City, 5000 Iloilo',
        phone: '+63 999 885 9688',
        hours: '7:00 AM – 7:00 PM',
        placeId: 'ChIJGUmZJQDxrjMRdW8j7Vsvtko',
        peakSummary: '10:00 AM – 12:00 PM & 3:00 PM – 6:00 PM',
        peaks: [[10, 12], [15, 18]],
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2186.132888573816!2d122.51548731323265!3d10.672566005497389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aef10025994919%3A0x4ab62f5bed236f75!2sAlicia%20Special%20Batchoy%20Villa%20Arevalo%20Branch!5e0!3m2!1sen!2sph!4v1795433974043!5m2!1sen!2sph"
      }
    };

    let requestToken = 0;

    function getSelectedBranch() {
      return BRANCHES[branchSelector.value] || BRANCHES.jaro;
    }

    function formatHour(decimalHour) {
      const totalMinutes = Math.round(decimalHour * 60);
      const hours24 = Math.floor(totalMinutes / 60) % 24;
      const minutes = totalMinutes % 60;
      const period = hours24 >= 12 ? 'PM' : 'AM';
      const hours12 = hours24 % 12 || 12;
      return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
    }

    function formatReviewCount(count) {
      return Number(count || 0).toLocaleString('en-US');
    }

    function starsMarkup(rating) {
      const safeRating = Number.isFinite(Number(rating)) ? Math.max(0, Math.min(5, Number(rating))) : 0;
      const fillPercent = (safeRating / 5) * 100;

      return `
        <span class="star_rating" role="img" aria-label="${safeRating.toFixed(1)} out of 5 stars">
          <span class="star_rating_base" aria-hidden="true">★★★★★</span>
          <span class="star_rating_fill" aria-hidden="true" style="width:${fillPercent}%">★★★★★</span>
        </span>
      `;
    }

    function renderRating(rating, count) {
      const safeRating = Number(rating);
      const safeCount = Number(count);

      if (branchRatingValue) {
        branchRatingValue.textContent = (Number.isFinite(safeRating) ? safeRating : 0).toFixed(1);
      }
      if (branchRatingStars) {
        branchRatingStars.innerHTML = starsMarkup(Number.isFinite(safeRating) ? safeRating : 0);
      }
      if (branchRatingCount) {
        branchRatingCount.textContent = `(${formatReviewCount(Number.isFinite(safeCount) ? safeCount : 0)} Google Reviews)`;
      }

    }

    function renderPeakHours(branch) {
      if (peakHoursText) {
        peakHoursText.textContent = `Peak Dining: ${branch.peakSummary}`;
      }

      if (peakHoursTrack) {
        const trackStart = 7;
        const trackEnd = 23;
        const trackDuration = trackEnd - trackStart;
        peakHoursTrack.innerHTML = '';

        branch.peaks.forEach(([start, end]) => {
          const segment = document.createElement('span');
          const left = Math.max(0, Math.min(100, ((start - trackStart) / trackDuration) * 100));
          const right = Math.max(0, Math.min(100, ((end - trackStart) / trackDuration) * 100));

          segment.className = 'peak_segment';
          segment.style.left = `${left}%`;
          segment.style.width = `${Math.max(right - left, 1.5)}%`;
          segment.title = `${formatHour(start)} – ${formatHour(end)}`;
          peakHoursTrack.appendChild(segment);
        });

        peakHoursTrack.setAttribute('aria-label', `Peak dining hours for ${branch.name}: ${branch.peakSummary}`);
      }
    }

    function getInitials(name) {
      return String(name || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join('') || 'G';
    }

    function renderReviews(reviews, branch) {
      if (!reviewsGrid) return;

      if (!Array.isArray(reviews) || reviews.length === 0) {
        reviewsGrid.innerHTML = '<p class="reviews_empty">No reviews are available for this branch yet.</p>';
        return;
      }

      reviewsGrid.innerHTML = reviews.slice(0, 5).map(review => {
        const author = review.author || 'Google User';
        const rating = Number.isFinite(Number(review.rating)) ? Math.max(1, Math.min(5, Number(review.rating))) : 5;
        const reviewText = review.text || 'Rated this branch on Google.';
        const reviewTime = review.time || 'Recently';
        return `
          <article class="review_card">
            <div class="review_card_top">
              <div class="review_avatar" aria-hidden="true">${escapeHTML(getInitials(author))}</div>
              <div>
                <strong class="review_author">${escapeHTML(author)}</strong>
                <span class="review_time">${escapeHTML(reviewTime)}</span>
              </div>
            </div>
            <div class="review_stars">${starsMarkup(rating)}</div>
            <p class="review_text">${escapeHTML(reviewText)}</p>
            <div class="review_footer">
              <span class="review_branch_badge">${escapeHTML(branch.name)}</span>
              <span class="review_source_label">Google review</span>
            </div>
          </article>
        `;
      }).join('');
    }

    function normalizePlaceReviews(data, branch) {
      if (!data || !Array.isArray(data.reviews)) return [];

      return data.reviews.slice(0, 5).map(review => {
        const author = review.authorAttribution && review.authorAttribution.displayName
          ? review.authorAttribution.displayName
          : 'Google User';
        const textPayload = review.text || review.originalText || {};
        const text = textPayload.text || 'Rated this branch on Google.';
        const rating = Number(review.rating);

        return {
          author,
          rating: Number.isFinite(rating) ? Math.max(1, Math.min(5, rating)) : 5,
          text,
          time: review.relativePublishTimeDescription || 'Recently',
          branch: branch.name,
          source: 'google'
        };
      });
    }

    function showUnavailableReviews(branch) {
      if (branchRatingValue) branchRatingValue.textContent = '--';
      if (branchRatingStars) branchRatingStars.innerHTML = '';
      if (branchRatingCount) branchRatingCount.textContent = '';
      renderReviews([], branch);
      if (reviewsGrid) reviewsGrid.setAttribute('aria-busy', 'false');
    }

    async function loadPlaceData(branch) {
      const currentRequestToken = ++requestToken;

      if (!placesApiKey || !branch.placeId) {
        showUnavailableReviews(branch);
        return;
      }

      if (reviewsGrid) reviewsGrid.setAttribute('aria-busy', 'true');

      try {
        const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(branch.placeId)}`, {
          headers: {
            'Accept': 'application/json',
            'X-Goog-Api-Key': placesApiKey,
            'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews'
          }
        });

        if (!response.ok) {
          let message = `Places API request failed with status ${response.status}`;
          try {
            const errorBody = await response.json();
            if (errorBody.error) message = errorBody.error;
          } catch {}
          throw new Error(message);
        }

        const data = await response.json();

        // Ignore stale responses when the user has switched branches quickly.
        if (currentRequestToken !== requestToken) return;

        const rating = Number(data.rating);
        const reviewCount = Number(data.userRatingCount);
        const placeReviews = normalizePlaceReviews(data, branch);

        if (Number.isFinite(rating) && Number.isFinite(reviewCount)) {
          renderRating(rating, reviewCount);
          renderReviews(placeReviews, branch);
        } else {
          showUnavailableReviews(branch);
        }
      } catch (error) {
        if (currentRequestToken !== requestToken) return;
        showUnavailableReviews(branch);
      } finally {
        if (currentRequestToken === requestToken && reviewsGrid) {
          reviewsGrid.setAttribute('aria-busy', 'false');
        }
      }
    }

    function renderBranch(branch, options) {
      const settings = options || {};

      if (branchNameEl) branchNameEl.textContent = branch.name;
      if (branchAddressEl) branchAddressEl.textContent = branch.address;

      if (branchPhoneLink) {
        branchPhoneLink.textContent = branch.phone;
        branchPhoneLink.href = `tel:${branch.phone.replace(/[^+\d]/g, '')}`;
      }

      if (branchHoursEl) branchHoursEl.textContent = branch.hours;

      if (mapIframe) {
        if (mapIframe.getAttribute('src') !== branch.mapEmbed) {
          mapIframe.setAttribute('src', branch.mapEmbed);
        }
        mapIframe.setAttribute('title', `Map of Alicia's Special Batchoy ${branch.name}`);
      }

      renderPeakHours(branch);

      if (reviewBoardSubtitle) {
        reviewBoardSubtitle.textContent = `Top 5 guest reviews for ${branch.name}`;
      }

      if (writeReviewBtn) {
        const reviewUrl = branch.placeId
          ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(branch.placeId)}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${branch.name} ${branch.address}`)}`;

        writeReviewBtn.href = reviewUrl;
        writeReviewBtn.setAttribute('aria-label', `Write a review for ${branch.name} on Google Maps (opens in a new tab)`);
      }

      if (settings.syncForm) {
        const formBranchSelect = document.getElementById('user_branch');
        if (formBranchSelect) {
          formBranchSelect.value = Object.keys(BRANCHES).find(key => BRANCHES[key] === branch) || '';
        }
      }

      showUnavailableReviews(branch);
    }

    branchSelector.addEventListener('change', () => {
      const branch = getSelectedBranch();
      renderBranch(branch, { syncForm: true });
      loadPlaceData(branch);
    });

    const initialBranch = getSelectedBranch();
    renderBranch(initialBranch);
    loadPlaceData(initialBranch);
  }

  /* ------------------------------------------------------------------------
     Module 4: Contact & catering form validation (contact_us.html)
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact_form');
  const formFeedback = document.getElementById('form_feedback');

  if (contactForm) {
    const nameInput = document.getElementById('user_name');
    const emailInput = document.getElementById('user_email');
    const branchInput = document.getElementById('user_branch');
    const inquiryInput = document.getElementById('user_inquiry');
    const messageInput = document.getElementById('user_message');

    const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    function setFieldValidity(field, isValid) {
      if (!field) return true;

      const group = field.closest('.form_group');
      if (isValid) {
        if (group) group.classList.remove('invalid');
        field.removeAttribute('aria-invalid');
        return true;
      }

      if (group) group.classList.add('invalid');
      field.setAttribute('aria-invalid', 'true');
      return false;
    }

    function clearFeedback() {
      if (!formFeedback) return;
      formFeedback.textContent = '';
      formFeedback.classList.remove('is-success', 'is-error');
    }

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearFeedback();

      let firstInvalidField = null;

      const checkField = (field, isValid) => {
        const valid = setFieldValidity(field, isValid);
        if (!valid && !firstInvalidField) firstInvalidField = field;
        return valid;
      };

      const nameValid = checkField(nameInput, Boolean(nameInput && nameInput.value.trim().length >= 2));
      const emailValid = checkField(emailInput, Boolean(emailInput && isValidEmail(emailInput.value.trim())));
      const branchValid = checkField(branchInput, Boolean(branchInput && branchInput.value));
      const inquiryValid = checkField(inquiryInput, Boolean(inquiryInput && inquiryInput.value));
      const messageValid = checkField(messageInput, Boolean(messageInput && messageInput.value.trim().length >= 10));
      const formIsValid = nameValid && emailValid && branchValid && inquiryValid && messageValid;

      if (!formIsValid) {
        if (formFeedback) {
          formFeedback.textContent = 'Please correct the highlighted fields above.';
          formFeedback.classList.add('is-error');
        }
        if (firstInvalidField) firstInvalidField.focus();
        return;
      }

      const inquiryLabel = inquiryInput && inquiryInput.selectedIndex >= 0
        ? inquiryInput.options[inquiryInput.selectedIndex].textContent
        : 'inquiry';

      if (formFeedback) {
        formFeedback.innerHTML = `✓ Thank you, ${escapeHTML(nameInput.value.trim())}! Your ${escapeHTML(inquiryLabel.toLowerCase())} inquiry has been validated.`;
        formFeedback.classList.add('is-success');
      }

      contactForm.reset();
    });

    contactForm.querySelectorAll('.form_input, .form_select, .form_textarea').forEach(field => {
      const resetFieldState = () => {
        const group = field.closest('.form_group');
        if (group) group.classList.remove('invalid');
        field.removeAttribute('aria-invalid');
        if (formFeedback && formFeedback.textContent) clearFeedback();
      };

      field.addEventListener('input', resetFieldState);
      field.addEventListener('change', resetFieldState);
    });
  }

});
