// 개별 사용자 정보를 보여주는 하위 컴포넌트
function UserCard({ user }) {
  return (
    <li
      style={{
        padding: "12px",
        marginBottom: "10px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <strong>{user.name}</strong> ({user.username})<br />
      <span style={{ fontSize: "14px", color: "#555" }}> 이메일: {user.email}</span><br />
      <span style={{ fontSize: "14px", color: "#555" }}> 웹사이트: {user.website}</span>
    </li>
  );
}

export default UserCard;