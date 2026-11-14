import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MyPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUser");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const [userInfo, setUserInfo] = useState({
    id: '',
    password: '',
    name: '',
    gender: '남성',
    residence: ''
  });

  const [authPassword, setAuthPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    password: '',
    name: '',
    gender: '',
    residence: ''
  });

  useEffect(() => {
    if (!isLoggedIn || !currentUser) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    // 전체 users 배열에서 현재 로그인한 사용자(currentUser) 정보 정확히 조회
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find(user => user.id === currentUser);

    if (foundUser) {
      setUserInfo(foundUser);
      setEditForm(foundUser);
    }
  }, [isLoggedIn, currentUser, navigate]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (authPassword === userInfo.password) {
      setIsUnlocked(true);
      setIsEditing(true);
      alert("인증되었습니다. 회원 정보를 수정할 수 있습니다.");
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    const updatedUser = {
      ...userInfo,
      password: editForm.password || userInfo.password,
      name: editForm.name,
      gender: editForm.gender,
      residence: editForm.residence
    };

    // 전체 users 배열에서 현재 사용자 데이터만 교체하여 저장
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map(user => user.id === currentUser ? updatedUser : user);

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUserInfo(updatedUser);
    setIsEditing(false);
    setIsUnlocked(false);
    setAuthPassword('');
    alert("회원 정보가 성공적으로 수정되었습니다.");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>마이페이지</h2>
        <button 
          onClick={handleLogout}
          style={{ padding: "6px 10px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
        >
          로그아웃
        </button>
      </div>

      {!isUnlocked ? (
        <form onSubmit={handleUnlock} style={{ padding: "15px", border: "1px solid #cbd5e1", borderRadius: "6px", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#f8fafc" }}>
          <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>
            정보를 확인하거나 수정하려면 비밀번호를 한 번 더 입력해주세요.
          </p>
          <input
            type="password"
            placeholder="현재 비밀번호 입력"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <button 
            type="submit"
            style={{ padding: "8px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}
          >
            비밀번호 확인
          </button>
        </form>
      ) : (
        <form onSubmit={handleSave} style={{ padding: "15px", border: "1px solid #16a34a", borderRadius: "6px", display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#f0fdf4" }}>
          <p style={{ fontSize: "13px", color: "#166534", margin: 0, fontWeight: "bold" }}>
            [안전 모드 해제됨] 정보 수정이 가능합니다.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>아이디 (변경 불가)</label>
            <input 
              type="text" 
              value={userInfo.id} 
              disabled 
              style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "#e2e8f0" }} 
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>새 비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="변경할 비밀번호 (미입력시 유지)"
              value={editForm.password}
              onChange={handleChange}
              style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>이름</label>
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleChange}
              style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>성별</label>
            <select
              name="gender"
              value={editForm.gender}
              onChange={handleChange}
              style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
            >
              <option value="남성">남성</option>
              <option value="여성">여성</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>거주지역</label>
            <input
              type="text"
              name="residence"
              value={editForm.residence}
              onChange={handleChange}
              style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              type="submit"
              style={{ flex: 1, padding: "8px", backgroundColor: "#16a34a", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}
            >
              저장하기
            </button>
            <button 
              type="button"
              onClick={() => { setIsUnlocked(false); setIsEditing(false); }}
              style={{ padding: "8px 12px", backgroundColor: "#64748b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              취소
            </button>
          </div>
        </form>
      )}

      {!isEditing && (
        <div style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "6px", display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "#fff" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "bold", margin: "0 0 5px 0" }}>기본 회원 정보</h3>
          <p style={{ margin: "2px 0", fontSize: "13px" }}>아이디: <strong>{userInfo.id}</strong></p>
          <p style={{ margin: "2px 0", fontSize: "13px" }}>비밀번호: <strong>••••••••</strong> (마스킹됨)</p>
          <p style={{ margin: "2px 0", fontSize: "13px" }}>이름: <strong>{userInfo.name || "미입력"}</strong></p>
          <p style={{ margin: "2px 0", fontSize: "13px" }}>성별: <strong>{userInfo.gender || "미입력"}</strong></p>
          <p style={{ margin: "2px 0", fontSize: "13px" }}>거주지역: <strong>{userInfo.residence || "미입력"}</strong></p>
        </div>
      )}
    </div>
  );
}

export default MyPage;