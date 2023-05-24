# Writing Markdown Files

For the most part, Pulsar does not handle markdown files any differently to Astro, so the Astro [markdown guide](https://docs.astro.build/en/guides/markdown-content/)
can and is encourage to be followed.

## Overriding Sidebar Headers

By default, a sidebar header is:

- The first heading of the current page if it is a content page
- The title-ised slug of the current page if it is a content page without any headings
- The title-ised slug of the current page if it is a section header

The [`_meta.json`](/docs/en/guide/organise-files#_metajson) only handles the ordering of headers. So, to
customise the sidebar header, you can set the `title` property in the frontmatter of your markdown file:

```markdown title="page.md"
---
title: "My Page"
---

<!-- Your page content -->
```

This takes precedence over the default sidebar behaviour mentioned above.
