const express = require('express');
const cors = require('cors');
const { execFile } = require('child_process');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/run', async (req, res) => {
  const { code, language, inputs } = req.body;

  if (language !== 'python') {
    return res.status(400).json({ error: 'Only python is supported right now.' });
  }

  try {
    const results = [];
    for (const input of inputs) {
      // input is a JSON string, parse it before use
      const parsedInput = JSON.parse(input);
      const output = await runPythonCode(code, parsedInput);
      results.push({ output });
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

function runPythonCode(code, input) {
  return new Promise((resolve, reject) => {
    // We expect user to define a 'main' function in the code
    // We execute code and call main() with the input, print the output
    const fullCode = `
${code}

import sys, json

input_data = json.loads(sys.argv[1])
result = main(input_data)
print(result)
    `;

    // Write code to a temp file or pass as argument to python -c

    // Use execFile with 'python3', ['-c', fullCode, JSON.stringify(input)] won't work because JSON argument passed as argv[1]
    // So better to spawn python with args: -c fullCode + JSON-string input arg

    const child = execFile('python3', ['-c', fullCode, JSON.stringify(input)], (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
