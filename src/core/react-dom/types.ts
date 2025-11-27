import { VDOMElement } from "../react";

/**
 * DOM 노드에 Virtual DOM 정보를 저장하기 위한 타입 확장
 * - 실제 DOM 노드에 _vdom 속성을 추가해서 "이 DOM이 어떤 VDOM에서 만들어졌는지" 추적
 */
export interface ExtendNode extends Node {
  _vdom?: VDOMElement;
}
