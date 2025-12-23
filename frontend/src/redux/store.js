import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from './features/auth/authSlice'
import blogsReducer from './features/blogs/blogsSlice'
import { blogsApi } from './services/blogsApi'
import { authApi } from './services/authApi'
import { usersApi } from './services/usersApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogsReducer,
    [blogsApi.reducerPath]: blogsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(blogsApi.middleware, authApi.middleware, usersApi.middleware),
})

setupListeners(store.dispatch)

export default store
