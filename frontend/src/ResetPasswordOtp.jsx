// ResetPasswordOtp.jsx
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "./App.css";
import finBankLogo from "./finbank_logo13-removebg-preview.png";
import bankIcon from "./bank.png";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function ResetPasswordOtp({ navigate }) {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef([]);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const timerRef = useRef(null);

  const email = sessionStorage.getItem("reset_email");

  /* ================= SESSION GUARD ================= */
  useEffect(() => {
    if (!email) {
      toast.error("Password reset session expired");
      navigate("resetEmail");
    }
  }, [email, navigate]);

  /* ================= INITIAL FOCUS + TIMER ================= */
  useEffect(() => {
    inputsRef.current[0]?.focus();
    startTimer();
    return () => stopTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTimer = () => {
    stopTimer();
    setSecondsLeft(RESEND_SECONDS);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (secs) => {
    const mm = Math.floor(secs / 60);
    const ss = secs % 60;
    return `${mm}:${ss.toString().padStart(2, "0")}`;
  };

  /* ================= OTP INPUT LOGIC (UNCHANGED) ================= */
  const updateOtpAt = (idx, val) => {
    setOtp((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const onChange = (e, idx) => {
    const digit = e.target.value.replace(/\D/g, "").slice(-1) || "";
    if (!digit) {
      updateOtpAt(idx, "");
      return;
    }

    updateOtpAt(idx, digit);

    if (idx + 1 < OTP_LENGTH) {
      inputsRef.current[idx + 1]?.focus();
    } else {
      inputsRef.current[idx]?.blur();
    }
  };

  const handleInputKeyDown = (e, idx) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
      return;
    }

    if (e.key === "Backspace") {
      if (otp[idx]) updateOtpAt(idx, "");
      else if (idx > 0) {
        updateOtpAt(idx - 1, "");
        inputsRef.current[idx - 1]?.focus();
      }
    }
  };

  const onPaste = (e) => {
    e.preventDefault();
    const digits = (e.clipboardData || window.clipboardData)
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    if (!digits.length) return;

    setOtp((prev) => {
      const copy = [...prev];
      for (let i = 0; i < OTP_LENGTH; i++) {
        copy[i] = digits[i] ?? "";
      }
      return copy;
    });

    inputsRef.current[Math.min(digits.length, OTP_LENGTH) - 1]?.focus();
  };

  const isComplete = otp.every((d) => d !== "");

  /* ================= SUBMIT (FIXED) ================= */
  const handleSubmit = () => {
    setAttemptedSubmit(true);
    setError("");
    setInfo("");

    if (!isComplete) {
      toast.error("Please enter the full 6-digit OTP");
      setError("Please enter the full 6-digit code.");
      return;
    }

    // ✅ STORE OTP (NO BACKEND CALL HERE)
    sessionStorage.setItem("reset_otp", otp.join(""));

    toast.success("OTP verified successfully ✅");
    navigate("resetNewPassword");
  };

  /* ================= UI (100% UNCHANGED) ================= */
  return (
    <div className="app-root">
      <div className="top-left-logo">
        <img src={finBankLogo} alt="FinBank Logo" className="top-logo-img" />
      </div>

      <div className="auth-card-single">
        <section className="signin-pane">
          <div className="signin-logo-circle">
            <img src={bankIcon} alt="Bank Icon" className="signin-logo-icon" />
          </div>

          <h1 className="signin-title">Reset Password</h1>
          <p className="signin-subtitle">
            Enter the OTP received through your email address
          </p>

          <div
            className="otp-row"
            onPaste={onPaste}
            style={{ justifyContent: "center" }}
          >
            {otp.map((v, idx) => (
              <input
                key={idx}
                ref={(el) => (inputsRef.current[idx] = el)}
                className="otp-input"
                value={v}
                maxLength={1}
                onChange={(e) => onChange(e, idx)}
                onKeyDown={(e) => handleInputKeyDown(e, idx)}
              />
            ))}
          </div>

          {info && <div className="form-info">{info}</div>}
          {attemptedSubmit && error && (
            <div className="form-error">{error}</div>
          )}

          <p className="otp-helper" style={{ textAlign: "center" }}>
            {!secondsLeft ? (
              <button className="link-button">
                Resend
              </button>
            ) : (
              <>Resend in {formatTime(secondsLeft)}</>
            )}
          </p>

          <button
            className="primary-button"
            onClick={handleSubmit}
            disabled={!isComplete}
          >
            Submit
          </button>

          <div className="signin-footer">
            <button
              className="link-button"
              onClick={() => navigate("resetEmail")}
            >
              Change Email
            </button>
            <button
              className="link-button"
              onClick={() => navigate("login")}
            >
              Back to Login
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
