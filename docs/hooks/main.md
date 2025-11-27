# 🪝 React Hooks

> 함수형 컴포넌트에서 상태와 생명주기 사용

---

## Hooks란?

```tsx
function Counter() {
  const [count, setCount] = useState(0); // 🪝 Hook!
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**함수형 컴포넌트에서 React 기능을 사용할 수 있게 해주는 함수**

---

## 왜 필요한가?

### Before (Class)

```tsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}
```

❌ 길고 복잡, `this` 바인딩, 로직 분산

### After (Hooks)

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

✅ 간결, `this` 없음, 로직 한 곳

---

## 핵심 원리

### 문제

```tsx
function Counter() {
  let count = 0; // ← 함수 끝나면 사라짐
}
```

### 해결

```
React 내부 (전역):
hooks = [
  { state: 0 },      // useState(0)
  { state: 'text' }, // useState('')
]
currentHookIndex = 0
```

---

## 동작 흐름

```
[첫 렌더링]
currentHookIndex = 0
useState(0) → hooks[0] = { state: 0 }
useState('') → hooks[1] = { state: '' }

[setState 호출]
hooks[0].state = 1
currentHookIndex = 0 (초기화)
재렌더링 트리거

[재렌더링]
useState(0) → hooks[0]에서 가져오기 (state = 1)
useState('') → hooks[1]에서 가져오기
```

---

## 구현된 Hooks

### ✅ useState

상태 관리

```tsx
const [state, setState] = useState(initialValue);
```

📖 [useState 구현 가이드](./useState.md)

---

## Hooks의 규칙

### ❌ 금지

```tsx
if (condition) {
  const [state, setState] = useState(0); // ❌
}
```

### ✅ 올바름

```tsx
const [state, setState] = useState(0); // ✅ 최상위
```

**이유**: Hook은 배열 인덱스로 관리 → 순서가 바뀌면 엉뚱한 값

```
hooks[0] ← 첫 번째 useState
hooks[1] ← 두 번째 useState
hooks[2] ← 세 번째 useState
```

---

## 핵심 요약

```
✅ 전역 배열에 상태 저장
✅ 인덱스로 위치 추적
✅ setState 시 재렌더링
✅ reconcile로 효율적 업데이트
```
