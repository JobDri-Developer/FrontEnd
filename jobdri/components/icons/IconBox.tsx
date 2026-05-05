import Icon from "./Icon";
import { IconType } from "./Icon";

interface IconBoxProps {
  type: IconType;
}

export default function IconBox({ type }: IconBoxProps) {
  return type === "TRASH" ? (
    <div className="w-full p-1">
      <Icon type="TRASH" />
    </div>
  ) : (
    <div className="w-full p-2 bg-gray-100">
      <Icon type={type} />
    </div>
  );
}
