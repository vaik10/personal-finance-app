import {Middleware, MiddlewareContext} from '@loopback/rest';

type Next = () => Promise<unknown>;

export const loggingMiddleware: Middleware = async (
  ctx: MiddlewareContext,
  next
) => {
  const {request, response} = ctx;

  const start = Date.now();

  console.log(
    JSON.stringify({
      level: 'info',
      message: 'Incoming request',
      method: request.method,
      url: request.url,
    }),
  );

  try {
    const result = await next();

    const duration = Date.now() - start;

    console.log(
      JSON.stringify({
        level: 'info',
        message: 'Request completed',
        method: request.method,
        url: request.url,
        status: response.statusCode,
        duration,
      }),
    );
    return result;
  } catch (err: any) {
    const duration = Date.now() - start;

    console.error(
      JSON.stringify({
        level: 'error',
        message: 'Request failed',
        method: request.method,
        url: request.url,
        duration,
        error: err.message,
      }),
    );

    throw err;
  }
};