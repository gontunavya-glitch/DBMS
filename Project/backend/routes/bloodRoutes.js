const express = require("express");

const router = express.Router();

const {
    getInventory,
    addBlood,
    getInventoryCount
} = require("../controllers/bloodController");

const {
    verifyToken,
    adminOnly
} = require("../middleware/auth");


router.get(
    "/inventory",
    getInventory
);


router.get(
    "/count",
    getInventoryCount
);


router.post(
    "/add",
    verifyToken,
    adminOnly,
    addBlood
);


module.exports = router;