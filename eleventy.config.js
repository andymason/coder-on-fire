import path from "node:path";
import {
  IdAttributePlugin,
  InputPathToUrlTransformPlugin,
} from "@11ty/eleventy";
import Image, { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import esbuild from "esbuild";

const DEFAULT_SOCIAL_IMAGE = "/images/blocks_no_webgl.jpg";

// Shared esbuild config — only the parts that differ per mode
const JS_ENTRY = ["static/ts/main.ts"];
const CSS_ENTRY = ["static/css/main.css"];
const SHARED_EXTERNAL = [
  "*.woff",
  "*.woff2",
  "*.ttf",
  "*.eot",
  "*.png",
  "*.jpg",
  "*.jpeg",
  "*.gif",
  "*.svg",
  "*.ico",
];

/** @param {boolean} isDev */
function jsBuildConfig(isDev) {
  return {
    entryPoints: JS_ENTRY,
    bundle: true,
    splitting: true,
    minify: !isDev,
    treeShaking: true,
    // outfile: "_site/bundle.js",
    outdir: "_site/js",
    sourcemap: true,
    target: ["es2020"],
    format: "esm",
    define: {
      __DEV__: String(isDev),
    },
  };
}

/** @param {boolean} isDev */
function cssBuildConfig(isDev) {
  return {
    entryPoints: CSS_ENTRY,
    bundle: true,
    minify: !isDev,
    outfile: "_site/css/bundle.css",
    sourcemap: true,
    external: SHARED_EXTERNAL,
  };
}

// mozjpeg encoder for smaller, higher-quality JPEGs.
const SHARP_JPEG_OPTIONS = {
  quality: 75,
  mozjpeg: true,
};

// Lossless PNG optimisation: maximum zlib compression with adaptive row
// filtering. No palette quantisation, so pixels are preserved exactly.
const SHARP_PNG_OPTIONS = {
  compressionLevel: 9,
  adaptiveFiltering: true,
};

export default (eleventyConfig) => {
  // TS and CSS sources are bundled by esbuild, so don't publish the originals
  eleventyConfig.addPassthroughCopy(
    { static: "/" },
    { filter: ["**", "!ts/**", "!css/**"] },
  );

  // 1. Determine the Base URL once.
  // CloudFlare Pages does not set process.env.URL (a Netlify convention); it
  // sets CF_PAGES_BRANCH and CF_PAGES_URL (the per-deploy *.pages.dev URL).
  // Production (main) uses the canonical domain; preview/branch deploys must
  // use their own deploy URL so absolute URLs (og:image, og:url) resolve there.
  const isDev =
    process.env.ELEVENTY_RUN_MODE === "serve" ||
    process.env.ELEVENTY_RUN_MODE === "watch";

  const isPreviewDeploy =
    process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== "main";

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

  eleventyConfig.addFilter("dateToIso", (date) => {
    return new Date(date).toISOString();
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

  // Video posters are the largest paint on work pages but live in a poster
  // attribute, which the image transform plugin doesn't touch. A poster can't
  // offer format alternatives, so keep the source format (JPEG or PNG).
  eleventyConfig.addAsyncFilter("videoPoster", async (posterPath) => {
    // Poster paths look like "/video/x.jpg"; the file is in static/video.
    const inputPath = path.join("static", posterPath);

    const metadata = await Image(inputPath, {
      widths: [1280],
      formats: ["auto"],
      outputDir: "_site/img/",
      urlPath: "/img/",
      sharpJpegOptions: SHARP_JPEG_OPTIONS,
      sharpPngOptions: SHARP_PNG_OPTIONS,
    });

    return Object.values(metadata)[0][0].url;
  });

  // Sort Work tagged pages by weight value in data
  eleventyConfig.addCollection("SortedWork", function (collectionsApi) {
    return collectionsApi
      .getFilteredByTag("Work")
      .sort(function (pageA, pageB) {
        return pageA.data.weight - pageB.data.weight;
      });
  });

  eleventyConfig.addBundle("css");

  eleventyConfig.addPlugin(IdAttributePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // AVIF first, then "auto" keeps the source format (JPEG or PNG) as the
    // fallback for browsers without AVIF support.
    formats: ["avif", "auto"],
    widths: [320, 480, 640, 1280],
    sharpPngOptions: SHARP_PNG_OPTIONS,
    sharpJpegOptions: SHARP_JPEG_OPTIONS,
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      },
      pictureAttributes: {},
    },
  });

  // ── esbuild integration ──────────────────────────────────────────

  /** @type {esbuild.BuildContext[]} */
  const esbuildContexts = [];

  eleventyConfig.on("eleventy.before", async () => {
    if (isDev) {
      // Dev: create persistent contexts with incremental watch
      const jsCtx = await esbuild.context(jsBuildConfig(true));
      const cssCtx = await esbuild.context(cssBuildConfig(true));

      esbuildContexts.push(jsCtx, cssCtx);

      // Initial build
      await jsCtx.rebuild();
      await cssCtx.rebuild();

      // Start watching for source changes (true incremental rebuilds)
      await jsCtx.watch();
      await cssCtx.watch();

      console.log("[esbuild] Watching TS and CSS for changes...");
    } else {
      // Production: one-off build
      await esbuild.build(jsBuildConfig(false));
      await esbuild.build(cssBuildConfig(false));
    }
  });

  // Clean up esbuild contexts on shutdown
  const cleanup = async () => {
    for (const ctx of esbuildContexts) {
      await ctx.dispose();
    }
    esbuildContexts.length = 0;
  };

  process.once("SIGINT", cleanup);
  process.once("SIGTERM", cleanup);

  return {
    dir: {
      input: "pages",
    },
  };
};
