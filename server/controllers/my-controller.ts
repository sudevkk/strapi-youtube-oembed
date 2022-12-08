import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('youtube-embed')
      .service('myService')
      .getWelcomeMessage();
  },
});
