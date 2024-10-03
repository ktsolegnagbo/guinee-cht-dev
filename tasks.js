/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-env es6 */

const {
  getPrenatalConfig,
  getFpDangerSignConfig,
  getFpRenewalConfig,
  getPcimneFollowupConfig,
  getReferralFollowupConfig,
  getTownHallReferralFollowupConfig,
  getAdultFollowupConfig,
  getNewbornFollowupConfig,
  getVaccinationFollowupConfig,
} = require(`./tasks-extras`);

const {
  isAlive,
  isReco,
  isWomanPregnant,
  canApplies,
  getPriority,
  isVaccinAgeLimit,
  isFormArraySubmittedInWindow,
  R_Date,
  getAgeInMonths
} = require(`./utils`);

module.exports = [
  {
    name: `prenatal-followup`,
    icon: `newborn`,
    title: `prenatal.followup`,
    appliesTo: `reports`,
    contactLabel: (c, r) => c.contact.name,
    appliesIf: function (c, r) {
      return (
        c.contact.type === `person` &&
        isReco(user) &&
        isWomanPregnant(c.reports) &&
        canApplies(c, r, [
          `prenatal_followup`,
          `pregnancy_family_planning`,
          `pregnancy_register`,
        ]) &&
        getPrenatalConfig(c, r).displayIf
      );
    },
    actions: [
      {
        type: `report`,
        form: `prenatal_followup`,
        label: `prenatal.followup`,
        modifyContent: function (content, c, r, event) {
          const cst = getPrenatalConfig(c, r).content;
          content.source = cst.source;
          content.source_id = cst.source_id;
          // content.event_id = cst.event_id;
          content.contact = cst.contact;
          content.t_cpn_next_number = cst.t_cpn_next_number;
          content.t_date_cpn1 = cst.t_date_cpn1;
          content.t_date_cpn2 = cst.t_date_cpn2;
          content.t_date_cpn3 = cst.t_date_cpn3;
          content.t_date_cpn4 = cst.t_date_cpn4;
          content.t_td1 = cst.t_td1;
          content.t_td2 = cst.t_td2;
          content.t_milda = cst.t_milda;
          content.t_next_cpn_date = cst.t_next_cpn_date;
          content.t_cpn_done = cst.t_cpn_done;
          content.t_was_cpn_referred = cst.t_was_cpn_referred;
          content.t_family_id = cst.t_family_id;
          content.t_family_name = cst.t_family_name;
          content.t_family_external_id = cst.t_family_external_id;
        },
      },
    ],
    events: [
      {
        id: `prenatal-followup`,
        // days: 7,
        start: 3,
        end: 10,
        dueDate: function (event, c, r) {
          return getPrenatalConfig(c, r).nextVisitDate;
        },
      },
    ],
    priority: (c, r) => getPriority(getPrenatalConfig(c, r)),
    resolvedIf: function (c, r, event, dueDate) {
      const elm = getPrenatalConfig(c, r);
      return (
        elm.close_out ||
        !isWomanPregnant(c.reports) ||
        isFormArraySubmittedInWindow(
          c.reports,
          [`prenatal_followup`],
          R_Date(dueDate, event),
          R_Date(dueDate, event, true)
        )
      );
    },
  },
  {
    name: `fp-danger-sign-check`,
    icon: `people-family`,
    title: `fp.danger.sign.check`,
    appliesTo: `reports`,
    contactLabel: (c, r) => c.contact.name,
    appliesIf: function (c, r) {
      return (
        c.contact.type === `person` &&
        isReco(user) &&
        !isWomanPregnant(c.reports) &&
        canApplies(c, r, [`pregnancy_family_planning`, `family_planning`]) &&
        getFpDangerSignConfig(c, r).displayIf
      );
    },
    actions: [
      {
        type: `report`,
        form: `fp_danger_sign_check`,
        label: `fp.danger.sign.check`,
        modifyContent: function (content, c, r, event) {
          const cst = getFpDangerSignConfig(c, r).content;
          content.source = cst.source;
          content.source_id = cst.source_id;
          // content.event_id = cst.event_id;
          content.contact = cst.contact;

          content.t_fp_method = cst.t_fp_method;
          content.t_fp_method_name = cst.t_fp_method_name;
          content.t_next_fp_renew_date = cst.t_next_fp_renew_date;
          content.t_method_start_date = cst.t_method_start_date;

          content.t_family_id = cst.t_family_id;
          content.t_family_name = cst.t_family_name;
          content.t_family_external_id = cst.t_family_external_id;
        },
      },
    ],
    events: [
      {
        id: `fp.danger-sign.check`,
        // days: 7,
        start: 1,
        end: 10,
        dueDate: function (event, c, r) {
          return getFpDangerSignConfig(c, r).nextVisitDate;
        },
      },
    ],
    priority: (c, r) => getPriority(getFpDangerSignConfig(c, r)),
    resolvedIf: function (c, r, event, dueDate) {
      return (
        isWomanPregnant(c.reports) ||
        isFormArraySubmittedInWindow(
          c.reports,
          [`fp_danger_sign_check`],
          R_Date(dueDate, event),
          R_Date(dueDate, event, true)
        )
      );
    },
  },
  {
    name: `fp-renewal`,
    icon: `people-family`,
    title: `fp.renewal`,
    appliesTo: `reports`,
    contactLabel: (c, r) => c.contact.name,
    appliesIf: function (c, r) {
      return (
        c.contact.type === `person` &&
        isReco(user) &&
        !isWomanPregnant(c.reports) &&
        canApplies(c, r, [`fp_renewal`, `family_planning`]) &&
        getFpRenewalConfig(c, r).displayIf
      );
    },
    actions: [
      {
        type: `report`,
        form: `fp_renewal`,
        label: `fp.renewal`,
        modifyContent: function (content, c, r, event) {
          const cst = getFpRenewalConfig(c, r).content;
          content.source = cst.source;
          content.source_id = cst.source_id;
          // content.event_id = cst.event_id;
          content.contact = cst.contact;

          content.t_fp_method = cst.t_fp_method;
          content.t_fp_method_name = cst.t_fp_method_name;
          content.t_next_fp_renew_date = cst.t_next_fp_renew_date;
          content.t_method_start_date = cst.t_method_start_date;

          content.t_family_id = cst.t_family_id;
          content.t_family_name = cst.t_family_name;
          content.t_family_external_id = cst.t_family_external_id;
        },
      },
    ],
    events: [
      {
        id: `fp.renewal`,
        // days: 7,
        start: 1,
        end: 10,
        dueDate: function (event, c, r) {
          return getFpRenewalConfig(c, r).nextVisitDate;
        },
      },
    ],
    priority: (c, r) => getPriority(getFpRenewalConfig(c, r)),
    resolvedIf: function (c, r, event, dueDate) {
      return (
        isWomanPregnant(c.reports) ||
        isFormArraySubmittedInWindow(
          c.reports,
          [`fp_renewal`],
          R_Date(dueDate, event),
          R_Date(dueDate, event, true)
        )
      );
    },
  },
  {
    name: `pcimne-followup`,
    icon: `child-50x`,
    title: `pcimne.followup`,
    appliesTo: `reports`,
    contactLabel: (c, r) => c.contact.name,
    appliesIf: function (c, r) {
      return (
        c.contact.type === `person` &&
        isReco(user) &&
        canApplies(c, r, [`pcimne_register`]) &&
        getPcimneFollowupConfig(c, r).displayIf
      );
    },
    actions: [
      {
        type: `report`,
        form: `pcimne_followup`,
        label: `pcimne.followup`,
        modifyContent: function (content, c, r, event) {
          const cst = getPcimneFollowupConfig(c, r).content;
          content.source = cst.source;
          content.source_id = cst.source_id;
          // content.event_id = cst.event_id;
          content.contact = cst.contact;

          content.t_family_id = cst.t_family_id;
          content.t_family_name = cst.t_family_name;
          content.t_family_external_id = cst.t_family_external_id;

          content.t_temperature = cst.t_temperature;
          content.t_has_fever = cst.t_has_fever;
          content.t_has_malaria = cst.t_has_malaria;
          content.t_has_diarrhea = cst.t_has_diarrhea;
          content.t_has_cough_cold = cst.t_has_cough_cold;
          content.t_has_malnutrition = cst.t_has_malnutrition;
          content.t_has_pneumonia = cst.t_has_pneumonia;
          content.t_unable_drink_breastfeed = cst.t_unable_drink_breastfeed;
          content.t_vomits_everything = cst.t_vomits_everything;
          content.t_convulsions = cst.t_convulsions;
          content.t_sleepy_unconscious = cst.t_sleepy_unconscious;
          content.t_has_stiff_neck = cst.t_has_stiff_neck;
          content.t_has_bulging_fontanelle = cst.t_has_bulging_fontanelle;
          content.t_breathing_difficulty = cst.t_breathing_difficulty;
          content.t_cough_more_than_14days = cst.t_cough_more_than_14days;
          content.t_subcostal_indrawing = cst.t_subcostal_indrawing;
          content.t_wheezing = cst.t_wheezing;
          content.t_bloody_diarrhea = cst.t_bloody_diarrhea;
          content.t_diarrhea_more_than_14_days =
            cst.t_diarrhea_more_than_14_days;
          content.t_blood_in_stool = cst.t_blood_in_stool;
          content.t_restless = cst.t_restless;
          content.t_drinks_hungrily = cst.t_drinks_hungrily;
          content.t_sunken_eyes = cst.t_sunken_eyes;
          content.t_has_edema = cst.t_has_edema;
          content.t_has_other_disease_problem = cst.t_has_other_disease_problem;
          content.t_has_afp = cst.t_has_afp;
          content.t_other_diseases = cst.t_other_diseases;
          content.t_is_referred = cst.t_is_referred;
        },
      },
    ],
    events: [
      {
        id: `pcimne-followup`,
        // days: 7,
        start: 0,
        end: 2,
        dueDate: function (event, c, r) {
          return getPcimneFollowupConfig(c, r).nextVisitDate;
        },
      },
    ],
    priority: (c, r) => getPriority(getPcimneFollowupConfig(c, r)),
    resolvedIf: function (c, r, event, dueDate) {
      const elm = getPcimneFollowupConfig(c, r);
      return (
        elm.close_out ||
        isFormArraySubmittedInWindow(
          c.reports,
          [`pcimne_followup`],
          R_Date(dueDate, event),
          R_Date(dueDate, event, true)
        )
      );
    },
  },
  {
    name: `referral-followup`,
    icon: `child-evolution`,
    title: `referral.followup`,
    appliesTo: `reports`,
    contactLabel: (c, r) => c.contact.name,
    appliesIf: function (c, r) {
      return (
        c.contact.type === `person` &&
        isReco(user) &&
        canApplies(c, r, [
          `pcimne_followup`,
          `newborn_followup`,
          `adult_followup`,
        ]) &&
        getReferralFollowupConfig(c, r).displayIf
      );
    },
    actions: [
      {
        type: `report`,
        form: `referral_followup`,
        label: `referral.followup`,
        modifyContent: function (content, c, r, event) {
          const cst = getReferralFollowupConfig(c, r).content;
          content.source = cst.source;
          content.source_id = cst.source_id;
          // content.event_id = cst.event_id;
          content.contact = cst.contact;

          content.t_family_id = cst.t_family_id;
          content.t_family_name = cst.t_family_name;
          content.t_family_external_id = cst.t_family_external_id;

          content.t_other_diseases = cst.t_other_diseases;
          content.t_is_referred = cst.t_is_referred;
        },
      },
    ],
    events: [
      {
        id: `referral-followup`,
        // days: 7,
        start: 0,
        end: 2,
        dueDate: function (event, c, r) {
          return getReferralFollowupConfig(c, r).nextVisitDate;
        },
      },
    ],
    priority: (c, r) => getPriority(getReferralFollowupConfig(c, r)),
    resolvedIf: function (c, r, event, dueDate) {
      const elm = getReferralFollowupConfig(c, r);
      return (
        elm.close_out ||
        isFormArraySubmittedInWindow(
          c.reports,
          [`referral_followup`],
          R_Date(dueDate, event),
          R_Date(dueDate, event, true)
        )
      );
    },
  },

  {
    name: `referral-town_hall-followup`,
    icon: `write-text`,
    title: `referral.town_hall.followup`,
    appliesTo: `contacts`,
    appliesToType: [`person`],
    appliesIf: function (c, r) {
      return (
        c.contact &&
        c.contact.role === `patient` &&
        c.contact.register_patient &&
        (getAgeInMonths(c)||0) < 60 &&
        isReco(user) &&
        isAlive(c.contact, c.reports) &&
        getTownHallReferralFollowupConfig(c).displayIf
      );
    },
    contactLabel: (c) => c.contact.name,
    actions: [
      {
        type: `report`,
        form: `referral_town_hall_followup`,
        label: `referral.town_hall.followup`,
        modifyContent: function (content, c, r, event) {
          const cst = getTownHallReferralFollowupConfig(c).content;
          content.source = cst.source;
          content.source_id = cst.source_id;
          // content.event_id = cst.event_id;
          content.contact = cst.contact;

          content.t_family_id = cst.t_family_id;
          content.t_family_name = cst.t_family_name;
          content.t_family_external_id = cst.t_family_external_id;

          content.t_other_diseases = cst.t_other_diseases;
          content.t_is_referred = cst.t_is_referred;
        },
      },
    ],
    events: [
      {
        id: `referral-town_hall-followup`,
        // days: 7,
        start: 0,
        end: 2,
        dueDate: function (event, c) {
          return getTownHallReferralFollowupConfig(c).nextVisitDate;
        },
      },
    ],
    priority: (c, r) => getPriority(getTownHallReferralFollowupConfig(c)),
    resolvedIf: function (c, r, event, dueDate) {
      const elm = getTownHallReferralFollowupConfig(c);
      return (
        elm.close_out ||
        isFormArraySubmittedInWindow(
          c.reports,
          [`referral_town_hall_followup`],
          R_Date(dueDate, event),
          R_Date(dueDate, event, true)
        )
      );
    },
  },

  {
    name: `newborn-followup`,
    icon: `infant`,
    title: `newborn.followup`,
    appliesTo: `reports`,
    contactLabel: (c, r) => c.contact.name,
    appliesIf: function (c, r) {
      return (
        c.contact.type === `person` &&
        isReco(user) &&
        canApplies(c, r, [`newborn_register`]) &&
        getNewbornFollowupConfig(c, r).displayIf
      );
    },
    actions: [
      {
        type: `report`,
        form: `newborn_followup`,
        label: `newborn.followup`,
        modifyContent: function (content, c, r, event) {
          const cst = getNewbornFollowupConfig(c, r).content;
          content.source = cst.source;
          content.source_id = cst.source_id;
          // content.event_id = cst.event_id;
          content.contact = cst.contact;

          content.t_family_id = cst.t_family_id;
          content.t_family_name = cst.t_family_name;
          content.t_family_external_id = cst.t_family_external_id;
          content.t_unable_to_suckle = cst.t_unable_to_suckle;
          content.t_vomits_everything_consumes =
            cst.t_vomits_everything_consumes;
          content.t_convulsion = cst.t_convulsion;
          content.t_sleepy_unconscious = cst.t_sleepy_unconscious;
          content.t_stiff_neck = cst.t_stiff_neck;
          content.t_domed_fontanelle = cst.t_domed_fontanelle;
          content.t_breathe_hard = cst.t_breathe_hard;
          content.t_subcostal_indrawing = cst.t_subcostal_indrawing;
          content.t_wheezing = cst.t_wheezing;
          content.t_diarrhea = cst.t_diarrhea;
          content.t_malnutrition = cst.t_malnutrition;
          content.t_malaria = cst.t_malaria;
          content.t_pneumonia = cst.t_pneumonia;
          content.t_cough_cold = cst.t_cough_cold;
          content.t_reference_pattern_other = cst.t_reference_pattern_other;
          content.t_is_referred = cst.t_is_referred;
        },
      },
    ],
    events: [
      {
        id: `newborn-followup`,
        // days: 7,
        start: 1,
        end: 2,
        dueDate: function (event, c, r) {
          return getNewbornFollowupConfig(c, r).nextVisitDate;
        },
      },
    ],
    priority: (c, r) => getPriority(getNewbornFollowupConfig(c, r)),
    resolvedIf: function (c, r, event, dueDate) {
      const elm = getNewbornFollowupConfig(c, r);
      return (
        elm.close_out ||
        isFormArraySubmittedInWindow(
          c.reports,
          [`newborn_followup`],
          R_Date(dueDate, event),
          R_Date(dueDate, event, true)
        )
      );
    },
  },
  {
    name: `adult-followup`,
    icon: `follow-up`,
    title: `adult.followup`,
    appliesTo: `reports`,
    contactLabel: (c, r) => c.contact.name,
    appliesIf: function (c, r) {
      return (
        c.contact.type === `person` &&
        isReco(user) &&
        !isWomanPregnant(c.reports) &&
        canApplies(c, r, [
          `adult_consulation`,
          `fp_danger_sign_check`,
          `fp_renewal`,
          `pregnancy_family_planning`,
          `family_planning`,
          `prenatal_followup`,
        ]) &&
        getAdultFollowupConfig(c, r).displayIf
      );
    },
    actions: [
      {
        type: `report`,
        form: `adult_followup`,
        label: `adult.followup`,
        modifyContent: function (content, c, r, event) {
          const cst = getAdultFollowupConfig(c, r).content;
          content.source = cst.source;
          content.source_id = cst.source_id;
          // content.event_id = cst.event_id;
          content.contact = cst.contact;

          content.t_malaria = cst.t_malaria;
          content.t_fever = cst.t_fever;
          content.t_diarrhea = cst.t_diarrhea;
          content.t_yellow_fever = cst.t_yellow_fever;
          content.t_tetanus = cst.t_tetanus;
          content.t_cough_or_cold = cst.t_cough_or_cold;
          content.t_viral_diseases = cst.t_viral_diseases;
          content.t_acute_flaccid_paralysis = cst.t_acute_flaccid_paralysis;
          content.t_meningitis = cst.t_meningitis;
          content.t_miscarriage = cst.t_miscarriage;
          content.t_traffic_accident = cst.t_traffic_accident;
          content.t_burns = cst.t_burns;
          content.t_suspected_tb = cst.t_suspected_tb;
          content.t_dermatosis = cst.t_dermatosis;
          content.t_bloody_diarrhea = cst.t_bloody_diarrhea;
          content.t_urethral_discharge = cst.t_urethral_discharge;
          content.t_vaginal_discharge = cst.t_vaginal_discharge;
          content.t_loss_of_urine = cst.t_loss_of_urine;
          content.t_accidental_ingestion_caustic_products =
            cst.t_accidental_ingestion_caustic_products;
          content.t_food_poisoning = cst.t_food_poisoning;
          content.t_oral_and_dental_diseases = cst.t_oral_and_dental_diseases;
          content.t_dog_bites = cst.t_dog_bites;
          content.t_snake_bite = cst.t_snake_bite;
          content.t_parasitosis = cst.t_parasitosis;
          content.t_measles = cst.t_measles;
          content.t_trauma = cst.t_trauma;
          content.t_gender_based_violence = cst.t_gender_based_violence;
          content.t_vomit = cst.t_vomit;
          content.t_headaches = cst.t_headaches;
          content.t_abdominal_pain = cst.t_abdominal_pain;
          content.t_bleeding = cst.t_bleeding;
          content.t_feel_pain_injection = cst.t_feel_pain_injection;
          content.t_health_center_FP = cst.t_health_center_FP;
          content.t_cpn_not_done = cst.t_cpn_not_done;
          content.t_td1_not_done = cst.t_td1_not_done;
          content.t_td2_not_done = cst.t_td2_not_done;
          content.t_danger_sign = cst.t_danger_sign;
          content.t_fp_side_effect = cst.t_fp_side_effect;
          content.t_domestic_violence = cst.t_domestic_violence;
          content.t_afp = cst.t_afp;
          content.t_cholera = cst.t_cholera;
          content.t_is_pregnant = cst.t_is_pregnant;
          content.t_other_problems = cst.t_other_problems;

          content.t_family_id = cst.t_family_id;
          content.t_family_name = cst.t_family_name;
          content.t_family_external_id = cst.t_family_external_id;
        },
      },
    ],
    events: [
      {
        id: `adult.followup`,
        // days: 7,
        start: 1,
        end: 10,
        dueDate: function (event, c, r) {
          return getAdultFollowupConfig(c, r).nextVisitDate;
        },
      },
    ],
    priority: (c, r) => getPriority(getAdultFollowupConfig(c, r)),
    resolvedIf: function (c, r, event, dueDate) {
      return (
        isWomanPregnant(c.reports) ||
        isFormArraySubmittedInWindow(
          c.reports,
          [`adult_followup`],
          R_Date(dueDate, event),
          R_Date(dueDate, event, true)
        )
      );
    },
  },
  {
    name: `vaccination-followup`,
    icon: `infant`,
    title: `vaccination.followup`,
    appliesTo: `reports`,
    contactLabel: (c, r) => c.contact.name,
    appliesIf: function (c, r) {
      return (
        c.contact.type === `person` &&
        isReco(user) &&
        isVaccinAgeLimit(c) &&
        canApplies(c, r, [`vaccination_followup`]) &&
        getVaccinationFollowupConfig(c, r).displayIf
      );
    },
    actions: [
      {
        type: `report`,
        form: `vaccination_referal_followup`,
        label: `vaccination.followup`,
        modifyContent: function (content, c, r, event) {
          const cst = getVaccinationFollowupConfig(c, r).content;
          content.source = cst.source;
          content.source_id = cst.source_id;
          // content.event_id = cst.event_id;
          content.contact = cst.contact;

          content.t_family_id = cst.t_family_id;
          content.t_family_name = cst.t_family_name;
          content.t_family_external_id = cst.t_family_external_id;
        },
      },
    ],
    events: [
      {
        id: `vaccination-followup`,
        // days: 7,
        start: 1,
        end: 2,
        dueDate: function (event, c, r) {
          return getVaccinationFollowupConfig(c, r).nextVisitDate;
        },
      },
    ],
    priority: (c, r) => getPriority(getVaccinationFollowupConfig(c, r)),
    resolvedIf: function (c, r, event, dueDate) {
      const elm = getVaccinationFollowupConfig(c, r);
      return (
        elm.close_out ||
        isFormArraySubmittedInWindow(
          c.reports,
          [`vaccination_referal_followup`],
          R_Date(dueDate, event),
          R_Date(dueDate, event, true)
        )
      );
    },
  },
];
