import test from 'node:test';
import assert from 'node:assert/strict';

import { createJwt, verifyJwt, decodeJwt } from './jwt.js';

test('createJwt and verifyJwt round trip a user session', async () => {
  const user = { id: 1, name: 'Archana Verma', email: 'archana@demo.com', role: 'candidate' };
  const token = await createJwt({ user, exp: 4102444800 });

  const payload = await verifyJwt(token);
  assert.ok(payload, 'JWT should verify successfully');
  assert.equal(payload.user.email, 'archana@demo.com');
  assert.equal(payload.user.role, 'candidate');

  const decoded = decodeJwt(token);
  assert.equal(decoded.user.name, 'Archana Verma');
});

test('verifyJwt rejects a malformed token', async () => {
  const payload = await verifyJwt('not.a.valid.jwt');
  assert.equal(payload, null);
});

test('verifyJwt rejects an expired token', async () => {
  const token = await createJwt({ user: { id: 1 } }, { exp: Math.floor(Date.now() / 1000) - 1 });

  const payload = await verifyJwt(token);
  assert.equal(payload, null);
});
