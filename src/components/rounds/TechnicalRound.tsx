import React, { useState, useEffect, useRef } from 'react';
import { Clock, Mic, MicOff } from 'lucide-react';
import Button from '../Button';
import { getTechnicalQuestions } from '../../data/questions';

interface Question {
  id: number;
  question: string;
  ideal_answer: string;
  keywords: string[];
}

interface TechnicalRoundProps {
  roleId: string;
  onComplete: (results: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
};

const MAX_QUESTIONS = 8;
const MAX_TIME = 300;

const TechnicalRound: React.FC<TechnicalRoundProps> = ({ roleId, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [scores, setScores] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recognition, setRecognition] = useState<any | null>(null);
  const [isListening, setIsListening] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadedQuestions = getTechnicalQuestions(roleId).slice(0, MAX_QUESTIONS);
    setQuestions(loadedQuestions);
    console.log('Loaded technical questions:', loadedQuestions);
  }, [roleId]);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      console.log('Timer expired, auto-submitting answer');
      handleSubmitAnswer();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isTimerRunning]);

  const startTimer = () => {
    console.log('Timer started');
    setIsTimerRunning(true);
    textareaRef.current?.focus();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;

    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
      console.log('Stopped speech recognition');
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
        .join('');
      console.log('Speech recognized:', transcript);
      setAnswer((prev) => prev + transcript + ' ');
    };

    recog.onend = () => {
      setIsListening(false);
      console.log('Speech recognition ended');
    };

    setRecognition(recog);
    setIsListening(true);
    recog.start();
    console.log('Started speech recognition');
  };

  const handleSubmitAnswer = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsTimerRunning(false);

    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }

    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = answer.trim();
    console.log(`Submitting answer for Question ${currentQuestionIndex + 1}:`, userAnswer);

    try {
      const res = await fetch('http://localhost:8000/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_answer: userAnswer,
          ideal_answer: currentQuestion.ideal_answer,
          keywords: currentQuestion.keywords,
        }),
      });

      const { score } = await res.json();
      console.log(`Received score: ${score}`);

      const updatedScores = [...scores];
      updatedScores[currentQuestionIndex] = score;
      setScores(updatedScores);

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setAnswer('');
          setTimeLeft(MAX_TIME);
          setIsSubmitting(false);
        } else {
          const totalScore = updatedScores.reduce((sum, val) => sum + val, 0);
          const outOf = updatedScores.length * 5;
          const percent = ((totalScore / outOf) * 100).toFixed(1);
          console.log('Technical round complete:', { totalScore, outOf, percent });

          let strengths: string[] = [];
let improvements: string[] = [];
let feedback = '';

const percentValue = parseFloat(percent);

if (percentValue >= 90) {
  strengths = [
    'Exceptional articulation of ideas',
    'Depth in technical explanation',
    'Well-structured responses',
    'Clear scalability reasoning',
  ];
  improvements = [
    'Mention alternatives where relevant',
    'Include specific tools or frameworks',
    'Discuss trade-offs explicitly',
    'Support with industry examples',
  ];
  feedback =
    'Fantastic work! Your responses were precise, well-structured, and showed great depth of understanding. You effectively addressed problem-solving, trade-offs, and design elements. To go even further, try citing real-world tools or alternate approaches. You’re well-prepared for high-stakes technical interviews and leadership discussions.';
} else if (percentValue >= 80) {
  strengths = [
    'Strong technical foundation',
    'Clear logical flow',
    'Good example usage',
    'Confident explanation style',
  ];
  improvements = [
    'Clarify assumptions early',
    'Strengthen performance considerations',
    'Detail edge case handling',
    'Include brief architectural diagrams if possible',
  ];
  feedback =
    'Great job! Your answers consistently reflected strong technical understanding. You used real-world examples effectively and maintained a confident flow. To further refine your approach, emphasize clarity in assumptions and deepen system-level details. You’re nearly at the expert level—just polish your presentation.';
} else if (percentValue >= 70) {
  strengths = [
    'Good grasp of key concepts',
    'Logical structuring of ideas',
    'Effort to address core topics',
    'Some real-world connections made',
  ];
  improvements = [
    'Avoid surface-level statements',
    'Explain choices more deeply',
    'Highlight pros/cons of decisions',
    'Use consistent technical vocabulary',
  ];
  feedback =
    'Solid performance. You show a clear grasp of the fundamentals and structure your answers well. To push further, deepen your reasoning, justify your decisions clearly, and connect responses to practical systems. You’re close to strong interview readiness.';
} else if (percentValue >= 60) {
  strengths = [
    'Basic structure in responses',
    'Attempted to reason logically',
    'Covered fundamental points',
    'Tried applying concepts practically',
  ];
  improvements = [
    'Use more examples and analogies',
    'Improve clarity and fluency',
    'Reduce vagueness in answers',
    'Reinforce concepts with diagrams or visuals',
  ];
  feedback =
    'You’re on the right track. While your answers included many key ideas, they lacked precision and technical fluency. Improving clarity, adding structured reasoning, and reviewing core design patterns will boost your technical narrative significantly.';
} else if (percentValue >= 50) {
  strengths = [
    'Attempted relevant responses',
    'Basic understanding of concepts',
    'Some technical terms used correctly',
    'Demonstrated willingness to explain',
  ];
  improvements = [
    'Avoid repeating vague points',
    'Add system-level structure',
    'Justify answers with reasoning',
    'Review design basics more thoroughly',
  ];
  feedback =
    'Fair effort. You seem to understand some of the basics but lacked depth and clarity. Focus on improving answer structure, practicing with common patterns, and using mock questions to organize your thoughts clearly. You’re improving—keep going.';
} else if (percentValue >= 40) {
  strengths = [
    'Recognized some key concepts',
    'Tried to stay on topic',
    'Effort evident throughout',
    'Used a few correct terms',
  ];
  improvements = [
    'Clarify what each component does',
    'Structure answers from high to low level',
    'Stop when unsure to avoid rambling',
    'Use consistent terminology',
  ];
  feedback =
    'There’s clear effort in your responses, and you’ve picked up some concepts. However, many answers lack structure and correctness. Focus on organizing answers using a top-down approach and review how real systems work. With practice, you can steadily improve.';
} else if (percentValue >= 30) {
  strengths = [
    'Participated fully',
    'Attempted each answer',
    'Occasionally on-topic',
    'Willingness to express ideas',
  ];
  improvements = [
    'Revise core system concepts',
    'Use examples instead of definitions',
    'Avoid filler phrases',
    'Structure responses logically',
  ];
  feedback =
    'Your responses show persistence but indicate a need to revisit key technical concepts. Try to understand component roles in systems and focus on explanation patterns like “What, Why, How.” Practicing these will greatly improve clarity and confidence.';
} else {
  strengths = [
    'Attempted to answer questions',
    'Stayed engaged throughout',
    'Showed basic enthusiasm',
    'Recognized familiar terms',
  ];
  improvements = [
    'Review foundational topics like DBs, APIs, etc.',
    'Avoid off-topic rambling',
    'Learn simple system design patterns',
    'Practice verbal explanation of known topics',
  ];
  feedback =
    'At this stage, its essential to go back to basics. Focus on understanding fundamental components of systems and how they interact. Work through beginner-level design problems and practice articulating them clearly. With time and effort, your responses will improve significantly.';
}

const Results = {
  score: percent,
  strengths,
  improvements,
  feedback,
};

        onComplete(Results);
        setIsSubmitting(false);
        }
      }, 1500);
    } catch (err) {
      console.error('Error evaluating answer:', err);
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin h-10 w-10 mx-auto border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
        <p className="text-gray-600">Loading questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-gray-500">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1 text-gray-600" />
          <span className={`text-sm font-medium ${timeLeft < 60 ? 'text-red-600' : 'text-gray-600'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-800 mb-4">{currentQuestion.question}</h3>

      {!isTimerRunning && timeLeft === MAX_TIME ? (
        <div className="text-center bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Ready to begin?</h3>
          <p className="text-gray-600 mb-4">You have 5 minutes to answer. Timer starts once you begin.</p>
          <Button onClick={startTimer}>Start Timer</Button>
        </div>
      ) : (
        <div className="mb-6">
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
            Your Answer:
          </label>
          <textarea
            ref={textareaRef}
            id="answer"
            rows={6}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none"
            placeholder="Type or speak your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isSubmitting || !isTimerRunning}
          />
          <div className="flex items-center gap-4 mt-2">
            <Button onClick={toggleListening} type="button" disabled={!isTimerRunning || isSubmitting}>
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
            {isListening && <span className="text-sm text-gray-500">Listening...</span>}
          </div>
        </div>
      )}

      {scores[currentQuestionIndex] !== undefined && !isSubmitting && (
        <p className="text-sm text-green-600 mb-4">Score: {scores[currentQuestionIndex]} / 5</p>
      )}

      {isTimerRunning && (
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitAnswer}
            disabled={answer.trim().length < 10 || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </Button>
        </div>
      )}

      {isSubmitting && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Saving your response...</p>
        </div>
      )}
    </div>
  );
};

export default TechnicalRound;
