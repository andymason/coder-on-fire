---
title: Andrew Mason - Senior Frontend Engineer
description: Senior Frontend Engineer specialising in modern web UI, interactive applications, and design engineering. Previously worked for Rare, The Telegraph, The Guardian, and the BBC.
thumbImage: /images/blocks_no_webgl.jpg
pageId: homepage
---

# Andrew Mason

## Senior Frontend Engineer

I’ve spent over 15 years focused on the craft of building UI using web standards, with an emphasis on interaction and animation while paying close attention to performance and accessibility. I enjoy working closely with designers, prototyping ideas in code, refining the user experience, and building tools to improve workflows.

At Rare, I built game UI for [Sea of Thieves][custom-seas] and [Everwild][everwild-inventory]. At The Telegraph, I created [Milton][milton], an award-winning Figma plugin. At The Guardian, I delivered [live data visualisations][election] and led [VR projects][6x9].

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
      <li class="skill-group__item">UI Interaction, Accessibility</li>
      <li class="skill-group__item">Design Systems</li>
      <li class="skill-group__item">Prototyping &amp; Tooling</li>
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
