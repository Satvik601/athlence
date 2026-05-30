import { defineType, defineField } from 'sanity';

/*
 * Brief §13 — global settings: title, meta description, social handles.
 * Singleton — one document only.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site title',
      type: 'string',
      initialValue: 'ATHLENCE — Built for Movement | BLAZE Energy',
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      initialValue:
        'ATHLENCE is the movement for a generation obsessed with becoming better. BLAZE is the first product powering it.',
      validation: (r) => r.required().max(180),
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram handle',
      type: 'string',
      initialValue: 'athlence',
      description: 'Without the @',
    }),
    defineField({
      name: 'youtubeHandle',
      title: 'YouTube handle',
      type: 'string',
      initialValue: 'athlence',
    }),
    defineField({
      name: 'tiktokHandle',
      title: 'TikTok handle',
      type: 'string',
      initialValue: 'athlence',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      initialValue: 'hello@athlence.com',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
});
