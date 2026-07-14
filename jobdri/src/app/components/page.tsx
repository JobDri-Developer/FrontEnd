import {
  Button,
  IconButton,
  IconOnlyButton,
  TextButton,
  TextOnlyButton,
  type ButtonSize,
  type ButtonStyle,
  type TextButtonSize,
  type TextButtonStyle,
  type TextOnlyButtonSize,
  type TextOnlyButtonStyle,
} from "@/components/common/buttons";
import { CtaFooter } from "@/components/common/cta";
import Header from "@/components/common/header/Header";
import {
  InputTextAreaAutoGrowS,
  InputTextAreaFixedL,
  InputTextAreaFixedS,
  JDInput,
  LLMInput,
} from "@/components/common/input";
import {
  defaultNotificationItems,
  Lnb,
  LnbNotificationPanel,
} from "@/components/common/lnb";
import { Select, type SelectOption } from "@/components/common/select";

const textOnlyButtonSizes: TextOnlyButtonSize[] = ["large", "small"];
const textOnlyButtonStyles: TextOnlyButtonStyle[] = ["primary", "secondary"];

const iconTextButtonRows: Array<{
  styleType: TextButtonStyle;
  size: TextButtonSize;
}> = [
  { styleType: "primary", size: "small" },
  { styleType: "primary", size: "large" },
  { styleType: "secondary", size: "small" },
  { styleType: "secondary", size: "large" },
];

const iconButtonGroups = [
  {
    styleType: "weak",
    buttonType: "transparent",
    items: [
      { size: "xs", iconType: "CLOSE" },
      { size: "s", iconType: "CLOSE_S" },
      { size: "m", iconType: "CLOSE_M" },
      { size: "l", iconType: "CLOSE_M" },
    ],
  },
  {
    styleType: "normal",
    buttonType: "transparent",
    items: [
      { size: "xs", iconType: "CLOSE" },
      { size: "s", iconType: "CLOSE_S" },
      { size: "m", iconType: "CLOSE_M" },
      { size: "l", iconType: "CLOSE_M" },
    ],
  },
  {
    styleType: "normal",
    buttonType: "fill",
    items: [
      { size: "xs", iconType: "CLOSE" },
      { size: "s", iconType: "CLOSE_S" },
      { size: "m", iconType: "CLOSE_M" },
      { size: "l", iconType: "CLOSE_M" },
    ],
  },
  {
    styleType: "warning",
    buttonType: "transparent",
    items: [
      { size: "s", iconType: "CLOSE_S" },
      { size: "m", iconType: "CLOSE_M" },
      { size: "l", iconType: "CLOSE_M" },
    ],
  },
] as const;

const boxButtonGroups: Array<{
  styleType: ButtonStyle;
  sizes: ButtonSize[];
}> = [
  { styleType: "primary", sizes: ["large", "medium", "small"] },
  { styleType: "secondary", sizes: ["large", "medium", "small"] },
  { styleType: "tertiary", sizes: ["large", "medium", "small", "xsmall"] },
  { styleType: "quaternary", sizes: ["large", "medium", "small"] },
  { styleType: "error", sizes: ["large", "medium", "small"] },
];

const maxLengthOptions: SelectOption[] = [
  { label: "300자", value: "300" },
  { label: "500자", value: "500" },
  { label: "800자", value: "800" },
  { label: "1,000자", value: "1000" },
  { label: "1,500자", value: "1500" },
  { label: "2,000자", value: "2000" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-t20-semibold text-text-neutral-title">{children}</h2>
  );
}

function ComponentGroup({
  children,
  dark = false,
}: {
  label?: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={
          dark
            ? "flex min-h-[96px] flex-wrap items-center gap-4 bg-fill-tertiary-default p-6"
            : "flex min-h-[96px] flex-wrap items-center gap-4"
        }
      >
        {children}
      </div>
    </div>
  );
}

