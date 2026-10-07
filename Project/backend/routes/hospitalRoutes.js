const express = require("express");

const router = express.Router();

const hospitalController =
    require("../controllers/hospitalController");


// GET TOTAL HOSPITAL COUNT

router.get(
    "/count",
    hospitalController.getHospitalCount
);


module.exports = router;