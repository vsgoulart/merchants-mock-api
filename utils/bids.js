"use strict";

const _ = require("lodash");
const getRandomNumber = require("./getRandomNumber");

module.exports.getRandomBids = bids => {
  const chunkSize = getRandomNumber(0, 10);
  const bidsChunks = _.chunk(bids, chunkSize);
  const randomChunk = bidsChunks.length
    ? bidsChunks[getRandomNumber(0, bidsChunks.length - 1)]
    : [];

  return randomChunk;
};
