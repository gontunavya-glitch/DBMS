const db = require("../config/db");

// ============================================
// CREATE BLOOD REQUEST
// ============================================

exports.createRequest = (req, res) => {

    const {
        user_id,
        blood_group,
        units_required,
        urgency
    } = req.body;


    // Check required fields

    if (
        !user_id ||
        !blood_group ||
        !units_required ||
        !urgency
    ) {

        return res.status(400).json({
            success: false,
            message: "Please fill all fields"
        });

    }


    // Find hospital using logged-in user's ID

    const hospitalSQL = `
        SELECT id
        FROM hospitals
        WHERE user_id = ?
    `;


    db.query(
        hospitalSQL,
        [user_id],
        (err, hospitalResult) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Hospital database error"
                });

            }


            if (hospitalResult.length === 0) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Hospital profile not found. Please register hospital details first."
                });

            }


            const hospitalId =
                hospitalResult[0].id;


            // Find blood group

            const bloodSQL = `
                SELECT id
                FROM blood_groups
                WHERE blood_group = ?
            `;


            db.query(
                bloodSQL,
                [blood_group],
                (err, bloodResult) => {

                    if (err) {

                        console.log(err);

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


                    const bloodGroupId =
                        bloodResult[0].id;


                    // Insert blood request

                    const requestSQL = `
                        INSERT INTO blood_requests
                        (
                            hospital_id,
                            blood_group_id,
                            units_required,
                            urgency
                        )
                        VALUES (?, ?, ?, ?)
                    `;


                    db.query(
                        requestSQL,
                        [
                            hospitalId,
                            bloodGroupId,
                            units_required,
                            urgency
                        ],
                        (err, result) => {

                            if (err) {

                                console.log(err);

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Blood request failed",
                                    error:
                                        err.message
                                });

                            }


                            return res.status(201).json({

                                success: true,

                                message:
                                    "Blood request submitted successfully",

                                request_id:
                                    result.insertId

                            });

                        }
                    );

                }
            );

        }
    );

};


// ============================================
// GET ALL BLOOD REQUESTS
// ============================================

exports.getRequests = (req, res) => {

    const sql = `
        SELECT
            br.id,
            h.hospital_name,
            bg.blood_group,
            br.units_required,
            br.urgency,
            br.status,
            br.request_date

        FROM blood_requests br

        JOIN hospitals h
            ON br.hospital_id = h.id

        JOIN blood_groups bg
            ON br.blood_group_id = bg.id

        ORDER BY br.request_date DESC
    `;


    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Unable to fetch requests"
            });

        }


        res.json({
            success: true,
            data: result
        });

    });

};


// ============================================
// GET HOSPITAL BLOOD REQUESTS
// ============================================

exports.getHospitalRequests = (req, res) => {

    const userId = req.params.userId;


    // Find hospital belonging to logged-in user

    const hospitalSQL = `
        SELECT id
        FROM hospitals
        WHERE user_id = ?
    `;


    db.query(
        hospitalSQL,
        [userId],
        (err, hospitalResult) => {

            if (err) {

                console.log(
                    "Hospital lookup error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Hospital database error"
                });

            }


            if (hospitalResult.length === 0) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Hospital profile not found"
                });

            }


            const hospitalId =
                hospitalResult[0].id;


            // Get requests for this hospital

            const requestSQL = `
                SELECT
                    br.id,
                    bg.blood_group,
                    br.units_required,
                    br.urgency,
                    br.status,
                    br.request_date

                FROM blood_requests br

                JOIN blood_groups bg
                    ON br.blood_group_id = bg.id

                WHERE br.hospital_id = ?

                ORDER BY br.request_date DESC
            `;


            db.query(
                requestSQL,
                [hospitalId],
                (err, result) => {

                    if (err) {

                        console.log(
                            "Hospital requests error:",
                            err
                        );

                        return res.status(500).json({
                            success: false,
                            message:
                                "Unable to fetch hospital requests"
                        });

                    }


                    return res.json({
                        success: true,
                        data: result
                    });

                }
            );

        }
    );

};