---
title: The Telegraph — Podcast Player and Embed Dashboard
tags: [Preact, TypeScript, JavaScript, CSS, Audio, Web-API, Work]
thumbImage: /images/podcast-tool-social.jpg
description: Built a custom podcast audio player and editorial episode-picker dashboard in TypeScript and Preact, powered by The Telegraph's Art19 podcast API.
weight: 9
---

# {{ title }}

{%
  include "video",
  poster: "/video/podcast-tool-demo.jpg",
  src: "/video/podcast-tool-demo.mp4"
%}

In a one-week sprint at The Telegraph, I designed and built a prototype podcast player and an editorial embedding dashboard. The project replaced a generic third-party embed with a player styled for Telegraph articles, while still pulling live audio and metadata from the newsroom's existing Art19 hosting platform.

## The Challenge

The Telegraph hosted its podcasts on Art19, but the default embed player clashed with the newspaper's article design and gave editors very little flexibility when promoting shows inside stories.

The product team wanted to explore what we could build on top of Art19's APIs without changing how audio producers uploaded or managed their shows. Within a week, I needed to:

- reverse-engineer the Art19 API endpoints and data models for The Telegraph's podcast network
- design and build a responsive audio player that felt native to Telegraph articles
- create a self-service dashboard where journalists could browse shows, preview the player, and copy an embed snippet for the CMS

## The Stack

- **TypeScript & Preact** (`preact/hooks`) for a lightweight player bundle and the editorial dashboard UI
- **HTML5 Audio API** for custom playback, scrubbing, volume controls, and format fallbacks
- **CSS Grid & `backdrop-filter`** for responsive layout and dynamic artwork-tinted backgrounds
- **Node.js** for fetching and indexing network series and cover artwork from the Art19 API
- **esbuild** for bundling the standalone player and episode picker apps

## The Solution

### Integrating with the Art19 API

I started by exploring Art19's content and RSS JSON APIs (`application/vnd.art19.v0+json`). Because fetching every series and resolving cover art across the entire Telegraph network on every page load would be slow, I wrote a Node.js script to query The Telegraph's network ID, match each series to its `640px` square cover asset from Art19's image buckets, and generate a pre-built series index.

At runtime, the player and dashboard used this index alongside live requests to Art19's episodes endpoint to pull the latest releases, MP3 stream URLs, durations, descriptions, and subscription links (Apple Podcasts, Spotify, Pocket Casts, Google Podcasts, and RSS).

### Custom Audio Player and Artwork Backdrop

Working with a product designer, I built a custom player in Preact and CSS Grid that matched The Telegraph's editorial typography and layout. To give each show its own visual identity without manual colour picking, the player used the active episode's cover art as a background layer treated with CSS `backdrop-filter: blur(30px) contrast(0.3) brightness(1.6) saturate(1.5)` and a radial gradient fade.

Under the hood, I built a custom HTML5 `<audio>` controller and range scrubber:

- **Playback and scrubbing:** Handled loading, playing, and paused states, time formatting, volume/mute controls, and a custom scrubber that tracked pointer and touch drag state (`onMouseDown` / `onTouchStart`) while animating progress with `transform: scaleX()`.
- **Playlist and episode switching:** In playlist mode, listeners could switch between episodes in a series with client-side caching for previously loaded episodes.
- **Sharing and fallbacks:** Added a modal for sharing episodes via Twitter, Facebook, or email, a direct MP3 download action, and a fallback download link if `canPlayType("audio/mpeg")` reported that the device couldn't play the stream inline.

### Editorial Episode Picker Dashboard

To make the player easy for journalists to use, I built a companion single-page dashboard app. Editors could browse a visual grid of all Telegraph podcasts or select a series from a dropdown, inspect episode release dates, and choose from three embed modes:

1. **Always latest episode:** Automatically resolved and played the newest episode in that series whenever a reader loaded the article.
2. **Specific episode:** Locked the embed to a chosen episode.
3. **Show playlist:** Rendered the player with an interactive list of recent episodes from the series.

Whenever an editor changed their selection, the dashboard serialised and Base64-encoded the configuration into a `<script class="podcast-player" data-embed="..." async>` tag, rendered a live preview inside an `<iframe srcDoc>`, and let them copy the snippet to their clipboard in one click.

The prototype was completed within a week and well received by editors and department heads as a blueprint for upgrading audio across the site.

## Technical Contributions

- **API integration:** Mapped Art19's network, series, episode, and media-asset endpoints, building a Node.js ingestion script and runtime data layer in TypeScript
- **Custom audio player:** Built the Preact HTML5 `<audio>` player with custom pointer/touch range scrubbers, playlist switching, social share modals, and progressive fallbacks
- **Visual styling:** Implemented the 12-column CSS Grid layout and dynamic `backdrop-filter` blurred artwork backgrounds
- **Editorial tooling:** Built the episode-picker dashboard with live `<iframe srcDoc>` previews, Base64 `data-embed` payload encoding, and one-click clipboard export
