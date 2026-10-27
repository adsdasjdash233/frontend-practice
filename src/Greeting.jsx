// 자식 컴포넌트: 부모로부터 props를 전달받아 화면에 출력
function Greeting(props) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0", borderRadius: "8px" }}>
      <h3>👋 {props.name}님, 환영합니다!</h3>
      <p>역할: {props.role}</p>
    </div>
  );
}

export default Greeting;