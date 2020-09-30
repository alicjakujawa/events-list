import React from "react";
import styles from "./EventsList.module.css";
import { ListItem } from "./ListItem";

interface EventsListProps {
  events: Array<any>;
}

export const EventsList = ({ events }: EventsListProps) => {
  return (
    <div className={styles.events}>
      {events.map((event, i) => (
        <ListItem
          key={i}
          address={event.address}
          blockHash={event.blockHash}
          name={event.name}
          values={event.values}
        />
      ))}
    </div>
  );
};
