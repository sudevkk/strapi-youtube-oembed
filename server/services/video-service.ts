import { Strapi } from '@strapi/strapi';
import axios from 'axios';

export default ({ strapi }: { strapi: Strapi }) => ({
  async fetchVideoDetails(url) {

   let data = {  } as any;
   
    const matches = url.match(/^(https?:\/\/)?(www\.)?(youtu\.be|youtube\.com|soundcloud\.com|vimeo\.com|tiktok\.com)/i);
    
    if (matches) {
      
      try {
        let fetchedData;
        let title;
        let mime;
        let thumbnail;

        switch (matches[3]) {
          case 'youtu.be':
          case 'youtube.com':
            fetchedData = await axios.get(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`).then(res => res.data);
            
            title = fetchedData.title;
            mime = 'video/youtube';
            thumbnail = fetchedData.thumbnail_url;
            break;
          
          case 'soundcloud.com':
            fetchedData = await axios.get(`https://www.soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json`).then(res => res.data);
            title = fetchedData.title;
            mime = 'audio/soundcloud';
            thumbnail = fetchedData.thumbnail_url;
            break;
          
          case 'vimeo.com':
            fetchedData = await axios.get(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`).then(res => res.data);
            title = fetchedData.title;
            mime = 'video/vimeo';
            thumbnail = fetchedData.thumbnail_url;
            break;

          case 'tiktok.com':
            fetchedData = await axios.get(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}&format=json`).then(res => res.data);
            title = fetchedData.title;
            mime = 'video/tiktok';
            thumbnail = fetchedData.thumbnail_url;
            break;
        
          default:
            break;
        }
          
        data = {
          url,
          title,
          thumbnail,
          mime,
          rawData: fetchedData,
        }
        
      } catch (error) {
       
        if (error.response.status === 404) {
          data = {
            error: 'This URL can\'t be found'
          }
        } else if (error.response.status === 401) {
          data = {
            error: 'Embedding has been disabled for this media'
          }
        } else {
          throw new Error(error);
        }
      }
    } else {
      data = {
        error: 'Invalid URL'
      }
    }

    
    return data;


  },
});
