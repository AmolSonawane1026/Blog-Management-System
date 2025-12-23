import { createSlice } from '@reduxjs/toolkit'

// Check if running in browser
const isBrowser = typeof window !== 'undefined'

const initialState = {
  user: isBrowser ? JSON.parse(localStorage.getItem('user')) : null,
  token: isBrowser ? localStorage.getItem('token') : null,
  isAuthenticated: isBrowser ? !!localStorage.getItem('token') : false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true

      if (isBrowser) {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        // Set cookie for middleware
        document.cookie = `token=${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false

      if (isBrowser) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        // Remove cookie
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
