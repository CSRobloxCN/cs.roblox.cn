import moment from "moment";

function converUtcToLocal(utcLockedTime) {  
  var localLockedTime = moment.utc(utcLockedTime).local().format("YYYY-MM-DD HH:mm:ss");
  return localLockedTime;
}

export default converUtcToLocal;
