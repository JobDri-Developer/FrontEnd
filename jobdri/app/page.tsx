import IconBox from "@/components/common/icons/IconBox";
import CheckBox from "@/components/common/icons/CheckBox";
import Header from "@/components/common/header/Header";
import { Footer } from "@/components/common/footer";
import { DropDown } from "@/components/common/dropdown";
import { Lnb } from "@/components/common/lnb";
import {
  Button,
  ButtonCta,
  ButtonCtaModal,
  IconButton,
  IconOnlyButton,
  TextButton,
  TextOnlyButton,
} from "@/components/common/buttons";
import { Toast, ToastFrame } from "@/components/common/toast";
import {
  ChipQnumber,
  ChipRound,
  ChipRoundSelected,
  ChipTag,
} from "@/components/common/chips";
import ChipMainDemo from "@/components/common/chips/ChipMainDemo";
import ModalLinkInputDemo from "@/components/common/modal/ModalLinkInputDemo";
import { ModalNotice } from "@/components/common/modal";
import { CompleteBadge } from "@/components/common/badges";
import {
  ProgressPanelRow,
  ProgressSidebar,
} from "@/components/common/progress";
import { Tooltip, TooltipModify } from "@/components/common/tooltip";
import { TabMenuThree, TabMenuTwo } from "@/components/common/tabs";
import { CreditHeader, CreditRow } from "@/components/common/credit";
import { SearchBar } from "@/components/common/searchbar";
import {
  InputAutoGrow,
  InputFile,
  InputMain,
  InputModalQuestion,
  InputMultiLine,
  InputMultiLine1000,
  InputSingleLine,
} from "@/components/common/input";

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
      <Section title="LNB">
        <div className="overflow-hidden rounded-card-s border border-line-neutral-default">
          <Lnb initialActiveItem="apply" />
        </div>
      </Section>
      <Section title="Footer">
        <div className="w-full">
          <Footer />
        </div>
      </Section>
      <Section title="DropDown">
        <div className="flex items-start gap-8">
          <DropDown />
        </div>
      </Section>
      <Section title="Progress — PanelRow">
        <div className="flex flex-col gap-5 rounded-card-s bg-bg-default p-8">
          <div className="flex items-start gap-8">
            <span className="w-6 shrink-0 text-h28-bold">3</span>
            <ProgressPanelRow itemCount={3} />
          </div>
          <div className="flex items-start gap-8">
            <span className="w-6 shrink-0 text-h28-bold">4</span>
            <ProgressPanelRow itemCount={4} />
          </div>
        </div>
      </Section>
      <Section title="Progress — Sidebar">
        <ProgressSidebar />
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
      <Section title="Button/TextOnly">
        <div className="flex items-center gap-8">
          <TextOnlyButton size="small" styleType="primary" />
          <TextOnlyButton size="large" styleType="primary" />
          <TextOnlyButton size="small" styleType="secondary" />
          <TextOnlyButton size="large" styleType="secondary" />
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
        <ChipMainDemo />
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
      <Section title="ChipTag">
        <ChipTag label="데이터분석" />
      </Section>
      <Section title="ChipQnumber">
        <ChipQnumber number={1} showComplete />
        <ChipQnumber number={1} showComplete selected />
        <ChipQnumber number={2} />
        <ChipQnumber number={2} selected />
      </Section>
      <Section title="Modal — LinkInput">
        <ModalLinkInputDemo />
      </Section>{" "}
      <Section title="Modal — Notice">
        <div className="flex flex-wrap items-start gap-9">
          <ModalNotice />
          <ModalNotice variant="double" />
        </div>
      </Section>
      <Section title="SearchBar">
        <div className="w-[500px]">
          <SearchBar />
        </div>
      </Section>
      <Section title="InputMain">
        <div className="flex flex-col gap-4 ">
          <InputMain
            label="라벨"
            required
            placeholder="내용을 입력해주세요."
            disabled
            rightContent="최대 20자"
          />
          <InputMain
            label="라벨"
            required
            placeholder="내용을 입력해주세요."
            rightContent="최대 20자"
          />
          <InputMain
            label="라벨"
            required
            value="한 개수기"
            rightContent="최대 20자"
            error="에러 메시지가 들어갑니다."
          />
        </div>
      </Section>
      <Section title="InputSingleLine">
        <div className="flex flex-col gap-4 ">
          <InputSingleLine placeholder="내용을 입력해주세요." disabled />
          <InputSingleLine placeholder="내용을 입력해주세요." />
        </div>
      </Section>
      <Section title="InputModalQuestion">
        <InputModalQuestion />
      </Section>
      <Section title="InputMultiLine">
        <div className="flex flex-col gap-4 w-[360px]">
          <InputMultiLine placeholder="내용을 입력해주세요." />
        </div>
      </Section>
      <Section title="InputMultiLine1000">
        <div className="flex flex-col gap-4 w-[360px]">
          <InputMultiLine1000 placeholder="내용을 입력해주세요." />
        </div>
      </Section>
      <Section title="InputAutoGrow">
        <div className="flex flex-col gap-4 w-[360px]">
          <InputAutoGrow placeholder="내용을 입력해주세요." />
        </div>
      </Section>
      <Section title="InputFile">
        <div className="w-[480px]">
          <InputFile />
          <Section title="Complete">
            <CompleteBadge />
          </Section>

          <Section title="Tooltip">
            <div className="grid w-full grid-cols-3 items-start gap-x-0 gap-y-6">
              <div className="flex flex-col items-start gap-8">
                <Tooltip placement="right_mid" />
                <Tooltip placement="left_mid" />
                <Tooltip
                  placement="left_up"
                  lines={["1회 크레딧 무료 증정", "1회 크레딧 무료 증정"]}
                />
              </div>

              <div className="flex flex-col items-start gap-8">
                <Tooltip placement="up_mid" />
                <Tooltip placement="up_left" />
                <Tooltip placement="up_right" />
              </div>

              <div className="flex flex-col items-start gap-8">
                <Tooltip placement="down_left" />
                <Tooltip placement="down_mid" />
                <Tooltip placement="down_right" />
              </div>
            </div>
          </Section>

          <Section title="Tooltip/Modify">
            <TooltipModify />
          </Section>

          <Section title="Tab Menu 2">
            <TabMenuTwo />
          </Section>

          <Section title="Tab Menu 3">
            <TabMenuThree />
          </Section>
        </div>
      </Section>
      <Section title="CreditHeader">
        <CreditHeader />
      </Section>
      <Section title="CreditRow">
        <div className="flex flex-col gap-8">
          <CreditRow />
          <CreditRow variant="assistive" dateTime="2026.04.07 오후 10:02" />
        </div>
      </Section>
    </div>
  );
}
