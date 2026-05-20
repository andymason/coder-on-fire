---
title: Dynamic video wall showcase
tags: [Animation, PixiJS, Node.js, JavaScript, CSS, Work]
thumbImage: /images/videowall-social.jpg
description: A dynamic animating video wall displaying the latest content from the
  Telegraph's print and digital publications.
weight: 103
---

# Dynamic video wall showcase

{%
  include "video",
  poster: "/video/videowall.jpg",
  src: "/video/videowall.mp4"
%}

## The Challenge

The front page of The Telegraph, both print and digital, undergoes constant
iteration with new headlines and visuals. The objective was to create a
real-time display showcasing this dynamic cover art across the publication's
physical spaces, capturing the essence of its ever-evolving news cycle.

## The Solution

Through collaboration with the print publication team, I secured access to the
PDF versions of all printed editions. A custom Node.js script was developed to:

- Download the latest PDFs daily.
- Extract the first page using ImageMagick, converting it to a PNG format for
  display.
- Upload the converted cover image to cloud storage for secure and persistent
  access.
- Utilize Puppeteer to capture a screenshot of the current website homepage,
  reflecting the latest digital edition.

To ensure continuous freshness, a simple `cron` task was implemented. This task
automatically runs the script every morning, replacing the displayed covers with
the most recent versions.

With the cover images ready, the focus shifted to the display system. The lobby
and newsroom were equipped with video walls displaying full-screen Chrome
windows. I designed a website that loaded and animated these images in a
continuous loop and did the following:

- Load the cover images and homepage screenshot.
- Implement transitions between covers using the PixiJS library, creating a
  visually engaging animation loop.
- Analyze each cover image to identify the dominant hue using the HSV color
  space. This hue was then adjusted to generate a complementary background color
  for each transition, enhancing the visual appeal.

The dynamic cover display successfully translates the energy and dynamism of The
Telegraph's news cycle into a physical space. It serves as a visual reminder of
the publication's ever-evolving nature and journalistic heart, captivating staff
and visitors alike.

This project demonstrates my technical expertise in Node.js, Puppeteer,
ImageMagick, and PixiJS, as well as my ability to translate complex workflows
into practical and visually appealing solutions.
