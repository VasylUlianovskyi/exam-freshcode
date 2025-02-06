import React from 'react';
import { useSelector } from 'react-redux';
import styles from './EventsBadge.module.sass';

const EventBadge = () => {
  const activeAlerts = useSelector(state => state.timers.activeAlerts);

  if (activeAlerts === 0) return null;

  return <div className={styles.badge}>{activeAlerts}</div>;
};

export default EventBadge;
