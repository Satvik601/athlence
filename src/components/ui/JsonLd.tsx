/*
 * Brief §11 — Schema.org Organisation + Product markup.
 *
 * Organisation @id #organization (ATHLENCE, parent brand).
 * Product      @id #blaze        (first product, brand references org).
 *
 * This makes the hierarchy machine-readable: search engines see ATHLENCE
 * as the brand entity and BLAZE as a Product whose Brand = ATHLENCE.
 */
export function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://athlence.com/#organization',
        name: 'ATHLENCE',
        url: 'https://athlence.com',
        logo: 'https://athlence.com/logo.svg',
        slogan: 'Built for Movement',
        description: 'A performance-culture brand for a generation obsessed with becoming better.',
        sameAs: [
          'https://instagram.com/athlence',
          'https://youtube.com/@athlence',
          'https://tiktok.com/@athlence',
        ],
      },
      {
        '@type': 'Product',
        '@id': 'https://athlence.com/#blaze',
        name: 'BLAZE Energy',
        description:
          'BLAZE is the first product from ATHLENCE — a performance energy drink built for the run, the lift, the race.',
        brand: { '@id': 'https://athlence.com/#organization' },
        image: 'https://athlence.com/blaze-product.png',
        category: 'Energy Drink',
        offers: {
          '@type': 'AggregateOffer',
          availability: 'https://schema.org/PreOrder',
          priceCurrency: 'USD',
          url: 'https://athlence.com/#community',
        },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
