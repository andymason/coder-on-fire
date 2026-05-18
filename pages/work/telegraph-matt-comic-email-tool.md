---
title: The Telegraph's Matt comic email tool
tags: [React TypeScript JavaScript CSS HTML 5 WebAPI JSON Work]
socialImage: /images/matt-comics-social.jpg
thumbImage: /images/matt-comics-social-thumb.jpg
description: Web tool for creating email newsletter images of Matt comics
weight: 204
---

# The Telegraph's Matt comic email tool

<div class="video video--paused">
  <video poster="../video/matt-comics-demo.jpg" width="1280" height="720" playsinline disableremoteplayback x-webkit-airplay="deny" preload="none" >
     <source src="../video/matt-comics-demo.mp4" type="video/mp4" />
  </video>
</div>

## Challenge

The Telegraph's email newsletter team aimed to launch a weekly email featuring
all of Matt's cartoons from the week. However, two key challenges needed
addressing:

- How to transfer the comic images from the main website to the email CMS?
- How to update the comic header in the images with the correct weekday text?

## Solution

The digital comics were housed in the site's gallery pages. A site editor would
scan the comic, create a new page, and upload the image to the CMS. The site's
RSS feed served as an unofficial API, enabling me to scrape the comic images and
their publication dates.

I developed a React application that retrieved the latest RSS feed from Matt's
Gallery, extracted the images and dates, and stored them locally. The previous
week's comics were accessible either by inputting a date or through navigation,
triggering the relevant RSS feed fetch and parse.

Having acquired the data, I was prepared to create the custom email images using
the browser's Canvas API.

With the image URLs from the parsed data, I could retrieve and render the comic
images onto the `<canvas>`. The images, being hosted on a separate domain,
activated the browser's Cross-Origin Resource Sharing (CORS) protection. From
previous experience, I circumvented this by setting up a CORS image proxy, which
added `allow-all: *` response headers.

The next step involved adding the weekday text. I used transparent PNGs of each
weekday, created by Matt, to mask the original headline with a white box and
overlay the weekday image.

Finally, I implemented a download feature for email editors to export the custom
images. Utilising the Canvas API, I converted the image into a blob, transformed
it into a Data URL, and initiated a file download.

A subsequent feature addition the following week allowed for manual image
uploads, providing a safeguard against inconsistencies in the original gallery.

This tool enabled the successful launch of the new email newsletter within a
week, without requiring additional backend services.
