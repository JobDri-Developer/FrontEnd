"use client";

import imgSuit from "@/assets/img_result_Suit.png";
import imgPerformance from "@/assets/img_result_Performance.png";
import imgCompleteness from "@/assets/img_result_Completeness.png";
import { type AnalysisResult } from "@/lib/api/result";
import ScoreCircle from "./ScoreCircle";
import Alret from "./Alret";
import SummaryCard from "./SummaryCard";

const SCORE_MAP: {
  key: keyof Pick<AnalysisResult, "jobFit" | "impact" | "completeness">;
  label: string;
  img: typeof imgSuit;
}[] = [
  { key: "jobFit", label: "직무 적합도", img: imgSuit },
  { key: "impact", label: "성과 구체성", img: imgPerformance },
  { key: "completeness", label: "완성도", img: imgCompleteness },
];

interface OverviewSectionProps {
  analysis: AnalysisResult;
}

export default function OverviewSection({ analysis }: OverviewSectionProps) {
  return (
    <div className="flex flex-col max-w-270 p-10 gap-8 mx-auto">
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
        {SCORE_MAP.map(({ key, label, img }) => (
          <SummaryCard
            key={key}
            title={label}
            score={analysis[key]}
            img={img}
          />
        ))}
      </div>
    </div>
  );
}
