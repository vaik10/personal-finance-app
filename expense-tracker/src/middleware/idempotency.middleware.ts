import {Middleware, MiddlewareContext} from '@loopback/rest';
import crypto from 'crypto';
import {IdempotencyService} from '../services/idempotency.service';

const service = new IdempotencyService();

export const idempotencyMiddleware: Middleware = async (
  ctx: MiddlewareContext,
  next
) => {
  const req = ctx.request;
  const res = ctx.response;

  const key = req.headers['idempotency-key'] as string;

  if (!key || req.method !== 'POST' || req.path !== '/expenses') {
    return next();
  }

  const requestBody = JSON.stringify(req.body ?? {});
  const requestHash = crypto
    .createHash('sha256')
    .update(requestBody)
    .digest('hex');

  const existing = service.get(key);

  // 🟡 Case 1: Existing key
  if (existing) {
    // Different payload → conflict
    if (existing.requestHash !== requestHash) {
      return res.status(409).json({
        error: 'Idempotency key reused with different payload',
      });
    }

    // Request already completed → return cached
    if (existing.status === 'COMPLETED') {
      return existing.response;
    }

    // Request in progress → reject or wait
    return res.status(409).json({
      error: 'Request already in progress for this idempotency key',
    });
  }

  // 🟢 Mark as in-progress
  service.set(key, {
    requestHash,
    status: 'IN_PROGRESS',
  });

  const originalJson = res.json.bind(res);
  let responseBody: unknown;

  res.json = (body: unknown) => {
    responseBody = body;
    return originalJson(body);
  };

  try {
    const result = await next();

    // ✅ Store only if successful
    service.set(key, {
      requestHash,
      status: 'COMPLETED',
      response: result,
    });
    return result;
  } catch (err) {
    // ❌ Cleanup on failure (important)
    service.set(key, {
      requestHash,
      status: 'IN_PROGRESS',
    });

    throw err;
  }
};