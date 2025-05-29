export default {
  routes: [
    {
      method: 'POST',
      path: '/confirm-opt',
      handler: 'confirm-opt.confirm',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/confirm-opt/resend',
      handler: 'confirm-opt.resend',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
