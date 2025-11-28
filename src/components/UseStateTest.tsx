import { React, useState } from "@/react";

let renderCount = 0;

export function UseStateTest() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("React");
  const [age, setAge] = useState(25);
  const [isOn, setIsOn] = useState(false);

  renderCount++;

  return (
    <div style="padding: 20px; font-family: Arial;">
      <h1>🪝 useState Hook 시각화</h1>

      <div style="background: #1e1e1e; color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin: 0 0 15px 0;">📦 hooks 배열 (전역 저장소)</h2>
        <div style="font-family: monospace; font-size: 16px;">
          <div style="background: #2d2d30; padding: 10px; margin: 5px 0; border-left: 4px solid #4CAF50;">
            hooks[0] = {`{ state: ${count} }`}
          </div>
          <div style="background: #2d2d30; padding: 10px; margin: 5px 0; border-left: 4px solid #2196F3;">
            hooks[1] = {`{ state: "${name}" }`}
          </div>
          <div style="background: #2d2d30; padding: 10px; margin: 5px 0; border-left: 4px solid #FF9800;">
            hooks[2] = {`{ state: ${age} }`}
          </div>
          <div style="background: #2d2d30; padding: 10px; margin: 5px 0; border-left: 4px solid #E91E63;">
            hooks[3] = {`{ state: ${isOn} }`}
          </div>
        </div>
        <p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.7;">
          렌더링 횟수: {renderCount}
        </p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; border-left: 4px solid #4CAF50;">
          <h3>hooks[0] - Count: {count}</h3>
          <button
            onclick={() => setCount(count + 1)}
            style="margin: 5px; padding: 8px 15px; cursor: pointer;"
          >
            +1
          </button>
          <button
            onclick={() => setCount(count - 1)}
            style="margin: 5px; padding: 8px 15px; cursor: pointer;"
          >
            -1
          </button>
          <button
            onclick={() => setCount(0)}
            style="margin: 5px; padding: 8px 15px; cursor: pointer;"
          >
            Reset
          </button>
        </div>

        <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; border-left: 4px solid #2196F3;">
          <h3>hooks[1] - Name: {name}</h3>
          <button
            onclick={() => setName("React")}
            style="margin: 5px; padding: 8px 15px; cursor: pointer;"
          >
            React
          </button>
          <button
            onclick={() => setName("Vue")}
            style="margin: 5px; padding: 8px 15px; cursor: pointer;"
          >
            Vue
          </button>
          <button
            onclick={() => setName("Angular")}
            style="margin: 5px; padding: 8px 15px; cursor: pointer;"
          >
            Angular
          </button>
        </div>

        <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; border-left: 4px solid #FF9800;">
          <h3>hooks[2] - Age: {age}</h3>
          <button
            onclick={() => setAge(age + 5)}
            style="margin: 5px; padding: 8px 15px; cursor: pointer;"
          >
            +5
          </button>
          <button
            onclick={() => setAge(age - 5)}
            style="margin: 5px; padding: 8px 15px; cursor: pointer;"
          >
            -5
          </button>
          <button
            onclick={() => setAge(25)}
            style="margin: 5px; padding: 8px 15px; cursor: pointer;"
          >
            Reset
          </button>
        </div>

        <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; border-left: 4px solid #E91E63;">
          <h3>hooks[3] - Toggle: {isOn ? "ON" : "OFF"}</h3>
          <button
            onclick={() => setIsOn(!isOn)}
            style="margin: 5px; padding: 8px 15px; cursor: pointer; background: {isOn ? '#4CAF50' : '#f44336'}; color: white; border: none; border-radius: 4px;"
          >
            {isOn ? "Turn OFF" : "Turn ON"}
          </button>
        </div>
      </div>

      <div style="background: #fff3e0; padding: 15px; margin: 20px 0; border-radius: 8px;">
        <h3>💡 핵심 포인트</h3>
        <p>• useState가 호출될 때마다 hookIndex가 0 → 1 → 2 → 3으로 증가</p>
        <p>• 각 setState는 클로저로 자신의 인덱스를 기억</p>
        <p>• 재렌더링 시 hookIndex = 0으로 초기화되어 순서대로 접근</p>
      </div>
    </div>
  );
}

