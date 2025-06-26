import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [auth, setauth] = useState({ user: null, token: "" });

  //default axios

  axios.defaults.headers.common["Authorization"] = auth?.token;
  useEffect(() => {
    const data = localStorage.getItem("auth");
    // console.log(data);
    if (data) {
      const parsedData = JSON.parse(data);
      setauth((prevAuth) => ({
        ...prevAuth,
        user: parsedData.user,
        token: parsedData.token,
      }));
    }
  }, []);
  return (
    <AuthContext.Provider value={[auth, setauth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
export { AuthContextProvider, useAuth };
