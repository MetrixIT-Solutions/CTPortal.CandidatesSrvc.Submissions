/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const euSubFwlsCtrl = require('../controllers/EuSubmsnsFlwupCtrl');

module.exports.controller = (app) => {

  app.post('/ctpeu/v1/eusr/submsns/followup/create', euSubFwlsCtrl.euSubFwlsCreate);
  app.get('/ctpeu/v1/eusr/submsns/followups/list/:subId', euSubFwlsCtrl.euSubFwlsList);
  app.put('/ctpeu/v1/eusr/submsns/followup/update/:recordId', euSubFwlsCtrl.euSubFwlsUpdate);

}