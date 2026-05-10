import { CreditTable } from "../common/credit";

export default function Useage() {
  return (
    <div className="gap-y-4">
      <h2 className="text-t20-semibold text-text-neutral-title">이용내역</h2>
      <CreditTable />
    </div>
  );
}
