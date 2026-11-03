/** 코딩 여정을 소개하는 장식 일러스트를 표시합니다. */
export function AuthIllustration() {
  return (
    <div className="auth-art" aria-hidden="true">
      <span className="auth-spark spark-one">✦</span>
      <span className="auth-spark spark-two">✧</span>
      <div className="auth-float float-html">
        HTML<span>&lt;/&gt;</span>
      </div>
      <div className="auth-float float-css">
        CSS<span>{'{ }'}</span>
      </div>
      <div className="auth-float float-js">JS</div>
      <div className="auth-mascot">
        <div className="auth-mascot-face">
          <div className="auth-eye">
            <i />
          </div>
          <div className="auth-eye">
            <i />
          </div>
        </div>
        <div className="auth-smile" />
        <span className="auth-cheek left" />
        <span className="auth-cheek right" />
      </div>
      <div className="auth-mini-code">
        <span>● ● ●</span>
        <code>&lt;h1&gt;Hello, world!&lt;/h1&gt;</code>
        <b>✓ 잘했어요!</b>
      </div>
      <span className="auth-star">★</span>
    </div>
  );
}
