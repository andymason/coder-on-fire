import { IdAttributePlugin, InputPathToUrlTransformPlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default async function (eleventyConfig) {
  // Copy the *contents* of `static/` into the output root so the
  // `static` segment is dropped (e.g. static/images/x.jpg -> /images/x.jpg)
  eleventyConfig.addPassthroughCopy({ static: "/" });

  // 1. Determine the Base URL once
  const isDev =
    process.env.ELEVENTY_RUN_MODE === "serve" || process.env.ELEVENTY_RUN_MODE === "watch";
  const siteUrl = isDev ? "http://localhost:8080" : process.env.URL || "https://coderonfire.com";

  // 2. Add it as Global Data (so you can still use {{ site.url }} in templates)
  eleventyConfig.addGlobalData("site", {
    url: siteUrl,
  });

  // 3. Add the "Smart" Filter
  // It now uses the siteUrl variable defined above automatically
  eleventyConfig.addFilter("absoluteUrl", (urlPath) => {
    try {
      return new URL(urlPath.trim(), siteUrl).href;
    } catch (error) {
      console.warn(error);

      return urlPath;
    }
  });

  eleventyConfig.addPlugin(IdAttributePlugin);

  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

  // Sort Work tagged pages by weight value in data
  eleventyConfig.addCollection("SortedWork", function (collectionsApi) {
    return collectionsApi.getFilteredByTag("Work").sort(function (pageA, pageB) {
      return pageA.data.weight - pageB.data.weight;
    });
  });

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // output image formats
    formats: ["avif", "jpeg"],

    // output image widths
    widths: [320, 640, "auto"],

    // optional, attributes assigned on <img> nodes override these values
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
        sizes: "auto",
      },
      pictureAttributes: {},
    },
  });

  return {
    dir: {
      input: "pages",
    },
  };
}
