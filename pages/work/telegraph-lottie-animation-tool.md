---
title: The Telegraph - Lottie Animation Embed Tool
tags: [Lottie, SVG, Preact, After Effects, TypeScript, WebAssembly, CSS, Work]
thumbImage: /images/lottie-social.jpg
description: A web application built in TypeScript, Preact, and WebAssembly ImageMagick that lets Telegraph designers validate, optimise, preview, and export After Effects Lottie animations for the CMS.
weight: 5
---

# {{ title }}

{%
  include "video",
  poster: "/video/lottie.png",
  src: "/video/lottie.mp4"
%}

At The Telegraph, I built a browser-based tool in TypeScript and Preact that let video editors and designers turn Adobe After Effects animations (exported via Bodymovin/Lottie) into self-contained, responsive HTML embeds for the newsroom CMS.

## The Challenge

Editorial and design teams wanted to use more animated graphics, explainers, and data callouts inside articles. Previously, their only options were animated GIFs, which were huge and looked soft on high-DPI screens, or full video players, which were too heavy for short inline graphics.

Airbnb's Lottie library solved the rendering problem by playing After Effects vector animations directly as SVG in the browser, reminding me of the best parts of the old Flash vector workflow without the plugin overhead. However, designers had no safe way to get a raw Lottie JSON export from After Effects into The Telegraph's CMS:

- **Unoptimised assets:** After Effects exports often included oversized, uncompressed bitmap images or broken links to local files on the designer's machine.
- **No preview workflow:** Designers couldn't test how an animation would scale across Telegraph article breakpoints or behave when looping or autoplay was turned off.
- **CMS constraints:** The CMS needed a single, self-contained HTML snippet with no external file dependencies.

## The Stack

- **TypeScript & Preact** for the application UI and state management
- **Lottie (lottie-web)** for SVG animation playback, frame scrubbing, and runtime embed rendering
- **WebAssembly ImageMagick** for client-side image compression and PNG frame exports
- **esbuild** for fast bundling

## The Solution

### Validation Guardrails and In-Browser Image Compression

When a designer dropped a Lottie JSON file into the tool, it validated the file before rendering:

1. **Schema & version checks:** Verified the JSON structure and checked that the After Effects export version was supported.
2. **External asset detection:** Checked every asset layer to make sure no broken local file paths were referenced.
3. **Payload guardrails:** Flagged animations over our file-size budget or files containing too many bitmap images (where a video embed would be a better fit), displaying the estimated compressed size alongside the frame rate and duration.

When an animation did include embedded bitmap images, they were often exported from After Effects at full resolution. I integrated **WebAssembly ImageMagick** so the browser automatically extracted each embedded image on import, resized it down to sensible display bounds, stripped metadata, and compressed JPEGs or quantised PNGs to a 64-colour palette before writing the optimised images straight back into the Lottie data in memory.

### Timeline Scrubbing, Playback Controls, and Breakpoint Previews

Inside the editor view, designers could inspect and configure their animation before publishing:

- **Timeline scrubber:** Let designers play, pause, scrub through the timeline, or step forward and backward frame by frame to check transitions.
- **Playback settings:** Controls for autoplay, looping, playback direction, speed multipliers, and background colours.
- **Responsive & social viewports:** Preset viewports for Telegraph mobile, tablet, and desktop article widths, as well as social media aspect ratios, along with a live in-article preview surrounded by sample story copy.

### Self-Contained CMS Embeds and PNG Frame Export

Once configured, designers could copy the generated embed code directly to their clipboard or download it as a standalone HTML file. If autoplay or looping was turned off, the exported embed automatically included a replay button overlay when the animation finished.

Because editors also needed static fallback images and social thumbnails, I added a **PNG frame export**. Designers could scrub to any frame in the timeline and click Export to render the live SVG frame onto an HTML5 canvas, compress it via WebAssembly ImageMagick, and download a crisp PNG.

## Technical Contributions

- **Web application:** Designed and built the authoring tool in TypeScript, Preact, and esbuild
- **Lottie validation & guardrails:** Built schema validation, broken local asset detection, image-count warnings, and compressed payload estimation
- **WebAssembly image pipeline:** Integrated WebAssembly ImageMagick to automatically resize and quantise embedded raster layers in the browser
- **Preview & timeline tooling:** Built the frame-accurate timeline scrubber, playback controls, responsive breakpoint scaler, and live article preview
- **Self-contained HTML & PNG export:** Created the zero-dependency CMS embed generator and an SVG-to-Canvas PNG frame exporter
