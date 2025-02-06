import React from 'react';
import { useSelector } from 'react-redux';
import EventItem from '../EventsItem/EventsItem';
import styles from './EventsList.module.sass';

const EventList = () => {
  const timers = useSelector(state => state.timers.events);

  return (
    <div className={styles.eventList}>
      <h2>Live upcoming checks</h2>
      {timers.length === 0 ? (
        <p>No events</p>
      ) : (
        <div className={styles.listContainer}>
          {timers.map(timer => (
            <EventItem key={timer.id} timer={timer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
