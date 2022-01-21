import React, { useState } from 'react';

export default function CounterApp() {
    const [counter, setCounter] = useState(0);
  return <div>
      <button onClick={() =>setCounter(counter+1)}>Incrementar</button>
      {counter}</div>;
}
