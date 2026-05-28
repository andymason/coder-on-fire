---
title: The Telegraph's Variable Fonts Transition
tags: [Typography, Node.js, React, JavaScript, CSS, Work]
thumbImage: /images/variable-font-social.jpg
description: Custom built browser tool to visually explore variable font settings on a
  live web page.
weight: 106
---

# Enhancing The Telegraph's Typography with Variable Fonts

{%
  include "video",
  poster: "/video/variable-font-demo.jpg",
  src: "/video/variable-font-demo.mp4"
%}

## The Challenge

The Telegraph's website utilises a specially commissioned web font family,
Austin News. However, due to performance limitations, designers had access to
only a limited selection of this font family.

My challenge was to expand the range of Austin News styles available on the
website without compromising site performance.

## The Solution

I obtained a variable font version of Austin News from the original font
foundry. This allowed me to create a set of optimised WOFF2 font files. To
effectively optimise these files, I first needed to understand the existing
font's usage on the site.

An audit was conducted to identify the most frequently used characters. I
developed a Node.js script to analyse the top ten thousand articles on the site,
tallying the most commonly used characters. This analysis enabled me to define
the optimal Unicode range for the base fonts.

![Top 100 most common characters on the Telegraph website](/images/variable-font-unicode-tables.png)

I then designed a visual tool enabling designers to adjust each font variation
setting using sliders. These adjustments, along with the defined Unicode range,
were used to generate the WOFF2 files and the corresponding CSS code.

The introduction of the variable font on the site was met with enthusiasm from
both designers and developers. It provided designers with access to the full
spectrum of the font family's styles while reducing the total number and size of
files downloaded.
