"use strict";

const router = require("express").Router();
const bids = require("../data/bids.json");
let merchants = require("../data/merchants.json");
const { getRandomBids } = require("../utils/bids");
let lastID = merchants[merchants.length - 1].id;

merchants = merchants.map(merchant => ({
  ...merchant,
  bids: getRandomBids(bids)
}));

router.get("/merchants", (req, res, next) => {
  const { page } = req.query;

  res.json({ result: merchants });
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
  const newMerchant = { ...req.body, id: ++lastID, bids: [] };
  merchants = [...merchants, { ...newMerchant }];

  res.json({ result: newMerchant });
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
