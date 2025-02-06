import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import timersSlice from '../../../store/slices/timersSlice';

import styles from './EventsList.module.sass';

const EventList = () => {
  const { removeTimer } = timersSlice;
  const dispatch = useDispatch();
  const timers = useSelector(state => state.timers.events);

  return (
    <div className={styles.eventList}>
      {timers.length === 0 ? (
        <p>No events</p>
      ) : (
        timers.map(timer => (
          <div key={timer.id} className={styles.eventItem}>
            <div>
              <h3>{timer.name}</h3>
              <p>Date: {new Date(timer.date).toLocaleString()}</p>
              <p>Remind мшф {timer.reminder} хв.</p>
            </div>
            <button onClick={() => dispatch(removeTimer(timer.id))}>
              DELETE
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default EventList;
