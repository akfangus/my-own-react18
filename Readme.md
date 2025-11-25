### Build my own React (18)

# 환경 셋팅

1. 프로젝트 초기화 : package.json 만들기
2. 도구 설치 TypeScript 와 Vite 설치
3. 기초공사 index.html, main.ts 파일 생성

## Chapter 1. Virtual DOM

- React를 쓸 때 우리는 HTML이랑 비슷하게생긴 JSX(TSX)를 쓴다.

  ```tsx
  const element = <h1>Hello, world!</h1>;
  ```

  이 코드는 사실 브라우저는 이해할 수 없는 코드이다. 그래서 브라우저가 이해할 수 있는 JS로 바꿔줘야 하는데, 그 역할을 하는게 바로 바벨(Babel)이나 Vite(esbuild) 같은 도구들이다.

우리는 Vite를 사용할 것이다.

이 도구들은 JSX를 React.createElement 라는 함수 호출로 바꿔줘

```tsx
const element = React.createElement("h1", null, "Hello, world!");
```

이렇게 변환된 코드로 객체를 반환하는 Virtual DOM이라고 한다.

- createElement 함수를 구현해보자

```tsx
function createElement(tag: string, props: any, ...children: any[]) {
  // Question : 여기에 무엇을 채워야 할까?
  return {
    tag,
    props,
    children,
  };
}
```

- 여기서 children은 배열로 받게 되는데 이때 배열 안에 객체와 문자열이 섞여있을 수 있다.

```tsx
// 예: <div>Hello <span>World</span></div>
children: ["Hello", { tag: "span", ... }];
```

나중에 이 가상 DOM을 실제 브라우저에 그릴때 문자열, 객체에 관한 분기처리를 각각 하지않기위해 문자열이나, 숫자 같은 기본 원시값들의 경우 별도의 객체(Text Element)로 감싸 모든 자식을 객체형태로 통일하는 과정이 필요하다.
보통 리액트는 이걸 TEXT_ELEMENT 같은 특별한 타입으로 관리를 한다.

```tsx
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
```

## Chapter 2. Rendering to the screen

- 자 위의 방법대로 구현한 순간 vite를 통해 실행시키면 element가 잘 만들어진걸 콘솔로 확인할 수 있다.
- 이제 이 Virtual DOM을 실제 브라우저에 그려야 한다.

- React 18 스타일로 createRoot와 render 함수를 구현한다.

**핵심 로직(재귀)**

- render 함수의 순서

1. 요소 생성 : Virtual DOM의 type을 보고 실제 DOM 태그를 만든다.
2. 속성 추가 : props에 있는 id, style 과 같은 값을 실제 DOM에 주입
3. 자식 렌더링 : children배열을 돌면서 재귀(render)로 다만든다.
4. 부착 : 다 만든 자식들을 부모에 붙인다 (appendChild)

- task
  react-dom.ts를 만들어 render와 createRoot 함수를 구현한다.

## Chapter 3. 함수형 컴포넌트 (Function Components)

- 함수는 실행해야 결과가 나온다!

함수형 컴포넌트는 말 그대로 함수야. 이 함수를 실행(호출) 해야만 그 안에 있는 진짜 태그(div 등)를 뱉어내지.

그래서 render 함수가 type을 확인했을 때:

- type이 문자열이면? 👉 기존처럼 DOM 생성 (document.createElement)
- type이 함수면? 👉 그 함수를 실행해서 나온 결과물을 가지고 다시 render!
