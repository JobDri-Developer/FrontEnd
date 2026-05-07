import IconBox from "@/components/icons/IconBox";
import CheckBox from "@/components/icons/CheckBox";
import Header from "@/components/header/Header";
import { Lnb } from "@/components/lnb";
import {
  Button,
  ButtonCta,
  ButtonCtaModal,
  IconButton,
  IconOnlyButton,
  TextButton,
} from "@/components/buttons";
import { Toast, ToastFrame } from "@/components/toast";
import {
  ChipMain,
  ChipRound,
  ChipRoundSelected,
  ChipQnumber,
} from "@/components/chips";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-h28-bold">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="p-10 flex flex-col gap-10 ">
      <Section title="Header">
        <div className="w-full">
          <Header />
        </div>
      </Section>

      <Section title="Toast">
        <div className="flex w-full max-w-[594px] flex-col gap-5">
          <Toast />
          <Toast variant="check" />
          <Toast variant="warning" />
          <Toast variant="dark" />
        </div>
      </Section>

      <Section title="Toast/Frame">
        <ToastFrame />
      </Section>

      <Section title="Button — Primary">
        <div className="flex items-center gap-4">
          <Button label="기업 선택하기" iconType="HOME_S" size="large" />
          <Button label="기업 선택하기" iconType="HOME_S" size="medium" />
          <Button label="기업 선택하기" iconType="HOME_S" size="small" />
        </div>
      </Section>

      <Section title="Button — Secondary">
        <div className="flex items-center gap-4">
          <Button
            label="기업 선택하기"
            iconType="HOME_S"
            size="large"
            styleType="secondary"
          />
          <Button
            label="기업 선택하기"
            iconType="HOME_S"
            size="medium"
            styleType="secondary"
          />
          <Button
            label="기업 선택하기"
            iconType="HOME_S"
            size="small"
            styleType="secondary"
          />
        </div>
      </Section>

      <Section title="Button — Tertiary">
        <div className="flex items-center gap-4">
          <Button
            label="기업 선택하기"
            iconType="HOME_S"
            size="large"
            styleType="tertiary"
          />
          <Button
            label="기업 선택하기"
            iconType="HOME_S"
            size="medium"
            styleType="tertiary"
          />
          <Button
            label="기업 선택하기"
            iconType="HOME_S"
            size="small"
            styleType="tertiary"
          />
          <Button
            label="기업 선택하기"
            iconType="SPARKLE"
            size="xsmall"
            styleType="tertiary"
          />
        </div>
      </Section>

      <Section title="Button — Quaternary">
        <div className="flex items-center gap-4">
          <Button
            label="기업 선택하기"
            iconType="HOME_S"
            size="large"
            styleType="quaternary"
          />
          <Button
            label="기업 선택하기"
            iconType="HOME_S"
            size="medium"
            styleType="quaternary"
          />
          <Button
            label="기업 선택하기"
            iconType="HOME_S"
            size="small"
            styleType="quaternary"
          />
        </div>
      </Section>

      <Section title="Button — Inactive">
        <div className="flex items-center gap-4">
          <Button
            label="기업 선택하기"
            iconType="HOME_S"
            size="large"
            active={false}
          />
          <Button
            label="기업 선택하기"
            iconType="HOME_S"
            size="medium"
            styleType="secondary"
            active={false}
          />
          <Button
            label="기업 선택하기"
            iconType="HOME_S"
            size="small"
            styleType="quaternary"
            active={false}
          />
          <Button
            label="기업 선택하기"
            iconType="SPARKLE"
            size="xsmall"
            styleType="tertiary"
            active={false}
          />
        </div>
      </Section>

      <Section title="IconContainer Arrow">
        <div className="flex items-center gap-6">
          <IconButton direction="left" />
          <IconButton direction="right" />
          <IconButton direction="left" active />
          <IconButton direction="right" active />
        </div>
      </Section>

      <Section title="Button/Icon">
        <div className="flex items-center gap-6">
          <IconOnlyButton tone="light" />
          <IconOnlyButton tone="dark" />
        </div>
      </Section>

      <Section title="CTA">
        <div className="flex flex-wrap items-start gap-8">
          <ButtonCta className="w-[456px]" />
          <ButtonCta variant="gradient_dark" className="w-[456px]" />
          <ButtonCta variant="empty_white" className="w-[456px]" />
          <ButtonCta variant="empty_dark" className="w-[456px]" />
        </div>
      </Section>

      <Section title="Button/CTA/ModalButton">
        <div className="flex w-[480px] flex-col gap-8">
          <ButtonCtaModal />
          <ButtonCtaModal stack="stack2_horizontal" />
          <ButtonCtaModal stack="stack3_vertical" />
        </div>
      </Section>

      <Section title="Button/Text">
        <div className="flex items-center gap-8">
          <TextButton size="small" styleType="primary" />
          <TextButton size="large" styleType="primary" />
          <TextButton size="small" styleType="secondary" />
          <TextButton size="large" styleType="secondary" />
          <TextButton size="large" styleType="primary" iconPosition="left" />
          <TextButton size="large" styleType="secondary" iconPosition="left" />
        </div>
      </Section>

      <Section title="IconBox">
        <IconBox type="TRASH" />
        <IconBox type="HOME_M" />
        <IconBox type="SPARKLE" />
      </Section>

      <Section title="CheckBox">
        <CheckBox type="DEFAULT" />
        <CheckBox type="RADIO_L" />
        <CheckBox type="RADIO_M" />
      </Section>

      <Section title="ChipMain — Mid">
        <ChipMain label="primary" color="primary" />
        <ChipMain label="primary inactive" color="primary" active={false} />
        <ChipMain label="secondary" color="secondary" />
        <ChipMain label="secondary inactive" color="secondary" active={false} />
        <ChipMain label="tertiary" color="tertiary" />
        <ChipMain label="tertiary inactive" color="tertiary" active={false} />
        <ChipMain label="quaternary" color="quaternary" />
        <ChipMain
          label="quaternary inactive"
          color="quaternary"
          active={false}
        />
      </Section>

      <Section title="ChipMain — Small">
        <ChipMain label="primary" color="primary" size="small" />
        <ChipMain label="secondary" color="secondary" size="small" />
        <ChipMain label="tertiary" color="tertiary" size="small" />
        <ChipMain label="quaternary" color="quaternary" size="small" />
      </Section>

      <Section title="ChipRound">
        <ChipRound label="strong" variant="strong" />
        <ChipRound label="normal" variant="normal" />
        <ChipRound label="assistive" variant="assistive" />
      </Section>

      <Section title="ChipRoundSelected">
        <ChipRoundSelected label="mid" />
        <ChipRoundSelected label="mid selected" selected />
      </Section>

      <Section title="ChipQnumber">
        <ChipQnumber number={1} showComplete />
        <ChipQnumber number={1} showComplete selected />
        <ChipQnumber number={2} />
        <ChipQnumber number={2} selected />
      </Section>
    </div>
  );
}
