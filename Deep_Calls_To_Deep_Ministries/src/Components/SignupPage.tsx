import { useState } from 'react';
import {
  pageStyle, pageInnerStyle, logoStyle, headingStyle, fieldStyle, labelStyle,
  inputStyle, captchaStyle, checkboxStyle, captchaTextStyle,
  submitBtnStyle, bottomTextStyle, linkStyle,
} from './authStyles';

interface SignupPageProps {
  onBack: () => void;
  onGoToLogin: () => void;
}

const phoneRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  width: '100%',
};

const countrySelectStyle: React.CSSProperties = {
  ...inputStyle,
  width: 70,
  flexShrink: 0,
  padding: '16px 8px',
  textAlign: 'center',
};

export default function SignupPage({ onBack, onGoToLogin }: SignupPageProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <div style={pageStyle}>
      <div style={pageInnerStyle}>
        <div style={logoStyle} onClick={onBack}>
          DEANA BRINGOLF
        </div>

        <h1 style={headingStyle}>Create an account</h1>

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

        <div style={fieldStyle}>
          <label style={labelStyle}>First name</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="First"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Last name</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Last"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Phone number</label>
          <div style={phoneRowStyle}>
            <select style={countrySelectStyle} defaultValue="US">
              <option value="US">US</option>
            </select>
            <input
              style={inputStyle}
              type="tel"
              placeholder="201 555 0123"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div style={captchaStyle}>
          <div style={checkboxStyle} />
          <span style={captchaTextStyle}>Verify you are human</span>
        </div>

        <button style={submitBtnStyle}>Sign up</button>

        <p style={bottomTextStyle}>
          Have an account?{' '}
          <a style={linkStyle} onClick={onGoToLogin}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
