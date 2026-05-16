#!/usr/bin/env node
/**
 * number MCP server. One tool: `format`.
 *
 * Wraps `Intl.NumberFormat` so the model can ask for currency, percent,
 * decimal, or compact (1.2K / 3M) formatting in any locale.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const VERSION = '0.1.0';

export type Style = 'decimal' | 'currency' | 'percent' | 'compact';

export interface FormatOpts {
  value: number;
  style?: Style;
  locale?: string;
  currency?: string;
  minimum_fraction_digits?: number;
  maximum_fraction_digits?: number;
}

export function formatNumber(opts: FormatOpts): string {
  const style = opts.style ?? 'decimal';
  const locale = opts.locale ?? 'en-US';
  const intlOpts: Intl.NumberFormatOptions = {};
  if (style === 'currency') {
    intlOpts.style = 'currency';
    intlOpts.currency = opts.currency ?? 'USD';
  } else if (style === 'percent') {
    intlOpts.style = 'percent';
  } else if (style === 'compact') {
    intlOpts.notation = 'compact';
  }
  if (opts.minimum_fraction_digits !== undefined) {
    intlOpts.minimumFractionDigits = opts.minimum_fraction_digits;
  }
  if (opts.maximum_fraction_digits !== undefined) {
    intlOpts.maximumFractionDigits = opts.maximum_fraction_digits;
  }
  return new Intl.NumberFormat(locale, intlOpts).format(opts.value);
}

const server = new Server({ name: 'number', version: VERSION }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'format',
    description:
      'Format a number. style: decimal | currency | percent | compact. Locale is BCP 47 (e.g. "en-US", "de-DE").',
    inputSchema: {
      type: 'object',
      properties: {
        value: { type: 'number' },
        style: { type: 'string', enum: ['decimal', 'currency', 'percent', 'compact'], default: 'decimal' },
        locale: { type: 'string', default: 'en-US' },
        currency: { type: 'string', default: 'USD', description: 'ISO 4217 currency code (currency style only).' },
        minimum_fraction_digits: { type: 'integer', minimum: 0, maximum: 20 },
        maximum_fraction_digits: { type: 'integer', minimum: 0, maximum: 20 },
      },
      required: ['value'],
    },
  },
] as const;

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  try {
    if (name !== 'format') return errorResult('unknown tool: ' + name);
    const a = args as unknown as FormatOpts;
    return jsonResult({ formatted: formatNumber(a) });
  } catch (err) {
    return errorResult('number format failed: ' + (err as Error).message);
  }
});

function jsonResult(value: unknown) {
  return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] };
}
function errorResult(message: string) {
  return { isError: true, content: [{ type: 'text', text: message }] };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(`number MCP server v${VERSION} ready on stdio\n`);
}
