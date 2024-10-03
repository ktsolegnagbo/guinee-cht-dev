/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-env es6 */

const {
  isWomanPregnant,
  isReportValid,
  getField,
  toYesNo,
  addDays,
  getAgeInDays,
  getAgeInMonths,
  getMostRecentReport,
} = require(`./utils`);

const fackDate = `2000-01-01`;

function getPrenatalConfig(c, r) {
  var isFound = false;
  var content = [];
  var priority_label = `treatment.prenatal`;
  var close_out = false;
  const next_cpn_visit_date = getField(r, `next_cpn_visit_date`);
  var nextVisitDate;

  if (
    isWomanPregnant(c.reports) &&
    isReportValid(r) &&
    next_cpn_visit_date !== ``
  ) {
    nextVisitDate = addDays(new Date(next_cpn_visit_date), 0.1);
    const cpnNbr = getField(r, `cpn_number`);

    if (
      [`pregnancy_family_planning`, `pregnancy_register`].includes(r.form) &&
      cpnNbr < 4
    ) {
      isFound = getField(r, `next_cpn_visit_date`) !== ``;
    } else if (r.form === `prenatal_followup`) {
      if (getField(r, `is_closed`) === `true`) {
        close_out = true;
      } else if (!(cpnNbr >= 4 && getField(r, `cpn_done`) === `true`)) {
        isFound = true;
      }
    }

    if (isFound) {
      content.push({
        source: `task`,
        source_id: r._id,
        contact: c.contact,

        t_cpn_next_number: getField(r, `cpn_next_number`),
        t_date_cpn1: getField(r, `date_cpn1`),
        t_date_cpn2: getField(r, `date_cpn2`),
        t_date_cpn3: getField(r, `date_cpn3`),
        t_date_cpn4: getField(r, `date_cpn4`),
        t_td1: toYesNo(getField(r, `td1_done`)),
        t_td2: toYesNo(getField(r, `td2_done`)),
        t_milda: toYesNo(getField(r, `has_milda`)),
        t_next_cpn_date: getField(r, `next_cpn_date`),
        t_cpn_done: toYesNo(getField(r, `cpn_done`)),
        t_was_cpn_referred: toYesNo(getField(r, `is_pregnant_referred`)),

        t_family_id: getField(r, `visited_contact_uuid`),
        t_family_name: getField(r, `patient_family_name`),
        t_family_external_id: getField(r, `patient_family_external_id`),
      });
    }
  }

  return {
    nextVisitDate: new Date(isFound ? nextVisitDate : fackDate),
    close_out: close_out,
    priority_label: priority_label,
    displayIf: isFound && content.length > 0,
    content: content.length > 0 ? content[0] : {},
  };
}

function getFpDangerSignConfig(c, r) {
  var isFound = false;
  var content = [];
  var priority_label = `fp.danger.sign`;
  var close_out = false;
  const fp_side_effects_control_date = getField(
    r,
    `fp_side_effects_control_date`
  );
  var nextVisitDate;

  if (
    !isWomanPregnant(c.reports) &&
    isReportValid(r) &&
    fp_side_effects_control_date !== `` &&
    getField(r, `is_fp_referred`) !== `true` &&
    [`pregnancy_family_planning`, `family_planning`].includes(r.form) &&
    getField(r, `is_method_avaible_reco`) === `true` &&
    getField(r, `method_was_given`) === `true`
  ) {
    nextVisitDate = addDays(new Date(fp_side_effects_control_date), 0.1);
    isFound = true;

    if (isFound) {
      priority_label = getField(r, `fp_method_name`);

      content.push({
        source: `task`,
        source_id: r._id,
        contact: c.contact,

        t_fp_method: getField(r, `fp_method`),
        t_fp_method_name: getField(r, `fp_method_name`),
        t_next_fp_renew_date: getField(r, `next_fp_renew_date`),
        t_method_start_date: getField(r, `method_start_date`),

        t_family_id: getField(r, `visited_contact_uuid`),
        t_family_name: getField(r, `patient_family_name`),
        t_family_external_id: getField(r, `patient_family_external_id`),
      });
    }
  }

  return {
    nextVisitDate: new Date(isFound ? nextVisitDate : fackDate),
    close_out: close_out,
    priority_label: priority_label,
    displayIf: isFound && content.length > 0,
    content: content.length > 0 ? content[0] : {},
  };
}

