import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CONSTANTS from '../../constants';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './EventsPage.module.sass';

const EventsPage = () => {
  const user = useSelector(state => state.userStore?.data);

  if (!user || user.role !== CONSTANTS.CUSTOMER) {
    return <Redirect to='/' replace />;
  }

  return (
    <>
      <Header />
      <div className={styles.eventsPage}>
        <h1>Сторінка Подій (Events)</h1>
        <p>Тут будуть таймери для брендингу</p>
        <div className={styles.eventsList}>{/* Тут будуть таймери */}</div>
      </div>
      <Footer />
    </>
  );
};

export default EventsPage;
