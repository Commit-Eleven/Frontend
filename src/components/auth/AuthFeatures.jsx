/** 문제 풀이·오류 수정·경쟁 학습을 예시 화면과 함께 소개합니다. */
export function AuthFeatures() {
  return (
    <div className="auth-features">
      <section className="auth-feature" aria-labelledby="feature-quiz-title">
        <div className="auth-feature-copy">
          <span className="auth-section-label">생각하고, 고르고, 이해하고</span>
          <h2 id="feature-quiz-title">
            문제를 풀다 보면,
            <br />
            어느새 내 것이 되는 코딩.
          </h2>
          <p>
            긴 설명만 읽는 공부는 이제 그만. 알맞은 코드를 고르는 짧은 문제로
            개념을 익히고, 한 단계씩 나만의 실력을 쌓아 가세요.
          </p>
        </div>
        <div
          className="auth-demo auth-quiz-demo"
          role="img"
          aria-label="올바른 HTML 태그를 고르는 문제 예시"
        >
          <div className="auth-demo-heading">
            <span>오늘의 작은 도전</span>
            <span className="auth-demo-progress">01 / 05</span>
          </div>
          <h3>문단을 만들 때 사용하는 태그는?</h3>
          <div className="auth-quiz-choice">
            <span>1</span>
            <code>&lt;div&gt;</code>
          </div>
          <div className="auth-quiz-choice is-correct">
            <span>2</span>
            <code>&lt;p&gt;</code>
            <b>✓</b>
          </div>
          <div className="auth-quiz-choice">
            <span>3</span>
            <code>&lt;span&gt;</code>
          </div>
          <div className="auth-demo-feedback">
            ✓ 정답이에요! 한 걸음 더 나아갔어요.
          </div>
        </div>
      </section>
      <section
        className="auth-feature auth-feature-reverse"
        aria-labelledby="feature-code-title"
      >
        <div className="auth-feature-copy">
          <span className="auth-section-label">틀려도 괜찮아요</span>
          <h2 id="feature-code-title">
            오류를 발견하는 순간,
            <br />
            실력이 자라나요.
          </h2>
          <p>
            어디가 잘못됐을까요? 직접 코드를 읽고 수정하며 원리를 이해해 보세요.
            실행 결과를 확인하는 작은 경험이, 스스로 문제를 해결하는 힘이
            됩니다.
          </p>
        </div>
        <div
          className="auth-demo auth-editor-demo"
          role="img"
          aria-label="HTML 종료 태그 오류를 수정하고 실행하는 예시"
        >
          <div className="auth-editor-heading">
            <span className="auth-editor-dots">● ● ●</span>
            <span>hello.html</span>
            <span>HTML</span>
          </div>
          <div className="auth-editor-code">
            <span>
              <i>1</i>&lt;html&gt;
            </span>
            <span>
              <i>2</i> &lt;body&gt;
            </span>
            <span className="auth-code-fixed">
              <i>3</i> &lt;h1&gt;Hello, Codegram!&lt;/h1&gt;<b>✓</b>
            </span>
            <span>
              <i>4</i> &lt;/body&gt;
            </span>
            <span>
              <i>5</i>&lt;/html&gt;
            </span>
          </div>
          <div className="auth-editor-output">
            <small>실행 결과</small>
            <strong>Hello, Codegram!</strong>
            <span>✓ 모든 테스트를 통과했어요</span>
          </div>
        </div>
      </section>
      <section className="auth-feature" aria-labelledby="feature-growth-title">
        <div className="auth-feature-copy">
          <span className="auth-section-label">함께 도전하는 즐거움</span>
          <h2 id="feature-growth-title">
            공부가 도전이 되고,
            <br />
            도전이 습관이 되도록.
          </h2>
          <p>
            문제를 풀며 경험치를 쌓고, 경쟁하며 한 걸음 더 나아가세요. 작은
            목표를 하나씩 이루는 재미가 매일 다시 코딩하고 싶게 만들어 줄
            거예요.
          </p>
        </div>
        <div
          className="auth-growth-demo"
          role="img"
          aria-label="경험치와 순위로 성장하는 경쟁 학습 예시"
        >
          <div className="auth-growth-star">★</div>
          <div className="auth-growth-xp">
            오늘도 성장했어요! <strong>+20 XP</strong>
          </div>
          <div className="auth-podium">
            <div className="auth-podium-second">
              <span>2</span>
              <b>꾸준함</b>
            </div>
            <div className="auth-podium-first">
              <span>1</span>
              <b>오늘의 나</b>
              <small>한 단계 더 높이!</small>
            </div>
            <div className="auth-podium-third">
              <span>3</span>
              <b>도전</b>
            </div>
          </div>
          <span className="auth-growth-caption">
            어제보다 더 나아진 나를 만나요.
          </span>
        </div>
      </section>
    </div>
  );
}