function getFpRenewalConfig(c, r) {
  var isFound = false;
  var content = [];
  var priority_label = `fp.renewal`;
  var close_out = false;
  const next_fp_renew_date = getField(r, `next_fp_renew_date`);
  var nextVisitDate;

  if (
    !isWomanPregnant(c.reports) &&
    isReportValid(r) &&
    next_fp_renew_date !== `` &&
    ((getField(r, `is_fp_referred`) !== `true` &&
      [`pregnancy_family_planning`, `family_planning`].includes(r.form) &&
      getField(r, `is_method_avaible_reco`) === `true`) ||
      (getField(r, `is_referred`) !== `true` && r.form === `fp_renewal`)) &&
    getField(r, `method_was_given`) === `true`
  ) {
    nextVisitDate = addDays(new Date(next_fp_renew_date), 0.1);
    isFound = true;

    if (isFound) {
      priority_label = getField(r, `fp_method_name`);

      content.push({
        source: `task`,
        source_id: r._id,
        contact: c.contact,

        t_fp_method: getField(r, `fp_method`),
        t_fp_method_name: getField(r, `fp_method_name`),
        t_next_fp_renew_date: getField(r, `next_fp_renew_date`),
        t_method_start_date: getField(r, `method_start_date`),

        t_family_id: getField(r, `visited_contact_uuid`),
        t_family_name: getField(r, `patient_family_name`),
        t_family_external_id: getField(r, `patient_family_external_id`),
      });
    }
  }

  return {
    nextVisitDate: new Date(isFound ? nextVisitDate : fackDate),
    close_out: close_out,
    priority_label: priority_label,
    displayIf: isFound && content.length > 0,
    content: content.length > 0 ? content[0] : {},
  };
}

