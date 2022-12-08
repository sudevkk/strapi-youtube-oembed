import React from 'react';
import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import YoutubeEmbedInput from './components/YoutubeEmbedInput';
import PluginIcon from './components/PluginIcon';
import getTrad from '../src/utils/getTrad';
const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.customFields.register({
      name: 'youtube-video',
      pluginId: 'youtube-embed',
      type: 'json',
      icon: PluginIcon,
      intlLabel: {
        id: getTrad('youtube-embed.label'),
        defaultMessage: 'URL',
      },
      intlDescription: {
        id: getTrad('youtube-embed.description'),
        defaultMessage: 'Enter Video URL',
      },
      components: {
        Input: async () =>
          import(
            /* webpackChunkName: "youtube-embed-input-component" */ './components/YoutubeEmbedInput'
          ),
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: getTrad('youtube-embed.options.advanced.requiredField'),
                  defaultMessage: 'Required field',
                },
                description: {
                  id: getTrad('youtube-embed.options.advanced.requiredField.description'),
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    });

    const plugin = {
      id: pluginId,
      // initializer:  YoutubeEmbedInput,
      // isReady: false,
      name,
    };

    app.registerPlugin(plugin);
  },

  bootstrap(app) {},
  async registerTrads(app) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
