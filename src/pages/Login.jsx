import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    const savedUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (!savedUser) {
      alert("등록된 회원 정보가 없습니다. 먼저 회원가입을 해주세요.");
      return;
    }

    if (savedUser.id === id && savedUser.password === password) {
      alert("로그인 성공");
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true"); // 로그인 상태 유지
      navigate("/mypage");
    } else {
      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2> 로그인</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{ padding: "8px" }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "8px" }}
        />
        <button type="submit" style={{ padding: "10px", backgroundColor: "#008CBA", color: "white", border: "none" }}>
          로그인
        </button>
      </form>
    </div>
  );
}

export default Login;