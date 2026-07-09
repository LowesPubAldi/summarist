export function formatDuration(duration?: string | number | null) {
  const formatMinutesSeconds = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (duration == null || duration === "") {
    return "";
  }

  if (typeof duration === "number") {
    return formatMinutesSeconds(duration);
  }

  const trimmedDuration = duration.trim();

  if (/^\d+$/.test(trimmedDuration)) {
    return formatMinutesSeconds(Number(trimmedDuration));
  }

  return trimmedDuration;
}