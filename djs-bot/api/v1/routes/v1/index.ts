import type { RegisterRouteHandler } from '../../interfaces/common';

const routes: RegisterRouteHandler = (app, opts, done) => {
  app.get('/ping', async (request, reply) => {
    return 'pong\n';
  });

  done();
};

export default routes;
