import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.customFields.register({
    name: 'youtube-video',
    plugin: 'youtube-embed',
    type: 'json',
  });
};
