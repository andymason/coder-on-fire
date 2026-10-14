---
title: Andrew Mason - Senior Frontend Developer
description: Senior Frontend Developer specialising in modern web UI, interactive applications, and design engineering. Previously worked for Rare, The Telegraph, The Guardian, and the BBC.
thumbImage: /images/blocks_no_webgl.jpg
pageId: homepage
---

# Andrew Mason

## Senior Frontend Developer

I'm a senior front-end developer specialising in modern web UI, interactive
applications, and design engineering. I've built game UI at Rare (Xbox Game
Studio) for [Sea of Thieves][custom-seas] and [Everwild][everwild-inventory],
created interactive stories and an open-source [Figma plugin][milton] at The
Telegraph, and delivered [live data visualisations][election] and [interactive
media][6x9] at The Guardian.

## Skills and knowledge

<div id="skills">
  <div class="skill-group">
    <h3 class="skill-group__title">Languages</h3>
    <ul class="skill-group__list">
      <li class="skill-group__item">TypeScript / JavaScript</li>
      <li class="skill-group__item">CSS / Sass</li>
      <li class="skill-group__item">HTML / SVG</li>
    </ul>
  </div>

  <div class="skill-group">
    <h3 class="skill-group__title">Frameworks &amp; Runtime</h3>
    <ul class="skill-group__list">
      <li class="skill-group__item">React, SolidJS, Preact</li>
      <li class="skill-group__item">Web APIs, DOM, Canvas</li>
      <li class="skill-group__item">Node.js</li>
    </ul>
  </div>

  <div class="skill-group">
    <h3 class="skill-group__title">Tooling &amp; Testing</h3>
    <ul class="skill-group__list">
      <li class="skill-group__item">Vite, Webpack, esbuild</li>
      <li class="skill-group__item">Jasmine, Vitest</li>
      <li class="skill-group__item">Git, Perforce</li>
    </ul>
  </div>

  <div class="skill-group">
    <h3 class="skill-group__title">Specialisms</h3>
    <ul class="skill-group__list">
      <li class="skill-group__item">Web UI &amp; Design Systems</li>
      <li class="skill-group__item">Design &amp; Developer Tools</li>
      <li class="skill-group__item">Prototyping &amp; R&amp;D</li>
    </ul>
  </div>
</div>

## Work

<ul class="projects">
{%- for post in collections.SortedWork %}
  <li class="project-item">
    <a href="{{ post.url }}">
      <img eleventy:widths="320,600" src="{{ post.data.thumbImage }}" alt="">
      <span>{{ post.data.title }}</span>
    </a>
  </li>
{%- endfor %}
</ul>

[custom-seas]: /work/rare-sea-of-thieves-custom-seas/
[everwild-inventory]: /work/rare-everwild-ui-spatial-navigation/
[milton]: /work/telegraph-milton-figma-html-export-plugin/
[6x9]: /work/the-guardian-6x9-virtual-reality/
[election]: /work/the-guardian-scottish-independence-dashboard/
