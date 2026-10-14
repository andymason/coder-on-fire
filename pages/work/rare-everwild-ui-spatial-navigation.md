---
title: Rare — Everwild inventory UI and spatial navigation
tags: [TypeScript, SolidJS, JavaScript, CSS, UI, GameDev, Work]
thumbImage: /images/everwild/everwild-hero-logo.jpg
description: Built the inventory HUD for Rare's Everwild in TypeScript and SolidJS, including a bespoke spatial navigation system for gamepad, mouse, and keyboard.
weight: -3
---

# {{ title }}

![Everwild](/images/everwild/everwild-hero-logo.jpg)

For Rare's Everwild, I worked as a UI Engineer within a small UI team building out the inventory HUD in TypeScript and SolidJS. Alongside HUD screens, I designed and built a bespoke spatial navigation system for gamepad, keyboard, and mouse, backed by a `<canvas>` debug visualiser.

## The Challenge

The inventory HUD was a core part of the game's interface, allowing players to browse, filter, and interact with their items. Because the game was in active development, the UI had to support rapid design changes while feeling natural across gamepad, keyboard, and mouse.

Rather than a standard table of rows and columns, the design explored organic, radial, and asymmetric layouts. The navigation system had to make directional movement feel predictable across these freeform layouts without hardcoding element relationships that would break every time a designer moved a component.

## The Stack

The UI was built with web technologies running inside Unreal Engine via Coherent Gameface, allowing us to use a fast frontend workflow on top of the game engine:

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

Drawing on this research, I designed the navigation system around three composable concepts: a focus history stack, `<FocusGroup>` containers, and geometric target selection.

**Developer API and focus architecture**

To make the system easy for the UI team to adopt, I exposed it through a `<FocusGroup>` component and custom SolidJS hooks, backed by developer documentation. Under the hood, a lightweight Context store managed state using typed arrays and unique IDs for each registered group.

Connecting to the game's normalised input handler, the focus stack tracked the player's path through the UI hierarchy so they could navigate forwards and backwards predictably—for example, moving through `Inventory → Section → Category → Item` and unwinding that path step by step when pressing Back.

It also handled priority interruptions: if a confirmation modal appeared, focus moved to it immediately, then returned to the previously focused element once the modal was dismissed.

On top of basic movement, groups and elements supported configurable behaviours:

- **Looping:** reaching the edge of a group wraps focus back to the start of that row, column, or cluster
- **Capturing:** locks focus inside a single group, ignoring other focusable elements on screen—ideal for modals and popups
- **Restricted directions:** limits which directions an element accepts movement from, so focus never escapes a control in a way that feels wrong to the player
- **Scrollable regions:** moving focus through a fixed-size scrolling container drives its scroll position, bringing off-screen items into view
- **Focus callbacks:** elements emit `onFocus` and `onBlur` events carrying their ID and data, giving game logic a clean hook into whatever the player currently has selected

**Non-grid navigation & scroll containers**

Standard grid layouts make it trivial to infer which element sits above, below, left, or right of the current focus. Arbitrary non-grid layouts needed a geometric approach.

To avoid expensive layout recalculations on every input, the system cached element bounds from `getBoundingClientRect()`. When the player pressed a direction, it started from the outer edge of the currently focused element corresponding to the direction of travel, and used trigonometry to evaluate the angle and distance to candidate targets.

Rather than brute-forcing every element on screen, the lookup followed the UI's hierarchy:

1. Search sibling elements within the current `<FocusGroup>` first.
2. If no valid sibling exists in that direction, step up the tree to find the nearest `<FocusGroup>` in the direction of travel, then resolve down into its child elements.

One of the trickiest edge cases was handling fixed-width and fixed-height scrolling containers with `overflow`. As the player moved focus through a scrollable list, off-screen child items had to be scrolled into view dynamically, which meant the position cache and distance calculations had to account for overflow clipping and changing scroll offsets.

### Making navigation visible with a `<canvas>` visualiser

As the trigonometric lookup and group rules grew more sophisticated, reasoning about focus jumps through code or console logs alone became difficult. Which element won could depend on edge geometry, parent group boundaries, scroll offsets, or focus history.

To make the navigation behaviour visible without polluting the game UI, I built a debugging visualiser rendered onto a single HTML5 `<canvas>` layered over the top of the screen.

<figure>
  <img src="/images/everwild/spatial-navigstion-debug-visualizer.png" alt="Screenshot of spatial navigation visualiser">
  <figcaption>
    The debug visualiser tracing the player's navigation journey, focus state, and history stack. <br/> Note: The screenshot is of a standalone development demo and contains no confidential project UI.
  </figcaption>
</figure>

Using a `<canvas>` with `pointer-events: none` meant all semi-transparent bounding boxes, focus trails, and text metrics were drawn in a single pass. Gamepad, keyboard, and mouse input passed straight through, and the production DOM stayed completely untouched—keeping the visualiser cleanly decoupled from the main UI codebase.

Toggled via a URL parameter during browser development or from the in-game debug menu, the visualiser drew:

- colour-coded bounding boxes and outlines around focusable elements and their parent `<FocusGroup>` containers
- the active focus state and a visual trail of the history stack showing the exact path taken
- real-time metrics in a side panel, including active nodes, container counts, and history stack depth

This turned an invisible system into something the whole team could see and point at. Designers could immediately understand why focus landed on a particular element, engineers could verify edge cases in seconds, and we could tune non-grid layouts together against the same live view.

## Technical Contributions

- **Spatial navigation engine:** Designed and built a bespoke directional navigation system in TypeScript using cached bounding rects, edge-based trigonometry, and hierarchical parent-child tree lookups
- **SolidJS API & documentation:** Created `<FocusGroup>` components, custom SolidJS hooks, and developer documentation, backed by a lightweight Context state with typed arrays
- **Scroll & focus management:** Implemented focus history stacks, priority modal capture, directional locks, looping, and dynamic scroll-into-view handling for overflow containers
- **Canvas debug tooling:** Built a decoupled HTML5 `<canvas>` visualiser overlay (toggled via URL params or the in-game debug menu) to inspect focus groups, history paths, and metrics without touching the production DOM
- **UI & engine integration:** Built inventory HUD screens in SolidJS, CSS, and Sass, defining TypeScript data contracts with Unreal Engine covered by Jasmine unit tests
