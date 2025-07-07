# ChainGPT AI News MCP Server

A Model Context Protocol (MCP) server that provides access to AI-related crypto and Web3 news through the ChainGPT AI News API.

## Features

- **Smart Filtering**: Filter news by categories, blockchains, tokens, and keywords
- **Date Range Support**: Fetch news from specific time periods
- **Category Mapping**: Supports 20+ categories including DeFi, NFTs, Gaming, DAOs, and more
- **Blockchain Coverage**: Covers 40+ blockchains including Ethereum, Bitcoin, Solana, Polygon, and others
- **Token Tracking**: Track news for 30+ major cryptocurrencies
- **Pagination**: Handle large result sets with limit/offset controls
- **Real-time Data**: Access to the latest crypto and Web3 news


## Integration with MCP Clients

### Claude Desktop

Add to your Claude Desktop configuration:

```json

{
  "mcpServers": {
    "chaingpt-mcp": {
      "command": "npx",
      "args": ["chaingpt-mcp-server"],
      "env": {
        "CHAINGPT_API_KEY": ""
      }
    }
  }
}
```


## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- ChainGPT API key

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/PlayAINetwork/Chaingpt-mcp.git
cd <folder-name>
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Set up environment variables:**
```bash
export CHAINGPT_API_KEY=your_api_key_here
```

Or create a `.env` file:
```env
CHAINGPT_API_KEY=your_api_key_here
```

4. **Run the server:**
```bash
node index.js
```

## Getting a ChainGPT API Key

1. Visit [ChainGPT's website](https://chaingpt.org/)
2. Sign up for an account
3. Navigate to the API section
4. Generate your API key
5. Add it to your environment variables

## Usage

### Basic Usage

The server provides a single tool called `getAINews` with the following parameters:

```javascript
{
  categories: ["defi", "nft"],           // Optional: Filter by categories
  blockchains: ["ethereum", "solana"],  // Optional: Filter by blockchains
  tokens: ["bitcoin", "ethereum"],      // Optional: Filter by tokens
  searchQuery: "AI development",        // Optional: Keyword search
  fetchAfter: "2024-01-01T00:00:00Z",  // Optional: Date filter
  limit: 10,                           // Optional: Number of results (default: 10)
  offset: 0                            // Optional: Pagination offset (default: 0)
}
```

### Example Queries

**Get latest DeFi news:**
```json
{
  "categories": ["defi"],
  "limit": 5
}
```

**Get Ethereum-related news from the last week:**
```json
{
  "blockchains": ["ethereum"],
  "fetchAfter": "2024-01-01T00:00:00Z",
  "limit": 20
}
```

**Search for AI-related crypto news:**
```json
{
  "searchQuery": "artificial intelligence",
  "categories": ["cryptocurrency", "web3"],
  "limit": 15
}
```

### Response Format

The server returns structured JSON responses:

```json
{
  "status": "success",
  "metadata": {
    "totalResults": 10,
    "limit": 10,
    "offset": 0,
    "appliedFilters": {
      "categories": ["defi"],
      "blockchains": [],
      "tokens": [],
      "searchQuery": null,
      "fetchAfter": null,
      "mappedIds": {
        "categoryIds": [5],
        "subCategoryIds": [],
        "tokenIds": []
      }
    },
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "data": [
    {
      "id": "article_id",
      "title": "Latest DeFi Development",
      "description": "Article description...",
      "url": "https://example.com/article",
      "publishedAt": "2024-01-15T09:00:00Z",
      "source": "CryptoNews",
      "category": "DeFi",
      "blockchain": "Ethereum"
    }
  ]
}
```

## Error Handling

The server provides detailed error responses:

```json
{
  "status": "error",
  "message": "ChainGPT API key not found. Please set the CHAINGPT_API_KEY environment variable.",
  "suggestion": "Add CHAINGPT_API_KEY=your_api_key to your environment variables"
}
```

Common error scenarios:
- Missing API key
- Invalid date format
- API rate limiting
- Network connectivity issues

## Development

### Project Structure

```
chaingpt-ainews-mcp/
├── index.js              # Main server file
├── package.json          # Dependencies and scripts
├── README.md            # This file
├── .env.example         # Environment variables template
└── .gitignore          # Git ignore rules
```

### Dependencies

- `@modelcontextprotocol/sdk` - MCP SDK
- `@chaingpt/ainews` - ChainGPT AI News API client
- `zod` - Schema validation

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Issues: [GitHub Issues](https://github.com/yourusername/chaingpt-ainews-mcp/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/chaingpt-ainews-mcp/discussions)
