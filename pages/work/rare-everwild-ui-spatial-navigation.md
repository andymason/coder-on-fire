---
title: Rare - Everwild inventory UI and spatial navigation
tags: [TypeScript, SolidJS, JavaScript, CSS, UI, GameDev, Work]
thumbImage: /images/everwild/everwild-hero-logo.jpg
description: Built the inventory HUD for Rare's Everwild in TypeScript and SolidJS, including a bespoke spatial navigation system for gamepad, mouse, and keyboard.
weight: -3
---

# {{ title }}

![Everwild](/images/everwild/everwild-hero-logo.jpg)

For Rare's Everwild, I worked as a UI Engineer within a small UI team building out the inventory HUD in TypeScript and SolidJS. Alongside HUD screens, I designed and built a bespoke spatial navigation system for gamepad, keyboard, and mouse, paired with a real-time canvas debug visualiser.

## The Challenge

The inventory HUD was a core part of the game's interface, allowing players to browse, filter, and interact with their items. Because the game was in active development, the UI had to support rapid design changes while feeling natural across gamepad, keyboard, and mouse.

Rather than a standard table of rows and columns, the design explored organic, radial, and asymmetric layouts. The navigation system had to make directional movement feel predictable across these freeform layouts without hardcoding element relationships that would break every time a designer moved a component.

## The Stack

The UI was built with web technologies running inside Unreal Engine via Coherent Gameface, giving us a fast frontend workflow on top of the game engine:

- **TypeScript** for application logic, Unreal data contracts, and the spatial navigation engine
- **SolidJS** for reactive UI components, custom hooks, and context state
- **HTML5 Canvas** for the decoupled, real-time debug visualiser
- **Vite** for local browser development and build tooling
- **CSS/Sass** for layout, animation, and visual styling
- **Jasmine** for unit testing UI logic, navigation behaviour, and engine data contracts
- **Coherent Gameface** as the bridge between the web UI and Unreal Engine

## The Solution

I worked closely with designers to turn Figma concepts into interactive UI, using playtesting sessions to refine layout, interaction states, and controller feel. Controller navigation often exposes edge cases that aren't obvious in static design files, so iterating in live builds was essential.

I also collaborated with the engine team to define TypeScript data contracts between the UI and Unreal Engine, matching the frontend data model to Unreal Blueprints and engine-side events.

### Spatial Navigation

<figure>
  <img src="/images/everwild/everwild-sphear-grid.jpg" alt="Debug visualiser UI showing the sphere grid navigation">
  <figcaption>
    Testing directional navigation across a non-grid radial layout using the debug visualiser.
  </figcaption>
</figure>

Unlike a conventional grid-based UI where moving left, right, up, or down simply steps through row and column indices, Everwild's HUD mixed radial clusters, filters, categories, and contextual controls that didn't align to a shared grid.

Before building our system, I researched existing approaches to directional focus in web UI, including:

- the BBC's [LRUD-Spatial library](https://github.com/bbc/lrud-spatial)
- Spotify's article on [TV Spatial Navigation](https://engineering.atspotify.com/2023/5/tv-spatial-navigation)
- Ryosuke Hana's article on [spatial navigation in React](https://whoisryosuke.com/blog/2024/focus-and-spatial-navigation-in-react/)

To make the system easy for the rest of the UI team to adopt, I exposed it through a reusable Focus Group component and custom SolidJS hooks, backed by developer documentation. Connecting to the game's input handler, a focus history stack tracked the player's path through the UI hierarchy (for example, moving through `Inventory → Section → Category → Item`) so pressing Back unwound that path step by step.

Groups and elements supported configurable behaviours for common game UI patterns:

- **Modal capture & interruptions:** If a confirmation modal appeared, focus jumped to it immediately and locked inside the modal until dismissed, before restoring the previously focused element.
- **Looping & directional locks:** Groups could wrap focus around at the edges of a row or radial cluster, or restrict which directions an element accepted movement from so focus never escaped a control unexpectedly.
- **Scrollable containers:** Moving focus through a fixed-size scrolling list automatically drove its scroll position to bring off-screen items into view.

### Geometric Lookup Across Non-Grid Layouts

Standard grid layouts make it easy to infer which element sits above, below, left, or right of the current focus. Freeform layouts needed a geometric approach.

To avoid expensive layout recalculations on every button press, the engine cached element bounds and only updated them when layouts or scroll offsets changed. When the player pressed a direction on the controller, the system measured from the outer edge of the currently focused element and used trigonometry to score candidate targets by angle and distance.

Rather than checking every element on screen at once, the lookup followed the UI's group hierarchy, searching sibling elements within the active focus group first and only stepping up to neighbouring groups if no match was found in that direction.

### Making Navigation Visible with a Canvas Visualiser

Once you combine trigonometric scoring, group boundaries, scrolling lists, and focus history, it becomes hard to tell from console logs alone why focus jumped to a particular item. To make the system's decisions visible without touching the game UI, I built a live debug overlay rendered onto a single HTML5 canvas across the top of the screen.

<figure>
  <img src="/images/everwild/spatial-navigstion-debug-visualizer.png" alt="Screenshot of spatial navigation visualiser">
  <figcaption>
    The debug visualiser tracing the player's navigation journey, focus state, and history stack.
  </figcaption>
</figure>

Because the canvas sat on top with pointer events disabled, gamepad, keyboard, and mouse input passed straight through to the HUD underneath, keeping the visualiser completely decoupled from the production DOM.

Toggled via a URL parameter during browser development or from the in-game debug menu, the visualiser drew colour-coded bounding boxes around focusable elements and groups, traced a visual trail of the focus history stack, and displayed live node and stack metrics in a side panel.

This turned an invisible system into something the whole team could see and point at. Designers could immediately understand why focus landed on a particular element, engineers could verify edge cases in seconds, and we could tune non-grid layouts together against the same live view.

## Technical Contributions

- **Spatial navigation engine:** Designed and built a bespoke directional navigation system in TypeScript using cached bounding rects, edge-based trigonometry, and hierarchical parent-child tree lookups
- **SolidJS API & documentation:** Created reusable focus group components, custom SolidJS hooks, and developer documentation, backed by a lightweight Context state
- **Scroll & focus management:** Implemented focus history stacks, priority modal capture, directional locks, looping, and dynamic scroll-into-view handling for overflow containers
- **Canvas debug tooling:** Built a decoupled HTML5 Canvas visualiser overlay (toggled via URL params or the in-game debug menu) to inspect focus groups, history paths, and metrics without touching the production DOM
- **UI & engine integration:** Built inventory HUD screens in SolidJS, CSS, and Sass, defining TypeScript data contracts with Unreal Engine covered by Jasmine unit tests
