import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import AppProvider from "./contexts/AppProvider";
import AppRoutes from "./routes";

import "./App.css";

type Props = {
  basename?: string;
};

const App: React.FC<Props> = ({ basename }) => {
  return (
    <AppProvider>
      <Router basename={basename}>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;
