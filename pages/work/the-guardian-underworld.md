---
title: The Guardian — Underworld VR and interactive web experience
tags: [JavaScript, HTML, CSS, Web-Audio, Animation, VR, Unity, Work]
thumbImage: /images/underworld/underworld_360_1920x.jpg
description: Built an audio-synchronised interactive web experience and served as technical lead for Underworld, The Guardian's Google Daydream VR exploration of London's Victorian sewers.
weight: 200
---

# {{ title }}

{%
  include "video",
  poster: "/video/guardian-underworld.jpg",
  src: "/video/guardian-underworld.mp4"
%}

Following the launch of [6x9][6x9-vr], _Underworld_ was the first project produced for Google's Daydream View headset as part of the Guardian VR app. Created by The Guardian's in-house VR team in partnership with [The Mill](https://www.themill.com/), the piece takes viewers through London's subterranean Victorian sewers—from the buried River Fleet and the tunnels beneath Smithfield Market out to the floodgates of the Thames.

I served as The Guardian's technical lead on the VR production with The Mill, and built the [companion interactive web experience][underworld-web] in-house, featuring word-by-word animated typography synchronised with spoken interviews via the Web Audio API.

## The Challenge

_Underworld_ was a launch title for Google's Daydream View headset, which introduced a 3DoF wireless motion controller alongside stricter mobile rendering and thermal targets. Because both the Daydream hardware and SDKs were still in early development during production, we had to coordinate closely with The Mill and Google as the platform evolved.

Alongside the headset app and 360-degree video, we also needed a standalone interactive feature on theguardian.com that let readers explore the story and listen to urban explorer Bradley Garrett and medical historian Richard Barnett without needing a VR headset.

## The Stack

- **JavaScript, HTML & CSS Transitions** for the interactive web feature and visual scene transitions
- **Web Audio API** for audio playback and real-time word-by-word transcript synchronisation
- **Automated Transcription Timings** for generating per-word cue data from interview recordings
- **Unity & Google Daydream SDK** for the real-time CGI VR episode built with The Mill

## The Solution

### Technical Coordination on the Daydream VR Build

In the VR experience, viewers explore a real-time CGI reconstruction of the sewers guided by urban explorer Bradley Garrett, while historian Richard Barnett explains how the 1858 "Great Stink" and cholera outbreaks led to Joseph Bazalgette's Victorian sewer network. Rather than passively watching, viewers use the Daydream motion controller as a torch beam to light up the dark brickwork and choose which tunnel to follow at a fork in the sewer.

Because The Mill was building against early Daydream hardware and pre-release SDKs, much of the production involved navigating platform constraints around dynamic torch lighting, controller tracking, and mobile GPU performance. As The Guardian's technical lead, I reviewed builds on test hardware, coordinated technical requirements between The Mill and our editorial and audio teams, and oversaw delivery of the episode into the Guardian VR app alongside a 360-degree video edition.

### Building the Audio-Driven Web Experience

To bring the story to web readers, I designed and built an interactive companion site that combined photography, atmospheric tunnel visuals, historical archival illustrations, and spoken audio interviews.

<figure>
  <img src="/images/underworld/underworld_website_1080x.jpg" alt="Screenshot of the Guardian Underworld website showing the underground tunnel and synchronised interview text">
  <figcaption>
    The interactive web feature, synchronising spoken interview audio with word-by-word animated typography
  </figcaption>
</figure>

Because the interviews with Bradley Garrett and Richard Barnett carried the narrative, I wanted the audio to drive the visual pacing on the page rather than sitting inside a standard media player:

- **Word-level timing extraction:** I ran the edited interview recordings through an automated transcription service to generate JSON timing data with start and end timestamps for every individual word and speaker change.
- **Web Audio synchronisation:** Using the **Web Audio API**, the page tracked playback time on each frame and matched it against the word-timing map, dynamically highlighting and animating each word via CSS transitions as it was spoken.
- **Visual progression:** As the audio progressed through different sections of the sewer system, the page triggered CSS transitions between subterranean photography, archival imagery, and historical context.

## Technical Contributions

- **Interactive web development:** Designed and built the companion web experience on theguardian.com using JavaScript, HTML, and CSS transitions
- **Audio-synchronised typography:** Generated word-by-word timing maps from interview recordings using a transcription pipeline and synced them to live playback with the Web Audio API
- **VR technical leadership:** Acted as The Guardian's technical lead alongside The Mill during early Google Daydream View development, reviewing builds and coordinating integration into the Guardian VR app

[6x9-vr]: /work/the-guardian-6x9-virtual-reality/
[underworld-web]: https://www.theguardian.com/cities/ng-interactive/2016/nov/10/subterranean-london
