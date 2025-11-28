import { React } from "@/react";
import { ReactDOM } from "@/core/react-dom";
import { UseStateTest } from "@/components/UseStateTest";

const container = document.getElementById("root");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<UseStateTest />);
}
