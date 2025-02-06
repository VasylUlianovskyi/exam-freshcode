import React from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import validationSchemes from '../../../utils/validators/validationSchems';
import timersSlice from '../../../store/slices/timersSlice';
import styles from './EventForm.module.sass';
const EventForm = () => {
  const { addTimer } = timersSlice;
  const { EventsFormSchema } = validationSchemes;
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{ eventName: '', eventDate: '', reminderTime: 10 }}
      validationSchema={EventsFormSchema}
      onSubmit={(values, { resetForm }) => {
        dispatch();
        addTimer({
          id: Date.now(),
          name: values.eventName,
          date: new Date(values.eventDate).toISOString(),
          reminder: values.reminderTime,
          status: 'active',
        });
        resetForm();
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

          <label>Remind in ... minutes :</label>
          <Field type='number' name='reminderTime' min='1' />
          <ErrorMessage
            name='reminderTime'
            component='div'
            className={styles.error}
          />

          <button type='submit' disabled={isSubmitting}>
            Add Event
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default EventForm;
