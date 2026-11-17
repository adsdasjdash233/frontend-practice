import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const currentUser = localStorage.getItem("currentUser");

  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("items")) || [];
    setItems(savedItems);
  }, []);

  const availableItems = items.filter(item => item.status === 'AVAILABLE');

  const searchResults = availableItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRequestRental = (itemId) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        if (item.owner === currentUser) {
          alert("내가 등록한 물품은 대여 신청할 수 없습니다.");
          return item;
        }
        return {
          ...item,
          status: 'REQUESTED',
          renter: currentUser
        };
      }
      return item;
    });

    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));
    alert("대여 신청이 완료되었습니다.");
    navigate("/rental");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    window.location.reload();
  };

  return (
    <div style={{ backgroundColor: "#f4f5f7", minHeight: "calc(100vh - 53px)", fontFamily: "sans-serif", padding: "24px 0 40px 0" }}>
      
      {/* 네이버 스타일 레이아웃: 전체 폭을 적절히 넓게 잡고 좌우 2분할 (좌측: 메인 피드 / 우측: 로그인 위젯) */}
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "20px", padding: "0 20px", boxSizing: "border-box" }}>
        
        {/* [좌측 영역] 상단 검색 바 + 중단 전체 대여 가능 물품 리스트 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
          
          {/* 1. 상단 검색 영역 */}
          <div style={{ backgroundColor: "#fff", padding: "20px 24px", borderRadius: "8px", border: "1px solid #e1e2e3" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: "0 0 4px 0" }}>캠퍼스 물품 대여</h2>
            <p style={{ fontSize: "13px", color: "#666", margin: "0 0 14px 0" }}>현재 대여 가능한 공개 물품을 검색하고 대여해 보세요.</p>
            
            <input
              type="text"
              placeholder="찾고 싶은 물품명을 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "12px 14px", border: "1px solid #d0d5dd", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
            />
          </div>

          {/* 검색 결과 영역 (검색어 입력 시에만 노출) */}
          {searchTerm.trim() !== "" && (
            <div style={{ backgroundColor: "#fff", padding: "20px 24px", borderRadius: "8px", border: "1px solid #e1e2e3" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 12px 0", color: "#333" }}>
                검색 결과 ({searchResults.length}건)
              </h3>
              {searchResults.length === 0 ? (
                <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>검색 결과가 없습니다.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {searchResults.map(item => (
                    <div key={item.id} style={{ padding: "12px 14px", background: "#f8f9fa", border: "1px solid #e5e8eb", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong style={{ fontSize: "14px", color: "#333" }}>{item.title}</strong>
                        <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>{Number(item.pricePerDay).toLocaleString()}원/일 · 카테고리: {item.category}</div>
                      </div>
                      {item.owner !== currentUser && (
                        <button 
                          onClick={() => handleRequestRental(item.id)}
                          style={{ padding: "6px 12px", backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                        >
                          대여신청
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. 중단: 전체 대여 가능 물품 리스트 */}
          <div style={{ backgroundColor: "#fff", padding: "20px 24px", borderRadius: "8px", border: "1px solid #e1e2e3" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "bold", margin: "0 0 14px 0", color: "#333" }}>전체 대여 가능 물품 리스트</h3>
            
            {availableItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 0", color: "#888", fontSize: "13px" }}>
                현재 대여 가능한 물품이 없습니다.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {availableItems.map(item => (
                  <div key={item.id} style={{ padding: "16px", border: "1px solid #e5e8eb", borderRadius: "6px", display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "#fff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: "#666", backgroundColor: "#f1f3f5", padding: "2px 6px", borderRadius: "4px" }}>
                        {item.category}
                      </span>
                      <span style={{ fontSize: "11px", color: "#00c73c", fontWeight: "bold" }}>대여 가능</span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: "15px", fontWeight: "bold", margin: "0 0 4px 0", color: "#333" }}>{item.title}</h4>
                      <p style={{ fontSize: "13px", color: "#666", margin: "0 0 6px 0" }}>{item.description}</p>
                      <div style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>
                        {Number(item.pricePerDay).toLocaleString()}원 <span style={{ fontSize: "12px", fontWeight: "normal", color: "#888" }}>/ 1일</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f3f5", paddingTop: "8px", marginTop: "2px" }}>
                      <span style={{ fontSize: "12px", color: "#888" }}>등록자: {item.owner}</span>
                      {item.owner !== currentUser ? (
                        <button
                          onClick={() => handleRequestRental(item.id)}
                          style={{ padding: "6px 12px", backgroundColor: "#333", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                        >
                          대여 신청
                        </button>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#888" }}>내 물품</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* [우측 영역] 로그인 / 내 정보 위젯 (고정 폭 340px) */}
        <div style={{ width: "340px", display: "flex", flexDirection: "column", gap: "16px", flexShrink: 0 }}>
          
          {!isLoggedIn ? (
            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #e1e2e3", textAlign: "center" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#333", margin: "0 0 6px 0" }}>Everrent 로그인</h3>
              <p style={{ fontSize: "13px", color: "#666", margin: "0 0 16px 0" }}>서비스 이용을 위해 로그인해 주세요.</p>
              <button
                onClick={() => navigate("/login")}
                style={{ width: "100%", padding: "12px", backgroundColor: "#00c73c", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", fontSize: "14px", cursor: "pointer", marginBottom: "12px" }}
              >
                로그인
              </button>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", fontSize: "13px" }}>
                <Link to="/signup" style={{ color: "#666", textDecoration: "none" }}>회원가입</Link>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #e1e2e3" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", borderBottom: "1px solid #f1f3f5", paddingBottom: "14px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#e5e8eb", color: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "15px" }}>
                  {currentUser ? currentUser.substring(0, 1).toUpperCase() : "U"}
                </div>
                <div>
                  <strong style={{ fontSize: "15px", color: "#333" }}>{currentUser}</strong>님
                </div>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  onClick={() => navigate("/mypage")}
                  style={{ width: "100%", padding: "10px", backgroundColor: "#f8f9fa", color: "#333", border: "1px solid #d0d5dd", borderRadius: "4px", fontSize: "13px", cursor: "pointer", textAlign: "left" }}
                >
                  마이페이지
                </button>
                <button
                  onClick={() => navigate("/register")}
                  style={{ width: "100%", padding: "10px", backgroundColor: "#f8f9fa", color: "#333", border: "1px solid #d0d5dd", borderRadius: "4px", fontSize: "13px", cursor: "pointer", textAlign: "left" }}
                >
                  물품 등록
                </button>
                <button
                  onClick={handleLogout}
                  style={{ width: "100%", padding: "10px", backgroundColor: "#fff", color: "#d9534f", border: "1px solid #d0d5dd", borderRadius: "4px", fontSize: "13px", cursor: "pointer", marginTop: "6px" }}
                >
                  로그아웃
                </button>
              </div>
            </div>
          )}

          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", border: "1px solid #e1e2e3", fontSize: "13px", color: "#666", lineHeight: "1.5" }}>
            <strong style={{ color: "#333", display: "block", marginBottom: "6px" }}>안내</strong>
            - 대여 가능한 물품만 표시됩니다.<br />
            - 예약 및 대여 중인 항목은 검색 결과에 나타나지 않습니다.<br />
          </div>

        </div>

      </div>
    </div>
  );
}

Home.displayName = "Home";

export default Home;