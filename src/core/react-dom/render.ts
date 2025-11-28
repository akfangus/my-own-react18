import { VDOMElement } from "@/react/types";
import { reconcile } from "./reconcile";
// render를 훅과 연결
/**
 * 훅과 연결
 * resetHookIndex : 인덱스 초기화, 렌더링 시작 -> hookIndex초기화, useState들이 순서대로 hook[0], hook[1] 순으로 저장되도록 함.
 * setRerender : 재렌더링 설정, createRoot 생성시 -> 정보를 useState에 전달., setState 호출시 -> 재렌더링 트리거
 */
import { resetHookIndex, setRerender } from "@/react/hooks/store";

/**
 * Virtual DOM을 실제 DOM으로 렌더링
 *
 * @param element - Virtual DOM 요소
 * @param container - 렌더링할 컨테이너
 */
// function render(element: VDOMElement, container: HTMLElement) {
//   // createDOM으로 전체 DOM 트리 생성
//   const dom = createDOM(element);

//   // 생성된 DOM을 container에 추가
//   container.appendChild(dom);
// }

/**
 * React 18 스타일의 루트 생성
 *
 * @param container - 루트 컨테이너
 * @returns render 메서드를 가진 루트 객체
 */
export function createRoot(container: HTMLElement) {
  // element를 저장할 변수
  let currentElement: VDOMElement | null = null;

  const root: any = {
    element: currentElement, // root 객체에도 저장
    render(element: VDOMElement) {
      // 1. 렌더링 시작 전 hookIndex 초기화 ⭐
      resetHookIndex();

      // 2. element 저장 (setState에서 사용) ⭐
      currentElement = element;
      root.element = element;

      // 3. reconcile 호출
      const oldDom = container.firstChild;
      reconcile(container, oldDom, element);
    },
  };

  // 4. useState에게 root 정보 전달 ⭐
  setRerender(root, container);

  return root;
}
