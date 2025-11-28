### Build my own React (18)

> React의 핵심 동작 원리를 직접 구현하며 배우는 프로젝트 ✅ 완성!

---

## 🎉 프로젝트 상태

```
✅ Virtual DOM       - createElement, TEXT_ELEMENT
✅ Rendering         - createRoot, createDOM
✅ 함수형 컴포넌트    - Function Components
✅ Reconciliation    - Diffing Algorithm (4 cases)
✅ useState Hook     - 전역 배열 기반 상태 관리
📚 문서화 완료       - docs/ 폴더
🧪 테스트 완료       - UseStateTest 컴포넌트
```

## 🚀 빠른 시작

```bash
npm install
npm run dev
```

브라우저: `http://localhost:5173`

---

## 📚 문서

- [프로젝트 요약](./docs/SUMMARY.md) - 전체 개요
- [Hooks 가이드](./docs/hooks/main.md) - Hooks 설명
- [useState 구현](./docs/hooks/useState.md) - useState 상세
- [Fiber Architecture](./docs/fiber-architecture.md) - Fiber 개념

---

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

```tsx
function render(element: VDOMElement, container: HTMLElement) {
  // [NEW] 0. 함수형 컴포넌트 처리
  // type이 함수라면, 그 함수를 실행해서 나온 결과물(children)을 가지고
  // 다시 render를 호출한다. (재귀)
  if (typeof element.type === "function") {
    const component = element.type as any;
    const childElement = component(element.props);
    render(childElement, container);
    return; // 여기서 끝! 아래 로직(DOM 생성)은 실행하지 않음
  }
  // 1. 요소 생성 (기존 코드)
  const dom = ...
  // ... (나머지는 그대로)
}
```

## Chapter 4. 재조정 (Reconciliation)

- React의 Virtual DOM은 변경시에 전체를 다시 그리지않고 변경된 부분만 찾아서 업데이트를 실행한다.

- Reconciliation의 핵심은 즉 처음 Virtual DOM을 생성하여 기억한뒤에 두번째 render 시에 처음 DOM과 비교하여 변경된 부분만 다시 그리는 형식

📝 React의 실제 접근법
React는 이를 더욱 최적화하기 위해:

1. 같은 레벨끼리만 비교 (트리의 모든 조합을 비교하지 않음)
2. key prop 사용 (리스트 아이템 식별)
3. 컴포넌트 타입으로 판단 (타입이 다르면 하위 트리 전체 교체)

하지만 우리는 간단하게 시작할 거예요!

### 4.1 이전DOM과 현재DOM을 비교할수있도록 인터페이스 생성하고 저장

- react-dom.ts에 이전 DOM을 저장할 수 있는 인터페이스 ExtendNode를 Node를 확장하여 만든다

```tsx
interface ExtendNode extends Node {
  _vdom?: VDOMElement;
}
```

- render함수에 그리기전 이전 VDOM을 저장한다

```tsx
(dom as ExtendNode)._vdom - element;
```

- 이전 DOM과 현재 DOM을 비교하는 함수 reconcile을 구현

```tsx
  function reconcile(parentDOM, oldDom, newVDom) {
    ...
  }
```

### 4.2 이전DOM과 현재DOM을 비교하는 diff알고리즘

reconcile 함수는 4가지 케이스로 나뉜다:

**케이스 1: 새로운 게 없다 → 삭제**

```tsx
if (!newVDom && oldDom) {
  parentDom.removeChild(oldDom);
  return;
}
```

**케이스 2: 이전 게 없다 → 추가**

```tsx
if (!oldVDom) {
  const newDom = createDOM(newVDom!);
  parentDom.appendChild(newDom);
  return;
}
```

**케이스 3: 타입이 다르다 → 교체**

```tsx
if (oldVDom.type !== newVDom!.type) {
  const newDom = createDOM(newVDom!);
  parentDom.replaceChild(newDom, oldDom!);
  return;
}
```

**케이스 4: 타입이 같다 → 업데이트**

```tsx
// 기존 DOM을 재사용! (성능 최적화의 핵심)
(oldDom as ExtendNode)._vdom = newVDom!;

// 속성 업데이트
updateProps(oldDom as HTMLElement, oldVDom.props, newVDom!.props);

// 자식들 재귀적으로 reconcile
reconcileChildren(
  oldDom as HTMLElement,
  oldVDom.props.children,
  newVDom!.props.children
);
```

### 4.3 속성(Props) 업데이트

속성이 변경되었을 때 DOM을 재사용하면서 속성만 업데이트한다.

**updateProps 함수 구현:**

