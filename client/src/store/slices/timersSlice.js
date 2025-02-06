import { createSlice } from '@reduxjs/toolkit';

const LOCAL_STORAGE_KEY = 'timers';

const loadTimersFromStorage = () => {
  const storedTimers = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedTimers ? JSON.parse(storedTimers) : [];
};

const saveTimersToStorage = timers => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(timers));
};

const timersSlice = createSlice({
  name: 'timers',
  initialState: {
    events: loadTimersFromStorage(),
    activeAlerts: 0,
  },
  reducers: {
    addTimer: (state, action) => {
      state.events.push(action.payload);
      state.events.sort((a, b) => new Date(a.date) - new Date(b.date));
      saveTimersToStorage(state.events);
      state.activeAlerts = calculateActiveAlerts(state.events);
    },
    removeTimer: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload);
      saveTimersToStorage(state.events);
      state.activeAlerts = calculateActiveAlerts(state.events);
    },
    updateTimers: state => {
      const now = new Date();

      state.events = state.events.map(event => {
        const eventTime = new Date(event.date);

        if (eventTime <= now) {
          return { ...event, status: 'expired' };
        }

        return event;
      });

      saveTimersToStorage(state.events);
      state.activeAlerts = calculateActiveAlerts(state.events);
    },
  },
});

const calculateActiveAlerts = events => {
  const now = new Date();
  return events.filter(event => {
    const eventTime = new Date(event.date);
    const reminderTime = event.reminder
      ? eventTime - event.reminder * 60 * 1000
      : eventTime;
    return eventTime <= now || reminderTime <= now;
  }).length;
};

export const { addTimer, removeTimer, updateTimers } = timersSlice.actions;
export default timersSlice.reducer;
