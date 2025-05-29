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
    case 'lists':
      return data.map(item => ({
        attributes: {
          title: item.attributes.title,
          uid: item.attributes.uid,
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
          'filters[visibility][currentVisibility][$eq]': 'public'
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
    const lists = await fetchData('lists');
    console.log('SITEMAP - Finished fetching all data');

    // Ensure directory exists
    const dir = path.join(process.cwd(), 'src/sitemap');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    console.log('SITEMAP - Directory for saving the sitemap data created:', dir);

    // Write files
    const files = {
      'lists.json': lists
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