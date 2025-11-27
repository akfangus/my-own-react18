import { VDOMElement } from "@/react/types";
import { ExtendNode } from "./types";

/**
 * Virtual DOM을 실제 DOM으로 생성
 *
 * @param vdom - Virtual DOM 요소
 * @returns 생성된 실제 DOM 노드
 */
export function createDOM(vdom: VDOMElement): Node {
  // Step 0: 함수형 컴포넌트 처리
  // - type이 함수면 실행해서 나온 결과(VDOM)로 다시 createDOM 호출
  if (typeof vdom.type === "function") {
    const component = vdom.type as any;
    const childElement = component(vdom.props);
    return createDOM(childElement); // 재귀!
  }

  // Step 1: 실제 DOM 노드 생성
  // - TEXT_ELEMENT면 텍스트 노드
  // - 그 외에는 일반 HTML 요소
  const dom =
    vdom.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(vdom.type);

  // Step 2: 생성된 DOM에 Virtual DOM 정보 저장 ⭐
  // - 나중에 reconcile에서 "이전 VDOM"으로 사용됨
  (dom as ExtendNode)._vdom = vdom;

  // Step 3: 속성(props) 추가
  // - children을 제외한 모든 props를 DOM에 설정
  const isProperty = (key: string) => key !== "children";

  Object.keys(vdom.props)
    .filter(isProperty)
    .forEach((name) => {
      (dom as any)[name] = vdom.props[name];
    });

  // Step 4: 자식들 생성 및 추가
  // - children 배열을 순회하며 재귀적으로 createDOM 호출
  vdom.props.children.forEach((child) => {
    const childDom = createDOM(child);
    dom.appendChild(childDom);
  });

  // Step 5: 완성된 DOM 반환
  return dom;
}
