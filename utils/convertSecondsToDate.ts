export const convertSecondsToDate = (seconds: number, nanoseconds: number) => {
  const date = new Date(seconds * 1000 + nanoseconds / 1000000);
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options as any);
};
