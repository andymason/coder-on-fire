---
title: The Telegraph — Milton Figma to HTML plugin
tags:
  [Figma, Preact, React, TypeScript, JavaScript, HTML, CSS, Accessibility, Work]
thumbImage: /images/milton-social.png
description: Built Milton, an award-winning open-source Figma plugin in TypeScript and Preact that exports responsive, accessible HTML embeds for newsroom CMS workflows.
weight: 1
---

# {{ title }}

{%
  include "video",
  poster: "/video/milton-demo.png",
  src: "/video/milton-demo.mp4"
%}

While working as a Senior Prototyper at The Telegraph, I created Milton: an award-winning, open-source Figma plugin built with TypeScript and Preact. I built the tool so designers could export responsive, accessible HTML graphics directly from Figma into the newsroom CMS without needing a developer.

## The Challenge

In a daily newsroom, graphics need to go from concept to published article quickly—and often need updating as a story develops. Journalists could update text and basic charts in the CMS, but custom graphics, maps, and annotated diagrams required a developer to hand-code and embed them.

We wanted a way for designers to build, preview, and export their own responsive HTML embeds straight from Figma, producing self-contained code that could be pasted directly into the CMS.

## The Stack

- **TypeScript** for plugin logic, Figma AST traversal, and SVG/HTML processing
- **Preact** for the plugin UI and `preact-render-to-string` for generating the exported HTML markup
- **Figma Plugin API** for reading document nodes, persisting metadata, and exporting SVGs
- **Pica & UPNG.js** for in-browser Lanczos image resizing and PNG palette quantisation
- **esbuild** with a custom build script to bundle the sandbox backend and inline the UI into a single HTML payload

## The Solution

I started by looking at the New York Times' [ai2html](http://ai2html.org/), an open-source script that converts Adobe Illustrator artboards into HTML and CSS. It was a great reference, but didn't fit our workflow for two reasons:

1. Our design team worked in Figma, not Illustrator.
2. Our CMS couldn't host external asset folders for quick embeds—everything, including images, had to be self-contained within a single HTML snippet while staying small enough for the web.

<figure>
  <img src="/images/milton-frames.png" alt="Selecting frames in Figma for Milton">
  <figcaption>
    Selecting frames in Figma for Milton
  </figcaption>
</figure>

### Merging frames into a single responsive SVG

Designers already used separate Figma Frames to design for different screen sizes (mobile, tablet, desktop). Milton takes a selection of top-level frames and uses their widths as responsive breakpoints.

Exporting each frame as a separate SVG would have duplicated large background images across every breakpoint. Instead, during export, the plugin creates a temporary container frame in Figma, clones all selected frames into it, flattens any boolean groups, and exports the container as a single SVG before cleaning up the temporary nodes.

Because Figma exports the clones together, shared images are automatically deduplicated in the SVG `<defs>`. On the frontend, Milton rewrites all internal SVG IDs and `url(#...)` references (`clip-path`, `fill`, `stroke`, `mask`, and `xlink:href`) with unique suffixes so multiple embeds on the same article page never clash. Generated CSS media queries then toggle the visibility of each frame's group and adjust the aspect-ratio wrapper as the viewport width changes.

### Communicating across the Figma sandbox

Figma plugins are split into two contexts: a sandboxed main thread with access to the Figma document API, and an `iframe` running the UI. The two can only communicate via `postMessage`.

For simple plugins this is fine, but Milton needed to run multi-step asynchronous tasks—traversing nodes, extracting text styles, exporting SVGs, and saving plugin data—while keeping the UI responsive. To handle this cleanly, I wrote a lightweight promise-based RPC helper (`Postman`) over `postMessage`. It pairs requests and responses using generated UIDs with a timeout fallback, allowing the Preact UI to `await` backend tasks like normal async functions.

### Converting SVG text into accessible HTML overlays

