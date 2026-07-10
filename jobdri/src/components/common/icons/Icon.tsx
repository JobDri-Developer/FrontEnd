import IC_EX_L from "@/assets/ic_Ex_L.svg";
import IC_APPLY_L from "@/assets/ic_Apply_L.svg";
import IC_UPLOAD from "@/assets/ic_Upload.svg";
import IC_UPLOAD_M from "@/assets/ic_Upload_M.svg";
import IC_HOME_M from "@/assets/ic_Home_M.svg";
import IC_ARROW_R from "@/assets/ic_Arrow_RIght.svg";
import IC_ARROW_L from "@/assets/ic_Arrow_left.svg";
import IC_ARROW_DOWN_M from "@/assets/ic_Arrow_Down_M.svg";
import IC_ARROW_UP_M from "@/assets/ic_Arrow_Up_M.svg";
import IC_GOOGLE from "@/assets/ic_GoogleAsset.svg";
import IC_GOOD from "@/assets/ic_Good.svg";
import IC_ADD from "@/assets/ic_Add.svg";
import IC_ADD_S from "@/assets/ic_Add_S.svg";
import IC_TRASH from "@/assets/ic_Trash.svg";
import IC_WARN from "@/assets/ic_Warning.svg";
import IC_CHECK from "@/assets/ic_Check.svg";
import IC_PROFILE from "@/assets/ic_Profile.svg";
import IC_PASSWORD from "@/assets/ic_Password.svg";
import IC_ARROW_R_N from "@/assets/ic_Arrow_Right_M.svg";
import IC_DOTS_M from "@/assets/ic_Dots_M.svg";
import IC_KABAB from "@/assets/ic_Kabab.svg";
import IC_CLOSE_M from "@/assets/ic_Close_M.svg";
import IC_CLOSE_S from "@/assets/ic_Close_S.svg";
import IC_SIDEBAR from "@/assets/ic_SidebarToggle.svg";
import IC_HOME_S from "@/assets/ic_Home_s.svg";
import IC_APPLY from "@/assets/ic_Apply.svg";
import IC_EX_S from "@/assets/ic_Ex.svg";
import IC_ARROW_R_N_S from "@/assets/ic_Arrow_Right_S.svg";
import IC_CHEVRON_L from "@/assets/ic_Chevron_L.svg";
import IC_CHEVRON_L_S from "@/assets/ic_Chevron_L_S.svg";
import IC_CHEVRON_R from "@/assets/ic_Chevron_R.svg";
import IC_CHEVRON_R_S from "@/assets/ic_Chevron_R_S.svg";
import IC_DOT_S from "@/assets/ic_Dots_S.svg";
import IC_EX_LINK from "@/assets/ic_ExternalLink.svg";
import IC_TOKEN from "@/assets/ic_Token.svg";
import IC_SPARKLE from "@/assets/ic_Sparkles.svg";
import IC_SEARCH from "@/assets/ic_Search.svg";
import IC_LIGHTBULB from "@/assets/ic_Lightbulb.svg";
import IC_TEXT from "@/assets/ic_Text.svg";
import IC_CHECK_M from "@/assets/ic_Check_M.svg";
import IC_CHECK_COMPLETE from "@/assets/ic_Check_Complete.svg";
import IC_EDIT from "@/assets/ic_Edit.svg";
import IC_EMAIL from "@/assets/ic_Email.svg";
import IC_LINK from "@/assets/ic_Link.svg";
import IC_POLYGON_1 from "@/assets/ic_Polygon_1.svg";
import IC_POLYGON_2 from "@/assets/ic_Polygon_2.svg";
import IC_FILE from "@/assets/ic_file.svg";

const iconMap = {
  EX_L: IC_EX_L,
  APPLY_L: IC_APPLY_L,
  UPLOAD: IC_UPLOAD,
  UPLOAD_M: IC_UPLOAD_M,
  HOME_M: IC_HOME_M,
  ARROW_R: IC_ARROW_R,
  ARROW_L: IC_ARROW_L,
  ARROW_DOWN_M: IC_ARROW_DOWN_M,
  ARROW_UP_M: IC_ARROW_UP_M,
  GOOGLE: IC_GOOGLE,
  GOOD: IC_GOOD,
  ADD: IC_ADD,
  ADD_S: IC_ADD_S,
  TRASH: IC_TRASH,
  WARN: IC_WARN,
  CHECK: IC_CHECK,
  PROFILE: IC_PROFILE,
  PASSWORD: IC_PASSWORD,
  ARROW_R_N: IC_ARROW_R_N,
  DOTS_M: IC_DOTS_M,
  KABAB: IC_KABAB,
  CLOSE_M: IC_CLOSE_M,
  CLOSE_S: IC_CLOSE_S,
  SIDEBAR: IC_SIDEBAR,
  HOME_S: IC_HOME_S,
  APPLY: IC_APPLY,
  EX_S: IC_EX_S,
  ARROW_R_N_S: IC_ARROW_R_N_S,
  CHEVRON_L: IC_CHEVRON_L,
  CHEVRON_L_S: IC_CHEVRON_L_S,
  CHEVRON_R: IC_CHEVRON_R,
  CHEVRON_R_S: IC_CHEVRON_R_S,
  DOT_S: IC_DOT_S,
  EX_LINK: IC_EX_LINK,
  TOKEN: IC_TOKEN,
  SPARKLE: IC_SPARKLE,
  SEARCH: IC_SEARCH,
  LIGHTBULB: IC_LIGHTBULB,
  TEXT: IC_TEXT,
  CHECK_M: IC_CHECK_M,
  CHECK_COMPLETE: IC_CHECK_COMPLETE,
  EDIT: IC_EDIT,
  EMAIL: IC_EMAIL,
  LINK: IC_LINK,
  POLYGON_1: IC_POLYGON_1,
  POLYGON_2: IC_POLYGON_2,
  FILE: IC_FILE,
} as const;

export type IconType = keyof typeof iconMap;

interface IconProps {
  type: IconType;
  className?: string;
}

export default function Icon({ type, className }: IconProps) {
  const IconComponent = iconMap[type];
  return <IconComponent className={className} />;
}
