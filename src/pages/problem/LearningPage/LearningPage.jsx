import { useState } from 'react';
import { submitMultipleChoiceAnswer } from '../../../api/problemApi';
import ProblemLoadState from '../../../components/question/ProblemLoadState/ProblemLoadState';
import { dummyCodeAssemblyQuestion, dummyCodeFillQuestion, dummyMultipleChoiceQuestion, dummySpaghettiCodeQuestion, dummySubjectiveCodeQuestion } from '../../../constants/dummy/dummyQuestions';
import useMultipleChoiceProblem from '../../../hooks/useMultipleChoiceProblem';
import useElapsedTime from '../../../hooks/useElapsedTime';
import CodeAssemblyPage from '../CodeAssemblyPage/CodeAssemblyPage';
import CodeFillPage from '../CodeFillPage/CodeFillPage';
import MultipleChoicePage from '../MultipleChoicePage/MultipleChoicePage';
import SpaghettiCodePage from '../SpaghettiCodePage/SpaghettiCodePage';
import StudyCompletePage from '../StudyCompletePage/StudyCompletePage';
import SubjectiveCodePage from '../SubjectiveCodePage/SubjectiveCodePage';
import './LearningPage.css';

const questionSequence = ['multiple', 'fill', 'assembly', 'subjective', 'spaghetti'];

/** 서버의 단계 정보가 없을 때 현재 학습 흐름을 진행률 데이터로 변환합니다. */
function withStageProgress(question, questionType) {
  if (question.unit) return question;

  return {
    ...question,
    unit: {
      index: Number(question.current) || questionSequence.indexOf(questionType) + 1,
      total: Number(question.total) || questionSequence.length,
    },
  };
}

/** 현재 문제의 진행률을 상단 학습 헤더에서 사용할 값으로 변환합니다. */
function getProgress(question) {
  const total = Math.max(Number(question?.unit?.total ?? question?.total) || questionSequence.length, 1);
  const current = Math.min(Math.max(Number(question?.unit?.index ?? question?.current) || 1, 1), total);
  return { current, total, percent: `${(current / total) * 100}%` };
}

/** 문제 유형에 알맞은 화면을 렌더링하고 학습 진행 상태를 관리합니다. */
function LearningPage({ onGoHome }) {
  const [questionType, setQuestionType] = useState('multiple');
  const [correctCount, setCorrectCount] = useState(0);
  const [isStudyComplete, setIsStudyComplete] = useState(false);
  const isMultipleChoice = questionType === 'multiple';
  const [elapsedTime, resetElapsedTime] = useElapsedTime('00 : 00', isStudyComplete);
  const { problem, isLoading, error, isUsingFallback, fetchProblem } = useMultipleChoiceProblem(isMultipleChoice, dummyMultipleChoiceQuestion);

  /** 채점 결과를 누적하고 다음 문제 또는 결과 화면으로 이동합니다. */
  const handleNextQuestion = (result) => {
    if (result === 'correct') setCorrectCount((count) => count + 1);

    const currentIndex = questionSequence.indexOf(questionType);
    if (currentIndex === questionSequence.length - 1) {
      setIsStudyComplete(true);
      return;
    }

    setQuestionType(questionSequence[currentIndex + 1]);
  };

  /** 첫 번째 문제부터 학습을 다시 시작합니다. */
  const handleRestartStudy = () => {
    setQuestionType('multiple');
    setCorrectCount(0);
    setIsStudyComplete(false);
    resetElapsedTime();
  };

  /** 객관식 선택지를 서버에 제출합니다. */
  const handleMultipleChoiceSubmit = (answer) => submitMultipleChoiceAnswer(answer);

  const questionSource = questionType === 'multiple' ? problem ?? dummyMultipleChoiceQuestion : questionType === 'fill' ? dummyCodeFillQuestion : questionType === 'assembly' ? dummyCodeAssemblyQuestion : questionType === 'subjective' ? dummySubjectiveCodeQuestion : dummySpaghettiCodeQuestion;
  const stagedQuestion = withStageProgress(questionSource, questionType);
  const progress = getProgress(stagedQuestion);
  const question = questionType === 'multiple' ? isLoading || error || !problem ? <ProblemLoadState isLoading={isLoading || !error} error={error} onRetry={fetchProblem} /> : <MultipleChoicePage question={stagedQuestion} elapsedTime={elapsedTime} onNext={handleNextQuestion} onSubmitAnswer={isUsingFallback ? undefined : handleMultipleChoiceSubmit} /> : questionType === 'fill' ? <CodeFillPage question={stagedQuestion} elapsedTime={elapsedTime} onNext={handleNextQuestion} /> : questionType === 'assembly' ? <CodeAssemblyPage question={stagedQuestion} elapsedTime={elapsedTime} onNext={handleNextQuestion} /> : questionType === 'subjective' ? <SubjectiveCodePage question={stagedQuestion} elapsedTime={elapsedTime} onNext={handleNextQuestion} /> : <SpaghettiCodePage question={stagedQuestion} elapsedTime={elapsedTime} onNext={handleNextQuestion} />;

  return (
    <div className="learning-page">
      {!isStudyComplete && (
        <header className="learning-page__header">
          <div className="learning-page__progress" aria-label={`문제 ${progress.current} / ${progress.total}`}>
            <i style={{ width: progress.percent }} />
            <span>{progress.current}/{progress.total}</span>
          </div>
          <button type="button" onClick={onGoHome}>저장하고 나가기</button>
        </header>
      )}
      <main className="learning-page__content">{isStudyComplete ? <StudyCompletePage correctCount={correctCount} totalCount={questionSequence.length} elapsedTime={elapsedTime} onRestart={handleRestartStudy} onGoHome={onGoHome} /> : question}</main>
    </div>
  );
}

export default LearningPage;
