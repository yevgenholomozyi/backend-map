const axios = require('axios');
const HttpError = require('../models/http-error');
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

async function getCoordsForAddress(address) {

const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent( // encodes into a URI friendly format
      address
    )}&key=${GOOGLE_API_KEY}`
  );

  const { data } = response;

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
      'Location is not found.',
      422 // 404 may be instead
    );
    throw error;
  }
  const coordinates = data.results[0].geometry.location; // data shall contain an array of results an the first item is likely to be the most relevant
  return coordinates;
}

module.exports = getCoordsForAddress;
