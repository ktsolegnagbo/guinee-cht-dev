/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-var */
const { getPcimneConstantsValue, getLastPregnancyRegisterDate } = require(`./contact-summary-extras`);

const {
  isAlive,
  notNull,
  getMostRecentVaccinationData,
  getMostRecentReport,
  // getMostRecentPatientCode,
  // getMostRecentFamilyCode,
  isWomanPregnant,
  isUnderFamilyPlanning,
} = require(`./utils`);

const thisContact = contact;
const thisLineage = lineage;
const allReports = reports;
const isPersonAlive = isAlive(thisContact, allReports);
const vaccination = getMostRecentVaccinationData(thisContact, allReports);
// const lastPatientCode = getMostRecentPatientCode(thisContact, allReports);
// const lastFamilyCode = getMostRecentFamilyCode(thisContact, allReports);
const pcimneConstance = getPcimneConstantsValue(allReports);
const lastDeathReport = getMostRecentReport(allReports, [`death_report`]);
const isPregnant = isWomanPregnant(allReports);
const isActiveFpUser = isUnderFamilyPlanning(allReports);
const lastPregnancyRegisterDate = getLastPregnancyRegisterDate(allReports);



const death_date =
  lastDeathReport &&
  lastDeathReport.fields &&
  lastDeathReport.fields.date_of_death_fr;
const death_place =
  lastDeathReport &&
  lastDeathReport.fields &&
  lastDeathReport.fields.death_place_label;

function isFamilyPerson() {
  try {
    if (notNull(thisLineage)) {
      if (notNull(thisContact.parent)) {
        return (
          thisLineage[0].type === `clinic` &&
          thisLineage[0]._id === thisContact.parent._id
        );
      }
      return thisLineage[0].type === `clinic`;
    }
  } catch (error) {
    return false;
  }
  return false;
}

function isFamilyPlace() {
  try {
    return thisContact.type === `clinic`;
  } catch (error) {
    return false;
  }
}

var context = {
  alive: isPersonAlive,
  is_family_person: isFamilyPerson(),
  // is_family_place: isFamilyPlace(),
  muted: false,
  isPregnant: isPregnant,
  // last_patient_code: lastPatientCode,
  // last_family_code: lastFamilyCode,
  creation_number: 10,
  pregnancy_register_date: lastPregnancyRegisterDate,

  vaccine_BCG: vaccination.vaccine_BCG,
  vaccine_VPO_0: vaccination.vaccine_VPO_0,
  vaccine_PENTA_1: vaccination.vaccine_PENTA_1,
  vaccine_VPO_1: vaccination.vaccine_VPO_1,
  vaccine_PENTA_2: vaccination.vaccine_PENTA_2,
  vaccine_VPO_2: vaccination.vaccine_VPO_2,
  vaccine_PENTA_3: vaccination.vaccine_PENTA_3,
  vaccine_VPO_3: vaccination.vaccine_VPO_3,
  vaccine_VPI_1: vaccination.vaccine_VPI_1,
  vaccine_VAR_1: vaccination.vaccine_VAR_1,
  vaccine_VAA: vaccination.vaccine_VAA,
  vaccine_VPI_2: vaccination.vaccine_VPI_2,
  vaccine_MEN_A: vaccination.vaccine_MEN_A,
  vaccine_VAR_2: vaccination.vaccine_VAR_2,

  no_BCG_reason: vaccination.no_BCG_reason,
  no_VPO_0_reason: vaccination.no_VPO_0_reason,
  no_PENTA_1_reason: vaccination.no_PENTA_1_reason,
  no_VPO_1_reason: vaccination.no_VPO_1_reason,
  no_PENTA_2_reason: vaccination.no_PENTA_2_reason,
  no_VPO_2_reason: vaccination.no_VPO_2_reason,
  no_PENTA_3_reason: vaccination.no_PENTA_3_reason,
  no_VPO_3_reason: vaccination.no_VPO_3_reason,
  no_VPI_1_reason: vaccination.no_VPI_1_reason,
  no_VAR_1_reason: vaccination.no_VAR_1_reason,
  no_VAA_reason: vaccination.no_VAA_reason,
  no_VPI_2_reason: vaccination.no_VPI_2_reason,
  no_MEN_A_reason: vaccination.no_MEN_A_reason,
  no_VAR_2_reason: vaccination.no_VAR_2_reason,

  has_vaccine_not_done: vaccination.has_vaccine_not_done,
  has_vaccine_done: vaccination.has_vaccine_done,
  is_birth_vaccine_ok: vaccination.is_birth_vaccine_ok,
  is_six_weeks_vaccine_ok: vaccination.is_six_weeks_vaccine_ok,
  is_ten_weeks_vaccine_ok: vaccination.is_ten_weeks_vaccine_ok,
  is_forteen_weeks_vaccine_ok: vaccination.is_forteen_weeks_vaccine_ok,
  is_nine_months_vaccine_ok: vaccination.is_nine_months_vaccine_ok,
  is_fifty_months_vaccine_ok: vaccination.is_fifty_months_vaccine_ok,
  has_vaccine_up_to_date: vaccination.has_vaccine_up_to_date,
  has_all_vaccine_done: vaccination.has_all_vaccine_done,
};

