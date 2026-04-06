/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const util = require('../lib/util');
const SetRes = require('../SetRes');
const euSubmsnsCvs = require('./apiVldns/EuSubmsnsCtrlVldns');
const euSubmsnsSrvc = require('../services/EuSubmsnsSrvc');
const tokens = require('../tokens');

const apiServerStatus = (req, res) => {
  const resObj = SetRes.apiServerStatus();
  util.sendApiRes(res, resObj);
}

const getEuSubmsnsList = (req, res) => {
  const vds = euSubmsnsCvs.listVldn(req);
  if (vds.flag) {
    const devInfo = JSON.parse(req.headers.ctpeuua);
    tokens.refreshToken(req.headers.ctpeuatoken,  req.ip || devInfo.ip, res, (tData) => {
      const tv = euSubmsnsCvs.tokenVldn(tData);
      if (tv.flag) {
        euSubmsnsSrvc.getEuSubmsnsList(req.body, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else {
        util.sendApiRes(res, tv.result);
      }
    });
  } else {
    util.sendApiRes(res, vds.result);
  }
}

const postEuSubmsnCreate = (req, res) => {
  const vds = euSubmsnsCvs.createVldn(req);
  if (vds.flag) {
    const devInfo = JSON.parse(req.headers.ctpeuua);
    tokens.refreshToken(req.headers.ctpeuatoken,  req.ip || devInfo.ip, res, (tData) => {
      const tv = euSubmsnsCvs.tokenVldn(tData);
      if (tv.flag) {
        euSubmsnsSrvc.postEuSubmsnCreate(req.body, tData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else {
        util.sendApiRes(res, tv.result);
      }
    });
  } else {
    util.sendApiRes(res, vds.result);
  }
}

const getEuSubmsnView = (req, res) => {
  const vds = euSubmsnsCvs.viewVldn(req);
  if (vds.flag) {
    const devInfo = JSON.parse(req.headers.ctpeuua);
    tokens.refreshToken(req.headers.ctpeuatoken,  req.ip || devInfo.ip, res, (tData) => {
      const tv = euSubmsnsCvs.tokenVldn(tData);
      if (tv.flag) {
        euSubmsnsSrvc.getEuSubmsnView(req.params.recordid, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else {
        util.sendApiRes(res, tv.result);
      }
    });
  } else {
    util.sendApiRes(res, vds.result);
  }
}

const putEuSubmsnStatusUpdate = (req, res) => {
  const vds = euSubmsnsCvs.statusVldn(req);
  if (vds.flag) {
    const devInfo = JSON.parse(req.headers.ctpeuua);
    tokens.refreshToken(req.headers.ctpeuatoken,  req.ip || devInfo.ip, res, (tData) => {
      const tv = euSubmsnsCvs.tokenVldn(tData);
      if (tv.flag) {
        euSubmsnsSrvc.putEuSubmsnStatusUpdate(req, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else {
        util.sendApiRes(res, tv.result);
      }
    });
  } else {
    util.sendApiRes(res, vds.result);
  }
}

const putEuSubmsnUpdate = (req, res) => {
  const vds = euSubmsnsCvs.updateVldn(req);
  if (vds.flag) {
    const devInfo = JSON.parse(req.headers.ctpeuua);
    tokens.refreshToken(req.headers.ctpeuatoken,  req.ip || devInfo.ip, res, (tData) => {
      const tv = euSubmsnsCvs.tokenVldn(tData);
      if (tv.flag) {
        euSubmsnsSrvc.putEuSubmsnUpdate(req, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else {
        util.sendApiRes(res, tv.result);
      }
    });
  } else {
    util.sendApiRes(res, vds.result);
  }
}

const getEuSubmsnStsHistory = (req, res) => {
  const vds = euSubmsnsCvs.viewVldn(req);
  if (vds.flag) {
    const devInfo = JSON.parse(req.headers.ctpeuua);
    tokens.refreshToken(req.headers.ctpeuatoken,  req.ip || devInfo.ip, res, (tData) => {
      const tv = euSubmsnsCvs.tokenVldn(tData);
      if (tv.flag) {
        euSubmsnsSrvc.getEuSubmsnStsHistory(req.params.recordid, tData.tokenData, (resObj) => {
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else {
        util.sendApiRes(res, tv.result);
      }
    });
  } else {
    util.sendApiRes(res, vds.result);
  }
}

const putSubDataUpdate = (req, res) => {
  const body = req.body.data;
  const vds = euSubmsnsCvs.subUpdtVldn(req);  
  if (vds.flag) {
   const tData = tokens.userTokenDecode(req.headers.ctpeuatoken);
      const tv = euSubmsnsCvs.tokenVldn(tData);  
      if (tv.flag) {
        euSubmsnsSrvc.putSubDataUpdate(body, tData.tokenData, (resObj) => {          
          const apiRes = {...resObj, userObj: tData?.data};
          util.sendApiRes(res, apiRes);
        });
      } else {
        util.sendApiRes(res, tv.result);
      }
  } else {
    util.sendApiRes(res, vds.result);
  }
}

const postSubmsnPriCreate = (req, res) => {
  const vds = euSubmsnsCvs.subPrtUpdtVldn(req);  
  if (vds.flag) {
    const tData =  tokens.userTokenDecode(req.headers.ctpeuatoken);
    const tv = euSubmsnsCvs.tokenVldn(tData);      
    if (tv.flag) {
      euSubmsnsSrvc.postSubmsnPriCreate(req.params.id, req.body, tData.tokenData, (resObj) => {
        const apiRes = { ...resObj, userObj: tData?.data };
        util.sendApiRes(res, apiRes);
      });
    } else {
      util.sendApiRes(res, tv.result);
    }
  } else {
    util.sendApiRes(res, vds.result);
  }
}

module.exports = {
  apiServerStatus, getEuSubmsnsList, postEuSubmsnCreate, getEuSubmsnView, 
  putEuSubmsnStatusUpdate, putEuSubmsnUpdate, getEuSubmsnStsHistory, putSubDataUpdate,
  postSubmsnPriCreate
};
