import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";
import ItemRegisterForm from "./pages/ItemRegisterForm"; // 물품 등록 폼 추가

function App() {
  // 앱 마운트 시 스토리지를 확인해서 초기 로그인 상태 복원 (새로고침 대응)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  return (
    <Router>
      <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto", border: "1px solid #ddd", minHeight: "100vh" }}>
        <Navbar isLoggedIn={isLoggedIn} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<ItemRegisterForm />} /> {/* 물품 등록 페이지 */}
          {/* 비로그인 유저의 마이페이지 접근 차단 (리다이렉트) */}
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