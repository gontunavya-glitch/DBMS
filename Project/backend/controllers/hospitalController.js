const db = require("../config/db");


// ==========================================
// GET TOTAL HOSPITAL COUNT
// ==========================================

exports.getHospitalCount = (req, res) => {

    const sql = `
        SELECT COUNT(*) AS totalHospitals
        FROM hospitals
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(
                "Hospital count error:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Unable to get hospital count"
            });

        }

        return res.json({
            success: true,
            count: result[0].totalHospitals
        });

    });

};