import React from "react";

import { JobProvider } from "./JobProvider";

type Props = {
  children: JSX.Element | JSX.Element[];
};

const AppProvider: React.FC<Props> = ({ children }) => {
  return <JobProvider>{children}</JobProvider>;
};

export default AppProvider;
