/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://pianomusicdatabase.com';
module.exports = {
  siteUrl: `${siteUrl}`,
  changefreq: 'weekly',
  priority: 0.7,
  generateRobotsTxt: true,
  autoLastmod: true,
  exclude: [
    '/create-account',
    '/log-in',
    '/log-in-confirmed',
    '/accept-terms',
    '/account-created',
    '/account-dashboard',
    '/account-settings',
    '/account-setup',
    '/forgot-email',
    '/request-password',
    '/reset-password',
    '/add-work',
    '/add-collection',
    '/add-publisher',
    '/add-composer',
    '/works-added',
    '/edit-work',
    '/edit-collection',
    '/edit-publisher',
    '/edit-composer',
    '/edit-history',
    '/collections-added',
    '/composers-added',
    '/publishers-added',
    '/unsubscribe',
    '/lists',
    '/favorites',
    '/plan',
    '/pricing',
    '/success',
    '/canceled',
    '/sitemap-pages.xml',
    '/sitemap-works.xml',
    '/sitemap-collections.xml',
    '/sitemap-publishers.xml',
    '/sitemap-composers.xml',
    '/sitemap-elements.xml',
    '/sitemap-lists.xml'
  ],
  robotsTxtOptions: {
    additionalSitemaps: [
      `${siteUrl}/sitemap-pages.xml`,
      `${siteUrl}/sitemap-works.xml`,
      `${siteUrl}/sitemap-collections.xml`,
      `${siteUrl}/sitemap-publishers.xml`,
      `${siteUrl}/sitemap-composers.xml`,
      `${siteUrl}/sitemap-elements.xml`,
      `${siteUrl}/sitemap-lists.xml`
    ],
    policies: [
      {
        userAgent: '*',
        disallow: '*'
      }
    ]
  }
};
