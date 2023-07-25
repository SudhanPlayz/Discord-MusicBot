import type { RegisterRouteHandler } from '../../interfaces/common';
import { readdirSync } from 'fs';

type IServerMethod =
  | 'delete'
  | 'get'
  | 'head'
  | 'patch'
  | 'post'
  | 'put'
  | 'options';

const routes: RegisterRouteHandler = async (app, opts, done) => {
  const routes = readdirSync(__dirname + '/routesHandler').filter((file) =>
    file.endsWith('.js'),
  );

  for (const file of routes) {
    const module = await import('./routesHandler/' + file);

    const routeHandler = module.default;
    const routePath = file.split('.')[0];

    app[(routeHandler.method as IServerMethod) || 'get'](
      '/' + routePath,
      routeHandler.default,
    );
  }

  done();
};

export default routes;
