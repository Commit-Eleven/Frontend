import { useState } from 'react';
import './MultipleChoicePage.css';
import CodeEditor from '../../../components/question/CodeEditor/CodeEditor';
import QuestionActions from '../../../components/question/QuestionActions/QuestionActions';
import QuestionFeedback from '../../../components/question/QuestionFeedback/QuestionFeedback';
import QuestionProgress from '../../../components/question/QuestionProgress/QuestionProgress';

/** 서버 또는 문제 데이터에서 정답 선택지의 인덱스를 반환합니다. */
function getCorrectChoiceIndex(question, submissionResult) {
  const answer = submissionResult?.correctChoice ?? question.answer;
  const matchingChoiceIndex = question.choices.findIndex((choice) => String(choice) === String(answer));

  if (matchingChoiceIndex >= 0) return matchingChoiceIndex;
  if (Number.isInteger(answer) && answer >= 0 && answer < question.choices.length) return answer;
  return null;
}

/** 채점 결과에 맞는 해설 문구를 생성합니다. */
function getAnswerExplanation(question, selected, status, correctChoiceIndex) {
  if (status === 'correct') return '정답입니다!';

  const selectedChoice = question.choices[selected];
  if (correctChoiceIndex === null) return `${selected + 1}번 ${selectedChoice}은(는) 오답입니다. 서버에서 정답 선택지를 제공하면 정답도 함께 표시됩니다.`;

  return `${selected + 1}번 ${selectedChoice}은(는) 오답입니다. 정답은 ${correctChoiceIndex + 1}번 ${question.choices[correctChoiceIndex]}입니다.`;
}

/** 답안 제출 실패 원인에 맞는 안내 문구를 반환합니다. */
function getSubmissionErrorMessage(error) {
  const statusCode = error?.response?.status;

  if (statusCode >= 500) {
    return `채점 서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요. (HTTP ${statusCode})`;
  }

  if (error?.code === 'ECONNABORTED') {
    return '채점 서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
  }

  return '답안을 제출하지 못했습니다. 네트워크 연결을 확인한 뒤 다시 시도해주세요.';
}

function MultipleChoicePage({ question, elapsedTime, onNext, onSubmitAnswer }) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState(null);
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  /** 선택한 답안을 채점하거나 다음 문제로 전환합니다. */
  const handleSubmit = async () => {
    if (status) return onNext(status);
    if (selected === null) return;
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      const result = onSubmitAnswer ? await onSubmitAnswer({ id: question.id, choice: selected }) : { result: selected === question.answer };
      setStatus(result.result ? 'correct' : 'wrong');
      setCorrectChoiceIndex(getCorrectChoiceIndex(question, result));
      setFeedback('answer');
    } catch (error) {
      setSubmissionError(getSubmissionErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="quiz-card" aria-label="객관식 문제">
      <QuestionProgress current={question.current} total={question.total} unit={question.unit} elapsedTime={elapsedTime} />
      <div className="quiz-body">
        <p className="quiz-question">{question.text}</p>
        {question.code && (
          <CodeEditor
            label="문제 코드"
            value={question.code}
            language={question.language ?? 'python'}
            readOnly
            showLabel={false}
            showTestInput={false}
            fitContent
            className="multiple-choice-code"
          />
        )}
        <div className="choice-list" role="radiogroup" aria-label="답안 선택">
          {question.choices.map((choice, index) => {
            const result = status === 'correct' && index === selected ? ' choice--correct' : status === 'wrong' && index === selected ? ' choice--wrong' : status === 'wrong' && index === correctChoiceIndex ? ' choice--correct' : '';
            return (
              <button key={choice} type="button" disabled={Boolean(status)} className={`choice${selected === index && !status ? ' choice--selected' : ''}${result || ''}`} role="radio" aria-checked={selected === index} onClick={() => setSelected(index)}>
                <span>{index + 1}</span>
                {choice}
              </button>
            );
          })}
        </div>
        {submissionError && <p className="quiz-submit-error">{submissionError}</p>}
        <QuestionFeedback type={feedback} hint={question.hint ?? '선택지를 하나 고른 뒤 제출해보세요.'} explanation={question.explanation ?? getAnswerExplanation(question, selected, status, correctChoiceIndex)} />
      </div>
      <QuestionActions status={status} isSubmitting={isSubmitting} onHint={() => setFeedback('hint')} onSubmit={handleSubmit} />
    </section>
  );
}

export default MultipleChoicePage;
