import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, Download, RefreshCcw, CheckCircle, XCircle } from 'lucide-react';
import Button from '../components/Button';
import { useInterviewContext } from '../context/InterviewContext';
import { getRole } from '../data/roles';
import RoundSummary from '../components/RoundSummary';
import { jsPDF } from 'jspdf';
import logoBase64 from '../assets/logoBase64.ts'; // Optional: Base64 image


const FinalSummary = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const { state } = useInterviewContext();
  const role = getRole(roleId || '');
  
  const interviewResults = state.results[roleId || ''] || {};
  
  useEffect(() => {
    if (!role) {
      navigate('/role-selection');
    }
    
    // Check if the user has completed at least one round
    const hasCompletedAnyRound = Object.keys(interviewResults).length > 0;
    if (!hasCompletedAnyRound) {
      navigate(`/interview/${roleId}/1`);
    }
  }, [role, interviewResults, navigate, roleId]);

  if (!role) return null;

  const calculateOverallScore = () => {
  const roundKeys = Object.keys(interviewResults);
  console.log('🔍 interviewResults:', interviewResults);
  console.log('📦 roundKeys (completed rounds):', roundKeys);

  if (roundKeys.length === 0) {
    console.log('⚠️ No completed rounds. Returning score 0.');
    return 0;
  }

  const total = Object.values(interviewResults).reduce((sum: number, round: any, index) => {
    const roundNum = roundKeys[index];
    const roundScore = Number(round?.score || 0);
    console.log(`➡️ Round ${roundNum}: score =`, roundScore);
    return sum + roundScore;
  }, 0);

  const average = total / roundKeys.length;
  console.log('🧮 Total Score:', total);
  console.log('📊 Average Score (out of completed rounds):', average);

  return average;
};



  const overallScore = calculateOverallScore();
  
  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };


