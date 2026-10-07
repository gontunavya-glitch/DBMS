const API_URL = "http://localhost:5000/api";


// ==========================================
// DONOR DASHBOARD
// ==========================================

async function loadDonorDashboard() {

    const profileBox =
        document.getElementById("donorProfile");

    const historyBody =
        document.getElementById("donationHistory");


    // Get logged-in user

    const user =
        JSON.parse(localStorage.getItem("user"));


    if (!user || !user.id) {

        if (profileBox) {
            profileBox.innerHTML =
                "Please login again.";
        }

        return;
    }


    const userId = user.id;


    // ==========================================
    // LOAD DONOR PROFILE
    // ==========================================

    try {

        const response = await fetch(
            `${API_URL}/donors/profile/${userId}`
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load profile"
            );

        }


        const donor =
            data.data;


        if (profileBox) {

            profileBox.innerHTML = `
                <h2>Welcome, ${donor.name}</h2>

                <p>
                    <strong>Email:</strong>
                    ${donor.email}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${donor.phone || "Not available"}
                </p>

                <p>
                    <strong>Blood Group:</strong>
                    ${donor.blood_group}
                </p>

                <p>
                    <strong>Age:</strong>
                    ${donor.age || "Not available"}
                </p>

                <p>
                    <strong>Gender:</strong>
                    ${donor.gender || "Not available"}
                </p>

                <p>
                    <strong>Address:</strong>
                    ${donor.address || "Not available"}
                </p>
            `;

        }

    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );


        if (profileBox) {

            profileBox.innerHTML =
                "Unable to load donor profile.";

        }

    }


    // ==========================================
    // LOAD DONATION HISTORY
    // ==========================================

    try {

        const response = await fetch(
            `${API_URL}/donors/history/${userId}`
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load donation history"
            );

        }


        const donations =
            data.data;


        if (!historyBody) {
            return;
        }


        historyBody.innerHTML = "";


        if (donations.length === 0) {

            historyBody.innerHTML = `
                <tr>
                    <td colspan="4">
                        No donation history found.
                    </td>
                </tr>
            `;

            return;
        }


        donations.forEach(donation => {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>${donation.id}</td>

                <td>${donation.blood_group}</td>

                <td>${donation.units}</td>

                <td>${donation.donation_date}</td>
            `;


            historyBody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Donation history error:",
            error
        );


        if (historyBody) {

            historyBody.innerHTML = `
                <tr>
                    <td colspan="4">
                        Unable to load donation history.
                    </td>
                </tr>
            `;

        }

    }

}


// ==========================================
// HOSPITAL DASHBOARD
// ==========================================

async function loadHospitalDashboard() {

    const requestTable =
        document.getElementById("requestTable");


    // Get logged-in user

    const user =
        JSON.parse(localStorage.getItem("user"));


    if (!user || !user.id) {

        if (requestTable) {

            requestTable.innerHTML = `
                <tr>
                    <td colspan="6">
                        Please login again.
                    </td>
                </tr>
            `;

        }

        return;
    }


    const userId = user.id;


    // ==========================================
    // LOAD HOSPITAL REQUESTS
    // ==========================================

    try {

        const response = await fetch(
            `${API_URL}/requests/hospital/${userId}`
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load blood requests"
            );

        }


        const requests =
            data.data;


        if (!requestTable) {
            return;
        }


        requestTable.innerHTML = "";


        // No requests

        if (!requests || requests.length === 0) {

            requestTable.innerHTML = `
                <tr>
                    <td colspan="6">
                        No blood requests found.
                    </td>
                </tr>
            `;

            return;
        }


        // Display requests

        requests.forEach(request => {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>${request.id}</td>

                <td>${request.blood_group}</td>

                <td>${request.units_required}</td>

                <td>${request.urgency}</td>

                <td>${request.status}</td>

                <td>${request.request_date}</td>
            `;


            requestTable.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Hospital request error:",
            error
        );


        if (requestTable) {

            requestTable.innerHTML = `
                <tr>
                    <td colspan="6">
                        Unable to load blood requests.
                    </td>
                </tr>
            `;

        }

    }

}


// ==========================================
// OPEN REQUEST BLOOD PAGE
// ==========================================

function openRequestPage() {

    window.location.href =
        "request-blood.html";

}


// ==========================================
// RUN DONOR DASHBOARD
// ==========================================

if (
    document.getElementById("donorProfile") ||
    document.getElementById("donationHistory")
) {

    loadDonorDashboard();

}


// ==========================================
// RUN HOSPITAL DASHBOARD
// ==========================================

if (
    document.getElementById("requestTable")
) {

    loadHospitalDashboard();

}


// ==========================================
// SUBMIT BLOOD REQUEST
// ==========================================

const requestForm =
    document.getElementById("requestForm");

