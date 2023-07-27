import { ERROR_CODES, STATUS_CODES } from '../lib/constants';
import fastify from 'fastify';
import type DJSBot from '../../../../lib/Bot';

export type Bot = DJSBot;

export type FastifyInstance = ReturnType<typeof fastify>;

export type RegisterRouteHandler = Parameters<FastifyInstance['register']>[0];

export type FastifyRouteHandler = Parameters<
  FastifyInstance['route']
>[0]['handler'];

export interface IRouteHandlerOptions {
  requiresAuth?: boolean;
}

export interface APIRouteHandler {
  default: FastifyRouteHandler;
  method?: IServerMethod;
  options?: IRouteHandlerOptions;
}

export type IServerMethod =
  | 'delete'
  | 'get'
  | 'head'
  | 'patch'
  | 'post'
  | 'put'
  | 'options';

export interface RouteHandlerEntry {
  handler: FastifyRouteHandler;
  method: IServerMethod;
  options?: IRouteHandlerOptions;
}

export type RouteHandler = FastifyRouteHandler | RouteHandlerEntry;

export type RouteErrorHandler = Parameters<
  FastifyInstance['setErrorHandler']
>[0];

export type IErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
export type IStatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];
