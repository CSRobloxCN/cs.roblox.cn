function readData(obj, keyPath) {
  try {
    if (keyPath instanceof Array) {
      return keyPath.reduce((pre, cur) => {
        return pre[cur];
      }, obj);
    } else {
      return obj[keyPath];
    }
  } catch (e) {
    console.error(
      `Failed to read Key Path: ${
        keyPath instanceof Array ? keyPath.join(",") : keyPath
      }`
    );
    return null;
  }
}

function parseDateTimeWithTimeZone(date) {
  let localeString = date.toLocaleString();
  let timeZoneOffset = date.getTimezoneOffset();
  let timeZoneMark = timeZoneOffset > 0 ? "-" : "+";
  let absoluteTimeZoneOffset =
    timeZoneOffset > 0 ? timeZoneOffset : -timeZoneOffset;
  let timeZoneHour = Math.floor(absoluteTimeZoneOffset / 60);
  let timeZoneMinute = absoluteTimeZoneOffset - timeZoneHour * 60;
  let timeZoneString =
    timeZoneMark +
    padNumberWithZeroToLength(timeZoneHour, 2) +
    ":" +
    padNumberWithZeroToLength(timeZoneMinute, 2);
  return localeString + " " + timeZoneString;
}

function padNumberWithZeroToLength(number, length) {
  let numberString = "" + number;
  if (numberString.length < length) {
    for (let i = numberString.length; i < length; i++) {
      numberString = "0" + numberString;
    }
  }
  return numberString;
}

export { readData, parseDateTimeWithTimeZone };
