import React from "react";
import { utils } from "ethers";

interface DomainAddedProps {
  domainId: string;
}

export const DomainAdded = ({ domainId }: DomainAddedProps) => {
  const domain = new utils.BigNumber(domainId);
  return (
    <div>
      Domain <b>{domain.toString()}</b> added.
    </div>
  );
};
