import IC_EX_L from "@/public/ic_Ex_L.svg";
import IC_APPLY_L from "@/public/ic_Apply_L.svg";
import IC_UPLOAD from "@/public/ic_Upload.svg";
import IC_HOME_M from "@/public/ic_Home_M.svg";
import IC_ARROW_R from "@/public/ic_Arrow_RIght.svg";
import IC_ARROW_L from "@/public/ic_Arrow_left.svg";
import IC_GOOGLE from "@/public/ic_GoogleAsset.svg";
import IC_ADD from "@/public/ic_Add.svg";
import IC_TRASH from "@/public/ic_Trash.svg";
import IC_WARN from "@/public/ic_Warning.svg";
import IC_CHECK from "@/public/ic_Check.svg";
import IC_PROFILE from "@/public/ic_Profile.svg";
import IC_PASSWORD from "@/public/ic_Password.svg";
import IC_ARROW_R_N from "@/public/ic_Arrow_Right_M.svg";
import IC_DOTS_M from "@/public/ic_Dots_M.svg";
import IC_CLOSE_M from "@/public/ic_Close_M.svg";
import IC_SIDEBAR from "@/public/ic_SidebarToggle.svg";
import IC_HOME_S from "@/public/ic_Home_s.svg";
import IC_APPLY from "@/public/ic_Apply.svg";
import IC_EX_S from "@/public/ic_Ex.svg";
import IC_ARROW_R_N_S from "@/public/ic_Arrow_Right_S.svg";
import IC_DOT_S from "@/public/ic_Dots_S.svg";
import IC_CLOSE from "@/public/ic_Close.svg";
import IC_EX_LINK from "@/public/ic_ExternalLink.svg";
import IC_TOKEN from "@/public/ic_Token.svg";
import IC_SPARKLE from "@/public/ic_Sparkles.svg";
import IC_SEARCH from "@/public/ic_Search.svg";
import IC_LIGHTBULB from "@/public/ic_Lightbulb.svg";

const iconMap = {
  EX_L: IC_EX_L,
  APPLY_L: IC_APPLY_L,
  UPLOAD: IC_UPLOAD,
  HOME_M: IC_HOME_M,
  ARROW_R: IC_ARROW_R,
  ARROW_L: IC_ARROW_L,
  GOOGLE: IC_GOOGLE,
  ADD: IC_ADD,
  TRASH: IC_TRASH,
  WARN: IC_WARN,
  CHECK: IC_CHECK,
  PROFILE: IC_PROFILE,
  PASSWORD: IC_PASSWORD,
  ARROW_R_N: IC_ARROW_R_N,
  DOTS_M: IC_DOTS_M,
  CLOSE_M: IC_CLOSE_M,
  SIDEBAR: IC_SIDEBAR,
  HOME_S: IC_HOME_S,
  APPLY: IC_APPLY,
  EX_S: IC_EX_S,
  ARROW_R_N_S: IC_ARROW_R_N_S,
  DOT_S: IC_DOT_S,
  CLOSE: IC_CLOSE,
  EX_LINK: IC_EX_LINK,
  TOKEN: IC_TOKEN,
  SPARKLE: IC_SPARKLE,
  SEARCH: IC_SEARCH,
  LIGHTBULB: IC_LIGHTBULB,
} as const;

interface IconProps {
  type: keyof typeof iconMap;
  className?: string;
}

export default function Icon({ type, className }: IconProps) {
  const IconComponent = iconMap[type];
  return <IconComponent className={className} />;
}
