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
    gender: '남성',
    residence: ''
  });

  // 내가 등록하거나 대여한 물품 카운트를 위한 상태
  const [myItemsCount, setMyItemsCount] = useState(0);
  const [myRentalCount, setMyRentalCount] = useState(0);

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
      setEditForm({ ...foundUser, password: '' });
    }

    // 물품 데이터 연동하여 통계 계산
    const allItems = JSON.parse(localStorage.getItem("items")) || [];
    setMyItemsCount(allItems.filter(item => item.owner === currentUser).length);
    setMyRentalCount(allItems.filter(item => item.renter === currentUser && item.status !== 'AVAILABLE').length);
  }, [isLoggedIn, currentUser, navigate]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (authPassword === userInfo.password) {
      setIsUnlocked(true);
      setIsEditing(true);
      setEditForm({ ...userInfo, password: '' });
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
      name: editForm.name.trim(),
      gender: editForm.gender,
      residence: editForm.residence.trim()
    };

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
    if (setIsLoggedIn) setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  const inputStyle = {
    padding: "10px 12px",
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
    <div style={{ backgroundColor: "#f4f5f7", minHeight: "calc(100vh - 53px)", padding: "24px 0 40px 0", fontFamily: "sans-serif", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* 상단 헤더 영역 */}
        <div style={{ backgroundColor: "#fff", padding: "20px 24px", borderRadius: "8px", border: "1px solid #e1e2e3", boxSizing: "border-box", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#333", margin: "0 0 4px 0" }}>마이페이지</h2>
            <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>회원 정보를 관리하고 나의 대여 활동 내역을 확인합니다.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            style={{ padding: "8px 14px", backgroundColor: "#fff", color: "#d9534f", border: "1px solid #d9534f", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}
          >
            로그아웃
          </button>
        </div>

        {/* 메인 콘텐츠 그리드 레이아웃 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

          {/* [좌측] 기본 회원 정보 및 수정 영역 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {!isUnlocked ? (
              <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #e1e2e3", boxSizing: "border-box" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#333", margin: "0 0 8px 0" }}>회원 정보 보안 인증</h3>
                <p style={{ fontSize: "13px", color: "#666", margin: "0 0 16px 0" }}>
                  정보를 확인하거나 수정하려면 비밀번호를 한 번 더 입력해주세요.
                </p>
                <form onSubmit={handleUnlock} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input
                    type="password"
                    placeholder="현재 비밀번호 입력"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    style={{ ...inputStyle, padding: "12px 14px" }}
                  />
                  <button
                    type="submit"
                    style={{ padding: "12px", backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}
                  >
                    비밀번호 확인
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #00c73c", boxSizing: "border-box" }}>
                <p style={{ fontSize: "13px", color: "#009e2f", margin: "0 0 16px 0", fontWeight: "bold" }}>
                  [안전 모드 해제됨] 정보 수정이 가능합니다.
                </p>

                <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>아이디 (변경 불가)</label>
                    <input type="text" value={userInfo.id} disabled style={{ ...inputStyle, backgroundColor: "#f1f3f5", color: "#666", border: "1px solid #e1e2e3" }} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>새 비밀번호</label>
                    <input type="password" name="password" placeholder="변경할 비밀번호 (미입력시 유지)" value={editForm.password} onChange={handleChange} style={inputStyle} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>이름</label>
                    <input type="text" name="name" value={editForm.name} onChange={handleChange} style={inputStyle} />
                  </div>

                  {/* 성별 선택 버튼 그룹 (드롭다운 겹침 방지) */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "bold", color: "#333" }}>성별</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {["남성", "여성"].map((option) => {
                        const isSelected = editForm.gender === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setEditForm(prev => ({ ...prev, gender: option }))}
                            style={{
                              padding: "10px 12px",
                              borderRadius: "4px",
                              border: isSelected ? "1px solid #00c73c" : "1px solid #d0d5dd",
                              backgroundColor: isSelected ? "#e8fbf0" : "#fff",
                              color: isSelected ? "#009e2f" : "#333",
                              fontSize: "13px",
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
                    <input type="text" name="residence" value={editForm.residence} onChange={handleChange} style={inputStyle} />
                  </div>

                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <button type="submit" style={{ flex: 1, padding: "12px", backgroundColor: "#00c73c", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>
                      저장하기
                    </button>
                    <button type="button" onClick={() => { setIsUnlocked(false); setIsEditing(false); }} style={{ padding: "12px 16px", backgroundColor: "#fff", color: "#333", border: "1px solid #d0d5dd", borderRadius: "4px", cursor: "pointer" }}>
                      취소
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!isEditing && (
              <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #e1e2e3", boxSizing: "border-box" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#333", margin: "0 0 14px 0" }}>기본 회원 정보</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "#555" }}>
                  <p style={{ margin: "0" }}>아이디: <strong style={{ color: "#333" }}>{userInfo.id}</strong></p>
                  <p style={{ margin: "0" }}>비밀번호: <strong style={{ color: "#333" }}>••••••••</strong> (마스킹됨)</p>
                  <p style={{ margin: "0" }}>이름: <strong style={{ color: "#333" }}>{userInfo.name || "미입력"}</strong></p>
                  <p style={{ margin: "0" }}>성별: <strong style={{ color: "#333" }}>{userInfo.gender || "미입력"}</strong></p>
                  <p style={{ margin: "0" }}>거주지역: <strong style={{ color: "#333" }}>{userInfo.residence || "미입력"}</strong></p>
                </div>
              </div>
            )}

          </div>

          {/* [우측] 나의 활동 요약 및 바로가기 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #e1e2e3", boxSizing: "border-box" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#333", margin: "0 0 14px 0" }}>나의 대여 활동 요약</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", backgroundColor: "#f8f9fa", borderRadius: "6px", fontSize: "14px", color: "#333" }}>
                  <span>내가 등록한 물품</span>
                  <strong style={{ color: "#00c73c" }}>{myItemsCount}건</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", backgroundColor: "#f8f9fa", borderRadius: "6px", fontSize: "14px", color: "#333" }}>
                  <span>진행 중인 대여/신청</span>
                  <strong style={{ color: "#2563eb" }}>{myRentalCount}건</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/rental")}
                style={{ width: "100%", marginTop: "16px", padding: "12px", backgroundColor: "#fff", color: "#333", border: "1px solid #d0d5dd", borderRadius: "4px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}
              >
                대여 관리 페이지로 이동하기
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

MyPage.displayName = "MyPage";

export default MyPage;