import { useState, useEffect } from "react";

function App() {
  const [users, setUsers] = useState([]); // 사용자 목록 데이터를 담을 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 컴포넌트가 처음 화면에 나타날 때(Mount) 외부 API 호출
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data); // 받아온 데이터를 상태에 저장
        setLoading(false); // 로딩 완료
      })
      .catch((error) => {
        console.error("데이터를 불러오는 중 에러가 발생했습니다:", error);
        setLoading(false);
      });
  }, []); // 빈 배열([])을 넣으면 컴포넌트가 처음 렌더링될 때 딱 한 번만 실행됩니다.

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "600px" }}>
      <h1>🌿 8일차 리액트 실습: 외부 API 데이터 불러오기</h1>
      <p>JSONPlaceholder 가상 사용자 API를 연동한 예제입니다.</p>

      {/* 로딩 중일 때 보여줄 화면 */}
      {loading && <p style={{ color: "#666" }}>⏳ 데이터를 불러오는 중입니다...</p>}

      {/* 데이터 목록 출력 */}
      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        {users.map((user) => (
          <li
            key={user.id}
            style={{
              padding: "12px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <strong>{user.name}</strong> ({user.username})<br />
            <span style={{ fontSize: "14px", color: "#555" }}>📧 이메일: {user.email}</span><br />
            <span style={{ fontSize: "14px", color: "#555" }}>🌐 웹사이트: {user.website}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;