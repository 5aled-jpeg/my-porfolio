import React, { useState } from "react";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [prevVal, setPrevVal] = useState(null);
  const [op, setOp] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPrevVal(null);
    setOp(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    const val = parseFloat(display);
    setDisplay(String(-val));
  };

  const inputPercent = () => {
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const performOp = (nextOp) => {
    const inputVal = parseFloat(display);

    if (prevVal === null) {
      setPrevVal(inputVal);
    } else if (op) {
      const currentVal = prevVal || 0;
      let res = currentVal;
      switch (op) {
        case "+":
          res = currentVal + inputVal;
          break;
        case "-":
          res = currentVal - inputVal;
          break;
        case "×":
          res = currentVal * inputVal;
          break;
        case "÷":
          res = inputVal !== 0 ? currentVal / inputVal : 0;
          break;
        default:
          break;
      }
      setPrevVal(res);
      setDisplay(String(res));
    }

    setWaitingForOperand(true);
    setOp(nextOp);
  };

  const equals = () => {
    if (!op || prevVal === null) return;
    performOp(null);
    setOp(null);
  };

  return (
    <div className="w-full h-full bg-[#1c1c1e] text-white flex flex-col p-4 select-none">
      {/* Display */}
      <div className="flex-1 flex items-end justify-end px-3 py-2 text-4xl font-light tracking-tight truncate">
        {display}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-2 text-lg font-medium">
        <button
          onClick={clear}
          className="h-12 rounded-full bg-[#a5a5a5] text-black hover:bg-[#d4d4d2] active:opacity-80 transition"
        >
          {display !== "0" ? "C" : "AC"}
        </button>
        <button
          onClick={toggleSign}
          className="h-12 rounded-full bg-[#a5a5a5] text-black hover:bg-[#d4d4d2] active:opacity-80 transition"
        >
          ±
        </button>
        <button
          onClick={inputPercent}
          className="h-12 rounded-full bg-[#a5a5a5] text-black hover:bg-[#d4d4d2] active:opacity-80 transition"
        >
          %
        </button>
        <button
          onClick={() => performOp("÷")}
          className={`h-12 rounded-full text-white active:opacity-80 transition ${
            op === "÷" ? "bg-white text-[#ff9f0a]" : "bg-[#ff9f0a] hover:bg-[#ffb038]"
          }`}
        >
          ÷
        </button>

        <button
          onClick={() => inputDigit(7)}
          className="h-12 rounded-full bg-[#333333] hover:bg-[#555] active:opacity-80 transition"
        >
          7
        </button>
        <button
          onClick={() => inputDigit(8)}
          className="h-12 rounded-full bg-[#333333] hover:bg-[#555] active:opacity-80 transition"
        >
          8
        </button>
        <button
          onClick={() => inputDigit(9)}
          className="h-12 rounded-full bg-[#333333] hover:bg-[#555] active:opacity-80 transition"
        >
          9
        </button>
        <button
          onClick={() => performOp("×")}
          className={`h-12 rounded-full text-white active:opacity-80 transition ${
            op === "×" ? "bg-white text-[#ff9f0a]" : "bg-[#ff9f0a] hover:bg-[#ffb038]"
          }`}
        >
          ×
        </button>

        <button
          onClick={() => inputDigit(4)}
          className="h-12 rounded-full bg-[#333333] hover:bg-[#555] active:opacity-80 transition"
        >
          4
        </button>
        <button
          onClick={() => inputDigit(5)}
          className="h-12 rounded-full bg-[#333333] hover:bg-[#555] active:opacity-80 transition"
        >
          5
        </button>
        <button
          onClick={() => inputDigit(6)}
          className="h-12 rounded-full bg-[#333333] hover:bg-[#555] active:opacity-80 transition"
        >
          6
        </button>
        <button
          onClick={() => performOp("-")}
          className={`h-12 rounded-full text-white active:opacity-80 transition ${
            op === "-" ? "bg-white text-[#ff9f0a]" : "bg-[#ff9f0a] hover:bg-[#ffb038]"
          }`}
        >
          −
        </button>

        <button
          onClick={() => inputDigit(1)}
          className="h-12 rounded-full bg-[#333333] hover:bg-[#555] active:opacity-80 transition"
        >
          1
        </button>
        <button
          onClick={() => inputDigit(2)}
          className="h-12 rounded-full bg-[#333333] hover:bg-[#555] active:opacity-80 transition"
        >
          2
        </button>
        <button
          onClick={() => inputDigit(3)}
          className="h-12 rounded-full bg-[#333333] hover:bg-[#555] active:opacity-80 transition"
        >
          3
        </button>
        <button
          onClick={() => performOp("+")}
          className={`h-12 rounded-full text-white active:opacity-80 transition ${
            op === "+" ? "bg-white text-[#ff9f0a]" : "bg-[#ff9f0a] hover:bg-[#ffb038]"
          }`}
        >
          +
        </button>

        <button
          onClick={() => inputDigit(0)}
          className="h-12 col-span-2 rounded-full bg-[#333333] hover:bg-[#555] text-left pl-6 active:opacity-80 transition"
        >
          0
        </button>
        <button
          onClick={inputDecimal}
          className="h-12 rounded-full bg-[#333333] hover:bg-[#555] active:opacity-80 transition"
        >
          .
        </button>
        <button
          onClick={equals}
          className="h-12 rounded-full bg-[#ff9f0a] hover:bg-[#ffb038] text-white active:opacity-80 transition"
        >
          =
        </button>
      </div>
    </div>
  );
}
