// ISO 타임스탬프 문자열을 보기 쉬운 날짜/시간 형태로 변환하는 함수
export const formatDate = (isoString) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  
  if (isNaN(date.getTime())) return isoString; // 유효하지 않은 날짜인 경우 원본 반환

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 날짜(년-월-일)만 필요할 때 사용하는 함수
export const formatDateOnly = (isoString) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  
  if (isNaN(date.getTime())) return isoString;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};