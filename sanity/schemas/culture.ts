import { defineType, defineField } from 'sanity';

/*
 * Brief §5.4 — performance-culture section. Marquee phrases between blocks,
 * strip cards / clips showing HYROX-style intensity.
 */
export const culture = defineType({
  name: 'culture',
  title: 'Culture',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'ATHLENCE / CULTURE',
    }),
    defineField({
      name: 'headline',
      title: 'Section headline',
      type: 'string',
      initialValue: 'Performance is identity.',
    }),
    defineField({
      name: 'marqueeTop',
      title: 'Top marquee phrases',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: [
        'RUN.',
        'LIFT.',
        'FIGHT.',
        'REPEAT.',
        'BUILT FOR THE OBSESSED.',
      ],
    }),
    defineField({
      name: 'marqueeBottom',
      title: 'Bottom marquee phrases',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: [
        'NO OFF SWITCH.',
        'EVERY REP COUNTS.',
        'FUEL THE MOVEMENT.',
        'BLAZE.',
        'PERFORMANCE MODE.',
      ],
    }),
    defineField({
      name: 'strips',
      title: 'Strip cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Card title' },
            { name: 'caption', type: 'string', title: 'Caption' },
            { name: 'image', type: 'image', title: 'Image / still frame' },
            {
              name: 'tint',
              type: 'string',
              title: 'Tint (for gradient fallback)',
              options: { list: ['signal', 'electric', 'chrome', 'ink'] },
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'caption' },
          },
        },
      ],
      initialValue: [
        { title: 'RUN CLUB', caption: 'Dawn miles. City asphalt. No watch.', tint: 'signal' },
        { title: 'TRAINING FLOOR', caption: 'The work nobody sees.', tint: 'electric' },
        { title: 'RACE DAY', caption: 'HYROX. Hyrox. Hyrox.', tint: 'chrome' },
      ],
    }),
  ],
  preview: { prepare() { return { title: 'Culture' }; } },
});
