import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userApi } from '@/services/user.services'
import { productApi } from '@/services/product.services'
import { cartApi } from '@/services/cart.services'
import { favouriteApi } from '@/services/favourites.services'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    
    [userApi.reducerPath]: userApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [favouriteApi.reducerPath]: favouriteApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      cartApi.middleware,
      productApi.middleware,
      favouriteApi.middleware
    ),
})

setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch