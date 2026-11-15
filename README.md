# kartikanand.github.io

Source for my personal website: a short bio, a blog, a list of projects and a collection of quotes. It is a static site built with [Eleventy](https://www.11ty.dev/) 3.

## Develop

Requires Node.js 22 (the version Netlify builds with). Install it with `brew install node`.

```sh
npm install
npm run dev     # dev server with live reload
npm run build   # build to _site/
```

## Structure

| Path | Purpose |
| --- | --- |
| `_posts/` | Blog posts in Markdown (Python, C and shell-building series, dotfiles, and more) |
| `_data/` | `projects.json`, `quotes.json` and `series_names.json`, which feed the projects and quotes pages and the post series |
| `_layouts/`, `_includes/` | Page, post and default layouts, plus the header and footer |
| `index.html`, `me.md`, `projects.html`, `quotes.html` | Top-level pages |
| `assets/images/`, `style.css` | Static assets, copied to the output as-is |
| `.eleventy.js` | Eleventy config: the `posts` collection (posts with `category: blog` that aren't `hidden`, sorted by date), an `inSeries` filter and passthrough copies |
| `netlify.toml` | Build command and Node version for Netlify |

## Writing a post

Add a Markdown file to `_posts/` named `YYYY-MM-DD-title.md`. Give it `category: blog` in the front matter so it appears in the blog list, and set `hidden: true` to keep it out. Set `series` to group posts into a series.

## History

The site moved from Jekyll to Eleventy in January 2023 (see the post in `_posts/`).

## License

MIT. See [LICENSE](LICENSE).
