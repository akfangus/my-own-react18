import { VDOMElement } from "./react";

/**
 * [NEW] DOM 노드에 Virtual DOM 정보를 저장하기 위한 타입 확장
 * - 실제 DOM 노드에 _vdom 속성을 추가해서 "이 DOM이 어떤 VDOM에서 만들어졌는지" 추적
 */
interface ExtendNode extends Node {
  _vdom?: VDOMElement;
}

/**
 * [핵심 함수] reconcile - Virtual DOM 비교 및 실제 DOM 업데이트
 *
 * @param parentDom - 부모 DOM 노드 (여기에 자식을 추가/삭제/교체)
 * @param oldDom - 이전에 렌더링된 실제 DOM (null이면 처음 렌더링)
 * @param newVDom - 새로운 Virtual DOM
 *
 * 작동방식
 * 1. oldDOM에서 이전 Virtual DOM 정보를 가져옴
 * 2. old 와 new 를 비교
 * 3. 변경사항에 따른 업데이트
 */
function reconcile(
  parentDom: HTMLElement,
  oldDom: ChildNode | null,
  newVDom: VDOMElement
) {
  // 1. oldDOM에서 이전 정보 가져오기
  const oldVdom = (oldDom as ExtendNode)?._vdom;

  // TODO: 다음 단계(4-2)에서 여기에 비교 로직 추가 예정
  // - 케이스 1: newVDom이 없으면 → 삭제
  // - 케이스 2: oldVDom이 없으면 → 추가
  // - 케이스 3: type이 다르면 → 교체
  // - 케이스 4: type이 같으면 → 업데이트

  // 일단 지금은 기존 render 함수를 그대로 호출 (임시)
  render(newVDom, parentDom);
}

/**
 *
 * @param element Virtual DOM
 * @param container 실제 DOM
 *
 * render 함수의 순서
 * 1. 요소생성
 * 2. 속성 추가
 * 3. 자식 렌더링
 * 4. 부착
 *
 * @returns void
 */
function render(element: VDOMElement, container: HTMLElement) {
  // 0. 함수형 컴포넌트 처리
  // type이 함수라면 그 함수를 실행해서 나온 결과(children)을 가지고 render를 재귀적으로 호출
  if (typeof element.type === "function") {
    const component = element.type as any;
    const childElement = component(element.props);
    render(childElement, container);
    return;
  }

  // 1. 요소 생성
  // element.type이 "TEXT_ELEMENT"면 createTextNode, 아니면 createElement
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  // [NEW] ⭐ Step 2: 생성된 DOM에 Virtual DOM 정보 저장
  (dom as ExtendNode)._vdom = element;

  // 2. 속성 추가
  // element.props를 순회하며 속성을 dom에 추가
  const isProperty = (key: string) => key !== "children";

  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      (dom as any)[name] = element.props[name];
    });

  // 3. 자식 렌더링
  element.props.children.forEach((child) => {
    // 재귀!
    render(child, dom as HTMLElement);
  });

  // 4. 부착
  container.appendChild(dom);
}

function createRoot(container: HTMLElement) {
  return {
    render(element: VDOMElement) {
      render(element, container);

      // [TODO - 4-2단계] reconcile로 변경 예정:
      // const oldDom = container.firstChild;
      // reconcile(container, oldDom, element);
    },
  };
}

export const ReactDOM = {
  createRoot,
};
