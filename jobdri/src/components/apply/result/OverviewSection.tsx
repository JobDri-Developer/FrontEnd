"use client";

import { type AnalysisResult } from "@/lib/api/result";
import ScoreCircle from "./ScoreCircle";
import Alret from "./Alret";
import SummaryCard from "./SummaryCard";

interface OverviewSectionProps {
  analysis: AnalysisResult;
}

export default function OverviewSection({ analysis }: OverviewSectionProps) {
  return (
    <div className="flex flex-col w-full p-10 gap-8">
      <section className="flex items-center gap-10">
        <ScoreCircle score={analysis.score} />
        <div className="flex flex-col gap-2">
          <Alret score={analysis.score} />
          <p className="text-b16-med text-text-neutral-description">
            {analysis.feedback}
          </p>
        </div>
      </section>
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard title="직무 적합도" score={analysis.jobFit} />
        <SummaryCard title="성과 구체성" score={analysis.impact} />
        <SummaryCard title="완성도" score={analysis.completeness} />
      </div>
    </div>
  );
}
