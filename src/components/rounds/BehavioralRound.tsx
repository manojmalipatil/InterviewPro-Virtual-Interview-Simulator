import React, { useState, useEffect, useRef } from 'react';
import { Send, Clock, Volume2, Mic, MicOff } from 'lucide-react';
import Button from '../Button';
import { getBehavioralQuestions } from '../../data/questions';

interface BehavioralRoundProps {
  roleId: string;
  onComplete: (results: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type Question = {
  question: string;
  ideal_answer: string;
  keywords: string[];
};

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
};

const MAX_QUESTIONS = 5;

const BehavioralRound: React.FC<BehavioralRoundProps> = ({ roleId, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recognition, setRecognition] = useState<any | null>(null);
  const [isListening, setIsListening] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadedQuestions = getBehavioralQuestions(roleId).slice(0, MAX_QUESTIONS);
    setQuestions(loadedQuestions);
  }, [roleId]);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      handleSubmitAnswer();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isTimerRunning]);

  const startTimer = () => {
    setIsTimerRunning(true);
    if (textareaRef.current) textareaRef.current.focus();
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
      setAnswer((prev) => prev + transcript + ' ');
    };

    recog.onend = () => setIsListening(false);

    setRecognition(recog);
    setIsListening(true);
    recog.start();
  };

  const handleSubmitAnswer = async () => {
  if (isSubmitting) return;

  setIsSubmitting(true);
  setIsTimerRunning(false);

  if (recognition && isListening) {
    recognition.stop();
    setIsListening(false);
  }

  const updatedAnswers = [...answers];
  updatedAnswers[currentQuestionIndex] = answer.trim();
  setAnswers(updatedAnswers);

  const { ideal_answer, keywords } = questions[currentQuestionIndex];

  // 🔍 Log the values being sent to the backend
  console.log("📤 Sending to /evaluate", {
    user_answer: answer.trim(),
    ideal_answer,
    keywords,
  });

  try {
    const response = await fetch('http://localhost:8000/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_answer: answer.trim(),
        ideal_answer,
        keywords,
      }),
    });

    if (!response.ok) throw new Error('Evaluation failed');

    const data = await response.json(); // expects { score: number }

    // 📥 Log the received score
    console.log("✅ Score received from backend:", data.score);

    const updatedScores = [...scores];
    updatedScores[currentQuestionIndex] = data.score;
    setScores(updatedScores);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswer('');
      setTimeLeft(300);
      setIsSubmitting(false);
    } else {
      const totalScore = updatedScores.reduce((acc, s) => acc + s, 0);
      const maxScore = 5 * updatedScores.length;
      const percent = Math.round((totalScore / maxScore) * 100);


      let strengths: string[] = [];
      let improvements: string[] = [];
      let feedback = '';

      if (percent >= 90) {
        strengths = [
          'Outstanding self-awareness',
          'Clear articulation of behavioral traits',
          'Strong alignment with role expectations',
          'Structured storytelling using STAR format',
        ];
  improvements = [
    'Include more measurable impact',
    'Provide diverse examples across roles',
    'Avoid overly rehearsed tone',
    'Add more emotional intelligence cues',
  ];
  feedback =
    'Impressive! Your behavioral responses showcase clarity, structure, and strong alignment with professional values. You communicated your experience with precision and confidence. To refine further, try adding metrics or specific impact details. Overall, you’re well-prepared for top-tier behavioral interviews.';
} else if (percent >= 80) {
  strengths = [
    'Confident expression',
    'Well-structured STAR answers',
    'Relevant experiences shared',
    'Consistent tone and clarity',
  ];
  improvements = [
    'Add more context to situations',
    'Explain results more concretely',
    'Avoid redundancy across answers',
    'Highlight team impact more explicitly',
  ];
  feedback =
    'Great job! Your answers were coherent, well-structured, and relevant. You’ve clearly practiced and understand how to frame experiences. Focus now on making outcomes more measurable and highlighting team dynamics. This will elevate your performance further.';
} else if (percent >= 70) {
  strengths = [
    'Good awareness of behavioral expectations',
    'Clear attempt at STAR format',
    'Relevant life experiences used',
    'Effort toward structuring responses',
  ];
  improvements = [
    'Improve depth of action/results',
    'Elaborate on challenges overcome',
    'Avoid generic phrasing',
    'Clarify your unique contributions',
  ];
  feedback =
    'Solid foundation! You’re using the right structure and sharing relevant content. To level up, enrich your answers with more specific outcomes and highlight what made your role impactful. Try to go beyond surface-level examples where possible.';
} else if (percent >= 60) {
  strengths = [
    'Basic structure present',
    'Effort to answer every question',
    'Some use of STAR components',
    'Attempted relevance to role',
  ];
  improvements = [
    'Provide more concrete situations',
    'Use less vague language',
    'Clarify tasks and outcomes',
    'Avoid filler and repetition',
  ];
  feedback =
    'You’re making good progress. Your answers follow a recognizable structure, but need more precision and clarity. Consider reviewing strong STAR responses to understand what makes them stand out. Focus on being specific, and avoid vague generalizations.';
} else if (percent >= 50) {
  strengths = [
    'Willingness to engage all questions',
    'Some understanding of behavioral cues',
    'Mentioned personal or team experiences',
    'Basic clarity in delivery',
  ];
  improvements = [
    'Add structure (STAR)',
    'Support claims with examples',
    'Be more specific about outcomes',
    'Avoid overgeneralizing strengths',
  ];
  feedback =
    'You’re demonstrating potential, but many responses were either too general or lacked clear structure. Start using STAR consciously and focus on actions you took and the outcomes that followed. Practice writing and reviewing answers to commonly asked behavioral questions.';
} else if (percent >= 40) {
  strengths = [
    'Engaged actively throughout',
    'Mentioned soft skills',
    'Some relevant scenarios shared',
    'Tried to reflect on experiences',
  ];
  improvements = [
    'Avoid tangents or unrelated stories',
    'Use a logical sequence',
    'Improve delivery confidence',
    'Be more outcome-focused',
  ];
  feedback =
    'There’s clear effort, and you show interest in communicating honestly. However, many answers felt unstructured or lacked clear direction. Begin practicing behavioral formats and think of clear examples that show growth, teamwork, or leadership. You’re on the right path—keep building!';
} else if (percent >= 30) {
  strengths = [
    'Completed all responses',
    'Recognized behavioral cues',
    'Mentioned some role-relevant terms',
    'Attempted self-expression',
  ];
  improvements = [
    'Improve fluency and clarity',
    'Avoid repeating the same points',
    'Use concrete examples, not theory',
    'Highlight your thought process clearly',
  ];
  feedback =
    'You are making an honest effort, which is valuable. Focus on identifying clear experiences that show your adaptability or problem-solving in real situations. Practice with a peer or mentor for feedback. Keep working on expressing ideas in a structured way.';
} else {
  strengths = [
    'Made an effort to respond',
    'Stayed engaged through all questions',
    'Tried to express opinions',
    'Displayed basic understanding of soft skills',
  ];
  improvements = [
    'Review what behavioral interviews test',
    'Learn and apply STAR method',
    'Avoid filler or vague responses',
    'Use relevant personal stories',
  ];
  feedback =
    'Your answers need significant improvement. Start by understanding what interviewers look for—self-awareness, communication, and alignment with role values. Practice framing clear, structured answers using real situations. Watching sample responses online and practicing aloud can be helpful. Don’t give up!';
}

onComplete({
  score: percent,
  strengths,
  improvements,
  feedback,
});
 
        setIsSubmitting(false);
      

    }
  } catch (error) {
    console.error('❌ Submission error:', error);
    alert('There was an error submitting your answer. Please try again.');
    setIsSubmitting(false);
  }
};


  if (questions.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-center mt-4 text-gray-600">Loading questions...</p>
      </div>
    );
  }

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

      <div className="mb-6">
        <div className="flex items-start mb-2">
          <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
            <Volume2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="bg-blue-50 rounded-lg p-4 rounded-tl-none flex-grow">
            <p className="text-gray-800 text-lg">{questions[currentQuestionIndex].question}</p>
          </div>
        </div>
      </div>

      {!isTimerRunning && timeLeft === 300 ? (
        <div className="text-center mb-6 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Ready to answer this question?</h3>
          <p className="text-gray-600 mb-4">
            You'll have 5 minutes to provide your response. The timer will start when you click the button below.
          </p>
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
          <div className="text-xs text-gray-500 mt-2">
            Pro tip: Use the STAR method (Situation, Task, Action, Result) to structure your answer.
          </div>
        </div>
      )}

      {isTimerRunning && (
        <div className="flex justify-end">
          <Button onClick={handleSubmitAnswer} disabled={answer.trim().length < 10 || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            {!isSubmitting && <Send className="ml-2 w-4 h-4" />}
          </Button>
        </div>
      )}

      {isSubmitting && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Analyzing your response...</p>
        </div>
      )}
    </div>
  );
};

export default BehavioralRound;
