---
title: The Telegraph - Variable font subsetting and live typography tool
tags:
  [TypeScript, Preact, JavaScript, Node.js, CSS, Typography, Performance, Work]
thumbImage: /images/variable-font-social.jpg
description: Audited 10,000 articles to subset The Telegraph's custom variable font and built an in-page Preact inspector with an X-Ray comparison mode.
weight: 106
---

# {{ title }}

{%
  include "video",
  poster: "/video/variable-font-demo.jpg",
  src: "/video/variable-font-demo.mp4"
%}

For The Telegraph, I led the technical investigation into replacing the site's static web fonts with a variable version of its custom typeface, Austin News. I ran a character-frequency audit across 10,000 articles to define optimal font subsets and built an in-page typography inspector in TypeScript and Preact so designers could fine-tune variation axes against live articles.

## The Challenge

The Telegraph uses a commissioned typeface family, Austin News, across headlines, standfirsts, and body copy. Because each static weight and optical style required a separate font file download, the site only loaded a small handful of weights to stay within its performance budget.

Designers wanted access to the full typographic range, including intermediate weights, widths, and optical sizes, without increasing the total font payload downloaded by readers.

## The Stack

- **TypeScript & Preact** for the injectable in-page typography inspector
- **CSS Custom Properties & Variable Font APIs** for real-time axis and OpenType feature updates
- **Node.js & opentype.js** for parsing font binaries, auditing character usage, and generating Unicode range tables
- **esbuild** for bundling the tool into a single script that could run on live article pages

## The Solution

### Auditing 10,000 Articles for Unicode Subsetting

The foundry supplied candidate variable font builds combining upright and italic styles across Text, Deck, and Headline optical sizes. Before generating production WOFF2 files, I needed to know which characters were actually used on the site so we could strip out unused glyphs.

I wrote a Node.js script to analyse 10,000 Telegraph articles and count every character occurrence, then built a visual Unicode table generator to map the top 100 characters.

![Top 100 most common characters on the Telegraph website](/images/variable-font-unicode-tables.png)

The data showed that almost all article text was covered by standard Basic Latin characters plus just 12 specific punctuation and currency glyphs (`£`, `€`, `é`, `è`, dashes, curly quotes, bullets, and ellipses).

Using this, I split the font delivery into two tiers via CSS `unicode-range`:

- A lean **base WOFF2 subset** containing only Basic Latin and those 12 high-frequency characters, downloaded by every reader
- A **Latin-1 supplement subset** that the browser only fetches on demand when an article contains less common accented characters

### Inspecting Font Binaries and Building the Live Explorer

To help designers evaluate the new font files in context rather than in static design tools, I used `opentype.js` to extract the available axes and named instances from the font binaries, then built an overlay tool that mounted directly onto live Telegraph article pages.

The inspector targeted live page elements (headlines, standfirsts, body copy, and story links) and updated their styles in real time through CSS custom properties. For each text style, designers could adjust:

- **Variation axes:** Weight, Width, and Optical Size
- **Typography metrics:** Font size and line height
- **OpenType features:** Kerning, standard ligatures, and capital spacing

### "X-Ray" Overlay Comparison and URL Sharing

When matching a variable font against existing static fonts, subtle shifts in glyph width or x-height can change how headlines wrap across lines. Switching fonts on and off makes those small differences hard to spot.

To solve this, I built an **X-Ray comparison mode**. Toggling X-Ray mode rendered the original static font in semi-transparent magenta and the variable font overlay directly on top in cyan, letting designers inspect character alignment, optical sizing, and line wrapping pixel-for-pixel.

Once a designer found a configuration they liked, they could add a note and click **Share** to encode the current settings into the page URL and copy the link to their clipboard, making it easy to share exact typographic presets across the team.

## Technical Contributions

- **Character frequency audit:** Analysed 10,000 Telegraph articles in Node.js to identify the top 100 characters and define data-driven WOFF2 subsets
- **Unicode-range architecture:** Split the variable font into a lightweight base subset and an on-demand supplement, reducing total font payload while unlocking the full range of weights and optical sizes
- **OpenType parsing:** Built scripts with `opentype.js` to inspect font binaries and extract axis bounds and named instances
- **In-page Preact inspector:** Created an interactive toolbar for adjusting variable font axes, metrics, and OpenType features in real time on live articles
- **X-Ray diffing & state sharing:** Built a dual-colour overlay mode for pixel-level glyph comparison and URL state sharing for presets
