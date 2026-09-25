'use client';

import { useState, useCallback, useMemo } from 'react';
import type { GameProps } from '@/lib/types';
import { GameShell, GameButton, GameTextBox } from '@/components/GameUI';
import { cn } from '@/lib/utils';

interface Question {
  a: number;
  b: number;
  options: number[];
  answer: number;
}

function generateQuestion(): Question {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const answer = a + b;
  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 6) - 3;
    const fake = answer + offset;
    if (fake >= 0 && fake !== answer) options.add(fake);
  }
  return { a, b, options: Array.from(options).sort(() => Math.random() - 0.5), answer };
}

export function SomaDivertida({ onScore, onComplete }: GameProps) {
  return (
    <GameShell
      title="Soma Divertida"
      description="Pratique a adição de forma divertida!"
      onScore={onScore}
      onComplete={onComplete}
    >
      {({ isHighContrast, isFixedFooter, addScore, complete, score }) => (
        <SomaGameContent
          isHighContrast={isHighContrast}
          isFixedFooter={isFixedFooter}
          addScore={addScore}
          complete={complete}
          score={score}
        />
      )}
    </GameShell>
  );
}

interface ContentProps {
  isHighContrast: boolean;
  isFixedFooter: boolean;
  addScore: (points: number) => void;
  complete: (finalScore: number) => void;
  score: number;
}

function SomaGameContent({ isHighContrast, isFixedFooter, addScore, complete, score }: ContentProps) {
  const [question, setQuestion] = useState<Question>(generateQuestion);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const totalQuestions = 10;

  const handleAnswer = useCallback(
    (value: number) => {
      if (selected !== null || finished) return;
      setSelected(value);
      const isCorrect = value === question.answer;
      setCorrect(isCorrect);
      if (isCorrect) addScore(10);
    },
    [selected, finished, question.answer, addScore]
  );

  const next = useCallback(() => {
    if (questionCount + 1 >= totalQuestions) {
      setFinished(true);
      complete(score);
      return;
    }
    setQuestionCount((c) => c + 1);
    setQuestion(generateQuestion());
    setSelected(null);
    setCorrect(null);
  }, [questionCount, totalQuestions, complete, score]);

  if (finished) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
        <div
          className={cn(
            'text-4xl md:text-5xl font-bold animate-pop-in',
            isHighContrast ? 'text-white' : 'text-brand-600'
          )}
        >
          Jogo Concluído!
        </div>
        <GameTextBox variant="highlight" highContrast={isHighContrast} size="lg">
          <div className="text-center">
            <div className="text-lg">Pontuação Final</div>
            <div className="text-4xl font-bold">{score} pontos</div>
            <div className="text-sm mt-2">
              {questionCount + 1} de {totalQuestions} perguntas respondidas
            </div>
          </div>
        </GameTextBox>
      </div>
    );
  }

  const optionsContent = (
    <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-2xl mx-auto w-full">
      {question.options.map((opt) => {
        const isSelected = selected === opt;
        const isAnswer = opt === question.answer;
        return (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={selected !== null}
            className={cn(
              'py-6 md:py-8 rounded-xl text-3xl md:text-4xl font-bold transition-all active:scale-95',
              'disabled:cursor-not-allowed',
              selected === null && (
                isHighContrast
                  ? 'bg-black text-white border-2 border-white hover:bg-white hover:text-black'
                  : 'bg-white text-brand-600 border-2 border-brand-200 hover:bg-brand-100 hover:border-brand-400 shadow-sm'
              ),
              isSelected && isAnswer && (isHighContrast ? 'bg-white text-black border-2 border-white' : 'bg-green-500 text-white'),
              isSelected && !isAnswer && (isHighContrast ? 'bg-white text-black opacity-50' : 'bg-red-500 text-white'),
              selected !== null && !isSelected && isAnswer && (isHighContrast ? 'border-2 border-white opacity-60' : 'border-2 border-green-400 opacity-60')
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={cn('flex flex-col', isFixedFooter ? 'p-4 md:p-8' : '')}>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
        {/* Progress */}
        <div className={cn('text-sm font-semibold', isHighContrast ? 'text-gray-300' : 'text-gray-500')}>
          Pergunta {questionCount + 1} de {totalQuestions}
        </div>

        {/* Question */}
        <div
          className={cn(
            'text-5xl md:text-7xl font-bold flex items-center gap-4',
            isHighContrast ? 'text-white' : 'text-brand-600'
          )}
        >
          <span>{question.a}</span>
          <span className={isHighContrast ? 'text-white' : 'text-brand-400'}>+</span>
          <span>{question.b}</span>
          <span className={isHighContrast ? 'text-white' : 'text-brand-400'}>=</span>
          <span className={isHighContrast ? 'text-gray-400' : 'text-gray-300'}>?</span>
        </div>

        {/* Feedback */}
        {selected !== null && (
          <div className="animate-pop-in">
            {correct ? (
              <GameTextBox variant="success" highContrast={isHighContrast} size="md">
                <span className="text-lg font-bold">Correto! +10 pontos</span>
              </GameTextBox>
            ) : (
              <GameTextBox variant="error" highContrast={isHighContrast} size="md">
                <span className="text-lg font-bold">A resposta era {question.answer}</span>
              </GameTextBox>
            )}
          </div>
        )}
      </div>

      {/* Options */}
      {selected === null ? (
        <div
          className={cn(
            isFixedFooter
              ? 'fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-brand-200 shadow-lg z-30'
              : '',
            isHighContrast && isFixedFooter ? 'bg-black border-white' : ''
          )}
        >
          {optionsContent}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 pb-4">
          {optionsContent}
          <GameButton variant="primary" highContrast={isHighContrast} size="lg" onClick={next}>
            {questionCount + 1 >= totalQuestions ? 'Ver Resultado' : 'Próxima Pergunta'}
          </GameButton>
        </div>
      )}
    </div>
  );
}
