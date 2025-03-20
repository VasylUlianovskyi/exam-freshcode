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
import { updateTimers, setTimers } from '../../store/slices/timersSlice';

const LOCAL_STORAGE_KEY = 'timers';

const EventsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userStore?.data);
  const events = useSelector(state => state.timers.events);

  useEffect(() => {
    const storedTimers = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTimers) {
      dispatch(setTimers(JSON.parse(storedTimers)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(updateTimers());
    }, 1000);

    return () => clearInterval(interval);
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
