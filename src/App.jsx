import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";
import ItemRegisterForm from "./pages/ItemRegisterForm";
import RentalStatusController from "./pages/RentalStatusController";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  return (
    <Router>
      <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#f4f5f7", fontFamily: "sans-serif" }}>
        <Navbar isLoggedIn={isLoggedIn} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<ItemRegisterForm />} />
          <Route path="/rental" element={<RentalStatusController />} />
          <Route 
            path="/mypage" 
            element={isLoggedIn ? <MyPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;