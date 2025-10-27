import React, { useEffect, useState, useRef } from "react";

export default function CodeEditor({
  onChange,
  joinedUsers = [],
  roomId,
  onLeave,
}) {
  const [boilerplates, setBoilerplates] = useState({});
  const [code, setCode] = useState("// Start coding...\n");
  const [lineCount, setLineCount] = useState(1);
  const [language, setLanguage] = useState("JavaScript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef(null);

  const [stdin, setStdin] = useState("");
  const [activeTab, setActiveTab] = useState("input"); 

  useEffect(() => {
    import("./boilerplates.json")
      .then((data) => setBoilerplates(data.default || data))
      .catch((err) => console.error("Failed to load boilerplates:", err));
  }, []);

  const handleChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    setLineCount(newCode.split("\n").length);
    onChange(newCode, language);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await fetch("https://codexlive.onrender.com/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, stdin }),
      });
      const data = await res.json();

      setOutput(data.output);
      setActiveTab("output"); 

      if (window.socket && roomId) {
        console.log("⚡ Emitting run-output", data.output);
        window.socket.emit("run-output", {
          roomId,
          output: data.output,
          stdin,
        });
      }
    } catch (err) {
      setOutput("Error: " + err.message);
    }
    setIsRunning(false);
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    const newCode = boilerplates[selectedLang] || "// Start coding...\n";
    setCode(newCode);
    setLineCount(newCode.split("\n").length);
    onChange(newCode, selectedLang);
  };

  useEffect(() => {
    const handleRemoteCode = (e) => {
      setCode(e.detail);
      setLineCount(e.detail.split("\n").length);
    };

    const handleLoadCode = (e) => {
      setCode(e.detail);
      setLineCount(e.detail.split("\n").length);
    };

    const handleRemoteLang = (e) => {
      setLanguage(e.detail);
    };

    window.addEventListener("remoteCode", handleRemoteCode);
    window.addEventListener("loadCode", handleLoadCode);
    window.addEventListener("remoteLang", handleRemoteLang);

    let socket = window.socket;

    const setupSocketListener = () => {
      if (!socket) return;

      const handleRemoteOutput = ({ output, stdin }) => {
        console.log("📩 Received remote output:", output);
        setOutput(output);
        if (stdin !== undefined) {
          setStdin(stdin); 
        }
        setActiveTab("output"); 
      };
      socket.on("run-output", handleRemoteOutput);

      return () => {
        socket.off("run-output", handleRemoteOutput);
      };
    };

    const cleanupSocket = setupSocketListener();

    return () => {
      window.removeEventListener("remoteCode", handleRemoteCode);
      window.removeEventListener("loadCode", handleLoadCode);
      window.removeEventListener("remoteLang", handleRemoteLang);
      if (cleanupSocket) cleanupSocket();
    };
  }, []);

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      alert(" Room ID copied!");
    } catch (err) {
      console.error("Failed to copy Room ID:", err);
    }
  };

  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);
  const languages = [
    "JavaScript",
    "JSX",
    "TypeScript",
    "TSX",
    "CSS",
    "HTML",
    "Cpp",
    "Java",
    "Python",
  ];

  return (
    <div className="flex h-[90vh] bg-[#0d1117] text-white rounded-lg overflow-hidden shadow-xl border border-gray-800">
      <aside className="w-56 bg-[#161b22] border-r border-gray-800 flex flex-col justify-between">
        <div>
          <div className="p-3 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-300">
              Joined Members
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {joinedUsers.length > 0 ? (
              joinedUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-[#1c2128] px-3 py-2 rounded-md hover:bg-[#21262d] transition"
                >
                  <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-black font-semibold text-xs">
                    {user.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-200 text-sm">{user}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-xs text-center mt-4">
                No users joined yet.
              </p>
            )}
          </div>
        </div>
        <div className="p-3 border-t border-gray-700 space-y-2">
          <button
            onClick={handleCopyRoomId}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-1.5 rounded-md text-sm transition"
          >
            Copy Room ID
          </button>
          <button
            onClick={onLeave}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-1.5 rounded-md text-sm transition"
          >
            Leave Room
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between bg-[#161b22] px-4 py-2 border-b border-gray-800">
          <div>
            <label className="text-gray-300 text-sm font-medium mr-2">
              Language:
            </label>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-[#0d1117] text-white border border-gray-700 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className={`${
              isRunning ? "bg-gray-500" : "bg-green-500 hover:bg-green-400"
            } text-black font-semibold py-1 px-3 rounded-md text-sm transition`}
          >
            {isRunning ? "Running..." : "▶ Run Code"}
          </button>
        </div>

        <div className="flex flex-[3] overflow-hidden">
          <div className="bg-[#0d1117] px-3 py-2 text-gray-500 select-none text-right border-r border-gray-800">
            {lines.map((n) => (
              <div key={n} className="leading-5 text-xs">
                {n}
              </div>
            ))}
          </div>

          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            spellCheck="false"
            className="flex-1 p-3 bg-[#0d1117] text-gray-100 outline-none resize-none leading-5 text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            style={{
              fontFamily: "Fira Code, monospace",
              overflowY: "auto",
              whiteSpace: "pre",
            }}
          />
        </div>

        <div className="flex flex-col flex-[2] border-t border-gray-800">
          <div className="flex bg-[#161b22] border-b border-gray-800">
            <button
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === "input"
                  ? "bg-[#0d1117] text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:bg-[#21262d]"
              }`}
              onClick={() => setActiveTab("input")}
            >
              Input
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === "output"
                  ? "bg-[#0d1117] text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:bg-[#21262d]"
              }`}
              onClick={() => setActiveTab("output")}
            >
              Output
            </button>
          </div>
          <div className="flex-1 bg-[#0d1117] overflow-auto">
            {activeTab === "input" ? (
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                spellCheck="false"
                className="w-full h-full p-3 bg-[#0d1117] text-gray-100 outline-none resize-none leading-5 text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                placeholder="Enter custom input (stdin) here..."
                style={{ fontFamily: "Fira Code, monospace" }}
              />
            ) : (
              <div className="p-3 text-sm text-gray-300">
                <strong className="text-yellow-400">Output:</strong>
                <pre className="mt-2 whitespace-pre-wrap">
                  {output || "Run code to see output..."}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
