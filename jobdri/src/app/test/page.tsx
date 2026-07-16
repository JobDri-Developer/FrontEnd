"use client";
import clsx from "clsx";

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
import { ModalCard } from "@/components/common/modal/ModalCard";
import { ToastVariant, Toast } from "@/components/common/toast";
import Evaluation from "@/components/mockApply/result/Evaluation";
import JDSidePanel from "@/components/mockApply/Question/SidePanel";
import { ModalPurchase } from "@/components/common/modal";
import { CreditCard, ResultSummaryCard } from "@/components/common/cards";
import { ResultDraftStep } from "@/components/mockApply/home/ResultDraftStep";
import { ResultApplicationCard } from "@/components/mockApply/home/ResultApplicationCard";
import ResultDraftCard from "@/components/mockApply/home/ResultDraftCard";

export default function TestPage() {
  const [standardPage, setStandardPage] = useState(1);
  const [compactPage, setCompactPage] = useState(3);
  const [isJdOpen, setIsJdOpen] = useState(true);
  const [currentStepId, setCurrentStepId] = useState(1);

  // 2. 전체 스텝 데이터 정의 (이미지에 있는 텍스트 기반)
  const mySteps = [
    { id: 1, label: "기본 정보 입력" },
    { id: 2, label: "JD 확인" },
    { id: 3, label: "자소서 입력" },
    { id: 4, label: "첨삭 결과" },
  ];
  const [activeToast, setActiveToast] = useState<{
    variant: ToastVariant;
    position: "top" | "bottom";
  } | null>(null);

  const showToast = (variant: ToastVariant, position: "top" | "bottom") => {
    setActiveToast({ variant, position });
    // 3초 뒤 자동 닫힘
    setTimeout(() => {
      setActiveToast(null);
    }, 3000);
  };

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

  // 1. 간단한 더미 이벤트 핸들러
  const handleDelete = (company: string) => {
    alert(`${company} 모의 서류 결과를 삭제합니다.`);
  };

  const handleRetry = (company: string) => {
    console.log(`${company} 다시 시도하기`);
  };

  const handleResume = (company: string) => {
    console.log(`${company} 상세 결과 보기`);
  };

  // 2. 카드에 뿌려줄 더미 데이터 리스트 (회사명이 있는 경우와 없는 경우)
  const mockApplications = [
    {
      id: "app-1",
      company: "구글 코리아",
      position: "프론트엔드 엔지니어",
      createdAt: "2026.07.16",
      score: 85,
      version: 1,
    },
    {
      id: "app-2",
      company: "회사명 미입력", // showCompany가 false가 되어 직무만 강조되는 케이스
      position: "UI/UX 인터랙션 디자이너",
      createdAt: "2026.07.15",
      score: 45,
      version: 2,
    },
    {
      id: "app-3",
      company: "토스",
      position: "웹 프론트엔드 개발자",
      createdAt: "2026.07.14",
      score: 92,
      version: 3,
    },
  ];

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
    // <div className="p-10">
    //   <h1 className="mb-5 text-xl font-bold">테스트 페이지</h1>
    //   <div className="flex flex-col gap-5">
    //     <TabMenu
    //       // 아까 만든 style과 size 프롭스도 대충 넣어줍니다
    //       style="STRONG"
    //       size="M"
    //       tabs={[
    //         { id: "tab1", label: "탭 1" },
    //         { id: "tab2", label: "탭 2" },
    //         { id: "tab3", label: "탭 3" },
    //       ]}
    //     />

    //     <TabMenu
    //       // 아까 만든 style과 size 프롭스도 대충 넣어줍니다
    //       style="NORMAL"
    //       size="S"
    //       tabs={[
    //         { id: "tab1", label: "탭 1" },
    //         { id: "tab2", label: "탭 2" },
    //         { id: "tab3", label: "탭 3" },
    //       ]}
    //     />
    //   </div>
    //   <section>
    //     <h3 className="text-lg font-bold mb-4 text-gray-800">Standard View</h3>
    //     <Pagination
    //       variant="standard" // 생략 가능 (기본값)
    //       currentPage={standardPage} // 현재 페이지 상태 전달
    //       totalPages={14} // 전체 페이지 수 지정
    //       onPageChange={(page) => setStandardPage(page)} // 페이지 클릭 시 상태 업데이트
    //     />
    //     <p className="mt-2 text-sm text-gray-500">
    //       현재 선택된 페이지: {standardPage}
    //     </p>
    //   </section>
    //   {/* --- 두 번째: 분수형 (Compact) --- */}
    //   <section>
    //     <h3 className="text-lg font-bold mb-4 text-gray-800">Compact View</h3>
    //     <Pagination
    //       variant="compact" // 디자인의 우측 상단 3/40 같은 형태
    //       currentPage={compactPage}
    //       totalPages={40}
    //       onPageChange={(page) => setCompactPage(page)}
    //     />
    //   </section>
    //   <section className="w-full max-w-5xl flex gap-6 items-start mt-8">
    //     {/* 왼쪽: 우리가 만든 문항 리스트 컴포넌트 */}
    //     <div className="flex-shrink-0">
    //       <QuestionList />
    //     </div>
    //   </section>
    //   <div className="p-8 flex flex-col gap-8 bg-gray-50 ">
    //     {/* 1. 일반 User 아바타 (단순 표시용) */}
    //     <section>
    //       <h3 className="text-sm font-semibold mb-3 text-gray-700">
    //         User (Static)
    //       </h3>
    //       <Avatar type="user" name="John Doe" />
    //     </section>
    //     <Avatar size="xsmall" type="company" name="토스" isEditable={true} />

    //     <Avatar size="small" type="company" name="토스" isEditable={true} />
    //     <Avatar size="large" type="company" name="토스" isEditable={true} />

    //     {/* 2. 컬러 선택이 가능한 Company 아바타 (인터랙션) */}
    //     <section>
    //       <h3 className="text-sm font-semibold mb-3 text-gray-700">
    //         Company (Interactive)
    //       </h3>
    //       <Avatar size="medium" type="company" name="토스" isEditable={true} />
    //     </section>

    //     <section className="bg-white p-6 rounded-2xl border border-gray-200">
    //       <h3 className="text-sm font-semibold text-gray-700 mb-4">
    //         추출된 핵심 역량
    //       </h3>
    //       <div className="flex flex-wrap gap-2">
    //         <ChipTag label="React" color="blue" />
    //         <ChipTag label="UI/UX" color="pink" />
    //         <ChipTag label="디자인 시스템" color="green" />
    //         <ChipTag label="팀 리더십" color="default" />
    //       </div>
    //     </section>
    //   </div>
    //   <ProgressPanelRow itemCount={4} currentStep={2} />
    //   <div className="flex flex-col items-center p-10 bg-gray-100 h-fit">
    //     {/* 상단 진행률 패널 */}
    //     <HeaderPanel steps={mySteps} currentStepId={currentStepId} />

    //     {/* 현재 스텝에 따른 본문 내용 렌더링 영역 */}
    //     <div className="w-full max-w-2xl p-8 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm min-h-[300px] flex items-center justify-center">
    //       <h3 className="text-xl text-gray-600 font-medium">
    //         {currentStepId}단계: {mySteps[currentStepId - 1].label} 진행 중...
    //       </h3>
    //     </div>

    //     {/* 하단 네비게이션 버튼 */}
    //     <div className="flex justify-between w-full max-w-2xl mt-6">
    //       <button
    //         onClick={handlePrevStep}
    //         disabled={currentStepId === 1}
    //         className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
    //       >
    //         이전
    //       </button>
    //       <button
    //         onClick={handleNextStep}
    //         disabled={currentStepId === mySteps.length}
    //         className="px-6 py-2 text-white bg-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-700"
    //       >
    //         {currentStepId === mySteps.length ? "완료" : "다음"}
    //       </button>
    //     </div>
    //   </div>
    //   <div
    //     className={`flex w-full flex-col gap-6 p-8 h-80 overflow-y-auto ${scrollbarClass}`}
    //   >
    //     <h2 className="text-h2-bold text-center">Result</h2>

    //     {/* 위에서 정의한 데이터를 props로 전달합니다. */}
    //     <DetailAnnotationPanel analyses={mockAnalyses} />
    //   </div>
    //   <div className="flex min-h-screen flex-col items-center gap-10 bg-gray-50 p-10">
    //     <h2 className="text-h2-bold text-gray-800">
    //       Tooltip Placements Test 🎯
    //     </h2>

    //     {/* 3열 그리드로 모든 방향 한눈에 보기 */}
    //     <div className="grid w-full max-w-5xl grid-cols-1 gap-16 md:grid-cols-3">
    //       {PLACEMENTS.map((placement) => (
    //         <div
    //           key={placement}
    //           className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-16 shadow-sm"
    //         >
    //           {/* 현재 어떤 placement인지 상단에 라벨 표시 */}
    //           <span className="mb-10 text-label14-med text-gray-500">
    //             placement:{" "}
    //             <strong className="text-gray-900">{placement}</strong>
    //           </span>

    //           {/* 툴팁 컴포넌트 렌더링 */}
    //           <Tooltip placement={placement} message={`${placement} 테스트`} />
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    //   <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-100 p-10">
    //     {/* 🎯 클릭 피드백 확인 영역 */}
    //     <div className="flex h-12 items-center rounded-lg bg-white px-6 shadow-sm">
    //       <p className="text-sm font-medium text-gray-700">
    //         {clickedItem
    //           ? `👆 방금 클릭한 항목: [ ${clickedItem} ]`
    //           : "아래 메뉴를 클릭해 보세요!"}
    //       </p>
    //     </div>

    //     {/* 컴포넌트 자체는 항상 열려있음 (패딩, 호버, 액티브 맘껏 확인 가능) */}
    //     <DropDownMenu items={checkItems} />
    //   </div>
    //   <div>
    //     <div className="flex flex-row gap-10 items-center justify-center">
    //       <ScoreCircle score={86} />
    //       <ScoreCircle score={56} />
    //     </div>
    //     <div className="flex flex-col gap-10 items-center justify-center">
    //       <ScoreBar score={86} />
    //       <ScoreBar score={56} />
    //     </div>
    //   </div>
    //   <section className="min-h-screen bg-[#F8F9FA] p-8 flex flex-col items-center justify-center gap-12 font-sans">
    //     <div className="w-full max-w-5xl">
    //       <h2 className="text-2xl font-bold text-center text-[#2D2D37] mb-6">
    //         Mordal
    //       </h2>

    //       <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 bg-[#F3F0FF]/30 flex flex-wrap gap-8 justify-center">
    //         <ModalCard
    //           title="타이틀"
    //           description={dummyDescription}
    //           secondaryBtn="보조 행동"
    //           primaryBtn="권장 행동"
    //         />

    //         <ModalCard
    //           title="타이틀"
    //           description={dummyDescription}
    //           secondaryBtn="보조 행동"
    //         />
    //         <ModalCard
    //           title="타이틀"
    //           description={dummyDescription}
    //           secondaryBtn="보조 행동"
    //           errorBtn="부정 행동"
    //         />
    //       </div>
    //     </div>
    //   </section>
    //   <section className="min-h-screen bg-[#F8F9FA] p-8 flex flex-col items-center gap-12 font-sans">
    //     {/* 섹션 타이틀 */}
    //     <div className="text-center">
    //       <h2 className="text-h24-bold text-[#2D2D37] mb-2">
    //         Toast Component Preview
    //       </h2>
    //       <p className="text-sub14-reg text-text-neutral-caption">
    //         기획서 상의 모든 토스트 케이스를 한 화면에서 비교하고 확인합니다.
    //       </p>
    //     </div>

    //     {/* 메인 비교 컨테이너 */}
    //     <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
    //       {/* =========================================================
    //         1. 왼쪽 영역: Bottom 위치용 토스트 (닫기 버튼 있음, 와이드 스타일)
    //         ========================================================= */}
    //       <div className="border-2 border-dashed border-purple-300 rounded-2xl p-6 bg-[#F3F0FF]/30 flex flex-col gap-6">
    //         <div className="text-center mb-2">
    //           <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-cap12-semibold">
    //             Bottom Position (닫기 버튼 X 포함)
    //           </span>
    //         </div>

    //         {/* Case 1: Bottom + Check (아이콘 있음, 라이트 배경) */}
    //         <div className="relative h-20">
    //           <Toast
    //             message="토스트 기본 더미텍스트."
    //             variant="check"
    //             position="bottom"
    //             className="!absolute !bottom-2 !right-0 !left-0 mx-auto" // 레이아웃 확인용 포지션 강제 오버라이딩
    //           />
    //         </div>

    //         {/* Case 2: Bottom + Warning (경고 아이콘 있음, 라이트 배경) */}
    //         <div className="relative h-20">
    //           <Toast
    //             message="토스트 기본 더미텍스트."
    //             variant="warning"
    //             position="bottom"
    //             className="!absolute !bottom-2 !right-0 !left-0 mx-auto"
    //           />
    //         </div>

    //         {/* Case 3: Bottom + Normal (아이콘 없음, 라이트 배경) */}
    //         <div className="relative h-20">
    //           <Toast
    //             message="토스트 기본 더미텍스트."
    //             variant="normal"
    //             position="bottom"
    //             className="!absolute !bottom-2 !right-0 !left-0 mx-auto"
    //           />
    //         </div>

    //         {/* Case 4: Bottom + Dark (글자 흰색, 다크 배경) */}
    //         <div className="relative h-20">
    //           <Toast
    //             message="토스트 기본 더미텍스트."
    //             variant="dark"
    //             position="bottom"
    //             className="!absolute !bottom-2 !right-0 !left-0 mx-auto"
    //           />
    //         </div>
    //       </div>

    //       {/* =========================================================
    //         2. 오른쪽 영역: Top 위치용 토스트 (닫기 버튼 없음, 조약돌 스타일)
    //         ========================================================= */}
    //       <div className="border-2 border-dashed border-purple-300 rounded-2xl p-6 bg-[#F3F0FF]/30 flex flex-col gap-6 items-center">
    //         <div className="text-center mb-2">
    //           <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-cap12-semibold">
    //             Top Position (닫기 버튼 없음)
    //           </span>
    //         </div>

    //         {/* Case 5: Top + Check */}
    //         <div className="relative h-20 w-full flex justify-center">
    //           <Toast
    //             message="토스트 기본 더미텍스트"
    //             variant="check"
    //             position="top"
    //             className="!absolute !top-2"
    //           />
    //         </div>

    //         {/* Case 6: Top + Warning */}
    //         <div className="relative h-20 w-full flex justify-center">
    //           <Toast
    //             message="토스트 기본 더미텍스트"
    //             variant="warning"
    //             position="top"
    //             className="!absolute !top-2"
    //           />
    //         </div>

    //         {/* Case 7: Top + Normal */}
    //         <div className="relative h-20 w-full flex justify-center">
    //           <Toast
    //             message="토스트 기본 더미텍스트"
    //             variant="normal"
    //             position="top"
    //             className="!absolute !top-2"
    //           />
    //         </div>

    //         {/* Case 8: Top + Dark */}
    //         <div className="relative h-20 w-full flex justify-center">
    //           <Toast
    //             message="토스트 기본 더미텍스트"
    //             variant="dark"
    //             position="top"
    //             className="!absolute !top-2"
    //           />
    //         </div>
    //       </div>
    //     </div>

    //     {/* =========================================================
    //       3. 실시간 인터랙션 테스트 공간 (인터랙션 확인용 버튼)
    //       ========================================================= */}
    //     <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm w-full max-w-6xl text-center">
    //       <h3 className="text-t20-semibold mb-4 text-[#2D2D37]">
    //         실시간 클릭 테스트
    //       </h3>
    //       <div className="flex flex-wrap gap-3 justify-center">
    //         <button
    //           onClick={() => showToast("check", "bottom")}
    //           className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-button14-semibold"
    //         >
    //           Bottom Check 띄우기
    //         </button>
    //         <button
    //           onClick={() => showToast("warning", "bottom")}
    //           className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-button14-semibold"
    //         >
    //           Bottom Warning 띄우기
    //         </button>
    //         <button
    //           onClick={() => showToast("dark", "top")}
    //           className="px-4 py-2 bg-gray-800 text-white rounded-xl text-button14-semibold"
    //         >
    //           Top Dark 띄우기
    //         </button>
    //         <button
    //           onClick={() => showToast("normal", "top")}
    //           className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-button14-semibold"
    //         >
    //           Top Normal 띄우기
    //         </button>
    //       </div>
    //     </div>

    //     {/* 실시간 테스트 클릭 시 하단 혹은 상단에 실제로 트리거되는 진짜 fixed 토스트 */}
    //     {activeToast && (
    //       <Toast
    //         message={`${activeToast.position === "top" ? "Top" : "Bottom"} 토스트 테스트 알림입니다.`}
    //         variant={activeToast.variant}
    //         position={activeToast.position}
    //         onClose={() => setActiveToast(null)}
    //       />
    //     )}
    //   </section>
    //   <section className="min-h-screen bg-white p-8 flex flex-col items-center justify-center gap-12 font-sans">
    //     {/* 섹션 타이틀 */}
    //     <div className="text-center">
    //       <h2 className="text-h24-bold text-[#2D2D37] mb-2">
    //         Evaluation Component Preview
    //       </h2>
    //       <p className="text-sub14-reg text-text-neutral-caption">
    //         점수(score)에 따른 두 가지 조건부 렌더링(60점 기준)을 비교합니다.
    //       </p>
    //     </div>

    //     {/* 메인 비교 컨테이너 */}
    //     <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
    //       {/* =========================================================
    //         1. 60점 이상 케이스 (Good / Complete)
    //         ========================================================= */}
    //       <div className="flex flex-col gap-4">
    //         <div className="text-center">
    //           <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-cap12-semibold">
    //             점수 60점 이상 (현재: 85점)
    //           </span>
    //         </div>

    //         <div>
    //           {/* 실제 컴포넌트 렌더링 */}
    //           <Evaluation
    //             score={85}
    //             evaluate="우수한 평가"
    //             quote="이 상태를 계속 유지하면 아주 좋습니다. 뛰어난 성과를 기록하고 있습니다."
    //           />
    //         </div>
    //       </div>

    //       {/* =========================================================
    //         2. 60점 미만 케이스 (Warning / Fail)
    //         ========================================================= */}
    //       <div className="flex flex-col gap-4">
    //         <div className="text-center">
    //           <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-cap12-semibold">
    //             점수 60점 미만 (현재: 45점)
    //           </span>
    //         </div>

    //         <div>
    //           {/* 실제 컴포넌트 렌더링 */}
    //           <Evaluation
    //             score={45}
    //             evaluate="주의 필요 평가"
    //             quote="현재 상태를 개선하기 위한 조치가 필요합니다. 주의 단계입니다."
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   </section>
    //   <section className="flex flex-col items-center gap-6 p-8 bg-[#F3F0FF]/20 border-2 border-dashed border-purple-300 rounded-2xl">
    //     <div className="text-center">
    //       <h2 className="text-2xl font-bold text-gray-800 mb-2">
    //         JD (Job Description) Side Panel
    //       </h2>
    //       <p className="text-sub14-reg text-text-neutral-caption">
    //         왼쪽 버튼을 누르면 패널이 열리고, 닫혔을 때는 화면 우측 끝에 미니
    //         탭(아이콘) 형태로 안착합니다.
    //       </p>
    //     </div>

    //     {/* 메인 조작부 카드 (목업 프레임 대신 직관적인 컨트롤 레이아웃 적용) */}
    //     <div className="flex h-40 w-full max-w-[560px] bg-white items-center justify-center border border-line-neutral-assistive rounded-3xl shadow-sm gap-8 px-6">
    //       <div className="flex flex-col items-center gap-2">
    //         <button
    //           onClick={() => setIsJdOpen(!isJdOpen)}
    //           className={clsx(
    //             "w-24 p-4 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all cursor-pointer",
    //             isJdOpen
    //               ? "border-line-neutral-assistive bg-[#F5F6F9] text-text-neutral-caption"
    //               : "border-fill-secondary-default bg-fill-secondary-assistive text-fill-secondary-default font-semibold",
    //           )}
    //         >
    //           <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-current/10">
    //             <span className="text-lg">📄</span>
    //           </div>
    //           <span className="text-cap12-semibold whitespace-nowrap">
    //             공고 확인하기
    //           </span>
    //         </button>
    //         <span className="text-xs text-text-neutral-caption mt-1">
    //           {isJdOpen
    //             ? "패널 활성화 상태 (열림)"
    //             : "패널 비활성화 상태 (닫힘)"}
    //         </span>
    //       </div>
    //     </div>

    //     {/* 🟢 분리된 JDSidePanel 컴포넌트 연결
    //       - fixed 속성으로 렌더링되므로, 이 조립 프레임 밖에서도 무조건 화면 오른쪽 끝에 찰떡같이 붙어서 대기합니다.
    //       - 닫혔을 때는 이 패널 자체가 미니 아이콘 탭이 되므로, onOpen을 전달해 탭을 눌러도 열릴 수 있도록 연결해 줍니다.
    //     */}
    //     <JDSidePanel
    //       isOpen={isJdOpen}
    //       onClose={() => setIsJdOpen(false)}
    //       onOpen={() => setIsJdOpen(true)}
    //     />
    //   </section>
    //   <section className="flex flex-row gap-3">
    //     <CreditCard planCode="FIVE_TIMES" />
    //     <CreditCard planCode="FIVE_TIMES" />
    //     <CreditCard planCode="FIVE_TIMES" />
    //   </section>
    //   <section className="flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
    //     {/* 섹션 타이틀 영역 */}
    //     <div className="flex flex-col gap-2">
    //       <h2 className="text-2xl font-bold text-text-neutral-title">
    //         내 모의 지원 결과
    //       </h2>
    //       <p className="text-sm text-text-neutral-description">
    //         지금까지 진행한 모의 서류 결과를 확인하고 보완해보세요.
    //       </p>
    //     </div>

    //     {/* 카드 리스트 렌더링 영역 (flex-wrap으로 가로로 나열되다 넘어가면 줄바꿈) */}
    //     <div className="flex flex-wrap items-start gap-4">
    //       {mockApplications.map((app) => (
    //         <ResultApplicationCard
    //           key={app.id}
    //           id={Number(app.id)}
    //           jobPostingId={Number(app.id)}
    //           mockApplyId={Number(app.id)}
    //           company={app.company}
    //           position={app.position}
    //           createdAt={app.createdAt}
    //           score={app.score}
    //           version={app.version}
    //           // 핸들러 연결
    //           onDeleteClick={() => handleDelete(app.company)}
    //           onRetryClick={() => handleRetry(app.company)}
    //           onResumeClick={() => handleResume(app.company)}
    //         />
    //       ))}
    //     </div>
    //   </section>{" "}
    <div className="min-h-screen bg-gray-50 p-10 font-sans flex flex-col items-center gap-16">
      {/* 1. 상단 Draft 리스트 섹션 */}
      <section className="w-full max-w-5xl flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Draft</h1>
          {/* 고양이 아이콘 들어갈 자리 (임시) */}
          <span className="text-2xl">🐱</span>
        </div>

        {/* Draft 리스트 렌더링 (보라색 점선 래퍼는 Container 안에 있거나 여기에 추가) */}
        <div className="w-full">
          <ResultDraftCard />
        </div>
      </section>

      {/* 2. 하단 Item 상태별 미리보기 섹션 */}
      <section className="w-full max-w-2xl flex flex-col items-center gap-6 p-10 bg-white rounded-3xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Item</h2>

        {/* 보라색 점선 박스 안에 단계별 상태 나열 */}
        <div className="border border-dashed border-purple-400 rounded-2xl p-10 flex flex-col gap-8 bg-gray-50">
          {/* 1단계 */}
          <ResultDraftStep currentStep={1} totalSteps={3} />

          {/* 2단계 */}
          <ResultDraftStep currentStep={2} totalSteps={3} />

          {/* 3단계 (완료) */}
          <ResultDraftStep currentStep={3} totalSteps={3} />
        </div>
      </section>
    </div>
    // </div>
  );
}
