const express = require("express");
const router = express.Router();

const donorController =
    require("../controllers/donorController");


router.post(
    "/register",
    donorController.registerDonor
);


router.get(
    "/profile/:userId",
    donorController.getDonorProfile
);


router.get(
    "/history/:userId",
    donorController.getDonationHistory
);


// GET TOTAL DONOR COUNT
router.get(
    "/count",
    donorController.getDonorCount
);


router.get("/test", (req, res) => {

    res.json({
        success: true,
        message: "Donor route is working"
    });

});


module.exports = router;