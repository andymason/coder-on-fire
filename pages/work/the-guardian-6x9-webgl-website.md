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

To accompany [6x9][6x9-vr]—The Guardian's first virtual reality piece on the psychological toll of solitary confinement—I built [an interactive WebGL experience][guardian-6x9-web] in Three.js, along with a custom in-browser 3D camera and shader editor so the creative director and I could choreograph camera movements and tune visual effects together in real time.

## The Challenge

Because the full _6x9_ experience required downloading a mobile app and using a Google Cardboard headset, most readers on `theguardian.com` first encountered the project on the web. We needed an interactive landing page that placed readers inside the 6×9-foot supermax cell directly in their browser, before guiding them to the mobile app or the 360-degree video.

From an engineering perspective, the site had to:

- take the high-polygon 3D cell assets produced by The Mill and optimise them to run smoothly in WebGL across desktop and mobile browsers
- echo the sensory distortion of the VR piece using post-processing shaders while staying within a 60fps frame budget
- give a non-technical creative director a way to art-direct 3D camera paths, timings, and shader effects live in the browser
- fall back cleanly on older browsers without WebGL support

## The Stack

- **Three.js (WebGL)** for 3D rendering, camera projection, and post-processing passes
- **GLSL Shaders** for fast anti-aliasing, chromatic aberration, film grain, and vignetting
- **Blender** for polygon reduction, UV unwrapping, baked lighting atlases, and Three.js geometry exports
- **Tween.js** for interpolating camera positions, look-at targets, material tints, and headline transitions
- **dat.gui, OrbitControls & rStats** for the in-browser authoring tool and real-time frame-time profiling
- **Mediator.js & Visibility.js** for pub/sub state coordination and render-loop lifecycle management

## The Solution

### Optimising the 3D Cell with Baked Texture Atlases

Starting from the high-polygon 3D models created by The Mill for the VR build, I rebuilt the cell for the web in Blender, reducing the polygon count across all meshes and exporting them as lightweight Three.js geometry.

Rather than calculating expensive real-time lighting and shadow maps in the browser, I baked the lighting and ambient occlusion into two UV texture atlases and applied them to unlit meshes. To keep the cell walls crisp at steep camera angles, I enabled anisotropic texture filtering scaled to the device's GPU capabilities.

### Post-Processing Shaders and Mobile Scaling

In the VR experience, formerly incarcerated interviewees describe how spending 23 hours a day in isolation distorts vision and perception. To reflect that unsettling atmosphere in the browser, I set up a multi-pass post-processing shader pipeline on desktop:

- **Fast anti-aliasing** to keep hard geometric edges clean
- **Chromatic aberration** to introduce subtle colour separation at the edges of vision
- **Film grain and vignetting** to add texture and claustrophobic darkened borders

Because running multiple full-screen fragment shader passes was too heavy for mobile GPUs, the mobile render loop bypassed the post-processing chain and rendered the scene directly. On desktop, I also added a damped mouse-parallax controller that applied pointer movement as a subtle offset to the camera.

### In-Browser 3D Camera and Shader Editor

Choreographing 3D camera paths through a static 2D design process wasn't practical. Instead of guessing coordinates in code, I built an in-browser authoring mode—toggled via URL parameters—so the creative director and I could sit together and direct the shots live.

<figure>
  <img src="/images/6x9_webgl_editor.jpg" alt="In-browser WebGL animation editor showing wireframe helpers, rStats performance graphs, and dat.gui controls" width="960" height="540">
  <figcaption>
    The in-browser WebGL editor with wireframe helpers, rStats telemetry, and camera keyframe controls
  </figcaption>
</figure>

The editor overlaid wireframe and grid helpers onto the cell and unlocked free-flight camera controls so we could move around the room. Using a custom control panel and a JSON import/export modal, we could:

- fly to any angle and capture start and end keyframes for both the camera position and its target focal point
- scrub between keyframes and preview the full camera and text sequence in real time
- adjust transition durations, easing curves, material tint colours, and live shader settings
- export and reload JSON scene presets directly from the browser

### Performance Telemetry and Render Lifecycle

To verify that our camera transitions and shaders stayed within a 60fps budget (16.6ms per frame), the debug mode graphed both live frame rates and WebGL render durations in milliseconds, flagging any drops below 30fps.

In production, the page also hosted an embedded YouTube documentary trailer and the 360° video edition. Using a pub/sub event bus, page visibility listeners, and throttled scroll handlers, the app automatically paused the WebGL render loop whenever the reader scrolled past the 3D header, switched browser tabs, or played a video. For older browsers without WebGL support, the same animation timeline gracefully fell back to crossfading pre-rendered stills of the cell.

## Technical Contributions

- **3D WebGL scene:** Built the Three.js prison cell experience, damped pointer-parallax camera rig, and non-WebGL image fallback
- **3D asset optimisation:** Reduced polygon counts in Blender, exported lightweight Three.js geometry, and baked lighting into UV texture atlases with anisotropic filtering
- **Post-processing pipeline:** Configured the desktop GLSL shader chain (anti-aliasing, chromatic aberration, film grain, and vignette) with direct-render scaling on mobile
- **In-browser authoring tool:** Built the live editor and debug modes with free-flight camera controls, `dat.gui`, wireframe/grid helpers, `rStats` frame-time profiling, and JSON preset import/export
- **Render lifecycle management:** Coordinated WebGL pause/resume states with scroll visibility, tab focus, and YouTube video playback via a pub/sub event bus

[6x9-vr]: /work/the-guardian-6x9-virtual-reality/
[guardian-6x9-web]: https://www.theguardian.com/world/ng-interactive/2016/apr/27/6x9-a-virtual-experience-of-solitary-confinement
