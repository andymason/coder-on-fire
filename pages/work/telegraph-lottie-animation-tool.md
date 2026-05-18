---
title: Lottie animation integration tool
tags: [Lottie, SVG, React, After-effects, TypeScript, JavaScript, CSS, JSON, Work]
thumbImage: /images/lottie-social.jpg
description: A web based Lottie preview and embedding tool
weight: 104
---

# Lottie animation integration tool

<div class="video video--paused">
  <video poster="/video/lottie.png" width="1280" height="720" playsinline disableremoteplayback x-webkit-airplay="deny" preload="none" >
    <source src="/video/lottie.mp4" type="video/mp4">
  </video>
</div>

## Challenge

The Telegraph's product team aimed to enhance reader engagement in news articles
by incorporating more animation. The existing methods, heavy GIFs and videos,
either slowed down the webpage or lost visual quality when enlarged. Was there a
better solution?

## Solution

Drawing from my internet industry experience since the early 2000s, I recalled
Adobe Flash. Flash, a pioneer in its time, is no longer viable for good reasons.
However, a new player, Airbnb's Lottie, presented a promising alternative.
Lottie offers vector-based animations crafted in After Effects. These animations
maintain high quality at small file sizes.

The real task was integrating Lottie animations from After Effects into the CMS.

To solve this, I developed a web-based tool enabling designers to upload Lottie
JSON files, preview animations across various breakpoints, and view them within
a sample article. The tool also offered options to modify animations, like
adding background colors or setting autoplay.

The final output was an HTML block containing all required JSON data and
scripts, seamlessly embeddable into the CMS.

This solution delighted the designers, allowing them to use familiar authoring
tools. Simultaneously, it pleased the site developers as it circumvented the
page slowdown issues associated with large GIFs.
