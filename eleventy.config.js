import { IdAttributePlugin, InputPathToUrlTransformPlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ static: "/" });

  const isDev =
    process.env.ELEVENTY_RUN_MODE === "serve" || process.env.ELEVENTY_RUN_MODE === "watch";
  const siteUrl = isDev ? "http://localhost:8080" : process.env.URL || "https://coderonfire.com";

  eleventyConfig.addGlobalData("site", {
    url: siteUrl,
  });

  eleventyConfig.addFilter("absoluteUrl", (urlPath) => {
    try {
      return new URL(urlPath, siteUrl).href;
    } catch (error) {
      console.warn("Failed to create absolute URL", error);

      return urlPath;
    }
  });

  // Sort Work tagged pages by weight value in data
  eleventyConfig.addCollection("SortedWork", function (collectionsApi) {
    return collectionsApi.getFilteredByTag("Work").sort(function (pageA, pageB) {
      return pageA.data.weight - pageB.data.weight;
    });
  });

  eleventyConfig.addPlugin(IdAttributePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "jpeg"],
    widths: [320, 640, "auto"],
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