function getPcimneFollowupConfig(c, r) {
  var isFound = false;
  var treats = [];
  var content = [];
  var priority_label = ``;
  var close_out = false;
  const nextVisitDate = addDays(new Date(r.reported_date), 0.1);

  if (
    isReportValid(r) &&
    r.form === `pcimne_register` &&
    getField(r, `has_health_problem`) === `true`
  ) {
    const is_referred = toYesNo(getField(r, `is_referred`));
    const has_fever = toYesNo(getField(r, `has_fever`));
    const has_malaria = toYesNo(getField(r, `has_malaria`));
    const has_diarrhea = toYesNo(getField(r, `has_diarrhea`));
    const has_cough_cold = toYesNo(getField(r, `has_cough_cold`));
    const has_malnutrition = toYesNo(getField(r, `has_malnutrition`));
    const has_pneumonia = toYesNo(getField(r, `has_pneumonia`));

    if (has_fever === `yes` && has_malaria === `yes`)
      treats.push(`malaria.fever`);
    if (has_fever === `yes` && has_malaria !== `yes`) treats.push(`fever`);
    if (has_diarrhea === `yes`) treats.push(`diarrhea`);
    if (has_cough_cold === `yes`) treats.push(`cough_cold`);
    if (has_malnutrition === `yes`) treats.push(`malnutrition`);
    if (has_pneumonia === `yes`) treats.push(`pneumonia`);

    if (treats.length === 0 && is_referred === `yes`) {
      priority_label = `danger.sign.followup`;
      isFound = true;
    } else if (treats.length === 1) {
      priority_label = `treatment.${treats[0]}`;
      isFound = true;
    } else if (treats.length > 1) {
      priority_label = `treatment.multiple`;
      isFound = true;
    }

    if (isFound) {
      content.push({
        source: `task`,
        source_id: r._id,
        contact: c.contact,

        t_family_id: getField(r, `visited_contact_uuid`),
        t_family_name: getField(r, `patient_family_name`),
        t_family_external_id: getField(r, `patient_family_external_id`),

        t_temperature: getField(r, `temperature`),
        t_has_fever: has_fever,
        t_has_malaria: has_malaria,
        t_has_diarrhea: has_diarrhea,
        t_has_cough_cold: has_cough_cold,
        t_has_malnutrition: has_malnutrition,
        t_has_pneumonia: has_pneumonia,

        t_unable_drink_breastfeed: getField(r, `unable_drink_breastfeed`),
        t_vomits_everything: getField(r, `vomits_everything`),
        t_convulsions: getField(r, `convulsions`),
        t_sleepy_unconscious: getField(r, `sleepy_unconscious`),
        t_has_stiff_neck: getField(r, `has_stiff_neck`),
        t_has_bulging_fontanelle: getField(r, `has_bulging_fontanelle`),
        t_breathing_difficulty: getField(r, `breathing_difficulty`),
        t_cough_more_than_14days: getField(r, `cough_more_than_14days`),
        t_subcostal_indrawing: getField(r, `subcostal_indrawing`),
        t_wheezing: getField(r, `wheezing`),
        t_bloody_diarrhea: getField(r, `bloody_diarrhea`),
        t_diarrhea_more_than_14_days: getField(r, `diarrhea_more_than_14_days`),
        t_blood_in_stool: getField(r, `blood_in_stool`),
        t_restless: getField(r, `restless`),
        t_drinks_hungrily: getField(r, `drinks_hungrily`),
        t_sunken_eyes: getField(r, `sunken_eyes`),
        t_has_edema: getField(r, `has_edema`),
        t_has_other_disease_problem: getField(r, ``),
        t_has_afp: toYesNo(getField(r, `has_afp`)),
        t_other_diseases: getField(r, `other_diseases`),
        t_is_referred: is_referred,
      });
    }
  }

  return {
    nextVisitDate: new Date(isFound ? nextVisitDate : fackDate),
    close_out: close_out,
    priority_label: priority_label,
    displayIf: isFound && content.length > 0,
    content: content.length > 0 ? content[0] : {},
  };
}

function getReferralFollowupConfig(c, r) {
  var isFound = false;
  var content = [];
  var priority_label = ``;
  var close_out = false;
  var nextVisitDate = addDays(new Date(r.reported_date), 0.1);
  const is_referred = toYesNo(getField(r, `is_referred`));

  if (
    isReportValid(r) &&
    is_referred === `yes` &&
    [`pcimne_followup`, `newborn_followup`, `adult_followup`].includes(r.form)
  ) {
    isFound = true;

    if (isFound) {
      content.push({
        source: `task`,
        source_id: r._id,
        contact: c.contact,

        t_family_id: getField(r, `visited_contact_uuid`),
        t_family_name: getField(r, `patient_family_name`),
        t_family_external_id: getField(r, `patient_family_external_id`),

        t_other_diseases: getField(r, `other_diseases`),
        t_is_referred: is_referred,
      });
    }
  }

  return {
    nextVisitDate: new Date(isFound ? nextVisitDate : fackDate),
    close_out: close_out,
    priority_label: priority_label,
    displayIf: isFound && content.length > 0,
    content: content.length > 0 ? content[0] : {},
  };
}

