// simulate api call with promise and timeout
export const imitateApi = (time: number, fail: boolean = false) => {
  if (fail)
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error("API Error")), time)
    );
  return new Promise((resolve) => setTimeout(resolve, time));
};