// function phoneUtils() {
//   const p1 = notNull(thisContact.phone) ? thisContact.phone : ``;
//   const p2 = notNull(thisContact.phone_other) ? thisContact.phone_other : ``;
//   return {
//     canApply: p1 !== `` || p2 !== ``,
//     phoneNumber: p1 === p2 ? p1 : (p1 + (p1 !== `` && p2 !== `` ? ` | ` : ``) + p2),
//   };
// }

function contactInfos() {
  const pr = isPersonAlive && isPregnant;
  const fp = isPersonAlive && isActiveFpUser;
  return {
    icon: pr ? `pregnancy` : fp ? `people-family` : `people`,
    appliesToType: `person`,
    appliesIf: () => pr || fp,
    label: pr ? `contact.woman.pregnant` : fp ? `contact.woman.on_family_planning` : ``,
    value: ``,
    width: 12,
  };
}

var fields = [
  {
    appliesToType: `person`,
    appliesIf: () => isPersonAlive && notNull(thisContact.date_of_birth),
    label: `contact.age`,
    value: thisContact.date_of_birth,
    width: 4,
    filter: `age`,
  },
  {
    appliesToType: `person`,
    appliesIf: () => isPersonAlive && notNull(thisContact.sex),
    label: `contact.sex`,
    value: `contact.sex.${thisContact.sex}`,
    translate: true,
    width: 4,
  },
  {
    appliesToType: `person`,
    appliesIf: () =>
      isPersonAlive &&
      (notNull(thisContact.phone) ? thisContact.phone : ``) !== ``,
    label: `person.field.phone`,
    value: thisContact.phone,
    width: 4,
  },
  {
    appliesToType: `person`,
    appliesIf: () =>
      (notNull(thisContact.phone_other) ? thisContact.phone_other : ``) !== ``,
    label: `person.field.phone_other`,
    value: thisContact.phone_other,
    width: 4,
  },
  {
    appliesToType: `person`,
    appliesIf: () => isPersonAlive && notNull(thisContact.external_id) ,
    label: `contact.external_id`,
    value: thisContact.external_id,
    width: 4,
  },
  {
    appliesToType: `clinic`,
    appliesIf: () => isFamilyPlace() && notNull(thisContact.external_id) ,
    label: `contact.external_id`,
    value: thisContact.external_id,
    width: 6,
  },
  {
    appliesToType: `clinic`,
    appliesIf: () => isFamilyPlace() && notNull(thisContact.code) ,
    label: `contact.code.household`,
    value: thisContact.code,
    width: 6,
  },
  {
    appliesToType: `person`,
    appliesIf: () => isPersonAlive && notNull(thisContact.notes),
    label: `contact.notes`,
    value: thisContact.notes,
    width: 12,
  },
  {
    icon: `icon-death-general`,
    appliesToType: `person`,
    appliesIf: () => !isPersonAlive,
    label: `contact.person.death`,
    value: ``,
    width: 4,
  },
  {
    appliesToType: `person`,
    appliesIf: () => isPersonAlive && notNull(thisLineage),
    label: `contact.parent`,
    value: thisLineage,
    filter: `lineage`,
  },
  contactInfos(),
  {
    appliesToType: `!person`,
    appliesIf: () =>
      thisContact.type !== `clinic` &&
      isPersonAlive &&
      notNull(thisContact.external_id),
    label: `contact.external_id`,
    value: thisContact.external_id,
    width: 4,
  },
  {
    appliesToType: `!person`,
    appliesIf: () => isPersonAlive && notNull(thisContact.notes),
    label: `contact.notes`,
    value: thisContact.notes,
    width: 12,
  },
  {
    appliesToType: `!person`,
    appliesIf: () => notNull(thisContact.parent) && notNull(thisLineage),
    label: `contact.parent`,
    value: thisLineage,
    filter: `lineage`,
  },
];

if (thisContact.short_name) {
  fields.unshift({
    appliesToType: `person`,
    label: `contact.short_name`,
    value: thisContact.short_name,
    width: 4,
  });
}

var cards = [
  {
    label: `contact.patient.constants`,
    appliesToType: `person`,
    appliesIf: () => isPersonAlive && pcimneConstance.apply,
    fields: function () {
      const data = [];
      const p = pcimneConstance;
      if (notNull(p.pb)) {
        data.push({
          label: `contact.patient.pb`,
          value: p.pb,
          translate: true,
          width: 4,
          icon: (r) => (isHighRisk(r) ? `risk` : ``),
        });
      }

      if (notNull(p.temperature)) {
        data.push({
          label: `contact.patient.temperature`,
          value: p.temperature,
          translate: true,
          width: 4,
        });
      }
      if (pcimneConstance.apply) {
        data.push({
          label: `contact.patient.consulation.date`,
          value: p.reported_date,
          filter: `simpleDate`,
          width: 4,
        });
      }
      return data;
    },
    modifyContext: function (ctx, r) {},
  },
  {
    label: `contact.date_info`,
    appliesToType: `person`,
    appliesIf: () => !isPersonAlive,
    fields: function () {
      const data = [];
      thisContact.phone = undefined;
      thisContact.phone_other = undefined;

      if (notNull(death_date)) {
        data.push({
          label: `contact.date_of_death`,
          value: death_date,
          translate: true,
          width: 4,
        });
      }

      if (notNull(death_place)) {
        data.push({
          label: `contact.death_place`,
          value: death_place,
          translate: true,
          width: 4,
        });
      }
      return data;
    },
    modifyContext: function (ctx, r) {},
  },
];

module.exports = {
  context: context,
  cards: cards,
  fields: fields,
};