function getTownHallReferralFollowupConfig(c) {
  var isFound = false;
  var content = [];
  var priority_label = ``;
  var close_out = false;
  var nextVisitDate = fackDate;
  var family_name = ``;
  var family_external_id = ``;

  if (c && c.contact && getAgeInMonths(c) < 60) {
    nextVisitDate = addDays(new Date(c.contact.reported_date), 0.1);

    const ok1 = c.contact.register_patient.has_birth_certificate === `no`;
    const ok2 = c.contact.register_patient.birth_certificate_referal === `yes`;
    if (ok1 === true && ok2 === true) {
      isFound = true;
      priority_label = `birth.certificate`;

      if (c.reports && (c.reports || []).length > 0) {
        for (let r of c.reports) {
          family_name = getField(r, `patient_family_name`);
          family_external_id = getField(r, `patient_family_external_id`);
          if (family_name !== `` && family_external_id !== ``) {
            break;
          }
        }
      }

      content.push({
        source: `task`,
        source_id: c.contact._id,
        contact: c.contact,
        t_family_id: c.contact.parent._id,
        t_family_name: family_name,
        t_family_external_id: family_external_id,

        t_other_diseases: ``,
        t_is_referred: `yes`,
      });
    }
  }

  return {
    nextVisitDate: new Date(isFound ? nextVisitDate : fackDate),
    close_out: close_out,
    priority_label: priority_label,
    displayIf: isFound && content.length > 0,
    content: content.length > 0 ? content[0] : {},
  };
}

function getNewbornFollowupConfig(c, r) {
  var isFound = false;
  var content = [];
  var priority_label = ``;
  var close_out = false;
  const nextVisitDate = addDays(new Date(r.reported_date), 0.1);
  const is_referred = toYesNo(getField(r, `is_referred`));

  if (
    isReportValid(r) &&
    r.form === `newborn_register` &&
    is_referred === `yes`
  ) {
    isFound = true;

    if (isFound) {
      content.push({
        source: `task`,
        source_id: r._id,
        contact: c.contact,

        t_family_id: getField(r, `visited_contact_uuid`),
        t_family_name: getField(r, `patient_family_name`),
        t_family_external_id: getField(r, `patient_family_external_id`),

        t_is_referred: is_referred,

        t_unable_to_suckle: toYesNo(getField(r, `has_unable_to_suckle`)),
        t_vomits_everything_consumes: toYesNo(
          getField(r, `has_vomits_everything_consumes`)
        ),
        t_convulsion: toYesNo(getField(r, `has_convulsion`)),
        t_sleepy_unconscious: toYesNo(getField(r, `has_sleepy_unconscious`)),
        t_stiff_neck: toYesNo(getField(r, `has_stiff_neck`)),
        t_domed_fontanelle: toYesNo(getField(r, `has_domed_fontanelle`)),
        t_breathe_hard: toYesNo(getField(r, `has_breathe_hard`)),
        t_subcostal_indrawing: toYesNo(getField(r, `has_subcostal_indrawing`)),
        t_wheezing: toYesNo(getField(r, `has_wheezing`)),
        t_diarrhea: toYesNo(getField(r, `has_diarrhea`)),
        t_malnutrition: toYesNo(getField(r, `has_malnutrition`)),
        t_reference_pattern_other: toYesNo(
          getField(r, `reference_pattern_other`)
        ),
        t_malaria: toYesNo(getField(r, `has_malaria`)),
        t_pneumonia: toYesNo(getField(r, `has_pneumonia`)),
        t_cough_cold: toYesNo(getField(r, `has_cough_cold`)),
      });
    }
  }

  return {
    nextVisitDate: new Date(isFound ? nextVisitDate : fackDate),
    close_out: close_out,
    priority_label: priority_label,
    displayIf: isFound && content.length > 0,
    content: content.length > 0 ? content[0] : {},
  };
}

