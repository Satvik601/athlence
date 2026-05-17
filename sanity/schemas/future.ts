import { defineType, defineField } from 'sanity';

/*
 * Brief §5.8 — The Future of ATHLENCE. Scalable brand ecosystem, not a
 * single drink. Silhouettes only — DO NOT show fake finished packaging.
 */
export const future = defineType({
  name: 'future',
  title: 'Future Products',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'ATHLENCE / FUTURE',
    }),
    defineField({
      name: 'headline',
      title: 'Section headline',
      type: 'string',
      initialValue: 'BLAZE is the first. Not the last.',
    }),
    defineField({
      name: 'intro',
      title: 'Intro paragraph',
      type: 'text',
      rows: 3,
      initialValue:
        'A brand ecosystem for the obsessed. Drinks, shots, gummies — all under one movement.',
    }),
    defineField({
      name: 'cards',
      title: 'Product cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Name' },
            { name: 'category', type: 'string', title: 'Category' },
            {
              name: 'status',
              type: 'string',
              title: 'Status',
              options: { list: ['Live', 'Coming Soon', 'In Dev', 'Concept', 'TBA'] },
            },
            { name: 'targetYear', type: 'string', title: 'Target year' },
            {
              name: 'silhouette',
              type: 'string',
              title: 'Silhouette type',
              description: 'Inline SVG silhouette used for visual.',
              options: { list: ['can', 'shot', 'gummy', 'next', 'custom'] },
            },
            { name: 'customSilhouette', type: 'image', title: 'Custom silhouette (SVG)', hidden: ({ parent }) => parent?.silhouette !== 'custom' },
          ],
          preview: {
            select: { title: 'name', subtitle: 'status' },
          },
        },
      ],
      initialValue: [
        { name: 'BLAZE Energy', category: 'Energy Drink', status: 'Live', targetYear: '2026', silhouette: 'can' },
        { name: 'Honey Shot', category: 'Pre-Workout Shot', status: 'In Dev', targetYear: '2026/27', silhouette: 'shot' },
        { name: 'Energy Gummies', category: 'Performance Gummies', status: 'Concept', targetYear: '2027', silhouette: 'gummy' },
        { name: 'Next', category: 'Athlete Ecosystem', status: 'TBA', targetYear: '—', silhouette: 'next' },
      ],
    }),
  ],
  preview: { prepare() { return { title: 'Future Products' }; } },
});
