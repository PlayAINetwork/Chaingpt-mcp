#!/usr/bin/env node

const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const { AINews } = require('@chaingpt/ainews');

const CATEGORY_MAPPINGS = {
  "blockchain gaming": 2,
  "gaming": 2,
  "dao": 3,
  "dapps": 4,
  "defi": 5,
  "lending": 6,
  "metaverse": 7,
  "nft": 8,
  "nfts": 8,
  "stablecoins": 9,
  "stablecoin": 9,
  "cryptocurrency": 64,
  "crypto": 64,
  "decentralized": 65,
  "smart contracts": 66,
  "smart contract": 66,
  "distributed ledger": 67,
  "cryptography": 68,
  "digital assets": 69,
  "tokenization": 70,
  "consensus mechanisms": 71,
  "consensus": 71,
  "ico": 72,
  "initial coin offering": 72,
  "crypto wallets": 73,
  "wallets": 73,
  "web3": 74,
  "web3.0": 74,
  "interoperability": 75,
  "mining": 76,
  "cross-chain": 77,
  "cross-chain transactions": 77,
  "exchange": 78,
  "exchanges": 78
};

const SUBCATEGORY_MAPPINGS = {
  "bitcoin": 11,
  "btc": 11,
  "bnb chain": 12,
  "bnb": 12,
  "celo": 13,
  "cosmos": 14,
  "ethereum": 15,
  "eth": 15,
  "fantom": 16,
  "ftm": 16,
  "flow": 17,
  "litecoin": 18,
  "ltc": 18,
  "monero": 19,
  "xmr": 19,
  "polygon": 20,
  "matic": 20,
  "xrp ledger": 21,
  "xrp": 21,
  "solana": 22,
  "sol": 22,
  "tron": 23,
  "trx": 23,
  "terra": 24,
  "tezos": 25,
  "xtz": 25,
  "wax": 26,
  "algorand": 27,
  "algo": 27,
  "arbitrum": 28,
  "astar": 29,
  "aurora": 30,
  "avalanche": 31,
  "avax": 31,
  "base": 32,
  "binance smart chain": 33,
  "bsc": 33,
  "cardano": 34,
  "ada": 34,
  "cronos": 36,
  "moonbeam": 37,
  "harmony": 41,
  "oasis": 42,
  "oasis sapphire": 43,
  "ontology": 44,
  "optimism": 45,
  "op": 45,
  "other": 46,
  "platon": 47,
  "rangers": 49,
  "ronin": 50,
  "shiden": 51,
  "skale": 52,
  "stacks": 54,
  "stargaze": 55,
  "steem": 56,
  "sx network": 57,
  "telos": 58,
  "telos evm": 59,
  "theta": 61,
  "thundercore": 62
};

const TOKEN_MAPPINGS = {
  "bitcoin": 79,
  "btc": 79,
  "ethereum": 80,
  "eth": 80,
  "tether": 81,
  "usdt": 81,
  "bnb": 82,
  "xrp": 83,
  "usd coin": 84,
  "usdc": 84,
  "solana": 85,
  "sol": 85,
  "cardano": 86,
  "ada": 86,
  "dogecoin": 87,
  "doge": 87,
  "tron": 88,
  "trx": 88,
  "toncoin": 89,
  "ton": 89,
  "dai": 90,
  "polygon": 91,
  "matic": 91,
  "polkadot": 92,
  "dot": 92,
  "litecoin": 93,
  "ltc": 93,
  "wrapped bitcoin": 94,
  "wbtc": 94,
  "bitcoin cash": 95,
  "bch": 95,
  "chainlink": 96,
  "link": 96,
  "shiba inu": 97,
  "shib": 97,
  "unus sed leo": 98,
  "leo": 98,
  "trueusd": 99,
  "tusd": 99,
  "avalanche": 100,
  "avax": 100,
  "stellar": 101,
  "xlm": 101,
  "monero": 102,
  "xmr": 102,
  "okb": 103,
  "cosmos": 104,
  "atom": 104,
  "uniswap": 105,
  "uni": 105,
  "ethereum classic": 106,
  "etc": 106,
  "busd": 107,
  "hedera": 108,
  "hbar": 108
};

