# Getting Started

## Prerequisites

- [Node.js](https://nodejs.org/en) version `16.12.0` or higher
- [Astro](https://docs.astro.build/en/install/auto/) version `2.4.0` or higher
- Text editor - We recommend [VS Code](https://code.visualstudio.com/download).

## Installation

Pulsar is essentially just npm libraries which you add to your project. First, install the core `pulsar` package using your desired package manager:

```bash
npm install pulsar @pulsar/docs
```

You can then automatically add the Pulsar documentation integration using the [Astro CLI](https://docs.astro.build/en/guides/integrations-guide/#automatic-integration-setup):

```bash
npx astro add @pulsar/docs
```

Or, if you prefer to do it manually:

And add it to your Astro integrations:

```js title="astro.config.mjs"
import { defineConfig } from "astro/config";
import docs from "@pulsar/docs";

// https://astro.build/config
export default defineConfig({
  // ... Your other config
  integrations: [
    // ... Your other integrations
    docs({
      // ... Pulsar docs Config
    }),
  ],
});
```

See the [Configuration API Reference]() for more information on supported options.

### Defining a Collection

Pulsar leverages Astro's [Content Collections](https://docs.astro.build/en/guides/content-collections/) You define collections like you would any Content Collection.
However, your schema must, at least, extend the `PulsarContentCollection` schema exported by `@pulsar/docs`. For example,
if you wanted a `docs` collection, you `src/content/config.ts` would look something like this:

```typescript title=src/content/config.ts
import { defineCollection } from "astro:content";
import { PulsarContentCollection } from "@pulsar/docs";

const docs = defineCollection({
  schema: PulsarContentCollection,
});

export const collections = { docs };
```

<!-- TODO: Put this in a callout component -->

:::tip
Since `PulsarContentCollection` is a [`Zod`](https://zod.dev/?id=introduction) schema, you can extend it to add your own schema fields like any
other Zod schema. See [extending schemas](https://zod.dev/?id=extend) in Zod. Make sure you run `astro sync` to update the generated content types!
:::

### Adding the Pulsar Page

The final step is to add `[...slug].astro` file to your pages directory. For example, if you wanted your
docs to live at `/docs`, place the following content in `src/pages/docs/[...slug].astro`.

```astro title="src/pages/docs/[...slug].astro"
---
import { PulsarPage } from "@pulsar/docs/layouts";
import { CollectionEntry, getCollection } from "astro:content";

export async function getStaticPaths() {
  const docs = await getCollection("docs");
  return docs.map((entry) => ({
    params: {
      slug: entry.slug,
    },
    props: entry,
  }));
}

type Props = CollectionEntry<"docs">;

const doc = Astro.props;
---

<PulsarPage page={doc} />
```

This passes your content collection in `src/content/docs` to Pulsar which will render your markdown
files as documentation pages.

### Write a Markdown File

Start writing your markdown files in `src/content/docs` as you would a regular content collection. For example,
you could have the following in `src/content/docs/index.md` which would be rendered as a documentation page by Pulsar:

```markdown
# Hello World

I am a documentation page rendered by Pulsar!
```

## File Structure

Assuming you followed the steps above, you should have the following folder structure:

```
.
├── src/
│   ├── content/
│   │   ├── config.ts
│   │   └── docs/
│   │       └── index.md
│   └── pages/
│       └── docs/
│           └── [...slug.astro]
├── package.json
└── astro.config.mjs
```

Now, you just need to add your files to `src/content/docs/` and Pulsar will do the rest.

## What's Next?

- To learn how to organise your content directory, proceed to the [Organisation Guide](/docs/en/guide/organise-files).
- To understand how Pulsar works with Astro's markdown capabilities, proceed to the [Markdown Guide](/docs/en/guide/writing-markdown-files).