```tsx
function updateProps(dom: HTMLElement | Text, oldProps: any, newProps: any) {
  // Step 1: 이전 props 중 사라진 것들 제거
  Object.keys(oldProps)
    .filter(isProperty)
    .filter(isGone(oldProps, newProps))
    .forEach((name) => {
      (dom as any)[name] = "";
    });

  // Step 2: 새롭거나 변경된 props 설정
  Object.keys(newProps)
    .filter(isProperty)
    .filter(isNew(oldProps, newProps))
    .forEach((name) => {
      (dom as any)[name] = newProps[name];
    });
}
```

**헬퍼 함수들:**

```tsx
const isProperty = (key: string) => key !== "children";
const isGone = (prev: any, next: any) => (key: string) => !(key in next);
const isNew = (prev: any, next: any) => (key: string) =>
  prev[key] !== next[key];
```

### 4.4 자식(Children) 재귀적으로 Reconcile

자식들도 동일한 방식으로 비교하고 업데이트한다.

**reconcileChildren 함수 구현:**

```tsx
function reconcileChildren(
  dom: HTMLElement,
  oldChildren: VDOMElement[],
  newChildren: VDOMElement[]
) {
  // 더 긴 배열의 길이만큼 순회 (추가/삭제 처리)
  const maxLength = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < maxLength; i++) {
    const newChild = newChildren[i];
    const oldChildDom = dom.childNodes[i];

    // reconcile 재귀 호출!
    reconcile(dom, oldChildDom || null, newChild || null);
  }
}
```

### 4.5 파일 구조 분리

코드의 가독성과 유지보수를 위해 파일을 역할별로 분리한다.

```
src/core/react-dom/
├── types.ts          - 타입 정의 (ExtendNode)
├── createDOM.ts      - Virtual DOM → 실제 DOM 생성
├── updateProps.ts    - 속성 업데이트
├── reconcile.ts      - Reconciliation 로직
├── render.ts         - createRoot 공개 API
└── index.ts          - 통합 export
```

### 4.6 createRoot에서 reconcile 사용

마지막으로 render.ts의 createRoot에서 reconcile을 호출하도록 변경한다.

```tsx
export function createRoot(container: HTMLElement) {
  return {
    render(element: VDOMElement) {
      // 기존 DOM 가져오기
      const oldDom = container.firstChild;

      // reconcile 호출
      // - 첫 렌더링: oldDom이 null이므로 새로 생성
      // - 이후 렌더링: 변경된 부분만 업데이트
      reconcile(container, oldDom, element);
    },
  };
}
```

**핵심 포인트:**

- 처음 렌더링: `oldDom`이 null → 케이스 2 (추가)
- 두 번째 이후: 변경된 부분만 업데이트 → 성능 최적화!

### 4.7 Reconciliation 완성 🎉

이제 React의 핵심 기능인 효율적인 DOM 업데이트가 완성되었다!

---

## 🔄 Reconciliation 동작 방식

```
┌─────────────────────────────────────────────────────────────┐
│  1단계: 첫 렌더링                                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  root.render(<App />)                                         │
│         ↓                                                     │
│  Virtual DOM 생성                                             │
│         ↓                                                     │
│  reconcile 호출 (oldDom = null)                              │
│         ↓                                                     │
│  케이스 2: 추가 → createDOM으로 전체 DOM 생성                 │
│         ↓                                                     │
│  실제 DOM에 추가 + _vdom 속성에 Virtual DOM 저장 ⭐          │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  2단계: 상태 변경 후 재렌더링                                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  상태 변경 (예: count++)                                      │
│         ↓                                                     │
│  root.render(<App />)  // 다시 호출!                         │
│         ↓                                                     │
│  새로운 Virtual DOM 생성                                      │
│         ↓                                                     │
│  reconcile 호출 (oldDom = 기존 DOM)                          │
│         ↓                                                     │
│  oldDom._vdom 에서 이전 Virtual DOM 꺼내기 ⭐                │
│         ↓                                                     │
│  ┌─────────────────────────────────────┐                     │
│  │  비교 (Diffing Algorithm)           │                     │
│  ├─────────────────────────────────────┤                     │
│  │  이전 VDOM  vs  새로운 VDOM         │                     │
│  │                                      │                     │
│  │  <div id="app">     <div id="app">  │                     │
│  │    Count: 0    →      Count: 1      │                     │
│  │  </div>             </div>           │                     │
│  └─────────────────────────────────────┘                     │
│         ↓                                                     │
│  케이스 4: 타입 같음 (div = div)                             │
│         ↓                                                     │
│  기존 DOM 재사용! 🎯                                         │
│         ↓                                                     │
│  ├─ updateProps (속성만 변경)                                │
│  └─ reconcileChildren (자식들 재귀 비교)                     │
│              ↓                                                │
│         텍스트 노드만 "Count: 0" → "Count: 1" 업데이트       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 성능 비교

**기존 방식 (Reconciliation 없이):**

```tsx
매번 render 호출 시:
  1. 전체 DOM 삭제
  2. 전체 DOM 새로 생성
  3. 전체 DOM 추가

