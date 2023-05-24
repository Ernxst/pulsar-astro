# What is Pulsar?

Pulsar is a [Static-Site-Generator]() (SSG) framework focused around speeding up the process of shipping content-focused sites. It is built on top of [Astro](https://astro.build), leveraging its opt-in JavaScript approach to maximise page performance without
sacrificing developer experience. If you know how to write markdown, you can [get started](/docs/en/introduction/getting-started) immediately.

Pulsar is much like other content-focused SSG frameworks:

- [VitePress](https://vitepress.dev)
- [DocuSaurus](https://docusaurus.io)
- [Nextra](https://nextra.site)
- [KitDocs](https://kitdocs.vercel.app/docs/getting-started/introduction)

However, as Pulsar is built on Astro - it is entirely framework agnostic, meaning you can bring your custom
components other from existing sites and plug them into your site if needed.

## Use Cases

- **Documentation**: Pulsar ships with a built in documentation theme - all you need to do is write your markdown files and let Pulsar do the rest.

We are always looking to expand use-cases - let us know what you would like to see in our [GitHub discussions](https://github.com/Ernxst/pulsar/discussions)!

## Developer Experience

Pulsar is one of the fastest ways to build a fully-featured documentation site. This is because it has several useful features right out of the box:

- Automatically generated collapsible sidebar
- SEO
- Navbar with search, internal, external and social links
- Pagination
- Breadcrumbs
- Theme selection (light, dark and system)
- Timestamps from git commits
- GitHub edit links
- Table of contents with scroll indicators

All with sensible defaults. And better yet, these are all completely configurable should the need arise.

## FAQ

### Why not just use Astro directly?

You certainly can! There is even already an official [docs theme]() and [blogs theme](). With Pulsar, however,
your theming/configuration code remains separate from your site/content code but still allows you fine-grained access to
customise the styling of your content. Should you want a totally custom theme with the Astro templates, you'd
have to rip out a lot of code which likely won't be a quick and reliable process.

With Pulsar, you can opt in and out of features you may or may not need.

Compared to the docs template, Pulsar also provides the following advantages (and over cloning templates):

- **Automatic sidebar generation**: the sidebar is inferred from your content directory without manual input
- **Breadcrumbs**: tasty! Pulsar automatically provides a visual navigation aid at the top of every page
- **Pagination**: easily navigate forwards and backwards through your documentation pages
- **Timestamps**: the date a page was last updated in source control is surfaced on each page
- **Edit Links**: show a link to take the user directly to edit the current page in GitHub

### Does this work without JavaScript enabled?

Yes! In true Astro fashion, a minimal amount of JavaScript is sent to the browser and your site will still work without JavaScript. In fact, the list of JavaScript stuff is short:

- An [a11y scrolling helper]()
- A [dynamic colour theme component]()
- [Scroll indicators in the right sidebar]()

And out of these areas, only the theme selector does not work without JavaScript and will be hidden if the
user has JavaScript disabled.

### Why can't I just use a template?

There are many [Astro documentation templates](https://astro.build/themes?search=&categories%5B%5D=docs) out there already, Pulsar itself is built around one. However, all the plumbing and library/utility code needed to setup the pages will live in your Astro project and will likely have to be configured by you, potentially in multiple places. Pulsar abstracts all of this away and provides extra DX wins right out of the box allowing you to focus solely on writing content. Functionality can be easily configured on a site-wide or per-page basis should the need arise.
