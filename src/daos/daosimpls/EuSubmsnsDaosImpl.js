/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

var { v4: uuidv4 } = require('uuid');

const cs = require('../../services/CommonSrvc');
const { uType, status } = require('../../consts/EuSubmsnsConsts.json');
const bEuSubmsns = require('../../schemas/B2BEuSubmissions');
const bEuSubmsnsLcs = require('../../schemas/B2BEuSubmissionsLcs');

const euSubmsnsListQuery = (reqBody, tData) => {
  return setListQuery(reqBody, tData);
}

const euSubmsnsCreateQuery = (reqBody, tData, b2bUsrData) => {
  const cObj = setCreateSubmsnData(reqBody, tData, b2bUsrData);
  const createObj = new bEuSubmsns(cObj);
  const submission = cObj._id;
  const lcObj = { ...cObj, submission };
  const lfycObj = new bEuSubmsnsLcs(lcObj);
  return { createObj, lfycObj };
}

const euSubmsnViewQuery = (_id, tData) => {
  return { delFlag: false, _id, b2b: tData.b2b }
}

const putEuSubmsnStatusUpdate = (reqBody, tData) => {
  const curUtc = cs.currUTCObj();
  const intrw = reqBody.intrw ? {intrw: reqBody.intrw} : {};
  const intrwId = reqBody.intrwId ? {intrwId: reqBody.intrwId} : {};
  const sNotes = reqBody.sNotes ? {sNotes: reqBody.sNotes} : {};
  return {
    ...intrw,
    ...intrwId,
    ...sNotes,
    sStatus: reqBody.status,
    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  }
}

const putEuSubmsnUpdateObj = (reqBody, tData) => {
  return setSubmsnUpdateData(reqBody, tData);
}

const setVendorCreateObj = (reqBody, tData) => {
  return setVendorData(reqBody, tData)
}

const eusubHstrQry = (submission, tData) => {
  return {delFlag: false, b2b: tData.b2b, submission};
}

const subStsData = (reqBody, sNotes, tData) => {
  return setSubStsData(reqBody, sNotes, tData);
}

const euUsrSubUpdate = (reqBody, tData) => {
  const curUtc = cs.currUTCObj();

  const query = {euUser: reqBody._id, b2b: tData.b2b, delFlag: false };

  const updtObj = {
    euName: reqBody.name,
    // euPrimary: reqBody.myPrimary,
    canName: reqBody.name,
    // canEmail: reqBody.emID,
    canPhNum: reqBody.mobCcNum,

    uuType: uType,
    uUser:  tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate:  curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr
  };

  return { query, updtObj };
}

const setPrtQuery = (_id, reqBody, tData) => {
  const curUtc = cs.currUTCObj();
  const query = { _id, b2b: tData.b2b, euUser: tData.iss, delFlag: false };
  const setPrtObj = {
    priority: reqBody.priority,
    uuType: uType, uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr
  };
  return { query, setPrtObj };
}

module.exports = {
  euSubmsnsListQuery, euSubmsnsCreateQuery, euSubmsnViewQuery,
  putEuSubmsnStatusUpdate, putEuSubmsnUpdateObj, setVendorCreateObj,
  eusubHstrQry, subStsData, euUsrSubUpdate, setPrtQuery
}

const setListQuery = (reqBody, tData) => {
  const searchStr = reqBody.searchStr || '';
  const status = reqBody.status && reqBody.status.length ? { sStatus: { $in: reqBody.status } } : {};
  const matchQuery = {
    delFlag: false,
    euUser: tData.iss,
    b2b: tData.b2b,
    ...status,
    $or: [
      { 'euName': { $regex: searchStr, $options: 'i' } },
      { 'jobTitle': { $regex: searchStr, $options: 'i' } },
      { 'vName': { $regex: searchStr, $options: 'i' } },
      { 'subId': { $regex: searchStr, $options: 'i' } },
      { 'intrwId': { $regex: searchStr, $options: 'i' } },
    ]
  };
  var countQuery = [
    {
      $match: { delFlag: false, euUser: tData.iss, b2b: tData.b2b }
    },
    { $group: { _id: '$sStatus', count: { $sum: 1 } } }
  ]
  return { matchQuery, countQuery };
}

