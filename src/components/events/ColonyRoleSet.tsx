import React from "react";
import { utils } from "ethers";

interface ColonyRoleSetProps {
  domainId: string;
  role: number;
  userAddress: string;
}

export const ColonyRoleSet = ({
  domainId,
  role,
  userAddress,
}: ColonyRoleSetProps) => {
  const domain = new utils.BigNumber(domainId);
  return (
    <div>
      <b>{role}</b> role assigned to user <b>{userAddress}</b> in domain{" "}
      <b>{domain.toString()}</b>
    </div>
  );
};
