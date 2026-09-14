/*
 * Amplitude 이벤트 레지스트리.
 */

// ---------------------------------------------------------------------------
// 속성 값 타입
// 문자열 리터럴 유니온
// ---------------------------------------------------------------------------

export type LoginMethod = "email" | "google";
export type LoginReferrer = "direct" | "mockApply" | "credit";

/** TODO(taxonomy): extension은 추후 예정으로 현재는 제외 */
export type EntrySource = "new" | "resume" | "retry" | "extension";

/** TODO(taxonomy): 코드는 rawText/sourceUrl/imageObjectKey 3종을 지원한다. "url" 누락. */
export type JdInputMethod = "text" | "image";

export type JdSectionId =
  | "company_name"
  | "position"
  | "duties"
  | "requirements"
  | "preferred";

export type QuestionAction = "select" | "deselect";
export type CarouselDirection = "left" | "right";
export type ApplySection = "paused" | "completed";
export type HomeResultFilter = "all" | "needs_improvement" | "improvable";
export type BadgeType = "needs_improvement" | "improvable";
export type ResultTab = "feedback" | "jd";
export type SummaryFilterType = "strength" | "weakness";
export type AnalysisErrorType = "credit_insufficient" | "unknown";
export type PlanCode = "ONE_TIME" | "PACK_5" | "PACK_10";

/** 프로퍼티가 없는 이벤트. 공통 속성(page_path 등)은 플러그인이 자동으로 붙인다. */
type NoProperties = Record<string, never>;

// ---------------------------------------------------------------------------
// 이벤트 → 프로퍼티 매핑
// ---------------------------------------------------------------------------

export interface EventPropertiesMap {
  // --- 인프라 (택소노미 문서에 없는 추가 이벤트) ---------------------------
  /** 모든 화면 조회의 베이스라인. page_path는 공통 속성으로 자동 주입된다. */
  page_viewed: NoProperties;

  // --- 로그인 / 회원가입 ---------------------------------------------------
  /** TODO(taxonomy): referrer는 Amplitude 시스템 필드와 이름이 겹친다. entry_source 권장. */
  login_page_viewed: { referrer: LoginReferrer };
  login_submitted: { login_method: Extract<LoginMethod, "email"> };
  login_completed: { login_method: LoginMethod };
  /** TODO(taxonomy): error_message 원문 대신 백엔드 code(AuthApiError.code) 사용 권장 */
  login_failed: {
    login_method: Extract<LoginMethod, "email">;
    error_message: string;
  };
  google_login_clicked: NoProperties;

  signup_page_viewed: NoProperties;
  signup_submitted: NoProperties;
  signup_failed: { error_message: string };

  verification_submitted: NoProperties;
  /** 가입 전환 포인트 */
  verification_completed: NoProperties;
  verification_failed: { error_message: string };
  verification_resend_clicked: NoProperties;

  // --- 홈 (내 모의지원) ----------------------------------------------------
  home_page_viewed: { paused_count: number; completed_count: number };
  /** 퍼널 진입점 */
  new_apply_clicked: NoProperties;

  paused_apply_resumed: {
    mock_apply_id: number;
    company: string;
    position: string;
    /** TODO(taxonomy): 화면 표시 문자열("자소서 작성") 대신 MockApplyProgressStatus 코드값 권장 */
    status: string;
    /** TODO(taxonomy): "2/3" 문자열이라 집계 불가. current_step/total_steps 분리 권장 */
    progress: string;
  };
  paused_carousel_navigated: {
    direction: CarouselDirection;
    total_pages: number;
    current_page: number;
  };
  paused_kebab_clicked: { mock_apply_id: number; company: string };
  apply_delete_confirmed: {
    mock_apply_id: number;
    company: string;
    section: ApplySection;
  };