const setCreateSubmsnData = (reqBody, tData, b2bUsrData) => {
  const curUtc = cs.currUTCObj();
  const year = curUtc.currUTCYear - (curUtc.currUTCYear - 1);
  const day = curUtc.currUTCDayOfYear;
  const cuTmInScnds = curUtc.time;
  const subId = tData.fn.charAt(0) + tData.ln.charAt(0) + year + day + 'S' + cuTmInScnds;
  const b2bUsers = [{ _id: b2bUsrData._id, uName: b2bUsrData.name, uRole: b2bUsrData.userRole }];
  return {
    _id: uuidv4(),
    idSeq: {
      seq: curUtc.currUTCYear + curUtc.currUTCMnt + curUtc.currUTCDay,
      year: curUtc.currUTCYear,
      month: curUtc.currUTCMnt,
      day: curUtc.currUTCDay
    },
    euUser: tData.iss,
    euName: tData.fn + ' ' + tData.ln,
    euPrimary: tData.mp,
    euRefID: tData.uid,
    lead: reqBody.lead,
    leadId: reqBody.leadId,
    intrw: reqBody.intrw || '',
    intrwId: reqBody.intrwId || '',
    b2b: tData.b2b,
    b2bName: tData.bn,
    b2bCode: tData.bc,
    
    org: tData.org,
    orgName: tData.on,
    orgCode: tData.oc,
    team: tData.ot,
    tName: tData.otn,
    tCode: tData.otc,
    obId: reqBody.obId || '',
    obName: reqBody.obName || '',
    obCode: reqBody.obCode || '',

    b2bUser: b2bUsrData._id,
    b2buName: b2bUsrData.name,
    b2buRole: b2bUsrData.userRole,
    b2bUsers,

    pReports: reqBody. pReports || [],

    sDt: reqBody.sDt,
    sDtStr: reqBody.sDtStr,
    canName: tData.fn + ' ' + tData.ln,
    canPhNum: tData.mn,
    canEmail: tData.eid,
    jobTitle: reqBody.jobTitle,
    jobId: reqBody.jobId || '',
    jobDesc: reqBody.jobDesc,
    skills: reqBody.skills,

    sStatus: reqBody.sStatus,
    sNotes: reqBody.sNotes || '',
    jobLoc: reqBody.city,

    vType: reqBody.vType,
    vName: reqBody.vName,
    vCode: reqBody.vCode || '',
    vcPerson: reqBody.vcPerson,
    vcMobCc: reqBody.vcMobCc,
    vcMobNum: reqBody.vcMobNum,
    vcMobCcNum: reqBody.vcMobCcNum,
    vcEmail: reqBody.vcEmail,
    vClient: reqBody.vClient || '',
    pvipType: reqBody.pvipType || '',
    pvipName: reqBody.pvipName || '',
    pvipcPerson: reqBody.pvipcPerson || '',
    pvipcMobCc: reqBody.pvipcMobCc || '',
    pvipcMobNum: reqBody.pvipcMobNum || '',
    pvipcMobCcNum: reqBody.pvipcMobCcNum || '',
    pvipcEmail: reqBody.pvipcEmail || '',

    sBy: uType,
    subId,

    prHr: reqBody.prHr || '',
    prNotes: reqBody.prNotes || '',
    prfPath: reqBody.prfPath || '',

    visaStatus: reqBody.visaStatus || '',
    tExp: reqBody.tExp || '',
    primSkills: reqBody.primSkills || '',
    wrkUrls: reqBody.wrkUrls || [],
    wrkAuthExpDtStr: reqBody.wrkAuthExpDtStr || '',
    usaNatID: reqBody.usaNatID || '',
    unidType: reqBody.unidType || '',
    unidExpDtStr: reqBody.unidExpDtStr || '',
    resState: reqBody.resState || '',
    resScode: reqBody.resScode || '',
    certificates: reqBody. certificates || [],

    hNum: reqBody.hNum || '',
    area: reqBody.area || '',
    zip: reqBody.zip || '',
    state: reqBody.state,
    sCode: reqBody.sCode,
    city: reqBody.city,
    cityCode: reqBody.cityCode || '',
    country: reqBody.country,
    cCode: reqBody.cCode,

    mVisaStatus: reqBody.mVisaStatus || '',  
    mEmail: reqBody.mEmail || '',
    mMobCc: reqBody.mMobCc || '',
    mMobNum: reqBody.mMobNum || '',
    mTexp: reqBody.mTexp || 0,
    mPrimSkills: reqBody.mPrimSkills || '',
    mCurrClient: reqBody.mCurrClient || '',
    mPrevClient: reqBody.mPrevClient || '',
    mWrkUrls: reqBody.mWrkUrls || [],
    mWrkAuthExpDtStr: reqBody.mWrkAuthExpDtStr || '',
    mUsaNatID: reqBody.mUsaNatID || '', 
    mUnidType: reqBody.mUnidType || '',
    mUnidExpDtStr: reqBody.mUnidExpDtStr || '',
    mState: reqBody.mState || '',
    mSCode: reqBody.mSCode || '',
    mJobTitle: reqBody.mJobTitle || '',
    mCertificates: reqBody.mCertificates || [],

    prBy: reqBody.prBy == 'Self' ? tData.iss : reqBody.prBy, 
    prByName: reqBody.prBy == 'Self' ?  tData.fn + ' ' + tData.ln : reqBody.prBy, 
    prByrefUID: reqBody.prBy == 'Self' ? tData.uid : reqBody.prByrefUID, 
    prByPrimary: reqBody.prBy == 'Self' ? tData.mp : reqBody.prByPrimary, 

    ua: reqBody.ua,

    isVrfd: reqBody.isVrfd || false, 
    vrfyNts: reqBody.vrfyNts || '',  
    
    cuType: uType,
    cUser: tData.iss,
    cuName: tData.fn + ' ' + tData.ln,
    cDate: curUtc.currUTCDtTm,
    cDtStr: curUtc.currUTCDtTmStr,
    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  }
}

