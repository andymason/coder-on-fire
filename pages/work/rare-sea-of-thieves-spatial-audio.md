---
title: Rare — Sea of Thieves Enhanced Headphone Mode UI
tags: [TypeScript, JavaScript, CSS, UI, GameDev, Work]
thumbImage: /images/rare/enhanced-headphone-mode-upsell.jpg
description:
  Built the Enhanced Headphone Mode UI for Sea of Thieves, the in-game flow for
  Embody's Immerse spatial audio, driven by a strictly typed UI state machine.
weight: -1
---

# {{ title }}

![Enhanced Headphone Mode upsell screen in Sea of Thieves](/images/rare/enhanced-headphone-mode-upsell.jpg)

For Sea of Thieves, I built the Enhanced Headphone UI: the in-game flow that lets players trial, buy, and set up Embody's Immerse spatial audio. I took over the feature already in progress and owned the UI as its main UI engineer, mapping the interaction states and developed the shipping the screens.

## The challenge

Enhanced Headphone Mode integrates a third party product, Embody's Immerse Gamepack, which personalises 3D headphone audio. I built the UI around it including the upsell, the QR setup, headphone selection, and game settings.

The real challenge was the number of states the UI had to cover. What a player saw depended on three things at once: the state of the Embody plugin (trial available, in progress, ended, and so on), how far they were through setup, and whether they opened it from the main menu or while playing. Every combination needed its own correct screen and state.

<figure>
    <img src="/images/rare/enhanced-headphone-mode-qr-code.jpg" alt="QR flow">
  <figcaption>
      Setup via a QR code, one of several flows the UI screens
  </figcaption>
</figure>

## The solution

I started by mapping the whole thing out, working through each flow, including the success, modified, and error states, and attaching the underlying data to each screen so it was clear what drove each flpw change.

Those flow diagrams became the shared reference for the feature. They defined the data contracts between the UI and the Unreal engine, helped communication between designers, engine team, Embody's engineers, and QA who used it for their test plan.

To power this in code I used a strictly typed state machine, backed by Jasmine unit tests so I could trust it across all combinations. The screens ran in the Sea of Thieves UI framework, using Coherent Gameface to run web UI inside Unreal Engine; I wrote them in strict TypeScript and implemented the visual design in CSS and Sass.

<figure>
  <img src="/images/rare/enhanced-headphone-mode-settings.jpg" alt="QR code setup screen in Sea of Thieves, step 1 of 2 for creating a personalised audio profile">
  <figcaption>
    Enhanced audio settings, one of several states the UI had to manage
  </figcaption>
</figure>

## Technical contributions

- **State mapping:** Mapped the plugin, flow, and menu states into the games UI
- **State machine:** Built a strictly typed UI state machine, covered by Jasmine unit tests
- **Data contracts:** Defined the event contracts between the UI and Unreal Engine, used by the engine team and QA
- **UI development:** Built the trial, purchase, setup, and headphone selection screens
- **Visual styling:** Implemented the Figma designs in CSS and Sass
