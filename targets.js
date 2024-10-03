/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-env es6 */

const {
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
  hasMonthlyChildTreatedByPara
} = require(`./targets-extras`);

const { isAlive, notNull, getHouseholdId, isPatient, getField } = require(`./utils`);

const { isThisMonthAction } = require(`./utils-date`);

module.exports = [
  {
    id: `monthly-home-visits`,
    type: `count`,
    icon: `reschedule`,
    translation_key: `targets.pa-home-visits`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`pa_home_visit`],
    appliesIf: (c, r) => true,
    emitCustom: (emit, o, c, r) => {
      if (isThisMonthAction(r.reported_date) === true) {
        emit(Object.assign({}, o, (targetInstance = { _id: r._id, pass: true })));
      }
    },
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-educational-talks`,
    type: `count`,
    icon: `reschedule`,
    goal: -1,
    translation_key: `targets.educational-talks`,
    subtitle_translation_key: `targets.this-month`,
    appliesTo: `reports`,
    appliesToType: [`pa_educational_talk`],
    appliesIf: (c, r) => true,
    emitCustom: (emit, o, c, r) => {
      if (isThisMonthAction(r.reported_date) === true) {
        emit(Object.assign({}, o, (targetInstance = { _id: r._id, pass: true })));
      }
    },
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-individual-talk`,
    type: `count`,
    icon: `reschedule`,
    translation_key: `targets.individual-talk`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`pa_individual_talk`],
    appliesIf: (c, r) => true,
    emitCustom: (emit, o, c, r) => {
      if (isThisMonthAction(r.reported_date) === true) {
        emit(Object.assign({}, o, (targetInstance = { _id: r._id, pass: true })));
      }
    },
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-child-ref-vaccination`,
    type: `count`,
    icon: `immunization`,
    translation_key: `targets.child-vaccine-referred`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`vaccination_followup`],
    appliesIf: (c, r) => true,
    emitCustom: (emit, o, c, r) => {
      const ok1 = isThisMonthAction(r.reported_date) === true;
      const ok2 = getField(r, `is_vaccine_referal`) === `true`;
      if (ok1 && ok2) {
        emit(Object.assign({}, o, (targetInstance = { _id: r._id, pass: true })));
      }
    },
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-child-ref-malnutrition`,
    type: `count`,
    icon: `child-50x`,
    translation_key: `targets.child-malnutrition-referred`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`newborn_register`, `pcimne_register`],
    appliesIf: (c, r) => true,
    emitCustom: (emit, o, c, r) => {
      if(hasMonthlyChildRefMalnutrition(r)) {
        emit(Object.assign({}, o, (targetInstance = { _id: r._id, pass: true })));
      }
    },
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-women-referred-anc`,
    type: `count`,
    icon: `signalon`,
    translation_key: `targets.women-referred-anc`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`pregnancy_register`],
    appliesIf: (c, r) => true,
    emitCustom: (emit, o, c, r) => {
      const ok1 = isThisMonthAction(r.reported_date) === true;
      const ok2 = getField(r, `is_referred`) === `true`;
      if (ok1 && ok2) {
        emit(Object.assign({}, o, (targetInstance = { _id: r._id, pass: true })));
      }
    },
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-women-referred-delivery`,
    type: `count`,
    icon: `signalon`,
    translation_key: `targets.women-referred-delivery`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`pregnancy_register`],
    appliesIf: (c, r) => true,
    emitCustom: (emit, o, c, r) => {
      const ok1 = isThisMonthAction(r.reported_date) === true;
      const ok2 = getField(r, `is_referred`) === `true`;
      if (ok1 && ok2) {
        emit(Object.assign({}, o, (targetInstance = { _id: r._id, pass: true })));
      }
    },
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-malaria-treated-cta`,
    type: `count`,
    icon: `malaria`,
    translation_key: `targets.malaria-treated-cta`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`pcimne_register`, `adult_consulation`],
    appliesIf: (c, r) => true,
    emitCustom: (emit, o, c, r) => {
      if (hasMalariaTreatedByCTA(r)) {
        emit(Object.assign({}, o, (targetInstance = { _id: r._id, pass: true })));
      }
    },
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-malaria-referred`,
    type: `count`,
    icon: `malaria`,
    translation_key: `targets.malaria-referred`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`pcimne_register`, `adult_consulation`],
    appliesIf: (c, r) => true,
    emitCustom: (emit, o, c, r) => {
      if (hasMonthlyMalariaRef(r)) {
        emit(Object.assign({}, o, (targetInstance = { _id: r._id, pass: true })));
      }
    },
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-diarrhea-referred`,
    type: `count`,
    icon: `diarrhea`,
    translation_key: `targets.child-diarrhea-referred`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`newborn_register`, `pcimne_register`],
    appliesIf: (c, r) => true,
    emitCustom: (emit, o, c, r) => {
      if (hasMonthlyChildRefDiarrhea(r)) {
        emit(Object.assign({}, o, (targetInstance = { _id: r._id, pass: true })));
      }
    },
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-pneumonie-referred`,
    type: `count`,
    icon: `pneumonie`,
    translation_key: `targets.child-pneumonie-referred`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`newborn_register`, `pcimne_register`],
    appliesIf: (c, r) => true,
    emitCustom: (emit, o, c, r) => {
      if(hasMonthlyChildRefPneumonie(r)) {
        emit(Object.assign({}, o, (targetInstance = { _id: r._id, pass: true })));
      }
    },
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-child-ref-town-hall`,
    type: `count`,
    icon: `write-text`,
    translation_key: `targets.child-referred-town-hall`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `contacts`,
    appliesToType: [`person`],
    appliesIf: (c, r) => true,
    emitCustom: (emit, o, c, r) => {
      if (hasMonthlyChildRefTownHall(c)) {
        emit(Object.assign({}, o, (targetInstance = { _id: c.contact._id, pass: true })));
      }
    },
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-women-new-used-pf`,
    type: `count`,
    icon: `people-family`,
    translation_key: `targets.new-fp-women`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`family_planning`],
    appliesIf: (c, r) => true,
    emitCustom: (emit, o, c, r) => {
      if(hasMonthlyNewFpWomen(r)) {
        emit(Object.assign({}, o, (targetInstance = { _id: r._id, pass: true })));
      }
    },
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-child-treated-ors_zinc`,
    type: `count`,
    icon: `child-50x`,
    translation_key: `targets.child-case-treated-ors_zinc`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`pcimne_register`],
    appliesIf: (c, r) => true,
    emitCustom: (emit, o, c, r) => {
      if(hasMonthlyChildTreatedByOrsZinc(r)) {
        emit(Object.assign({}, o, (targetInstance = { _id: r._id, pass: true })));
      }
    },
    aggregate: true,
    date: `reported`,
  },

  {
    id: `monthly-child-case-treated-amoxi`,
    type: `count`,
    icon: `child-50x`,
    translation_key: `targets.child-case-treated-amoxi`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`pcimne_register`],
    appliesIf: (c, r) => true,
    emitCustom: (emit, o, c, r) => {
      if(hasMonthlyChildTreatedByAmoxi(r)) {
        emit(Object.assign({}, o, (targetInstance = { _id: r._id, pass: true })));
      }
    },
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-child-case-treated-para`,
    type: `count`,
    icon: `child-50x`,
    translation_key: `targets.child-case-treated-para`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`pcimne_register`],
    appliesIf: (c, r) => true,
    emitCustom: (emit, o, c, r) => {
      if(hasMonthlyChildTreatedByPara(r)) {
        emit(Object.assign({}, o, (targetInstance = { _id: r._id, pass: true })));
      }
    },
    aggregate: true,
    date: `reported`,
  },


  // #######################################################


  {
    id: `all-deaths`,
    type: `count`,
    icon: `icon-death-general`,
    translation_key: `targets.all_death`,
    goal: -1,
    appliesTo: `reports`,
    // appliesToType: [`person`],
    appliesIf: (c, r) => !isAlive(c.contact, c.reports),
    aggregate: true,
    date: `now`,
  },
  {
    id: `monthly-deaths`,
    type: `count`,
    icon: `icon-death-general`,
    translation_key: `targets.death_monthly`,
    goal: -1,
    appliesTo: `reports`,
    // appliesToType: [`person`],
    appliesIf: function (c, r) {
      const ok1 = isThisMonthAction(r.reported_date);
      const ok2 = isThisMonthAction(c.contact.reported_date);
      return !isAlive(c.contact, c.reports) && (ok1 || ok2);
    },
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-actions`,
    type: `count`,
    icon: `reschedule`,
    translation_key: `targets.monthly-actions`,
    subtitle_translation_key: `targets.this-month`,
    goal: 180,
    appliesTo: `reports`,
    appliesIf: (c, r) => hasMonthlyActions(r),
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-rdt-done`,
    type: `count`,
    icon: `signalon`,
    translation_key: `targets.monthly-rdt-done`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesIf: (c, r) => isMonthlyRdtDone(r),
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-positive-rdt-done`,
    type: `count`,
    icon: `signalon`,
    translation_key: `targets.monthly-positive-rdt-done`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesIf: (c, r) => isMonthlyPositiveRdtDone(r),
    aggregate: true,
    date: `reported`,
  },
  {
    id: `child-monthly-fever`,
    type: `count`,
    icon: `child`,
    translation_key: `targets.child-monthly-fever`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`pcimne_register`, `newborn_register`],
    appliesIf: (c, r) =>
      getChildPatologie(r, `has_fever`) && isThisMonthAction(r.reported_date),
    aggregate: true,
    date: `reported`,
  },
  {
    id: `monthly-contacts-with-fever-percentage`,
    type: `percent`,
    icon: `person`,
    goal: -1,
    translation_key: `targets.monthly-contacts-with-fever-percentage`,
    subtitle_translation_key: `targets.this-month`,
    percentage_count_translation_key: `targets.contacts-with-fever-percentage`,
    appliesTo: `reports`,
    appliesToType: [`pcimne_register`, `newborn_register`, `adult_consulation`],
    appliesIf: (c, r) => isPatient(c),
    passesIf: (c, r) =>
      getChildPatologie(r, `has_fever`) && isThisMonthAction(r.reported_date),
    idType: `contact`,
    date: `reported`,
  },
  {
    id: `child-monthly-malaria`,
    type: `count`,
    icon: `malaria`,
    translation_key: `targets.child-monthly-malaria`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`pcimne_register`, `newborn_register`],
    appliesIf: (c, r) =>
      getChildPatologie(r, `has_malaria`) && isThisMonthAction(r.reported_date),
    aggregate: true,
    date: `reported`,
  },
  {
    id: `child-monthly-cough-cold`,
    type: `count`,
    icon: `cough`,
    translation_key: `targets.child-monthly-cough-cold`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`pcimne_register`, `newborn_register`],
    appliesIf: (c, r) =>
      getChildPatologie(r, `has_cough_cold`) &&
      isThisMonthAction(r.reported_date),
    aggregate: true,
    date: `reported`,
  },
  {
    id: `child-monthly-pneumonia`,
    type: `count`,
    icon: `cough`,
    translation_key: `targets.child-monthly-pneumonia`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`pcimne_register`, `newborn_register`],
    appliesIf: (c, r) =>
      getChildPatologie(r, `has_pneumonia`) &&
      isThisMonthAction(r.reported_date),
    aggregate: true,
    date: `reported`,
  },
  {
    id: `child-monthly-diarrhea`,
    type: `count`,
    icon: `diarrhea`,
    translation_key: `targets.child-monthly-diarrhea`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`pcimne_register`, `newborn_register`],
    appliesIf: (c, r) =>
      getChildPatologie(r, `has_diarrhea`) &&
      isThisMonthAction(r.reported_date),
    aggregate: true,
    date: `reported`,
  },
  {
    id: `child-monthly-malnutrition`,
    type: `count`,
    icon: `child-evolution`,
    translation_key: `targets.child-monthly-malnutrition`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesToType: [`pcimne_register`, `newborn_register`],
    appliesIf: (c, r) =>
      getChildPatologie(r, `has_malnutrition`) &&
      isThisMonthAction(r.reported_date),
    aggregate: true,
    date: `reported`,
  },
  {
    id: `total-household`,
    icon: `household`,
    type: `count`,
    goal: -1,
    translation_key: `targets.total-household`,
    appliesTo: `contacts`,
    appliesToType: [`clinic`, `person`],
    appliesIf: (c, r) =>
      isPatient(c) || (c.contact && c.contact.type === `clinic`),
    groupBy: (c, r) => getHouseholdId(c),
    passesIfGroupCount: { gte: 1 },
    aggregate: true,
    date: `now`,
  },
  {
    id: `households-monthly-with-gt2-visits`,
    type: `percent`,
    icon: `family`,
    goal: 80,
    translation_key: `targets.households-monthly-visited`,
    subtitle_translation_key: `targets.this-month`,
    appliesTo: `contacts`,
    appliesToType: [`person`, `clinic`],
    emitCustom: (emit, original, c) => {
      const householdId = getHouseholdId(c);
      const f = household_actions_forms;
      if (
        isPatient(c) &&
        c.reports.some(
          (r) => f.includes(r.form) && notNull(r.fields.visited_contact_uuid)
        )
      ) {
        emit(
          Object.assign(
            {},
            original,
            (targetInstance = { _id: householdId, pass: true })
          )
        );
      }
      if (c.contact && c.contact.type === `clinic`) {
        emit(Object.assign({}, original, { _id: householdId, pass: false }));
      }
    },
    groupBy: (c, r) => getHouseholdId(c),
    passesIfGroupCount: { gte: 1 },
    aggregate: true,
    date: `now`,
  },
  {
    id: `total-patient`,
    icon: `icon-person`,
    type: `count`,
    goal: -1,
    translation_key: `targets.total-patient`,
    appliesTo: `contacts`,
    appliesToType: [`person`],
    appliesIf: (c, r) => isPatient(c),
    groupBy: (c, r) => c.contact._id,
    passesIfGroupCount: { gte: 1 },
    aggregate: true,
    date: `now`,
  },
  {
    id: `monthly-pregnant-registered`,
    type: `count`,
    icon: `pregnancy`,
    translation_key: `targets.monthly-pregnant-registered`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesIf: (c, r) => isWomanPregnantMonthly(r),
    aggregate: true,
    date: `reported`,
  },
  {
    id: `active-pregnants`,
    type: `count`,
    icon: `pregnant`,
    translation_key: `targets.active-pregnants`,
    goal: -1,
    appliesTo: `reports`,
    appliesIf: (c, r) => {
      return isAlive(c.contact, c.reports) && isActivePregnant(r, c.reports);
    },
    aggregate: true,
    date: `now`,
  },
  {
    id: `monthly-family-planning`,
    type: `count`,
    icon: `people-family`,
    translation_key: `targets.monthly-family-planning`,
    subtitle_translation_key: `targets.this-month`,
    goal: -1,
    appliesTo: `reports`,
    appliesIf: (c, r) => isMonthlyFamilyPlanning(r),
    aggregate: true,
    date: `reported`,
  },
  {
    id: `active-family-planning`,
    type: `count`,
    icon: `people-family`,
    translation_key: `targets.active-family-planning`,
    goal: -1,
    appliesTo: `reports`,
    appliesIf: (c, r) => {
      return isAlive(c.contact, c.reports) && isActiveFamilyPlanning(r, c.reports);
    },
    aggregate: true,
    date: `now`,
  }
];
