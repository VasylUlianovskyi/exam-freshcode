import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CONSTANTS from '../../constants';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './EventsPage.module.sass';
import EventForm from './../../components/Timers/EventForm/EventForm';
import EventList from './../../components/Timers/EventsList/EventsList';
import { updateTimers } from '../../store/slices/timersSlice';

const EventsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userStore?.data);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(updateTimers());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  if (!user || user.role !== CONSTANTS.CUSTOMER) {
    return <Redirect to='/' replace />;
  }
  return (
    <>
      <Header />
      <h1>Events</h1>
      <div className={styles.eventsPage}>
        <div className={styles.eventsContainer}>
          <EventForm />
          <div className={styles.eventsList}>
            <EventList />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EventsPage;
