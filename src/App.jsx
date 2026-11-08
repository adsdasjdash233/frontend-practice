import { useState, useEffect } from "react";
import UserList from "./components/UserList";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("데이터를 불러오는 중 에러가 발생했습니다:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "600px" }}>
      <h1>🌿 9일차 리액트 실습: 컴포넌트 분리 및 리팩토링</h1>
      <p>App.jsx의 역할을 단순화하고 목록/카드를 별도 컴포넌트로 분리했습니다.</p>

      {loading ? (
        <p style={{ color: "#666" }}>⏳ 데이터를 불러오는 중입니다...</p>
      ) : (
        <UserList users={users} />
      )}
    </div>
  );
}

export default App;