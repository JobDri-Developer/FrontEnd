import { CreditCard } from "@/components/common/cards";
import Lnb from "@/components/common/lnb/Lnb";
import PageHeader from "@/components/common/PageHeader";

export default function CreditPage() {
  return (
    <div className="flex flex-row">
      <Lnb />
      <div className="flex flex-col py-11 px-10 bg-line-neutral-default w-full h-screen">
        <PageHeader />
        <section className="flex flex-row gap-4">
          {" "}
          <CreditCard />
          <CreditCard />
          <CreditCard />
        </section>
      </div>
    </div>
  );
}
