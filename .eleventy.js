import fs from 'node:fs';

const collectedFigures = [];

export default function(eleventyConfig) {
  const urlFilter = (path) => eleventyConfig.getFilter("url")(path);
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addCollection("allTags", (collectionApi) => {
    const set = new Set();
    collectionApi.getFilteredByTag("post").forEach(item => {
      const tags = Array.isArray(item.data.tags) ? item.data.tags : (item.data.tags ? [item.data.tags] : []);
      tags.forEach(t => { if (t !== "post") set.add(t); });
    });
    return Array.from(set).sort();
  });
  eleventyConfig.addShortcode("figure", function(src, alt = "", caption = "") {
    const imgSrc = urlFilter(src);
    const pageUrl = this && this.page && this.page.url ? urlFilter(this.page.url) : "";
    collectedFigures.push({ src: imgSrc, alt, caption, pageUrl });
    return `
  <figure class="my-6">
    <img src="${imgSrc}" alt="${alt}" class="rounded-none">
    ${caption ? `<figcaption class="mt-2 text-sm text-base-600">${caption}</figcaption>` : ""}
  </figure>`;
  });

  eleventyConfig.on('eleventy.after', () => {
    try {
      fs.writeFileSync('./_site/figures.json', JSON.stringify(collectedFigures));
    } catch (_) {}
  });
  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
    pathPrefix: process.env.PATH_PREFIX || "/"
  };
}


