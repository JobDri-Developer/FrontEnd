import {
  Button,
  ButtonCta,
  ButtonCtaModal,
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-t20-semibold text-text-neutral-title">{children}</h2>
  );
}

function ComponentGroup({
  label,
  children,
  dark = false,
}: {
  label: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-cap12-semibold text-text-neutral-caption">
        {label}
      </span>
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

export default function ComponentsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-16 bg-bg-default px-8 py-8">
      <section className="flex w-[1440px] flex-col items-start gap-8">
        <h1 className="text-h28-bold text-text-neutral-title">CTA</h1>
        <div className="flex flex-col gap-10">
          <CtaFooter />
          <CtaFooter type="result" />
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
              <ComponentGroup label="default">
                <IconButton direction="left" />
                <IconButton direction="right" />
                <IconButton direction="left" active />
                <IconButton direction="right" active />
              </ComponentGroup>
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

          <div className="flex flex-col gap-5">
            <SectionTitle>Button/ButtonCta</SectionTitle>
            <ComponentGroup label="variants">
              <div className="w-[280px]">
                <ButtonCta variant="gradient_white" />
              </div>
              <div className="w-[280px]">
                <ButtonCta variant="gradient_dark" />
              </div>
              <div className="w-[280px]">
                <ButtonCta variant="empty_white" />
              </div>
              <div className="w-[280px]">
                <ButtonCta variant="empty_dark" />
              </div>
            </ComponentGroup>
          </div>

          <div className="flex flex-col gap-5">
            <SectionTitle>Button/ButtonCtaModal</SectionTitle>
            <ComponentGroup label="stacks">
              <div className="w-[320px]">
                <ButtonCtaModal stack="stack1_horizontal" />
              </div>
              <div className="w-[420px]">
                <ButtonCtaModal stack="stack2_horizontal" />
              </div>
              <div className="w-[320px]">
                <ButtonCtaModal stack="stack3_vertical" />
              </div>
            </ComponentGroup>
          </div>
        </div>
      </section>
    </main>
  );
}
