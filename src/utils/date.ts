/**
 * WebKit(Safari/iOS Chrome) 등 특정 브라우저 환경에서 발생할 수 있는 
 * 'Invalid Date' 에러를 방지하기 위해 날짜 문자열을 안전하게 파싱합니다.
 * 
 * Safari는 'YYYY-MM-DD HH:mm:ss' 형태를 제대로 파싱하지 못하므로,
 * '-' 기호를 '/' 기호로 바꾸거나, ' ' 공백을 'T'로 바꾸는 등
 * 호환성 처리를 한 후 Date 객체를 생성합니다.
 */
export function parseSafeDate(dateString: string | Date | null | undefined): Date | null {
  if (!dateString) return null;

  // 이미 Date 객체인 경우 그대로 반환
  if (dateString instanceof Date) {
    if (isNaN(dateString.getTime())) return null;
    return dateString;
  }

  // 1차 파싱 시도 (기본 내장 스펙)
  let date = new Date(dateString);

  // 파싱에 실패한 경우 (Invalid Date), WebKit 호환성 처리
  if (isNaN(date.getTime())) {
    // 1. '-' 를 '/' 로 변경 (예: 2024-01-01 -> 2024/01/01)
    // 2. 시간과 분리된 공백을 'T' 로 변경하지 않고, '/' 로만 통일해도 사파리에서 잘 인식함
    // '2024-05-18 14:00:00' -> '2024/05/18 14:00:00'
    const safeFormat = dateString.replace(/-/g, '/');
    date = new Date(safeFormat);

    // 여전히 실패한다면 T를 강제 삽입하여 ISO 8601 스펙에 가깝게 변형
    if (isNaN(date.getTime())) {
       const isoFallback = dateString.replace(' ', 'T');
       date = new Date(isoFallback);
    }
  }

  // 최종적으로 유효한 Date인지 확인 후 반환
  if (isNaN(date.getTime())) {
    console.error(`Failed to parse date string safely: ${dateString}`);
    return null;
  }

  return date;
}
