import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeTimer } from '../../../store/slices/timersSlice';
import styles from './EventsItem.module.sass';

const EventItem = ({ timer }) => {
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(timer.date));
  const totalTime =
    new Date(timer.date) - new Date(timer.createdAt || timer.date);
  const remainingTime = new Date(timer.date) - new Date();
  const progress = Math.max(
    0,
    Math.min(100, (remainingTime / totalTime) * 100)
  );

  function calculateTimeLeft (targetDate) {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(timer.date));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.date]);

  return (
    <div className={styles.eventItem}>
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      <div className={styles.timerInfo}>
        <h3>{timer.name}</h3>
        <p>
          {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left
        </p>
      </div>
      <button onClick={() => dispatch(removeTimer(timer.id))}>DELETE</button>
    </div>
  );
};

export default EventItem;
