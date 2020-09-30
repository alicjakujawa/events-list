import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import { EventsList } from "./components/EventsList";
import { useEvents } from "./hooks/use-events";

function App() {
  const { isLoading, events } = useEvents();

  return (
    <div className={styles.container}>
      {!isLoading && events.length ? <EventsList events={events} /> : null}
    </div>
  );
}

export default App;
