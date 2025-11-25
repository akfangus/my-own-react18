export interface VDOMElement {
  type: string;
  props: {
    children: VDOMElement[];
    [key: string]: any; // 다른 props 들도 들어올 수 있음 (id, className 등)
  };
}

// children에 텍스트가 들어갔을때 TEXT_ELEMENT로 변환
function createTextElement(text: string): VDOMElement {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(
  type: string,
  props: any,
  ...children: any[]
): VDOMElement {
  // Question : 여기에 무엇을 채워야 할까? => children이 일반 text 일때 TEXT_ELEMENT로 변환된 객체가 될 수 있도록
  return {
    type,
    props: {
      ...props,
      //자식들 중 객체가 아닌 것은 텍스트 엘리먼트로 변환
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

export const React = {
  createElement,
};