const setSubmsnUpdateData = (reqBody, tData) => {
  const curUtc = cs.currUTCObj();
  return {
    sDt: reqBody.sDt,
    sDtStr: reqBody.sDtStr,
    jobTitle: reqBody.jobTitle,
    jobId: reqBody.jobId || '',
    jobDesc: reqBody.jobDesc,
    skills: reqBody.skills,

    sNotes: reqBody.sNotes || '',
    jobLoc: reqBody.city,

    vType: reqBody.vType,
    vName: reqBody.vName,
    vCode: reqBody.vCode || '',
    vcPerson: reqBody.vcPerson,
    vcMobCc: reqBody.vcMobCc,
    vcMobNum: reqBody.vcMobNum,
    vcMobCcNum: reqBody.vcMobCcNum,
    vcEmail: reqBody.vcEmail,
    vClient: reqBody.vClient || '',
    pvipType: reqBody.pvipType || '',
    pvipName: reqBody.pvipName || '',
    pvipcPerson: reqBody.pvipcPerson || '',
    pvipcMobCc: reqBody.pvipcMobCc || '',
    pvipcMobNum: reqBody.pvipcMobNum || '',
    pvipcMobCcNum: reqBody.pvipcMobCcNum || '',
    pvipcEmail: reqBody.pvipcEmail || '',

    hNum: reqBody.hNum || '',
    area: reqBody.area || '',
    zip: reqBody.zip || '',
    state: reqBody.state,
    sCode: reqBody.sCode,
    city: reqBody.city,
    cityCode: reqBody.cityCode || '',
    country: reqBody.country,
    cCode: reqBody.cCode,

    prBy: reqBody.prBy == 'Self' ? tData.iss : reqBody.prBy, 
    prByName: reqBody.prBy == 'Self' ?  tData.fn + ' ' + tData.ln : reqBody.prByName, 
    prByrefUID: reqBody.prBy == 'Self' ? tData.uid : reqBody.prByrefUID, 
    prByPrimary: reqBody.prBy == 'Self' ? tData.mp : reqBody.prByPrimary, 

    isVrfd: false, 

    uuType: uType,
    uUser: tData.iss,
    uuName: tData.fn + ' ' + tData.ln,
    uDate: curUtc.currUTCDtTm,
    uDtStr: curUtc.currUTCDtTmStr,
  }
}

