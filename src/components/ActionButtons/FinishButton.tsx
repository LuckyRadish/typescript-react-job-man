import React from "react";
import { Button } from "react-bootstrap-v5";
import SVG from "react-inlinesvg";

type Props = {
  [k: string]: any;
};

export const FinishButton: React.FC<Props> = (props) => {
  return (
    <Button className="p-0 me-3" variant="transparent" {...props}>
      <SVG src="/assets/svg/stop.svg" width={16} height={16} fill="#0d6efd" />
    </Button>
  );
};
