# 📚 Own React - 프로젝트 요약

> React의 핵심 동작 원리를 직접 구현하며 배우는 프로젝트

---

## 🎯 프로젝트 목표

React 18의 핵심 기능을 처음부터 구현하며 내부 동작 원리를 이해한다.

---

## ✅ 완성된 기능

### Chapter 1: Virtual DOM

```tsx
React.createElement("div", null, "Hello")
→ { type: "div", props: { children: [...] } }
```

- ✅ JSX를 Virtual DOM 객체로 변환
- ✅ TEXT_ELEMENT로 텍스트 통일

### Chapter 2: Rendering

```tsx
ReactDOM.createRoot(container).render(<App />);
```

- ✅ Virtual DOM → 실제 DOM 생성
- ✅ 재귀적으로 전체 트리 렌더링

### Chapter 3: 함수형 컴포넌트

```tsx
function App() {
  return <div>Hello</div>;
}
```

- ✅ 함수형 컴포넌트 지원
- ✅ props 전달

### Chapter 4: Reconciliation

```tsx
// 변경된 부분만 업데이트!
```

- ✅ 4가지 케이스 Diffing (삭제/추가/교체/업데이트)
- ✅ DOM 재사용으로 성능 최적화
- ✅ 이전 VDOM 추적 (`_vdom`)

### Chapter 5: useState Hook

```tsx
const [state, setState] = useState(0);
```

- ✅ 전역 배열에 상태 저장
- ✅ hookIndex로 위치 추적
- ✅ 클로저로 인덱스 기억
- ✅ setState 시 재렌더링

---

## 📂 프로젝트 구조

```
own-react/
├── src/
│   ├── components/
│   │   └── UseStateTest.tsx        # useState 시각화
│   ├── core/
│   │   └── react-dom/              # DOM 렌더링 엔진
│   │       ├── types.ts            # ExtendNode
│   │       ├── createDOM.ts        # DOM 생성
│   │       ├── updateProps.ts      # 속성 업데이트
│   │       ├── reconcile.ts        # Diffing 알고리즘
│   │       ├── render.ts           # createRoot
│   │       └── index.ts
│   ├── react/                      # React 코어
│   │   ├── types.ts                # VDOMElement
│   │   ├── react.ts                # createElement
│   │   ├── hooks/
│   │   │   ├── store.ts           # Hook 전역 상태
│   │   │   └── useState.ts        # useState
│   │   └── index.ts
│   └── main.tsx
├── docs/
│   ├── hooks/
│   │   ├── main.md
│   │   └── useState.md
│   ├── fiber-architecture.md
│   └── SUMMARY.md
└── Readme.md
```

---

## 🚀 실행

```bash
npm install
npm run dev
```

브라우저: `http://localhost:5173`

---

## 🧪 테스트

**UseStateTest 컴포넌트**에서 확인:

- 4개의 useState 독립 동작
- hooks 배열 실시간 시각화
- 렌더링 횟수 추적
- Reconciliation 효율성

---

## 🎓 배운 핵심 개념

### 1. Virtual DOM

```
JSX → Virtual DOM 객체
→ 메모리에서 빠른 조작
→ 실제 DOM은 마지막에만 변경
```

### 2. Reconciliation

```
이전 VDOM vs 새로운 VDOM 비교
→ 4가지 케이스 처리
→ 변경된 부분만 DOM 업데이트
→ 성능 최적화!
```

### 3. Hooks

```
전역 배열에 상태 저장
→ hookIndex로 위치 추적
→ setState → 재렌더링
→ 함수형 컴포넌트에서 상태 관리
```

---

## 📊 성능 비교

| 기능      | 일반 DOM 조작  | Own React   |
| --------- | -------------- | ----------- |
| 렌더링    | 매번 새로 생성 | Virtual DOM |
| 업데이트  | 전체 교체      | 변경 부분만 |
| 상태 관리 | 수동           | useState    |
| 성능      | ❌ 느림        | ✅ 빠름     |

---

## 🔗 참고 문서

- [Hooks 개요](./hooks/main.md)
- [useState 가이드](./hooks/useState.md)
- [Fiber Architecture](./fiber-architecture.md)

---

## 🚀 다음 단계 (선택)

1. **useEffect** - 사이드 이펙트
2. **useReducer** - 복잡한 상태
3. **Fiber** - 작업 분할
4. **Context API** - 전역 상태
5. **Suspense** - 비동기 렌더링

---

## 🎊 완성!

React의 핵심을 이해하고 직접 구현했습니다!

**이제 React 내부에서 무슨 일이 일어나는지 알 수 있습니다!** 🎉
