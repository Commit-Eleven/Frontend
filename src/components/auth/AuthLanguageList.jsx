import { authLanguages } from '../../constants/authLanguages.js';

/** Codegram에서 소개하는 다섯 가지 학습 언어를 표시합니다. */
export function AuthLanguageList() {
  return (
    <section className="auth-languages" aria-label="학습할 수 있는 언어">
      <ul>
        {authLanguages.map((language) => (
          <li key={language.name}>
            <span
              className={`auth-language-icon ${language.className}`}
              aria-hidden="true"
            >
              {language.symbol}
            </span>
            <span>{language.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
