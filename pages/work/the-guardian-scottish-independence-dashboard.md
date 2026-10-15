---
title: The Guardian — Scottish independence referendum live dashboard
tags: [JavaScript, D3.js, SVG, Node.js, AWS, S3, HTML, CSS, Work]
thumbImage: /images/scottish_independence/scottish_independence_mobile_1080x.png
description: Built the live results data pipeline and interactive D3.js dashboard for The Guardian's coverage of the 2014 Scottish independence referendum.
weight: 4
---

# {{ title }}

<figure>
  <img
    src="/images/scottish_independence/scottish_independence_mobile_1080x.png"
    alt="Three mobile screens showing the national gauge, interactive council map with Dumfries and Galloway selected, and the sortable results table"
    loading="eager"
    fetchpriority="high"
    sizes="(min-width: 1080px) 1080px, 100vw"
  >
  <figcaption>
    The responsive mobile views: the national vote gauge, the council map and search panel, and the sortable results table.
  </figcaption>
</figure>

In September 2014, more than 3.6 million people—an 84.6% turnout—voted on the question: _"Should Scotland be an independent country?"_ Working in The Guardian's Interactive team alongside another frontend developer, I built the [live results dashboard][guardian-scotland-results] in D3.js and SVG, as well as the Node.js and AWS S3 data pipeline that powered our coverage through the night.

## The Challenge

As the polls closed on 18 September, all 32 Scottish council areas counted ballots overnight and declared their results one by one into the early hours of the morning. Our dashboard had to give readers an up-to-the-minute picture of both the national race to the 50% threshold and the local breakdown across every council.

We had two main engineering challenges:

- **Surviving referendum-night traffic spikes:** Millions of readers would have the page open at the same time, polling for live updates every 30 seconds. Neither our external data feeds nor the Google Spreadsheets used by journalists in the newsroom could be exposed directly to reader traffic.
- **Unpredictable live data:** Incoming results from our election data supplier arrived as zipped CSV drops on a heavily loaded SFTP server, alongside live spreadsheet updates from the newsroom. Both the backend pipeline and the browser client had to handle timeouts, recounts, and messy data without breaking the UI.

## The Stack

- **JavaScript (AMD)** for modular client-side application architecture
- **D3.js & SVG** for the national half-donut gauge, council breakdown charts, and interactive choropleth map
- **PubSubJS** for event-driven rendering across all dashboard views
- **Lodash, Underscore.js & jQuery** for payload diffing, client-side table templating, and cross-browser DOM/AJAX support
- **Node.js (on AWS EC2)** for polling the SFTP feed and newsroom Google Sheet, decompressing archives, and transforming CSVs into JSON
- **Amazon S3 & CDN** for serving static JSON payloads with short-TTL cache headers

## The Solution

### Data Ingestion Pipeline and CDN Caching

Before referendum night, I worked with our external election data supplier to integrate their live results feed. They published updates as compressed `.zip` archives containing CSV files to an SFTP server. Because dozens of media organisations were polling the same server all night, connections frequently timed out.

I built a Node.js service on an AWS EC2 instance that ran on a timer to:

1. **Fetch & sort:** Connect to the SFTP server with timeout and retry logic, check the directory listing, and sort drops by timestamp so we only downloaded the newest archive.
2. **Decompress & transform:** Unzip the archive, parse the CSV rows, and merge them with our newsroom's Google Spreadsheet into a single normalised JSON format.
3. **Publish to S3:** Upload the JSON to an Amazon S3 bucket behind our CDN with a short cache TTL. The CDN absorbed the massive read traffic from millions of open browsers, while still delivering new council declarations within seconds.

On the client side, the dashboard polled the CDN JSON endpoint every 30 seconds. To avoid unnecessary DOM updates and SVG redraws when no new councils had declared, the data layer deep-compared each incoming payload against the previous state in memory and only triggered a re-render when the numbers changed. It also sanitised messy inputs—stripping formatting, guarding against spreadsheet formula errors, handling recount states, and retrying failed fetches—with a manual JSON fallback ready in case of an emergency.

### Synchronised D3.js and SVG Views

<figure>
  <img
    src="/images/scottish_independence/scottish_independence_desktop_1080x.png"
    alt="Desktop view of The Guardian's Scottish independence referendum dashboard showing the national half-donut gauge, electorate progress bar, and choropleth council map"
    loading="lazy"
    sizes="(min-width: 1080px) 1080px, 100vw"
  >
  <figcaption>
    The desktop dashboard showing the national vote share, electorate-weighted declaration progress, and interactive council map.
  </figcaption>
</figure>

Each visual component subscribed to a central pub/sub event bus, allowing my teammate and me to build and test the views as independent modules:

- **National & local vote gauges:** Semi-circular D3 donut charts bisected by a dashed 50% halfway line, updating live as votes came in.
- **Electorate-weighted progress bar:** Rather than sizing all 32 councils equally, each council block was scaled proportionally to its electorate and ordered by declaration time. Hovering or clicking a block cross-highlighted that council on the map, while the floating counter clamped its position at the edges so it never clipped on small screens.
- **Interactive council map & search:** An SVG choropleth map colouring each council as Yes, No, Tied, or Undeclared, paired with an inline typeahead search box and a mini D3 gauge for inspecting individual council results.
- **Sortable results table:** A responsive table for sorting councils by name, turnout, vote count, or vote share, using inline two-way percentage bars and hiding secondary columns on mobile screens.

### Referendum Night in the Newsroom

In 2014, Guardian interactives still needed to work reliably in Internet Explorer 8 and 9 alongside modern mobile and desktop browsers. During testing, we worked around legacy IE bugs—including writing a custom XML-to-DOM node importer when IE9 failed to import the external SVG map, and adding cross-domain request fallbacks for polling S3.

On the night of the vote, I worked the overnight shift in the newsroom until 5am alongside the journalists and the Head of Interactive, monitoring the EC2 ingestion service and live dashboard. As councils declared through the early hours, watching the real-time traffic graphs climb higher and higher—knowing hundreds of thousands of readers had the page open with the auto-refresh quietly ticking away—was one of the highlights of my time at The Guardian. While the dashboard itself was built specifically for the Scottish vote, the data pipeline and caching approach shaped how we delivered subsequent live election interactives.

## Technical Contributions

- **SFTP & Google Sheets data pipeline:** Built the Node.js service on AWS EC2 with timeout/retry handling, timestamp sorting, `.zip` decompression, CSV-to-JSON transformation, and S3 uploads
- **High-traffic CDN caching & polling:** Configured short-TTL S3/CDN caching paired with 30-second client polling, payload diffing, defensive data parsing, and retry thresholds
- **D3.js & SVG visualisations:** Collaborated on the D3 vote gauges, electorate-weighted progress bar, interactive SVG council map with typeahead search, and sortable results table
- **Cross-browser & responsive delivery:** Built responsive mobile and desktop layouts inside the Guardian's iframe wrapper, including legacy IE8/9 SVG and CORS fallbacks

[guardian-scotland-results]: https://www.theguardian.com/politics/ng-interactive/2014/sep/18/-sp-scottish-independence-referendum-results-in-full
