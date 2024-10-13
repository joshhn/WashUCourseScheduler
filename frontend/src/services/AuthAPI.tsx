import { API_URL } from './config.tsx'

interface LoginResponse {
  access: string
  refresh: string
}

interface UserExistResponse {
  exist: boolean
  message: string
}

async function login(email: string, password: string): Promise<LoginResponse> {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }
  const response = await fetch(`${API_URL}/auth/login/`, options)
  return await response.json()
}

async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<LoginResponse> {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      password2: password,
      first_name: firstName,
      last_name: lastName,
    }),
  }
  const response = await fetch(`${API_URL}/auth/register/`, options)
  return await response.json()
}

async function logout(bearerToken: string): Promise<boolean> {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  }
  const response = await fetch(`${API_URL}/auth/logout/`, options)
  return response.ok
}

async function validateToken(token: string): Promise<boolean> {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  }
  try {
    const response = await fetch(`${API_URL}/auth/validate_token/`, options)
    return response.ok
  } catch {
    return false
  }
}

async function userExisted(email: string): Promise<UserExistResponse> {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }
  const response = await fetch(`${API_URL}/auth/user_exist/`, options)
  return await response.json()
}

async function resetPassword(email: string): Promise<boolean> {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }
  const response = await fetch(`${API_URL}/auth/reset_password/`, options)
  return response.ok
}

export default {
  login,
  register,
  logout,
  validateToken,
  userExisted,
  resetPassword,
}
