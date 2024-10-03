/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-env es6 */

const {
  getMostRecentReport,
  isTrue,
  isWomanPregnant,
  getField,
  notNull,
  getAgeInMonths,
} = require(`./utils`);
const { isThisMonthAction, getDateInFormat } = require(`./utils-date`);

const home_actions_forms = [
  `adult_consulation`,
  `adult_followup`,
  `delivery`,
  `event_register`,
  `fp_danger_sign_check`,
  `fp_renewal`,
  `fs_meg_situation`,
  `newborn_followup`,
  `newborn_register`,
  `pcimne_followup`,
  `pcimne_register`,
  `pregnancy_family_planning`,
  `pregnancy_register`,
  `family_planning`,
  `prenatal_followup`,
  `promotional_activity`,
  `referral_followup`,
  `vaccination_referal_followup`,
  // `create_new_family`,
  // `create_new_patient`,
  // `death_report`,
  // `stock_entry`,
  // `stock_movement`,
  // `undo_death_report`,
  // `vaccination_followup`,
];

const household_actions_forms = [
  `adult_consulation`,
  `adult_followup`,
  `delivery`,
  `event_register`,
  `fp_danger_sign_check`,
  `fp_renewal`,
  `fs_meg_situation`,
  `newborn_followup`,
  `newborn_register`,
  `pcimne_followup`,
  `pcimne_register`,
  `pregnancy_family_planning`,
  `pregnancy_register`,
  `family_planning`,
  `prenatal_followup`,
  `promotional_activity`,
  `referral_followup`,
  `vaccination_referal_followup`,
  `death_report`,
  `vaccination_followup`,
];

function hasMonthlyActions(report) {
  if (home_actions_forms.includes(report.form)) {
    return isThisMonthAction(report.reported_date);
  }
  return false;
}

function isWomanPregnantMonthly(report) {
  if (
    [`pregnancy_family_planning`, `pregnancy_register`].includes(report.form)
  ) {
    if (isThisMonthAction(report.reported_date) === true) {
      return getField(report, `is_pregnant`) === `true`;
    }
  }
  return false;
}

function isActivePregnant(report, reports) {
  const womenForms = [
    `delivery`,
    `pregnancy_family_planning`,
    `pregnancy_register`,
    `prenatal_followup`,
  ];
  const r = getMostRecentReport(reports, womenForms);
  if (womenForms.includes(report.form) && r && r.form !== `delivery`) {
    if (
      r.form === `prenatal_followup` &&
      getField(r, `is_pregnant`) !== `true`
    ) {
      return false;
    }
    return getField(report, `is_pregnant`) === `true`;
  }
  return false;
}

function isMonthlyFamilyPlanning(report) {
  if (
    [`pregnancy_family_planning`, `family_planning`, `fp_renewal`].includes(
      report.form
    )
  ) {
    if (isThisMonthAction(report.reported_date) === true) {
      const ok1 = getField(report, `is_pregnant`) !== `true`;
      const ok2 = getField(report, `method_was_given`) === `true`;
      return ok1 && ok2;
    }
  }
  return false;
}

function isActiveFamilyPlanning(report, reports) {
  if (!isWomanPregnant(reports)) {
    if (
      [`pregnancy_family_planning`, `family_planning`, `fp_renewal`].includes(
        report.form
      )
    ) {
      const nDate = getField(report, `next_fp_renew_date`);
      if (notNull(nDate)) {
        const ok1 = getField(report, `is_pregnant`) !== `true`;
        const ok2 = getField(report, `method_was_given`) === `true`;
        const ok3 = new Date(nDate) > new Date();
        return ok1 && ok2 && ok3;
      }
    }
  }
  return false;
}

function isMonthlyRdtDone(report) {
  if ([`adult_consulation`, `pcimne_register`].includes(report.form)) {
    if (isThisMonthAction(report.reported_date) === true) {
      return isTrue(getField(report, `rdt_given`));
    }
  }
  return false;
}

function isMonthlyPositiveRdtDone(report) {
  return (
    isMonthlyRdtDone(report) && getField(report, `rdt_result`) === `positive`
  );
}

function getChildPatologie(r, patologie) {
  // paludisme
  if (patologie === `has_malaria`) {
    return getField(r, `has_malaria`) === `true`;
  }
  // fievre
  if (patologie === `has_fever`) {
    return getField(r, `has_fever`) === `true`;
  }
  // toux & rhume
  if (patologie === `has_cough_cold`) {
    return getField(r, `has_cough_cold`) === `true`;
  }
  // pneumonia
  if (patologie === `has_pneumonia`) {
    return getField(r, `has_pneumonia`) === `true`;
  }
  // diarrhee
  if (patologie === `has_diarrhea`) {
    return getField(r, `has_diarrhea`) === `true`;
  }
  // malnutrition
  if (patologie === `has_malnutrition`) {
    return getField(r, `has_malnutrition`) === `true`;
  }
  return false;
}

// #############################################################


function hasMonthlyChildRefMalnutrition(report) {
  if ([`newborn_register`].includes(report.form)) {
    return (
      isThisMonthAction(report.reported_date) === true &&
      getField(report, `is_referred`) === `true` &&
      getField(report, `has_malnutrition`) === `true`
    );
  }
  if ([`pcimne_register`].includes(report.form)) {
    return (
      isThisMonthAction(report.reported_date) === true &&
      getField(report, `is_referred`) === `true` &&
      getField(report, `is_malnutrition_referal`) === `true` &&
      getField(report, `has_malnutrition`) === `true`
    );
  }
  return false;
}

