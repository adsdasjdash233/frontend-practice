import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils'; // 날짜 유틸 임포트

const CATEGORIES = ['전체', '전자기기', '서적/교재', '캠핑/레저', '생활용품', '기타'];

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const currentUser = localStorage.getItem("currentUser");

  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 물품 상세 보기 모달을 위한 상태 관리
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("items")) || [];
    setItems(savedItems);
  }, []);

  const availableItems = items.filter(item => item.status === 'AVAILABLE');

  // 카테고리 및 검색어 필터링 적용
  const displayedItems = availableItems.filter(item => {
    const matchesCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const keyword = searchTerm.trim().toLowerCase();
    const matchesSearch =
      keyword === '' ||
      item.title.toLowerCase().includes(keyword) ||
      (item.description && item.description.toLowerCase().includes(keyword));

    return matchesCategory && matchesSearch;
  });

  // 물품 카드 클릭 시 조회수(viewCount) 증가 및 상세 모달 오픈
  const handleSelectItem = (item) => {
    const updatedItems = items.map(i => {
      if (i.id === item.id) {
        return {
          ...i,
          viewCount: (i.viewCount || 0) + 1
        };
      }
      return i;
    });

    setItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));

    // 선택된 물품 정보 갱신하여 모달 오픈
    const clickedItem = updatedItems.find(i => i.id === item.id);
    setSelectedItem(clickedItem);
  };

  const handleRequestRental = (itemId) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        if (item.owner === currentUser) {
          alert("본인이 등록한 물품은 본인이 대여할 수 없습니다.");
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
    setSelectedItem(null); // 모달 닫기
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
      
      {/* 전체 와이드 레이아웃 */}
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "20px", padding: "0 20px", boxSizing: "border-box" }}>
        
        {/* [좌측 영역] 검색 바 + 카테고리 필터 + 통합 물품 리스트 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
          
          {/* 1. 상단 검색 및 카테고리 필터 영역 */}
          <div style={{ backgroundColor: "#fff", padding: "20px 24px", borderRadius: "8px", border: "1px solid #e1e2e3" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#333", margin: "0 0 4px 0" }}>캠퍼스 물품 대여</h2>
            <p style={{ fontSize: "13px", color: "#666", margin: "0 0 14px 0" }}>현재 대여 가능한 공개 물품을 검색하고 대여해 보세요.</p>
            
            <input
              type="text"
              placeholder="찾고 싶은 물품명을 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "12px 14px", border: "1px solid #d0d5dd", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box", outline: "none", marginBottom: "14px" }}
            />

            {/* 카테고리 필터 버튼 영역 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {CATEGORIES.map(category => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      border: isActive ? "1px solid #00c73c" : "1px solid #d0d5dd",
                      backgroundColor: isActive ? "#00c73c" : "#fff",
                      color: isActive ? "#fff" : "#444",
                      fontSize: "12px",
                      fontWeight: isActive ? "bold" : "normal",
                      cursor: "pointer"
                    }}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 대여 가능 물품 리스트 (검색어/카테고리 입력 시 결과 카운트 표시) */}
          <div style={{ backgroundColor: "#fff", padding: "20px 24px", borderRadius: "8px", border: "1px solid #e1e2e3" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "bold", margin: 0, color: "#333" }}>
                {selectedCategory === '전체' && searchTerm.trim() === ""
                  ? `전체 대여 가능 물품 리스트 (${displayedItems.length}건)`
                  : `${selectedCategory} 필터 결과 (${displayedItems.length}건)`}
              </h3>
            </div>
            
            {displayedItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 0", color: "#888", fontSize: "13px" }}>
                {selectedCategory !== '전체' || searchTerm.trim() !== ""
                  ? "일치하는 검색 결과가 없습니다."
                  : "현재 대여 가능한 물품이 없습니다."}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {displayedItems.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => handleSelectItem(item)} // 카드 클릭 시 조회수 증가 및 상세 모달 오픈
                    style={{ padding: "16px", border: "1px solid #e5e8eb", borderRadius: "6px", display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "#fff", cursor: "pointer", transition: "border-color 0.2s" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: "#666", backgroundColor: "#f1f3f5", padding: "2px 6px", borderRadius: "4px" }}>
                        {item.category}
                      </span>
                      <span style={{ fontSize: "11px", color: "#00c73c", fontWeight: "bold" }}>대여 가능</span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: "15px", fontWeight: "bold", margin: "0 0 4px 0", color: "#333" }}>{item.title}</h4>
                      <p style={{ fontSize: "13px", color: "#666", margin: "0 0 6px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.description}</p>
                      
                      {/* ERD 기준 등록일시 및 조회수 표기 */}
                      <div style={{ fontSize: "11px", color: "#888", display: "flex", gap: "10px", marginBottom: "6px" }}>
                        <span>등록: {formatDate(item.createdAt)}</span>
                        <span>·</span>
                        <span>조회수 {item.viewCount || 0}</span>
                      </div>

                      <div style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>
                        {Number(item.pricePerDay).toLocaleString()}원 <span style={{ fontSize: "12px", fontWeight: "normal", color: "#888" }}>/ 1일</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f3f5", paddingTop: "8px", marginTop: "2px" }}>
                      <span style={{ fontSize: "12px", color: "#888" }}>등록자: {item.owner}</span>
                      {item.owner !== currentUser ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // 카드 클릭 이벤트 버블링 방지
                            handleRequestRental(item.id);
                          }}
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

        {/* [우측 영역] 로그인 / 내 정보 위젯 */}
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
- 카테고리와 검색어로 원하는 물품을 좁혀볼 수 있습니다.<br />
- 물품 카드를 클릭하면 상세 내용과 조회수가 증가합니다.<br />
          </div>

        </div>

      </div>

      {/* 물품 상세 보기 모달 (조회수 연동) */}
      {selectedItem && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#fff", width: "100%", maxWidth: "500px", padding: "24px", borderRadius: "8px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#666", backgroundColor: "#f1f3f5", padding: "3px 8px", borderRadius: "4px" }}>
                {selectedItem.category}
              </span>
              <button 
                onClick={() => setSelectedItem(null)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#888" }}
              >
                ✕
              </button>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#333", margin: "0 0 8px 0" }}>{selectedItem.title}</h3>
              <div style={{ fontSize: "12px", color: "#888", display: "flex", gap: "10px", marginBottom: "14px" }}>
                <span>등록자: {selectedItem.owner}</span>
                <span>·</span>
                <span>등록일: {formatDate(selectedItem.createdAt)}</span>
                <span>·</span>
                <span>조회수: {selectedItem.viewCount}</span>
              </div>
              <p style={{ fontSize: "14px", color: "#444", lineHeight: "1.6", whiteSpace: "pre-wrap", backgroundColor: "#f8f9fa", padding: "14px", borderRadius: "6px", minHeight: "80px", margin: "0 0 14px 0" }}>
                {selectedItem.description || "등록된 상세 설명이 없습니다."}
              </p>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#00c73c" }}>
                {Number(selectedItem.pricePerDay).toLocaleString()}원 <span style={{ fontSize: "13px", fontWeight: "normal", color: "#666" }}>/ 1일</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              {selectedItem.owner !== currentUser ? (
                <button
                  onClick={() => handleRequestRental(selectedItem.id)}
                  style={{ flex: 1, padding: "12px", backgroundColor: "#00c73c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}
                >
                  대여 신청하기
                </button>
              ) : (
                <div style={{ flex: 1, textAlign: "center", padding: "12px", backgroundColor: "#f1f3f5", color: "#666", borderRadius: "4px", fontSize: "14px" }}>
                  내가 등록한 물품입니다.
                </div>
              )}
              <button
                onClick={() => setSelectedItem(null)}
                style={{ padding: "12px 16px", backgroundColor: "#f1f3f5", color: "#333", border: "1px solid #d0d5dd", borderRadius: "4px", cursor: "pointer", fontSize: "14px" }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

Home.displayName = "Home";

export default Home;