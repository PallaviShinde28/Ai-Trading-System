import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const analyzeSentiment = (text) => {
  return new Promise((resolve, reject) => {

    // ✅ GO ONE LEVEL UP (to project root) → then ai-engine
    const scriptPath = path.join(__dirname, "..", "..", "ai-engine", "sentiment.py");

    console.log("Python Path:", scriptPath); // debug

    const py = spawn("python", [scriptPath, text]);

    let result = "";

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (data) => {
      console.error("Python Error:", data.toString());
      reject("Python failed");
    });

    py.on("close", () => {
      try {
        const parsed = JSON.parse(result);
        resolve(parsed);
      } catch (e) {
        reject("Invalid JSON from Python");
      }
    });
  });
};

export default analyzeSentiment;