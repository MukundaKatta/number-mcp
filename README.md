# number-mcp

[![npm](https://img.shields.io/npm/v/@mukundakatta/number-mcp.svg)](https://www.npmjs.com/package/@mukundakatta/number-mcp)
[![mcp](https://img.shields.io/badge/protocol-MCP-blue.svg)](https://modelcontextprotocol.io)

MCP server: locale-aware number formatting. Wraps `Intl.NumberFormat` so the
model can ask for currency, percent, or compact (1.2K / 3M) output in any
locale.

## Tool

### `format`

```json
{ "value": 1234567.89, "style": "currency", "currency": "USD" }
```

→ `{ "formatted": "$1,234,567.89" }`

| Field                       | Default  | Notes                                              |
|-----------------------------|----------|----------------------------------------------------|
| `value`                     | required | The number                                         |
| `style`                     | decimal  | `decimal`, `currency`, `percent`, `compact`        |
| `locale`                    | en-US    | BCP 47 (en-US, de-DE, ja-JP, …)                    |
| `currency`                  | USD      | ISO 4217, currency style only                      |
| `minimum_fraction_digits`   | —        | 0-20                                               |
| `maximum_fraction_digits`   | —        | 0-20                                               |

## Configure

```json
{ "mcpServers": { "number": { "command": "npx", "args": ["-y", "@mukundakatta/number-mcp"] } } }
```

## License

MIT.
