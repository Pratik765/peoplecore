import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCount: 0,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    markAsRead: (state, action) => {
      const id = action.payload;
      const notification = state.notifications.find((n) => n._id === id);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead: (state) => {
      state.notifications.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      const id = action.payload;
      const removed = state.notifications.find((n) => n._id === id);
      state.notifications = state.notifications.filter((n) => n._id !== id);
      if (removed && !removed.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    clearAll: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const notificationAction = notificationSlice.actions;
export default notificationSlice;
