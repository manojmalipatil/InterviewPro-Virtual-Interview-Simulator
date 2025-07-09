declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
};

import React, { useState, useEffect } from 'react';
import { Save, Mic, MicOff } from 'lucide-react';
import Button from '../Button';
import { getSystemDesignProblems } from '../../data/questions';

interface SystemDesignRoundProps {
  roleId: string;
  onComplete: (results: any) => void;
}

const SystemDesignRound: React.FC<SystemDesignRoundProps> = ({ roleId, onComplete }) => {
  const [question, setQuestion] = useState<any | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recognition, setRecognition] = useState<any | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const problems = getSystemDesignProblems(roleId);
    const shuffled = problems.sort(() => 0.5 - Math.random());
    setQuestion(shuffled[0]);
  }, [roleId]);

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;

    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = false;
    recog.lang = 'en-US';

    recog.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((res) => res[0].transcript)
        .join(' ');
      setAnswer((prev) => prev + transcript + ' ');
    };

    recog.onend = () => {
      setIsListening(false);
    };

    setRecognition(recog);
    setIsListening(true);
    recog.start();
  };

  const handleSubmit = async () => {
    if (answer.trim().length < 100) {
      console.log("Submission blocked: Answer too short");
      return;
    }

    setIsSubmitting(true);

    try {
    const response = await fetch("http://localhost:8000/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questions: [question.question],
        answers: [answer],
      }),
    });

    const result = await response.json();
    console.log("Received score result:", result);

    // Pass the feedback object directly from backend
    const feedback = result[0]; // Assuming one question
    onComplete(feedback);
  } catch (error) {
    console.error("Error submitting answers to scoring API:", error);
  }

  setIsSubmitting(false);
};  

  if (!question) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading system design question...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Question: {question.question}
        </h2>

        <textarea
          rows={8}
          className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Speak or type your system design answer here..."
        />

        <div className="flex items-center gap-4">
          <Button type="button" onClick={toggleListening}>
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 mr-1" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-1" />
                Start Speaking
              </>
            )}
          </Button>

          <span className="text-sm text-gray-500">
            {isListening ? 'Listening...' : 'Click mic to use voice input'}
          </span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || answer.trim().length < 100}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Design'}
        </Button>
      </div>

      {isSubmitting && (
        <div className="text-center mt-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Evaluating your system design...</p>
        </div>
      )}
    </div>
  );
};

export default SystemDesignRound;

