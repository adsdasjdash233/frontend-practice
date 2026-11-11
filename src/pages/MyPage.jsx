import { useNavigate } from "react-router-dom";

function MyPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem("registeredUser"));

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn"); // 로그인 플래그 제거
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2> 마이페이지</h2>
      <p>환영합니다, <strong>{savedUser ? savedUser.id : "사용자"}</strong>님.</p>
      <button 
        onClick={handleLogout} 
        style={{ padding: "8px 15px", backgroundColor: "#f44336", color: "white", border: "none", cursor: "pointer" }}
      >
        로그아웃
      </button>
    </div>
  );
}

export default MyPage;