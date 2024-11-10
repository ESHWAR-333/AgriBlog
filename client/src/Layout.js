import React from "react";
import NavBar from "./components/NavBar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <main>
      <NavBar />
      <Outlet />
    </main>
  );
}

export default Layout;
