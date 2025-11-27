import { VDOMElement } from "../react";
import { ExtendNode } from "./types";
import { createDOM } from "./createDOM";

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
 * 3. 변경사항에 따른 업데이트
 */
export function reconcile(
  parentDom: HTMLElement,
  oldDom: ChildNode | null,
  newVDom: VDOMElement | null
) {
  // Step 1: oldDOM에서 이전 Virtual DOM 정보 가져오기
  const oldVDom = (oldDom as ExtendNode)?._vdom;

  // TODO: 4가지 케이스 구현 예정
  // - 케이스 1: newVDom이 없으면 → 삭제
  // - 케이스 2: oldVDom이 없으면 → 추가
  // - 케이스 3: type이 다르면 → 교체
  // - 케이스 4: type이 같으면 → 업데이트

  // 임시 구현: 일단 지금은 새로 만들어서 교체
  if (newVDom) {
    const newDom = createDOM(newVDom);
    if (oldDom) {
      parentDom.replaceChild(newDom, oldDom);
    } else {
      parentDom.appendChild(newDom);
    }
  }
}

