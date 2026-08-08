<div align="center">
  <img width="100" height="100" alt="Frame" src="https://github.com/user-attachments/assets/7b83190d-ecec-4c33-8cbb-02ea24e339bc" />

  <h1>JobDri</h1>

  <p><strong>채용공고 분석 및 자소서 기반 모의지원 서비스 (Front-End)</strong></p>

  <!-- 기술 스택 뱃지 -->
  <p>
    <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  </p>
  <p>
    <img src="https://img.shields.io/badge/Zustand-45211A?style=for-the-badge" alt="Zustand" />
    <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="React Query" />
    <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
  </p>
</div>

<br />

## Overview
**JobDri**는 구직자가 실전처럼 대비할 수 있도록 돕는 모의지원 플랫폼입니다. 
단순한 정보 제공을 넘어 채용공고의 완성도, 적합도, 그리고 예상 성과를 정교하게 분석하여 성공적인 커리어 여정을 지원합니다.

## Front-End Core Values
> **화려한 기술 스택보다 중요한 것들에 집중합니다.**
- **사용자 중심 (User-Centric):** 화면 너머의 사용자를 먼저 생각하며, 직관적이고 몰입감 있는 UI/UX를 구현합니다.
- **소통과 조율 (Communication):** 기획, 디자인, 백엔드 등 다양한 파트와의 유연한 의견 조율을 통해 프로덕트의 완성도를 높입니다.
- **성장 (Growth):** 동료의 피드백을 적극적으로 수용하고 프로덕트에 온전히 몰입하는 개발 문화를 지향합니다.

## Tech Stack & Architecture

### Environment & Core
- **Framework**: Next.js 16 (App Router), React 19
- **Language**: TypeScript
- **Package Manager**: pnpm (workspace)

### Styling & State Management
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (Client), TanStack Query (Server)

### Features & Infrastructure
- **Payment**: PortOne, Toss Payments SDK
- **Code Quality**: ESLint, Prettier, Husky + lint-staged

## Key Features
- **인증 및 인가**: OAuth2 기반의 간편하고 안전한 소셜 로그인
- **모의지원**: 지원서 작성 및 채용공고 심층 분석 (완성도, 적합도, 성과 분석)
- **크레딧**: Toss Payments 기반의 매끄러운 결제 및 크레딧 관리 경험
- **실시간 알림**: 사용자의 몰입을 깨지 않는 실시간 Notification 스트리밍

## Folder Structure
> 유지보수와 확장성을 고려하여 App Router 기반의 구조를 채택했습니다.

```text
jobdri/
├── public/            # 폰트, 파비콘 등 정적 에셋
└── src/
    ├── app/           # App Router 라우팅 엔트리
    ├── assets/        # 아이콘, 이미지, 애니메이션 자원
    ├── components/    # 재사용 가능한 UI 컴포넌트
    ├── config/        # 환경변수 및 전역 설정 값
    ├── constants/     # 공통 상수
    ├── hooks/         # 비즈니스 로직 및 커스텀 훅
    ├── lib/           # 외부 API, 인증, 상태 저장소 세팅
    ├── styles/        # Tailwind 및 전역 스타일 시트
    └── utils/         # 순수 유틸리티 함수
```
