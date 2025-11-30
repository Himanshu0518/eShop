import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './index'
import type { AuthResponse } from '@/types/user.types';


export interface AuthState {
  status: boolean;
  user: AuthResponse | null;
}

export const initialState: AuthState = {
  status: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getUser(state, action: PayloadAction<boolean>) {
      state.status = action.payload;
    },
    setUser(state, action: PayloadAction<AuthResponse|null>) {
      state.user = action.payload;
      state.status = true;
    },
    clearUser(state) {
      state.user = null;
      state.status = false;
    }
  }
});

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const { getUser, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;