import IconBox from "@/components/icons/IconBox";
import CheckBox from "@/components/icons/CheckBox";
import { ChipMain, ChipRound, ChipRoundSelected, ChipQnumber } from "@/components/chips";
import { ListRole, ListQ, ListQCart } from "@/components/list";

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
  return (
    <div className="p-10 flex flex-col gap-10 bg-neutral-50">
      <Section title="IconBox">
        <IconBox type="TRASH" />
        <IconBox type="HOME_M" />
        <IconBox type="SPARKLE" />
      </Section>

      <Section title="CheckBox">
        <CheckBox type="DEFAULT" />
        <CheckBox type="RADIO_L" />
        <CheckBox type="RADIO_M" />
      </Section>

      <Section title="ChipMain — Mid">
        <ChipMain label="primary" color="primary" />
        <ChipMain label="primary inactive" color="primary" active={false} />
        <ChipMain label="secondary" color="secondary" />
        <ChipMain label="secondary inactive" color="secondary" active={false} />
        <ChipMain label="tertiary" color="tertiary" />
        <ChipMain label="tertiary inactive" color="tertiary" active={false} />
        <ChipMain label="quaternary" color="quaternary" />
        <ChipMain
          label="quaternary inactive"
          color="quaternary"
          active={false}
        />
      </Section>

      <Section title="ChipMain — Small">
        <ChipMain label="primary" color="primary" size="small" />
        <ChipMain label="secondary" color="secondary" size="small" />
        <ChipMain label="tertiary" color="tertiary" size="small" />
        <ChipMain label="quaternary" color="quaternary" size="small" />
      </Section>

      <Section title="ChipRound">
        <ChipRound label="strong" variant="strong" />
        <ChipRound label="normal" variant="normal" />
        <ChipRound label="assistive" variant="assistive" />
      </Section>

      <Section title="ChipRoundSelected">
        <ChipRoundSelected label="mid" />
        <ChipRoundSelected label="mid selected" selected />
      </Section>

      <Section title="ChipQnumber">
        <ChipQnumber number={1} showComplete />
        <ChipQnumber number={1} showComplete selected />
        <ChipQnumber number={2} />
        <ChipQnumber number={2} selected />
      </Section>

      <section className="flex flex-col gap-4">
        <h2 className="text-h28-bold">ListRole</h2>
        <div className="flex flex-col gap-3 w-80">
          <ListRole label="소프트웨어 개발" />
          <ListRole label="데이터 분석" selected />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-h28-bold">ListQ</h2>
        <div className="flex flex-col gap-3 w-96">
          <ListQ
            chips={[
              { label: "매칭률 높음", color: "primary" },
              { label: "데이터분석", color: "secondary" },
              { label: "성과측정", color: "secondary" },
            ]}
            question="데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요."
          />
          <ListQ
            chips={[
              { label: "매칭률 높음", color: "primary" },
              { label: "데이터분석", color: "secondary" },
              { label: "성과측정", color: "secondary" },
            ]}
            question="데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요."
            selected
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-h28-bold">ListQCart</h2>
        <div className="flex flex-col gap-3 w-64">
          <ListQCart question="데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요." />
          <ListQCart question="데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요." selected />
        </div>
      </section>
    </div>
  );
}
