"use client";

import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { Button, TextOnlyButton } from "@/components/buttons";
import { InputMain } from "@/components/input";
import { Tooltip } from "@/components/tooltip";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

export default function EmailLoginScreen() {
  const [showCreditTooltip, setShowCreditTooltip] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const isLoginReady = email.length > 0 && password.length > 0;

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
    hideCreditTooltip();
  };

  const handlePasswordChange = (value: string) => {
    if (value.length > 20) {
      return;
    }

    handleInputChange(value, setPassword);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !isLoginReady ||
      !emailPattern.test(email) ||
      !passwordPattern.test(password)
    ) {
      setLoginError(true);
      return;
    }

    setLoginError(true);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-start bg-bg-default">
      <section className="flex min-h-screen w-full flex-col items-start self-stretch">
        <div className="flex flex-[1_0_0] flex-col items-center gap-20 self-stretch px-20 pt-[10vh] pb-[120px]">
          <form
            className="relative flex w-[440px] max-w-[calc(100vw-32px)] flex-col items-center justify-center gap-8 rounded-card bg-bg-contents-default p-10 shadow-[0_0_24px_0_var(--color-bg-shadow-default)]"
            noValidate
            onSubmit={handleSubmit}
          >
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
                    hasError={loginError}
                    className="self-stretch"
                    onChange={(value) => handleInputChange(value, setEmail)}
                  />
                  <InputMain
                    name="password"
                    type="PASSWORD"
                    inputType="password"
                    autoComplete="current-password"
                    placeholder="내용을 입력해주세요."
                    value={password}
                    error={loginError ? "이메일과 비밀번호를 확인해주세요" : undefined}
                    className="self-stretch"
                    onChange={handlePasswordChange}
                  />
                </div>

                <Button
                  label="로그인"
                  styleType="secondary"
                  size="large"
                  active={isLoginReady}
                  className="self-stretch"
                  disabled={!isLoginReady}
                  type="submit"
                />
              </div>

              <div className="flex items-center justify-center gap-5 self-stretch">
                <span className="h-[0.75px] flex-1 bg-line-neutral-default" />
                <span className="flex items-center justify-center gap-2.5 text-label14-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
                  또는
                </span>
                <span className="h-[0.75px] flex-1 bg-line-neutral-default" />
              </div>

              <Button
                label="Google 계정으로 계속하기"
                styleType="quaternary"
                size="large"
                iconType="GOOGLE"
                className="self-stretch"
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
              />
            </footer>

            {showCreditTooltip && (
              <div className="pointer-events-none absolute right-[86px] bottom-[-16px]">
                <Tooltip placement="up_mid" />
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
