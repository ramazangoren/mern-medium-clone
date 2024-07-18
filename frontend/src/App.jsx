import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import axios from "axios";
import { createContext, useState } from "react";
import { useEffect } from "react";
import { lookInSession } from "./common/session";
axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

export const UserContext = createContext();

const App = () => {
  const [userAuth, setUserAuth] = useState({});
  useEffect(() => {
    let userInSession = lookInSession("user")
    userInSession ? setUserAuth(JSON.parse(userInSession)) :setUserAuth({access_token: null}) 
  }, []);
  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="/signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="/signup" element={<UserAuthForm type="sign-up" />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
