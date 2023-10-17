import React from "react";
import { Route, Routes } from "react-router-dom";
import { Hello } from "../pages/Hello";
import { One2Many } from "../pages/one2many/one2many";
import { One2One } from "../pages/one2one/one2one";

export const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/hello" element={<Hello />} />
      <Route path="/one2many" element={<One2Many />} />
      <Route path="/one2one" element={<One2One />} />
    </Routes>
  );
};
