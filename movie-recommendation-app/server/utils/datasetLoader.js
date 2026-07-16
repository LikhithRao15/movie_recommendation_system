const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// In-memory maps for fast lookups
let imdbToTmdb = new Map(); // imdbId (number) -> tmdbId (number)
let tmdbToImdb = new Map(); // tmdbId (number) -> imdbId (number)
let isLoaded = false;

/**
 * Load and parse the CSV dataset into memory maps.
 * CSV format: movieId, movie_title, movie_genres, imdbId, tmdbId
 */
const loadDataset = () => {
  return new Promise((resolve, reject) => {
    if (isLoaded) {
      console.log('📦 Dataset already loaded, skipping.');
      return resolve();
    }

    const filePath = path.join(__dirname, '../data/links.csv');

    if (!fs.existsSync(filePath)) {
      console.warn('⚠️  Dataset file not found at', filePath);
      isLoaded = true;
      return resolve();
    }

    let count = 0;
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // The CSV has: movieId, movie_title, movie_genres, imdbId, tmdbId
        const imdbId = parseInt(row.imdbId, 10);
        const tmdbId = parseInt(parseFloat(row.tmdbId), 10); // handle floats like "862.0"

        if (!isNaN(imdbId) && !isNaN(tmdbId) && tmdbId > 0) {
          imdbToTmdb.set(imdbId, tmdbId);
          tmdbToImdb.set(tmdbId, imdbId);
          count++;
        }
      })
      .on('end', () => {
        isLoaded = true;
        console.log(`✅ Dataset loaded: ${count} movies mapped (imdbId ↔ tmdbId)`);
        resolve();
      })
      .on('error', (err) => {
        console.error('❌ Failed to load dataset:', err.message);
        reject(err);
      });
  });
};

/**
 * Get TMDB ID from IMDb ID
 * @param {number} imdbId
 * @returns {number|null}
 */
const getTmdbId = (imdbId) => {
  return imdbToTmdb.get(Number(imdbId)) || null;
};

/**
 * Get IMDb ID from TMDB ID
 * @param {number} tmdbId
 * @returns {number|null}
 */
const getImdbId = (tmdbId) => {
  return tmdbToImdb.get(Number(tmdbId)) || null;
};

/**
 * Check if dataset is loaded
 */
const isDatasetLoaded = () => isLoaded;

/**
 * Get dataset stats
 */
const getDatasetStats = () => ({
  totalMappings: imdbToTmdb.size,
  isLoaded,
});

module.exports = { loadDataset, getTmdbId, getImdbId, isDatasetLoaded, getDatasetStats };
