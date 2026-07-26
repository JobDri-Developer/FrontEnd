export const formatDate = (dateString: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

export function formatRelativeDate(date: string | Date): string {
  const targetDate = new Date(date);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  );

  const diffTime = today.getTime() - targetDay.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "오늘";
  }

  if (diffDays === 1) {
    return "어제";
  }

  if (diffDays >= 2 && diffDays <= 7) {
    return `${diffDays}일전`;
  }

  const year = String(targetDate.getFullYear()).slice(-2);
  const month = String(targetDate.getMonth() + 1).padStart(2, "0");
  const day = String(targetDate.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}
