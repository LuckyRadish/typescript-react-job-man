import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import JobMan from "../pages/JobMan";

const routes = [
  {
    index: true,
    component: <JobMan />,
  },
];

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {routes.map(({ component, ...props }, index) => (
        <Route key={index} element={component} {...props} />
      ))}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
