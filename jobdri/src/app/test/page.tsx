"use client";

import TabMenu from "@/components/common/tabs/TabMenu";
import { useState } from "react";
import { Pagination } from "@/components/common/Pagination";
import { QuestionList } from "@/components/mockApply/Question/QuestionList";
import Avatar from "@/components/mockApply/home/Avatar";
import AvatarColorPicker from "@/components/mockApply/home/AvatarColorPicker";
import { ChipTag } from "@/components/common/chips";
import { ProgressPanelRow } from "@/components/common/progress";
import { HeaderPanel } from "@/components/common/header/HeaderPanel";
import DetailAnnotationPanel from "@/components/mockApply/result/DetailAnotationPannel";
import { QuestionAnalysis } from "@/lib/api/result";
import { TooltipPlacement, Tooltip } from "@/components/common/tooltip";
import { DropDownMenu, DropDownMenuItem } from "@/components/common/dropdown";
import { scrollbarClass } from "@/components/common/input/inputStyles";
import ScoreCircle from "@/components/mockApply/result/ScoreCircle";
import ScoreBar from "@/components/mockApply/result/ScoreBar";
import { ModalCard } from "@/components/common/modal/Modal";
import { Button } from "@/components/common/buttons";

export default function TestPage() {
  const [standardPage, setStandardPage] = useState(1);
  const [compactPage, setCompactPage] = useState(3);

  const [currentStepId, setCurrentStepId] = useState(1);

  // 2. 전체 스텝 데이터 정의 (이미지에 있는 텍스트 기반)
  const mySteps = [
    { id: 1, label: "기본 정보 입력" },
    { id: 2, label: "JD 확인" },
    { id: 3, label: "자소서 입력" },
    { id: 4, label: "첨삭 결과" },
  ];

  const mockAnalyses: QuestionAnalysis[] = [
    {
      questionAnalysisId: 1, // 문자열에서 숫자로 변경
      status: "mentioned",
      reason: "모호한 표현보다는 구체적으로 기술해주세요.",
      sentence:
        "구체적인 경험이나 수치적 지표가 드러나 있지 않아 신뢰성이 떨어져요. 구체적인 경험이나 수치적 지표가 드러나 있지 않아 신뢰성이 떨어져요.",
      improvement:
        "친환경차로의 전환기에서 사용자가 겪는 새로운 불편함을 해결하고, 자율주행 환경에서 신뢰할 수 있는 HMI를 설계하고자 현대자동차에 지원했습니다.",
      start: 0, // 타입 에러 해결을 위한 더미 값
      end: 10, // 타입 에러 해결을 위한 더미 값
    },
    {
      questionAnalysisId: 2,
      status: "proven",
      reason: "모호한 표현보다는 구체적으로 기술해주세요.",
      sentence:
        "구체적인 경험이나 수치적 지표가 드러나 있지 않아 신뢰성이 떨어져요. 구체적인 경험이나 수치적 지표가 드러나 있지 않아 신뢰성이 떨어져요.",
      improvement:
        "친환경차로의 전환기에서 사용자가 겪는 새로운 불편함을 해결하고, 자율주행 환경에서 신뢰할 수 있는 HMI를 설계하고자 현대자동차에 지원했습니다.",
      start: 0,
      end: 10,
    },
    {
      questionAnalysisId: 3,
      status: "fabricated",
      reason: "모호한 표현보다는 구체적으로 기술해주세요.",
      sentence:
        "구체적인 경험이나 수치적 지표가 드러나 있지 않아 신뢰성이 떨어져요. 구체적인 경험이나 수치적 지표가 드러나 있지 않아 신뢰성이 떨어져요.",
      improvement:
        "친환경차로의 전환기에서 사용자가 겪는 새로운 불편함을 해결하고, 자율주행 환경에서 신뢰할 수 있는 HMI를 설계하고자 현대자동차에 지원했습니다.",
      start: 0,
      end: 10,
    },
    {
      questionAnalysisId: 4,
      status: "mentioned",
      reason: "모호한 표현보다는 구체적으로 기술해주세요.",
      sentence:
        "구체적인 경험이나 수치적 지표가 드러나 있지 않아 신뢰성이 떨어져요. 구체적인 경험이나 수치적 지표가 드러나 있지 않아 신뢰성이 떨어져요.",
      improvement:
        "친환경차로의 전환기에서 사용자가 겪는 새로운 불편함을 해결하고, 자율주행 환경에서 신뢰할 수 있는 HMI를 설계하고자 현대자동차에 지원했습니다.",
      start: 0,
      end: 10,
    },
  ]; // 3. 다음/이전 버튼 핸들러
  const handleNextStep = () => {
    if (currentStepId < mySteps.length) {
      setCurrentStepId((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepId > 1) {
      setCurrentStepId((prev) => prev - 1);
    }
  };

  const PLACEMENTS: TooltipPlacement[] = [
    "up_left",
    "up_mid",
    "up_right",
    "left_up",
    "left_mid",
    "right_mid",
    "right_up",
    "down_left",
    "down_mid",
    "down_right",
  ];

  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const checkItems: DropDownMenuItem[] = [
    {
      label: "일반 항목",
      onClick: () => setClickedItem("일반 항목"),
    },
    {
      label: "호버/액티브 테스트",
      onClick: () => setClickedItem("호버/액티브 테스트"),
    },
    {
      label: "비활성화 항목 (disabled)",
      disabled: true,
      onClick: () => setClickedItem("비활성화 항목"), // 👈 disabled 속성 때문에 어차피 클릭 안 됨!
    },
  ];
  const dummyDescription =
    "모달 디스크립션입니다. 모달 디스크립션입니다. 모달 디스크립션입니다. 모달 디스크립션입니다. 모달 디스크립션입니다.";

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

      <div className="flex flex-col items-center p-10 bg-gray-100 h-fit">
        {/* 상단 진행률 패널 */}
        <HeaderPanel steps={mySteps} currentStepId={currentStepId} />

        {/* 현재 스텝에 따른 본문 내용 렌더링 영역 */}
        <div className="w-full max-w-2xl p-8 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm min-h-[300px] flex items-center justify-center">
          <h3 className="text-xl text-gray-600 font-medium">
            {currentStepId}단계: {mySteps[currentStepId - 1].label} 진행 중...
          </h3>
        </div>

        {/* 하단 네비게이션 버튼 */}
        <div className="flex justify-between w-full max-w-2xl mt-6">
          <button
            onClick={handlePrevStep}
            disabled={currentStepId === 1}
            className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
          >
            이전
          </button>
          <button
            onClick={handleNextStep}
            disabled={currentStepId === mySteps.length}
            className="px-6 py-2 text-white bg-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-700"
          >
            {currentStepId === mySteps.length ? "완료" : "다음"}
          </button>
        </div>
      </div>

      <div
        className={`flex w-full flex-col gap-6 p-8 h-80 overflow-y-auto ${scrollbarClass}`}
      >
        <h2 className="text-h2-bold text-center">Result</h2>

        {/* 위에서 정의한 데이터를 props로 전달합니다. */}
        <DetailAnnotationPanel analyses={mockAnalyses} />
      </div>

      <div className="flex min-h-screen flex-col items-center gap-10 bg-gray-50 p-10">
        <h2 className="text-h2-bold text-gray-800">
          Tooltip Placements Test 🎯
        </h2>

        {/* 3열 그리드로 모든 방향 한눈에 보기 */}
        <div className="grid w-full max-w-5xl grid-cols-1 gap-16 md:grid-cols-3">
          {PLACEMENTS.map((placement) => (
            <div
              key={placement}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-16 shadow-sm"
            >
              {/* 현재 어떤 placement인지 상단에 라벨 표시 */}
              <span className="mb-10 text-label14-med text-gray-500">
                placement:{" "}
                <strong className="text-gray-900">{placement}</strong>
              </span>

              {/* 툴팁 컴포넌트 렌더링 */}
              <Tooltip placement={placement} message={`${placement} 테스트`} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-100 p-10">
        {/* 🎯 클릭 피드백 확인 영역 */}
        <div className="flex h-12 items-center rounded-lg bg-white px-6 shadow-sm">
          <p className="text-sm font-medium text-gray-700">
            {clickedItem
              ? `👆 방금 클릭한 항목: [ ${clickedItem} ]`
              : "아래 메뉴를 클릭해 보세요!"}
          </p>
        </div>

        {/* 컴포넌트 자체는 항상 열려있음 (패딩, 호버, 액티브 맘껏 확인 가능) */}
        <DropDownMenu items={checkItems} />
      </div>
      <div>
        <div className="flex flex-row gap-10 items-center justify-center">
          <ScoreCircle score={86} />
          <ScoreCircle score={56} />
        </div>
        <div className="flex flex-col gap-10 items-center justify-center">
          <ScoreBar score={86} />
          <ScoreBar score={56} />
        </div>
      </div>

      <section className="min-h-screen bg-[#F8F9FA] p-8 flex flex-col items-center justify-center gap-12 font-sans">
        <div className="w-full max-w-5xl">
          <h2 className="text-2xl font-bold text-center text-[#2D2D37] mb-6">
            Mordal
          </h2>

          <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 bg-[#F3F0FF]/30 flex flex-wrap gap-8 justify-center">
            <ModalCard
              title="타이틀"
              description={dummyDescription}
              secondaryBtn="보조 행동"
              primaryBtn="권장 행동"
            />

            <ModalCard
              title="타이틀"
              description={dummyDescription}
              secondaryBtn="보조 행동"
            />
            <ModalCard
              title="타이틀"
              description={dummyDescription}
              secondaryBtn="보조 행동"
              errorBtn="부정 행동"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
