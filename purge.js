/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-env es6 */

const { filtrerDoublonsMaxValMapIds } = require(`./utils`);

// text_expression: 'à 8 heures chaque jour',
// cron: `0 8 * * *`,
// run_every_days: 1,

// text_expression: 'at 9 am every 2 days',
// run_every_days: 2, // Descriptive property
// cron: '0 9 */2 * *',

module.exports = {
  text_expression: "at 1 am on Sunday",
  run_every_days: 7,
  cron: "0 1 * * SUN",
  fn: function (
    userCtx,
    contact,
    reports,
    messages,
    chtScriptApi,
    permissions
  ) {
    //Purging time frames
    const oldNow = Date.now();
    const old30 = Date.now() - 1000 * 60 * 60 * 24 * 30;
    const old40 = Date.now() - 1000 * 60 * 60 * 24 * 40;
    const old60 = Date.now() - 1000 * 60 * 60 * 24 * 60;
    const old90 = Date.now() - 1000 * 60 * 60 * 24 * 90;
    const old120 = Date.now() - 1000 * 60 * 60 * 24 * 120;
    const old180 = Date.now() - 1000 * 60 * 60 * 24 * 180;
    const old280 = Date.now() - 1000 * 60 * 60 * 24 * 280;
    const old365 = Date.now() - 1000 * 60 * 60 * 24 * 365;
    const old518 = Date.now() - 1000 * 60 * 60 * 24 * 518;
    const old2year = Date.now() - 1000 * 60 * 60 * 24 * 365 * 2;

    const USER_ROLES = ["chw"];

    // ########## Rules ##########
    // if (!userCtx.roles.some(role => USER_ROLES.includes(role))) {
    //   return [];
    // }

    if (userCtx.roles.includes(`mentor`)) {
      const fsMegSituationToPurge = reports
        .filter(
          (r) => r.form === `fs_meg_situation` && r.reported_date < old365
        )
        .map((r) => r._id);
      return [...fsMegSituationToPurge];
    }

    if (userCtx.roles.includes(`reco`)) {
      let newFamilyToPurge = [];
      let newPatientToPurge = [];
      let vaccinationToPurge = [];

      const newFamilyGoodIds = filtrerDoublonsMaxValMapIds(
        reports,
        `create_new_family`
      );
      const newPatientGoodIds = filtrerDoublonsMaxValMapIds(
        reports,
        `create_new_patient`
      );
      const newVaccinationGoodIds = filtrerDoublonsMaxValMapIds(
        reports,
        `vaccination_followup`
      );

      if (newFamilyGoodIds.length > 0) {
        newFamilyToPurge = reports
          .filter(
            (r) =>
              r.form === `create_new_family` &&
              !newFamilyGoodIds.includes(r._id)
          )
          .map((r) => r._id);
      }
      if (newPatientGoodIds.length > 0) {
        newPatientToPurge = reports
          .filter(
            (r) =>
              r.form === `create_new_patient` &&
              !newPatientGoodIds.includes(r._id)
          )
          .map((r) => r._id);
      }
      if (newVaccinationGoodIds.length > 0) {
        vaccinationToPurge = reports
          .filter(
            (r) =>
              r.form === `vaccination_followup` &&
              !newVaccinationGoodIds.includes(r._id)
          )
          .map((r) => r._id);
      }

      const referalVaccinationToPurge = reports
        .filter((r) => r.form === `vaccination_referal_followup`)
        .map((r) => r._id);

      const adultConsulationToPurge = reports
        .filter(
          (r) => r.form === `adult_consulation` && r.reported_date < old40
        )
        .map((r) => r._id);
      const adultFollowupToPurge = reports
        .filter((r) => r.form === `adult_followup` && r.reported_date < old40)
        .map((r) => r._id);
      const deliveryToPurge = reports
        .filter((r) => r.form === `delivery` && r.reported_date < old280)
        .map((r) => r._id);
      const eventRegisterToPurge = reports
        .filter((r) => r.form === `event_register` && r.reported_date < old40)
        .map((r) => r._id);
      const fpDangerSign_checkToPurge = reports
        .filter(
          (r) => r.form === `fp_danger_sign_check` && r.reported_date < old40
        )
        .map((r) => r._id);
      const fpRenewalToPurge = reports
        .filter((r) => r.form === `fp_renewal` && r.reported_date < old280)
        .map((r) => r._id);

      const newbornFollowupToPurge = reports
        .filter((r) => r.form === `newborn_followup` && r.reported_date < old40)
        .map((r) => r._id);
      const newbornRegisterToPurge = reports
        .filter((r) => r.form === `newborn_register` && r.reported_date < old40)
        .map((r) => r._id);
      const pcimneFollowupToPurge = reports
        .filter((r) => r.form === `pcimne_followup` && r.reported_date < old40)
        .map((r) => r._id);
      const pcimneRegisterToPurge = reports
        .filter((r) => r.form === `pcimne_register` && r.reported_date < old40)
        .map((r) => r._id);
      const pregnancyFPToPurge = reports
        .filter(
          (r) =>
            r.form === `pregnancy_family_planning` && r.reported_date < old280
        )
        .map((r) => r._id);
      const pregnancyRegisterToPurge = reports
        .filter(
          (r) => r.form === `pregnancy_register` && r.reported_date < old280
        )
        .map((r) => r._id);
      const PamilyPlanningToPurge = reports
        .filter((r) => r.form === `family_planning` && r.reported_date < old280)
        .map((r) => r._id);
      const prenatalFollowupToPurge = reports
        .filter(
          (r) => r.form === `prenatal_followup` && r.reported_date < old280
        )
        .map((r) => r._id);
      const promotionalActivityToPurge = reports
        .filter(
          (r) => r.form === `promotional_activity` && r.reported_date < old40
        )
        .map((r) => r._id);
      const referralFollowupToPurge = reports
        .filter(
          (r) => r.form === `referral_followup` && r.reported_date < old40
        )
        .map((r) => r._id);
      // const stockEntryToPurge = reports.filter((r) => r.form === `stock_entry` && r.reported_date < old40).map((r) => r._id);
      // const stockMovementToPurge = reports.filter((r) => r.form === `stock_movement` && r.reported_date < old40).map((r) => r._id);
      const deathReportToPurge = reports
        .filter((r) => r.form === `death_report`)
        .map((r) => r._id);
      const undoDeathReportToPurge = reports
        .filter((r) => r.form === `undo_death_report`)
        .map((r) => r._id);

      return [
        ...newFamilyToPurge,
        ...newPatientToPurge,
        ...vaccinationToPurge,
        ...referalVaccinationToPurge,
        ...adultConsulationToPurge,
        ...adultFollowupToPurge,
        ...deathReportToPurge,
        ...deliveryToPurge,
        ...eventRegisterToPurge,
        ...fpDangerSign_checkToPurge,
        ...fpRenewalToPurge,
        ...newbornFollowupToPurge,
        ...newbornRegisterToPurge,
        ...pcimneFollowupToPurge,
        ...pcimneRegisterToPurge,
        ...pregnancyFPToPurge,
        ...pregnancyRegisterToPurge,
        ...PamilyPlanningToPurge,
        ...prenatalFollowupToPurge,
        ...promotionalActivityToPurge,
        ...referralFollowupToPurge,
        ...undoDeathReportToPurge,
      ];
    }
  },
};
