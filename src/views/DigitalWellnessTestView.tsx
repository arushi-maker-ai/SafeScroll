import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Award,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  HeartPulse,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

interface Question {
  id: number;
  text: string;
  category: string;
  options: { label: string; points: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'How soon after waking up does your child check social media or notifications?',
    category: 'Morning Dopamine Spike',
    options: [
      { label: 'Within 5 minutes of waking up', points: 20 },
      { label: 'Within 30 minutes, before breakfast', points: 12 },
      { label: 'Only after getting dressed / ready for school', points: 5 },
      { label: 'No morning phone access (screen-free mornings)', points: 0 },
    ],
  },
  {
    id: 2,
    text: 'Does your child experience irritability or anxiety when phone access is restricted?',
    category: 'Withdrawal & Dependency',
    options: [
      { label: 'Frequently — leads to arguments and distress', points: 20 },
      { label: 'Occasionally — asks for it back repeatedly', points: 12 },
      { label: 'Rarely — easily transitions to offline hobbies', points: 5 },
      { label: 'Never — content with device boundaries', points: 0 },
    ],
  },
  {
    id: 3,
    text: 'Where does the smartphone / tablet stay during bedtime (after 9:30 PM)?',
    category: 'Sleep Architecture',
    options: [
      { label: 'In the bed / under the pillow with notifications on', points: 20 },
      { label: 'On the bedroom nightstand / desk', points: 14 },
      { label: 'In bedroom but put on Do Not Disturb / Sleep Mode', points: 8 },
      { label: 'Docked in family charging station outside the bedroom', points: 0 },
    ],
  },
  {
    id: 4,
    text: 'How often does social media usage interfere with school homework or family meals?',
    category: 'Cognitive Focus & Presence',
    options: [
      { label: 'Almost daily — phone is always in hand or beside desk', points: 20 },
      { label: 'A few times per week when notifications pop up', points: 10 },
      { label: 'Rarely — focused study hours are enforced', points: 4 },
      { label: 'Never — strictly screen-free during study and dinner', points: 0 },
    ],
  },
  {
    id: 5,
    text: 'Does your child compare their appearance or social life to influencers or peers online?',
    category: 'Self-Esteem & Body Image',
    options: [
      { label: 'Yes, frequently mentions feeling left out (FOMO) or insecure', points: 20 },
      { label: 'Sometimes expresses dissatisfaction after long scrolling sessions', points: 12 },
      { label: 'Rarely, maintains realistic perspective on filtered content', points: 5 },
      { label: 'No, primarily uses tech for creative gaming or family calls', points: 0 },
    ],
  },
];

export const DigitalWellnessTestView: React.FC = () => {
  const { selectedChild, setActiveTab } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleSelectOption = (questionId: number, points: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: points }));
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
      const allAnswers: number[] = Object.values({ ...answers, [questionId]: points });
      const total = allAnswers.reduce((a: number, b: number) => a + b, 0);
      if (total <= 30) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  const scoreValues: number[] = Object.values(answers);
  const totalScore = scoreValues.reduce((a: number, b: number) => a + b, 0);

  const getScoreBand = (score: number) => {
    if (score <= 25) {
      return {
        title: 'Healthy & Mindful Balance',
        badgeColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
        description:
          'Your child exhibits strong self-regulation and healthy digital boundaries. Current family guidelines are working well.',
        recommendation:
          'Maintain regular weekly check-ins and celebrate their balanced screen habits.',
      };
    }
    if (score <= 60) {
      return {
        title: 'Moderate Over-Reliance',
        badgeColor: 'text-amber-700 bg-amber-100 border-amber-300',
        description:
          'There are clear vulnerability signals, particularly around dopamine spikes or bedtime sleep disruption.',
        recommendation:
          'Set a 45-minute cap per app and enable automated parent SMS notifications for bedtime enforcement.',
      };
    }
    return {
      title: 'High Algorithmic Dependency Concern',
      badgeColor: 'text-rose-700 bg-rose-100 border-rose-300',
      description:
        'Heavy social media engagement is noticeably affecting sleep, mood, and sustained attention spans.',
      recommendation:
        'Institute an immediate outside-the-bedroom night charging rule and enforce strict 1.5-hour total daily caps.',
    };
  };

  const band = getScoreBand(totalScore);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            Clinical Digital Wellness Screener
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mt-1">
            Youth Social Media Health Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Evaluate digital dependency risks for <strong>{selectedChild.name}</strong> ({selectedChild.age} yrs) and receive a tailored action plan.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-1.5 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Retake Test
        </button>
      </div>

      {!isCompleted ? (
        /* Question Card */
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
              <span className="text-blue-600 uppercase tracking-wider text-[11px] font-bold">
                {QUESTIONS[currentStep].category}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{
                  width: `${((currentStep + 1) / QUESTIONS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-bold text-blue-900 leading-snug">
            {QUESTIONS[currentStep].text}
          </h2>

          {/* Options */}
          <div className="space-y-2.5 pt-1">
            {QUESTIONS[currentStep].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(QUESTIONS[currentStep].id, option.points)}
                className="w-full text-left p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-800 group-hover:text-blue-950">
                    {option.label}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Completed Results View */
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in zoom-in-95 duration-200">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${band.badgeColor}`}>
              <Sparkles className="w-3.5 h-3.5" />
              {band.title}
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">
              Wellness Risk Score: {totalScore} / 100
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {band.description}
            </p>
          </div>

          {/* Action Recommendations Box */}
          <div className="p-5 rounded-lg bg-blue-50 border border-blue-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              Recommended Guardian Next Steps for {selectedChild.name}
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {band.recommendation}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setActiveTab('timelimits')}
                className="py-2.5 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <TrendingUp className="w-4 h-4" />
                Configure Automated Time Limits & SMS
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className="py-2.5 px-4 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Brain className="w-4 h-4 text-indigo-600" />
                Run Live Screen Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
