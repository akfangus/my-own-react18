# 🧵 Fiber Architecture

> React 16부터 도입된 새로운 재조정(Reconciliation) 엔진

---

## 📌 목차

1. [Fiber란 무엇인가?](#fiber란-무엇인가)
2. [왜 Fiber가 필요한가?](#왜-fiber가-필요한가)
3. [Fiber의 핵심 개념](#fiber의-핵심-개념)
4. [Fiber의 동작 방식](#fiber의-동작-방식)
5. [Fiber Node 구조](#fiber-node-구조)
6. [2단계 렌더링](#2단계-렌더링)
7. [스케줄링과 우선순위](#스케줄링과-우선순위)
8. [실생활 비유](#실생활-비유)

---

## Fiber란 무엇인가?

**한 줄 요약**: 작업을 잘게 쪼개서 천천히, 우선순위에 따라 처리하는 방식

**Fiber = 작은 작업 단위**

```
기존 React (Stack Reconciler):
전체 트리를 한 번에 처리 (재귀)

React Fiber:
트리를 여러 개의 작은 Fiber로 쪼개서 하나씩 처리
```

---

## 왜 Fiber가 필요한가?

### 🔴 문제 상황: Stack Reconciler의 한계

```tsx
// 매우 큰 컴포넌트 트리
<App>
  <Header />
  <Content>
    <Item /> // 1000개
  </Content>
  <Footer />
</App>
```

**Stack Reconciler (기존 방식):**

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│   [========== 렌더링 1000ms ==========]              │
│                                                       │
│   ❌ 중간에 멈출 수 없음                             │
│   ❌ 사용자 입력 무시                                │
│   ❌ 애니메이션 끊김                                 │
│   ❌ 스크롤 버벅임                                   │
│                                                       │
└─────────────────────────────────────────────────────┘

시간축:
0ms ──────────────────────────────────── 1000ms
     [====== 아무것도 못함 ======]
```

**왜 문제?**

```javascript
// JavaScript는 Single Thread!
function render() {
  // 재귀 시작
  reconcileChildren(); // → 더 깊은 재귀
  reconcileChildren(); // → 더더 깊은 재귀
  reconcileChildren(); // → ...

  // 끝날 때까지 멈출 수 없음!
}
```

---

### ✅ 해결책: Fiber Architecture

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│   [10ms][10ms][10ms][10ms]...[10ms]                 │
│      ↑    ↑    ↑    ↑         ↑                     │
│      └────┴────┴────┴─────────┴─ 각각 중단 가능!    │
│                                                       │
│   ✅ 중간에 멈출 수 있음                             │
│   ✅ 사용자 입력 즉시 반응                           │
│   ✅ 애니메이션 부드러움                             │
│   ✅ 스크롤 자연스러움                               │
│                                                       │
└─────────────────────────────────────────────────────┘

시간축:
0ms ──10ms──20ms──30ms──40ms──50ms
    [작업1][쉬기][작업2][쉬기][작업3]
           ↑         ↑
        사용자    애니메이션
         입력     프레임 처리
```

---

## Fiber의 핵심 개념

### 1️⃣ 작업 분할 (Work Splitting)

**Before (재귀):**

```
renderApp()
  └─ renderHeader()
  └─ renderContent()
       └─ renderItem(1)
       └─ renderItem(2)
       └─ renderItem(3)
       └─ ... (1000개)
  └─ renderFooter()

→ 한 번에 전부! 멈출 수 없음!
```

**After (Fiber):**

```
Fiber 1: <App> 처리
Fiber 2: <Header> 처리
Fiber 3: <Content> 처리
Fiber 4: <Item 1> 처리
Fiber 5: <Item 2> 처리
...
Fiber 1004: <Footer> 처리

→ 하나씩! 언제든 멈출 수 있음!
```

---

### 2️⃣ 중단 가능 (Interruptible)

```
┌─────────────────────────────────────────────┐
│  브라우저의 시간 사용                         │
├─────────────────────────────────────────────┤
│                                               │
│  프레임 (16.67ms = 60fps)                    │
│  ┌─────────────────────────────┐            │
│  │                               │            │
│  │ [Fiber 작업 5ms] [여유 시간] │            │
│  │                   ↑           │            │
│  │                   이 시간에:  │            │
│  │                   - 사용자 입력            │
│  │                   - 애니메이션            │
│  │                   - 스크롤    │            │
│  └─────────────────────────────┘            │
│                                               │
└─────────────────────────────────────────────┘
```

**코드 예시:**

```javascript
function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    // 작은 작업 하나 수행
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    // 시간 체크: 1ms 미만 남았으면 멈추기
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 작업이 남았으면 다음 프레임에 계속
  if (nextUnitOfWork) {
    requestIdleCallback(workLoop);
  }
}

// 브라우저가 한가할 때 실행
requestIdleCallback(workLoop);
```

---

### 3️⃣ 우선순위 (Priority)

모든 작업이 똑같이 중요하지 않습니다!

```
┌──────────────────────────────────────────────┐
│  우선순위 레벨                                 │
├──────────────────────────────────────────────┤
│                                                │
│  🔴 Immediate (동기)                          │
│     - 사용자 입력 (클릭, 타이핑)              │
│     - 즉시 처리해야 함                        │
│                                                │
│  🟠 UserBlocking (250ms 이내)                 │
│     - hover, 드래그                           │
│     - 빠르게 반응해야 함                      │
│                                                │
│  🟡 Normal (5초 이내)                         │
│     - 일반 렌더링                             │
│     - 데이터 fetching 후 업데이트             │
│                                                │
│  🟢 Low (10초 이내)                           │
│     - 분석 데이터 전송                        │
│     - 배경 작업                               │
│                                                │
│  ⚪ Idle (시간 날 때)                         │
│     - 로깅, 디버깅                            │
│     - 천천히 해도 됨                          │
│                                                │
└──────────────────────────────────────────────┘
```

**동작 예시:**

```
시나리오: 사용자가 버튼 클릭 (우선순위 높음)
         + 백그라운드 데이터 로딩 중 (우선순위 낮음)

시간축:
0ms ────────────────────────────────── 100ms
    [낮음][낮음][클릭!][높음 처리][낮음 재개]
              ↑
           즉시 중단하고 클릭 처리!
```

---

## Fiber의 동작 방식

### 전체 흐름

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│  1. 사용자 액션 (예: setState)                       │
│         ↓                                             │
│  2. 업데이트 스케줄링                                │
│         ↓                                             │
│  3. 우선순위 결정                                    │
│         ↓                                             │
│  4. Render Phase (중단 가능) ⭐                      │
│     ├─ Fiber Tree 구축                               │
│     ├─ Reconciliation (비교)                         │
│     └─ Effect 리스트 작성                            │
│         ↓                                             │
│  5. Commit Phase (중단 불가) ⭐                      │
│     ├─ 실제 DOM 변경                                 │
│     └─ Effect 실행                                   │
│         ↓                                             │
│  6. 완료!                                            │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## Fiber Node 구조

각 React 요소는 Fiber Node가 됩니다:

```typescript
interface Fiber {
  // 타입과 props
  type: string | Function; // 'div', MyComponent 등
  props: any; // { children, className, ... }

  // DOM 관련
  dom: HTMLElement | Text | null; // 실제 DOM 노드

  // 트리 구조 (연결 리스트) ⭐
  parent: Fiber | null; // 부모
  child: Fiber | null; // 첫 번째 자식
  sibling: Fiber | null; // 형제 (다음 요소)

  // Reconciliation 관련
  alternate: Fiber | null; // 이전 Fiber (비교용)
  effectTag: "PLACEMENT" | "UPDATE" | "DELETION";

  // Hook 관련 (useState, useEffect)
  hooks: Hook[] | null;
}
```

### Fiber Tree 구조 시각화

```tsx
// JSX
<App>
  <Header />
  <Main>
    <Article />
    <Aside />
  </Main>
  <Footer />
</App>
```

**Fiber Tree (연결 리스트):**

```
         App
          ↓ child
       Header ──sibling→ Main ──sibling→ Footer
                           ↓ child
                        Article ──sibling→ Aside

parent 관계:
Header.parent = App
Main.parent = App
Footer.parent = App
Article.parent = Main
Aside.parent = Main
```

**왜 연결 리스트?**

- ✅ 중간에 멈출 수 있음 (포인터만 저장)
- ✅ 어디서든 재개 가능
- ✅ 메모리 효율적

---

## 2단계 렌더링

Fiber는 렌더링을 2단계로 나눕니다:

### Phase 1: Render Phase (중단 가능 ✅)

```
┌─────────────────────────────────────────────┐
│  Render Phase                                 │
│  (Pure, 부수효과 없음)                       │
├─────────────────────────────────────────────┤
│                                               │
│  1. 새로운 Fiber Tree 구축                   │
│     ├─ 컴포넌트 함수 실행                    │
│     ├─ Hooks 처리                            │
│     └─ Virtual DOM 생성                      │
│                                               │
│  2. Reconciliation (Diffing)                 │
│     ├─ 이전 Fiber와 비교                     │
│     ├─ 변경사항 찾기                         │
│     └─ effectTag 설정                        │
│                                               │
│  3. Effect List 생성                         │
│     └─ 변경할 노드들의 리스트                │
│                                               │
│  ⚠️ 여기까지는 실제 DOM 건드리지 않음!       │
│  ⚠️ 언제든 중단하고 버릴 수 있음!           │
│                                               │
└─────────────────────────────────────────────┘
```

### Phase 2: Commit Phase (중단 불가 ❌)

```
┌─────────────────────────────────────────────┐
│  Commit Phase                                 │
│  (실제 DOM 변경, 빠르게 진행)                │
├─────────────────────────────────────────────┤
│                                               │
│  1. Before Mutation                           │
│     └─ getSnapshotBeforeUpdate               │
│                                               │
│  2. Mutation (DOM 변경)                      │
│     ├─ DELETION: 노드 제거                   │
│     ├─ PLACEMENT: 노드 추가                  │
│     └─ UPDATE: 노드 업데이트                 │
│                                               │
│  3. Layout Effects                            │
│     ├─ componentDidMount                      │
│     ├─ componentDidUpdate                     │
│     └─ useLayoutEffect                        │
│                                               │
│  4. Passive Effects (비동기)                 │
│     └─ useEffect                              │
│                                               │
│  ⚠️ 이 단계는 빠르게 한 번에 처리!           │
│  ⚠️ 중단하면 UI가 깨질 수 있음!             │
│                                               │
└─────────────────────────────────────────────┘
```

**왜 2단계로?**

```
Render Phase:
  - 시간이 오래 걸릴 수 있음
  - 중단해도 괜찮음 (아직 화면에 안 나옴)
  - 우선순위 높은 일이 생기면 버리고 다시 시작

Commit Phase:
  - 빠르게 진행됨 (보통 16ms 이내)
  - 중단하면 안 됨 (화면이 깨짐)
  - 한 번에 쭉!
```

---

## 스케줄링과 우선순위

### requestIdleCallback의 동작

```
┌──────────────────────────────────────────────┐
│  브라우저의 한 프레임 (16.67ms)               │
├──────────────────────────────────────────────┤
│                                                │
│  [JS 실행][렌더링][페인팅][남은 시간]        │
│   5ms      4ms     3ms      4.67ms           │
│                              ↑                │
│                          Idle Time!           │
│                      여기서 Fiber 작업        │
│                                                │
└──────────────────────────────────────────────┘
```

### 실제 스케줄러 동작

```javascript
// 간단화된 의사 코드
const taskQueue = []; // 우선순위 큐

function scheduleTask(task, priority) {
  taskQueue.push({ task, priority });
  taskQueue.sort((a, b) => b.priority - a.priority);

  if (!isProcessing) {
    requestIdleCallback(processTaskQueue);
  }
}

function processTaskQueue(deadline) {
  while (taskQueue.length > 0 && deadline.timeRemaining() > 0) {
    const { task } = taskQueue.shift();
    task();
  }

  if (taskQueue.length > 0) {
    requestIdleCallback(processTaskQueue);
  }
}
```

---

## 실생활 비유

### 🏗️ 건축 비유

**Stack Reconciler (재귀):**

```
건물을 한 번에 지어야 함
    ↓
기초 → 1층 → 2층 → 3층 → 지붕
    ↓
끝날 때까지 다른 일 못 함
누가 불러도 무시
화장실도 못 감
```

**Fiber:**

```
건물을 구역별로 나눠서 지음
    ↓
기초 일부 → 쉬기 → 1층 일부 → 쉬기 → ...
    ↓
중간에 멈출 수 있음
급한 일(전화) 생기면 그거 먼저
다시 돌아와서 계속
```

---

### 📦 택배 배달 비유

**Stack Reconciler:**

```
택배 100개를 한 번에 들고 배달
    ↓
내려놓을 수 없음
중간에 긴급 택배가 와도 무시
다 배달할 때까지 계속
    ↓
힘들고 비효율적
```

**Fiber:**

```
택배를 한 개씩 들고 배달
    ↓
긴급 택배(우선순위 높음) 오면
    ↓
지금 들고 있는 거 내려놓고
    ↓
긴급 택배 먼저 배달
    ↓
다시 돌아와서 나머지 배달
    ↓
효율적이고 유연함!
```

---

### 🍳 요리 비유

**Stack Reconciler:**

```
모든 요리를 동시에 시작
    ↓
밥 짓기 시작 → 국 끓이기 시작 → 반찬 만들기 시작
    ↓
모든 게 끝날 때까지 아무것도 못 먹음
불 조절도 못 함
전화벨 울려도 무시
```

**Fiber:**

```
요리를 단계별로 진행
    ↓
밥 씻기 → (쉬기) → 물 붓기 → (쉬기) → 불 켜기
    ↓
중간에 타이머 울리면 확인
전화 오면 받고
다시 돌아와서 계속
    ↓
훨씬 자연스럽고 효율적!
```

---

## 📊 성능 비교

### Stack Reconciler vs Fiber

| 항목            | Stack Reconciler | Fiber         |
| --------------- | ---------------- | ------------- |
| **렌더링 방식** | 재귀 (한 번에)   | 반복 (조금씩) |
| **중단 가능**   | ❌               | ✅            |
| **우선순위**    | 없음             | ✅ 5단계      |
| **프레임 드롭** | 자주 발생        | 거의 없음     |
| **큰 앱 성능**  | 느림             | 빠름          |
| **사용자 경험** | 버벅임           | 부드러움      |
| **복잡도**      | 낮음             | 높음          |

### 실제 성능 측정 예시

```
시나리오: 1000개 아이템 리스트 렌더링

Stack Reconciler:
├─ 렌더링 시간: 1000ms
├─ 프레임 드롭: 60프레임
├─ 사용자 입력 지연: 1000ms
└─ 체감: 멈춘 것처럼 느껴짐 ❌

Fiber:
├─ 렌더링 시간: 1000ms (동일)
├─ 프레임 드롭: 0프레임
├─ 사용자 입력 지연: 16ms 이하
└─ 체감: 부드럽고 반응 빠름 ✅
```

---

## 🎯 Fiber의 장점 정리

### 1. 🎨 부드러운 UI

```
60fps 유지
애니메이션 끊김 없음
스크롤 자연스러움
```

### 2. ⚡ 빠른 반응성

```
사용자 입력 즉시 반응
클릭, 타이핑 지연 없음
hover 효과 빠름
```

### 3. 🎯 우선순위 처리

```
중요한 것 먼저
긴급하지 않은 건 나중에
효율적인 리소스 사용
```

### 4. 📦 큰 앱 지원

```
수천 개 컴포넌트도 OK
복잡한 트리 구조 처리
메모리 효율적
```

### 5. 🔋 배터리 절약

```
불필요한 작업 최소화
Idle 시간 활용
CPU 효율적 사용
```

---

## 🚀 결론

Fiber는 React의 성능을 근본적으로 개선한 핵심 기술입니다.

**핵심 아이디어:**

- 🧩 작업을 잘게 쪼개기
- ⏸️ 중간에 멈출 수 있기
- 🎯 우선순위로 처리하기
- ⚡ 사용자 경험 최우선

**결과:**

- 더 빠르고
- 더 부드럽고
- 더 반응적인
- React 애플리케이션! 🎉

---

## 📚 참고 자료

- [React Fiber Architecture - GitHub](https://github.com/acdlite/react-fiber-architecture)
- [Lin Clark - A Cartoon Intro to Fiber](https://www.youtube.com/watch?v=ZCuYPiUIONs)
- [React Fiber Deep Dive](https://blog.ag-grid.com/inside-fiber-an-in-depth-overview-of-the-new-reconciliation-algorithm-in-react/)
