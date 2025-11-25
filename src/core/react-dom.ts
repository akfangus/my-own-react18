import { VDOMElement } from "./react";

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
    },
  };
}

export const ReactDOM = {
  createRoot,
};
