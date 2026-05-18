---
title: 3D Tour de France Visualization
tags: [JavaScript, HTML, CSS, WebGL, Work]
socialImage: /images/tour_de_france/tour_de_france_mobile_screenshots_1920x.jpg
thumbImage: /images/tour_de_france/tour_de_france_mobile_screenshots_640x.jpg
description: An innovative 3D WebGL project showcasing the Tour de France's
  Alpe D'Huez climb, merges satellite imagery with elevation data
  for an immersive experience
weight: 104
---

# 3D Tour de France Visualization

![Three screenshots of the 3D tour de france mobile site](/images/tour_de_france/tour_de_france_mobile_screenshots_1080x.jpg)

## The Challenge

The project's objective was to create a data visualization showcasing the
history of the Tour de France’s most renowned hill climb, Alpe D’Huez. The
challenge lay in effectively combining satellite imagery with precise elevation
data to reconstruct the mountain course in 3D WebGL. Additionally, it was
crucial to optimize the user experience (UX) for mobile devices, which involved
implementing intuitive tap and swipe navigation. Catering to a wide range of
users, the project also required the development of a non-WebGL alternative for
compatibility with older browsers.

## The Solution

Working collaboratively with a team, I led the development of a 3D WebGL
reconstruction of Alpe D’Huez, enhancing the data visualization with accurate
topographical details. To ensure a seamless mobile experience, I tailored the UX
for touch interaction, addressing screen size limitations while maintaining
smooth 3D animations on supported devices. In instances where 3D support was
unavailable, the solution gracefully transitioned to image fade transitions.

<figure>
  <img src="/images/tour_de_france/tour_de_france_blender_1080x.png" alt="using blender to optimize polygon count" />
  <figcaption>
    Using Blender to optimize 3D assets
  </figcaption>
</figure>

A significant aspect of the project involved optimizing 3D assets. I utilized
Blender to reduce the polygon count, which effectively decreased the file size
and ensured rapid loading times. Furthermore, I developed a custom GUI editor
interface, enabling visual adjustments and fine-tuning of animation values. This
interface played a crucial role in creating the animated transitions, allowing
for precise control over the user's journey through the stages of the race.

<figure>
  <img src="/images/tour_de_france/tour_de_france_web_editor_1080x.jpg" alt="In-browser web editor" />
  <figcaption>
    In-browser camera and animation editor
  </figcaption>
</figure>

My detailed account of the development process, including how the 3D model was
generated, is available on Source, providing an in-depth view of the technical
and creative solutions implemented in this project.
