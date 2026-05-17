import { defineType, defineField } from 'sanity';

/*
 * Brief §5.1 — hero. Rotating headlines, sub-headline introducing ATHLENCE,
 * primary and secondary CTAs. Marketing edits without redeploy.
 */
export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow caption',
      type: 'string',
      initialValue: 'ATHLENCE / THE MOVEMENT',
      description: 'Small caption above the headline. Reinforces parent brand.',
    }),
    defineField({
      name: 'phrases',
      title: 'Rotating headline phrases',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: [
        'BUILT FOR MOVEMENT',
        'ENERGY FOR THE OBSESSED',
        'PERFORMANCE MODE',
        'NO OFF SWITCH',
      ],
      validation: (r) => r.min(1).max(8),
      description:
        'Cycles every 6s. Reduced-motion users only see the first phrase.',
    }),
    defineField({
      name: 'subhead',
      title: 'Sub-headline',
      type: 'text',
      rows: 3,
      initialValue:
        'ATHLENCE is the movement for a generation obsessed with becoming better. BLAZE is the first product powering it.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Primary CTA label',
      type: 'string',
      initialValue: 'Join the Movement',
    }),
    defineField({
      name: 'secondaryCtaLabel',
      title: 'Secondary CTA label',
      type: 'string',
      initialValue: 'Get Early Access',
    }),
    defineField({
      name: 'posterImage',
      title: 'Hero poster image (LCP fallback)',
      type: 'image',
      description:
        'Static AVIF/WebP of the BLAZE can. Used as LCP and as the reduced-motion fallback. Recommend 2400×1350.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Hero' };
    },
  },
});