const setVendorData = (reqBody, tData) => {
  const curUtc = cs.currUTCObj();

  return {
    _id: uuidv4(),
    idSeq: {
      seq: curUtc.currUTCYear + curUtc.currUTCMnt + curUtc.currUTCDay,
      year: curUtc.currUTCYear,
      month: curUtc.currUTCMnt,
      day: curUtc.currUTCDay
    },

    b2b: tData.b2b,
    b2bName: tData.bn,
    b2bCode: tData.bc,

    org: tData.org,
    orgName: tData.on,
    orgCode: tData.oc,
    team: tData.ot,
    tName: tData.otn,
    tCode: tData.otc,
    obId: reqBody.obId || '',
    obName: reqBody.obName || '',
    obCode: reqBody.obCode || '',

    vType: reqBody.vType,
    vName: reqBody.vName,
    vCode: reqBody.vName,
    vcPerson: reqBody.vcPerson,
    vcMobCc: reqBody.vcMobCc,
    vcMobNum: reqBody.vcMobNum,
    vcMobCcNum: reqBody.vcMobCcNum,
    vcEmail: reqBody.vcEmail,
    vStatus: status,
    vClient: reqBody.vClient || '',
    pvipType: reqBody.pvipType || '',
    pvipName: reqBody.pvipName || '',
    pvipcPerson: reqBody.pvipcPerson || '',
    pvipcMobCc: reqBody.pvipcMobCc || '',
    pvipcMobNum: reqBody.pvipcMobNum || '',
    pvipcMobCcNum: reqBody.pvipcMobCcNum || '',
    pvipcEmail: reqBody.pvipcEmail || '',

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
  }
}

const setSubStsData = (body, sNotes, tData) => {
  const curUtc = cs.currUTCObj();

  return {
    _id: uuidv4(),
    submission: body._id,
    subId: body.subId,
    euUser: body.euUser,
    euName: body.euName,
    euPrimary: body.euPrimary,
    euRefID: body.euRefID,
    lead: body.lead,
    leadId: body.leadId,
    intrw: body.intrw,
    intrwId: body.intrwId,
    b2b: body.b2b,
    b2bName: body.b2bName,
    b2bCode: body.b2bCode,
    org: body.org,
    orgName: body.orgName,
    orgCode: body.orgCode,

    sDt: body.sDt,
    sDtStr: body.sDtStr,
    canName: body.canName,
    canPhNum: body.canPhNum,
    canEmail: body.canEmail,
    jobTitle: body.jobTitle,
    jobId: body.jobId,
    jobDesc: body.jobDesc,
    skills: body.skills,

    sStatus: body.sStatus,
    sNotes,
    jobLoc: body.jobLoc,

    isVrfd: body.isVrfd,
    vrfyNts: body.vrfyNts,
    isVrfdOfs: body.isVrfdOfs,
    vrfyNtsOfs: body.vrfyNtsOfs,

    cuType: uType,
    cUser: tData.iss,
    cuName: tData.fn + ' ' + tData.ln,
    cuRefID: tData.uid,
    cuRole: 'Consultant',
    cDate: curUtc.currUTCDtTm,
    cDtStr: curUtc.currUTCDtTmStr
  }
}