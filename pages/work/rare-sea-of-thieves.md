---
title: Rare - Sea of Thieves Guilds UI
tags: [TypeScript, JavaScript, CSS, UI, GameDev, Work]
thumbImage: /images/rare/sea-of-thieves-guild-logo-intro-1920x.jpg
description: Built the Guilds creation flow and UI screens for Sea of Thieves Season Ten in TypeScript and Sass, and reduced the UI unit test suite runtime by 30%.
weight: 11
---

# {{ title }}

{%
  include "video",
  poster: "/video/sea-of-thieves-ui-web.jpg",
  src: "/video/sea-of-thieves-ui-web.mp4"
%}

Joining Rare as a UI Engineer on Sea of Thieves, I helped build **Guilds**, the headline social feature for Season Ten. Working in TypeScript, CSS, and Sass on Coherent Gameface inside Unreal Engine, I built the guild creation flow, branding customisation, and Guild Chronicles screens, and optimised the UI unit test runner to cut test execution time by 30%.

## The Challenge

Guilds let up to 24 players form a shared crew, pledge ships, and track their collective progress. Unlike purely local HUD elements, creating and managing a guild required the frontend UI to talk through Unreal Engine C++ to remote Xbox and Rare backend services.

Because players could type custom guild names, pick branding and colours, and browse live activity logs across PC and Xbox consoles, the UI had to handle asynchronous validation, network errors, and loading states cleanly while staying fast on console hardware.

## The Stack

- **TypeScript** for UI components, screen flows, and Unreal Engine data contracts
- **CSS, Sass, and PostCSS** for layout, animations, and theming
- **Coherent Gameface** for rendering web UI inside Unreal Engine
- **Jasmine** for browser-based UI unit testing
- **Xbox PIX & Chrome DevTools** for profiling UI memory and frame times on Xbox One and PC

## The Solution

### Guild Creation, Name Validation, and Chronicles

Working closely with designers and engine programmers, I translated Figma designs into TypeScript components and defined the data contracts connecting the UI, Unreal Engine, and remote services.

<figure>
  <img src="/images/rare/sea-of-thieves-chronicles-1280x.jpg" alt="Sea of Thieves UI showing Guild Chronicles">
  <figcaption>
    The Guild Chronicles screen, displaying a live log of crew voyages and milestones.
  </figcaption>
</figure>

My main focus was the **Guild creation and customisation flow**:

- **External name validation:** When a player entered a guild name, the UI coordinated asynchronous checks through the engine to remote services to validate formatting, profanity filters, and availability, surfacing clear feedback and error states in the menu.
- **Guild branding:** Built the interactive screens for choosing a guild's emblem, colour scheme, and identity before finalising creation.
- **Guild Chronicles & menus:** Built UI views for inspecting guild progression and chronicle logs, tested across gamepad, keyboard, and mouse on both PC and Xbox One devkits.

### Cutting UI Test Runtime by 30%

Sea of Thieves had a large suite of Jasmine unit tests running in a browser environment, and slow test runs were bottlenecking both local development and CI builds.

To find out where the time was going, I instrumented the test runner with custom logging and wrote a script to analyse the output logs across the suite. By inspecting the data, I traced the slowdown to a combination of test runner configuration settings and deep promise tracking that was consuming excessive memory and CPU time on every spec. Updating the runner configuration and disabling deep promise tracking reduced total unit test runtime by 30% and lowered memory usage across CI builds.

Following the launch of Season Ten, I moved onto Rare's next title, [Everwild](/work/rare-everwild-ui-spatial-navigation/), to prototype its inventory HUD and build a bespoke spatial navigation system, before returning to Sea of Thieves to build [Custom Seas](/work/rare-sea-of-thieves-custom-seas/) and [Enhanced Headphone Mode](/work/rare-sea-of-thieves-spatial-audio/).

## Technical Contributions

- **Guild creation flow:** Built the guild setup, branding selection, and asynchronous external name-validation screens in TypeScript and Sass
- **Engine & service data contracts:** Defined TypeScript models and event contracts bridging the web UI, Unreal Engine C++, and remote backend APIs
- **Test suite optimisation:** Analysed browser test runner logs to identify costly configuration and deep promise tracking overhead, cutting Jasmine test runtime by 30%
- **Console profiling:** Validated UI performance and memory on PC and Xbox One hardware using DevTools and Xbox PIX captures
