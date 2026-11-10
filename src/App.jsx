import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto", border: "1px solid #ddd" }}>
        <h1 style={{ padding: "0 20px" }}>🌿 11일차 실습: React Router</h1>
        {/* 상단 네비게이션바 (페이지 이동 링크) */}
        <Navbar />

        {/* 주소에 따라 보여줄 컴포넌트 매핑 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;