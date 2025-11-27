export interface VDOMElement {
  type: string | Function; // 함수형 컴포넌트 지원
  props: {
    children: VDOMElement[];
    [key: string]: any; // 다른 props 들도 들어올 수 있음 (id, className 등)
  };
}

export interface Hook {
  state: any;
  queue: any[];
}