const downloadReport = (
  rounds: {
    roundId: number;
    roundName: string;
    data: {
      score: number;
      strengths: string[];
      improvements: string[];
      feedback: string;
    };
  }[]
) => {
  const doc = new jsPDF();
  
  // Professional color palette
  const primaryColor = [46, 134, 193]; // Soft blue
  const secondaryColor = [88, 179, 104]; // Soft green
  const accentColor = [231, 76, 60]; // Soft red
  const darkColor = [51, 51, 51]; // Dark gray
  const lightColor = [245, 245, 245]; // Off-white
  const textColor = [68, 68, 68]; // Dark gray for text
  
  let y = 30;

  const addFooter = () => {
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    const pageNum = doc.internal.pages.length;
    doc.text(`Generated by InterviewPro | ${new Date().toLocaleDateString()} | Page ${pageNum}`, 105, 290, { align: 'center' });
  };

  const averageScore = overallScore;
  const roleName = role.title;

  // Header with soft gradient effect
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 70, 'F');
  
  // Logo (white if background is dark)
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', 150, 20, 40, 15);
  }

  // Title with white text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('FINAL INTERVIEW REPORT', 20, 40);
  
  // Role name
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`For: ${roleName}`, 20, 50);
  
  y = 80;

  // Overall Score Card
  doc.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
  doc.roundedRect(20, y, 170, 40, 5, 5, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(20, y, 170, 40, 5, 5, 'S');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Overall Performance', 30, y + 15);
  
  // Dynamic score color
  const scoreColor = averageScore >= 70 ? secondaryColor : 
                    averageScore >= 40 ? [255, 159, 67] : // orange
                    accentColor;
  
  doc.setFontSize(24);
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.text(`${averageScore}%`, 150, y + 15, { align: 'right' });
  
  doc.setFontSize(12);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(`(${getScoreLabel(averageScore)})`, 150, y + 25, { align: 'right' });
  
  y += 50;

  // Summary section
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  const summaryLines = doc.splitTextToSize('Below is a detailed breakdown of your performance across all interview rounds, including feedback, strengths, and areas for improvement.', 170);
  doc.text(summaryLines, 20, y);
  y += summaryLines.length * 6 + 20;

  // Round Details
  rounds.forEach(({ roundId, roundName, data }) => {
    if (y > 250) {
      addFooter();
      doc.addPage();
      y = 30;
    }

    // Round header
    doc.setFillColor(240, 248, 255); // Very light blue
    doc.roundedRect(20, y, 170, 15, 3, 3, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(20, y, 170, 15, 3, 3, 'S');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(`Round ${roundId}: ${roundName}`, 25, y + 10);
    y += 20;

    // Score
    const roundScoreColor = data.score >= 70 ? secondaryColor : 
                          data.score >= 40 ? [255, 159, 67] : 
                          accentColor;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(roundScoreColor[0], roundScoreColor[1], roundScoreColor[2]);
    doc.text(`Score: ${data.score}% (${getScoreLabel(data.score)})`, 20, y);
    y += 10;

    // Feedback section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text('Feedback Summary', 20, y);
    y += 8;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    const feedbackLines = doc.splitTextToSize(data.feedback, 170);
    doc.text(feedbackLines, 25, y);
    y += feedbackLines.length * 6 + 15;

    // Strengths section
    doc.setFillColor(240, 255, 240); // Very light green
    doc.roundedRect(20, y, 170, 15, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('Strengths', 25, y + 10);
    y += 20;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    data.strengths.forEach((point) => {
      const lines = doc.splitTextToSize(`• ${point}`, 160);
      doc.text(lines, 25, y);
      y += lines.length * 6 + 2;
    });
    y += 8;

    // Improvements section
    doc.setFillColor(255, 240, 240); // Very light red
    doc.roundedRect(20, y, 170, 15, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text('Areas for Improvement', 25, y + 10);
    y += 20;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    data.improvements.forEach((point) => {
      const lines = doc.splitTextToSize(`• ${point}`, 160);
      doc.text(lines, 25, y);
      y += lines.length * 6 + 2;
    });

    // Round separator
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(20, y + 10, 190, y + 10);
    y += 20;
  });

  addFooter();
  doc.save(`Interview_Report_${roleName.replace(/\s+/g, '_')}.pdf`);
};



  const restartInterview = () => {
    navigate(`/interview/${roleId}/1`);
  };

  const roundNames = [
    'HR & Behavioral',
    'Technical Q&A',
    'Coding Challenge',
    'System Design'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Interview Summary</h1>
        <Button variant="ghost" onClick={() => navigate('/')}>
          <Home className="w-5 h-5 mr-2" />
          Home
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{role.title}</h2>
            <p className="text-gray-600">
              {role.category} • {Object.keys(interviewResults).length} of 4 rounds completed
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center">
              <div className="text-xl font-bold mr-2">
                {Math.round(overallScore)}%
              </div>
              <div className={`text-sm ${overallScore >= 70 ? 'text-green-600' : overallScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {getScoreLabel(overallScore)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[1, 2, 3, 4].map(roundNum => {
            const roundId = roundNum.toString();
            const roundData = interviewResults[roundId];
            const isCompleted = !!roundData;
            
            return (
              <div 
                key={roundId} 
                className={`border rounded-lg p-4 flex items-center justify-between ${isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center">
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400 mr-3" />
                  )}
                  <div>
                    <div className="font-medium text-gray-800">Round {roundNum}: {roundNames[roundNum-1]}</div>
                    {isCompleted && (
                      <div className="text-sm text-gray-600">Score: {roundData.score}%</div>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant={isCompleted ? "ghost" : "default"} 
                  size="sm"
                  onClick={() => navigate(`/interview/${roleId}/${roundNum}`)}
                >
                  {isCompleted ? 'Retry' : 'Start'}
                </Button>
              </div>
            );
          })}
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button
  onClick={() =>
    downloadReport(
      Object.entries(interviewResults).map(([roundId, data]) => ({
        roundId: parseInt(roundId),
        roundName: roundNames[parseInt(roundId) - 1] || `Round ${roundId}`,
        data,
      }))
    )
  }
  className="flex-1"
>
            <Download className="w-5 h-5 mr-2" />
            Download Full Report
          </Button>
          <Button variant="outline" onClick={restartInterview} className="flex-1">
            <RefreshCcw className="w-5 h-5 mr-2" />
            Restart Interview
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(interviewResults).map(([roundId, data]: [string, any]) => (
          <RoundSummary 
            key={roundId} 
            roundId={parseInt(roundId)} 
            data={data} 
            roundName={roundNames[parseInt(roundId)-1]} 
          />
        ))}
      </div>
    </div>
  );
};

export default FinalSummary;