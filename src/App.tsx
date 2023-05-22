import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google";
import axios from "axios";

import Home from "./components/Home/Home";
import GroupInvite from "./components/GroupInvite/GroupInvite";
import LoginDialog from "./components/Home/LoginDialog";

import "./App.css";
import { User } from "./components/util/interfaces";
import ImpersonateDialog from "./components/Home/ImpersonateDialog";
import Navbar from "./components/Navbar/Navbar";

const clientId =
  "450861594189-bb7h29ise8tfm8db1f27n891l94uiu19.apps.googleusercontent.com";

function App() {
  if (process.env.NODE_ENV === "development") {
    axios.defaults.baseURL = "http://localhost:3000";
  } else {
    axios.defaults.baseURL = "http://localhost:3000";
  }

  const [user, setUser] = useState<User>();
  const [impersonateDialogOpen, setImpersonateDialogOpen] =
    useState<boolean>(false);
  const [impersonatedUser, setImpersonatedUser] = useState<User>();

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const res = await axios.get(`/user`);
      setImpersonatedUser(res.data);
    };
    load();
  }, [user]);

  const handleLogout = () => {
    googleLogout();
    setUser(undefined);
  };

  return (
    <>
      <BrowserRouter basename="/toduelist-front">
        <GoogleOAuthProvider clientId={clientId}>
          <LoginDialog user={user} setUser={setUser} />
          <ImpersonateDialog
            user={user}
            impersonatedUser={impersonatedUser}
            setImpersonatedUser={setImpersonatedUser}
            open={impersonateDialogOpen}
            setOpen={setImpersonateDialogOpen}
          />
          <Navbar
            setImpersonateDialogOpen={setImpersonateDialogOpen}
            handleLogout={handleLogout}
            user={user}
            impersonatedUser={impersonatedUser}
          />
          <Routes>
            <Route path="/" element={<Home user={impersonatedUser} />} />
            <Route
              path="/join/:join_code"
              element={<GroupInvite user={impersonatedUser} />}
            />
          </Routes>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
