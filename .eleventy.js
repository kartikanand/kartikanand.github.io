module.exports = function(eleventyConfig) {

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
