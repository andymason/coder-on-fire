---
title: The Telegraph - Scroll-triggered storytelling
tags: [JavaScript, TypeScript, HTML, CSS, Animation, Work]
thumbImage: /images/telegraph-scrollytelling/scrollytelling-demo.jpg
description: Built a scroll-triggered visual storytelling system and in-browser prototyping editor at The Telegraph, winning an SND award for "A Year in Lockdown".
weight: 6
---

# {{ title }}

{%
  include "video",
  poster: "/video/scrollytelling-demo.jpg",
  src: "/video/scrollytelling-demo.mp4"
%}

While working as a Senior Prototyper at The Telegraph, I collaborated with product designers and the picture desk to build a scroll-triggered visual storytelling format for long-form journalism. The first piece built with the system, [“A Year in Lockdown”][lockdown], achieved over 100,000 views, a 15-minute average dwell time, and won a Society for News Design (SND) award.

## The Challenge

The Telegraph produces strong photojournalism, but standard article templates treated images as static breaks between paragraphs. For major visual features, the editorial team wanted an immersive, full-screen narrative format where photography, video, and text worked together as the reader scrolled.

The main constraint was the Content Management System (Adobe Experience Manager). Building bespoke, standalone microsites for every visual story took too much developer time and pulled journalists out of their normal publishing workflow. We needed a way for editors to write and manage stories inside the standard CMS while delivering an interactive experience on the frontend.

## The Stack

- **Vanilla TypeScript** for zero-dependency DOM enhancement and scroll state
- **IntersectionObserver API** for triggering image crossfades and viewport-aware video playback
- **CSS Grid & Sticky Positioning** for responsive split-screen, full-bleed, and stacking text layouts
- **esbuild** to bundle the runtime script and CSS into a single self-contained payload
- **FFmpeg & ImageMagick** for batch-optimising desktop/mobile video loops, blurred poster frames, and photography

## The Solution

### Progressive enhancement inside the CMS

Instead of bypassing the CMS, I designed the system as a lightweight script that progressively enhanced standard long-form articles at runtime.

Journalists wrote copy and uploaded images in the CMS as normal. To turn a section into a scroll-triggered sequence, they placed a small HTML marker at the top of the block configuring the layout mode (such as full-bleed or split-screen) and background colour. When the page loaded, the script located these markers, promoted standard article figures to full-bleed containers, and applied the scroll layout styles. If JavaScript failed or was disabled, the page fell back to a clean, readable standard article.

### Tuning the feel with an in-browser editor

Getting the pacing right on a scroll-driven story is hard to do in static design tools. Small changes to scroll distances, transition durations, or easing curves completely change the mood, from slow, sombre crossfades to sharper, high-contrast cuts.

Before building the production CMS script, I created an in-browser prototyping editor so the designer and I could experiment with the feel in real time.

<figure>
  <picture>
    <img src="/images/scrolling-social.jpg" alt="Screenshot of in-browser editor" />
  </picture>
  <figcaption>
    The in-browser editor with live controls for typography, panel spacing, transition timing, and viewport trigger lines.
  </figcaption>
</figure>

The editor overlaid a pixel ruler and viewport trigger guides over the page, with a live control panel to tweak caption typography, scroll panel heights, transition durations, and easing curves on the fly.

### Sticky layouts and scroll triggers

Rather than using heavy scroll-jacking libraries that hijack native scrolling, the production system relied on native CSS sticky positioning combined with `IntersectionObserver`:

- **Viewport-edge crossfades:** An observer tracked when each section crossed a trigger line in the viewport, smoothly crossfading stacked full-screen photography as the reader scrolled.
- **Responsive split-screen & stacking text:** On mobile, text cards floated over full-bleed photography. On desktop screens, CSS Grid and sticky positioning split the screen, pinning photography to one side while short lines of text scrolled up and stacked alongside it.
- **Viewport-aware video & mobile app support:** A second observer automatically played and paused ambient background video loops as they entered and left the screen, swapping in portrait-cropped video sources on mobile devices and working around autoplay and compositing quirks inside The Telegraph's native iOS app.

### Impact

The format launched with [“A Year in Lockdown”][lockdown], a visual retrospective marking the first anniversary of the UK's Covid-19 lockdown. The piece drew over 100K views with an average dwell time of 15 minutes (well above standard article engagement) and won an award from the Society for News Design (SND).

## Technical Contributions

- **CMS progressive enhancement:** Built a zero-dependency TypeScript and CSS enhancement layer that transformed standard CMS articles into scroll-driven stories
- **Prototyping tooling:** Created an in-browser GUI editor with visual viewport guides to test scroll spacing, typography, and animation curves with designers in real time
- **Scroll & layout architecture:** Implemented native CSS sticky crossfades, split-screen stacking text layouts, and viewport-triggered video playback using `IntersectionObserver`
- **Cross-platform compatibility & media pipeline:** Handled iOS Safari and native app WebView quirks, and wrote FFmpeg and ImageMagick scripts to compress responsive video and photo assets

[lockdown]: https://www.telegraph.co.uk/news/0/coronavirus-lockdown-year-anniversary-photos/
