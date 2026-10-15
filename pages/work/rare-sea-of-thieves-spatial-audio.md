---
title: Rare - Sea of Thieves Enhanced Headphone Mode UI
tags: [TypeScript, JavaScript, CSS, UI, GameDev, Work]
thumbImage: /images/rare/enhanced-headphone-mode-upsell.jpg
description:
  Built the Enhanced Headphone Mode UI for Sea of Thieves, the in-game flow for
  Embody's Immerse spatial audio, driven by a strictly typed UI state machine.
weight: 10
---

# {{ title }}

![Enhanced Headphone Mode upsell screen in Sea of Thieves](/images/rare/enhanced-headphone-mode-upsell.jpg)

For Sea of Thieves, I built the Enhanced Headphone Mode UI: the in-game flow that lets players trial, buy, and set up Embody's Immerse spatial audio. I took over the feature while it was in progress and owned the UI through to release, mapping out the interaction states and building the screens in TypeScript and Sass.

## The Challenge

Enhanced Headphone Mode integrates a third-party product, Embody's Immerse Gamepack, which personalises 3D headphone audio. I built the UI around it, including the upsell screen, QR code setup, headphone selection, and audio settings.

The main challenge was the number of states the UI had to cover. What a player saw depended on three things at once: the state of the Embody plugin (trial available, active, expired, or purchased), how far they were through the setup steps, and whether they opened the flow from the main front-end menu or mid-session while playing. Every combination needed to resolve to the right screen and state cleanly.

<figure>
  <img src="/images/rare/enhanced-headphone-mode-qr-code.jpg" alt="QR code setup screen in Sea of Thieves">
  <figcaption>
    Setup via a QR code, one of several flows the UI had to handle.
  </figcaption>
</figure>

## The Stack

- **TypeScript** for the UI state machine, screen logic, and Unreal Engine data contracts
- **HTML, CSS, and Sass** for layout and visual styling
- **Coherent Gameface** as the in-engine web runtime inside Unreal Engine
- **Jasmine** for unit testing state transitions and UI logic

## The Solution

I started by mapping the entire feature out as a set of flow diagrams, working through every path (including success, modified, and error states) and attaching the underlying data models to each screen so it was clear what triggered each transition.

Those diagrams became the shared reference for the feature. They defined the data contracts between the UI and Unreal Engine, and kept designers, the engine team, Embody's engineers, and QA aligned (QA also used them as the basis for their test plan).

To drive this in code, I built a strictly typed state machine covered by Jasmine unit tests so we could trust how it behaved across every combination of states. The screens ran inside the Sea of Thieves UI framework on Coherent Gameface, written in strict TypeScript and styled with CSS and Sass.

<figure>
  <img src="/images/rare/enhanced-headphone-mode-settings.jpg" alt="Enhanced audio settings screen in Sea of Thieves">
  <figcaption>
    Enhanced audio settings, one of several states the UI managed.
  </figcaption>
</figure>

## Technical Contributions

- **State mapping:** Mapped the plugin, setup flow, and menu states into the game's UI
- **State machine:** Built a strictly typed UI state machine in TypeScript, covered by Jasmine unit tests
- **Data contracts:** Defined the event contracts between the UI and Unreal Engine, shared across the engine team, Embody, and QA
- **UI development:** Built the trial upsell, purchase, QR setup, and headphone selection screens
- **Visual styling:** Implemented the Figma designs in CSS and Sass
