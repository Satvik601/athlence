import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

/*
 * Brief §13 — Sanity Studio for marketing-team editing.
 *
 * The studio mounts at /studio (see src/app/studio/[[...index]]/page.tsx).
 * Marketing can edit hero phrases, vision, culture, founder, future products
 * without a developer. Image uploads run through Sanity's CDN with automatic
 * format conversion (AVIF/WebP).
 */

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder';
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'athlence',
  title: 'ATHLENCE — Studio',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
