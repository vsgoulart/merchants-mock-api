"use strict";

const _ = require("lodash");
const getRandomNumber = require("./getRandomNumber");

module.exports.getRandomBids = bids => {
  const chunkSize = getRandomNumber(0, 10);
  const bidsChunks = _.chunk(bids, chunkSize);

  return bidsChunks[getRandomNumber(0, bidsChunks.length - 1)];
};