function getVaccinationFollowupConfig(c, r) {
  var isFound = false;
  var content = [];
  var priority_label = ``;
  var close_out = false;
  var vaccines = [];
  var nextVisitDate = addDays(new Date(r.reported_date), 0.1);

  if (isReportValid(r) && r.form === `vaccination_followup`) {
    const vr = getMostRecentReport(c.reports, [`vaccination_followup`]);
    if (vr) {
      if (vr._id === r._id) {
        isFound = getField(r, `is_vaccine_referal`) === `true`;
        priority_label = `referral.followup`;
      } else {
        nextVisitDate = addDays(new Date(), 0.1);
        if (getAgeInDays(c) >= 0) {
          const vaccine_BCG = getField(vr, `vaccine_BCG`);
          const vaccine_VPO_0 = getField(vr, `vaccine_VPO_0`);
          if (vaccine_BCG !== `yes`) {
            isFound = true;
            vaccines.push(`BCG`);
          }
          if (vaccine_VPO_0 !== `yes`) {
            isFound = true;
            vaccines.push(`VPO 0`);
          }
        }
        if (getAgeInDays(c) >= 42) {
          const vaccine_PENTA_1 = getField(vr, `vaccine_PENTA_1`);
          const vaccine_VPO_1 = getField(vr, `vaccine_VPO_1`);
          if (vaccine_PENTA_1 !== `yes`) {
            isFound = true;
            vaccines.push(`PENTA 1`);
          }
          if (vaccine_VPO_1 !== `yes`) {
            isFound = true;
            vaccines.push(`VPO 1`);
          }
        }
        if (getAgeInDays(c) >= 70) {
          const vaccine_PENTA_2 = getField(vr, `vaccine_PENTA_2`);
          const vaccine_VPO_2 = getField(vr, `vaccine_VPO_2`);
          if (vaccine_PENTA_2 !== `yes`) {
            isFound = true;
            vaccines.push(`PENTA 2`);
          }
          if (vaccine_VPO_2 !== `yes`) {
            isFound = true;
            vaccines.push(`VPO 2`);
          }
        }
        if (getAgeInDays(c) >= 98) {
          const vaccine_PENTA_3 = getField(vr, `vaccine_PENTA_3`);
          const vaccine_VPO_3 = getField(vr, `vaccine_VPO_3`);
          const vaccine_VPI_1 = getField(vr, `vaccine_VPI_1`);
          if (vaccine_PENTA_3 !== `yes`) {
            isFound = true;
            vaccines.push(`PENTA 3`);
          }
          if (vaccine_VPO_3 !== `yes`) {
            isFound = true;
            vaccines.push(`VPO 3`);
          }
          if (vaccine_VPI_1 !== `yes`) {
            isFound = true;
            vaccines.push(`VPI 1`);
          }
        }
        if (getAgeInMonths(c) >= 9) {
          const vaccine_VAR_1 = getField(vr, `vaccine_VAR_1`);
          const vaccine_VAA = getField(vr, `vaccine_VAA`);
          const vaccine_VPI_2 = getField(vr, `vaccine_VPI_2`);
          if (vaccine_VAR_1 !== `yes`) {
            isFound = true;
            vaccines.push(`VAR 1`);
          }
          if (vaccine_VAA !== `yes`) {
            isFound = true;
            vaccines.push(`VAA`);
          }
          if (vaccine_VPI_2 !== `yes`) {
            isFound = true;
            vaccines.push(`VPI 2`);
          }
        }
        if (getAgeInMonths(c) >= 15) {
          const vaccine_MEN_A = getField(vr, `vaccine_MEN_A`);
          const vaccine_VAR_2 = getField(vr, `vaccine_VAR_2`);
          if (vaccine_MEN_A !== `yes`) {
            isFound = true;
            vaccines.push(`MEN A`);
          }
          if (vaccine_VAR_2 !== `yes`) {
            isFound = true;
            vaccines.push(`VAR 2`);
          }
        }

        if (vaccines.length >= 1 && vaccines.length <= 3) {
          priority_label = `${vaccines.join(`, `)}`;
        } else {
          priority_label = `multiple.followup`;
        }
      }

      if (isFound) {
        content.push({
          source: `task`,
          source_id: r._id,
          contact: c.contact,

          t_family_id: getField(r, `visited_contact_uuid`),
          t_family_name: getField(r, `patient_family_name`),
          t_family_external_id: getField(r, `patient_family_external_id`),
        });
      }
    }
  }

  return {
    nextVisitDate: new Date(isFound ? nextVisitDate : fackDate),
    close_out: close_out,
    priority_label: priority_label,
    displayIf: isFound && content.length > 0,
    content: content.length > 0 ? content[0] : {},
  };
}

