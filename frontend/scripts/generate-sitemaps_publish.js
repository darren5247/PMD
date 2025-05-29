const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

dotenv.config();

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_API_KEY;

if (!STRAPI_TOKEN) {
  console.error('SITEMAP - Error: Strapi API Key is not set in environment variables properly');
  process.exit(1);
}

const axiosInstance = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Authorization': `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json',
  }
});

function transformData(data, entityType) {
  switch (entityType) {
    case 'works':
      return data.map(item => ({
        id: item.id,
        attributes: {
          title: item.attributes.title,
          updatedAt: item.attributes.updatedAt,
          composers: {
            data: item.attributes.composers?.data?.map(composer => ({
              id: composer.id,
              attributes: {
                name: composer.attributes.name
              }
            })) || []
          }
        }
      }));

    case 'composers':
      return data.map(item => ({
        id: item.id,
        attributes: {
          name: item.attributes.name,
          updatedAt: item.attributes.updatedAt
        }
      }));

    case 'publishers':
      return data.map(item => ({
        id: item.id,
        attributes: {
          name: item.attributes.name,
          updatedAt: item.attributes.updatedAt
        }
      }));

    case 'collections':
      return data.map(item => ({
        id: item.id,
        attributes: {
          title: item.attributes.title,
          updatedAt: item.attributes.updatedAt
        }
      }));

    case 'elements':
      return data.map(item => ({
        id: item.id,
        attributes: {
          name: item.attributes.name,
          updatedAt: item.attributes.updatedAt
        }
      }));

    case 'pages':
      return data.map(item => ({
        id: item.id,
        attributes: {
          name: item.attributes.name,
          slug: item.attributes.slug,
          updatedAt: item.attributes.updatedAt
        }
      }));

    default:
      return data;
  }
}

async function fetchData(endpoint, pageSize = 100) {
  let page = 1;
  let allData = [];

  while (true) {
    try {
      const response = await axiosInstance.get(`${endpoint}`, {
        params: {
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
          'populate': '*',
          'filters[publishedAt][$notNull]': 'true',
          'publicationState': 'live'
        }
      });

      const { data, meta } = response.data;
      allData = [...allData, ...data];
      console.log(`SITEMAP - Fetching ${endpoint}: ${allData.length} of ${meta.pagination.total} (page ${page} of ${meta.pagination.pageCount})`);

      if (page >= meta.pagination.pageCount) break;
      page++;
    } catch (error) {
      if (error?.response?.data) {
        console.error(`SITEMAP - Error fetching ${endpoint}:`, error.message);
        console.error(`SITEMAP - Error fetching ${endpoint} - Message:`, error?.response?.data.error?.message);
      } else {
        console.error(`SITEMAP - Error fetching ${endpoint}:`, error.message);
      }
      break;
    }
  }

  return transformData(allData, endpoint);
}

async function generateSitemapData() {
  try {
    // Fetch and transform all required data
    const works = await fetchData('works');
    const composers = await fetchData('composers');
    const publishers = await fetchData('publishers');
    const collections = await fetchData('collections');
    const elements = await fetchData('elements');
    const pages = await fetchData('pages');
    console.log('SITEMAP - Finished fetching all data');

    // Ensure directory exists
    const dir = path.join(process.cwd(), 'src/sitemap');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    console.log('SITEMAP - Directory for saving the sitemap data created:', dir);

    // Write files
    const files = {
      'works.json': works,
      'composers.json': composers,
      'publishers.json': publishers,
      'collections.json': collections,
      'elements.json': elements,
      'pages.json': pages
    };
    console.log('SITEMAP - Writing files to directory:', dir);

    for (const [filename, data] of Object.entries(files)) {
      fs.writeFileSync(
        path.join(dir, filename),
        JSON.stringify(data, null, 2)
      );
      console.log(`Generated ${filename}`);
    }

    console.log('SITEMAP - Successfully generated all sitemap data');
  } catch (error) {
    console.error('SITEMAP - Error generating sitemap data:', error);
    process.exit(1);
  }
}

generateSitemapData(); 