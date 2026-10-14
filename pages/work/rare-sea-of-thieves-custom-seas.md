---
title: Rare — Sea of Thieves Custom Seas UI
tags: [TypeScript, JavaScript, CSS, UI, GameDev, Work]
thumbImage: /images/rare/sea-of-thieves-custom-seas.jpg
description: Built UI for Sea of Thieves' Custom Seas in Season 20, including the Free Camera, Quick Spawn radial, and Command Menu spawn screens.
weight: -2
---

# {{ title }}

{%
  include "video",
  poster: "/video/sea-of-thieves-custom-seas.jpg",
  src: "/video/sea-of-thieves-custom-seas.mp4"
%}

For Sea of Thieves, I worked as a UI Engineer on Custom Seas, a sandbox mode that lets players customise their world and create their own experiences. Shipped in Season 20 and live in the game today, I built the UI for the in-game command toolbar, the Free Camera (photo mode), the Quick Spawn radial, and the full-screen Command Menu.

## The Challenge

Having previously shipped [Guilds](/work/rare-sea-of-thieves/) in the Sea of Thieves codebase, I already knew the UI framework and how to collaborate with the engine team. Custom Seas was a significant step up in both scope and team size.

The mode needed a suite of live creation tools—a command toolbar, Free Camera, Quick Spawn radial, and full-screen item browser—that rendered directly over active gameplay. Because these overlays ran on top of the live 3D game world across PC and consoles (including base Xbox One hardware), DOM updates and styling had to stay lightweight to avoid frame drops.

## The Stack

- **TypeScript** within the Sea of Thieves UI framework
- **HTML, CSS, and Sass** for templates, responsive aspect-ratio layouts, and animations
- **Coherent Gameface** as the in-engine browser runtime inside Unreal Engine
- **Jasmine** for unit testing UI logic and data contracts

## The Solution

I built these features in the Sea of Thieves UI framework on Coherent Gameface using TypeScript, CSS, and Sass. I worked with the engine team on the TypeScript data contracts between the UI and Unreal Engine, adjusting them as the feature evolved, and covered the UI logic with Jasmine unit tests. Before review and submission, I also validated UI performance with captures on Xbox One development hardware.

### The Free Camera

The Free Camera gives players real-time control over camera movement, field of view (FOV), time of day, and character visibility. As the camera system evolved on the engine side, I worked with the Unreal team to define and update the TypeScript pub/sub data contracts driving the controls.

<figure>
  <img src="/images/rare/custom-seas-photo-mode.jpg" alt="The in-game Free Camera with its movement settings panel">
  <figcaption>
    The Free Camera, built to work across standard 16:9 TVs, ultra-wide PC monitors, and mixed aspect ratios.
  </figcaption>
</figure>

Because console players typically play on 16:9 TVs while PC players use everything from standard screens to ultra-wide monitors, I built the HUD layout and CSS panel animations to adapt cleanly across mixed aspect ratios without obstructing the viewport.

### Quick Spawn Radial

The Quick Spawn radial extends the game's core radial menu so players can quickly select, assign, and spawn items or enemies on the fly.

<figure>
  <img src="/images/rare/custom-seas-command-menu.jpg" alt="Assigning a spawned item to the Quick Spawn radial">
  <figcaption>
    Assigning a spawned item to the Quick Spawn radial.
  </figcaption>
</figure>

Under the hood, I mapped out the existing radial menu behaviour, extended it to support dynamic slot assignment and spawning for Custom Seas, and added debug helpers and documentation for future development.

### Command Menu

The Command Menu is the full-screen interface where players browse categories of items and enemies, choose variants, and spawn them into the world for specific players. Any item in the menu can also be bound directly to a slot on the Quick Spawn radial for fast access during play.

<figure>
  <img src="/images/rare/custom-seas-spawn-menu.jpg" alt="The full-screen Command Menu showing crate and commodity categories and item variants">
  <figcaption>
    The Spawn Command Menu, where players browse, assign, and spawn items.
  </figcaption>
</figure>

## Technical Contributions

- **In-game creation tools:** Built the command toolbar, Free Camera, and Quick Spawn radial overlays in TypeScript, HTML, and Sass
- **Spawn Command Menu:** Built the full-screen item browsing, player targeting, and radial slot-assignment screens
- **Radial menu extension:** Extended and documented the radial menu system to support item assignment and spawning, adding debug tooling and Jasmine unit tests
- **Data contracts & testing:** Extended TypeScript data contracts with the engine team, covered by Jasmine unit tests and validated on Xbox development hardware
- **Code quality:** Championed stricter TypeScript null-checking rules in the editor workflow to catch potential null-reference issues early during development
