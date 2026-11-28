/* 물품 카드 상단에 들어가는 카테고리별 썸네일 (이미지가 없는 지금 구조용) */

const ICONS = {
  전자기기: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </>
  ),
  "서적/교재": (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
  ),
  "캠핑/레저": (
    <>
      <path d="M3.5 21 14 3" />
      <path d="M20.5 21 10 3" />
      <path d="M15.5 21 12 15l-3.5 6" />
      <path d="M2 21h20" />
    </>
  ),
  생활용품: (
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </>
  ),
  기타: (
    <>
      <path d="M21 8l-9-5-9 5v8l9 5 9-5z" />
      <path d="M3.3 7 12 12l8.7-5" />
      <path d="M12 22V12" />
    </>
  ),
};

function CategoryThumb({ category, height = 88 }) {
  const icon = ICONS[category] || ICONS["기타"];

  return (
    <div
      aria-hidden="true"
      style={{
        height: `${height}px`,
        borderRadius: "8px",
        background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
        border: "1px solid #99f6e4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0f766e"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon}
      </svg>
    </div>
  );
}

CategoryThumb.displayName = "CategoryThumb";

export default CategoryThumb;