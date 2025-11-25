//테스트 코드 작성하기
import { React } from "./core/react";
import { ReactDOM } from "./core/react-dom";

//1. 우리가 만든 React 를 사용해서 화면에 Hello World를 렌더링 해보자
// const element = (
//   <div id="app">
//     Hello <span style="color: blue">World!</span>
//   </div>
// );

// const container = document.getElementById("root");
// if (container) {
//   const root = ReactDOM.createRoot(container);
//   root.render(element);
// }

// 직접 APP을 만들어서 실행해보자
function App() {
  return <div>Hello World</div>;
}
const container = document.getElementById("root");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}

// console.log(element);
