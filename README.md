Frontend Web Showcase

A multi-page static website built to demonstrate modern web design principles, structured layouts, and modular styling.

About: Overview and background information of Igbaras and the resort location.
Services: Detailed breakdown of core offerings and services.
Gallery: Visual media showcase of the resort.
Contact: Interactive touchpoint for custom user inquiries.

We only used HTML, CSS, and a little bit of java script to prevent whole page reload for form submission.

Project Structure

 /css/ - Global styles and page-specific stylesheets (about.css, contact.css, gallery.css, services.css)
 /assets/ - Project image assets and media
 index.html - Primary landing page

Here's the GitHub repository for more details: https://github.com/scrappyucoco/WebDev_Project.git

Authors:

Lance Bervi T. Nono - BSCS-2B
Rembrandt M. Monteclaro - BSCS-2B

## Google Places API setup

1. Create a browser/API-restricted Google Places API key.
2. Enable **Places API (New)** in the Google Cloud project associated with the key.
3. Paste the key into the `google-places-api-key` meta tag in `public/contact_us.html`.
4. Open the static HTML through any static host or Vercel.

The browser JavaScript requests Google Places API directly. This project uses no Node.js runtime, backend, package manager, library, or framework.
