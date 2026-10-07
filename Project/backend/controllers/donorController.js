const db = require("../config/db");

// ============================================
// REGISTER DONOR
// ============================================

exports.registerDonor = (req, res) => {

    const {
        name,
        email,
        phone,
        password,
        role,
        blood_group,
        age,
        gender,
        address
    } = req.body;

    // Check required fields
    if (
        !name ||
        !email ||
        !phone ||
        !password ||
        !blood_group ||
        !age ||
        !gender ||
        !address
    ) {
        return res.status(400).json({
            success: false,
            message: "Please fill all fields"
        });
    }

    // --------------------------------------------
    // STEP 1: Check whether email already exists
    // --------------------------------------------

    const checkUserSQL = `
        SELECT id
        FROM users
        WHERE email = ?
    `;

    db.query(checkUserSQL, [email], (err, userResult) => {

        if (err) {
            console.log("Check user error:", err);

            return res.status(500).json({
                success: false,
                message: "Database error while checking user"
            });
        }

        if (userResult.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // --------------------------------------------
        // STEP 2: Get blood group ID
        // --------------------------------------------

        const bloodGroupSQL = `
            SELECT id
            FROM blood_groups
            WHERE blood_group = ?
        `;

        db.query(
            bloodGroupSQL,
            [blood_group],
            (err, bloodResult) => {

                if (err) {
                    console.log("Blood group error:", err);

                    return res.status(500).json({
                        success: false,
                        message: "Blood group database error"
                    });
                }

                if (bloodResult.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid blood group"
                    });
                }

                const bloodGroupId = bloodResult[0].id;

                // --------------------------------------------
                // STEP 3: Insert user
                // --------------------------------------------

                const userSQL = `
                    INSERT INTO users
                    (
                        name,
                        email,
                        phone,
                        password,
                        role
                    )
                    VALUES (?, ?, ?, ?, ?)
                `;

                db.query(
                    userSQL,
                    [
                        name,
                        email,
                        phone,
                        password,
                        "donor"
                    ],
                    (err, userInsertResult) => {

                        if (err) {
                            console.log("User insert error:", err);

                            return res.status(500).json({
                                success: false,
                                message: "User registration failed",
                                error: err.message
                            });
                        }

                        const userId = userInsertResult.insertId;

                        // --------------------------------------------
                        // STEP 4: Insert donor
                        // --------------------------------------------

                        const donorSQL = `
                            INSERT INTO donors
                            (
                                user_id,
                                blood_group_id,
                                age,
                                gender,
                                address
                            )
                            VALUES (?, ?, ?, ?, ?)
                        `;

                        db.query(
                            donorSQL,
                            [
                                userId,
                                bloodGroupId,
                                age,
                                gender,
                                address
                            ],
                            (err, donorResult) => {

                                if (err) {
                                    console.log("Donor insert error:", err);

                                    return res.status(500).json({
                                        success: false,
                                        message: "Donor registration failed",
                                        error: err.message
                                    });
                                }

                                return res.status(201).json({
                                    success: true,
                                    message: "Donor registered successfully",
                                    user_id: userId,
                                    donor_id: donorResult.insertId
                                });
                            }
                        );
                    }
                );
            }
        );
    });
};


// ============================================
// GET DONOR PROFILE
// ============================================

exports.getDonorProfile = (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT
            d.id AS donor_id,
            u.id AS user_id,
            u.name,
            u.email,
            u.phone,
            bg.blood_group,
            d.age,
            d.gender,
            d.address,
            d.last_donation_date
        FROM donors d

        JOIN users u
            ON d.user_id = u.id

        JOIN blood_groups bg
            ON d.blood_group_id = bg.id

        WHERE d.user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.log("Profile error:", err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Donor profile not found"
            });
        }

        res.json({
            success: true,
            data: result[0]
        });
    });
};


// ============================================
// GET DONATION HISTORY
// ============================================

exports.getDonationHistory = (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT
            donations.id,
            blood_groups.blood_group,
            donations.units,
            donations.donation_date

        FROM donations

        JOIN donors
            ON donations.donor_id = donors.id

        JOIN blood_groups
            ON donations.blood_group_id = blood_groups.id

        WHERE donors.user_id = ?

        ORDER BY donations.donation_date DESC
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.log("Donation history error:", err);

            return res.status(500).json({
                success: false,
                message: "Unable to fetch donation history"
            });
        }

        res.json({
            success: true,
            data: result
        });
    });
};
// ==========================================
// GET TOTAL DONOR COUNT
// ==========================================

exports.getDonorCount = (req, res) => {

    const sql = `
        SELECT COUNT(*) AS totalDonors
        FROM donors
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(
                "Donor count error:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Unable to get donor count"
            });

        }

        return res.json({
            success: true,
            count: result[0].totalDonors
        });

    });

};