if (requestForm) {

    requestForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const bloodGroup =
                document.getElementById("blood_group").value;


            const unitsRequired =
                document.getElementById("units_required").value;


            const urgency =
                document.getElementById("urgency").value;


            const message =
                document.getElementById("requestMessage");


            // Get logged-in hospital user

            const user =
                JSON.parse(localStorage.getItem("user"));


            if (!user || !user.id) {

                message.innerText =
                    "Please login as a hospital first.";

                message.style.color = "red";

                return;
            }


            try {

                const response = await fetch(
                    `${API_URL}/requests`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            user_id: user.id,
                            blood_group: bloodGroup,
                            units_required: unitsRequired,
                            urgency: urgency
                        })
                    }
                );


                const data =
                    await response.json();


                if (!response.ok) {

                    message.innerText =
                        data.message ||
                        "Blood request failed.";

                    message.style.color = "red";

                    return;
                }


                message.innerText =
                    "Blood request submitted successfully!";

                message.style.color = "green";


                requestForm.reset();


            } catch (error) {

                console.error(
                    "Request submission error:",
                    error
                );


                message.innerText =
                    "Unable to connect to server.";

                message.style.color = "red";

            }

        }
    );

}


// ==========================================
// ADMIN DASHBOARD
// ==========================================

async function loadAdminDashboard() {

    const requestTable =
        document.getElementById("adminRequestTable");


    const requestCount =
        document.getElementById("requestCount");


    // DONOR COUNT

    const donorCount =
        document.getElementById("donorCount");


    // HOSPITAL COUNT

    const hospitalCount =
        document.getElementById("hospitalCount");


    // BLOOD INVENTORY COUNT

    const inventoryCount =
        document.getElementById("inventoryCount");


    const user =
        JSON.parse(localStorage.getItem("user"));


    // ==========================================
    // CHECK ADMIN LOGIN
    // ==========================================

    if (!user || !user.id) {

        if (requestTable) {

            requestTable.innerHTML = `
                <tr>
                    <td colspan="7">
                        Please login again.
                    </td>
                </tr>
            `;

        }

        return;
    }


    // ==========================================
    // CHECK ADMIN ROLE
    // ==========================================

    if (user.role !== "admin") {

        if (requestTable) {

            requestTable.innerHTML = `
                <tr>
                    <td colspan="7">
                        Access denied. Admin login required.
                    </td>
                </tr>
            `;

        }

        return;
    }


    // ==========================================
    // LOAD DONOR COUNT
    // ==========================================

    try {

        const response = await fetch(
            `${API_URL}/donors/count`
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load donor count"
            );

        }


        if (donorCount) {

            donorCount.innerText =
                data.count;

        }


    } catch (error) {

        console.error(
            "Donor count error:",
            error
        );


        if (donorCount) {

            donorCount.innerText =
                "Error";

        }

    }


    // ==========================================
    // LOAD HOSPITAL COUNT
    // ==========================================

    try {

        const response = await fetch(
            `${API_URL}/hospitals/count`
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load hospital count"
            );

        }


        if (hospitalCount) {

            hospitalCount.innerText =
                data.count;

        }


    } catch (error) {

        console.error(
            "Hospital count error:",
            error
        );


        if (hospitalCount) {

            hospitalCount.innerText =
                "Error";

        }

    }


    // ==========================================
    // LOAD BLOOD INVENTORY COUNT
    // ==========================================

    try {

        const response = await fetch(
            `${API_URL}/blood/count`
        );


        const data =
            await response.json();


        console.log(
            "Blood inventory response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load blood inventory"
            );

        }


        if (inventoryCount) {

            inventoryCount.innerText =
                data.count;

        }


    } catch (error) {

        console.error(
            "Blood inventory error:",
            error
        );


        if (inventoryCount) {

            inventoryCount.innerText =
                "Error";

        }

    }


    // ==========================================
    // LOAD ALL BLOOD REQUESTS
    // ==========================================

    try {

        const response = await fetch(
            `${API_URL}/requests`
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load requests"
            );

        }


        const requests =
            data.data || [];


        // Show request count

        if (requestCount) {

            requestCount.innerText =
                requests.length;

        }


        if (!requestTable) {
            return;
        }


        requestTable.innerHTML = "";


        // No requests

        if (requests.length === 0) {

            requestTable.innerHTML = `
                <tr>
                    <td colspan="7">
                        No blood requests found.
                    </td>
                </tr>
            `;

            return;
        }


        // Display requests

        requests.forEach(request => {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>${request.id}</td>

                <td>${request.hospital_name}</td>

                <td>${request.blood_group}</td>

                <td>${request.units_required}</td>

                <td>${request.urgency}</td>

                <td>${request.status}</td>

                <td>${request.request_date}</td>
            `;


            requestTable.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Admin request error:",
            error
        );


        if (requestTable) {

            requestTable.innerHTML = `
                <tr>
                    <td colspan="7">
                        Unable to load blood requests.
                    </td>
                </tr>
            `;

        }

    }

}


// ==========================================
// RUN ADMIN DASHBOARD
// ==========================================

if (
    document.getElementById("adminRequestTable")
) {

    loadAdminDashboard();

}