  /** TODO(taxonomy): 결과 페이지의 result_summary_filter_changed와 혼동됨. home_ 접두사 권장 */
  result_filter_changed: {
    filter_type: HomeResultFilter;
    result_count: number;
  };
  /** TODO(taxonomy): 실제 행동은 카드 클릭. result_card_clicked가 정확 */
  result_apply_viewed: {
    mock_apply_id: number;
    company: string;
    position: string;
    score: number;
    badge_type: BadgeType;
    /** TODO(taxonomy): "오늘"/"3일 전" 표시 문자열이라 집계 불가. ISO 날짜 권장 */
    analysis_date: string;
  };
  apply_retry_clicked: {
    mock_apply_id: number;
    company: string;
    score: number;
  };

  // --- 공고 입력 / 확인 ----------------------------------------------------
  jd_input_page_viewed: { mock_apply_id: number; entry_source: EntrySource };
  jd_input_submitted: {
    mock_apply_id: number;
    input_method: JdInputMethod;
    has_company_name: boolean;
  };
  jd_review_page_viewed: { mock_apply_id: number };
  jd_section_edit_clicked: { mock_apply_id: number; section_id: JdSectionId };
  jd_section_edited: { mock_apply_id: number; section_id: JdSectionId };

  // --- 문항 선택 -----------------------------------------------------------
  question_select_page_viewed: { mock_apply_id: number };
  question_selected: {
    mock_apply_id: number;
    /** TODO(taxonomy): 문서 예시가 1(숫자)과 default_1(문자열) 혼재. string으로 통일 */
    question_id: string;
    action: QuestionAction;
    selected_count: number;
  };
  custom_question_added: { mock_apply_id: number; selected_count: number };
  question_select_submitted: {
    mock_apply_id: number;
    total_selected: number;
    custom_question_count: number;
  };

  // --- 자소서 입력 ---------------------------------------------------------
  write_page_viewed: { mock_apply_id: number; question_count: number };
  answer_tab_switched: { mock_apply_id: number; question_index: number };
  /**
   * TODO(taxonomy): 디바운스는 문서의 1.5초가 아니라 실제로는 1초(useDebounce 기본값).
   * 저장마다 발화하면 자소서 1건당 수백 건이 쌓인다.
   * completed_count가 변할 때만 발화하도록 Phase 2에서 조정할 것.
   */
  answer_auto_saved: { mock_apply_id: number; completed_count: number };
  apply_submit_clicked: { mock_apply_id: number; all_complete: boolean };
  /** 핵심 전환 이벤트 (크레딧 차감 시점) */
  apply_confirmed: { mock_apply_id: number; job_posting_id: number };

  credit_insufficient_shown: { mock_apply_id: number };
  credit_charge_from_modal_clicked: { mock_apply_id: number };

  // --- 분석 로딩 -----------------------------------------------------------
  analysis_started: { mock_apply_id: number; job_posting_id: number };
  analysis_completed: {
    mock_apply_id: number;
    job_posting_id: number;
    sequence: number;
  };
  analysis_failed: { mock_apply_id: number; error_type: AnalysisErrorType };

  // --- 결과 확인 -----------------------------------------------------------
  // TODO(taxonomy): 아래 5개 이벤트에 mock_apply_id가 없어서 지원 건 단위 퍼널이 끊긴다.
  //                 라우트(/mockApply/[mockApplyId]/result)에 이미 있으므로 추가만 하면 된다.
  result_page_viewed: {
    job_posting_id: number;
    sequence: number;
    total_count: number;
  };
  result_tab_switched: { job_posting_id: number; tab_name: ResultTab };
  result_summary_filter_changed: {
    job_posting_id: number;
    filter_type: SummaryFilterType;
  };
  result_retry_clicked: { job_posting_id: number; sequence: number };
  result_save_exit_clicked: { job_posting_id: number };

  // --- 크레딧 -------------------------------------------------------------
  credit_page_viewed: { remaining_credit: number };
  credit_plan_clicked: {
    plan_code: PlanCode;
    credit_amount: number;
    price: number;
  };
  /** 매출 핵심 이벤트 */
  credit_purchase_completed: {
    plan_code: PlanCode;
    credit_amount: number;
    price: number;
  };
}

export type EventName = keyof EventPropertiesMap;
