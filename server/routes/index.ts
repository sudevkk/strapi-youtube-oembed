export default [
  {
    method: 'GET',
    path: '/',
    handler: 'myController.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/fetch',
    handler: 'videoController.fetch',
    config: {
      policies: [],
    },
  },
];
