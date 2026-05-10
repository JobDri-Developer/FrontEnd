import { CreditCard } from "@/components/common/cards";
import Useage from "@/components/credit/Useage";

export default function CreditPage() {
  return (
    <div className="flex flex-col">
      <section className="flex flex-row gap-4 w-full mt-8 mb-16">
        <CreditCard creditCount={1} price="2,500" />
        <CreditCard creditCount={3} price="2,500" />
        <CreditCard creditCount={10} price="2,500" />
      </section>
      <Useage />
    </div>
  );
}
