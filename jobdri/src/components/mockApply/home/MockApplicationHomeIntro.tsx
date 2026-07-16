// function IntroStepCard({ step }: number) {
//   const StepImage = step.Image;
//   const isStepThree = step.step === "STEP 03";

//   return (
//     <div className="flex w-[280px] flex-none flex-col items-center gap-[18px]">
//       <div className="flex flex-col items-center gap-2 self-stretch">
//         <div className="flex flex-col items-start self-stretch">
//           <span className="truncate self-stretch text-center text-label14-semibold text-text-primary-default [font-feature-settings:'liga'_off,'clig'_off]">
//             {step.step}
//           </span>
//           <h3 className="truncate self-stretch text-center text-b16-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
//             {step.title}
//           </h3>
//         </div>
//         <p className="line-clamp-3 whitespace-pre-line text-center text-label14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
//           {step.description}
//         </p>
//       </div>

//       {isStepThree ? (
//         <div className="flex w-[240px] shrink-0 items-center justify-center pt-0 pr-[16.051px] pb-[44.283px] pl-[15.06px]">
//           <StepImage
//             className="h-[200.718px] w-[208.889px] shrink-0 -translate-y-6"
//             preserveAspectRatio="xMidYMid meet"
//             aria-hidden="true"
//           />
//         </div>
//       ) : (
//         <StepImage
//           className={`h-[240px] w-[240px] shrink-0 overflow-visible ${
//             step.step === "STEP 02" ? "-translate-x-10" : "-translate-x-2"
//           }`}
//           preserveAspectRatio="xMaxYMin meet"
//           aria-hidden="true"
//         />
//       )}
//     </div>
//   );
// }

// export function MockApplicationHomeIntro() {
//   return (
//     <div className="flex h-[304px] flex-row items-start justify-center gap-3 self-stretch overflow-hidden rounded-card bg-blue-100 px-6 py-8">
//       {INTRO_STEPS.map((step) => (
//         <IntroStepCard key={step.step} step={step} />
//       ))}
//     </div>
//   );
// }
