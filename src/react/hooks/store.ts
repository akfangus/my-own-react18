// src/react/hooks/store.ts

/**
 * 모든 Hook이 공유하는 전역 상태
 */
export let hooks: any[] = [];
export let currentHookIndex = 0;

export let currentRoot: any = null;
export let currentRootContainer: HTMLElement | null = null;

/**
 * 재렌더링 설정
 */
export function setRerender(root: any, container: HTMLElement) {
  currentRoot = root;
  currentRootContainer = container;
}

/**
 * Hook 인덱스 초기화
 */
export function resetHookIndex() {
  currentHookIndex = 0;
}

/**
 * Hook 인덱스 증가
 */
export function incrementHookIndex() {
  currentHookIndex++;
}
