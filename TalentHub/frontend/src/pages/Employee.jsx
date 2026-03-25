import React, { useEffect, useState } from "react";
import "./Employee.css";

function Employee() {

    const [employee, setEmployee] = useState({})

    useEffect(() => {

        const employees = JSON.parse(localStorage.getItem("employees")) || []

        const loggedInEmail = localStorage.getItem("loggedInUser")

        const emp = employees.find(e => e.email === loggedInEmail)

        if (emp) {
            setEmployee(emp)
        }

    }, [])

    return (

        <div className="employee-page">

            <h1>My Profile</h1>

            <div className="profile-card">

                <img
                    className="profile-img"
                    src="https://i.pravatar.cc/120"
                    alt="profile"
                />

                <h2>{employee.name}</h2>
                <p>{employee.role}</p>

                <div className="profile-info">

                    <div>
                        <label>Email</label>
                        <p>{employee.email}</p>
                    </div>

                    <div>
                        <label>Phone</label>
                        <p>{employee.phone}</p>
                    </div>

                    <div>
                        <label>Department</label>
                        <p>{employee.department}</p>
                    </div>

                    <div>
                        <label>Joining Date</label>
                        <p>{employee.joinDate}</p>
                    </div>

                    <div>
                        <label>Salary</label>
                        <p>₹{employee.basicSalary}</p>
                    </div>

                </div>

            </div>

        </div>

    )

}

export default Employee