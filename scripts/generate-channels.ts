import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { faker } from "@faker-js/faker";
import { z } from "zod";
import {
  type Category,
  CategorySchema,
  ChannelSchema,
} from "@/domain/channel";

const CHANNEL_COUNT = 60;
const OUTPUT = path.join(
  process.cwd(),
  "src/infrastructure/server/seed/channels.json",
);

const TITLES: Record<Category, string[]> = {
  gaming: ["Ranked grind to diamond", "Speedrun practice", "First playthrough, no spoilers", "Late night co-op"],
  music: ["Lo-fi beats to study to", "Live guitar requests", "Making a beat from scratch", "Piano covers"],
  "just-chatting": ["Morning coffee chat", "Q&A with chat", "Reacting to your clips", "Ask me anything"],
  sports: ["Match day watch party", "Fantasy league draft", "Pre-game analysis", "Highlights and hot takes"],
  creative: ["Drawing commissions live", "Pixel art session", "3D modeling a spaceship", "Painting with chat"],
};

faker.seed(42);

function viewerCount(): number {
  const exponent = faker.number.float({ min: 0, max: Math.log(50_000) });
  return Math.floor(Math.exp(exponent));
}

function toSlug(name: string, index: number): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base}-${index}`;
}

const channels = Array.from({ length: CHANNEL_COUNT }, (_, i) => {
  const streamerName = faker.internet.username();
  const slug = toSlug(streamerName, i);
  const category = faker.helpers.arrayElement(CategorySchema.options);

  return {
    id: String(i + 1),
    slug,
    title: faker.helpers.arrayElement(TITLES[category]),
    streamerName,
    category,
    thumbnailUrl: `https://picsum.photos/seed/${slug}/640/360`,
    viewerCount: viewerCount(),
    isLive: faker.datatype.boolean({ probability: 0.85 }),
  };
});

const validated = z.array(ChannelSchema).parse(channels);

mkdirSync(path.dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, `${JSON.stringify(validated, null, 2)}\n`);

console.log(`Wrote ${validated.length} channels to ${path.relative(process.cwd(), OUTPUT)}`);