→ 느리고 비효율적! ❌
→ input focus, 스크롤 위치 등 상태 초기화 ❌
```

**Reconciliation 적용:**

```tsx
매번 render 호출 시:
  1. 이전 Virtual DOM과 비교
  2. 변경된 부분만 찾기
  3. 변경된 부분만 실제 DOM 업데이트

→ 빠르고 효율적! ✅
→ DOM 상태 유지 ✅
→ React의 핵심 성능 최적화! ✅
```

---

## ✨ 최적화 효과

- ✅ **불필요한 DOM 조작 감소** - 변경된 부분만 업데이트
- ✅ **성능 향상** - DOM 조작은 느린 연산, 최소화가 핵심
- ✅ **상태 유지** - input focus, 스크롤 위치, CSS 애니메이션 유지
- ✅ **배터리 절약** - 모바일에서 특히 중요!

---

## Chapter 5. Hooks 🪝

Hooks는 함수형 컴포넌트에서 **상태(state)**와 **생명주기(lifecycle)**를 사용할 수 있게 해주는 기능이다.

### 5.1 Hook의 핵심 문제

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  // 🤔 count는 어디에 저장될까?
  // 🤔 함수가 끝나면 사라지는데 어떻게 유지될까?
}
```

**해결책**: Hook 상태를 **컴포넌트 밖(전역)**에 저장!

### 5.2 Hook 저장 전략

```
┌─────────────────────────────────────────┐
│  전역에 Hook 상태 저장                    │
├─────────────────────────────────────────┤
│                                           │
│  hooks = []        // 모든 hook 저장     │
│  hookIndex = 0     // 현재 hook 위치     │
│                                           │
│  [첫 렌더링]                              │
│  useState(0)  → hooks[0] = { state: 0 } │
│  useState('') → hooks[1] = { state: '' }│
│                                           │
│  [재렌더링]                               │
│  useState(0)  → hooks[0]에서 가져오기    │
│  useState('') → hooks[1]에서 가져오기    │
│                                           │
└─────────────────────────────────────────┘
```

### 5.3 useState 동작 흐름

```
1. 첫 렌더링
   useState(0) 호출
   ↓
   hooks[0] = { state: 0 } 저장
   ↓
   [0, setState] 반환

2. setState(1) 호출
   ↓
   hooks[0].state = 1 업데이트
   ↓
   hookIndex = 0 초기화
   ↓
   컴포넌트 재렌더링 (reconcile 실행)

3. 재렌더링
   useState(0) 호출 (초기값 무시)
   ↓
   hooks[0]에서 { state: 1 } 가져오기
   ↓
   [1, setState] 반환
```

### 5.4 파일 구조

```
src/react/
├── types.ts
├── react.ts          - createElement
├── hooks/
│   └── useState.ts   - useState 구현
└── index.ts          - 통합 export
```

### 5.5 핵심 구현

**전역 변수:**

```tsx
let hooks: any[] = []; // Hook 저장소
let currentHookIndex = 0; // 현재 위치
let currentRoot: any = null; // 재렌더링용
```

**useState 구현:**

```tsx
export function useState<T>(initialValue: T): [T, (newValue: T) => void] {
  const hookIndex = currentHookIndex;

  // 첫 렌더링: hook 생성
  if (hooks[hookIndex] === undefined) {
    hooks[hookIndex] = { state: initialValue };
  }

  // setState 함수
  const setState = (newValue: T) => {
    hooks[hookIndex].state = newValue;
    resetHookIndex(); // 인덱스 초기화
    currentRoot.render(currentRoot.element); // 재렌더링
  };

  currentHookIndex++; // 다음 hook을 위해 증가
  return [hooks[hookIndex].state, setState];
}
```

**render.ts 수정:**

```tsx
export function createRoot(container: HTMLElement) {
  const root = {
    element: null,
    render(element: VDOMElement) {
      resetHookIndex(); // 렌더링 시작 전 초기화 ⭐
      root.element = element;

      const oldDom = container.firstChild;
      reconcile(container, oldDom, element);
    },
  };

  setRerender(root, container); // 재렌더링 설정 ⭐
  return root;
}
```

### 5.6 Hooks의 규칙

**왜 Hook은 최상위에서만 호출해야 할까?**

