import React, { useContext, useEffect } from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function NavBar() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("https://agriblog-backend.onrender.com/profile", {
      credentials: "include",
    }).then((res) => {
      res.json().then((info) => {
        setUserInfo(info);
      });
    });
  }, []);

  function logout() {
    fetch("https://agriblog-backend.onrender.com/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.user;

  return (
    <header>
      <Link to="/" className="logo">
        AgriBlog
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <span onClick={logout}>Logout</span>
          </>
        )}
        {!username && (
          <>
            <Link to="/login" className="">
              Login
            </Link>
            <Link to="/register" className="">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
