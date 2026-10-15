---
title: The Telegraph - Milton Figma to HTML plugin
tags:
  [Figma, Preact, React, TypeScript, JavaScript, HTML, CSS, Accessibility, Work]
thumbImage: /images/milton-social.png
description: Built Milton, an award-winning open-source Figma plugin in TypeScript and Preact that exports responsive, accessible HTML embeds for newsroom CMS workflows.
weight: -1
---

# {{ title }}

{%
  include "video",
  poster: "/video/milton-demo.png",
  src: "/video/milton-demo.mp4"
%}

While working as a Senior Prototyper at The Telegraph, I created Milton: an open-source Figma plugin built with TypeScript and Preact that won a newsroom innovation award. It allowed designers on the graphics desk to export responsive, accessible HTML embeds directly from Figma into the newsroom CMS without needing a developer.

## The Challenge

In a daily newsroom, graphics need to go from concept to published article quickly, and often need updating as a story develops. Journalists could update text and basic charts in the CMS, but custom graphics, maps, and annotated diagrams required a developer to hand-code and embed them.

We wanted a way for designers to build, preview, and export their own responsive HTML embeds straight from Figma, producing self-contained code that could be pasted directly into the CMS.

## The Stack

- **TypeScript** for plugin logic, Figma document traversal, and SVG/HTML processing
- **Preact** for the plugin UI and server-side string rendering for the exported HTML markup
- **Figma Plugin API** for reading document nodes, persisting metadata, and exporting SVGs across the plugin sandbox
- **Pica & UPNG.js** for in-browser Lanczos image resizing and PNG palette quantisation
- **esbuild** with a custom build script to bundle the sandbox backend and inline the UI into a single HTML payload

## The Solution

I started by looking at the New York Times' [ai2html](http://ai2html.org/), an open-source script that converts Adobe Illustrator artboards into HTML and CSS. It was a great reference, but didn't fit our workflow for two reasons:

1. Our design team worked in Figma, not Illustrator.
2. Our CMS couldn't host external asset folders for quick embeds. Everything, including images, had to be self-contained within a single HTML snippet while staying small enough for the web.

<figure>
  <img src="/images/milton-frames.png" alt="Selecting frames in Figma for Milton">
  <figcaption>
    Selecting frames in Figma for Milton
  </figcaption>
</figure>

### Merging frames into a single responsive SVG

Designers already used separate Figma frames to design for different screen sizes (mobile, tablet, desktop). Milton takes a selection of top-level frames and uses their widths as responsive breakpoints.

Exporting each frame as a separate SVG would have duplicated large background images across every breakpoint. Instead, during export, the plugin clones the selected frames into a temporary container in Figma, flattens any boolean shapes, and exports them together as a single SVG before cleaning up after itself.

Because Figma exports the clones together, shared images are automatically deduplicated in the SVG definitions. Milton then namespaces internal SVG IDs so multiple embeds on the same article page never clash, and generates CSS media queries to switch between frame groups and aspect ratios as the viewport width changes.

### Converting SVG text into accessible HTML overlays

Exporting text inside an SVG causes problems for responsive embeds: text scales awkwardly, wraps unpredictably, and isn't easily accessible to screen readers. To keep text sharp and accessible, Milton strips text elements out of the exported SVG and rebuilds them as positioned HTML elements overlaid on top of the graphic. (Text is removed from the SVG _after_ export rather than in Figma beforehand, so Figma Auto Layout frames don't collapse when their text is removed.)

Reconstructing styled text required solving a few quirks in how Figma stores typography:

- **Fluid positioning:** Nested text nodes in Figma have coordinates relative to their parent group. I used each node's transform matrix to calculate its position relative to the root frame, then converted those coordinates and dimensions into percentages so the HTML text scales fluidly with the underlying SVG.
- **Character-level styling:** Designers often bold a single word or change a colour mid-sentence. Milton steps through each character, maps font style names to standard numeric CSS weights, and merges adjacent characters with matching styles into clean HTML spans.
- **Automatic font loading:** By scanning all text across the selected frames, Milton collects the exact set of font families, weights, and italics used, and builds a minimal Google Fonts import rule automatically.

<figure>
  <img src="/images/milton-breakpoints.png" alt="Previewing breakpoints in the Milton plugin">
  <figcaption>
    Previewing breakpoints in the Milton plugin
  </figcaption>
</figure>

### Optimising embedded images in the browser

Designers frequently drop high-resolution photos into Figma and scale them down visually. By default, Figma exports embedded images at their original dimensions, which can bloat a self-contained HTML embed to several megabytes.

To keep the output small enough to paste straight into the CMS, I built an in-browser image optimisation pipeline. Before export, the plugin checks every image across the selected frames and records the largest dimensions it is actually displayed at. If a source image is larger than needed, the UI scales it down to 2× Retina display bounds in an offscreen canvas using Pica (Lanczos resampling), re-encodes JPEGs at 75% quality, and quantises PNGs down to an indexed colour palette using UPNG.js before writing the optimised base64 data back into the SVG.

### Interactive preview and newsroom workflow

To give designers confidence in the output before publishing, I built an interactive preview canvas inside the plugin. It renders the generated HTML inside a live preview with pan and zoom controls, draggable corner handles to test fluid responsiveness between breakpoints, and a live file-size readout in KB.

Metadata such as headlines, subheads, source links, and target URLs are saved directly into the Figma document. The exported HTML snippet also includes a comment at the top with a direct link back to the exact Figma file and frame, so any designer on shift could jump straight from the CMS back to the source file to make updates during breaking news.

Milton was released under the MIT licence in early 2022 and is available on the [Figma Community store][milton-plugin].

## Technical Contributions

- **Plugin architecture:** Built the Figma plugin in TypeScript and Preact, including a custom promise-based RPC bridge over `postMessage` and an esbuild single-file bundler
- **Responsive SVG compiler:** Cloned and merged multi-frame breakpoints into a single deduplicated SVG, namespacing internal IDs to prevent collisions and generating responsive CSS media queries
- **HTML text & accessibility:** Extracted character-level typography and transform coordinates to replace SVG text with fluid, accessible HTML/CSS overlays and automated Google Fonts imports
- **In-browser image pipeline:** Built an asset pipeline using Canvas, Pica, and UPNG.js to resize images to 2× display bounds, compress JPEGs, and quantise PNG palettes
- **Interactive previewer:** Created a pan-and-zoom preview canvas with draggable resize handles, live file-size metrics, and persistent document metadata

[milton-plugin]: https://www.figma.com/community/plugin/844954779092514561/milton
