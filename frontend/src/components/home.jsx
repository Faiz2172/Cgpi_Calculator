import React, { useState } from 'react';
import { Calculator, Heart, GraduationCap, Percent } from 'lucide-react';

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState(
    Array(8).fill().map((_, i) => ({
      id: i + 1,
      score: '',
      credit: '',
    }))
  );
  
  const [cgpa, setCgpa] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showPercentage, setShowPercentage] = useState(false);

  // Add custom CSS to completely hide number input spinners
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      input[type="number"]::-webkit-outer-spin-button,
      input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleInputChange = (id, field, value) => {
    // Only update if the value is a valid number or empty string
    if (value === '' || !isNaN(value)) {
      setSemesters(prev => prev.map(sem => 
        sem.id === id ? { ...sem, [field]: value } : sem
      ));
      setShowResult(false);
      setShowPercentage(false);
    }
  };

  const calculateCGPA = () => {
    const validSemesters = semesters.filter(sem => 
      sem.score !== '' && sem.credit !== '' && 
      !isNaN(sem.score) && !isNaN(sem.credit) && 
      parseFloat(sem.credit) > 0
    );

    if (validSemesters.length === 0) {
      alert('Please enter at least one valid score and credit value.');
      return;
    }

    const totalGradePoints = validSemesters.reduce(
      (sum, sem) => sum + parseFloat(sem.score), 0
    );
    const totalCredits = validSemesters.reduce(
      (sum, sem) => sum + parseFloat(sem.credit), 0
    );

    const calculatedCGPA = totalGradePoints / totalCredits;
    setCgpa(calculatedCGPA.toFixed(3));
    setShowResult(true);
  };

  const calculatePercentage = () => {
    if (!cgpa) {
      alert('Please calculate CGPA first.');
      return;
    }

    const cgpi = parseFloat(cgpa);
    const calculatedPercentage = cgpi < 7 
      ? (7.1 * cgpi + 12).toFixed(2) 
      : (7.4 * cgpi + 12).toFixed(2);

    setPercentage(calculatedPercentage);
    setShowPercentage(true);
  };

  const clearAll = () => {
    setSemesters(prev => prev.map(sem => ({ ...sem, score: '', credit: '' })));
    setCgpa(null);
    setPercentage(null);
    setShowResult(false);
    setShowPercentage(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-blue-800">CGPA Calculator</h1>
          </div>
          <p className="text-blue-600 text-sm">Calculate your Cumulative Grade Point Average</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 mb-6">
          {/* Input Section */}
          <div className="space-y-4 md:space-y-6">
            <div className="text-center">
              <h2 className="text-lg md:text-xl font-semibold text-blue-800 mb-2">Enter Your Semester Details</h2>
              <p className="text-gray-600 text-sm">Fill in the scores and credits for each semester (optional)</p>
            </div>

            <div className="grid gap-3 md:gap-4">
              {semesters.map((semester) => (
                <div 
                  key={semester.id}
                  className="bg-blue-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-blue-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <h3 className="text-sm md:text-base font-semibold text-blue-800">Semester {semester.id}</h3>
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">{semester.id}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-blue-700 mb-1">
                        C*G Score
                        <span 
                          className="ml-1 text-blue-500 cursor-help"
                          title="Sum of (Credit × Grade Point) for all subjects"
                        >
                          (?)
                        </span>
                      </label>
                      <input
                        type="text"  // Changed from "number" to "text"
                        inputMode="numeric"  // Shows numeric keyboard on mobile
                        pattern="[0-9]*"  // Helps with numeric input validation
                        placeholder="e.g., 210"
                        className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 text-sm md:text-base"
                        value={semester.score}
                        onChange={(e) => handleInputChange(semester.id, 'score', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-blue-700 mb-1">
                        Credits
                        <span 
                          className="ml-1 text-blue-500 cursor-help"
                          title="Total credits for the semester"
                        >
                          (?)
                        </span>
                      </label>
                      <input
                        type="text"  // Changed from "number" to "text"
                        inputMode="numeric"  // Shows numeric keyboard on mobile
                        pattern="[0-9]*"  // Helps with numeric input validation
                        placeholder="e.g., 18"
                        className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 text-sm md:text-base"
                        value={semester.credit}
                        onChange={(e) => handleInputChange(semester.id, 'credit', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-6 md:mt-8">
            <button
              onClick={calculateCGPA}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <Calculator className="w-4 h-4 md:w-5 md:h-5" />
              Calculate CGPA
            </button>

            <button
              onClick={calculatePercentage}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <Percent className="w-4 h-4 md:w-5 md:h-5" />
              Calculate Percentage
            </button>
            
            <button
              onClick={clearAll}
              className="px-4 md:px-6 py-3 md:py-4 border-2 border-blue-300 text-blue-600 rounded-xl md:rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-200"
            >
              Clear All
            </button>
          </div>

          {/* Results */}
          <div className="mt-6 space-y-4">
            {showResult && cgpa && (
              <div className="p-4 md:p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl md:rounded-2xl text-white text-center animate-pulse">
                <h3 className="text-base md:text-lg font-semibold mb-2">Your CGPA</h3>
                <div className="text-3xl md:text-4xl font-bold mb-2">{cgpa}</div>
                <p className="text-blue-100 text-sm">
                  {parseFloat(cgpa) >= 8.0 ? '🏆 Outstanding Performance!' : 
                   parseFloat(cgpa) >= 7.0 ? '🎉 Excellent Performance!' : 
                   parseFloat(cgpa) >= 6.0 ? '👍 Good Performance!' : 
                   parseFloat(cgpa) >= 5.0 ? '📈 Keep Improving!' : 
                   '💪 You Can Do Better!'}
                </p>
              </div>
            )}

            {showPercentage && percentage && (
              <div className="p-4 md:p-6 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl md:rounded-2xl text-white text-center animate-pulse">
                <h3 className="text-base md:text-lg font-semibold mb-2">Equivalent Percentage</h3>
                <div className="text-3xl md:text-4xl font-bold mb-2">{percentage}%</div>
                <p className="text-blue-100 text-sm">
                  {parseFloat(percentage) >= 85 ? '🌟 Exceptional!' : 
                   parseFloat(percentage) >= 75 ? '✨ Outstanding!' : 
                   parseFloat(percentage) >= 65 ? '👍 Very Good!' : 
                   parseFloat(percentage) >= 55 ? '📚 Good!' : 
                   '🔥 Keep Working Hard!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 md:py-6">
          <p className="text-blue-600 font-medium flex items-center justify-center gap-2 text-sm md:text-base">
            Built with <Heart className="w-4 h-4 text-blue-500 fill-current animate-pulse" /> by FAIZ
          </p>
        </div>
      </div>
    </div>
  );
}