function parseTermsToIds(terms, mappingObject) {
  if (!terms || !Array.isArray(terms)) return [];
  
  const ids = [];
  for (const term of terms) {
    const normalizedTerm = term.toLowerCase().trim();
    const id = mappingObject[normalizedTerm];
    if (id !== undefined) {
      ids.push(id);
    }
  }
  return [...new Set(ids)]; 
}

let aiNewsClient = null;

function initializeClient(apiKey) {
  if (!aiNewsClient) {
    aiNewsClient = new AINews({ apiKey });
  }
  return aiNewsClient;
}


const server = new McpServer({
  name: "ChainGPT AI News MCP",
  version: "1.0.0",
  description: "An MCP server for fetching AI-related crypto and Web3 news using ChainGPT AI News API"
});

server.tool(
  "getAINews",
  "Fetch the latest AI-related crypto and Web3 news with optional filtering by categories, blockchains, tokens, keywords, and date range",
  {
    categories: z.array(z.string()).optional().describe("Categories to filter by (e.g., ['defi', 'nft', 'gaming', 'dao', 'metaverse'])"),
    blockchains: z.array(z.string()).optional().describe("Blockchains/networks to filter by (e.g., ['ethereum', 'bitcoin', 'solana', 'polygon'])"),
    tokens: z.array(z.string()).optional().describe("Tokens/cryptocurrencies to filter by (e.g., ['bitcoin', 'ethereum', 'usdt', 'bnb'])"),
    searchQuery: z.string().optional().describe("Keyword or phrase to search for in news titles and descriptions"),
    fetchAfter: z.string().optional().describe("Only return news published after this date (ISO 8601 format, e.g., '2024-01-01T00:00:00Z')"),
    limit: z.number().default(10).describe("Number of news articles to return (default: 10)"),
    offset: z.number().default(0).describe("Number of items to skip for pagination (default: 0)")
  },
  async ({ categories, blockchains, tokens, searchQuery, fetchAfter, limit = 10, offset = 0 }) => {
    try {
      const apiKey = process.env.CHAINGPT_API_KEY;
      if (!apiKey) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              status: "error",
              message: "ChainGPT API key not found. Please set the CHAINGPT_API_KEY environment variable.",
              suggestion: "Add CHAINGPT_API_KEY=your_api_key to your environment variables"
            }, null, 2)
          }]
        };
      }

      const client = initializeClient(apiKey);

      const categoryIds = parseTermsToIds(categories, CATEGORY_MAPPINGS);
      const subCategoryIds = parseTermsToIds(blockchains, SUBCATEGORY_MAPPINGS);
      const tokenIds = parseTermsToIds(tokens, TOKEN_MAPPINGS);

      const requestParams = {
        limit,
        offset,
        sortBy: 'createdAt'
      };

      if (categoryIds.length > 0) {
        requestParams.categoryId = categoryIds;
      }

      if (subCategoryIds.length > 0) {
        requestParams.subCategoryId = subCategoryIds;
      }

      if (tokenIds.length > 0) {
        requestParams.tokenId = tokenIds;
      }

      if (searchQuery) {
        requestParams.searchQuery = searchQuery;
      }

      if (fetchAfter) {
        try {
          requestParams.fetchAfter = new Date(fetchAfter);
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                status: "error",
                message: "Invalid date format for fetchAfter. Please use ISO 8601 format (e.g., '2024-01-01T00:00:00Z')",
                providedDate: fetchAfter
              }, null, 2)
            }]
          };
        }
      }

      const response = await client.getNews(requestParams);

      const result = {
        status: "success",
        metadata: {
          totalResults: response.data.length,
          limit,
          offset,
          appliedFilters: {
            categories: categories || [],
            blockchains: blockchains || [],
            tokens: tokens || [],
            searchQuery: searchQuery || null,
            fetchAfter: fetchAfter || null,
            mappedIds: {
              categoryIds,
              subCategoryIds,
              tokenIds
            }
          },
          timestamp: new Date().toISOString()
        },
        data: response.data
      };

      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };

    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "error",
            message: `Failed to fetch AI news: ${error.message}`,
            errorType: error.constructor.name,
            timestamp: new Date().toISOString()
          }, null, 2)
        }]
      };
    }
  }
);

// Start the server
async function startServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("ChainGPT AI News MCP server started successfully");
    
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

startServer();