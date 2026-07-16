const axios = require('axios');
const http = require('http');
const https = require('https');

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // base delay; doubles each retry

// ─── In-memory cache (10 min TTL) ────────────────────────────────────────────
const CACHE_TTL_MS = 10 * 60 * 1000;
const _cache = new Map();

const makeCacheKey = (url, params) => `${url}|${JSON.stringify(params || {})}`;

const fromCache = (key) => {
  const entry = _cache.get(key);
  if (entry && Date.now() < entry.expiresAt) return entry.data;
  _cache.delete(key);
  return null;
};

const toCache = (key, data) => {
  _cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
};

// ─── Raw axios instance ───────────────────────────────────────────────────────
const _axios = axios.create({
  baseURL: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 60000, // 60s — TMDB can be slow from some regions
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryable = (error) => {
  if (!error.response) return true; // ECONNRESET, ETIMEDOUT, ECONNREFUSED, etc.
  return error.response.status === 429 || error.response.status >= 500;
};

// ─── Fetch with retry (exponential backoff) ───────────────────────────────────
const fetchWithRetry = async (url, config, retries = 0) => {
  try {
    return await _axios.get(url, config);
  } catch (error) {
    if (isRetryable(error) && retries < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * Math.pow(2, retries);
      console.warn(
        `TMDB request failed (${error.code || error.message}). Retry ${retries + 1}/${MAX_RETRIES} in ${delay}ms...`
      );
      await sleep(delay);
      return fetchWithRetry(url, config, retries + 1);
    }
    const message = error.response?.data?.status_message || error.message;
    console.error(`TMDB API Error (after ${retries} retries): ${message}`);
    throw error;
  }
};

// ─── Public client: cache-first wrapper ──────────────────────────────────────
const tmdbClient = {
  get: async (url, config = {}) => {
    const key = makeCacheKey(url, config.params);
    const cached = fromCache(key);
    if (cached) {
      return { data: cached };
    }
    const response = await fetchWithRetry(url, config);
    toCache(key, response.data);
    return response;
  },
};

module.exports = tmdbClient;
