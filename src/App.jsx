function App() {
  const name = "현서"; // 변수 활용
  const today = new Date().toLocaleDateString();

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🌿 2일차 리액트 실습</h1>
      <p>안녕하세요, {name}님!</p>
      <p>오늘의 날짜: {today}</p>
    </div>
  );
}

export default App;