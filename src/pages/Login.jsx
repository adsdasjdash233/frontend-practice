import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useWindowWidth } from "../hooks/useWindowWidth";

function Login({ setIsLoggedIn }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { isMobile } = useWindowWidth();

  const handleLogin = (e) => {
    e.preventDefault();

    const trimmedId = id.trim();
    if (!trimmedId || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    // 가입된 전체 회원 목록 조회
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.length === 0) {
      alert("등록된 회원 정보가 없습니다. 먼저 회원가입을 해주세요.");
      return;
    }

    // 1. 아이디 존재 여부 확인
    const foundUser = users.find(user => user.id === trimmedId);

    if (!foundUser) {
      alert("존재하지 않는 아이디입니다.");
      return;
    }

    // 2. 아이디는 존재하지만 비밀번호가 틀린 경우
    if (foundUser.password !== password) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 3. 로그인 성공
    alert("로그인 성공!");
    if (typeof setIsLoggedIn === "function") {
      setIsLoggedIn(true);
    }
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", foundUser.id);

    // 홈으로 이동
    navigate("/");
  };

  const inputStyle = {
    padding: "12px 14px",
    border: "1px solid #d0d5dd",
    borderRadius: "4px",
    fontSize: "14px",
    color: "#333",
    backgroundColor: "#fff",
    outline: "none",
    boxSizing: "border-box",
    width: "100%"
  };

  return (
    <div style={{ backgroundColor: "#f4f5f7", minHeight: "calc(100vh - 53px)", padding: isMobile ? "28px 14px" : "60px 20px", fontFamily: "sans-serif", boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
      <div style={{ width: "100%", maxWidth: "420px", backgroundColor: "#fff", padding: isMobile ? "24px 18px" : "32px", borderRadius: "8px", border: "1px solid #e1e2e3", boxSizing: "border-box" }}>

        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: "0 0 6px 0", textAlign: "center" }}>Everrent 로그인</h2>
        <p style={{ fontSize: "13px", color: "#666", margin: "0 0 24px 0", textAlign: "center" }}>캠퍼스 물품 대여 서비스에 로그인하세요.</p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>아이디</label>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              value={id}
              onChange={(e) => setId(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <button
            type="submit"
            style={{ width: "100%", padding: "14px", backgroundColor: "#00c73c", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", marginTop: "8px" }}
          >
            로그인
          </button>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "12px", fontSize: "13px", color: "#666" }}>
            <span>계정이 없으신가요?</span>
            <Link to="/signup" style={{ color: "#00c73c", textDecoration: "none", fontWeight: "bold" }}>회원가입</Link>
          </div>

        </form>
      </div>
    </div>
  );
}

Login.displayName = "Login";

export default Login;