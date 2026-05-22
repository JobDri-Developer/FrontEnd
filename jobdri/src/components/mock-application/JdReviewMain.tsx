"use client";

import { useEffect, useState } from "react";
import { ProgressSidebar } from "@/components/common/progress";
import { InputAutoGrow } from "@/components/common/input";
import {
  mockJdSections,
  type JdReviewSection,
} from "@/components/mock-application/jdReviewSections";

function JdFieldLabel({ label }: { label: string }) {
  return (
    <div className="flex h-[29px] items-center self-stretch py-1 pr-0 pl-0.5">
      <h3 className="min-w-0 truncate text-b16-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
        {label}
      </h3>
    </div>
  );
}

function JdReviewField({
  section,
  onChange,
}: {
  section: JdReviewSection;
  onChange: (value: string) => void;
}) {
  return (
    <section
      id={section.id}
      className="flex scroll-mt-8 flex-col items-center justify-center gap-8 self-stretch rounded-card-l bg-fill-quaternary-default px-7 pt-6 pb-7 shadow-card"
    >
      <div className="flex flex-col items-start gap-2 self-stretch">
        <JdFieldLabel label={section.label} />

        <InputAutoGrow
          value={section.value}
          onChange={onChange}
          maxHeight={168}
          className="w-full min-w-0"
        />
      </div>
    </section>
  );
}

export default function JdReviewMain({
  sections: initialSections = mockJdSections,
  onSectionsChange,
}: {
  sections?: JdReviewSection[];
  onSectionsChange?: (sections: JdReviewSection[]) => void;
}) {
  const [sections, setSections] = useState(initialSections);
  const sidebarItems = sections.map(({ id, label }) => ({ id, label }));

  useEffect(() => {
    onSectionsChange?.(initialSections);
  }, [initialSections, onSectionsChange]);

  const updateSectionValue = (id: string, value: string) => {
    setSections((currentSections) => {
      const nextSections = currentSections.map((section) =>
        section.id === id ? { ...section, value } : section,
      );

      onSectionsChange?.(nextSections);

      return nextSections;
    });
  };

  return (
    <main className="flex items-start gap-6 self-stretch">
      <div className="flex flex-1 flex-col items-start gap-3 self-stretch">
        <div className="flex flex-1 flex-col items-start gap-3 self-stretch">
          {sections.map((section) => (
            <JdReviewField
              key={section.id}
              section={section}
              onChange={(value) => updateSectionValue(section.id, value)}
            />
          ))}
        </div>
      </div>

      <ProgressSidebar
        items={sidebarItems}
        defaultActiveId={sections[0]?.id}
        className="sticky top-6 h-auto shrink-0"
      />
    </main>
  );
}
