/** 코딩 여정을 소개하는 장식 일러스트를 표시합니다. */
export function AuthIllustration() {
  return (
    <div className="auth-art" aria-hidden="true">
      <span className="auth-spark spark-one">✦</span>
      <span className="auth-spark spark-two">✧</span>
      <div className="auth-float float-html">
        <span>HTML</span><img src="/coddy/auth-languages/html.svg" alt="" />
      </div>
      <div className="auth-float float-java">
        <span>JAVA</span><img src="/coddy/auth-languages/java.svg" alt="" />
      </div>
      <div className="auth-float float-python">
        <span>Python</span><img src="/coddy/auth-languages/python.svg" alt="" />
      </div>
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
