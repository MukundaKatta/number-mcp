import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { formatNumber } from '../src/server.js';

test('decimal en-US groups with comma', () => {
  assert.equal(formatNumber({ value: 1234567.89, style: 'decimal' }), '1,234,567.89');
});

test('decimal de-DE uses dot grouping', () => {
  // de-DE uses . for grouping and , for decimal — may use Unicode dots.
  const out = formatNumber({ value: 1234567.89, locale: 'de-DE' });
  assert.match(out, /1.234.567,89|1\.234\.567,89/);
});

test('currency USD', () => {
  assert.equal(formatNumber({ value: 9.99, style: 'currency', currency: 'USD' }), '$9.99');
});

test('currency EUR de-DE', () => {
  const out = formatNumber({ value: 9.99, style: 'currency', currency: 'EUR', locale: 'de-DE' });
  assert.match(out, /9,99/);
  assert.match(out, /€/);
});

test('percent', () => {
  assert.equal(formatNumber({ value: 0.42, style: 'percent' }), '42%');
});

test('compact', () => {
  assert.equal(formatNumber({ value: 1200, style: 'compact' }), '1.2K');
  assert.equal(formatNumber({ value: 3_000_000, style: 'compact' }), '3M');
});

test('fraction digit control', () => {
  assert.equal(
    formatNumber({ value: 3.14159, minimum_fraction_digits: 2, maximum_fraction_digits: 2 }),
    '3.14',
  );
});
