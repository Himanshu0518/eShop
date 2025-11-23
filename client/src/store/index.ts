import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userApi } from '@/services/user.services'
import { productApi } from '@/services/product.services'
import { cartApi } from '@/services/cart.services'
import { favouriteApi } from '@/services/favourites.services'

export const store = configureStore({
  reducer: {
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
