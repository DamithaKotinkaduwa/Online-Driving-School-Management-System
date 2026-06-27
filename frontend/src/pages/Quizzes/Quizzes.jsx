import React, { useState } from 'react';
import Card from '../../components/Card';
import './Quizzes.css';

const QUIZZES = [
  {
    id: 1, title: 'Road Signs & Signals', questions: 15, duration: '20 min',
    difficulty: 'Beginner', category: 'Theory', bestScore: 80, attempts: 2,
    description: 'Identify common road signs, traffic lights, and pavement markings.',
    color: '#4F46E5',
  },
  {
    id: 2, title: 'Speed Limits & Zones', questions: 10, duration: '12 min',
    difficulty: 'Beginner', category: 'Theory', bestScore: 90, attempts: 1,
    description: 'Understand speed limits across different road types and conditions.',
    color: '#10B981',
  },
  {
    id: 3, title: 'Right of Way Rules', questions: 12, duration: '15 min',
    difficulty: 'Intermediate', category: 'Theory', bestScore: null, attempts: 0,
    description: 'Master right-of-way at intersections, roundabouts, and merges.',
    color: '#F59E0B',
  },
  {
    id: 4, title: 'Defensive Driving', questions: 20, duration: '25 min',
    difficulty: 'Intermediate', category: 'Safety', bestScore: null, attempts: 0,
    description: 'Techniques to anticipate hazards and drive safely in any condition.',
    color: '#8B5CF6',
  },
  {
    id: 5, title: 'Hazard Perception', questions: 14, duration: '18 min',
    difficulty: 'Advanced', category: 'Practical', bestScore: null, attempts: 0,
    description: 'Identify and respond to potential road hazards in real-time scenarios.',
    color: '#F43F5E',
  },
  {
    id: 6, title: 'Motorway Driving', questions: 10, duration: '12 min',
    difficulty: 'Advanced', category: 'Practical', bestScore: null, attempts: 0,
    description: 'Joining, lane discipline, and exiting motorways safely.',
    color: '#0EA5E9',
  },
];

const SAMPLE_QUESTIONS = [
  {
    q: 'What does a solid white line in the centre of the road mean?',
    options: ['Overtaking is allowed', 'No overtaking from your side', 'Road narrows ahead', 'Slow down'],
    answer: 1,
  },
  {
    q: 'What is the maximum speed on a motorway in normal conditions?',
    options: ['60 mph', '70 mph', '80 mph', '65 mph'],
    answer: 1,
  },
  {
    q: 'At a T-junction who has right of way?',
    options: ['Driver turning right', 'Driver on the major road', 'Driver on the minor road', 'First to arrive'],
    answer: 1,
  },
  {
    q: 'How far should you keep from the vehicle in front in dry conditions?',
    options: ['1 second', '2 seconds', '4 seconds', '6 seconds'],
    answer: 1,
  },
  {
    q: 'What does a flashing amber traffic light mean?',
    options: ['Stop and wait', 'Proceed with caution', 'Speed up to clear junction', 'Turn right only'],
    answer: 1,
  },
];

const DIFF_COLORS = {
  Beginner:     { bg: '#D1FAE5', text: '#065F46' },
  Intermediate: { bg: '#FEF3C7', text: '#92400E' },
  Advanced:     { bg: '#FEE2E2', text: '#991B1B' },
};

