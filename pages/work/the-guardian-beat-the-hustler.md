---
title: The Guardian — Beat the Hustler interactive 360° VR game
tags: [Unity, VR, 360-Video, Spatial-Audio, Mobile, GameDev, Work]
thumbImage: /images/hustle/hustle_promo_1080x.jpg
description: Technical lead and sole developer on Beat the Hustler, an interactive 360-degree VR game built in Unity for Google Daydream and the Guardian VR app.
weight: 105
---

# {{ title }}

![Actors standing around a table](/images/hustle/hustle_promo_1080x.jpg)

_Beat the Hustler_ is an interactive 360-degree VR experience built in-house by The Guardian's VR studio. It places the viewer in the middle of a London street con—trying to follow the ball in a three-cup shell game while a team of pickpockets works the surrounding crowd. As the sole developer and technical lead alongside the director, cinematography, video, and audio team, I built the interactive experience in Unity for Google Daydream.

## The Challenge

Most 360-degree VR video is passive: the viewer can look around, but cannot influence what happens. For _Beat the Hustler_, we wanted to combine live-action stereoscopic 360° footage with real-time game mechanics—letting players use the Google Daydream motion controller to pick cups and spot pickpockets in the crowd.

We also had a platform constraint: the experience had to be delivered as a downloadable episode inside the existing Guardian VR mobile app on Android and iOS, without requiring users to download a new app binary from the store.

## The Stack

- **Unity** for combining spherical 360° video playback with real-time 3D scene geometry and raycast interaction
- **Google Daydream SDK** for headset tracking and 3DoF motion-controller pointer input
- **PlayMaker** for data-driven finite state machines packaged inside downloadable episode bundles
- **Google Jump (GoPro Odyssey)** 16-camera rig for stereoscopic 360° video capture
- **Spatial Audio** for directional street ambience and actor dialogue

## The Solution

### Pre-Production and Filming on Location

Before going on location, I worked with the director, scriptwriter, and director of photography to storyboard the branching narrative and run test shoots at The Guardian's offices. Because every player choice needed to branch cleanly into a different video segment, the actors' movements and reset positions had to be carefully choreographed.

We filmed on location near Tower Bridge using the **Google GoPro Odyssey**—a 16-camera stereoscopic 360° rig—while our in-house After Effects editor created masked dissolves and blends to hide the seams between branching video takes.

<figure>
  <img src="/images/hustle/hustle_video_capture_1080x.jpg" alt="Actors around a table in the 360 video" />
  <figcaption>
    Equirectangular capture from the 360-degree shoot near Tower Bridge
  </figcaption>
</figure>

### Aligning 3D Hitboxes with 360° Video in Unity

Inside the 360-degree video sphere, the table, cups, and actors are flat pixels—there is no 3D geometry for a controller raycast to hit.

To make the video interactive, I took physical measurements of the table, cups, and camera rig on set, along with the Odyssey's lens and stitching specifications, and reconstructed a matching 3D scene layout inside Unity. I placed invisible 3D collider hitboxes in space that lined up over the cups and actors in the video projection, allowing players to point and click directly on elements in the live-action footage using the Daydream controller.

<figure>
  <img src="/images/hustle/hustle_unity_capture_1080x.jpg" alt="Unity engine editor" />
  <figcaption>
    Aligning 3D collider hitboxes and state machines with the 360-degree video inside the Unity editor
  </figcaption>
</figure>

### Shipping Interactive Logic Over-the-Air with PlayMaker

The Guardian VR app was architected as a shell application that downloaded new episodes on demand. Because mobile app stores and Unity's ahead-of-time compilation don't allow downloading new compiled C# scripts inside content bundles, writing custom C# game logic for _Beat the Hustler_ would have forced a full app store release.

To work around this, I built the episode's branching logic using **PlayMaker** finite state machines. Because PlayMaker serialises its state graphs as data rather than compiled code, the entire interactive shell game—controller input, timers, score tracking, and video branching—could be packaged inside the downloadable episode bundle and executed by the existing base app.

### Video Encoding and Mobile VR Performance

Seeking and branching between high-resolution 360° video clips on a mobile phone inside a VR headset can easily cause frame drops or buffering stalls. To keep transitions responsive and synced with the spatial audio mix, I tuned the video encoding pipeline—experimenting with bitrates and adjusting I-frame and B-frame keyframe intervals so the mobile hardware decoder could jump between branching clips without stuttering.

## Technical Contributions

- **Interactive 360° development:** Built the entire Unity application, combining stereoscopic 360° video with real-time 3D raycast interactions for the Google Daydream controller
- **Camera-to-3D calibration:** Used on-set physical measurements and camera rig optics to align invisible 3D collider hitboxes with objects and actors in the spherical video projection
- **Over-the-air episode architecture:** Implemented the game's branching state machines in PlayMaker so the interactive episode could be downloaded dynamically into the live Guardian VR app without a binary update
- **Video pipeline optimisation:** Tuned video codecs, bitrates, and I/B-frame keyframe structures to eliminate seeking lag during interactive video transitions on mobile hardware
- **Technical leadership:** Worked from initial storyboarding and test shoots through to final build delivery alongside the director, cinematographer, video editor, and spatial audio engineers
