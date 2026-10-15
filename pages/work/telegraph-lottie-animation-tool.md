---
title: The Telegraph — Lottie Animation Embed Tool
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

At The Telegraph, I built a browser-based tool that let video editors and designers turn Adobe After Effects animations (exported via Bodymovin/Lottie) into self-contained, responsive HTML embeds for the newsroom CMS.

## The Challenge

Editorial and design teams wanted to use more animated graphics, explainers, and data callouts inside articles. Previously, their only options were animated GIFs—which were huge and looked soft on high-DPI screens—or full video players, which were too heavy for short inline graphics.

Airbnb's Lottie (`lottie-web`) solved the rendering problem by playing After Effects vector animations directly as SVG in the browser, reminding me of the best parts of the old Flash vector workflow without the plugin overhead. However, designers had no way to get a raw Bodymovin `.json` file from After Effects into The Telegraph's CMS safely:

- **Unoptimised assets:** After Effects exports often included oversized, uncompressed base64 raster images or broken links to local files on the designer's machine.
- **No preview workflow:** Designers couldn't test how an animation would scale across Telegraph article breakpoints or behave when looping/autoplay was turned off.
- **CMS constraints:** The CMS needed a single, self-contained HTML snippet with no external file dependencies.

## The Stack

- **TypeScript & Preact** for the application UI and state management (**Unistore**)
- **lottie-web** for SVG animation playback, frame scrubbing, and runtime embed rendering
- **wasm-imagemagick (WebAssembly)** for client-side raster asset compression and PNG frame exports
- **esbuild** for fast bundling

## The Solution

### Validation Guardrails and In-Browser WASM Image Compression

When a user loaded a Lottie `.json` file via the `FileReader` API, the app validated the data before rendering:

1. **Schema & version checks:** Verified the JSON structure (`v`, `fr`, `w`, `h`, `layers`, `assets`) and checked that the Bodymovin export version was supported.
2. **External asset detection:** Checked every entry in `assets` to make sure no external local file paths were referenced.
3. **Payload guardrails:** Flagged files over the size threshold or animations containing more than five raster images (where a video embed would be more appropriate), and calculated both the raw KB size and estimated gzip payload alongside frame rate and duration.

When an animation did include embedded base64 raster images (`data:image/*`), they were often exported from After Effects at full resolution. I integrated **WebAssembly ImageMagick** (`wasm-imagemagick`) to automatically extract each base64 asset on import, resize it down to a `420px` maximum width, strip metadata, and compress JPEGs or quantise PNGs to 64-colour `PNG8`—writing the optimised data URLs straight back into the Lottie JSON structure in memory.

### Timeline Scrubbing, Playback Controls, and Breakpoint Previews

Inside the editor view, designers could inspect and configure their animation before exporting:

- **Timeline scrubber:** Hooked into Lottie's `enterFrame` events so users could play, pause, scrub through the timeline, or step forward and backward frame by frame to check transitions.
- **Playback configuration:** Toggles for `autoPlay`, `loop`, playback direction, speed multipliers, and optional background colours.
- **Responsive & social viewports:** Preset viewports for Telegraph article column widths (`304px` mobile, `464px` tablet, `610px` desktop), mobile devices, and social media aspect ratios (Twitter, Instagram, Snapchat), dynamically scaled to fit the editor canvas using CSS transforms.
- **In-article preview:** A dedicated preview tab that rendered the generated embed code inside an auto-resizing `<iframe srcDoc>` surrounded by sample article copy.

### Self-Contained CMS Embeds and PNG Frame Export

Once configured, designers could copy the generated embed code directly to their clipboard or download it as a standalone `.html` file.

To keep the exported snippet self-contained and typed cleanly inside the codebase, I wrote the runtime player logic as a TypeScript function and serialised it via `.toString()` into an IIFE inside the HTML template, passing the compressed Lottie JSON and playback parameters as arguments. If `autoPlay` or `loop` was disabled, the embed automatically wired up a replay button overlay when the animation finished.

Because editors also needed static fallback images or social thumbnails, I added a **PNG frame export**. Scrubbing to any frame and clicking Export serialised the live `<svg>` node via `XMLSerializer`, drew it onto an HTML5 `<canvas>`, and ran the resulting blob through `wasm-imagemagick` to download an optimised PNG.

## Technical Contributions

- **Web application:** Designed and built the tool in TypeScript, Preact, Unistore, and esbuild
- **Lottie validation & stats:** Built JSON schema validation, external asset detection, image-count guardrails, and gzip payload estimation
- **WebAssembly image pipeline:** Integrated `wasm-imagemagick` to automatically resize and quantise base64 raster layers inside Lottie JSON files and compress exported PNG frames
- **Preview & timeline tooling:** Built the frame-accurate timeline scrubber, playback controls, responsive breakpoint scaler, and `<iframe srcDoc>` article preview
- **Self-contained HTML & PNG export:** Created the zero-dependency CMS embed generator (`lottie_light.min.js` + serialised IIFE runtime) and `<svg>`-to-`<canvas>` PNG frame exporter
