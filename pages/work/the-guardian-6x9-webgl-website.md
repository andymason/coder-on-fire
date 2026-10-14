---
title: The Guardian — 6x9 WebGL website and 3D editor
tags: [WebGL, Three.js, Shaders, 3D-Graphics, Blender, JavaScript, CSS, Work]
thumbImage: /images/6x9-webgl-editor-social.jpg
description: Built the interactive WebGL promotional site and an in-browser 3D camera and shader editor for The Guardian's 6x9 virtual reality project.
weight: -1
---

# {{ title }}

{%
  include "video",
  poster: "/video/6x9-webgl-editor.jpg",
  src: "/video/6x9-webgl-editor.mp4"
%}

To accompany [6x9][6x9-vr]—The Guardian's first virtual reality piece on the psychological toll of solitary confinement—I built [an interactive WebGL experience][guardian-6x9-web] in Three.js. I also built an in-browser 3D camera and shader editor so the creative director and I could choreograph camera movements and tune post-processing effects together in real time.

## The Challenge

Because the full _6x9_ experience required downloading a mobile app and using a Google Cardboard headset, most readers on `theguardian.com` first encountered the project on the web. We needed an interactive landing page that placed readers inside the 6×9-foot supermax cell directly in their browser, before guiding them to the mobile app or the 360-degree video.

From an engineering perspective, the site had to:

- take the high-polygon 3D cell assets produced by The Mill and optimise them to run in WebGL across desktop and mobile browsers
- echo the sensory distortion of the VR piece using post-processing shaders while staying within a 60fps frame budget
- give a non-technical creative director a way to art-direct 3D camera paths, timings, and shader values live in the browser
- fall back cleanly on older browsers without WebGL support

## The Stack

- **Three.js (WebGL)** for 3D rendering, camera projection, and `EffectComposer` post-processing passes
- **GLSL Shaders** (`FXAAShader`, `RGBShiftShader`, `FilmPass`, `VignetteShader`) for anti-aliasing, chromatic aberration, film grain, and vignetting
- **Blender** for polygon reduction, UV unwrapping, baked lighting atlases, and Three.js `BufferGeometry` exports
- **Tween.js** for interpolating camera positions, look-at targets, material tints, and headline transitions
- **dat.gui, OrbitControls & rStats** for the in-browser authoring tool and real-time frame-time profiling
- **Mediator.js & Visibility.js** for pub/sub state coordination and render-loop lifecycle management

## The Solution

### Optimising the 3D Cell with Baked Texture Atlases

Starting from the high-polygon 3D models created by The Mill for the VR build, I rebuilt the cell for the web in Blender. I reduced the polygon count across all meshes and exported them as Three.js `BufferGeometry` JSON.

Rather than calculating expensive real-time lighting and shadow maps in the browser, I baked the lighting and ambient occlusion into two UV texture atlases and applied them to unlit `MeshBasicMaterial` meshes. To keep the cell walls crisp at steep camera angles, I enabled anisotropic texture filtering scaled to the device's maximum GPU capabilities.

### Post-Processing Shaders and Mobile Scaling

In the VR experience, formerly incarcerated interviewees describe how spending 23 hours a day in isolation distorts vision and perception. To reflect that unsettling atmosphere in the browser, I set up a multi-pass `THREE.EffectComposer` pipeline on desktop:

- **`FXAAShader`** for fast approximate anti-aliasing
- **`RGBShiftShader`** for subtle chromatic aberration at the edges of vision
- **`FilmPass`** and **`VignetteShader`** for film grain and claustrophobic darkened borders

On mobile devices, running multiple full-screen fragment shader passes was too heavy for mobile GPUs, so the render loop bypassed the `EffectComposer` and rendered the scene directly. On desktop, I also added a mouse-driven parallax controller that smoothed pointer movement with damping and applied it as a subtle offset to the camera.

### In-Browser 3D Camera and Shader Editor

Choreographing 3D camera paths through a static 2D design process wasn't practical. Instead of guessing `x`, `y`, and `z` coordinates in code, I built an in-browser authoring mode—toggled via `?editor` and `?debug` URL parameters—so the creative director and I could sit together and direct the shots live.

<figure>
  <img src="/images/6x9_webgl_editor.jpg" alt="In-browser WebGL animation editor showing wireframe helpers, rStats performance graphs, and dat.gui controls" width="960" height="540">
  <figcaption>
    The in-browser WebGL editor with wireframe helpers, rStats telemetry, and camera keyframe controls
  </figcaption>
</figure>

The editor overlaid Three.js wireframe and grid helpers onto the cell and unlocked `OrbitControls` so we could fly the camera freely around the room. Using a custom `dat.gui` panel and a JSON import/export modal, we could:

- fly to a view and capture start and end keyframes for both camera coordinates and `lookAt` target vectors
- scrub between keyframes and preview the full `Tween.js` camera and text sequence in real time
- adjust transition durations, easing curves, start/end material tint colours, and live shader uniforms
- export and reload serialised JSON scene presets directly from the browser

### Performance Telemetry and Render Lifecycle

To verify that our camera transitions and shader passes stayed within a 60fps budget (16.6ms per frame), the `?debug` mode integrated `rStats` to graph both frame rate (flagging drops below 30fps) and WebGL render duration in milliseconds.

In production, the page also hosted an embedded YouTube documentary trailer and the 360° video edition. Using a `Mediator.js` pub/sub event bus, `Visibility.js`, and throttled scroll listeners, the app automatically paused the WebGL `requestAnimationFrame` loop whenever the reader scrolled past the 3D header, switched browser tabs, or played a video. For older browsers without WebGL support, the same `Tween.js` timeline gracefully fell back to crossfading pre-rendered stills of the cell.

## Technical Contributions

- **3D WebGL scene:** Built the Three.js prison cell experience, damped pointer-parallax camera rig, and non-WebGL image fallback
- **3D asset optimisation:** Reduced polygon counts in Blender, exported `BufferGeometry` JSON, and baked lighting into UV texture atlases with anisotropic filtering
- **Post-processing pipeline:** Configured the desktop `EffectComposer` shader chain (`FXAA`, `RGBShift`, `FilmPass`, `Vignette`) with direct-render scaling on mobile
- **In-browser authoring tool:** Built the `?editor` and `?debug` modes with `OrbitControls`, `dat.gui`, wireframe/grid helpers, `rStats` frame-time profiling, and JSON preset import/export
- **Render lifecycle management:** Coordinated WebGL pause/resume states with scroll visibility, tab focus, and YouTube API video playback via a pub/sub event bus

[6x9-vr]: /work/the-guardian-6x9-virtual-reality/
[guardian-6x9-web]: https://www.theguardian.com/world/ng-interactive/2016/apr/27/6x9-a-virtual-experience-of-solitary-confinement