Exporting text inside an SVG causes problems for responsive embeds: text scales awkwardly, wraps unpredictably, and isn't easily accessible to screen readers. To keep text sharp and accessible, Milton strips `<text>` elements out of the exported SVG and rebuilds them as positioned HTML elements overlaid on top of the graphic. (Text nodes are removed from the SVG DOM _after_ export rather than in Figma beforehand, so Figma Auto Layout frames don't collapse when their text is removed.)

Reconstructing styled text required solving a few quirks in the Figma API:

- **Relative positioning:** Nested text nodes in Figma have `x` and `y` coordinates relative to their immediate parent group or frame. I used each node's `absoluteTransform` matrix to calculate its position relative to the root frame, then converted those coordinates and dimensions into percentages so the HTML text scales fluidly with the underlying SVG.
- **Character-level styling:** Designers often bold a single word or change a colour mid-sentence, and Figma's API only exposes mixed styles per character. I wrote a parser that steps through each character, maps Figma's font style names to OpenType numeric weights (`100`–`950`), and merges adjacent characters with matching styles into `<span>` runs.
- **Automatic font loading:** By scanning all extracted text ranges across the selected frames, Milton collects the exact set of font families, weights, and italics used, and automatically builds a minimal Google Fonts `@import` rule.

<figure>
  <img src="/images/milton-breakpoints.png" alt="Previewing breakpoints in the Milton plugin">
  <figcaption>
    Previewing breakpoints in the Milton plugin
  </figcaption>
</figure>

### Optimising embedded images in the browser

Designers frequently drop high-resolution photos into Figma and scale them down visually. By default, Figma exports embedded images at their original dimensions, which can bloat a self-contained HTML embed to several megabytes.

To keep the output small enough to inline into the CMS, I built an image optimisation pipeline across the backend and UI:

1. **Dimension tracking:** Before export, the backend checks the `imageHash` of every image fill across all selected frames and records the largest display dimensions for each unique image.
2. **SVG pattern lookup:** Once exported, the frontend traces each SVG element's `fill="url(#...)"` reference through `<pattern>` and `<use>` tags to locate the underlying base64 `<image>`.
3. **2x Retina scaling:** If the source image is larger than needed, it's scaled down to 2× the maximum display dimensions in an offscreen `<canvas>` using Pica for high-quality Lanczos resampling.
4. **Compression & quantisation:** JPEGs are re-encoded at 75% quality, while PNGs and GIFs are quantised down to an indexed palette using UPNG.js before being cached and written back into the SVG.

### Interactive preview and newsroom workflow

To give designers confidence in the output before publishing, I built an interactive preview canvas inside the plugin. It renders the generated HTML inside a live `iframe` with pan and zoom controls, draggable corner handles to test fluid responsiveness between breakpoints, and a live file-size readout in KB.

Metadata such as headlines, subheads, source links, and target URLs are saved directly into the Figma page via `setPluginData`. When exported via `preact-render-to-string`, the HTML snippet includes a comment block at the top with a direct link back to the exact Figma file and node ID (`figma.com/file/...`), so any designer on shift could jump straight from the CMS back to the source file to make updates during breaking news.

Milton was released under the MIT licence in early 2022 and is available on the [Figma Community store][milton-plugin].

## Technical Contributions

- **Plugin architecture:** Built the Figma plugin in TypeScript and Preact, including a custom promise-based RPC bridge (`Postman`) over `postMessage` and an esbuild single-file bundler
- **Responsive SVG compiler:** Cloned and merged multi-frame breakpoints into a single deduplicated SVG, rewriting internal IRI references to prevent ID collisions and generating responsive CSS media queries
- **HTML text & accessibility:** Extracted character-level typography and `absoluteTransform` coordinates to replace SVG text with fluid, accessible HTML/CSS overlays and automated Google Fonts imports
- **In-browser image pipeline:** Built an asset pipeline using Canvas, Pica, and UPNG.js to resize images to 2× display bounds, compress JPEGs, and quantise PNG palettes
- **Interactive previewer:** Created a pan-and-zoom preview canvas with custom pointer-capture resize handles and persistent document metadata

[milton-plugin]: https://www.figma.com/community/plugin/844954779092514561/milton
