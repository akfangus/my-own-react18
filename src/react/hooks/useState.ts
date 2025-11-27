import {
  hooks, // 상태를 저장할 배열
  currentHookIndex, // 현재 Hook 위치
  currentRoot, // 재렌더링 트리거용
  resetHookIndex, // 인덱스 초기화 함수
  incrementHookIndex, // 인덱스 증가 함수.
} from "./store";

/**
 *
 * 함수 시그니처 useState<T>(initialValue: T): [T, (newValue: T) => void]
 * 제네릭 <T>: 어떤 타입이든 받을 수 있음
 * @param initialValue 초기값
 * @returns [상태, 세터함수] 튜플
 */
export function useState<T>(initialValue: T): [T, (newValue: T) => void] {
  // store 에서 가져온것들 활용

  // step1 : 현재 hook 인덱스를 로컬 변수로 저장

  const hookIndex = currentHookIndex;

  // 임시 반환
  return [initialValue, () => {}];
}
