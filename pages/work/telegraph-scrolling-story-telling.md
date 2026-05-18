---
title: Storytelling with Scroll-Triggered Techniques
tags: [React, JavaScript, HTML, CSS, Animation, Work]
socialImage: /images/telegraph-scrollytelling/scrollytelling-demo.jpg
thumbImage: /images/telegraph-scrollytelling/scrollytelling-demo.jpg
description: Creation of a visual storytelling tool using scrolling to trigger image
  transitions and stacking text
weight: 2
---

# Engaging Storytelling with Scroll-Triggered Techniques

<div class="video video--paused">
  <video poster="/video/scrollytelling-demo.jpg" width="1280" height="720" playsinline disableremoteplayback x-webkit-airplay="deny" preload="none">
      <source src="/video/scrollytelling-demo.mp4" type="video/mp4" />
  </video>
</div>

## The Challenge

The Telegraph's Product team aimed to find more captivating methods for
storytelling. Their journalists possess compelling stories and outstanding
photography; however, some narratives demanded a bespoke approach to highlight
their unique aspects.

Assigned to collaborate with a designer, my task involved devising innovative
methods to present traditional article content, considering the limitations of
the existing Content Management System (CMS).

## Solution

The optimal strategy involved authoring content as usual within the CMS, but
enriching it with animations and style enhancements. This approach allowed
editorial staff to maintain their standard workflow, while facilitating seamless
integration of my modifications in future CMS updates.

A key objective was to enhance the visibility of imagery in articles. To achieve
this, I employed a mix of `grid-template-columns` overrides and
`position: sticky`, along with the `IntersectionObserver()` API. This technique
utilized the entire viewport, ensuring images remained visible as users
scrolled.

Determining the right animations required careful consideration of factors like
duration, easing functions, and trigger points. These elements significantly
influenced the content's tone, ranging from a somber feel with slow easing
transitions to a more dynamic atmosphere with exponential curves. The most
effective method for selecting appropriate values involved hands-on
experimentation. Therefore, I developed an editor that allowed designers to test
various settings.

<figure>
  <picture>
    <img src="/images/scrolling-social.jpg" alt="Screenshot of in-browser editor" />
  </picture>
  <figcaption>
    The in-browser editor enabled real-time experimentation.
  </figcaption>
</figure>

The project "[One Year Look Back at Covid Lockdown][lockdown]" was the inaugural
initiative to utilize this tool. It featured transitioning photography with
overlaid text, providing context to the images as they scrolled past.

Readers responded positively, appreciating the enhanced focus on imagery
juxtaposed with emotionally resonant writing, and commended the inventive
approach to a sensitive topic.

[lockdown]: https://www.telegraph.co.uk/news/0/coronavirus-lockdown-year-anniversary-photos/
