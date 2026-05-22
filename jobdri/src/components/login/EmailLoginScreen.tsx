"use client";

import type {
  ClipboardEvent,
  Dispatch,
  FormEvent,
  KeyboardEvent,
  MutableRefObject,
  SetStateAction,
} from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  Button,
  IconOnlyButton,
  TextOnlyButton,
} from "@/components/common/buttons";
import { InputMain, InputSingleLine } from "@/components/common/input";
import { Tooltip } from "@/components/common/tooltip";
import { ROUTES } from "@/constants/routes";
import {
  AuthApiError,
  confirmEmailVerification,
  getGoogleAuthorizationUrl,
  loginWithEmail,
  saveAuthTokens,
  sendEmailVerification,
  signupWithEmail,
} from "@/lib/auth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/;
const passwordValidationMessage = "영문, 숫자 조합 8자 이상인지 확인해주세요";
const passwordMaxLengthMessage = "비밀번호는 최대 20자까지만 가능합니다";
const passwordMismatchMessage = "비밀번호가 일치하지 않습니다";
const verificationCodeLength = 6;
const initialVerificationCode = Array(verificationCodeLength).fill("");
const defaultVerificationErrorMessage = "인증번호를 다시 확인해주세요.";
const loginValidationErrorMessage = "이메일과 비밀번호를 확인해주세요";

