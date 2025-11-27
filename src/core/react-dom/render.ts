import { VDOMElement } from "@/react/types";
import { reconcile } from "./reconcile";

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
  return {
    render(element: VDOMElement) {
      // 현재: 기존 render 호출

      // [TODO - 다음 단계] reconcile로 변경 예정:
      const oldDom = container.firstChild;
      reconcile(container, oldDom, element);
    },
  };
}
