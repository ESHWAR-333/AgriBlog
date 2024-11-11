import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import "./index.css";
import { UserContext } from "../../context/UserContext";

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  const LoginFun = async (ev) => {
    ev.preventDefault();
    const response = await fetch(
      "https://agriblog-backend.onrender.com/login",
      {
        method: "POST",
        body: JSON.stringify({ user, password }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert("Wrong Credentials");
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }
  return (
    <form className="login" onSubmit={LoginFun}>
      <h1>Login</h1>
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
      <button>Login</button>
    </form>
  );
}

export default Login;
