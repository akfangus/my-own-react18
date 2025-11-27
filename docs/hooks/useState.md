# 🪝 useState Hook 구현

> 함수형 컴포넌트에서 상태 관리

---

## 핵심 문제와 해결

### 🔴 문제: 함수는 끝나면 사라진다

```tsx
function Counter() {
  let count = 0; // ← 함수 끝나면 사라짐!
  return <div>{count}</div>;
}
```

### ✅ 해결: 전역에 저장

```
hooks = [{ state: 0 }]  ← 컴포넌트 밖에 저장
currentHookIndex = 0    ← 위치 추적
```

---

## Hook 저장 구조

```typescript
// 전역 변수
let hooks: any[] = [];
let currentHookIndex = 0;
let currentRoot: any = null;
let currentRootContainer: HTMLElement | null = null;
```

---

## useState 구현

```typescript
export function useState<T>(initialValue: T): [T, (newValue: T) => void] {
  const hookIndex = currentHookIndex;

  // 첫 렌더링: hook 생성
  if (hooks[hookIndex] === undefined) {
    hooks[hookIndex] = { state: initialValue };
  }

  // setState 함수
  const setState = (newValue: T) => {
    hooks[hookIndex].state = newValue;
    resetHookIndex();
    currentRoot.render(currentRoot.element);
  };

  currentHookIndex++;
  return [hooks[hookIndex].state, setState];
}
```

---

## 헬퍼 함수

```typescript
export function setRerender(root: any, container: HTMLElement) {
  currentRoot = root;
  currentRootContainer = container;
}

export function resetHookIndex() {
  currentHookIndex = 0;
}
```

---

## render.ts 수정

```typescript
export function createRoot(container: HTMLElement) {
  const root = {
    element: null,
    render(element: VDOMElement) {
      resetHookIndex(); // ⭐ 초기화
      root.element = element;

      const oldDom = container.firstChild;
      reconcile(container, oldDom, element);
    },
  };

  setRerender(root, container); // ⭐ 설정
  return root;
}
```

---

## 동작 흐름

```
[첫 렌더링]
useState(0) → hooks[0] = { state: 0 } → [0, setState] 반환

[setState(1) 호출]
hooks[0].state = 1 → resetHookIndex() → 재렌더링

[재렌더링]
useState(0) → hooks[0]에서 가져오기 → [1, setState] 반환
```

---

## Hook 규칙

### ❌ 금지

```tsx
if (condition) {
  const [state, setState] = useState(0); // ❌ 순서 꼬임
}
```

### ✅ 올바름

```tsx
const [state, setState] = useState(0); // ✅ 최상위
if (condition) {
  setState(1); // ✅
}
```

**이유**: Hook은 배열 인덱스로 관리 → 순서 일정해야 함

---

## 사용 예시

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

---

## 핵심 정리

```
1. 전역 배열 저장: hooks = [{ state: value }]
2. 인덱스 추적: currentHookIndex = 0, 1, 2...
3. 재렌더링: setState → reconcile로 효율적 업데이트
```
