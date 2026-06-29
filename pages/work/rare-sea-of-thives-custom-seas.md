---
title: Rare - Sea of Thieves Custom Seas UI
tags: [TypeScript, JavaScript, CSS, UI, GameDev]
thumbImage: /images/rare/sea-of-thieves-custom-seas-free-camera.jpg
description:
    Built the in-game command tools and spawn UI for Sea of Thieves' Custom
    Seas: the Free Camera, Quick Commands radial, and Command Menu spawn
    screens.
weight: -1
---

# Rare - Sea of Thieves Custom Seas UI

![The Quick Commands radial open over the game in Sea of Thieves](/images/rare/sea-of-thieves-custom-seas-quick-commands-radial.jpg)

For Sea of Thieves, I worked as a UI engineer on Custom Seas, a new mode that lets players set up their own games. I built the UI for the in-game command toolbar, the Free Camera (photo mode), and the full-screen spawn Command Menu.

## The challenge

Custom Seas was a large project with a lot of moving parts. My focus was to build out the UI for two main parts: the full-screen spawn Command Menu and in-game tools. The in-game tools included the command toolbar, Free Camera, and Quick Spawn radial, all of which had to render over a live game world, so DOM updates and CSS had to stay performant.

## The solution

I built all of this in the Sea of Thieves UI framework, which runs on Coherent Gameface, using TypeScript, CSS, and Sass. I worked with the engine team on the TypeScript data contracts between the UI and the engine, using and adjusting them as the feature needed. As with all of the UI, I covered my work with Jasmine unit tests.

<figure>
  <img src="/images/rare/sea-of-thieves-custom-seas-free-camera.jpg" alt="The in-game Free Camera with its movement settings panel">
  <figcaption>
    The Free Camera, built to work across standard, ultra-wide, and mixed aspect ratios
  </figcaption>
</figure>

### The Free Camera

The Free Camera is a photo mode that allows players to move freely through the world to take screenshots. I built the UI to work across standard, ultra-wide, and mixed aspect ratios, used CSS animations for transitions, and collaborated with the Unreal Engine team to refine the TypeScript data contracts.

### Quick Spawn Radial

The Quick Spawn radial was the most complex interaction piece. It extends the game's radial menu to handle selecting, spawning, and assigning items and enemies, paged so a long list stays easy to use on a controller.

<figure>
  <img src="/images/rare/sea-of-thieves-custom-seas-spawn-radial-assign.jpg" alt="Assigning a spawned item to the Quick Spawn radial">
  <figcaption>
    Assigning a spawned item to the Quick Spawn radial
  </figcaption>
</figure>

### Command Menu

The command menu is the full-screen interface that lets players browse game items, and pick and spawn them for chosen players. Any item can also be assigned from here to the Quick Spawn radial for quick access during play.

<figure>
  <img src="/images/rare/sea-of-thieves-custom-seas-spawn-command-menu.jpg" alt="The full-screen Command Menu showing crate and commodity categories and item variants">
  <figcaption>
    The Spawn Command Menu, where players browse and spawn items
  </figcaption>
</figure>

## Technical contributions

- **In-game UI:** Built the in-game command bar, Free Camera, and Quick Commands radial
- **Spawn tooling:** Built the Command Menu spawn screens and the flow for spawning items and enemies and assigning them to the radial
- **Code quality:** Championed the adoption of TypeScript strict null checking
- **Data contracts:** Defined and iterated on TypeScript data contracts with the Unreal Engine team
- **Testing:** Covered all UI logic and controller interactions with Jasmine unit tests
- **Visual styling:** Implemented the Figma designs in CSS and Sass

Custom Seas was one of the largest UI features I've shipped on a live-service game. The mix of performance constraints, cross-discipline collaboration made it a highlight of my time at Rare.
