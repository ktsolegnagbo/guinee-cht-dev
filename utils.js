/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-env es6 */

function isAlive(contact, reports) {
  if (notNull(contact) && notNull(contact.date_of_death)) {
    return false;
  }

  const lastReport = getMostRecentReport(reports, [
    `death_report`,
    `undo_death_report`,
  ]);
  if (isReportValid(lastReport)) {
    if (lastReport.form === `death_report`) {
      return false;
    } else if (lastReport.form === `undo_death_report`) {
      return true;
    }
  }
  return true;
}

function notNull(data) {
  const isEmpty = Array.isArray(data) ? data.length === 0 : false;
  return (
    data !== null &&
    data !== `` &&
    data !== undefined &&
    typeof data !== undefined &&
    isEmpty === false
  );
}

function isReco(thisUser) {
  return notNull(thisUser.parent) && thisUser.role === `reco`;
  //  return thisUser.parent && thisUser.parent.contact_type === 'chw_area';
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  // or
  // return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
}

function isFormArraySubmittedInWindow(
  reports,
  formArray,
  start,
  end,
  excludeReport,
  count
) {
  var found = false,
    reportCount = 0;
  if (typeof formArray === `string`) {
    formArray = [formArray];
  }
  reports.forEach(function (report) {
    if (
      formArray.includes(report.form) &&
      report.reported_date >= start &&
      report.reported_date <= end &&
      (excludeReport ? report._id !== excludeReport._id : true)
    ) {
      found = true;
      if (count) reportCount++;
    }
  });
  return count ? reportCount >= count : found;
}

function isReportValid(r) {
  if (r) {
    if (r.form && r.fields && r.reported_date && !r.deleted) {
      return true;
    }
  }
  return false;
}

function getMostRecentReport(reports, forms) {
  var result;
  reports.forEach(function (r) {
    // if (forms.indexOf(r.form) >= 0 && !r.deleted && (!result || r.reported_date > result.reported_date)) {
    //   result = r;
    // }
    if (
      isReportValid(r) &&
      forms.includes(r.form) &&
      (!result || r.reported_date > result.reported_date)
    ) {
      result = r;
    }
  });
  return result;
}

function isDelivery(reports) {
  const r = getMostRecentReport(reports, [
    `pregnancy_family_planning`,
    `pregnancy_register`,
    `delivery`,
    `postnatal_followup`,
    `fp_danger_sign_check`,
    `fp_renewal`,
    `family_planning`,
  ]);
  if (isReportValid(r)) {
    if ([`delivery`, `postnatal_followup`].includes(r.form)) {
      return true;
    }
  }
  return false;
}

function notDeleted(contact, report) {
  if (notNull(report)) {
    return !isTrue(contact.contact.deleted) && !isTrue(report.deleted);
  } else if (notNull(contact)) {
    return !isTrue(contact.contact.deleted);
  }
  return false;
}

function getField(report, fieldPath) {
  return [`fields`, ...(fieldPath || ``).split(`.`)].reduce(
    (prev, fieldName) => {
      if (prev === undefined) return notNull(report) ? report : ``;
      return notNull(prev[fieldName]) ? prev[fieldName] : ``;
    },
    report
  );
}

function isWomanPregnant(reports) {
  const r = getMostRecentReport(reports, [
    `pregnancy_family_planning`,
    `pregnancy_register`,
    `prenatal_followup`,
    `delivery`,
    `fp_danger_sign_check`,
    `fp_renewal`,
    `family_planning`,
  ]);
  if (
    isReportValid(r) &&
    [
      `pregnancy_family_planning`,
      `pregnancy_register`,
      `prenatal_followup`,
    ].includes(r.form)
  ) {
    return getField(r, `is_pregnant`) === `true`;
  }
  return false;
}

function isUnderFamilyPlanning(reports) {
  if (!isWomanPregnant(reports)) {
    const r = getMostRecentReport(reports, [
      `pregnancy_family_planning`,
      `family_planning`,
      `fp_renewal`,
    ]);
    const nDate = getField(r, `next_fp_renew_date`);
    if (notNull(nDate)) {
      const ok1 = getField(r, `is_pregnant`) !== `true`;
      const ok2 = getField(r, `method_was_given`) === `true`;
      const ok3 = new Date(nDate) > new Date();
      return ok1 && ok2 && ok3;
    }
  }
  return false;
}

function isTrue(data) {
  return notNull(data) && (data === true || data === `true` || data === `yes`);
}