function getAdultFollowupConfig(c, r) {
  var isFound = false;
  var content = [];
  var priority_label = ``;
  var close_out = false;
  const nextVisitDate = addDays(new Date(r.reported_date), 0.1);

  var malaria;
  var fever;
  var diarrhea;
  var yellow_fever;
  var tetanus;
  var cough_or_cold;
  var viral_diseases;
  var acute_flaccid_paralysis;
  var meningitis;
  var miscarriage;
  var traffic_accident;
  var burns;
  var suspected_tb;
  var dermatosis;
  var bloody_diarrhea;
  var urethral_discharge;
  var vaginal_discharge;
  var loss_of_urine;
  var accidental_ingestion_caustic_products;
  var food_poisoning;
  var oral_and_dental_diseases;
  var dog_bites;
  var snake_bite;
  var parasitosis;
  var measles;
  var trauma;
  var gender_based_violence;
  var vomit;
  var headaches;
  var abdominal_pain;
  var bleeding;
  var feel_pain_injection;
  var health_center_FP;
  var fp_side_effect;
  var cpn_not_done;
  var td1_not_done;
  var td2_not_done;
  var danger_sign;
  var domestic_violence;
  var afp;
  var cholera;
  var is_pregnant;

  var other_problems;

  if (isReportValid(r)) {
    if (r.form === `adult_consulation`) {
      isFound = true;
      const visit_motifs = getField(r, `visit_motif`).split(` `);
      is_pregnant = toYesNo(getField(r, `is_pregnant`));
      if (visit_motifs.includes(`fever`)) {
        if (getField(r, `tdr_result`) === `positive`) {
          malaria = `yes`;
        } else {
          fever = `yes`;
        }
      }
      if (visit_motifs.includes(`diarrhea`)) {
        diarrhea = `yes`;
      }
      if (visit_motifs.includes(`yellow_fever`)) {
        yellow_fever = `yes`;
      }
      if (visit_motifs.includes(`tetanus`)) {
        tetanus = `yes`;
      }
      if (visit_motifs.includes(`cough_or_cold`)) {
        cough_or_cold = `yes`;
      }
      if (visit_motifs.includes(`viral_diseases`)) {
        viral_diseases = `yes`;
      }
      if (visit_motifs.includes(`acute_flaccid_paralysis`)) {
        acute_flaccid_paralysis = `yes`;
      }
      if (visit_motifs.includes(`meningitis`)) {
        meningitis = `yes`;
      }
      if (visit_motifs.includes(`miscarriage`)) {
        miscarriage = `yes`;
      }
      if (visit_motifs.includes(`traffic_accident`)) {
        traffic_accident = `yes`;
      }
      if (visit_motifs.includes(`burns`)) {
        burns = `yes`;
      }
      if (visit_motifs.includes(`suspected_tb`)) {
        suspected_tb = `yes`;
      }
      if (visit_motifs.includes(`dermatosis`)) {
        dermatosis = `yes`;
      }
      if (visit_motifs.includes(`bloody_diarrhea`)) {
        bloody_diarrhea = `yes`;
      }
      if (visit_motifs.includes(`urethral_discharge`)) {
        urethral_discharge = `yes`;
      }
      if (visit_motifs.includes(`vaginal_discharge`)) {
        vaginal_discharge = `yes`;
      }
      if (visit_motifs.includes(`loss_of_urine`)) {
        loss_of_urine = `yes`;
      }
      if (visit_motifs.includes(`accidental_ingestion_caustic_products`)) {
        accidental_ingestion_caustic_products = `yes`;
      }
      if (visit_motifs.includes(`food_poisoning`)) {
        food_poisoning = `yes`;
      }
      if (visit_motifs.includes(`oral_and_dental_diseases`)) {
        oral_and_dental_diseases = `yes`;
      }
      if (visit_motifs.includes(`dog_bites`)) {
        dog_bites = `yes`;
      }
      if (visit_motifs.includes(`snake_bite`)) {
        snake_bite = `yes`;
      }
      if (visit_motifs.includes(`parasitosis`)) {
        parasitosis = `yes`;
      }
      if (visit_motifs.includes(`measles`)) {
        measles = `yes`;
      }
      if (visit_motifs.includes(`trauma`)) {
        trauma = `yes`;
      }
      if (visit_motifs.includes(`gender_based_violence`)) {
        gender_based_violence = `yes`;
      }
      if (visit_motifs.includes(`fp_side_effect`)) {
        fp_side_effect = `yes`;
      }
      if (visit_motifs.includes(`domestic_violence`)) {
        domestic_violence = `yes`;
      }
      if (visit_motifs.includes(`afp`)) {
        afp = `yes`;
      }
      if (visit_motifs.includes(`cholera`)) {
        cholera = `yes`;
      }
      if (visit_motifs.includes(`others`)) {
        other_problems =
          getField(r, `other_motif`) ||
          `La femme avait un problème de santé non spécifié`;
      }
    } else if (
      r.form === `fp_danger_sign_check` &&
      getField(r, `is_referred`) === `true`
    ) {
      isFound = true;
      is_pregnant = `no`;

      if (getField(r, `has_health_problem`) === `true`) {
        other_problems =
          getField(r, `other_health_problem_written`) ||
          `La femme avait un problème de santé non spécifié`;
      }

      if (getField(r, `has_fever`) === `true`) {
        fever = `yes`;
      }

      if (getField(r, `has_vomit`) === `true`) {
        vomit = `yes`;
      }

      if (getField(r, `has_headaches`) === `true`) {
        headaches = `yes`;
      }

      if (getField(r, `has_abdominal_pain`) === `true`) {
        abdominal_pain = `yes`;
      }
      if (getField(r, `has_bleeding`) === `true`) {
        bleeding = `yes`;
      }

      if (getField(r, `has_feel_pain_injection`) === `true`) {
        feel_pain_injection = `yes`;
      }
    } else if (
      r.form === `fp_renewal` &&
      getField(r, `is_referred`) === `true`
    ) {
      isFound = true;
      is_pregnant = `no`;

      if (
        getField(r, `is_fp_referal`) === `true` &&
        getField(r, `method_not_given_reason`) === `on_break`
      ) {
        health_center_FP = `yes`;
      }

      if (
        getField(r, `is_fp_referal`) === `true` &&
        getField(r, `method_not_given_reason`) === `side_effect`
      ) {
        fp_side_effect = `yes`;
      }

      if (getField(r, `is_health_problem_referal`) === `true`) {
        other_problems = `La femme avait un problème de santé`;
      }
    } else if (
      [`pregnancy_family_planning`, `pregnancy_register`].includes(r.form)
    ) {
      const is_pregnant_referred =
        getField(r, `is_pregnant_referred`) === `true` &&
        getField(r, `is_fp_referred`) !== `true` &&
        getField(r, `is_pregnant`) === `true` &&
        getField(r, `next_cpn_visit_date`) === ``;
      const is_fp_referred =
        getField(r, `is_fp_referred`) === `true` &&
        getField(r, `is_pregnant_referred`) !== `true` &&
        getField(r, `is_pregnant`) === `false` &&
        getField(r, `next_fp_renew_date`) === ``;

      if (is_fp_referred === true) {
        isFound = true;
        is_pregnant = `no`;
        if (getField(r, `method_not_given_reason`) !== `side_effect`) {
          health_center_FP = `yes`;
        } else {
          fp_side_effect = `yes`;
        }
      }

      if (is_pregnant_referred === true) {
        isFound = true;
        is_pregnant = `yes`;
        if (
          getField(r, `cpn_done`) === `false` ||
          getField(r, `is_cpn_late`) === `true`
        ) {
          cpn_not_done = `yes`;
        }
        if (getField(r, `td1_done`) === `false`) {
          td1_not_done = `yes`;
        }
        if (
          getField(r, `td1_done`) === `true` &&
          getField(r, `td2_done`) === `false`
        ) {
          td2_not_done = `yes`;
        }
      }
    } else if (
      r.form === `prenatal_followup` &&
      getField(r, `is_referred`) === `true` &&
      getField(r, `next_cpn_visit_date`) === ``
    ) {
      isFound = true;
      is_pregnant = `yes`;
      if (
        getField(r, `cpn_done`) === `false` ||
        getField(r, `is_cpn_late`) === `true`
      ) {
        cpn_not_done = `yes`;
      }
      if (getField(r, `td1_done`) === `false`) {
        td1_not_done = `yes`;
      }
      if (
        getField(r, `td1_done`) === `true` &&
        getField(r, `td2_done`) === `false`
      ) {
        td2_not_done = `yes`;
      }
      if (getField(r, `is_miscarriage_referred`) === `true`) {
        miscarriage = `yes`;
      }
      if (getField(r, `has_danger_sign`) === `true`) {
        danger_sign = `yes`;
      }
    }

    if (isFound) {
      content.push({
        source: `task`,
        source_id: r._id,
        contact: c.contact,

        t_malaria: malaria,
        t_fever: fever,
        t_diarrhea: diarrhea,
        t_yellow_fever: yellow_fever,
        t_tetanus: tetanus,
        t_cough_or_cold: cough_or_cold,
        t_viral_diseases: viral_diseases,
        t_acute_flaccid_paralysis: acute_flaccid_paralysis,
        t_meningitis: meningitis,
        t_miscarriage: miscarriage,
        t_traffic_accident: traffic_accident,
        t_burns: burns,
        t_suspected_tb: suspected_tb,
        t_dermatosis: dermatosis,
        t_bloody_diarrhea: bloody_diarrhea,
        t_urethral_discharge: urethral_discharge,
        t_vaginal_discharge: vaginal_discharge,
        t_loss_of_urine: loss_of_urine,
        t_accidental_ingestion_caustic_products:
          accidental_ingestion_caustic_products,
        t_food_poisoning: food_poisoning,
        t_oral_and_dental_diseases: oral_and_dental_diseases,
        t_dog_bites: dog_bites,
        t_snake_bite: snake_bite,
        t_parasitosis: parasitosis,
        t_measles: measles,
        t_trauma: trauma,
        t_gender_based_violence: gender_based_violence,
        t_vomit: vomit,
        t_headaches: headaches,
        t_abdominal_pain: abdominal_pain,
        t_bleeding: bleeding,
        t_feel_pain_injection: feel_pain_injection,
        t_health_center_FP: health_center_FP,
        t_fp_side_effect: fp_side_effect,
        t_cpn_not_done: cpn_not_done,
        t_td1_not_done: td1_not_done,
        t_td2_not_done: td2_not_done,
        t_danger_sign: danger_sign,
        t_domestic_violence: domestic_violence,
        t_afp: afp,
        t_cholera: cholera,
        t_is_pregnant: is_pregnant,

        t_other_problems: other_problems,

        t_family_id: getField(r, `visited_contact_uuid`),
        t_family_name: getField(r, `patient_family_name`),
        t_family_external_id: getField(r, `patient_family_external_id`),
      });
    }
  }

  return {
    nextVisitDate: new Date(isFound ? nextVisitDate : fackDate),
    close_out: close_out,
    priority_label: priority_label,
    displayIf: isFound && content.length > 0,
    content: content.length > 0 ? content[0] : {},
  };
}

module.exports = {
  getPrenatalConfig,
  getFpDangerSignConfig,
  getFpRenewalConfig,
  getPcimneFollowupConfig,
  getReferralFollowupConfig,
  getTownHallReferralFollowupConfig,
  getAdultFollowupConfig,
  getNewbornFollowupConfig,
  getVaccinationFollowupConfig,
};
