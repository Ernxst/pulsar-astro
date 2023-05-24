# Installation

## Adding Pulsar

Once you have installed Pulsar and setup your configuration files. Go ahead and create a new file
in `src/pages/docs/[...slug].astro` with the following content:

```astro title=src/pages/docs/[...slug].astro
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
