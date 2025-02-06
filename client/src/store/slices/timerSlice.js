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
  },
  reducers: {
    addTimer: (state, action) => {
      state.events.push(action.payload);
      state.events.sort((a, b) => new Date(a.date) - new Date(b.date));
      saveTimersToStorage(state.events);
    },
    removeTimer: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload);
      saveTimersToStorage(state.events);
    },
  },
});

export const { addTimer, removeTimer } = timersSlice.actions;
export default timersSlice.reducer;
