import type {
  IRouteHandlerOptions,
  IServerMethod,
  RegisterRouteHandler,
  RouteHandlerEntry,
} from '../../interfaces/common';
import { readdirSync } from 'fs';
import { API_ROUTES_PREFIX } from '../../lib/constants';
import APIError from '../../lib/APIError';

const routes: RegisterRouteHandler = async (app, opts, done) => {
  const routes = readdirSync(__dirname + '/routesHandler').filter((file) =>
    file.endsWith('.js'),
  );

  const routesRequiresAuth: string[] = [];

  const handleRouteOptions = (
    routePath: string,
    options: IRouteHandlerOptions = {},
  ) => {
    const { requiresAuth } = options;

    if (requiresAuth) routesRequiresAuth.push(routePath);
  };

  for (const file of routes) {
    const module = await import('./routesHandler/' + file);

    const routeHandler = module.default;
    const routePath = '/' + file.split('.')[0];

    if (Array.isArray(routeHandler.default)) {
      for (const handler of routeHandler.default) {
        handleRouteOptions(routePath, handler.options);

        app[handler.method as IServerMethod](routePath, handler.handler);
      }
    } else {
      handleRouteOptions(routePath, routeHandler.options);

      app[(routeHandler.method as IServerMethod) || 'get'](
        routePath,
        routeHandler.default,
      );
    }
  }

  app.addHook('preHandler', async (request, reply) => {
    const rPath = request.routerPath.substring(API_ROUTES_PREFIX.length);

    if (routesRequiresAuth.some((path) => rPath === path)) {
      // !TODO: what kind of authorization check is this???
      if (!request.headers.access_token?.length)
        throw new APIError(
          'Forbidden',
          APIError.STATUS_CODES.FORBIDDEN,
          APIError.ERROR_CODES.FORBIDDEN,
        );
    }
  });

  done();
};

export default routes;
