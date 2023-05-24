# Getting Started

## Installation

Pulsar is essentially just npm libraries which you add to your project.

### Prerequisites

- [Node.js]() version 16 or higher

### Configuration

Next, create a `pulsar.config.ts` file at the root of your project:

```js filename=pulsar.config.ts
import { defineConfig } from "@pulsar/docs";

export default defineConfig({
  // ...
});
```

See the [Configuration API Reference]() for more information on supported options.

### Defining a Collection

Pulsar leverages Astro's [Content Collections]() You define collections like you would any Content Collection.
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
