import React, { useEffect, useState } from 'react';
import { Play, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import Button from '../Button';
import { getCodingProblems } from '../../data/questions';
import Editor from '@monaco-editor/react';

interface CodingProblem {
  role: string;
  category: string;
  question: string;
  input: any[];
  expected_output: any[];
  language: string[];
  difficulty: string;
}

interface Result {
  input: string;
  expectedOutput: string;
  output: string;
  passed: boolean;
}

interface CodingRoundProps {
  roleId: string;
  onComplete: (feedback: any) => void;
}

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = '83a814c343msh13573ec999cc022p1c7105jsn8cb9b3a9d01a';

const languageMap: Record<string, number> = {
  python: 71,
  javascript: 63,
  java: 62,
  c: 50,
  cpp: 54,
};

const boilerplates: Record<string, string> = {
  python: `# Read inputs like this
a = input()
b = input()

# Write your logic here
print(a)
print(b)
`,
  javascript: `const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let input = [];
rl.on('line', (line) => {
  input.push(line);
  if (input.length === 2) {
    console.log(input[0]);
    console.log(input[1]);
    rl.close();
  }
});
`,
  java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String a = sc.nextLine();
    String b = sc.nextLine();

    System.out.println(a);
    System.out.println(b);
  }
}
`,
  c: `#include <stdio.h>
int main() {
  char a[100], b[100];
  scanf("%s", a);
  scanf("%s", b);
  printf("%s\\n", a);
  printf("%s\\n", b);
  return 0;
}
`,
  cpp: `#include <iostream>
