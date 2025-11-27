/**
 * 속성인지 확인 (children 제외)
 */
const isProperty = (key: string) => key !== "children";

/**
 * 이전에는 있었지만 새로운 props에는 없는지 확인
 */
const isGone = (prev: any, next: any) => (key: string) => {
  return !(key in next);
};

/**
 * 새롭거나 값이 변경된 속성인지 확인
 */
const isNew = (prev: any, next: any) => (key: string) => {
  return prev[key] !== next[key];
};

/**
 * DOM 요소의 속성을 업데이트
 */
export function updateProps(
  dom: HTMLElement | Text,
  oldProps: any,
  newProps: any
) {
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
