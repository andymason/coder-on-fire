---
title: Milton Figma HTML Export Plugin
tags: [Figma, React, TypeScript, JavaScript, HTML, CSS, Accessibility, Work]
thumbImage: /images/milton-social.png
description: This open-source Figma plugin, Milton, gives designers the power to
  craft and export responsive HTML embeds for effortless integration into
  any CMS.
weight: 1
---

# Building Milton: Bridging the Gap Between Design and Development

{%
  include "video",
  poster: "/video/milton-demo.png",
  src: "/video/milton-demo.mp4"
%}

## The Challenge

In the fast-paced world of newsrooms, agility is key. Quick updates to text,
maps, and data figures are all handled seamlessly within the Content Management
System (CMS). However, custom HTML embeds required developer intervention,
slowing down the process and hindering the creation of unique graphical
elements.

The Telegraph's product team sought a solution to empower designers to create
and manage their own graphical embeds, seamlessly integrated into the existing
workflow and easily insertable into the CMS.

## The Solution

My initial exploration led me to AI2HTML, a plugin for Adobe Illustrator
exporting artboards to HTML. However, it didn't fit our needs perfectly.
Firstly, it targeted Illustrator, while our designers used Figma. Secondly, our
CMS didn't support embedding external files, necessitating baked-in images and
static assets within the exported HTML.

Therefore, I needed a Figma-centric solution.

<figure>
  <img src="/images/milton-frames.png" alt="Selecting frames in Figma for Milton" width="1280" height="720">
  <figcaption>
    Selecting frames in Figma for Milton
  </figcaption>
</figure>

### Leveraging Figma's Frames

Like Illustrator, Figma utilizes "Frames" as artboards. Designers already
employed these to represent different browser breakpoints. I envisioned
harnessing these frames to create responsive embeds that adapt to the browser's
width.

The key innovation was merging each frame's exported SVG into a single master
SVG. This allowed for de-duplication of common assets, like the largest shared
image. Additionally, CSS media queries could selectively display specific frames
based on the viewport width.

### Unleashing the Power of the Figma Plugin API

Aware of Figma's Plugin API capabilities, I realised its potential to create the
desired plugin. Figma plugins consist of two parts: a backend with internal API
access and a user-facing frontend. While the postMessage API facilitated
communication between these halves for simple tasks, its limitations became
evident.

Therefore, I developed a custom helper tool, "[postman][postman]", acting as an
asynchronous message bus. This enabled me to maintain the user interface's
responsiveness while awaiting completion of longer backend API calls.

### Tackling Text Formatting and Image Optimization

Reconstructing complex text formatting into HTML posed another challenge. To
prevent scaling issues and improve accessibility, all SVG text elements needed
conversion to HTML. Unfortunately, Figma's API lacked a convenient method to
extract text element styles. While designers could modify individual letter
colours, fonts, and sizes, the API only supported per-character access.

To overcome this, I iteratively looped through each character, building a map of
applied styles. This map then guided the recreation of styles using HTML and
CSS.

<figure>
  <img src="/images/milton-breakpoints.png" alt="Previewing breakpoints in the Milton plugin" width="1175" height="770">
  <figcaption>
    Previewing breakpoints in the Milton plugin
  </figcaption>
</figure>

High-resolution images, commonly used by designers but visually shrunk down,
presented another hurdle. Figma's export of embedded SVG images in their
original size, suitable for print, posed a web performance concern. Resizing and
optimising images for web delivery was crucial.

I achieved image optimisation through the following steps:

1. Image Format: Determining the image format (JPEG, PNG, etc.)
2. Largest Element Dimension: Finding the largest dimension of any SVG element
   using the image
3. Image Size Check: If the image exceeded the largest element size:
4. Scaling Down: Scaling the image to match the largest element size
5. Format Optimisation:
   - JPEGs: Setting quality to 75
   - GIFs and PNGs: Quantization into 175-colour index versions

These adjustments, along with other optimisations, resulted in final file sizes
small enough for CMS embedding.

### Empowering Designers, Streamlining Workflows

Milton proved a game-changer for designers, enabling them to focus on their work
without constant developer involvement for minor changes. It also fostered a
closer link between embeds and their original Figma designs. Each export
contained the Figma document URL, allowing future designers to directly access,
modify, and re-export the HTML.

### Open-Source and Accessible

Milton was released under the open-source MIT licence in early 2022 and is
readily available on both [GitHub][milton-github] and the
[Figma plugin store][milton-plugin].

[postman]: https://github.com/telegraph/milton/blob/master/src/utils/messages.ts#L14=
[milton-images]: https://github.com/telegraph/milton/blob/master/src/frontend/imageHelper.ts#L110=
[milton-github]: https://github.com/telegraph/milton
[milton-plugin]: https://www.figma.com/community/plugin/844954779092514561/milton
