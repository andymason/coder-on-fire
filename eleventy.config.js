import path from "node:path";
import { IdAttributePlugin, InputPathToUrlTransformPlugin } from "@11ty/eleventy";
import Image, { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

const DEFAULT_SOCIAL_IMAGE = "/images/blocks_no_webgl.jpg";

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ static: "/" });

  // 1. Determine the Base URL once.
  // Cloudflare Pages does not set process.env.URL (a Netlify convention); it
  // sets CF_PAGES_BRANCH and CF_PAGES_URL (the per-deploy *.pages.dev URL).
  // Production (main) uses the canonical domain; preview/branch deploys must
  // use their own deploy URL so absolute URLs (og:image, og:url) resolve there.
  const isDev =
    process.env.ELEVENTY_RUN_MODE === "serve" || process.env.ELEVENTY_RUN_MODE === "watch";
  const isPreviewDeploy = process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== "main";
  const siteUrl = isDev
    ? "http://localhost:8080"
    : process.env.URL ||
      (isPreviewDeploy ? process.env.CF_PAGES_URL : null) ||
      "https://coderonfire.com";

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

  // Optimise the front-matter image used for og:image and emit it into the
  // build. The image transform plugin only rewrites <img>/<picture> tags in
  // rendered HTML, so meta-tag images need processing explicitly here.
  eleventyConfig.addAsyncFilter("socialImage", async (frontMatterPath) => {
    const urlPath = frontMatterPath || DEFAULT_SOCIAL_IMAGE;
    // Front-matter values look like "/images/x.jpg"; the file is in pages/images.
    const inputPath = path.join("pages", urlPath);

    const metadata = await Image(inputPath, {
      widths: [1200],
      formats: ["jpeg"],
      outputDir: "_site/img/",
      urlPath: "/img/",
    });

    return metadata.jpeg[0].url;
  });

  eleventyConfig.addPlugin(IdAttributePlugin);

  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

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
