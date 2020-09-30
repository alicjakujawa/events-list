import React, { useState, useEffect } from "react";
import styles from "./ListItem.module.css";
import { useEvents } from "../hooks/use-events";
import { Avatar } from "./Avatar";

interface ListItemProps {
  event: any;
}

export const ListItem = ({ event }: ListItemProps) => {
  const [date, setDate] = useState<string>("");
  const { getEventDate } = useEvents();

  useEffect(() => {
    const fetchData = async () => {
      const logTime = await getEventDate(event.blockHash);
      const date = new Date(logTime).toLocaleString();
      setDate(date);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.event}>
      {/* Entropy set to block hash because address was exact same for all events - have no idea why :facepalm: */}
      <Avatar
        entropy={event.blockHash || Math.random().toString(36).substring(10)}
      />
      <div>{event.name}</div>
      <div className={styles.secondary}>{date}</div>
    </div>
  );
};
