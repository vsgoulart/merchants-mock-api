"use strict";

const router = require("express").Router();
const _ = require("lodash");
const bids = require("../data/bids.json");
let merchants = require("../data/merchants.json");
const { getRandomBids } = require("../utils/bids");

merchants = merchants.map(merchant => ({
  ...merchant,
  bids: getRandomBids(bids)
}));

router.get("/merchants(/:pagination)?", (req, res, next) => {
  const { pagination } = req.params;
  const merchantsChunks = _.chunk(merchants, 10);

  if (pagination) {
    if (pagination < merchantsChunks.length) {
      res.json(merchantsChunks[pagination]);
    } else {
      res.json([]);
    }
  } else {
    res.json(merchants);
  }
});

router.post("/merchants", (req, res, next) => {
  merchants = [...merchants, { ...req.body }];

  res.json(req.body);
});

router.put("/merchants/:id", (req, res, next) => {
  const { id } = req.params;
  const updatedMerchant = req.body;

  merchants = merchants.map(merchant => {
    if (merchant.id == id) {
      return { ...req.body };
    } else {
      return merchant;
    }
  });

  res.json(req.body);
});

router.delete("/merchants/:id", (req, res, next) => {
  const { id } = req.params;
  let deletedMerchant;

  merchants = merchants.filter(merchant => {
    //filtering like this to save the deleted merchant
    if (merchant.id == id) {
      deletedMerchant = { ...merchant };

      return false;
    } else {
      return true;
    }
  });

  if (deletedMerchant) {
    res.json(deletedMerchant);
  } else {
    next(new Error("Merchant not found"));
  }
});

module.exports = router;
