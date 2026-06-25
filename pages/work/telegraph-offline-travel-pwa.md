---
title: Offline Travel PWA Prototype
tags: [React, JavaScript, Node.js, JSON, PWA, HTML, CSS, Work]
thumbImage: /images/travel-pwa-social.jpg
description: Offline PWA prototype of the Telegraph's travel guides
weight: 203
---

# Offline Travel PWA Prototype

{%
  include "video",
  poster: "/video/travel-pwa-demo.jpg",
  src: "/video/travel-pwa-demo.mp4"
%}

## Challenge

The Telegraph's travel team wanted to investigate the possibility of an offline
travel guide.

People researching before they go on holiday is the main source of traffic to
guide pages. They wanted to know if it was possible to save a guide offline and
take it with you on the trip.

The major hurdles to overcome with the prototype were:

1. There was not a structured format for the travel guides
2. The existing content was created for desktop only

## Solution

As with all prototypes, it is important to understand the data you have to work
with. In this case, guide information was stored in handwritten HTML articles.
While the articles followed a common format and style, there were slight
differences between each one.

Given my experience with similar content issues in the past, I wrote a Node.js
script to scrape the HTML, converting the travel pages into structured JSON.

The app needed to be fast with a small filesize to ensure a quick initial
download and reduce potential roaming data costs. I chose to use Preact because
it uses the same API as React but has a smaller footprint. Styles were achieved
using vanilla CSS variables for a consistent look and easy tweaking.

One nice inclusion was [Blurhash](https://github.com/woltapp/blurhash) to create
placeholder images. The library generates tiny, blurred hash versions of the
images that are displayed while the main image loads.

The prototype was hosted on [now.sh](https://now.sh) now
[vercel.com](https://vercel.com) which allow for rapid deployments. This was
invaluable during review meetings, allowing me to push changes for the designers
to see instantly. It was possible to experiment with ideas using real devices,
and that shaped the look and feel of the app.

The testing was conducted both internally and externally, providing useful
feedback and suggestions.

The final result helped shape the travel content strategy, and also showcased
the benefits of early prototyping and user feedback at the beginning of a
project.
