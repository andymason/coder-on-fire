---
title: The Telegraph - Podcast Player and Embed Dashboard
tags: [Preact, TypeScript, JavaScript, CSS, Audio, Web-API, Work]
thumbImage: /images/podcast-tool-social.jpg
description: Built a custom podcast audio player and editorial episode-picker dashboard in TypeScript and Preact, powered by The Telegraph's Art19 podcast API.
weight: 10
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

- explore the Art19 API endpoints and data models for The Telegraph's podcast network
- design and build a responsive audio player that felt native to Telegraph articles
- create a self-service dashboard where journalists could browse shows, preview the player, and copy an embed snippet for the CMS

## The Stack

- **TypeScript & Preact** for a lightweight player bundle and the editorial dashboard UI
- **HTML5 Audio API** for custom playback, scrubbing, volume controls, and format fallbacks
- **CSS Grid & Backdrop Filters** for responsive layout and dynamic artwork-tinted backgrounds
- **Node.js** for fetching and indexing network series and cover artwork from the Art19 API
- **esbuild** for bundling the standalone player and episode picker apps

## The Solution

### Integrating with the Art19 API

Because fetching every series and resolving cover art across the entire Telegraph podcast network on every page load would be slow, I wrote a Node.js script to query The Telegraph's network catalogue, match each show to its square cover art, and generate a lightweight series index.

At runtime, the player and dashboard combined this index with live requests to Art19's episodes endpoint to pull the latest releases, MP3 stream URLs, durations, descriptions, and subscription links for Apple Podcasts, Spotify, Pocket Casts, and RSS.

### Custom Audio Player and Artwork Backdrop

Working with a product designer, I built a custom player in Preact and CSS Grid that matched The Telegraph's editorial typography and layout. To give each show its own visual identity without manual colour picking, the player used the active episode's cover art as a background layer treated with CSS blur, contrast, and saturation backdrop filters over a soft gradient fade.

Under the hood, I built a custom HTML5 audio controller and range scrubber:

- **Playback and scrubbing:** Handled loading, playing, and paused states, time formatting, volume controls, and a custom scrubber supporting both mouse drag and mobile touch gestures.
- **Playlist and episode switching:** In playlist mode, listeners could switch between recent episodes in a series with client-side caching for previously loaded episodes.
- **Sharing and fallbacks:** Added a modal for sharing episodes via social media or email, a direct MP3 download link, and a graceful download fallback for older browsers that couldn't stream the audio inline.

### Editorial Episode Picker Dashboard

To make the player easy for journalists to use, I built a companion single-page dashboard app. Editors could browse a visual grid of all Telegraph podcasts or select a series from a dropdown, check release dates, and choose from three embed modes:

1. **Always latest episode:** Automatically played the newest episode in that series whenever a reader loaded the article.
2. **Specific episode:** Locked the embed to a chosen episode.
3. **Show playlist:** Rendered the player with an interactive list of recent episodes from the series.

Whenever an editor changed their selection, the dashboard updated a live preview and generated a self-contained script snippet that they could copy to their clipboard in one click and paste straight into the CMS. The prototype was completed within a week and well received by editors and department heads as a blueprint for upgrading audio across the site.

## Technical Contributions

- **API integration:** Mapped Art19's network, series, episode, and media-asset endpoints, building a Node.js indexing script and runtime data layer in TypeScript
- **Custom audio player:** Built the Preact HTML5 audio player with custom pointer and touch scrubbers, playlist switching, share modals, and progressive fallbacks
- **Visual styling:** Implemented the responsive CSS Grid layout and dynamic blurred artwork backgrounds
- **Editorial tooling:** Built the episode-picker dashboard with live previews and one-click CMS embed export
