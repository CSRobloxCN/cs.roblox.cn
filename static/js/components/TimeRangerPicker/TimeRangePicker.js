import React from "react";
import { DatePicker, message } from "antd";
import moment from "moment";
import { useTranslation } from "react-i18next";

const { RangePicker } = DatePicker;

// function onChange(dates, dateStrings) {
//   console.log("From: ", dates[0], ", to: ", dates[1]);
//   console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
// }


export default function TimeRangePicker({ onChange, stripHour/*true or false*/, defaultValue/*list of ISO String*/}) {
  const { t } = useTranslation();
  // This function is used to strip minutes, seconds
  // 2021-11-07T19:12:32.234Z => 2021-11-07T19:00:00.000Z
  function PreProcessing(moments)
  {
    // if stripHour is true, then the moment object should have hour to be its smallest unit
    if (moments && stripHour)
    {
      // This is to check if the input moment objet has values on minutes or seconds
      // The user should be warned that these values will be eliminated  
      if (moments.some((moment) => moment.minutes() != 0 || moment.seconds() != 0))
      {
        message.warn(t("The smallest unit is hour, will strip the values of minutes and seconds"));
        moments[0] = moments[0].startOf("hour");
        moments[1] = moments[1].startOf("hour");
      }
    }
    return onChange(moments?.map((momentItem) => momentItem.toISOString()));
  }

  return (
    <RangePicker
      ranges={{ 
        [t("Today")]: [moment().startOf("day"), moment()],
        [t("This Week")]: [moment().startOf("week"), moment()],
        [t("This Month")]: [moment().startOf("month"), moment()],
        [t("Past 12 hours")]: [moment().subtract(12, "hours"), moment()],
        [t("Past 24 hours")]: [moment().subtract(24, "hours"), moment()],
        [t("Past 3 days")]: [moment().subtract(3, "days"), moment()],
        [t("Past 1 week")]: [moment().subtract(1, "weeks"), moment()],
        [t("Past 1 month")]: [moment().subtract(1, "months"), moment()],
      }}
      showTime
      // defaultValue passed in is the ISOString. Moment.parseZone is used to parse ISOString to moment 
      defaultValue = {defaultValue?.map((momentItem) => moment.parseZone(momentItem))}
      format="YYYY/MM/DD HH:mm:ss"
      onChange={(moments)=> 
        PreProcessing(moments, stripHour)
      }
    />
  );
}
