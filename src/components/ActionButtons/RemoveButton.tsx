import React from "react";
import { Button } from "react-bootstrap-v5";
import SVG from "react-inlinesvg";

type Props = {
  [k: string]: any;
};

export const RemoveButton: React.FC<Props> = (props) => {
  return (
    <Button className="p-0 me-3" variant="transparent" {...props}>
      <SVG src="/assets/svg/remove.svg" width={24} height={24} fill="#dc3545" />
    </Button>
  );
};
