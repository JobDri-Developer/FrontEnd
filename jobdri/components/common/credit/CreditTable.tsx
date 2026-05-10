import CreditHeader from "./CreditHeader";
import CreditRow from "./CreditRow";

interface CreditRowData {
  id: string;
  dateTime?: string;
  typeLabel?: string;
  content?: string;
  amount?: string;
  balance?: string;
}

interface CreditTableProps {
  title?: string;
  rows?: CreditRowData[];
}

const defaultRows: CreditRowData[] = Array.from({ length: 6 }, (_, i) => ({
  id: String(i),
}));

export default function CreditTable({ rows = defaultRows }: CreditTableProps) {
  return (
    <section className="flex flex-col gap-4 w-full rounded-card-l shadow-card">
      <div className="flex flex-col overflow-hidden rounded-xl">
        <CreditHeader />
        {rows.map((row, index) => (
          <CreditRow
            key={row.id}
            variant={index % 2 === 0 ? "white" : "assistive"}
            dateTime={row.dateTime}
            typeLabel={row.typeLabel}
            content={row.content}
            amount={row.amount}
            balance={row.balance}
          />
        ))}
      </div>
    </section>
  );
}
