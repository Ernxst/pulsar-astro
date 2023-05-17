import { defineCollection } from "astro:content";
import { PulsarCollection } from "@pulsar/docs";

const docs = defineCollection({
  schema: PulsarCollection,
});

export const collections = { docs };
