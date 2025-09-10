import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const cookieUtils = {
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },

  setUser: (user: any) => {
    Cookies.set(USER_KEY, JSON.stringify(user), {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  getUser: () => {
    const userData = Cookies.get(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  removeUser: () => {
    Cookies.remove(USER_KEY);
  },

  clearAll: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
  }
};