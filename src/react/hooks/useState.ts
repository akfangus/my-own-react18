import {
  hooks, // 상태를 저장할 배열
  currentHookIndex, // 현재 Hook 위치
  currentRoot, // 재렌더링 트리거용
  currentRootContainer, // 루트 컨테이너
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
  // step2 : 첫 렌더링인지 확인
  if (hooks[hookIndex] === undefined) {
    // 첫렌더링이면? => 훅생성
    hooks[hookIndex] = {
      state: initialValue,
    };
  }

  // step3 : setState 함수 생성
  /**
   *
   * 사용자: setCount(1) 호출
   * ↓
   * hooks[0].state = 1 (업데이트)
   * ↓
   * resetHookIndex() (인덱스 0으로)
   * ↓
   * root.render() (재렌더링 시작)
   * ↓
   * Component 함수 다시 실행
   * ↓
   * useState(0) 호출 → hooks[0]에서 state = 1 가져옴
   * ↓
   * 화면에 1 표시!
   */
  const setState = (newValue: T) => {
    // 3-1. state 업데이트
    hooks[hookIndex].state = newValue;

    // 3-2. 재렌더링 트리거
    if (currentRoot && currentRootContainer) {
      resetHookIndex(); // 인덱스 초기화
      currentRoot.render(currentRoot.element); // 재렌더링
    }
  };

  // step4 : 현재 state 가져오기
  const state = hooks[hookIndex].state;

  // step5 : 인덱스 증가
  incrementHookIndex();

  // step6 : 상태와 세터함수 반환
  return [state, setState];
}
