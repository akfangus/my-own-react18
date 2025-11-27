import { VDOMElement } from "../react";
import { ExtendNode } from "./types";
import { createDOM } from "./createDOM";
import { updateProps } from "./updateProps";

/**
 * 자식들을 재귀적으로 reconcile
 *
 * @param dom - 부모 DOM 요소
 * @param oldChildren - 이전 자식 Virtual DOM 배열
 * @param newChildren - 새로운 자식 Virtual DOM 배열
 */
function reconcileChildren(
  dom: HTMLElement,
  oldChildren: VDOMElement[],
  newChildren: VDOMElement[]
) {
  // 더 긴 배열의 길이만큼 순회
  // - oldChildren이 더 길면: 남은 자식들 삭제
  // - newChildren이 더 길면: 새로운 자식들 추가
  const maxLength = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < maxLength; i++) {
    const newChild = newChildren[i];

    // 해당 인덱스의 실제 DOM 자식 노드 가져오기
    const oldChildDom = dom.childNodes[i];

    // reconcile 재귀 호출!
    // - newChild가 undefined면 null로 변환
    reconcile(dom, oldChildDom || null, newChild || null);
  }
}

/**
 * Virtual DOM 비교 및 실제 DOM 업데이트
 *
 * @param parentDom - 부모 DOM 노드 (여기에 자식을 추가/삭제/교체)
 * @param oldDom - 이전에 렌더링된 실제 DOM (null이면 처음 렌더링)
 * @param newVDom - 새로운 Virtual DOM
 *
 * 작동방식:
 * 1. oldDOM에서 이전 Virtual DOM 정보를 가져옴
 * 2. old 와 new 를 비교
 * 3. 변경사항에 따른 업데이트 (4가지 케이스)
 */
export function reconcile(
  parentDom: HTMLElement,
  oldDom: ChildNode | null,
  newVDom: VDOMElement | null
) {
  // Step 1: oldDOM에서 이전 Virtual DOM 정보 가져오기
  const oldVDom = (oldDom as ExtendNode)?._vdom;

  // 케이스 1: 새로운 게 없다 → 삭제
  if (!newVDom && oldDom) {
    parentDom.removeChild(oldDom);
    return;
  }

  // 케이스 2: 이전 게 없다 → 추가
  if (!oldVDom) {
    const newDom = createDOM(newVDom!);
    parentDom.appendChild(newDom);
    return;
  }

  // 케이스 3: 타입이 다르다 → 교체
  if (oldVDom.type !== newVDom!.type) {
    const newDom = createDOM(newVDom!);
    parentDom.replaceChild(newDom, oldDom!);
    return;
  }

  // 케이스 4: 타입이 같다 → 업데이트 (기존 DOM 재사용!)
  // Step 1: 저장된 VDOM 정보를 새로운 것으로 업데이트
  (oldDom as ExtendNode)._vdom = newVDom!;

  // Step 2: 속성 업데이트
  updateProps(oldDom as HTMLElement, oldVDom.props, newVDom!.props);

  // Step 3: 자식들 재귀적으로 reconcile
  reconcileChildren(
    oldDom as HTMLElement,
    oldVDom.props.children,
    newVDom!.props.children
  );
}
