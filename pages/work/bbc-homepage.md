---
title: BBC — Homepage Redesign
tags: [JavaScript, HTML, CSS, PHP, WAI, Accessibility, Work]
thumbImage: /images/bbc_homepage/bbc_homepage_front_1080x.jpg
description: Built WCAG AAA accessible UI components and prototypes for the BBC homepage redesign using JavaScript, BBC Glow, PHP, and CSS.
weight: 6
---

# {{ title }}

{%
  include "video",
  poster: "/video/bbc-homepage.jpg",
  src: "/video/bbc-homepage.mp4"
%}

As a front-end developer on the BBC homepage redesign, I built production UI components and interactive UX prototypes for one of the highest-traffic pages in the UK. My work included the main category-filtering carousel, section navigation, and the homepage directory listing, all built to BBC Global Experience Language (GEL) and WCAG AAA accessibility standards.

## The Challenge

The redesigned homepage centred around a visual, colour-coded carousel that let visitors browse and filter live content across BBC sections (News, Sport, iPlayer, Weather, and more).

Building UI at the BBC meant meeting some of the strictest front-end standards on the web:

- **Accessibility:** Everything had to meet W3C/WAI WCAG AAA guidelines, work with keyboard-only navigation, and make sense in screen readers and text-only browsers.
- **Browser and hardware support:** The page had to run smoothly on low-end machines and support a wide browser matrix stretching all the way back to Internet Explorer 6.
- **Scale and resilience:** Components pulled cached data from live BBC endpoints and had to degrade cleanly when JavaScript was unavailable.

## The Stack

- **JavaScript (BBC Glow & jQuery)** for interactive UI components, carousel animations, and asynchronous data fetching
- **PHP & HTML** for server-side rendering and progressive enhancement
- **CSS** for layout, colour-coded section theming, and cross-browser compatibility (including IE6)
- **BBC GEL (Global Experience Language)** for grid, typography, and interaction patterns
- **RPM** for packaging and production release management

## The Solution

### UX Prototyping and User Testing

Before writing production code, I worked closely with UX designers to explore how the new homepage interactions should feel. Rather than relying on static wireframes, I built multiple interactive variants of the UI so we could test different approaches to navigation and filtering.

We took these prototypes into usability lab sessions with real users, observed where people hesitated or got stuck, and fed those findings directly back into the production build.

### The Interactive Carousel and Page Navigation

My main focus in production was the interactive carousel, alongside the section navigation and the full directory listing at the bottom of the page.

I worked with the data teams to pull cached feeds from live endpoints into the carousel as users filtered between categories. Because the carousel animated large sets of imagery and cards, I had to tune the DOM updates and transitions so animations stayed smooth on low-spec hardware and older browsers, including IE6.

### WCAG AAA Accessibility, JAWS, and Lynx

Accessibility wasn't an afterthought—it shaped how every component was structured from the start.

Moving carousels are notoriously tricky for keyboard and assistive technology users. I managed focus state and `tabindex` behaviour so keyboard users could step through categories and carousel items in a predictable tab order without focus getting trapped on off-screen panels.

To verify compliance with the BBC's accessibility standards, I tested components across:

- **JAWS** screen reader to check announcements, heading hierarchy, and focus transitions
- **Lynx** (a text-only browser) to confirm the underlying PHP-rendered HTML remained logical and navigable without CSS or JavaScript

For production releases, code was packaged into RPMs and deployed through formal BBC change requests.

## Technical Contributions

- **UI components:** Built the homepage category carousel, section navigation, and footer directory listing following BBC GEL guidelines
- **UX prototyping:** Created multiple interactive prototypes for user testing sessions, iterating on the UI based on lab feedback
- **Accessibility (WCAG AAA):** Implemented keyboard navigation and tab-order management, testing in JAWS and the Lynx text browser
- **Cross-browser performance:** Tuned carousel animations for low-end hardware and full backwards compatibility down to IE6
- **Data integration & releases:** Integrated cached live data endpoints with backend teams and shipped production builds via RPM change requests
