import {Middleware, MiddlewareContext} from '@loopback/rest';
import crypto from 'crypto';
import {IdempotencyService} from '../services/idempotency.service';

const service = new IdempotencyService();

export const idempotencyMiddleware: Middleware = async (
  ctx: MiddlewareContext,
  next,
) => {
  const req = ctx.request;
  const res = ctx.response;

  const key = req.headers['idempotency-key'] as string;

  // Apply only to POST /expenses
  if (!key || req.method !== 'POST' || req.path !== '/expenses') {
    return next();
  }

  const requestBody = JSON.stringify(req.body ?? {});
  const requestHash = crypto
    .createHash('sha256')
    .update(requestBody)
    .digest('hex');

  const existing = service.get(key);

  if (existing) {
    if (existing.requestHash === requestHash) {
      return res.json(existing.response);
    }

    return res.status(409).json({
      error: 'Idempotency key reuse with different request',
    });
  }

  // Capture response
  const originalJson = res.json.bind(res);

  let responseBody: unknown;

  res.json = (body: unknown) => {
    responseBody = body;
    return originalJson(body);
  };

  await next();

  // Store after execution
  service.set(key, {
    requestHash,
    response: responseBody,
  });
};