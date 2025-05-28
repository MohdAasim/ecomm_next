import React from "react";
import Header from "../../header/Header";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => (
  <>
    <Header aria-label="Main site header" />
    <Outlet />
  </>
);

export default MainLayout;
