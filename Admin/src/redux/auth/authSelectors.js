export const selectAuth = (state) => state.auth;

export const selectUser = (state) => state.auth.user;

export const selectLoading = (state) => state.auth.loading;

export const selectError = (state) => state.auth.error;

export const isAuthenticated = (state) => state.auth.isAuthenticated;