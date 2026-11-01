module.exports = function(eleventyConfig) {

  // Eleventy 3 disables indented code blocks by default; our posts rely on them.
  eleventyConfig.amendLibrary("md", (mdLib) => mdLib.enable("code"));

  eleventyConfig.ignores.add("README.md");
  eleventyConfig.addCollection("posts", (api) =>
    api
      .getFilteredByGlob("_posts/*.md")
      .filter((post) => post.data.category === "blog" && post.data.hidden !== true)
      .sort((a, b) => a.date - b.date)
  );

  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("assets/images/");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      layouts: "_layouts",
      htmlTemplateEngine: "liquid",
      dataTemplateEngine: "html",
      output: "_site",
    },
  };
};
