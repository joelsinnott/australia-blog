export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  eleventyConfig.addShortcode("figure", (src, alt = "", caption = "") => {
    return `
  <figure class="my-6">
    <img src="${src}" alt="${alt}" class="rounded">
    ${caption ? `<figcaption class="mt-2 text-sm text-base-600">${caption}</figcaption>` : ""}
  </figure>`;
  });
  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid"
  };
}


