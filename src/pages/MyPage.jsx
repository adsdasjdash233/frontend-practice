import { useNavigate } from "react-router-dom";

function MyPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem("registeredUser"));

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>👤 마이페이지</h2>
      <p>환영합니다, <strong>{savedUser ? savedUser.id : "사용자"}</strong>님!</p>
      <p>이곳은 로그인한 회원만 접근할 수 있는 페이지입니다.</p>
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