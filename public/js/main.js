/* ==========================================================================
   ALICIA'S SPECIAL BATCHOY - VANILLA JAVASCRIPT LOGIC
   Features:
   1. Interactive Mobile Navigation Toggle
   2. Real-Time Menu Search Bar & Category Filter (our_menu.html)
   3. Client-Side Contact Form Validation (contact_us.html)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // Feature 1: Mobile Hamburger Navigation Toggle
  // ------------------------------------------------------------------------
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

  // ------------------------------------------------------------------------
  // Feature 2: Unified Live Search + Category Filter (our_menu.html)
  // ------------------------------------------------------------------------
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
      const searchText = `${card.getAttribute('data-title') || ''} ${titleText}`.toLowerCase();

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

  // Category filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeCategory = btn.getAttribute('data-filter');
      filterMenuItems();
    });
  });

  // Live search input
  if (searchInput) {
    searchInput.addEventListener('input', filterMenuItems);
  }

  // Clear search button
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        filterMenuItems();
        searchInput.focus();
      }
    });
  }

  // ------------------------------------------------------------------------
  // Feature 3: Client-Side Contact Form Validation (contact_us.html)
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contact_form');
  const formFeedback = document.getElementById('form_feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById('user_name');
      const emailInput = document.getElementById('user_email');
      const branchSelect = document.getElementById('user_branch');
      const messageInput = document.getElementById('user_message');

      const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      if (!nameInput.value.trim()) {
        setError('group_name');
        isValid = false;
      } else {
        clearError('group_name');
      }

      if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
        setError('group_email');
        isValid = false;
      } else {
        clearError('group_email');
      }

      if (!branchSelect.value) {
        setError('group_branch');
        isValid = false;
      } else {
        clearError('group_branch');
      }

      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        setError('group_message');
        isValid = false;
      } else {
        clearError('group_message');
      }

      if (isValid) {
        formFeedback.style.color = 'var(--primary_green)';
        formFeedback.innerHTML = `✓ Thank you, ${escapeHTML(nameInput.value.trim())}! Your inquiry has been validated. (Demonstration feedback for CCS 222 Project).`;
        contactForm.reset();
      } else {
        formFeedback.style.color = 'var(--accent_pink)';
        formFeedback.textContent = 'Please correct the highlighted fields above.';
      }
    });
  }

  function setError(groupId) {
    const group = document.getElementById(groupId);
    if (group) group.classList.add('invalid');
  }

  function clearError(groupId) {
    const group = document.getElementById(groupId);
    if (group) group.classList.remove('invalid');
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

});
