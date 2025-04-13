import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import validationSchemes from '../../../utils/validators/validationSchems';
import { addTimer } from '../../../store/slices/timersSlice';
import styles from './EventForm.module.sass';
const EventForm = () => {
  const { EventsFormSchema } = validationSchemes;
  const dispatch = useDispatch();

  const [isClicked, setIsClicked] = useState(false);

  return (
    <Formik
      initialValues={{ eventName: '', eventDate: '', reminderTime: 10 }}
      validationSchema={EventsFormSchema}
      onSubmit={(values, { resetForm }) => {
        const newTimer = {
          id: Date.now(),
          name: values.eventName,
          date: new Date(values.eventDate).toISOString(),
          reminder: values.reminderTime,
          createdAt: new Date().toISOString(),
          status: 'active',
        };

        dispatch(addTimer(newTimer));

        resetForm();

        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 300);
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.eventForm}>
          <label>Event:</label>
          <Field type='text' name='eventName' placeholder='Events name' />
          <ErrorMessage
            name='eventName'
            component='div'
            className={styles.error}
          />

          <label>Date and Time:</label>
          <Field type='datetime-local' name='eventDate' />
          <ErrorMessage
            name='eventDate'
            component='div'
            className={styles.error}
          />

          <label>Remind in ... minutes:</label>
          <Field type='number' name='reminderTime' min='1' />
          <ErrorMessage
            name='reminderTime'
            component='div'
            className={styles.error}
          />

          <button
            type='submit'
            disabled={isSubmitting}
            className={isClicked ? styles.active : ''}
          >
            Add Event
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default EventForm;
