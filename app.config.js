import 'dotenv/config';

export default {
  expo: {
    name: 'Test-app',
    slug: 'test-app',
    extra: {
      API_URL_GLOBAL: process.env.API_URL_GLOBAL,
    },
  },
};