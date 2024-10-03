/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-env es6 */

function isGreater(d1, d2) {
  try {
    const date1 = d1 instanceof Date ? d1.getTime() : new Date(d1).getTime();
    const date2 = d2 instanceof Date ? d2.getTime() : new Date(d2).getTime();
    if (date1 > date2) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

function isGreaterOrEqual(d1, d2) {
  try {
    const date1 = d1 instanceof Date ? d1.getTime() : new Date(d1).getTime();
    const date2 = d2 instanceof Date ? d2.getTime() : new Date(d2).getTime();
    if (date1 >= date2) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

function isLess(d1, d2) {
  try {
    const date1 = d1 instanceof Date ? d1.getTime() : new Date(d1).getTime();
    const date2 = d2 instanceof Date ? d2.getTime() : new Date(d2).getTime();
    if (date1 < date2) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

function isLessOrEqual(d1, d2) {
  try {
    const date1 = d1 instanceof Date ? d1.getTime() : new Date(d1).getTime();
    const date2 = d2 instanceof Date ? d2.getTime() : new Date(d2).getTime();
    if (date1 <= date2) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

function isEqual(d1, d2) {
  try {
    const date1 = d1 instanceof Date ? d1.getTime() : new Date(d1).getTime();
    const date2 = d2 instanceof Date ? d2.getTime() : new Date(d2).getTime();
    if (date1 === date2) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

function isBetween(start, dateToCompare, end) {
  return (
    isGreaterOrEqual(dateToCompare, start) && isLessOrEqual(dateToCompare, end)
  );
}

function startEndDate() {
  const n = new Date();
  const year = n.getFullYear();
  const month = String(n.getMonth() + 1).padStart(2, `0`);
  const lastDate = String(new Date(year, 0, 0).getDate()).padStart(2, `0`);
  return { start_date: `${year}-${month}-01`, end_date: `${year}-${month}-${lastDate}` };
}

function isThisMonthAction(date) {
  const betweenDate = startEndDate();
  const date1 = date instanceof Number ? date : new Date(date).getTime();
  const date2 = new Date(betweenDate.start_date).getTime();
  const date3 = new Date(betweenDate.end_date).getTime();
  return date1 >= date2 && date1 <= date3 ;
  // return (isGreaterOrEqual(date, betweenDate.start_date) && isLessOrEqual(date, betweenDate.end_date));
}

function getDateInFormat(dateObj, day = 0, format = `en`, withHour = false) {
  // var newDateObj = isNumber(dateObj) ? dateObj*1000 : dateObj;
  var now = dateObj instanceof Date ? dateObj : new Date(dateObj);

  var m = String(now.getMonth() + 1).padStart(2, `0`);
  var d = String(day !== 0 ? day : now.getDate()).padStart(2, `0`);
  var y = now.getFullYear();
  var h = now.getHours();
  var mm = String(now.getMinutes()).padStart(2, `0`);
  var s = String(now.getSeconds()).padStart(2, `0`);
  // var mm = now.getMinutes() < 10 ? `0` + now.getMinutes() : now.getMinutes();
  // var s = now.getSeconds() < 10 ? `0` + now.getSeconds() : now.getSeconds();
  if (withHour === true) {
    if (format === `fr`) {
      return `${d}/${m}/${y} ${h}:${mm}:${s}`;
    }
    return `${y}-${m}-${d} ${h}:${mm}:${s}`;
  } else {
    if (format === `fr`) {
      return `${d}/${m}/${y}`;
    }
    return `${y}-${m}-${d}`;
  }
}

module.exports = {
  isGreater,
  isGreaterOrEqual,
  isLess,
  isLessOrEqual,
  isEqual,
  isBetween,
  startEndDate,
  isThisMonthAction,
  getDateInFormat
};
