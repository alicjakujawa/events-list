import React, { useState, useEffect } from "react";
import styles from "./ListItem.module.css";
import { useEvents } from "../hooks/use-events";
import { Avatar } from "./Avatar";
import { DomainAdded } from "./events/DomainAdded";
import { ColonyRoleSet } from "./events/ColonyRoleSet";
import { PayoutClaimed } from "./events/PayoutClaimed";

interface ListItemProps {
  address: string;
  blockHash: string;
  name: string;
  values: {
    user: string;
    domainId: {
      _hex: string;
    };
    amount: {
      _hex: string;
    };
    fundingPotId: {
      _hex: string;
    };
    token: string;
    role: number;
  };
}

export const ListItem = ({
  address,
  blockHash,
  name,
  values,
}: ListItemProps) => {
  const [date, setDate] = useState<string>("");
  const { getEventDate } = useEvents();

  useEffect(() => {
    const fetchData = async () => {
      const { time, loading, error } = await getEventDate(blockHash);
      if (!loading && !error && time) {
        const date = new Date(time).toLocaleString();
        setDate(date);
      }
    };
    fetchData();
  }, [blockHash]);

  const entropy = values.user || blockHash;
  return (
    <div className={styles.event}>
      <Avatar entropy={entropy} />
      <div className={styles.content}>
        {name === "ColonyInitialised" && (
          <div>Congratulations! It's a beautiful baby colony!</div>
        )}
        {name === "DomainAdded" && (
          <DomainAdded domainId={values.domainId._hex} />
        )}
        {name === "ColonyRoleSet" && (
          <ColonyRoleSet
            domainId={values.domainId._hex}
            role={values.role}
            userAddress={values.user}
          />
        )}
        {name === "PayoutClaimed" && (
          <PayoutClaimed
            amount={values.amount._hex}
            fundingPotId={values.fundingPotId}
            token={values.token}
          />
        )}
        <div className={styles.secondary}>{date}</div>
      </div>
    </div>
  );
};
