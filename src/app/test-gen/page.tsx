"use client";

import { useState } from "react";

export default function TestPage() {
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Idle");

  async function runTest() {
    try {
      setStatus("Connecting...");
      setOutput("");

      const response = await fetch("/api/test-gen", {
        method: "POST",
        body: JSON.stringify({ prompt: "Write a haiku about coding." }),
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      if (!response.body) throw new Error("No response body");

      setStatus("Streaming...");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setOutput((prev) => prev + text);
      }

      setStatus("Complete");
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  }

  return (
    <div className="p-10 font-mono text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">AI Logic Test</h1>
      <button
        onClick={runTest}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 mb-4"
      >
        Test Connection
      </button>
      <div className="mb-2 text-yellow-400">Status: {status}</div>
      <div className="p-4 border border-gray-700 rounded bg-gray-900 whitespace-pre-wrap">
        {output || "Waiting for output..."}
      </div>
    </div>
  );
}