import { useState } from 'react';
import {
  pageStyle, pageInnerStyle, logoStyle, headingStyle, fieldStyle, labelStyle,
  inputStyle, captchaStyle, checkboxStyle, captchaTextStyle,
  submitBtnStyle, bottomTextStyle, linkStyle,
} from './authStyles';

interface LoginPageProps {
  onBack: () => void;
  onGoToSignup: () => void;
}

export default function LoginPage({ onBack, onGoToSignup }: LoginPageProps) {
  const [email, setEmail] = useState('');

  return (
    <div style={pageStyle}>
      <div style={pageInnerStyle}>
        <div style={logoStyle} onClick={onBack}>
          DEANA BRINGOLF
        </div>

        <h1 style={headingStyle}>Log in to your account</h1>

        <div style={fieldStyle}>
          <label style={labelStyle}>Email address</label>
          <input
            style={inputStyle}
            type="email"
            placeholder="name@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={captchaStyle}>
          <div style={checkboxStyle} />
          <span style={captchaTextStyle}>Verify you are human</span>
        </div>

        <button style={submitBtnStyle}>Log in</button>

        <p style={bottomTextStyle}>
          Need an account?{' '}
          <a style={linkStyle} onClick={onGoToSignup}>
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
