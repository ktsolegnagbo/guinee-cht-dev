/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-var */
const { getMostRecentReport, isReportValid } = require(`./utils`);
const { getDateInFormat } = require(`./utils-date`);


function getPcimneConstantsValue(reports) {
  const r = getMostRecentReport(reports, [`pcimne_register`]);
  if (r && isReportValid(r)) {
    const pb = r.fields.has_malnutrition === `true` ? `< 125 mm` : ``;
    const tp = r.fields.temperature ? `${r.fields.temperature} °C` : ``;
    return { apply: pb !== `` || tp !== ``, pb: pb, temperature: tp, reported_date: r.reported_date };
  }
  return { apply: false, pb: ``, temperature: ``, reported_date: `` };
}

function getLastPregnancyRegisterDate(reports){
  const r = getMostRecentReport(reports, [`delivery`, `pregnancy_family_planning`, `pregnancy_register`, `prenatal_followup`]);
  if (r && isReportValid(r)) {
    return getDateInFormat(r.reported_date);
  }
  return '';
}

module.exports = {
  getPcimneConstantsValue,
  getLastPregnancyRegisterDate
};
