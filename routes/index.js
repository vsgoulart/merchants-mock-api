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

router.get("/merchants", (req, res, next) => {
  const { page } = req.query;
  const merchantsChunks = _.chunk(merchants, 10);

  if (page) {
    if (page < merchantsChunks.length) {
      res.json({
        lastPage: merchantsChunks.length - 1,
        result: merchantsChunks[page]
      });
    } else {
      res.json({ lastPage: merchantsChunks.length - 1, result: [] });
    }
  } else {
    res.json({
      lastPage: merchantsChunks.length - 1,
      result: merchantsChunks[0]
    });
  }
});

router.get("/merchants/:id", (req, res, next) => {
  const { id } = req.params;
  const merchant = merchants.find(merchant => merchant.id == id);

  if (merchant) {
    res.json({ result: merchant });
  } else {
    return next(new Error("user not found"));
  }
});

router.post("/merchants", (req, res, next) => {
  merchants = [...merchants, { ...req.body }];

  res.json({ result: req.body });
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

  res.json({ result: req.body });
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
    res.json({ result: deletedMerchant });
  } else {
    next(new Error("Merchant not found"));
  }
});

module.exports = router;