export default function Quizzes() {
  const [active, setActive]   = useState(null);  // quiz being taken
  const [step, setStep]       = useState(0);
  const [chosen, setChosen]   = useState({});
  const [finished, setFinished] = useState(false);
  const [quizzes, setQuizzes]   = useState(QUIZZES);

  const start  = (quiz) => { setActive(quiz); setStep(0); setChosen({}); setFinished(false); };
  const pick   = (qi, ai) => setChosen(prev => ({ ...prev, [qi]: ai }));
  const submit = () => {
    const correct = SAMPLE_QUESTIONS.filter((q, i) => chosen[i] === q.answer).length;
    const pct     = Math.round((correct / SAMPLE_QUESTIONS.length) * 100);
    setQuizzes(prev => prev.map(q =>
      q.id === active.id
        ? { ...q, attempts: q.attempts + 1, bestScore: q.bestScore === null ? pct : Math.max(q.bestScore, pct) }
        : q
    ));
    setFinished(true);
  };

  const correct = finished ? SAMPLE_QUESTIONS.filter((q, i) => chosen[i] === q.answer).length : 0;
  const pct     = finished ? Math.round((correct / SAMPLE_QUESTIONS.length) * 100) : 0;

  // ── Quiz View ──────────────────────────────────────────────────────────────
  if (active && !finished) {
    const q = SAMPLE_QUESTIONS[step];
    return (
      <div className="quiz-active">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${((step+1)/SAMPLE_QUESTIONS.length)*100}%` }}/>
        </div>
        <div className="quiz-meta">
          <span>{active.title}</span>
          <span>Question {step + 1} of {SAMPLE_QUESTIONS.length}</span>
        </div>
        <Card className="quiz-question-card">
          <h3 className="question-text">{q.q}</h3>
          <div className="options-grid">
            {q.options.map((opt, i) => (
              <button
                key={i}
                className={`option-btn ${chosen[step] === i ? 'selected' : ''}`}
                onClick={() => pick(step, i)}
              >
                <span className="opt-letter">{String.fromCharCode(65+i)}</span>
                {opt}
              </button>
            ))}
          </div>
          <div className="quiz-nav">
            <button className="nav-btn sec" onClick={() => setActive(null)}>Quit</button>
            <div style={{ display:'flex', gap: 8 }}>
              {step > 0 && <button className="nav-btn" onClick={() => setStep(s => s-1)}>Back</button>}
              {step < SAMPLE_QUESTIONS.length - 1
                ? <button className="nav-btn prim" onClick={() => setStep(s => s+1)} disabled={chosen[step] === undefined}>Next</button>
                : <button className="nav-btn prim" onClick={submit} disabled={Object.keys(chosen).length < SAMPLE_QUESTIONS.length}>Submit</button>
              }
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ── Result View ────────────────────────────────────────────────────────────
  if (active && finished) {
    const grade = pct >= 80 ? '🏆 Pass' : pct >= 60 ? '🎯 Almost' : '❌ Fail';
    const gradeColor = pct >= 80 ? '#10B981' : pct >= 60 ? '#F59E0B' : '#F43F5E';
    return (
      <div className="quiz-result">
        <Card className="result-card">
          <div className="result-circle" style={{ borderColor: gradeColor }}>
            <span className="result-pct" style={{ color: gradeColor }}>{pct}%</span>
            <span className="result-grade">{grade}</span>
          </div>
          <h3>Quiz Complete!</h3>
          <p style={{ color:'#64748B', marginTop:8 }}>You got <strong>{correct}</strong> out of <strong>{SAMPLE_QUESTIONS.length}</strong> correct.</p>
          <div className="result-answers">
            {SAMPLE_QUESTIONS.map((q, i) => {
              const isRight = chosen[i] === q.answer;
              return (
                <div className="ans-row" key={i}>
                  <span className="ans-icon">{isRight ? '✅' : '❌'}</span>
                  <div>
                    <div className="ans-q">{q.q}</div>
                    {!isRight && <div className="ans-correct">Correct: {q.options[q.answer]}</div>}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display:'flex', gap:12, marginTop:24 }}>
            <button className="nav-btn sec" onClick={() => setActive(null)}>Back to Quizzes</button>
            <button className="nav-btn prim" onClick={() => start(active)}>Retry</button>
          </div>
        </Card>
      </div>
    );
  }

  // ── Quiz List ──────────────────────────────────────────────────────────────
  return (
    <div className="quizzes-page">
      <div className="quiz-summary-bar">
        <div className="quiz-sum-item"><span className="sum-val">{quizzes.length}</span><span className="sum-lbl">Total Quizzes</span></div>
        <div className="quiz-sum-item"><span className="sum-val">{quizzes.filter(q=>q.bestScore!==null).length}</span><span className="sum-lbl">Attempted</span></div>
        <div className="quiz-sum-item"><span className="sum-val">{quizzes.filter(q=>q.bestScore>=80).length}</span><span className="sum-lbl">Passed</span></div>
        <div className="quiz-sum-item">
          <span className="sum-val">
            {quizzes.filter(q=>q.bestScore!==null).length > 0
              ? Math.round(quizzes.filter(q=>q.bestScore!==null).reduce((a,q)=>a+q.bestScore,0) / quizzes.filter(q=>q.bestScore!==null).length) + '%'
              : '–'}
          </span>
          <span className="sum-lbl">Avg Score</span>
        </div>
      </div>

      <div className="quizzes-grid">
        {quizzes.map(quiz => {
          const dc = DIFF_COLORS[quiz.difficulty] || DIFF_COLORS.Beginner;
          return (
            <div className="quiz-card" key={quiz.id}>
              <div className="quiz-card-top" style={{ background: quiz.color }}>
                <span className="quiz-category">{quiz.category}</span>
                <span className="quiz-q-cnt">{quiz.questions} Qs</span>
              </div>
              <div className="quiz-card-body">
                <h4 className="quiz-title">{quiz.title}</h4>
                <p className="quiz-desc">{quiz.description}</p>
                <div className="quiz-info-row">
                  <span className="diff-badge" style={{ background: dc.bg, color: dc.text }}>{quiz.difficulty}</span>
                  <span className="quiz-dur">⏱ {quiz.duration}</span>
                </div>
                {quiz.bestScore !== null ? (
                  <div className="score-bar-wrap">
                    <div className="score-bar-label">
                      <span>Best Score</span><strong>{quiz.bestScore}%</strong>
                    </div>
                    <div className="score-bar-bg">
                      <div className="score-bar-fill" style={{
                        width: quiz.bestScore + '%',
                        background: quiz.bestScore >= 80 ? '#10B981' : quiz.bestScore >= 60 ? '#F59E0B' : '#F43F5E'
                      }}/>
                    </div>
                  </div>
                ) : (
                  <div className="not-attempted">Not attempted yet</div>
                )}
                <button className="take-btn" onClick={() => start(quiz)}>
                  {quiz.attempts > 0 ? 'Retake Quiz' : 'Start Quiz'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
