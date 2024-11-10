import React, { useState } from "react";
import "./index.css";

function Registration() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const register = async (ev) => {
    ev.preventDefault();

    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ user, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      alert("Registration successful");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <form className="register" onSubmit={register}>
      <h1>Registration</h1>
      <input
        type="text"
        placeholder="UserName"
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Register</button>
    </form>
  );
}

export default Registration;