```tsx
// ❌ 조건문 안에서 Hook 호출 (금지!)
function BadComponent() {
  if (condition) {
    const [state, setState] = useState(0); // hookIndex 꼬임!
  }
}

// ✅ 항상 최상위에서 호출
function GoodComponent() {
  const [state, setState] = useState(0); // 항상 hooks[0]
  if (condition) {
    // state 사용
  }
}
```

**이유**: Hook은 배열 인덱스로 관리되므로 **호출 순서가 일정**해야 함!

```
첫 렌더링:    재렌더링:
hooks[0] ✅   hooks[0] ✅  (같은 위치)
hooks[1] ✅   hooks[1] ✅
```

---

📚 **자세한 내용**: [useState 구현 가이드](./docs/hooks/useState.md)

---

## 🎉 프로젝트 완성!

### ✅ 구현된 기능

1. **Virtual DOM** - JSX를 객체로 변환
2. **렌더링** - Virtual DOM을 실제 DOM으로 변환
3. **함수형 컴포넌트** - 컴포넌트 기반 아키텍처
4. **Reconciliation** - 효율적인 DOM 업데이트 (Diffing 알고리즘)
5. **useState Hook** - 함수형 컴포넌트에서 상태 관리

### 📂 최종 폴더 구조

```
own-react/
├── src/
│   ├── components/
│   │   └── UseStateTest.tsx        # useState 테스트 컴포넌트
│   ├── core/
│   │   └── react-dom/
│   │       ├── types.ts             # ExtendNode 타입
│   │       ├── createDOM.ts         # DOM 생성
│   │       ├── updateProps.ts       # 속성 업데이트
│   │       ├── reconcile.ts         # Reconciliation
│   │       ├── render.ts            # createRoot
│   │       └── index.ts             # 통합 export
│   ├── react/
│   │   ├── types.ts                 # VDOMElement 타입
│   │   ├── react.ts                 # createElement
│   │   ├── hooks/
│   │   │   ├── store.ts            # Hook 전역 상태
│   │   │   └── useState.ts         # useState 구현
│   │   └── index.ts                 # 통합 export
│   └── main.tsx                     # 앱 진입점
├── docs/
│   ├── hooks/
│   │   ├── main.md                  # Hooks 개요
│   │   └── useState.md              # useState 가이드
│   └── fiber-architecture.md        # Fiber 설명
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── Readme.md
```

### 🚀 실행 방법

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 확인
# http://localhost:5173
```

### 🧪 테스트 방법

1. 브라우저에서 페이지 열기
2. **hooks 배열** 섹션에서 실시간 상태 확인
3. 각 버튼 클릭하여 상태 변경 테스트:
   - **hooks[0]** - Counter (+1, -1, Reset)
   - **hooks[1]** - Name (React, Vue, Angular)
   - **hooks[2]** - Age (+5, -5, Reset)
   - **hooks[3]** - Toggle (ON/OFF)
4. 렌더링 횟수 증가 확인
5. 개발자 도구 (F12) 콘솔에서 reconcile 로그 확인

### 📊 성능 특징

```
✅ Virtual DOM - 메모리 내에서 빠른 비교
✅ Reconciliation - 변경된 부분만 DOM 업데이트
✅ Hook 시스템 - 전역 배열로 상태 관리
✅ 효율적인 재렌더링 - 필요한 컴포넌트만 업데이트
```

### 🎯 배운 핵심 개념

1. **Virtual DOM의 원리**

   - JSX → createElement → Virtual DOM 객체
   - 메모리 내에서 빠른 조작

2. **Reconciliation 알고리즘**

   - 4가지 케이스 (삭제, 추가, 교체, 업데이트)
   - 이전 VDOM과 새로운 VDOM 비교
   - 변경된 부분만 실제 DOM 업데이트

3. **Hook의 동작 원리**
   - 전역 배열에 상태 저장
   - hookIndex로 위치 추적
   - 클로저로 인덱스 기억
   - 재렌더링 시 인덱스 초기화

### 🔗 추가 자료

- [Hooks 개요](./docs/hooks/main.md)
- [useState 상세 가이드](./docs/hooks/useState.md)
- [Fiber Architecture](./docs/fiber-architecture.md)

### 📝 다음 단계 (선택사항)

더 발전시키고 싶다면:

1. **useEffect** - 사이드 이펙트 처리
2. **useReducer** - 복잡한 상태 관리
3. **useRef** - DOM 직접 접근
4. **useMemo / useCallback** - 메모이제이션
5. **Fiber Architecture** - 작업 분할 및 우선순위
6. **Suspense** - 비동기 렌더링
7. **Context API** - 전역 상태 관리

---

## 🎊 축하합니다!

React의 핵심 동작 원리를 이해하고 직접 구현했습니다! 🚀

**이제 React를 사용할 때 내부에서 무슨 일이 일어나는지 정확히 알 수 있습니다!**
