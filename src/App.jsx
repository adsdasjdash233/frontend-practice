import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";

function App() {
  // 새로고침해도 로그인 상태가 유지되도록 localStorage 체크
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  return (
    <Router>
      <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto", border: "1px solid #ddd" }}>
        <h1 style={{ padding: "0 20px" }}>🌿 리액트 로그인 실습</h1>
        <Navbar isLoggedIn={isLoggedIn} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
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