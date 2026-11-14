import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("남성");
  const [residence, setResidence] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!id || !password || !name || !residence) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 기존 회원 목록 불러오기
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // 중복 아이디 체크
    if (users.some(user => user.id === id)) {
      alert("이미 존재하는 아이디입니다.");
      return;
    }

    const newUser = { id, password, name, gender, residence };
    
    // 회원 목록에 추가 후 저장
    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    alert("회원가입이 완료되었습니다!");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "300px" }}>
      <h2>회원가입</h2>
      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        >
          <option value="남성">남성</option>
          <option value="여성">여성</option>
        </select>
        <input
          type="text"
          placeholder="거주지역 (예: 대구 중구)"
          value={residence}
          onChange={(e) => setResidence(e.target.value)}
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button 
          type="submit" 
          style={{ padding: "10px", backgroundColor: "#16a34a", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}
        >
          가입하기
        </button>
      </form>
    </div>
  );
}

export default Signup;