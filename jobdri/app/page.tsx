// app/page.tsx
import Icon from "@/components/icons/Icon";
import Image from "next/image";
import IconBox from "@/components/icons/IconBox";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-white">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-h28-bold text-black">타이틀 텍스트 (28px, bold)</h1>

        <p className="text-b16-med text-zinc-600">본문 텍스트 (16px, medium)</p>

        <button className="text-btn16-semibold bg-black text-white px-6 py-3 rounded-full">
          버튼 텍스트(16px, semibold)
        </button>
      </main>

      <IconBox type="TRASH" />
      <IconBox type="HOME_M" />
    </div>
  );
}