function getTimeForMidnight(d) {
  const date = new Date(d);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

function canApplies(contact, report, formNames) {
  const isPerson = contact.contact && contact.contact.type === `person`;
  // const isPerson = contact.contact && contact.contact.type === `person` && user.parent.type !== `district_hospital`;
  var isForm = report.form === formNames;
  if (Array.isArray(formNames)) {
    isForm = formNames.includes(report.form);
  }

  return (
    isTrue(isPerson) &&
    isTrue(isForm) &&
    notDeleted(contact, report) &&
    isAlive(contact.contact, contact.reports)
  );
}

function getPriority(priorityData) {
  return {
    level: priorityData.priority_level || `medium`, //`high`, `medium`
    label: priorityData.priority_label || ``,
  };
}

function R_Date(dueDate, event, end = false) {
  if (end === true) {
    return addDays(dueDate, event.end + 1).getTime();
  }
  return addDays(dueDate, -event.start).getTime();
}

function addDays(date, days) {
  const result = getTimeForMidnight(new Date(date));
  result.setDate(result.getDate() + days);
  return result;
}

function toYesNo(data) {
  return data === `true` ? `yes` : data === `false` ? `no` : data;
}

function getMostRecentPatientCode(contact, reports) {
  const r = getMostRecentReport(reports, [`create_new_patient`]);
  const code = getField(r, `patient_code_number`);
  if (code && isNumber(code) && code > 0) return code;
  if (code && parseInt(`${code}`) > 0 && isNumber(parseInt(`${code}`)))
    return code;
  return -1;
}

function getMostRecentFamilyCode(contact, reports) {
  const r = getMostRecentReport(reports, [`create_new_family`]);
  const code = getField(r, `family_code_number`);
  if (code && isNumber(code) && code > 0) return code;
  if (code && parseInt(`${code}`) > 0 && isNumber(parseInt(`${code}`)))
    return code;
  return -1;
}

function getMostRecentVaccinationData(contact, reports) {
  const r = getMostRecentReport(reports, [`vaccination_followup`]);
  return {
    vaccine_BCG: getField(r, `vaccine_BCG`),
    vaccine_VPO_0: getField(r, `vaccine_VPO_0`),
    vaccine_PENTA_1: getField(r, `vaccine_PENTA_1`),
    vaccine_VPO_1: getField(r, `vaccine_VPO_1`),
    vaccine_PENTA_2: getField(r, `vaccine_PENTA_2`),
    vaccine_VPO_2: getField(r, `vaccine_VPO_2`),
    vaccine_PENTA_3: getField(r, `vaccine_PENTA_3`),
    vaccine_VPO_3: getField(r, `vaccine_VPO_3`),
    vaccine_VPI_1: getField(r, `vaccine_VPI_1`),
    vaccine_VAR_1: getField(r, `vaccine_VAR_1`),
    vaccine_VAA: getField(r, `vaccine_VAA`),
    vaccine_VPI_2: getField(r, `vaccine_VPI_2`),
    vaccine_MEN_A: getField(r, `vaccine_MEN_A`),
    vaccine_VAR_2: getField(r, `vaccine_VAR_2`),

    no_BCG_reason: getField(r, `no_BCG_reason`),
    no_VPO_0_reason: getField(r, `no_VPO_0_reason`),
    no_PENTA_1_reason: getField(r, `no_PENTA_1_reason`),
    no_VPO_1_reason: getField(r, `no_VPO_1_reason`),
    no_PENTA_2_reason: getField(r, `no_PENTA_2_reason`),
    no_VPO_2_reason: getField(r, `no_VPO_2_reason`),
    no_PENTA_3_reason: getField(r, `no_PENTA_3_reason`),
    no_VPO_3_reason: getField(r, `no_VPO_3_reason`),
    no_VPI_1_reason: getField(r, `no_VPI_1_reason`),
    no_VAR_1_reason: getField(r, `no_VAR_1_reason`),
    no_VAA_reason: getField(r, `no_VAA_reason`),
    no_VPI_2_reason: getField(r, `no_VPI_2_reason`),
    no_MEN_A_reason: getField(r, `no_MEN_A_reason`),
    no_VAR_2_reason: getField(r, `no_VAR_2_reason`),

    has_vaccine_not_done: toYesNo(getField(r, `has_vaccine_not_done`)),
    has_vaccine_done: toYesNo(getField(r, `has_vaccine_done`)),
    is_birth_vaccine_ok: toYesNo(getField(r, `is_birth_vaccine_ok`)),
    is_six_weeks_vaccine_ok: toYesNo(getField(r, `is_six_weeks_vaccine_ok`)),
    is_ten_weeks_vaccine_ok: toYesNo(getField(r, `is_ten_weeks_vaccine_ok`)),
    is_forteen_weeks_vaccine_ok: toYesNo(
      getField(r, `is_forteen_weeks_vaccine_ok`)
    ),
    is_nine_months_vaccine_ok: toYesNo(
      getField(r, `is_nine_months_vaccine_ok`)
    ),
    is_fifty_months_vaccine_ok: toYesNo(
      getField(r, `is_fifty_months_vaccine_ok`)
    ),
    has_vaccine_up_to_date: toYesNo(getField(r, `has_vaccine_up_to_date`)),
    has_all_vaccine_done: toYesNo(getField(r, `has_all_vaccine_done`)),
  };
}

function filtrerDoublonsMaxValMapIds(reports, form) {
  let rRpts = {};
  for (const r of reports) {
    if (r.fields && r.form === form) {
      const id = r.fields.patient_id;
      const val = r.reported_date;
      if (id && val && notNull(id) && notNull(val)) {
        if (!(id in rRpts) || (id in rRpts && val > rRpts[id].val)) {
          rRpts[id] = { val: val, report: r };
        }
      }
    }
  }
  const mapIds = Object.values(rRpts).map((v) => v.report._id);
  return mapIds;
}

function getAge(contact) {
  if (contact && contact.contact && notNull(contact.contact.date_of_birth)) {
    const birthDate = new Date(contact.contact.date_of_birth);
    const age = new Date(Date.now() - birthDate.getTime());
    return age;
  }
  return null;
}

function getAgeInYear(contact, withUtc = true) {
  var ageInMs = getAge(contact);
  if (ageInMs !== null) {
    const year = withUtc ? ageInMs.getUTCFullYear() : ageInMs.getFullYear();
    return Math.abs(year - 1970);
    // return Math.round(ageInMs.getTime() / (1000 * 60 * 60 * 24 *365));
  }
  return null;
}

function getAgeInMonths(contact, round = false) {
  var ageInMs = getAge(contact);
  if (ageInMs !== null) {
    const ageInMonth = ageInMs.getTime() / (1000 * 60 * 60 * 24 * 30);
    return round ? Math.round(ageInMonth) : ageInMonth;
    // return (Math.abs(ageInMs.getFullYear() - 1970) * 12) + ageInMs.getMonth();
  }
  return null;
}

function isChildUnder5(contact) {
  var childAge = getAgeInMonths(contact);
  if (childAge !== null) {
    return childAge < 60;
  }
  return false;
}

function getAgeInDays(contact) {
  // var days = (new Date() - new Date(1995, 11, 4)) / (1000 * 60 * 60 * 24);
  var ageInMs = getAge(contact);
  if (notNull(ageInMs)) {
    return ageInMs / (1000 * 60 * 60 * 24);
  }
  return null;
}

function isVaccinAgeLimit(contact) {
  var age = getAgeInDays(contact);
  return age !== null && age < 1825;
}

//Define a function to get the household ID based on the hierarchy configuration
function getHouseholdId(contact) {
  const c = contact;
  if (c.contact) {
    if (c.contact.type === `clinic`) {
      return c.contact._id;
    }
    if (c.contact.parent) {
      return c.contact.parent._id;
    }
  }
  return ``;
}

//Define a function to determine if contact is patient
function isPatient(contact) {
  const c = contact;
  return c.contact && c.contact.type === `person` && c.contact.role === `patient`;
}

module.exports = {
  notNull,
  isAlive,
  isReco,
  isNumber,
  isFormArraySubmittedInWindow,
  isReportValid,
  getMostRecentReport,
  isDelivery,
  notDeleted,
  isWomanPregnant,
  isUnderFamilyPlanning,
  canApplies,
  getPriority,
  R_Date,
  getField,
  getMostRecentVaccinationData,
  getMostRecentPatientCode,
  getMostRecentFamilyCode,
  toYesNo,
  addDays,
  filtrerDoublonsMaxValMapIds,
  isChildUnder5,
  getAgeInYear,
  getAgeInMonths,
  getAgeInDays,
  isVaccinAgeLimit,
  isTrue,
  getHouseholdId,
  isPatient
};