function hasMonthlyChildRefDiarrhea(report) {
  if ([`newborn_register`].includes(report.form)) {
    return (
      isThisMonthAction(report.reported_date) === true &&
      getField(report, `is_referred`) === `true` &&
      getField(report, `has_diarrhea`) === `true`
    );
  }
  if ([`pcimne_register`].includes(report.form)) {
    return (
      isThisMonthAction(report.reported_date) === true &&
      getField(report, `is_referred`) === `true` &&
      getField(report, `is_diarrhea_referal`) === `true` &&
      getField(report, `has_diarrhea`) === `true`
    );
  }
  return false;
}

function hasMonthlyChildRefPneumonie(report) {
  if ([`newborn_register`].includes(report.form)) {
    return (
      isThisMonthAction(report.reported_date) === true &&
      getField(report, `is_referred`) === `true` &&
      getField(report, `has_pneumonia`) === `true`
    );
  }
  if ([`pcimne_register`].includes(report.form)) {
    return (
      isThisMonthAction(report.reported_date) === true &&
      getField(report, `is_referred`) === `true` &&
      getField(report, `has_pneumonia`) === `true`
    );
  }
  return false;
}

function hasMalariaTreatedByCTA(report) {
  if ([`pcimne_register`, `adult_consulation`].includes(report.form)) {
    const cta_quantity = getField(report, `cta_quantity`);
    return (
      isThisMonthAction(report.reported_date) === true &&
      notNull(cta_quantity) &&
      parseInt(`${cta_quantity}`) > 0
    );
  }
  return false;
}

function hasMonthlyMalariaRef(report) {
  if ([`pcimne_register`, `adult_consulation`].includes(report.form)) {
    return (
      isThisMonthAction(report.reported_date) === true &&
      getField(report, `is_referred`) === `true` &&
      getField(report, `has_malaria`) === `true`
    );
  }
  return false;
}

function hasMonthlyChildRefTownHall(c) {
  if (
    c.contact &&
    c.contact.type === `person` &&
    c.contact.role === `patient` &&
    c.contact.register_patient
  ) {
    if (notNull(c.contact.date_of_birth)) {
      return (
        isThisMonthAction(c.contact.reported_date) === true &&
        getAgeInMonths(c) < 60 &&
        c.contact.register_patient.has_birth_certificate === `no` &&
        c.contact.register_patient.birth_certificate_referal === `yes`
      );
    }
    return false;
  }
}

function hasMonthlyNewFpWomen(report) {
  if ([`family_planning`].includes(report.form)) {
    return (
      isThisMonthAction(report.reported_date) === true &&
      getField(report, `has_counseling`) === `true` &&
      getField(report, `already_use_method`) === `false`
    );
  }
  return false;
}

function hasMonthlyChildTreatedByOrsZinc(report) {
  if ([`pcimne_register`].includes(report.form)) {
    const ors_quantity = getField(report, `ors_quantity`);
    const zinc_quantity = getField(report, `zinc_quantity`);
    return (
      isThisMonthAction(report.reported_date) === true &&
      ((notNull(ors_quantity) && parseInt(`${ors_quantity}`) > 0) ||
        (notNull(zinc_quantity) && parseInt(`${zinc_quantity}`) > 0))
    );
  }
  return false;
}

function hasMonthlyChildTreatedByAmoxi(report) {
  if ([`pcimne_register`].includes(report.form)) {
    const amox250mg_qty = getField(report, `amoxicillin_250mg_quantity`);
    const amox500mg_qty = getField(report, `amoxicillin_500mg_quantity`);
    return (
      isThisMonthAction(report.reported_date) === true &&
      ((notNull(amox250mg_qty) && parseInt(`${amox250mg_qty}`) > 0) ||
        (notNull(amox500mg_qty) && parseInt(`${amox500mg_qty}`) > 0))
    );
  }
  return false;
}

function hasMonthlyChildTreatedByPara(report) {
  if ([`pcimne_register`].includes(report.form)) {
    const para100mg_qty = getField(report, `paracetamol_100mg_quantity`);
    const para250mg_qty = getField(report, `paracetamol_250mg_quantity`);
    const para500mg_qty = getField(report, `paracetamol_500mg_quantity`);
    return (
      isThisMonthAction(report.reported_date) === true &&
      ((notNull(para100mg_qty) && parseInt(`${para100mg_qty}`) > 0) ||
        (notNull(para250mg_qty) && parseInt(`${para250mg_qty}`) > 0) ||
        (notNull(para500mg_qty) && parseInt(`${para500mg_qty}`) > 0))
    );
  }
  return false;
}

module.exports = {
  household_actions_forms,
  hasMonthlyActions,
  getChildPatologie,
  isWomanPregnantMonthly,
  isActivePregnant,
  isMonthlyRdtDone,
  isMonthlyPositiveRdtDone,
  isMonthlyFamilyPlanning,
  isActiveFamilyPlanning,
  hasMonthlyChildRefMalnutrition,
  hasMonthlyChildRefDiarrhea,
  hasMonthlyChildRefPneumonie,
  hasMalariaTreatedByCTA,
  hasMonthlyMalariaRef,
  hasMonthlyChildRefTownHall,
  hasMonthlyNewFpWomen,
  hasMonthlyChildTreatedByOrsZinc,
  hasMonthlyChildTreatedByAmoxi,
  hasMonthlyChildTreatedByPara,
};
