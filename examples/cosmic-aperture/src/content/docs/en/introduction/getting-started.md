# Getting Started

## Prerequisites

- [Node.js](https://nodejs.org/en) version `16.12.0` or higher
- [Astro](https://docs.astro.build/en/install/auto/) version `2.4.0` or higher

## Installation

Pulsar is essentially just npm libraries which you add to your project. You can add Pulsar automatically as an Astro integration using the Astro CLI:

```bash
npx astro add @pulsar/docs
```

Or, if you prefer to do it manually:

```bash
npm install pulsar @pulsar/docs
```

And add it to your Astro integrations:

```js filename="astro.config.mjs"
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

```typescript filename=src/content/config.ts
import { defineCollection } from "astro:content";
import { PulsarContentCollection } from "@pulsar/docs";

const docs = defineCollection({
  schema: PulsarContentCollection,
});

export const collections = { docs };
```

Make you run `astro sync`!

### Adding the Pulsar Page

The final step is to add `[...slug].astro` file to your pages directory. For example, if you wanted your
docs to live at `/docs`, place the following content in `src/pages/docs/[...slug].astro`.

```astro filename=src/pages/docs/[...slug].astro
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
├── astro.config.mjs
└── pulsar.config.ts
```

Now, you just need to add your files to `src/content/docs/` and Pulsar will do the rest.

## What's Next?
