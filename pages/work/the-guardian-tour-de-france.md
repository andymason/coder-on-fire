---
title: The Guardian - 3D Tour de France Visualisation
tags: [JavaScript, Three.js, WebGL, GIS, HTML, CSS, Work]
thumbImage: /images/tour_de_france/tour_de_france_mobile_screenshots_1920x.jpg
description: A 3D WebGL interactive of the Tour de France's Alpe d'Huez climb for The Guardian, combining GIS elevation data, satellite imagery, and an in-browser camera editor.
weight: 10
---

# {{ title }}

![Three screenshots of the 3D Tour de France mobile site](/images/tour_de_france/tour_de_france_mobile_screenshots_1080x.jpg)

For the 2015 Tour de France at The Guardian, I led the frontend development of an interactive guide to Alpe d'Huez, the race's famous 14km Alpine climb. Built with Three.js and WebGL, the piece takes readers up all 21 hairpin bends using satellite imagery, elevation data, and choreographed camera transitions.

## The Challenge

Alpe d'Huez is defined by its topography: 14km of steep gradients and 21 numbered switchbacks rising to 1,713m. A flat 2D map doesn't convey the scale or steepness of the ascent, so we wanted to reconstruct the mountain in 3D so readers could step through the climb and its history chapter by chapter.

To work for The Guardian's audience, the interactive had to:

- combine real-world elevation data, GPS tracks, and satellite imagery into an accurate 3D model
- download quickly and run smoothly on mobile devices with touch navigation
- provide a reliable fallback for older browsers and devices without WebGL support
- give our team a visual way to art-direct camera angles and transitions without hardcoding coordinates in JavaScript

## The Stack

- **Three.js (WebGL)** for 3D terrain rendering, lighting, and camera projection
- **QGIS** for combining Digital Elevation Models (DEM), GeoJSON routes, and contour layers
- **Blender & MessagePack** for mesh decimation and binary geometry compression
- **Tween.js** for interpolating camera paths, terrain extrusion, and layer opacities
- **dat.gui & OrbitControls** for the in-browser camera and scene editor
- **Hammer.js** for mobile swipe navigation

## The Solution

### From GIS Data to a Mobile-Ready 3D Mesh

We started in QGIS, combining a Digital Elevation Model (DEM) of the valley with satellite imagery and GeoJSON layers for the stage's GPS route, contour lines, and the coordinates and elevations of all 21 bends.

Raw terrain geometry exported from GIS data was far too dense to ship to mobile browsers. I imported the terrain mesh into Blender to reduce the polygon count while keeping the ridge lines and road switchbacks sharp.

<figure>
  <img src="/images/tour_de_france/tour_de_france_blender_1080x.png" alt="Using Blender to reduce the terrain polygon count" />
  <figcaption>
    Reducing the terrain mesh polygon count in Blender
  </figcaption>
</figure>

To shrink the payload further, I encoded the low-poly geometry into a compact binary MessagePack file. At runtime, the app decoded the binary mesh in the browser and loaded mobile- or desktop-sized satellite textures depending on the viewport to keep memory usage and load times down.

### Projecting 3D Hairpin Labels into the DOM

Text rendered inside a WebGL canvas can easily look blurry or become unreadable at steep camera angles. Instead of baking the 21 hairpin bend markers into 3D textures, I rendered them as sharp HTML elements layered over the canvas.

During camera transitions, the render loop projected each bend's 3D world position into 2D screen coordinates, updating the HTML labels on every frame and sorting their stacking order by distance from the camera so nearer bends naturally overlapped distant ones.

### In-Browser Camera and Animation Editor

Choreographing camera movements across a 14-chapter story by typing coordinates into code would have been slow and awkward. Instead, I built an in-browser scene editor so our team could direct the camera paths visually.

<figure>
  <img src="/images/tour_de_france/tour_de_france_web_editor_1080x.jpg" alt="In-browser camera and animation editor" />
  <figcaption>
    The in-browser editor used to frame camera views and save chapter presets
  </figcaption>
</figure>

Using the editor, we could fly around the mountain, frame each shot, and export the chapter presets to JSON. Each preset stored:

- camera position, rotation, and transition duration
- vertical terrain scale (allowing the mountain to start flat like a 2D map in the intro and extrude into 3D as the story began)
- individual layer opacities for the terrain, contour lines, GPS route, point-of-interest highlights, and HTML labels

At runtime, stepping forward or backward through the story via touch swipes, arrow keys, or on-screen buttons smoothly interpolated the camera and scene layers between the saved chapter presets, timed to match the narrative text fades.

### Graceful Non-WebGL Fallback

Before downloading any 3D assets, the app checked whether the device supported WebGL. If WebGL was unavailable, it skipped the 3D mesh and renderer entirely, preloaded responsive 2D fallback images for each chapter, and stepped through the story using simple opacity crossfades.

I also wrote a [detailed breakdown of the production process on Source][source-article], covering how we generated the terrain model and built the interactive on a newsroom deadline.

## Technical Contributions

- **3D WebGL development:** Built the Three.js scene, custom render loop, responsive field-of-view handling, and 3D-to-2D projected HTML labels
- **GIS & 3D asset pipeline:** Processed elevation and GeoJSON data in QGIS, optimised the terrain mesh in Blender, and implemented binary MessagePack loading with responsive textures
- **Animation & authoring tools:** Built the in-browser camera and layer editor to drive scene transitions from exported JSON presets
- **Mobile UX & fallback:** Implemented touch swipe navigation and the non-WebGL 2D image crossfade fallback

[source-article]: https://source.opennews.org/articles/how-we-made-3d-tour-de-france/
