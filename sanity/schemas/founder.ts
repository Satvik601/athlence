import { defineType, defineField } from 'sanity';

/*
 * Brief §5.6 — Founder Journey. Authentic over corporate.
 * Plain language. Short reel rather than polished hero video.
 */
export const founder = defineType({
  name: 'founder',
  title: 'Founder (The Story)',
  type: 'document',

  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'ATHLENCE / THE STORY',
    }),
    defineField({
      name: 'headline',
      title: 'Section headline',
      type: 'string',
      initialValue: 'Built by one. For everyone obsessed.',
    }),
    defineField({
      name: 'note',
      title: 'Founder note',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Plain language. No PR voice. Two to four short paragraphs.',
    }),
    defineField({
      name: 'reelUrl',
      title: 'Reel URL',
      type: 'url',
      description:
        'Short looping reel (≤ 60s, muted, 720p). Mux, Cloudflare Stream, or self-hosted MP4. Leave blank to use the placeholder.',
    }),
    defineField({
      name: 'reelCaption',
      title: 'Reel caption',
      type: 'string',
      initialValue: '▸ Behind the scenes · Factory · 03:41',
    }),
    defineField({
      name: 'signature',
      title: 'Signature line',
      type: 'string',
      initialValue: '— Founder, ATHLENCE',
    }),
  ],
  preview: { prepare() { return { title: 'Founder' }; } },
});
