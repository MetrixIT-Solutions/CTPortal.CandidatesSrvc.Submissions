/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const token = require('../tokens');
const util = require('../lib/util');
const eusubVldtn = require('../controllers/apiVldns/EuSubmsnsCtrlVldns');
const eusubFwlupVldtn = require('../controllers/apiVldns/EuSubmsnsFwlupsCtrlVldns');
const euSubFwlsSrv = require('../services/EuSubmsnsFlwupsSrvc');

const euSubFwlsCreate = (req, res) => {  
  const euSubValid = eusubFwlupVldtn.euSubFwlsCreate(req);  
  if (euSubValid.flag) {
    const devInfo = JSON.parse(req.headers.ctpeuua);
    token.refreshToken(req.headers.ctpeuatoken, req.ip || devInfo.ip, res, tData => {
      const tokenValid = eusubVldtn.tokenVldn(tData);
      if (tokenValid.flag) {
        euSubFwlsSrv.euSubFwlsCreate(req.body, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tokenValid.result);
    });
  } else util.sendApiRes(res, euSubValid.result);
}

const euSubFwlsList = (req, res) => {  
  const euSubValid = eusubFwlupVldtn.euSubFwlsList(req);  
  if (euSubValid.flag) {
    const devInfo = JSON.parse(req.headers.ctpeuua);
    token.refreshToken(req.headers.ctpeuatoken, req.ip || devInfo.ip, res, tData => {
      const tokenValid = eusubVldtn.tokenVldn(tData);
      if (tokenValid.flag) {
        euSubFwlsSrv.euSubFwlsList(req.params.subId, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tokenValid.result);
    });
  } else util.sendApiRes(res, euSubValid.result);
}

const euSubFwlsUpdate = (req, res) => {  
  const euSubValid = eusubFwlupVldtn.euSubFwlsUpdate(req);
  if (euSubValid.flag) {
    const devInfo = JSON.parse(req.headers.ctpeuua);
    token.refreshToken(req.headers.ctpeuatoken, req.ip || devInfo.ip, res, tData => {
      const tokenValid = eusubVldtn.tokenVldn(tData);
      if (tokenValid.flag) {
        euSubFwlsSrv.euSubFwlsUpdate(req.params.recordId, req.body, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else util.sendApiRes(res, tokenValid.result);
    });
  } else util.sendApiRes(res, euSubValid.result);
}

module.exports = {
 euSubFwlsCreate, euSubFwlsList, euSubFwlsUpdate
};