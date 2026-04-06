/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const { v4: uuidv4 } = require('uuid');
const cs = require('../../services/CommonSrvc');
const B2BEuSubmissionFollowups = require('../../schemas/B2BEuSubmissionFollowups');
const { uType } = require('../../consts/EuSubmsnsConsts.json');

const euSubFwlsCreate = (reqBody, tData) => {
  const data = setSubFwlsData(reqBody, tData);
  const setData = new B2BEuSubmissionFollowups(data);
  return setData;
}

const getQuery = (subId, tData) => {
  return { submission: subId, b2b: tData.b2b, delFlag: false };
}

const euSubFwlsUpdate = (_id, reqBody, tData) => {  
  const curUtc = cs.currUTCObj();
  const query = { _id, delFlag: false, b2b: tData.b2b };

  const updateObj = {
    notes: reqBody.notes,

    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr
  };

  return { query, updateObj };
}
module.exports = {
  euSubFwlsCreate, getQuery, euSubFwlsUpdate
};

const setSubFwlsData = (reqBody, tData) => {
  const curUtc = cs.currUTCObj();
  
  const cCode = reqBody.countryCode ? reqBody.countryCode : '';
  const sCode = reqBody.stateCode ? reqBody.stateCode : '';
  return {
    _id: uuidv4(),

    idSeq: {
      seq: cCode + sCode + curUtc.currUTCYear + curUtc.currUTCMnt + curUtc.currUTCDay,
      cCode, sCode,
      year: curUtc.currUTCYear,
      month: curUtc.currUTCMnt,
      day: curUtc.currUTCDay
    },

    submission: reqBody.submission,
    subId: reqBody.subId,
    euUser: reqBody.euUser,
    euName: reqBody.euName,
    cUId: tData.uid,
    // intrw: reqBody.euIntrw || '',
    // intrwId: reqBody.euIntrwId || '',
    b2b: tData.b2b,
    b2bName: tData.bn,
    b2bCode: tData.bc,

    // org: reqBody.org || '',
    // orgName: reqBody.orgName || '',
    // orgCode: reqBody.orgCode || '',
    // obId: reqBody.obId || '',
    // obName: reqBody.obName || '',
    // obCode: reqBody.obCode || '',
    // team: reqBody.team || '',
    // tName: reqBody.tName || '',
    // tCode: reqBody.tCode || '',

    notes: reqBody.notes,

    cuType: uType,
    cUser: tData.iss,
    cuName: tData.fn + ' ' + tData.ln,
    cDate: curUtc.currUTCDtTm,
    cDtStr: curUtc.currUTCDtTmStr,
    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr
  };
}