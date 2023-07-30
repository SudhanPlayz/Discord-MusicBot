import type {
  IRouteHandlerOptions,
  IServerMethod,
  RegisterRouteHandler,
} from '../../interfaces/common';
import { readdirSync } from 'fs';
import { API_ROUTES_PREFIX } from '../../lib/constants';
import APIError from '../../lib/APIError';
import * as db from '../../lib/db';
import { verifyToken } from '../../lib/jwt';

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
      const throwError = () => {
        throw new APIError(
          'Unauthorized',
          APIError.STATUS_CODES.UNAUTHORIZED,
          APIError.ERROR_CODES.UNAUTHORIZED,
        );
      };

      if (!request.headers.access_token?.length) throwError();

      const { user_id } = verifyToken(request.headers.access_token as string);

      if (!user_id?.length) throwError();

      const auth = await db.getUserAuth(user_id as string);

      if (!auth?.access_token?.length) throwError();

      request.headers.user_id = user_id;
    }
  });

  done();
};

export default routes;
