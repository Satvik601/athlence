import { defineType, defineField } from 'sanity';

/*
 * Brief §5.2 — ATHLENCE Brand Vision section.
 * Sells identity, not product. The hierarchy line is non-negotiable copy.
 */
export const vision = defineType({
  name: 'vision',
  title: 'Vision (The Movement)',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'ATHLENCE / THE MOVEMENT',
    }),
    defineField({
      name: 'headline',
      title: 'Manifesto headline',
      type: 'string',
      initialValue: 'For a generation obsessed with becoming better.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'body',
      title: 'Manifesto body',
      type: 'array',
      of: [{ type: 'block' }],
      description:
        'Two to four short paragraphs. Sells the movement, the audience, the ambition.',
    }),
    defineField({
      name: 'hierarchyLine',
      title: 'Hierarchy reinforcement line',
      type: 'string',
      initialValue: 'BLAZE is the first product. It will not be the last.',
      description: 'Per brief §1, ATHLENCE/BLAZE hierarchy must be visible everywhere.',
    }),
    defineField({
      name: 'values',
      title: 'Values strip',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['Ambition', 'Discipline', 'Movement', 'Performance', 'Energy'],
      validation: (r) => r.min(3).max(8),
    }),
    defineField({
      name: 'image',
      title: 'Side image',
      type: 'image',
      description: 'Cinematic photography. Cool shadows, warm highlights, high contrast.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Vision' };
    },
  },
});
