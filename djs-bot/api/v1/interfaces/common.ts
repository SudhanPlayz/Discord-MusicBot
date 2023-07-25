import fastify from 'fastify';

export type FastifyInstance = ReturnType<typeof fastify>;

export type RegisterRouteHandler = Parameters<FastifyInstance['register']>[0];
