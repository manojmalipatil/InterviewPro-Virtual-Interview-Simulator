import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Briefcase, Code, MessageSquare, PenTool } from 'lucide-react';
import Button from '../components/Button';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-600 text-transparent bg-clip-text mb-4">
          Virtual Interview Simulator
        </h1>
        <p className="text-lg md:text-xl text-gray-700">
          AI-powered platform to help you master interviews with real-time feedback and role-specific challenges.
        </p>
      </div>

      {/* Interview Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
        {[
          {
            title: 'HR & Behavioral',
            desc: 'Practice answering common behavioral questions and showcase your soft skills.',
            icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
            bg: 'from-blue-100 to-blue-200',
          },
          {
            title: 'Technical Q&A',
            desc: 'Test your knowledge with technical questions specific to your role.',
            icon: <Briefcase className="w-6 h-6 text-green-600" />,
            bg: 'from-green-100 to-green-200',
          },
          {
            title: 'Coding Challenge',
            desc: 'Solve coding problems in a real-time editor with execution and feedback.',
            icon: <Code className="w-6 h-6 text-purple-600" />,
            bg: 'from-purple-100 to-purple-200',
          },
          {
            title: 'System Design',
            desc: 'Demonstrate your architectural thinking and problem-solving abilities.',
            icon: <PenTool className="w-6 h-6 text-orange-600" />,
            bg: 'from-orange-100 to-orange-200',
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${card.bg} p-6 rounded-2xl shadow-md backdrop-blur-md hover:shadow-xl transition duration-300`}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-white p-3 rounded-full shadow-sm">{card.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
            </div>
            <p className="text-gray-600 text-sm">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="max-w-md mx-auto mb-20">
        <Link to="/role-selection">
          <Button className="w-full py-4 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-indigo-600 hover:to-purple-600 transition group">
            Start Your Interview
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* How It Works Section */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            'Select your desired role for a tailored interview experience',
            'Complete each interview round, from behavioral to technical',
            'Get instant feedback and scoring on your performance',
            'Review your comprehensive results and areas for improvement',
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center mb-3">
                {index + 1}
              </div>
              <p className="text-gray-700 text-sm">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
