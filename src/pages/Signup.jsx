import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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

  const inputStyle = {
    padding: "12px 14px",
    border: "1px solid #d0d5dd",
    borderRadius: "4px",
    fontSize: "14px",
    color: "#333",
    backgroundColor: "#fff",
    outline: "none",
    boxSizing: "border-box"
  };

  return (
    <div style={{ backgroundColor: "#f4f5f7", minHeight: "calc(100vh - 53px)", padding: "60px 20px", fontFamily: "sans-serif", boxSizing: "border-box", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
      <div style={{ width: "100%", maxWidth: "420px", backgroundColor: "#fff", padding: "32px", borderRadius: "8px", border: "1px solid #e1e2e3", boxSizing: "border-box" }}>
        
        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", margin: "0 0 6px 0", textAlign: "center" }}>Everrent 회원가입</h2>
        <p style={{ fontSize: "13px", color: "#666", margin: "0 0 24px 0", textAlign: "center" }}>캠퍼스 물품 대여 서비스의 회원이 되어보세요.</p>

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>아이디</label>
            <input
              type="text"
              placeholder="사용할 아이디를 입력하세요"
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

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>이름</label>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {/* 네이티브 select 드롭다운 겹침 방지를 위한 선택 버튼 그룹 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>성별</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {["남성", "여성"].map((option) => {
                const isSelected = gender === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setGender(option)}
                    style={{
                      padding: "11px 14px",
                      borderRadius: "4px",
                      border: isSelected ? "1px solid #00c73c" : "1px solid #d0d5dd",
                      backgroundColor: isSelected ? "#e8fbf0" : "#fff",
                      color: isSelected ? "#009e2f" : "#333",
                      fontSize: "14px",
                      fontWeight: isSelected ? "bold" : "normal",
                      cursor: "pointer"
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>거주지역</label>
            <input
              type="text"
              placeholder="거주지역 (예: 대구 북구)"
              value={residence}
              onChange={(e) => setResidence(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <button 
            type="submit" 
            style={{ width: "100%", padding: "14px", backgroundColor: "#00c73c", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", marginTop: "8px" }}
          >
            가입하기
          </button>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "12px", fontSize: "13px", color: "#666" }}>
            <span>이미 계정이 있으신가요?</span>
            <Link to="/login" style={{ color: "#00c73c", textDecoration: "none", fontWeight: "bold" }}>로그인</Link>
          </div>

        </form>
      </div>
    </div>
  );
}

Signup.displayName = "Signup";

export default Signup;