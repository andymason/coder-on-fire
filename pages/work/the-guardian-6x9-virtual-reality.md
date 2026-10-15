---
title: The Guardian — 6x9 virtual reality experience
tags: [Unity, VR, 3D-Graphics, Spatial-Audio, Mobile, Work]
thumbImage: /images/6x9-virtual-reality-social.jpg
description: Technical lead for 6x9, The Guardian's first virtual reality experience, using real-time 3D in Unity and spatial audio to place viewers inside a solitary confinement cell.
weight: 9
---

# {{ title }}

{%
  include "video",
  poster: "/video/6x9-virtual-reality-demo.jpg",
  src: "/video/6x9-virtual-reality-demo.mp4"
%}

_6x9_ was The Guardian's first virtual reality project, placing the viewer inside a six-by-nine-foot US "supermax" solitary confinement cell to show the psychological toll of long-term isolation. As the sole technical lead on The Guardian's small core team alongside the project editor and audio producers, I built the initial R&D prototypes in Unity, evaluated the Google Cardboard and spatial audio pipelines, coordinated technical delivery with external production studio The Mill, and built the companion [interactive WebGL website and 3D editor][6x9-webgl] for `theguardian.com`.

## The Challenge

Google approached The Guardian to collaborate on a journalism project for Google Cardboard. Rather than filming a passive 360-degree video in an exotic location, we chose a story where physical presence and scale were central to the reporting: between 80,000 and 100,000 people in the US are held in solitary confinement for 23 hours a day.

Because we couldn't film inside an active supermax cell—and because we wanted to convey psychological effects of sensory deprivation such as blurred vision, hallucinations, and floating out of the body—the piece had to be built as a real-time 3D experience running on mobile hardware inside a Cardboard headset.

## The Stack

- **Unity** for real-time 3D rendering, baked lighting, and mobile app builds (iOS and Android)
- **Google Cardboard SDK** for stereoscopic mobile VR rendering and head-tracking
- **3D Spatial Audio** for positioning first-person interview recordings and ambient cell acoustics around the listener
- **360° Video** for a fallback YouTube edition accessible without a mobile app

## The Solution

### Internal R&D and Unity Prototyping

Virtual reality and game-engine workflows were completely new to The Guardian's newsroom. Before commissioning external production, I built an internal prototype of the cell in Unity to understand the engine's capabilities and constraints on mobile phones.

<figure>
  <img src="/images/6x9-unity-audio.jpg" alt="Unity editor screenshot">
  <figcaption>
    Testing 3D spatial audio placement and room scale inside the Unity editor
  </figcaption>
</figure>

I used the prototype to test:

- **Scale and pacing:** Blocking out the exact 6×9 foot dimensions to see how it felt to sit inside the space over several minutes
- **Spatial audio pipelines:** Testing how multi-channel audio and the Google Cardboard SDK handled directional voices, echoes from neighbouring cells, and ambient sound cues as the viewer turned their head

Building this prototype in-house meant that when we partnered with visual effects studio **The Mill** for final 3D modelling and app production, we could collaborate on equal technical footing.

### Technical Lead and Production Delivery

Throughout production with The Mill, I acted as The Guardian's technical lead—reviewing Unity builds, testing performance across target mobile hardware, and translating 3D graphics concepts like baked lighting, shaders, and draw-call budgets between the external developers and our editorial team.

In the finished piece, viewers sit inside the reconstructed cell while hearing first-hand accounts from formerly incarcerated people and psychologists. Looking around the room—at a letter, the sink, books, or the food slot in the door—triggers environmental audio and visual shifts that reflect how prolonged isolation distorts perception.

Alongside the real-time mobile app, The Mill rendered a 360-degree panorama video of the experience so readers without headsets could watch on YouTube, while my [WebGL promotional site][6x9-webgl] let desktop and mobile readers explore the 3D cell directly in their browser. For launch, The Guardian also distributed thousands of custom Google Cardboard headsets with the print newspaper.

<figure>
  <img src="/images/6x9-360-cell.jpg" alt="Inside the prison cell">
  <figcaption>
    360-degree equirectangular render of the prison cell
  </figcaption>
</figure>

### Reception and Impact

_6x9_ premiered at the **Sundance** and **Tribeca** film festivals—where Robert De Niro tried the headset and later spoke about the piece on _The Tonight Show with Jimmy Fallon_—and was exhibited at the White House as part of President Obama's _South by South Lawn_ (SXSL) festival. It was also adopted by legal mitigation specialists and campaigners working on solitary confinement reform.

<figure>
  <div class="video video--paused">
    <video poster="/video/6x9-virtual-reality-robert-de-niro.jpg" width="1280" height="720" playsinline disableremoteplayback x-webkit-airplay="deny" preload="none" >
      <source src="/video/6x9-virtual-reality-robert-de-niro.mp4" type="video/mp4">
    </video>
  </div>
  <figcaption>
    Robert De Niro discussing The Guardian's 6x9 VR experience on The Tonight Show with Jimmy Fallon
  </figcaption>
</figure>

Following the success of _6x9_, The Guardian established an experimental in-house VR studio, where I continued as technical lead across the platform and built interactive Unity VR episodes such as [Beat the Hustler][beat-the-hustler].

## Technical Contributions

- **Unity R&D prototyping:** Built the initial 3D cell prototype in Unity to validate room scale, mobile rendering constraints, and asset ingestion workflows
- **Spatial audio experimentation:** Tested and configured 3D positional audio and Google Cardboard SDK integration for directional storytelling
- **Technical leadership:** Served as The Guardian's sole technical lead alongside the editorial team, reviewing builds, testing hardware performance, and coordinating technical delivery with The Mill
- **Cross-platform delivery:** Supported the launch across iOS, Android, Google Cardboard, 360° YouTube video, and the companion [Three.js/WebGL promotional site][6x9-webgl]

[6x9-webgl]: /work/the-guardian-6x9-webgl-website/
[beat-the-hustler]: /work/the-guardian-beat-the-hustler/
