import useFetch from "./hooks/useFetch";
import UserList from "./components/UserList";

function App() {
  // 복잡한 fetch와 useEffect 로직이 커스텀 훅 한 줄로 깔끔하게 정리됩니다!
  const { data: users, loading, error } = useFetch("https://jsonplaceholder.typicode.com/users");

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "600px" }}>
      <h1>🌿 10일차 리액트 실습: Custom Hook (useFetch)</h1>
      <p>데이터 패칭 로직을 useFetch 커스텀 훅으로 완전 분리했습니다.</p>

      {loading && <p style={{ color: "#666" }}>⏳ 데이터를 불러오는 중입니다...</p>}
      {error && <p style={{ color: "red" }}>⚠️ 에러 발생: {error}</p>}
      {users && <UserList users={users} />}
    </div>
  );
}

export default App;