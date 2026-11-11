import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (!id || !password) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    // 간단하게 회원 정보를 객체로 만들어 localStorage에 저장
    const userInfo = { id, password };
    localStorage.setItem("registeredUser", JSON.stringify(userInfo));

    alert("회원가입이 완료되었습니다.");
    navigate("/login"); // 가입 후 로그인 페이지로 이동
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📝 회원가입</h2>
      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
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
        <button type="submit" style={{ padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none" }}>
          가입하기
        </button>
      </form>
    </div>
  );
}

export default Signup;