export default function EmailLoginScreen() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<
    "login" | "signup" | "verify" | "success"
  >("login");
  const [showCreditTooltip, setShowCreditTooltip] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [verificationCode, setVerificationCode] = useState<string[]>(
    initialVerificationCode,
  );
  const [hasVerificationError, setHasVerificationError] = useState(false);
  const [verificationErrorMessage, setVerificationErrorMessage] = useState(
    defaultVerificationErrorMessage,
  );
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState(
    loginValidationErrorMessage,
  );
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [signupErrorMessage, setSignupErrorMessage] = useState("");
  const [isSignupSubmitting, setIsSignupSubmitting] = useState(false);
  const [isVerificationSubmitting, setIsVerificationSubmitting] =
    useState(false);
  const [isResendingVerificationCode, setIsResendingVerificationCode] =
    useState(false);
  const verificationInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isLoginReady = email.length > 0 && password.length > 0;
  const hasSignupEmailValidationError =
    authMode === "signup" && email.length > 0 && !emailPattern.test(email);
  const hasPasswordMaxLengthError = password.length > 20;
  const hasPasswordValidationError =
    password.length > 0 &&
    !hasPasswordMaxLengthError &&
    !passwordPattern.test(password);
  const passwordError = hasPasswordMaxLengthError
    ? passwordMaxLengthMessage
    : hasPasswordValidationError
      ? passwordValidationMessage
      : undefined;
  const hasPasswordMismatchError =
    passwordConfirm.length > 0 && passwordConfirm !== password;
  const isSignupReady =
    name.trim().length > 0 &&
    emailPattern.test(email) &&
    passwordPattern.test(password) &&
    passwordConfirm === password;
  const isVerificationReady =
    !hasVerificationError && verificationCode.every(Boolean);
  const displayedVerificationEmail = email || "example@gmail.com";

  useEffect(() => {
    if (!showCreditTooltip) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setShowCreditTooltip(false);
    }, 5000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [showCreditTooltip]);

  const hideCreditTooltip = () => {
    setShowCreditTooltip(false);
  };

  const handleInputChange = (
    value: string,
    setter: Dispatch<SetStateAction<string>>,
  ) => {
    setter(value);
    setLoginError(false);
    setLoginErrorMessage(loginValidationErrorMessage);
    setSignupErrorMessage("");
    setVerificationErrorMessage(defaultVerificationErrorMessage);
    hideCreditTooltip();
  };

  const handlePasswordChange = (value: string) => {
    handleInputChange(value, setPassword);

    if (value.length === 0) {
      setPasswordConfirm("");
    }
  };

  const handlePasswordConfirmChange = (value: string) => {
    handleInputChange(value, setPasswordConfirm);
  };

  const focusVerificationInput = (index: number) => {
    verificationInputRefs.current[index]?.focus();
  };

  useEffect(() => {
    if (authMode !== "verify" || hasVerificationError) {
      return;
    }

    window.requestAnimationFrame(() => {
      focusVerificationInput(0);
    });
  }, [authMode, hasVerificationError]);

  const resetVerificationToInitial = () => {
    setVerificationCode([...initialVerificationCode]);
    setHasVerificationError(false);
    window.requestAnimationFrame(() => {
      focusVerificationInput(0);
    });
  };

  const fillVerificationCode = (startIndex: number, value: string) => {
    const digits = value.replace(/\D/g, "");

    if (!digits) {
      setVerificationCode((prevCode) =>
        prevCode.map((digit, index) => (index === startIndex ? "" : digit)),
      );
      return;
    }

    const nextCode = [...verificationCode];
    const slicedDigits = digits.slice(0, verificationCodeLength - startIndex);

    slicedDigits.split("").forEach((digit, offset) => {
      nextCode[startIndex + offset] = digit;
    });

    setVerificationCode(nextCode);

    const nextIndex = Math.min(
      startIndex + slicedDigits.length,
      verificationCodeLength - 1,
    );
    window.requestAnimationFrame(() => {
      focusVerificationInput(nextIndex);
    });
  };

  const handleVerificationCodeChange = (index: number, value: string) => {
    if (hasVerificationError) {
      resetVerificationToInitial();
      return;
    }

    fillVerificationCode(index, value);
  };

  const handleVerificationCodeFocus = () => {
    if (hasVerificationError) {
      resetVerificationToInitial();
    }
  };

  const handleVerificationCodeKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !verificationCode[index] && index > 0) {
      focusVerificationInput(index - 1);
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusVerificationInput(index - 1);
      return;
    }

    if (event.key === "ArrowRight" && index < verificationCodeLength - 1) {
      event.preventDefault();
      focusVerificationInput(index + 1);
    }
  };

  const handleVerificationCodePaste = (
    index: number,
    event: ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    fillVerificationCode(index, event.clipboardData.getData("text"));
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      isLoginSubmitting ||
      !isLoginReady ||
      !emailPattern.test(email) ||
      !passwordPattern.test(password)
    ) {
      setLoginError(true);
      setLoginErrorMessage(loginValidationErrorMessage);
      return;
    }

    setLoginError(false);
    setIsLoginSubmitting(true);
    hideCreditTooltip();

    try {
      const tokens = await loginWithEmail({ email, password });
      saveAuthTokens(tokens, email);
      router.push(ROUTES.APPLY);
    } catch (error) {
      setLoginError(true);
      setLoginErrorMessage(
        error instanceof AuthApiError
          ? error.errorDetail || error.message
          : "로그인 중 문제가 발생했습니다.",
      );
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.assign(getGoogleAuthorizationUrl());
  };

  const handleSignupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSignupSubmitting || !isSignupReady || !emailPattern.test(email)) {
      return;
    }

    setSignupErrorMessage("");
    setIsSignupSubmitting(true);

    try {
      await sendEmailVerification({ email });
      setVerificationCode([...initialVerificationCode]);
      setHasVerificationError(false);
      setVerificationErrorMessage(defaultVerificationErrorMessage);
      setAuthMode("verify");
    } catch (error) {
      setSignupErrorMessage(
        error instanceof AuthApiError
          ? error.errorDetail || error.message
          : "인증번호 발송 중 문제가 발생했습니다.",
      );
    } finally {
      setIsSignupSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isVerificationSubmitting || !isVerificationReady) {
      return;
    }

    setIsVerificationSubmitting(true);

    try {
      await confirmEmailVerification({
        email,
        code: verificationCode.join(""),
      });
      await signupWithEmail({
        name: name.trim(),
        email,
        password,
      });
      setAuthMode("success");
      setVerificationCode([...initialVerificationCode]);
      setHasVerificationError(false);
      setVerificationErrorMessage(defaultVerificationErrorMessage);
    } catch (error) {
      setVerificationCode([...initialVerificationCode]);
      setHasVerificationError(true);
      setVerificationErrorMessage(
        error instanceof AuthApiError
          ? error.errorDetail || error.message
          : defaultVerificationErrorMessage,
      );

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    } finally {
      setIsVerificationSubmitting(false);
    }
  };

  const handleModeChange = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setLoginError(false);
    setSignupErrorMessage("");
    setVerificationErrorMessage(defaultVerificationErrorMessage);
    setName("");
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setVerificationCode([...initialVerificationCode]);
    setHasVerificationError(false);
    hideCreditTooltip();
  };

  const handleVerificationSuccessConfirm = () => {
    handleModeChange("login");
  };

  const handleBackToSignup = () => {
    setAuthMode("signup");
    setVerificationCode([...initialVerificationCode]);
    setHasVerificationError(false);
    setVerificationErrorMessage(defaultVerificationErrorMessage);
    hideCreditTooltip();
  };

  const handleResendVerificationCode = async () => {
    if (isResendingVerificationCode) {
      return;
    }

    resetVerificationToInitial();
    setVerificationErrorMessage(defaultVerificationErrorMessage);
    setIsResendingVerificationCode(true);

    try {
      await sendEmailVerification({ email });
    } catch (error) {
      setHasVerificationError(true);
      setVerificationErrorMessage(
        error instanceof AuthApiError
          ? error.errorDetail || error.message
          : "인증번호 재발송 중 문제가 발생했습니다.",
      );
    } finally {
      setIsResendingVerificationCode(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-start bg-bg-default">
      <section className="flex min-h-screen w-full flex-col items-start self-stretch">
        <div className="flex flex-[1_0_0] flex-col items-center gap-20 self-stretch px-20 pt-[10vh] pb-[120px]">
          <form
            className={clsx(
              "relative flex w-[440px] max-w-[calc(100vw-32px)] flex-col items-center justify-center rounded-card bg-bg-contents-default shadow-[0_0_24px_0_var(--color-bg-shadow-default)]",
              authMode === "verify"
                ? "gap-0 p-0"
                : authMode === "success"
                  ? "gap-9 p-10"
                  : "gap-8 p-10",
            )}
            noValidate
            onSubmit={
              authMode === "login"
                ? handleLoginSubmit
                : authMode === "signup"
                  ? handleSignupSubmit
                  : authMode === "verify"
                    ? handleVerificationSubmit
                    : undefined
            }
          >
            {authMode === "verify" ? (
              <EmailVerificationContent
                email={displayedVerificationEmail}
                verificationCode={verificationCode}
                verificationInputRefs={verificationInputRefs}
                hasVerificationError={hasVerificationError}
                verificationErrorMessage={verificationErrorMessage}
                isVerificationReady={isVerificationReady}
                isSubmitting={isVerificationSubmitting}
                isResending={isResendingVerificationCode}
                onBack={handleBackToSignup}
                onCodeChange={handleVerificationCodeChange}
                onCodeFocus={handleVerificationCodeFocus}
                onCodeKeyDown={handleVerificationCodeKeyDown}
                onCodePaste={handleVerificationCodePaste}
                onResend={handleResendVerificationCode}
              />
            ) : authMode === "success" ? (
              <EmailVerificationSuccessContent
                onConfirm={handleVerificationSuccessConfirm}
              />
            ) : (
              <>
                <header className="flex flex-col items-center gap-6 self-stretch">
                  <h1 className="text-center text-[32px] leading-[130%] font-bold tracking-[-0.02em] text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                    JobDri
                  </h1>

                  <div className="flex flex-col items-center gap-2 self-stretch">
                    <p className="text-t20-semibold text-center text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                      인사담당자가 보는 내 자소서는 몇점?
                    </p>
                    <p className="text-sub14-med text-center text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
                      내 경험을 살린 합격 자소서를 완성해보세요
                    </p>
                  </div>
                </header>

                {authMode === "login" ? (
                  <>
                    <div className="flex flex-col items-center gap-6 self-stretch">
                      <div className="flex flex-col items-start gap-5 self-stretch">
                        <div className="flex flex-col items-start gap-2 self-stretch">
                          <InputMain
                            name="email"
                            type="ID"
                            inputType="email"
                            autoComplete="email"
                            placeholder="내용을 입력해주세요."
                            value={email}
                            disabled={isLoginSubmitting}
                            hasError={loginError}
                            className="self-stretch"
                            onChange={(value) =>
                              handleInputChange(value, setEmail)
                            }
                          />
                          <InputMain
                            name="password"
                            type="PASSWORD"
                            inputType="password"
                            autoComplete="current-password"
                            placeholder="내용을 입력해주세요."
                            value={password}
                            disabled={isLoginSubmitting}
                            error={loginError ? loginErrorMessage : undefined}
                            className="self-stretch"
                            onChange={handlePasswordChange}
                          />
                        </div>

                        <Button
                          label={isLoginSubmitting ? "로그인 중" : "로그인"}
                          styleType="secondary"
                          size="large"
                          active={isLoginReady}
                          className="self-stretch"
                          disabled={!isLoginReady || isLoginSubmitting}
                          type="submit"
                        />
                      </div>

                      <AuthDivider />

                      <Button
                        label="Google 계정으로 계속하기"
                        styleType="quaternary"
                        size="large"
                        iconType="GOOGLE"
                        className="self-stretch"
                        onClick={handleGoogleLogin}
                      />
                    </div>

                    <footer className="flex items-center justify-center gap-7 self-stretch">
                      <TextOnlyButton
                        label="비밀번호 재설정"
                        size="small"
                        styleType="secondary"
                      />
                      <TextOnlyButton
                        label="회원가입"
                        size="small"
                        styleType="primary"
                        onClick={() => handleModeChange("signup")}
                      />
                    </footer>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center gap-6 self-stretch">
                      <div className="flex flex-col items-start gap-5 self-stretch">
                        <div className="flex flex-col items-start gap-2 self-stretch">
                          <InputMain
                            label="이름"
                            name="signup-name"
                            type="ID"
                            inputType="text"
                            autoComplete="name"
                            placeholder="내용을 입력해주세요."
                            value={name}
                            disabled={isSignupSubmitting}
                            className="self-stretch"
                            onChange={(value) =>
                              handleInputChange(value, setName)
                            }
                          />
                          <InputMain
                            label="이메일 주소"
                            name="signup-email"
                            type="EMAIL"
                            inputType="email"
                            autoComplete="email"
                            placeholder="이메일 주소를 입력해주세요."
                            value={email}
                            disabled={isSignupSubmitting}
                            hasError={
                              hasSignupEmailValidationError ||
                              Boolean(signupErrorMessage)
                            }
                            error={signupErrorMessage || undefined}
                            className="self-stretch"
                            onChange={(value) =>
                              handleInputChange(value, setEmail)
                            }
                          />
                          <InputMain
                            label="비밀번호"
                            name="signup-password"
                            type="PASSWORD"
                            inputType="password"
                            autoComplete="new-password"
                            placeholder="내용을 입력해주세요."
                            value={password}
                            disabled={isSignupSubmitting}
                            error={passwordError}
                            className="self-stretch"
                            onChange={handlePasswordChange}
                          />
                          <InputMain
                            label="비밀번호 확인"
                            name="signup-password-confirm"
                            type="PASSWORD"
                            inputType="password"
                            autoComplete="new-password"
                            placeholder="내용을 입력해주세요."
                            value={passwordConfirm}
                            disabled={
                              password.length === 0 || isSignupSubmitting
                            }
                            error={
                              hasPasswordMismatchError
                                ? passwordMismatchMessage
                                : undefined
                            }
                            className="self-stretch"
                            onChange={handlePasswordConfirmChange}
                          />
                        </div>

                        <Button
                          label={
                            isSignupSubmitting ? "인증번호 발송 중" : "회원가입"
                          }
                          styleType="secondary"
                          size="large"
                          active={isSignupReady}
                          className="self-stretch"
                          disabled={!isSignupReady || isSignupSubmitting}
                          type="submit"
                        />
                      </div>

                      <AuthDivider />

                      <Button
                        label="Google 계정으로 계속하기"
                        styleType="quaternary"
                        size="large"
                        iconType="GOOGLE"
                        className="self-stretch"
                        onClick={handleGoogleLogin}
                      />
                    </div>

                    <footer className="flex items-center justify-center gap-3 self-stretch">
                      <span className="text-label14-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
                        이미 계정이 있으신가요?
                      </span>
                      <TextOnlyButton
                        label="로그인"
                        size="small"
                        styleType="primary"
                        onClick={() => handleModeChange("login")}
                      />
                    </footer>
                  </>
                )}

                {authMode === "login" && showCreditTooltip && (
                  <div className="pointer-events-none absolute right-[86px] bottom-[-16px]">
                    <Tooltip placement="up_mid" />
                  </div>
                )}
              </>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}

interface EmailVerificationContentProps {
  email: string;
  verificationCode: string[];
  verificationInputRefs: MutableRefObject<Array<HTMLInputElement | null>>;
  hasVerificationError: boolean;
  verificationErrorMessage: string;
  isVerificationReady: boolean;
  isSubmitting: boolean;
  isResending: boolean;
  onBack: () => void;
  onCodeChange: (index: number, value: string) => void;
  onCodeFocus: () => void;
  onCodeKeyDown: (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => void;
  onCodePaste: (index: number, event: ClipboardEvent<HTMLInputElement>) => void;
  onResend: () => void;
}

function EmailVerificationContent({
  email,
  verificationCode,
  verificationInputRefs,
  hasVerificationError,
  verificationErrorMessage,
  isVerificationReady,
  isSubmitting,
  isResending,
  onBack,
  onCodeChange,
  onCodeFocus,
  onCodeKeyDown,
  onCodePaste,
  onResend,
}: EmailVerificationContentProps) {
  return (
    <>
      <div className="flex items-start gap-2.5 self-stretch px-7 pt-6">
        <IconOnlyButton
          iconType="ARROW_L"
          aria-label="회원가입 화면으로 돌아가기"
          onClick={onBack}
        />
      </div>

      <div className="flex flex-col items-start gap-9 self-stretch px-10 pb-10">
        <header className="flex flex-col items-center gap-6 self-stretch">
          <h1 className="text-center text-[32px] leading-[130%] font-bold tracking-[-0.02em] text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
            JobDri
          </h1>

          <div className="flex flex-col items-center gap-2 self-stretch">
            <p className="text-t20-semibold text-center text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
              이메일 인증하기
            </p>
            <div className="flex flex-col items-center">
              <p className="text-sub14-med text-center text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
                {email}
              </p>
              <p className="text-sub14-med text-center text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
                (으)로 전송한 6자리 코드를 입력해주세요
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-col items-center gap-6 self-stretch">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-start justify-center gap-3">
              {verificationCode.map((digit, index) => (
                <InputSingleLine
                  key={index}
                  ref={(input) => {
                    verificationInputRefs.current[index] = input;
                  }}
                  value={digit}
                  onChange={(value) => onCodeChange(index, value)}
                  onFocus={onCodeFocus}
                  onKeyDown={(event) => onCodeKeyDown(index, event)}
                  onPaste={(event) => onCodePaste(index, event)}
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  disabled={isSubmitting}
                  aria-label={`인증번호 ${index + 1}번째 자리`}
                  className="!w-[47px] gap-0"
                  wrapperClassName="h-[63px] w-[47px]"
                  inputClassName="h-full text-center !text-[24px] !leading-[130%] !font-medium !tracking-[-0.02em] !text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]"
                  paddingClass="p-0"
                  radiusClass="rounded-card-s"
                  focusedBorder="border-line-primary-default"
                  hasError={hasVerificationError}
                />
              ))}
            </div>

            {hasVerificationError && (
              <p className="text-cap12-med text-center text-text-system-fail [font-feature-settings:'liga'_off,'clig'_off]">
                {verificationErrorMessage}
              </p>
            )}
          </div>

          <div
            className={clsx(
              "flex items-center justify-center gap-1 self-stretch",
              hasVerificationError && "hidden",
            )}
          >
            <span className="text-sub14-reg text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
              인증코드가 오지 않았나요?
            </span>
            <TextOnlyButton
              label={isResending ? "보내는 중" : "다시 보내기"}
              size="small"
              styleType="primary"
              disabled={isResending}
              onClick={onResend}
            />
          </div>
        </div>

        <Button
          label={isSubmitting ? "처리 중" : "회원가입"}
          styleType="secondary"
          size="large"
          active={isVerificationReady}
          disabled={!isVerificationReady || isSubmitting}
          className="self-stretch"
          type="submit"
        />
      </div>
    </>
  );
}

interface EmailVerificationSuccessContentProps {
  onConfirm: () => void;
}

function EmailVerificationSuccessContent({
  onConfirm,
}: EmailVerificationSuccessContentProps) {
  return (
    <>
      <header className="flex flex-col items-center gap-6 self-stretch">
        <h1 className="text-center text-[32px] leading-[130%] font-bold tracking-[-0.02em] text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
          JobDri
        </h1>

        <p className="text-t20-semibold text-center whitespace-pre-line text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
          {"환영합니다.\n회원가입이 완료되었습니다!"}
        </p>
      </header>

      <Button
        label="확인"
        styleType="primary"
        size="large"
        className="self-stretch"
        onClick={onConfirm}
      />
    </>
  );
}

function AuthDivider() {
  return (
    <div className="flex items-center justify-center gap-5 self-stretch">
      <span className="h-[0.75px] flex-1 bg-line-neutral-default" />
      <span className="flex items-center justify-center gap-2.5 text-label14-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
        또는
      </span>
      <span className="h-[0.75px] flex-1 bg-line-neutral-default" />
    </div>
  );
}
