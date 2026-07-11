"use client";

import TabMenu from "@/components/common/tabs/TabMenu";
import { useState } from "react";
import { Pagination } from "@/components/common/Pagination";
import { QuestionList } from "@/components/mockApply/Question/QuestionList";
import Avatar from "@/components/mockApply/home/Avatar";
import AvatarColorPicker from "@/components/mockApply/home/AvatarColorPicker";
import { ChipTag } from "@/components/common/chips";
import { ProgressPanelRow } from "@/components/common/progress";

export default function TestPage() {
  const [standardPage, setStandardPage] = useState(1);
  const [compactPage, setCompactPage] = useState(3);
  return (
    // 💡 여러 태그를 하나로 묶어주기 위해 빈 태그(Fragment)나 div로 감싸야 합니다.
    <div className="p-10">
      <h1 className="mb-5 text-xl font-bold">테스트 페이지</h1>

      <div className="flex flex-col gap-5">
        <TabMenu
          // 아까 만든 style과 size 프롭스도 대충 넣어줍니다
          style="STRONG"
          size="M"
          tabs={[
            { id: "tab1", label: "탭 1" },
            { id: "tab2", label: "탭 2" },
            { id: "tab3", label: "탭 3" },
          ]}
        />

        <TabMenu
          // 아까 만든 style과 size 프롭스도 대충 넣어줍니다
          style="NORMAL"
          size="S"
          tabs={[
            { id: "tab1", label: "탭 1" },
            { id: "tab2", label: "탭 2" },
            { id: "tab3", label: "탭 3" },
          ]}
        />
      </div>
      <section>
        <h3 className="text-lg font-bold mb-4 text-gray-800">Standard View</h3>
        <Pagination
          variant="standard" // 생략 가능 (기본값)
          currentPage={standardPage} // 현재 페이지 상태 전달
          totalPages={14} // 전체 페이지 수 지정
          onPageChange={(page) => setStandardPage(page)} // 페이지 클릭 시 상태 업데이트
        />
        <p className="mt-2 text-sm text-gray-500">
          현재 선택된 페이지: {standardPage}
        </p>
      </section>

      {/* --- 두 번째: 분수형 (Compact) --- */}
      <section>
        <h3 className="text-lg font-bold mb-4 text-gray-800">Compact View</h3>
        <Pagination
          variant="compact" // 디자인의 우측 상단 3/40 같은 형태
          currentPage={compactPage}
          totalPages={40}
          onPageChange={(page) => setCompactPage(page)}
        />
      </section>

      <section className="w-full max-w-5xl flex gap-6 items-start mt-8">
        {/* 왼쪽: 우리가 만든 문항 리스트 컴포넌트 */}
        <div className="flex-shrink-0">
          <QuestionList />
        </div>
      </section>

      <div className="p-8 flex flex-col gap-8 bg-gray-50 ">
        {/* 1. 일반 User 아바타 (단순 표시용) */}
        <section>
          <h3 className="text-sm font-semibold mb-3 text-gray-700">
            User (Static)
          </h3>
          <Avatar type="user" name="John Doe" />
        </section>

        {/* 2. 컬러 선택이 가능한 Company 아바타 (인터랙션) */}
        <section>
          <h3 className="text-sm font-semibold mb-3 text-gray-700">
            Company (Interactive)
          </h3>
          <AvatarColorPicker
            name="토스"
            onChange={(color) => console.log("선택된 색상:", color)}
          />
        </section>

        <section className="bg-white p-6 rounded-2xl border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            추출된 핵심 역량
          </h3>
          <div className="flex flex-wrap gap-2">
            <ChipTag label="React" color="blue" />
            <ChipTag label="UI/UX" color="pink" />
            <ChipTag label="디자인 시스템" color="green" />
            <ChipTag label="팀 리더십" color="default" />
          </div>
        </section>
      </div>
      <ProgressPanelRow itemCount={4} currentStep={2} />
    </div>
  );
}
