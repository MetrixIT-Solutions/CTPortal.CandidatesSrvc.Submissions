/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const eusCtrl = require('../controllers/EuSubmsnsCtrl');

module.exports.controller = (app) => {

  app.get('/', eusCtrl.apiServerStatus);

  app.post('/ctpeu/v1/eusr/submissions/list', eusCtrl.getEuSubmsnsList);
  app.post('/ctpeu/v1/eusr/submission/create', eusCtrl.postEuSubmsnCreate);
  app.get('/ctpeu/v1/eusr/submission/view/:recordid', eusCtrl.getEuSubmsnView);
  app.put('/ctpeu/v1/eusr/submission/status/update/:recordid', eusCtrl.putEuSubmsnStatusUpdate);
  app.put('/ctpeu/v1/eusr/submission/update/:recordid', eusCtrl.putEuSubmsnUpdate);
  app.get('/ctpeu/v1/eusr/submission/status/history/:recordid', eusCtrl.getEuSubmsnStsHistory);
  app.put('/ctpeu/v1/eusr/profile/submission/update', eusCtrl.putSubDataUpdate);

  app.post('/ctpeu/v1/eusr/submission/priority/create/:id', eusCtrl.postSubmsnPriCreate);
};
