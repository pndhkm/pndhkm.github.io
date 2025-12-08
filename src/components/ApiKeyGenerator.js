// src/components/ApiKeyGenerator.js
import React, { useState } from "react";

function generateUUID() {
  let d = new Date().getTime();

  if (window.performance?.now) {
    d += performance.now();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = ((d + Math.random() * 16) % 16) | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const ApiKeyGenerator = () => {
  const [key, setKey] = useState("");

  const handleGenerate = () => {
    setKey(generateUUID());
  };

  return (
    <div style={{ textAlign: "left", paddingTop: 5 }}>
      <button
        style={{ padding: "6px 15px", marginRight: 10 }}
        onClick={handleGenerate}
      >
        Generate API Key
      </button>

      <input
        style={{ padding: "6px", width: 300 }}
        value={key}
        readOnly
      />
    </div>
  );
};

export default ApiKeyGenerator;
