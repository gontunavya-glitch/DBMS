const express = require("express");

const router = express.Router();

const requestController =
    require("../controllers/requestController");


// ==========================================
// CREATE BLOOD REQUEST
// ==========================================

router.post(
    "/",
    requestController.createRequest
);


// ==========================================
// GET ALL BLOOD REQUESTS
// ==========================================

router.get(
    "/",
    requestController.getRequests
);


// ==========================================
// GET HOSPITAL'S BLOOD REQUESTS
// ==========================================

router.get(
    "/hospital/:userId",
    requestController.getHospitalRequests
);


module.exports = router;