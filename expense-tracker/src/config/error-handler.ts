import {
  Provider,
  ValueOrPromise,
  InvocationContext,
  InvocationResult,
  Interceptor,
} from '@loopback/core';

export class ErrorInterceptorProvider implements Provider<Interceptor> {
  value(): Interceptor {
    return async (
      invocationCtx: InvocationContext,
      next
    ) => {
      try {
        return await next();
      } catch (err: any) {
        console.error(err); // add this inside catch
        const statusCode =
          err.statusCode || err.status || 500;

        const message =
          statusCode === 500
            ? 'Internal Server Error'
            : err.message;

        throw {
          statusCode,
          message,
        };
      }
    };
  }
}