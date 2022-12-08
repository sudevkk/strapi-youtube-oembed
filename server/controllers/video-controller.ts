import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async fetch(ctx) {
    const resp = await strapi
      .plugin('youtube-embed')
      .service('videoService')
      .fetchVideoDetails(ctx.request.query.url);
    ctx.body = resp;
  },
});
