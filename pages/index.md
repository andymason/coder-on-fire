---
title: Andrew Mason - Senior Frontend Developer
description: Senior Frontend Developer with extensive experience in creating interactive UIs, visualizations, and rapid prototyping. Previously worked for Rare, BBC, Guardian and Telegraph
thumbImage: /images/blocks_no_webgl.jpg
pageId: homepage
---

# Andrew Mason

## Senior Frontend Developer

With over 15 years of experience as a senior front-end developer,
I specialise in creating accessible web interfaces using the
latest technologies, including TypeScript and best design
practices. My career highlights include leading [award-winning projects](./work/the-guardian-6x9-virtual-reality.md)
at The Guardian, developing [Figma plugins](./work/telegraph-milton-figma-html-export-plugin.md)
at The Telegraph, and building [game UI](./work/rare-sea-of-thieves.md) at Microsoft
Studios . I thrive in fast-paced, collaborative environments and
am passionate about pushing the boundaries of web development.

## Skills and knowledge

<div id="skills">
  <div class="skill-group">
    <h3 class="skill-group__title">Programming</h3>
    <ul class="skill-group__list">
      <li class="skill-group__item">TypeScript</li>
      <li class="skill-group__item">JavaScript</li>
      <li class="skill-group__item">HTML, CSS</li>
      <li class="skill-group__item">HTTP APIs</li>
    </ul>
  </div>

  <div class="skill-group">
    <h3 class="skill-group__title">Software</h3>
    <ul class="skill-group__list">
      <li class="skill-group__item">React, Preact</li>
      <li class="skill-group__item">Webpack, Esbuild</li>
      <li class="skill-group__item">Unit Tests, Jasmine</li>
      <li class="skill-group__item">Git, Perforce</li>
    </ul>
  </div>

  <div class="skill-group">
    <h3 class="skill-group__title">UI development</h3>
    <ul class="skill-group__list">
      <li class="skill-group__item">Responsive design</li>
      <li class="skill-group__item">Accessibility, WAI</li>
      <li class="skill-group__item">Browser Testing</li>
      <li class="skill-group__item">Mobile optimization</li>
    </ul>
  </div>

  <div class="skill-group">
    <h3 class="skill-group__title">Cloud &amp; OS</h3>
    <ul class="skill-group__list">
      <li class="skill-group__item">AWS, Azure, GCP</li>
      <li class="skill-group__item">Serverless functions</li>
      <li class="skill-group__item">CDNs, REST APIs</li>
      <li class="skill-group__item">Linux, Mac, Windows</li>
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
