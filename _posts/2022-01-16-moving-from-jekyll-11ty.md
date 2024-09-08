---
title: "Moving from Jekyll to 11ty"
layout: post
date: 2023-01-16 01:00:00
author: kt
category: blog
description: My experience of moving from Jekyll to 11ty for this blog.
---

Recently I wanted to make some style changes to this website but it was proving to be difficult to work with Ruby and [Jekyll](https://jekyllrb.com/). I was unable to do any local builds since I don't have much experience with either Ruby or its build system. It was further complicated due to the fact that even though macOS ships with a version of Ruby we still need to install a different version for running Jekyll.

This made me want to search for and move to a different static site generator framework written in a language I am confortable with. My initial shortlist consisted of [Hugo](https://gohugo.io/) and [Gatsby](https://www.gatsbyjs.com/), but they proved to be pretty complicated to start with and I wanted a no frills framework. On some more searching I found [11ty](https://www.11ty.dev/) which is pretty much like Jekyll and based on Node.js.

In this blog post, I've listed down the changes that I had to do while porting my website to 11ty. This may not be the best possible way to do the move but it worked for me and it may work for you as well. If not, [11ty docs](https://www.11ty.dev/docs/) are a pretty good resource.

I was able to use the same folder structure that I had with Jekyll by telling 11ty what each folder represents in its config file -

```javascript
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
```

As can be seen from the config, we can change a lot of things. We can tell 11ty which folders we want it to copy directly to the build directory using the `eleventyConfig.addPassthroughCopy` function. We can even tell it which template engine we want to use. In this case I'm using [liquid](https://shopify.github.io/liquid/basics/introduction/), which is made by Shopify and is also used by Jekyll.

The other major change that I had to do was getting the list of posts. With Jekyll, we had access to a variable `site.posts` but I wasn't able to find a comparable thing in 11ty, maybe there is, I didn't look hard enough. I used the `collections.all` variable which gives all pages in the website, I then filtered on post category and was able to get all blog posts to display an index on the homepage.

The next problem was that 11ty would output everything in its own directory and then create an `index.html` file within that directory. This also meant that posts within the `_posts` directory would output to `_site/_posts/post1/index.html`. This was undesirable since it would change a lot of URLs. The fix was simply to put a permalink property on the frontmatter of default layout as {% raw %}`permalink: "/{{ title | slugify }}/index.html"`{% endraw %}. This led to one more problem, the title of my current home page is "ramblings" while I want to output it to `index.html`. The fix for this was to put another permalink on the index page as `permalink: "/index.html"`.

Finally, I had to tackle `sass`. Now, I didn't find any good solution for integrating `sass` into 11ty and thus I chose the simplest alternative available. I took the compiled css from previous website and used it directly with 11ty, simple!.

Apart from these changes, there were a couple of more changes around variables, for instance - we need to use `"today"` instead of `site.time` for getting the current time in front matter, `post.data.title` instead of `post.title`. Although, in the content, we need to use {% raw %}`{{ title }}`{% endraw %} directly instead of {% raw %}`{{ page.title }}`{% endraw %}.

And that's pretty much it, here's a PR with the above changes plus the style changes that I wanted to do if anyone is interested - [Move to eleventy #16](https://github.com/kartikanand/kartikanand.github.io/pull/16)
