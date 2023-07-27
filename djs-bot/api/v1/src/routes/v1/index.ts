import type {
  IServerMethod,
  RegisterRouteHandler,
} from '../../interfaces/common';
import { readdirSync } from 'fs';

const routes: RegisterRouteHandler = async (app, opts, done) => {
  const routes = readdirSync(__dirname + '/routesHandler').filter((file) =>
    file.endsWith('.js'),
  );

  for (const file of routes) {
    const module = await import('./routesHandler/' + file);

    const routeHandler = module.default;
    const routePath = file.split('.')[0];

    if (Array.isArray(routeHandler.default)) {
      for (const handler of routeHandler.default) {
        app[handler.method as IServerMethod]('/' + routePath, handler.handler);
      }
    } else {
      app[(routeHandler.method as IServerMethod) || 'get'](
        '/' + routePath,
        routeHandler.default,
      );
    }
  }

  done();
};

export default routes;
