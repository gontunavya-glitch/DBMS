const db = require("../config/db");


// ========================================
// GET BLOOD INVENTORY
// ========================================

exports.getInventory = (req, res) => {

    const query = `
        SELECT 
            bg.blood_group, 
            bi.units 
        FROM blood_inventory bi 
        JOIN blood_groups bg 
        ON bi.blood_group_id = bg.id 
        ORDER BY bg.id 
    `;

    db.query(query, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
};


// ========================================
// ADD BLOOD UNITS
// ========================================

exports.addBlood = (req, res) => {

    const {
        blood_group,
        units
    } = req.body;

    const findGroup = `
        SELECT id 
        FROM blood_groups 
        WHERE blood_group = ?
    `;

    db.query(
        findGroup,
        [blood_group],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {

                return res.status(400).json({
                    message: "Blood group not found"
                });
            }

            const updateQuery = `
                UPDATE blood_inventory 
                SET units = units + ? 
                WHERE blood_group_id = ?
            `;

            db.query(
                updateQuery,
                [
                    units,
                    result[0].id
                ],
                (err) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.json({
                        message:
                            "Blood inventory updated successfully"
                    });
                }
            );
        }
    );
};


// ========================================
// GET TOTAL BLOOD INVENTORY COUNT
// ========================================

exports.getInventoryCount = (req, res) => {

    const query = `
        SELECT COALESCE(SUM(units), 0) AS totalUnits
        FROM blood_inventory
    `;

    db.query(query, (err, result) => {

        if (err) {

            console.log(
                "Blood inventory count error:",
                err
            );

            return res.status(500).json({
                success: false,
                message:
                    "Unable to get blood inventory"
            });
        }

        res.json({
            success: true,
            count: result[0].totalUnits
        });

    });
};