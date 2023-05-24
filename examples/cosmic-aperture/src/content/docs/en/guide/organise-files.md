# Organise Files

Pulsar first collects all your Markdown files and configurations from the `src/content/` directory, and then generates the “page map information” of your entire site, to render things such as the navigation bar and sidebar below:

## Default Behaviour

Most Pulsar features are enabled by default - you will have to opt out of unwanted features in your Pulsar integration config. See the [Configuration API Reference]() for more information on features.

### Sidebar

By default, a sidebar header is:

- The first heading of the current page if it is a content page
- The title-ised slug of the current page if it is a content page without any headings
- The title-ised slug of the current page if it is a section header

For any given section, it is ordered alphabetically. To customise this order, see the [`_meta.json`](#_metajson) section.

### `_meta.json`

It is likely that alphabetical order is not what you're looking for in any given sidebar section. Fortunately,
you can use `_meta.json` files to customise the sidebar header order for each subdirectory.

For example, if I had the following (sub-)structure:

```
.
├── src/
│   └── content/
│       └── docs/
│           ├── getting-started.md
│           ├── installation.md
│           └── introduction.md
├── package.json
└── astro.config.mjs
```

The default header ordering would be: _Getting Started_, _Installation_, _Introduction_ which is likely undesired. We can override this in the `sidebar` section of a `_meta.json` file located in the same directory (at the same level) as these markdown files:

```json
{
  "sidebar": ["introduction", "installation", "getting-started"]
}
```

So, the resulting structure would be:

```markdown "_meta.json"
.
├── src/
│ └── content/
│ └── docs/
│ ├── \_meta.json
│ ├── getting-started.md
│ ├── installation.md
│ └── introduction.md
├── package.json
└── astro.config.mjs
```

It is important to note that a single `_meta.json` only affects the current (sub-)directory - it does not affect parent sidebar sections, nor child sections. Any section you'd like to configure must have its own `_meta.json` file.

Visually, if you wanted to order the sidebar headings in `docs/guides`, you would need a `_meta.json` file in the `docs/guides` directory:

```markdown "_meta.json"
.
├── src/
│ └── content/
│ └── docs/
│ ├── \_meta.json
│ ├── getting-started.md
│ ├── installation.md
│ ├── introduction.md
│ └── guides/
│ ├── \_meta.json
│ ├── page1.md
│ └── page2.md
├── package.json
└── astro.config.mjs
```
