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
  ChipRound,
  ChipRoundSelected,
  ChipQnumber,
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
import ResumeAnalysisLoading from "@/components/mock-application/ResumeAnalysisLoading";

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
  return <ResumeAnalysisLoading durationMs={3600} />;
}
