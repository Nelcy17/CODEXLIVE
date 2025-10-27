import express from "express";
import fetch from "node-fetch"; 

const router = express.Router();

const JUDGE0_API = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true";

router.post("/", async (req, res) => {
  const { code, language, stdin } = req.body;

  const langMap = {
    JavaScript: 63, 
    Python: 71,     
    Cpp: 54,        
    Java: 62,       
    C: 50,          
  };

  const langId = langMap[language] || 63; 

  try {
    const encodedCode = Buffer.from(code).toString("base64");
    const encodedStdin = Buffer.from(stdin || "").toString("base64");
    const response = await fetch(process.env.JUDGE0_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
      body: JSON.stringify({
        source_code: encodedCode,
        language_id: langId,
        stdin: encodedStdin,
      }),
    });

    const data = await response.json();
    console.log("Judge0 response:", data);
    const decode = (base64Str) => {
    if (!base64Str) return null;
      return Buffer.from(base64Str, "base64").toString("utf-8");
    };
    const output =
      decode(data.stdout) ||
      decode(data.stderr) ||
      decode(data.compile_output) ||
      "No output";

    res.json({ output });
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({ output: "Error running code" });
  }
});

export const runCodeRoute =  router;
