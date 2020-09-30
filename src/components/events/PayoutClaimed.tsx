import React, { useState, useEffect } from "react";
import { utils } from "ethers";
import { useEvents } from "../../hooks/use-events";

interface PayoutClaimedProps {
  amount: string;
  fundingPotId: {
    _hex: string;
  };
  token: string;
}

export const PayoutClaimed = ({
  amount,
  fundingPotId,
  token,
}: PayoutClaimedProps) => {
  const [userAddress, setUserAddress] = useState<string>("");
  const { getUserAddress } = useEvents();

  useEffect(() => {
    const fetchData = async () => {
      const { userAddress, loading } = await getUserAddress(
        new utils.BigNumber(fundingPotId._hex).toString()
      );
      if (!loading && userAddress) {
        setUserAddress(userAddress);
      }
    };
    fetchData();
  }, []);

  const value = new utils.BigNumber(amount);
  return (
    <div>
      User <b>{userAddress}</b> claimed{" "}
      <b>
        {value.toString()} {token}
      </b>{" "}
      payout from pot {new utils.BigNumber(fundingPotId._hex).toString()}
    </div>
  );
};
