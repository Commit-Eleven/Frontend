import { DashboardPageHeader } from './DashboardPageHeader.jsx'
import './HelpPage.css'

const helpTopics = [
  {
    category: '학습 시작하기',
    questions: [
      ['언어를 바꾸려면 어떻게 하나요?', '사이드바의 더보기에서 설정을 열고 학습 언어를 선택하세요. 선택한 언어의 학습 경로와 문제로 전환됩니다.'],
      ['학습은 어디서 이어서 할 수 있나요?', '학습 탭을 열면 현재 언어의 경로가 보여요. 색이 있는 노드를 눌러 다음 레슨을 시작할 수 있습니다.'],
    ],
  },
  {
    category: '문제와 기록',
    questions: [
      ['서버 문제가 보이지 않아요.', '서버 문제를 받거나 답안을 제출하려면 Google 로그인이 필요합니다. 다시 로그인한 뒤 문제 화면에서 다시 시도해 주세요.'],
      ['틀린 문제는 어디에서 다시 풀 수 있나요?', '오답 노트에서 개념 문제를 다시 풀 수 있어요. 코드 문제는 해당 레슨으로 돌아가 다시 제출할 수 있습니다.'],
      ['학습 기록은 어디에 표시되나요?', '프로필 탭에서 XP, 해결한 문제 수, 정답률과 유형별 진행률을 확인할 수 있습니다.'],
    ],
  },
  {
    category: '계정과 친구',
    questions: [
      ['친구를 어떻게 추가하나요?', '친구 탭의 검색창에 닉네임을 두 글자 이상 입력하고 친구 추가를 누르세요. 받은 요청은 내 네트워크에서 수락할 수 있습니다.'],
      ['로그인 후 원래 보던 곳으로 돌아오지 않아요.', '인증을 마치면 학습 화면으로 돌아옵니다. 계속 문제가 생기면 페이지를 새로고침하고 다시 로그인해 주세요.'],
    ],
  },
]

export function HelpPage({ onNavigate }) {
  return (
    <section className="help-page">
      <DashboardPageHeader
        eyebrow="도움말 센터"
        title="무엇을 도와드릴까요?"
        description="학습, 문제 풀이, 계정 사용 방법을 확인해 보세요."
      />
      <div className="help-search-hint"><span aria-hidden="true">⌕</span><p>아래 주제에서 필요한 내용을 찾아보세요.</p></div>
      <div className="help-topic-list">
        {helpTopics.map((topic) => (
          <section className="help-topic" key={topic.category}>
            <h2>{topic.category}</h2>
            {topic.questions.map(([question, answer]) => (
              <details className="help-question" key={question}>
                <summary><span>{question}</span><b aria-hidden="true">＋</b></summary>
                <p>{answer}</p>
              </details>
            ))}
          </section>
        ))}
      </div>
      <div className="help-cta">
        <span aria-hidden="true">✦</span>
        <div><strong>준비됐다면 다시 학습을 시작해요</strong><p>배운 내용을 직접 풀어보면서 익혀 보세요.</p></div>
        <button type="button" onClick={() => onNavigate('학습')}>학습하기 <b aria-hidden="true">→</b></button>
      </div>
    </section>
  )
}
