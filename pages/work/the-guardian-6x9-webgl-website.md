---
title: The Guardian's Virtual Reality WebGL website
tags: [WebGL, Three.js, Shaders, 3D Graphics, Blender, JavaScript, CSS, Work]
thumbImage: /images/6x9-webgl-editor-social.jpg
description: In-browser 3D animation editor built for the WebGL version of the Guardian's
  6x9 virtual reality experience.
weight: 3
---

# {{ title }}

{%
  include "video",
  poster: "/video/6x9-webgl-editor.jpg",
  src: "/video/6x9-webgl-editor.mp4"
%}

## The Challenge

To complement The Guardian's VR Google Cardboard experience and motivate users
to try the app, a promotional website was essential. The site needed to showcase
the innovative aspects of the project and the unique use of 3D graphics in
storytelling.

## Solution

With access to the art assets from the VR experience, I recreated a prison cell
in the browser using three.js and WebGL. This involved reducing the polygon
count of the 3D assets with Blender and optimising the UV textures for enhanced
performance.

To evoke the unsettling ambiance of the VR journey, I utilized GLSL shaders that
added grain, chromatic aberration, and vignetting, mimicking the gritty realism
of film.

### Real-Time Collaboration and Optimization

Given the unique nature of this project, a standard 2D design process was
impractical, close collaboration with the creative director was needed. To
streamline this process, I built an in-browser real-time editor. This tool
allowed us to interactively tweak camera angles, refine animation timings, and
adjust shader values, ensuring the scene conveyed the exact emotions we
envisioned.

<figure>
  <img src="/images/6x9_webgl_editor.jpg" alt="WebGl editor screenshot" width="960" height="540">
  <figcaption>
    WebGL animation editor
  </figcaption>
</figure>

Performance monitoring was a key aspect, integrated within the editor through a
frame rate monitor graph. This feature was instrumental in maintaining optimal
performance across various devices.

The website's launch was successful, encouraging app installations and
increasing awareness about the individuals highlighted in the story.
