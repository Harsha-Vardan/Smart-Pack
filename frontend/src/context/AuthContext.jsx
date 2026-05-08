import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('packsmart_token');
    const savedUser = localStorage.getItem('packsmart_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginUser = (userData, tokenValue) => {
    localStorage.setItem('packsmart_token', tokenValue);
    localStorage.setItem('packsmart_user', JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('packsmart_token');
    localStorage.removeItem('packsmart_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