using namespace std;
int main() {
  string a, b;
  cin >> a >> b;
  cout << a << endl;
  cout << b << endl;
  return 0;
}
`,
};

const getLanguageName = (id: number): string => {
  const reverseMap = Object.entries(languageMap).reduce((acc, [k, v]) => {
    acc[v] = k;
    return acc;
  }, {} as Record<number, string>);
  return reverseMap[id] || 'python';
};

const getLanguageId = (language: string): number => {
  return languageMap[language.toLowerCase()] || 71;
};

const CodingRound: React.FC<CodingRoundProps> = ({ roleId, onComplete }) => {
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('problem');
  const [languageId, setLanguageId] = useState(71);

  const [totalPassedTests, setTotalPassedTests] = useState(0);
  const [totalTestCases, setTotalTestCases] = useState(0);

  useEffect(() => {
    const allProblems = getCodingProblems(roleId);
    setProblems(allProblems.slice(0, 2));
    if (allProblems.length > 0) {
      const defaultLang = allProblems[0].language?.[0] || 'python';
      const langId = getLanguageId(defaultLang);
      setLanguageId(langId);
      setCode(boilerplates[defaultLang] || '');
    }
  }, [roleId]);

  const currentProblem = problems[currentIndex];

  const executeCode = async (input: any) => {
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: Array.isArray(input) ? input.join('\n') : String(input),
      })
    };

    try {
      const submissionResponse = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`, options);
      const submissionData = await submissionResponse.json();

      if (!submissionData.token) throw new Error('No token received');

      let result;
      let retries = 0;
      const maxRetries = 10;
      const delay = 1000;

      while (retries < maxRetries) {
        const resultResponse = await fetch(`${JUDGE0_API_URL}/submissions/${submissionData.token}?base64_encoded=false`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': JUDGE0_API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        });
        result = await resultResponse.json();
        if (result.status?.id > 2) break;
        await new Promise(res => setTimeout(res, delay));
        retries++;
      }

      return {
        output: result.stdout || result.stderr || result.compile_output || 'No output',
        passed: result.status?.id === 3,
      };
    } catch (err) {
      return {
        output: 'Error executing code',
        passed: false
      };
    }
  };

  const runCode = async () => {
    if (!currentProblem) return;
    setIsRunning(true);
    setResults([]);

    try {
      const executionResults: Result[] = [];

      for (let i = 0; i < currentProblem.input.length; i++) {
        const input = currentProblem.input[i];
        const expected = currentProblem.expected_output[i];

        const result = await executeCode(input);
        const trimmedOutput = result.output.trim();
        const trimmedExpected = expected.toString().trim();

        executionResults.push({
          input: JSON.stringify(input),
          expectedOutput: trimmedExpected,
          output: trimmedOutput,
          passed: trimmedOutput === trimmedExpected
        });
      }

      setResults(executionResults);
    } catch (error) {
      setResults([{
        input: 'All',
        expectedOutput: 'N/A',
        output: 'Error executing code',
        passed: false
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const submitSolution = () => {
    if (!currentProblem || results.length === 0) return;
    setIsSubmitting(true);

    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;

    const updatedPassed = totalPassedTests + passedTests;
    const updatedTotal = totalTestCases + totalTests;

    setTotalPassedTests(updatedPassed);
    setTotalTestCases(updatedTotal);

    if (currentIndex >= problems.length - 1) {
      const finalScore = Math.round((updatedPassed / updatedTotal) * 100);

      const feedback = {
        score: finalScore,
        passedTests: updatedPassed,
        totalTests: updatedTotal,
        strengths: updatedPassed === updatedTotal ? ['All test cases passed'] :
          updatedPassed > updatedTotal / 2 ? ['Most test cases passed'] :
          ['Some test cases passed'],
        improvements: updatedPassed === 0 ? ['Review the problem statements'] :
          updatedPassed < updatedTotal / 2 ? ['Check edge cases', 'Review logic'] :
          ['Optimize your solution'],
        feedback: `You passed ${updatedPassed} out of ${updatedTotal} test cases.`,
      };

      onComplete(feedback);
    } else {
      const nextProblem = problems[currentIndex + 1];
      const nextLang = nextProblem.language?.[0] || 'python';
      const nextLangId = getLanguageId(nextLang);

      setCurrentIndex(currentIndex + 1);
      setResults([]);
      setLanguageId(nextLangId);
      setCode(boilerplates[nextLang] || '');
      setActiveTab('problem');
    }

    setIsSubmitting(false);
  };

  if (!currentProblem) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-blue-500 rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading coding problems...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex border-b">
        {['problem', 'solution', 'results'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="h-[500px]">
        {activeTab === 'problem' && (
          <div className="p-6 overflow-y-auto h-full">
            <h2 className="text-xl font-bold">{currentProblem.question}</h2>
            <div className="mt-4">
              <h4 className="text-sm font-semibold">Inputs:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm">
                {JSON.stringify(currentProblem.input, null, 2)}
              </pre>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold">Expected Outputs:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm">
                {JSON.stringify(currentProblem.expected_output, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'solution' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-100">
              <label className="text-sm font-medium text-gray-700">Language:</label>
              <select
                value={languageId}
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value);
                  setLanguageId(selectedId);
                  const langName = getLanguageName(selectedId);
                  setCode(boilerplates[langName] || '');
                }}
                className="ml-2 px-2 py-1 border rounded"
              >
                <option value={71}>Python</option>
                <option value={63}>JavaScript</option>
                <option value={62}>Java</option>
                <option value={50}>C</option>
                <option value={54}>C++</option>
              </select>
            </div>
            <div className="flex-grow">
              <Editor
                height="100%"
                defaultLanguage={getLanguageName(languageId)}
                language={getLanguageName(languageId)}
                theme="vs-dark"
                value={code}
                onChange={(value: string | undefined) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                }}
              />
            </div>
            <div className="p-4 flex justify-between bg-gray-50 border-t">
              <span className="text-sm text-gray-500">
                {isRunning ? 'Running code...' : 'Ready'}
              </span>
              <div className="flex gap-3">
                <Button onClick={runCode} disabled={isRunning || !code.trim()}>
                  {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Run
                </Button>
                <Button 
                  onClick={submitSolution} 
                  disabled={isSubmitting || results.length === 0}
                  variant={results.some(r => !r.passed) ? 'warning' : 'default'}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="p-6 overflow-y-auto h-full">
            <h3 className="font-medium mb-4">Test Results</h3>
            {results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {isRunning ? 'Running tests...' : 'No test results yet. Run your code to see results.'}
              </div>
            ) : (
              <>
                {results.map((res, idx) => (
                  <div
                    key={idx}
                    className={`p-4 mb-3 rounded border ${
                      res.passed ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      {res.passed ? (
                        <CheckCircle2 className="text-green-600 mr-2" />
                      ) : (
                        <XCircle className="text-red-600 mr-2" />
                      )}
                      <strong>Test {idx + 1}</strong>
                    </div>
                    <div className="text-sm">
                      <div><strong>Input:</strong> <pre className="inline">{res.input}</pre></div>
                      <div><strong>Expected:</strong> <pre className="inline">{res.expectedOutput}</pre></div>
                      <div><strong>Output:</strong> <pre className={`inline ${res.passed ? 'text-green-600' : 'text-red-600'}`}>{res.output}</pre></div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                  <div className="font-medium">Summary:</div>
                  <div>
                    Passed {results.filter(r => r.passed).length} out of {results.length} tests
                    ({Math.round((results.filter(r => r.passed).length / results.length) * 100)}%)
                  </div>
                </div>
                <div className="mt-6 text-right">
                  <Button 
                    onClick={submitSolution} 
                    disabled={isSubmitting}
                    variant={results.some(r => !r.passed) ? 'warning' : 'default'}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Solution'}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingRound;
