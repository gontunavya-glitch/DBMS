const db = require("../config/db");

// ============================================
// REGISTER
// ============================================

exports.register = (req, res) => {

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
        !role
    ) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields"
        });
    }

    // Check if email already exists

    const checkUserSQL = `
        SELECT id
        FROM users
        WHERE email = ?
    `;

    db.query(
        checkUserSQL,
        [email],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (result.length > 0) {

                return res.status(400).json({
                    success: false,
                    message: "Email already registered"
                });

            }

            // ============================================
            // INSERT USER
            // ============================================

            const userSQL = `
                INSERT INTO users
                (name, email, phone, password, role)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                userSQL,
                [
                    name,
                    email,
                    phone,
                    password,
                    role
                ],
                (err, userResult) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            success: false,
                            message: "User registration failed",
                            error: err.message
                        });
                    }

                    const userId = userResult.insertId;

                    // ============================================
                    // DONOR REGISTRATION
                    // ============================================

                    if (role === "donor") {

                        if (
                            !blood_group ||
                            !age ||
                            !gender ||
                            !address
                        ) {

                            return res.status(400).json({
                                success: false,
                                message:
                                    "Please provide donor details"
                            });

                        }

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
                                        message:
                                            "Blood group error"
                                    });

                                }

                                if (bloodResult.length === 0) {

                                    return res.status(400).json({
                                        success: false,
                                        message:
                                            "Invalid blood group"
                                    });

                                }

                                const bloodGroupId =
                                    bloodResult[0].id;

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
                                    (err) => {

                                        if (err) {

                                            console.log(err);

                                            return res.status(500).json({
                                                success: false,
                                                message:
                                                    "Donor registration failed",
                                                error:
                                                    err.message
                                            });

                                        }

                                        return res.status(201).json({

                                            success: true,

                                            message:
                                                "Donor registered successfully",

                                            user_id: userId

                                        });

                                    }
                                );

                            }
                        );

                    }

                    // ============================================
                    // HOSPITAL REGISTRATION
                    // ============================================

                    else if (role === "hospital") {

                        const hospitalName =
                            name;

                        const hospitalSQL = `
                            INSERT INTO hospitals
                            (
                                user_id,
                                hospital_name,
                                address
                            )
                            VALUES (?, ?, ?)
                        `;

                        db.query(
                            hospitalSQL,
                            [
                                userId,
                                hospitalName,
                                address || ""
                            ],
                            (err) => {

                                if (err) {

                                    console.log(err);

                                    return res.status(500).json({
                                        success: false,
                                        message:
                                            "Hospital registration failed",
                                        error:
                                            err.message
                                    });

                                }

                                return res.status(201).json({

                                    success: true,

                                    message:
                                        "Hospital registered successfully",

                                    user_id: userId

                                });

                            }
                        );

                    }

                    // ============================================
                    // ADMIN
                    // ============================================

                    else {

                        return res.status(201).json({

                            success: true,

                            message:
                                "User registered successfully",

                            user_id: userId

                        });

                    }

                }
            );

        }
    );
};


// ============================================
// LOGIN
// ============================================

exports.login = (req, res) => {

    const {
        email,
        password
    } = req.body;

    if (!email || !password) {

        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });

    }

    const sql = `
        SELECT
            id,
            name,
            email,
            phone,
            password,
            role
        FROM users
        WHERE email = ?
    `;

    db.query(
        sql,
        [email],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });

            }

            if (result.length === 0) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });

            }

            const user = result[0];

            if (user.password !== password) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });

            }

            // Don't send password to frontend

            delete user.password;

            return res.json({

                success: true,

                message: "Login successful",

                user: user

            });

        }
    );

};