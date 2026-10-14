---
title: The Guardian — 6x9 WebGL Website and 3D Editor
tags: [WebGL, Three.js, Shaders, 3D Graphics, Blender, JavaScript, CSS, Work]
thumbImage: /images/6x9-webgl-editor-social.jpg
description: Built the interactive WebGL promotional site and an in-browser 3D camera and shader editor for The Guardian's 6x9 virtual reality project.
weight: 3
---

# {{ title }}

{%
  include "video",
  poster: "/video/6x9-webgl-editor.jpg",
  src: "/video/6x9-webgl-editor.mp4"
%}

To launch [6x9][6x9-vr]—The Guardian's first virtual reality experience exploring the psychological effects of solitary confinement—I built [an interactive WebGL landing page][guardian-6x9-web] in Three.js. I also built an in-browser 3D scene editor so the creative director and I could choreograph camera movements and tune post-processing shaders together in real time.

## The Challenge

Because the full _6x9_ experience required a mobile app and a Google Cardboard headset, we needed a web page that could immediately convey the claustrophobia of a 6×9-foot solitary confinement cell in the browser, while guiding readers to download the app or watch the 360° video.

From an engineering perspective, the site had to:

- recreate the VR project's 3D prison cell in WebGL and run smoothly across desktop and mobile browsers
- match the visual tone of the VR piece using post-processing effects without tanking frame rates
- give a non-technical creative director a way to art-direct 3D camera paths, timings, and shader settings directly in the browser
- fall back cleanly on older browsers without WebGL support

## The Stack

- **Three.js (WebGL)** for 3D rendering, camera projection, and `EffectComposer` post-processing passes
- **GLSL Shaders** (`FXAAShader`, `RGBShiftShader`, `FilmPass`, `VignetteShader`) for anti-aliasing, chromatic aberration, film grain, and vignetting
- **Blender** (`io_three`) for polygon reduction, UV unwrapping, and baked texture atlases
- **Tween.js** for camera path, target, colour, and headline interpolation
- **dat.gui, OrbitControls & rStats** for the in-browser animation editor and real-time frame-time profiling
- **Mediator.js & Visibility.js** for pub/sub state coordination and render-loop lifecycle management

## The Solution

### Optimising the 3D Cell with Baked Texture Atlases

Starting from the high-polygon 3D assets created for the VR production, I rebuilt the cell for the web in Blender. I reduced the polygon count across all meshes and exported them as Three.js `BufferGeometry` JSON.

Rather than using expensive real-time lighting and shadow maps in the browser, I baked the lighting and ambient occlusion into two UV texture atlases and applied them to unlit `MeshBasicMaterial` meshes. To keep the concrete walls crisp at steep camera angles, I enabled anisotropic texture filtering scaled to the device's GPU capabilities.

### Post-Processing Shaders and Mobile Scaling

To give the scene the unsettling, gritty feel of the VR piece, I set up a multi-pass `THREE.EffectComposer` pipeline on desktop:

- **`FXAAShader`** for fast approximate anti-aliasing
- **`RGBShiftShader`** for subtle chromatic aberration
- **`FilmPass`** and **`VignetteShader`** for film grain and darkened edges

On mobile devices, running multiple full-screen fragment shader passes was too heavy, so the render loop bypassed the `EffectComposer` and rendered the scene directly. On desktop, I also added a subtle mouse-driven parallax controller that smoothed pointer coordinates damping and applied them as an offset to the camera.

### In-Browser 3D Camera and Shader Editor

Designing 3D camera movements through a static 2D workflow wasn't practical. Instead of guessing `x`, `y`, and `z` coordinates in code, I built an in-browser editor—enabled via `?debug` URL parameters—so the creative director and I could sit together and direct the shots live.

<figure>
  <img src="/images/6x9_webgl_editor.jpg" alt="In-browser WebGL animation editor showing wireframe helpers, rStats performance graphs, and dat.gui controls" width="960" height="540">
  <figcaption>
    The in-browser WebGL editor with wireframe helpers, rStats telemetry, and camera keyframe controls
  </figcaption>
</figure>

The editor overlaid Three.js helper guides onto the cell and used `OrbitControls` to fly the camera through the space. Using a custom `dat.gui` panel and a JSON import/export modal, we could:

- position the camera and click `setStartPosition` or `setEndPosition` to capture both the camera coordinates and `OrbitControls` `lookAt` target vectors
- jump between keyframes and preview the full `Tween.js` transition sequence in real time
- adjust transition durations, start/end material tint colours, and live shader uniforms
- export and reload the serialized JSON presets directly from the browser

### Performance Telemetry and Render Lifecycle

To make sure our camera moves and shader passes stayed within a 60fps budget (16ms per frame), I integrated `rStats` into the debug mode to graph both FPS (flagging drops below 30fps) and WebGL render duration in milliseconds.

In production, the page also hosted an embedded YouTube trailer and a 360° video player. Using a `Mediator.js` pub/sub event bus, `Visibility.js`, and throttled scroll listeners, the app automatically paused the WebGL `requestAnimationFrame` loop whenever the user scrolled past the header, switched browser tabs, or started playing a video. For browsers without WebGL support, the same `Tween.js` sequence gracefully fell back to crossfading pre-rendered stills of the cell.

## Technical Contributions

- **3D WebGL scene:** Built the Three.js prison cell scene, custom camera rig and non-WebGL fallback
- **3D asset optimisation:** Reduced polygon counts in Blender, exported `BufferGeometry` JSON, and baked lighting into UV texture atlases with anisotropic filtering
- **Post-processing pipeline:** Configured the desktop `EffectComposer` shader chain (`FXAA`, `RGBShift`, `FilmPass`, `Vignette`) with direct-render scaling on mobile
- **In-browser authoring tool:** Built the `?editor` mode with `OrbitControls`, `dat.gui`, wireframe/grid helpers, `rStats` frame-time profiling, and JSON preset import/export
- **Render lifecycle management:** Coordinated WebGL pause/resume states with scroll visibility, tab focus, and YouTube API video playback via a pub/sub event bus

[6x9-vr]: /work/the-guardian-6x9-virtual-reality
[guardian-6x9-web]: https://www.theguardian.com/world/ng-interactive/2016/apr/27/6x9-a-virtual-experience-of-solitary-confinement
