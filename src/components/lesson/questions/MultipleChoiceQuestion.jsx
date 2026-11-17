import { QuestionOptions } from './QuestionOptions.jsx';
import './MultipleChoiceQuestion.css';

export function MultipleChoiceQuestion({ problem, selected, feedback, onChange, disabled }) {
  return (
    <section className="multiple-choice-question" aria-label="선택형 문제">
      <QuestionOptions
        choices={problem.content.choices}
        selectedIndex={selected}
        correctChoiceIndex={-1}
        showResult={Boolean(feedback)}
        isCorrect={Boolean(feedback?.correct)}
        onSelect={onChange}
        disabled={disabled}
      />
    </section>
  );
}
