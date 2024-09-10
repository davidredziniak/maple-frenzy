import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import Landing from "./pages/Landing.js";
import Register from "./pages/Auth/Register.js";
import Login from "./pages/Auth/Login.js";
import Profile from "./pages/User/Profile.js";
import Dashboard from "./pages/Dashboard/Dashboard.js";
import CreateTrade from "./pages/Trades/CreateTrade.js";
import JoinFrenzy from "./pages/Trades/JoinFrenzy.js";
import FrenzyWaiting from "./pages/Trades/WaitingPage.js";
import FindFrenzy from "./pages/Trades/FindFrenzy.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./pages/Auth/AuthContext.js";
import UserTrades from "./pages/User/UserTrades.js";
import PageNotFound from "./pages/PageNotFound.js";
import ScrollToTop from "./ScrollToTop.js";

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/create" element={<CreateTrade />} />
            <Route path="/dashboard/:tradeId" element={<Dashboard />} />
            <Route exact path="/find" element={<FindFrenzy />} />
            <Route exact path="/join" element={<JoinFrenzy />} />
            <Route path="/view/:tradeId" element={<FrenzyWaiting />} />
            <Route exact path="/trades" element={<UserTrades />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </AuthProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
