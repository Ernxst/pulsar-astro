import { defineCollection } from "astro:content";
import { PulsarContentCollection } from "@pulsar/docs";

const docs = defineCollection({
  type: "content",
  schema: PulsarContentCollection,
});

export const collections = { docs };
