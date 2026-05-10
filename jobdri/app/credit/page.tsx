import { CreditCard } from "@/components/common/cards";

export default function CreditPage() {
  return (
    <div className="flex flex-row">
      <section className="flex flex-row gap-4 w-full">
        <CreditCard />
        <CreditCard />
        <CreditCard />
      </section>
    </div>
  );
}