function BoxButtonMatrix() {
  const getIconType = (size: ButtonSize) =>
    size === "xsmall"
      ? "SPARKLE_16"
      : size === "small"
        ? "HOME_20"
        : "HOME_M";

  return (
    <div className="flex flex-col gap-10">
      {boxButtonGroups.map(({ styleType, sizes }) => (
        <div
          key={styleType}
          className="grid grid-cols-[repeat(2,max-content)] justify-items-start gap-x-6 gap-y-4"
        >
          {sizes.map((size) => (
            <div key={`${styleType}-${size}`} className="contents">
              <Button
                key={`${styleType}-${size}-default`}
                label="기업 선택하기"
                size={size}
                styleType={styleType}
                iconType={getIconType(size)}
                rightIconType={getIconType(size)}
              />
              <Button
                key={`${styleType}-${size}-disabled`}
                label="기업 선택하기"
                size={size}
                styleType={styleType}
                iconType={getIconType(size)}
                rightIconType={getIconType(size)}
                disabled
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function getTextButtonLeftIcon(
  size: TextButtonSize,
): "ARROW_LEFT_20" | "ARROW_LEFT_24" {
  return size === "small" ? "ARROW_LEFT_20" : "ARROW_LEFT_24";
}

function getTextButtonRightIcon(
  size: TextButtonSize,
): "ARROW_RIGHT_20" | "ARROW_RIGHT_24" {
  return size === "small" ? "ARROW_RIGHT_20" : "ARROW_RIGHT_24";
}

function IconTextButtonMatrix() {
  return (
    <div className="grid grid-cols-[repeat(2,max-content)] items-center justify-items-start gap-x-20 gap-y-6">
      {iconTextButtonRows.map(({ styleType, size }) => (
        <div key={`${styleType}-${size}`} className="contents">
          <TextButton
            label="전체보기"
            size={size}
            styleType={styleType}
            leftIconType={getTextButtonLeftIcon(size)}
            rightIconType={getTextButtonRightIcon(size)}
          />
          <TextButton
            label="전체보기"
            size={size}
            styleType={styleType}
            leftIconType={getTextButtonLeftIcon(size)}
            rightIconType={getTextButtonRightIcon(size)}
            disabled
          />
        </div>
      ))}
    </div>
  );
}

function IconButtonMatrix() {
  return (
    <div className="flex flex-col items-start gap-6">
      {iconButtonGroups.map(({ styleType, buttonType, items }) => (
        <div
          key={`${styleType}-${buttonType}`}
          className="flex items-center gap-8"
        >
          {items.map(({ size, iconType }) => (
            <div key={`${styleType}-${buttonType}-${size}`} className="flex items-center gap-3">
              <IconButton
                iconType={iconType}
                styleType={styleType}
                size={size}
                buttonType={buttonType}
                className={
                  buttonType === "fill"
                    ? undefined
                    : styleType === "warning"
                      ? "bg-fill-system-fail-hover"
                      : "bg-fill-state-hover-light"
                }
                aria-label={`${styleType} ${size} ${buttonType} icon button`}
              />
              <IconButton
                iconType={iconType}
                styleType={styleType}
                size={size}
                buttonType={buttonType}
                disabled
                aria-label={`${styleType} ${size} ${buttonType} disabled icon button`}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <main className="flex min-h-screen w-max min-w-full flex-col items-start gap-16 overflow-x-auto bg-bg-default px-8 py-8">
      <section className="flex w-[1440px] flex-col items-start gap-8">
        <h1 className="text-h28-bold text-text-neutral-title">Layout</h1>

        <div className="flex w-full flex-col gap-5">
          <SectionTitle>Header</SectionTitle>
          <Header type="apply" />
          <Header progressStep={1} />
        </div>

        <div className="flex w-full flex-col gap-5">
          <SectionTitle>LNB</SectionTitle>
          <Lnb className="!h-[800px] !min-h-[800px]" disableCreditFetch />
        </div>

        <div className="flex w-full flex-col gap-5">
          <SectionTitle>LNB Notification</SectionTitle>
          <div className="flex items-start gap-8">
            <LnbNotificationPanel notificationItems={defaultNotificationItems} />
            <LnbNotificationPanel notificationItems={[]} />
          </div>
        </div>
      </section>

      <section className="flex w-[1440px] flex-col items-start gap-8">
        <h1 className="text-h28-bold text-text-neutral-title">CTA</h1>
        <div className="flex flex-col gap-10">
          <CtaFooter />
          <CtaFooter type="result" />
        </div>
      </section>

      <section className="flex w-[1440px] flex-col items-start gap-8">
        <h1 className="text-h28-bold text-text-neutral-title">
          TextInput/TextArea
        </h1>

        <div className="flex w-full flex-col gap-5">
          <SectionTitle>size: s / Type: Fixed</SectionTitle>
          <InputTextAreaFixedS key="fixed-s-default-empty" />
          <InputTextAreaFixedS
            key="fixed-s-error-empty"
            error="글자수를 확인해주세요"
          />
          <InputTextAreaFixedS key="fixed-s-disabled-empty" disabled />
        </div>

        <div className="flex w-full flex-col gap-5">
          <SectionTitle>size: l / Type: Fixed</SectionTitle>
          <InputTextAreaFixedL key="fixed-l-default-empty" />
          <InputTextAreaFixedL
            key="fixed-l-error-empty"
            error="글자수를 확인해주세요"
          />
          <InputTextAreaFixedL key="fixed-l-disabled-empty" disabled />
        </div>

        <div className="flex w-full flex-col gap-5">
          <SectionTitle>size: s / Type: AutoGrow</SectionTitle>
          <InputTextAreaAutoGrowS key="autogrow-s-default-empty" />
          <InputTextAreaAutoGrowS
            key="autogrow-s-error-empty"
            error="글자수를 확인해주세요"
          />
          <InputTextAreaAutoGrowS key="autogrow-s-disabled-empty" disabled />
        </div>

        <div className="flex w-full flex-col gap-5">
          <SectionTitle>LLM Input</SectionTitle>
          <LLMInput />
        </div>

        <div className="flex w-full flex-col gap-5">
          <SectionTitle>JD Input</SectionTitle>
          <JDInput />
          <JDInput type="role" />
          <JDInput type="task" />
          <JDInput type="qualification" />
          <JDInput type="prefer" />
        </div>
      </section>

      <section className="flex w-[1440px] flex-col items-start gap-8">
        <h1 className="text-h28-bold text-text-neutral-title">Select</h1>

        <div className="flex min-h-[430px] flex-wrap items-start gap-8">
          <Select
            options={maxLengthOptions}
            placeholder="최대글자수"
            defaultOpen
          />
        </div>
      </section>

      <section className="flex w-[1440px] flex-col items-start gap-8">
        <h1 className="text-h28-bold text-text-neutral-title">Button</h1>

        <div className="flex w-full flex-col gap-10">
          <div className="flex flex-col gap-5">
            <SectionTitle>Button/BoxButton</SectionTitle>
            <BoxButtonMatrix />
          </div>

          <div className="flex flex-col gap-5">
            <SectionTitle>Button/IconText</SectionTitle>
            <IconTextButtonMatrix />
          </div>

          <div className="flex flex-col gap-5">
            <SectionTitle>Button/TextOnlyButton</SectionTitle>
            <ComponentGroup label="default">
              {textOnlyButtonSizes.map((size) =>
                textOnlyButtonStyles.map((styleType) => (
                  <TextOnlyButton
                    key={`${size}-${styleType}`}
                    label={`${styleType} ${size}`}
                    size={size}
                    styleType={styleType}
                  />
                )),
              )}
            </ComponentGroup>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-5">
              <SectionTitle>Button/IconButton</SectionTitle>
              <IconButtonMatrix />
            </div>

            <div className="flex flex-col gap-5">
              <SectionTitle>Button/IconOnlyButton</SectionTitle>
              <ComponentGroup label="light">
                <IconOnlyButton iconType="CLOSE_M" />
                <IconOnlyButton iconType="CLOSE_S" size="small" />
                <IconOnlyButton iconType="KABAB" />
                <IconOnlyButton iconType="BELL" />
              </ComponentGroup>
              <ComponentGroup label="dark" dark>
                <IconOnlyButton iconType="CLOSE_M" tone="dark" />
                <IconOnlyButton iconType="CLOSE_S" tone="dark" size="small" />
                <IconOnlyButton iconType="KABAB" tone="dark" />
                <IconOnlyButton iconType="BELL" tone="dark" />
              </ComponentGroup>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
