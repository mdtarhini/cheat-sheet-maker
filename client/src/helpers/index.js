export const isDateToday = (date) => {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate()
  );
};
export const isDateThisYear = (date) => {
  const now = new Date();
  return date.getFullYear() === now.getFullYear();
};

export const formatDate = (date) => {
  if (isDateToday(date)) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else if (isDateThisYear(date)) {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  } else {
    return date.toLocaleDateString([], {
      month: "short",
      year: "numeric",
      day: "numeric",
    });
  }
};
export const ellipseAText = (text, numberOfChars) => {
  return `${text.slice(0, numberOfChars)}${
    text.length > numberOfChars ? "..." : ""
  }`;
};
export const getFormattedElpasedTime = (timeInMS) => {
  // const arrayOfPossibleUnits = [{60000}, {60}, {24, 30, 12];
  const arrayOfPossibleUnits = [
    { unit: "minute", factor: 60000 },
    { unit: "hour", factor: 60 * 60000 },
    { unit: "day", factor: 24 * 60 * 60000 },
    { unit: "week", factor: 7 * 24 * 60 * 60000 },
    { unit: "month", factor: 30 * 24 * 60 * 60000 },
    { unit: "year", factor: 12 * 30 * 24 * 60 * 60000 },
  ];
  const timeNow = Date.now();
  // const timeUnits = {minutes}
  const arrayOfElpasedTimeInUnits = arrayOfPossibleUnits.map((item) => {
    return {
      unit: item.unit,
      elpasedTime: Math.floor(Math.abs(timeNow - timeInMS) / item.factor),
    };
  });
  for (let iUnit = arrayOfElpasedTimeInUnits.length - 1; iUnit >= 0; iUnit--) {
    if (arrayOfElpasedTimeInUnits[iUnit].elpasedTime > 0) {
      return `${arrayOfElpasedTimeInUnits[iUnit].elpasedTime} ${
        arrayOfElpasedTimeInUnits[iUnit].unit
      }${arrayOfElpasedTimeInUnits[iUnit].elpasedTime === 1 ? "" : "s"} ${
        timeNow > timeInMS ? "ago" : "remains"
      }`;
    }
  }
  return "just now";
};

export const filterAnObject = (obj, func) => {
  return Object.keys(obj)
    .filter((key) => func(obj[key]))
    .reduce((filteredObj, filteredKey) => {
      return { ...filteredObj, [filteredKey]: obj[filteredKey] };
    }, {});
};
