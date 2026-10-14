---
title: The Telegraph — Newsroom and lobby video wall
tags:
  [JavaScript, PixiJS, WebGL, Node.js, Puppeteer, Google-Cloud, Firebase, Work]
thumbImage: /images/videowall-social.jpg
description: Built an automated print and digital cover pipeline on Google Cloud and a 60fps PixiJS display for The Telegraph's newsroom and lobby video walls.
weight: 5
---

# {{ title }}

{%
  include "video",
  poster: "/video/videowall.jpg",
  src: "/video/videowall.mp4"
%}

For The Telegraph, I built an automated display system for the video walls in the building's lobby and newsroom. The system pulled daily print editions and regular full-page captures of the live website, processed their colour palettes in Node.js, and animated them at 60fps using PixiJS.

## The Challenge

The Telegraph produces a constant stream of print and digital editions—from the daily and Sunday newspapers to supplements like _Telegraph Magazine_, _Stella_, _Sport_, and _Business_, alongside a continuously updated website homepage.

The product team wanted the video walls in the lobby and newsroom to showcase these front pages automatically throughout the day, without anyone having to manually export files or update playlists.

## The Stack

- **PixiJS (WebGL)** for 60fps cover animations and smooth background colour tweening
- **Node.js, ImageMagick & Sharp** for PDF extraction, image resizing, and colour histogram analysis
- **Puppeteer (Headless Chrome)** for automated full-page website screenshots
- **Google Cloud Functions, Cloud Scheduler, Firestore & Cloud Storage** for the serverless capture and storage pipeline
- **Firebase** for kiosk heartbeat logging and uptime alerts

## The Solution

### Automating Print PDF Extraction and Colour Palettes

Working with the print production team, I connected to the internal editorial distribution feed via SFTP to pull the latest print PDFs each morning across the main paper and all supplements.

I wrote a scheduled Node.js pipeline that:

- downloaded the daily PDF editions over SFTP
- extracted the front page of each publication and rasterised it to a high-resolution PNG using **ImageMagick**
- analysed each cover's colour histogram using **Sharp** to find its dominant hue, then applied HSV colour-space heuristics to derive a complementary pastel background colour—avoiding garish saturation so the cover art stood out cleanly
- uploaded the processed images and colour metadata to **Google Cloud Storage**

### Serverless Homepage Capture Service

While print editions updated once a day, the digital homepage changed constantly. To capture it reliably—and give the wider UX team a tool for archiving pages—I built an event-driven screenshot service on Google Cloud (internally named _Chester_, after Xerox inventor Chester Carlson).

Every three hours, **Cloud Scheduler** sent a POST request to a Google Cloud Function, creating a capture record in **Cloud Firestore**. That database write triggered a second background Cloud Function running **Puppeteer**:

- **Clean page rendering:** The service used Puppeteer request interception to abort third-party ad, tracking, and consent scripts, and injected subscriber cookies so captures reflected the clean reader experience.
- **Lazy-loaded image handling:** For full-page captures, it measured `document.body.scrollHeight` and expanded the headless viewport height before taking the screenshot, forcing lazy-loaded images down the page to render without needing synthetic scroll events.
- **Storage & indexing:** Once captured, the full-page PNG and a generated thumbnail were uploaded to Google Cloud Storage and linked back to the Firestore record.

### 60fps PixiJS Display and Unattended Kiosk Monitoring

The lobby and newsroom video walls ran full-screen Chrome instances. Because CSS animations struggled to maintain a smooth frame rate when panning large high-resolution print covers and full-length homepage screenshots across wall-sized displays, I built the frontend renderer in **PixiJS**.

Using WebGL textures allowed the display to pan, scale, and transition between print supplements and digital editions at a locked 60fps, smoothly tweening the background canvas between each cover's generated pastel colour palette.

To keep the screens running unattended for months at a time, I kept the kiosk recovery mechanism deliberately simple: the page used an HTML refresh timer on a six-hour cycle to clear browser memory and pull fresh manifest data. On each refresh, the client logged a heartbeat event to **Firebase**, which triggered an alert if any screen failed to check in on schedule.

## Technical Contributions

- **Print ingestion pipeline:** Built a scheduled Node.js service that fetched daily newspaper and magazine PDFs over SFTP and rasterised front covers with ImageMagick
- **Programmatic colour palettes:** Used Sharp histograms and HSV colour heuristics to generate pastel background colours tailored to each cover
- **Serverless Puppeteer architecture:** Engineered an event-driven screenshot service using Google Cloud Functions, Cloud Scheduler, Firestore triggers, and Cloud Storage
- **WebGL display:** Built a 60fps PixiJS frontend for animating high-resolution print covers and full-page web captures with smooth colour transitions
- **Kiosk reliability:** Implemented automated 6-hour browser refresh cycles with Firebase heartbeat monitoring and alerting
