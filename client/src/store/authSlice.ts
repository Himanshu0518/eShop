import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: false,
    user: null,
  },
  reducers: {
    getUser(state, action) {
      state.status = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.status = true;
    }
  }
});

export const { getUser, setUser } = authSlice.actions;
export default authSlice.reducer;
