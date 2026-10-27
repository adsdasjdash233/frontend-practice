import Greeting from "./Greeting"; // 방금 만든 자식 컴포넌트 불러오기

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🌿 3일차 리액트 실습: Props 활용하기</h1>
      
      {/* 같은 Greeting 컴포넌트에 서로 다른 props 전달하여 재사용 */}
      <Greeting name="현서" role="프론트엔드 개발자" />
      <Greeting name="홍길동" role="백엔드 개발자" />
      <Greeting name="김영희" role="UI/UX 디자이너" />
    </div>
  );
}

export default App;