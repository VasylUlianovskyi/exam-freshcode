import { createSlice } from '@reduxjs/toolkit';

const LOCAL_STORAGE_KEY = 'timers';

const loadTimersFromStorage = () => {
  const storedTimers = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedTimers ? JSON.parse(storedTimers) : [];
};

const timersSlice = createSlice({
  name: 'timers',
  initialState: {
    events: [],
    activeAlerts: 0,
  },
  reducers: {
    setTimers: (state, action) => {
      state.events = action.payload;
      state.activeAlerts = calculateActiveAlerts(state.events);
    },
    addTimer: (state, action) => {
      state.events.push(action.payload);
      state.events.sort((a, b) => new Date(a.date) - new Date(b.date));
      state.activeAlerts = calculateActiveAlerts(state.events);
    },
    removeTimer: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload);
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

export const { setTimers, addTimer, removeTimer, updateTimers } =
  timersSlice.actions;
export default timersSlice.reducer;
