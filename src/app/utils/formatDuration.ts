export function formatDuration(duration?: string | number | null) {
  if (duration == null || duration === "") {
    return "";
  }

  if (typeof duration === "number") {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);

    return `${minutes} mins ${seconds} secs`;
  }

  const trimmedDuration = duration.trim();

  if (/^\d+$/.test(trimmedDuration)) {
    const totalSeconds = Number(trimmedDuration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes} mins ${seconds} secs`;
  }

  return trimmedDuration;
}