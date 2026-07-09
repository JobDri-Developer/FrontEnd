"use client";

import TabMenu from "@/components/common/tabs/TabMenu";

export default function TestPage() {
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
    </div>
  );
}
