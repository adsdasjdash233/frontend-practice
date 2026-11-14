import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 가입된 전체 회원 목록 조회
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.length === 0) {
      alert("등록된 회원 정보가 없습니다. 먼저 회원가입을 해주세요.");
      return;
    }

    // 1. 아이디 존재 여부 확인
    const foundUser = users.find(user => user.id === id);

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
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", id);
    
    // 마이페이지나 홈으로 이동
    navigate("/mypage");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button type="submit" style={{ padding: "10px", backgroundColor: "#008CBA", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
          로그인
        </button>
      </form>
    </div>
  );
}

export default Login;