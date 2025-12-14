import { useState } from "react";

export default function Counter() {
  const [counter, setCounter] = useState(1); // Start at 1

  return (
    <div>
      <p>
        Step {counter} of 3
      </p>
    </div>
  );
}
