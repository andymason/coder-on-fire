---
title: Andrew Mason - Senior Frontend Developer
description: Senior Frontend Developer with extensive experience in creating interactive UIs, visualizations, and rapid prototyping. Previously worked for Rare, BBC, Guardian and Telegraph
thumbImage: /images/blocks_no_webgl.jpg
pageId: homepage
---

# Andrew Mason

## Senior Frontend Developer

I'm a senior front-end developer who builds interactive web experiences, data
visualisations, and game UI. I've built game UI at Rare (Xbox Game Studio) for
[Sea of Thieves][custom-seas] and [Everwild][everwild-inventory], created
interactive stories and an open-source [Figma plugin][milton] at The
Telegraph, and led [VR projects][6x9] and [live data dashboards][election] at
The Guardian.

## Skills and knowledge

<div id="skills">
  <div class="skill-group">
    <h3 class="skill-group__title">Languages</h3>
    <ul class="skill-group__list">
      <li class="skill-group__item">TypeScript / JavaScript</li>
      <li class="skill-group__item">CSS / Sass</li>
      <li class="skill-group__item">HTML</li>
    </ul>
  </div>

  <div class="skill-group">
    <h3 class="skill-group__title">Frameworks &amp; Libraries</h3>
    <ul class="skill-group__list">
      <li class="skill-group__item">React, SolidJS, Preact</li>
      <li class="skill-group__item">Three.js, 2D Graphics APIs</li>
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
      <li class="skill-group__item">Prototyping &amp; R&amp;D</li>
      <li class="skill-group__item">Interactive multimedia</li>
      <li class="skill-group__item">Data visualisation</li>
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

[custom-seas]: /work/rare-sea-of-thieves-custom-seas
[everwild-inventory]: /work/rare-everwild-ui-spatial-navigation
[milton]: /work/telegraph-milton-figma-html-export-plugin
[6x9]: /work/the-guardian-6x9-virtual-reality
[election]: /work/the-guardian-scottish-independence-dashboard
