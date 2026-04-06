/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const SetRes = require('../../SetRes');

const tokenVldn = (tData) => {
  if (!tData) {
    const result = SetRes.tokenInvalid();
    return { flag: false, result };
  } else if (tData.isExpired) {
    const result = SetRes.tokenExpired();
    return { flag: false, result };
  } else if (!tData.tokenData) {
    const result = SetRes.tokenSsnErr();
    return { flag: false, result };
  } else {
    return { flag: true, result: tData.tokenData };
  }
}

const listVldn = (req) => {
  const reqBody = req.body;
  if (!req.headers.ctpeuatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.headers.ctpeuua){
    const hr = SetRes.headersRequired();
    return {flag: false, result: hr};
  } else if (!reqBody.pgNum || !reqBody.limit) {
    const mn = SetRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

const createVldn = (req) => {
  const reqBody = req.body;
  const bv = bodyValidation(reqBody);
  if (!req.headers.ctpeuatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.headers.ctpeuua){
    const hr = SetRes.headersRequired();
    return {flag: false, result: hr};
  } else if (!bv || !reqBody.sStatus) {
    const mn = SetRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

const viewVldn = (req) => {
  if (!req.headers.ctpeuatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.headers.ctpeuua){
    const hr = SetRes.headersRequired();
    return {flag: false, result: hr};
  } else if (!req.params.recordid) {
    const mn = SetRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

const statusVldn = (req) => {
  if (!req.headers.ctpeuatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.headers.ctpeuua){
    const hr = SetRes.headersRequired();
    return {flag: false, result: hr};
  } else if (!req.params.recordid || !req.body.status) {
    const mn = SetRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

const updateVldn = (req) => {
  const reqBody = req.body;
  const bv = bodyValidation(reqBody);
  if (!req.headers.ctpeuatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.headers.ctpeuua){
    const hr = SetRes.headersRequired();
    return {flag: false, result: hr};
  } else if (!req.params.recordid || !bv) {
    const mn = SetRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

const subUpdtVldn = (req) => {
  const reqBody = req.body.data;  
  if (!req.headers.ctpeuatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if(!reqBody._id || !reqBody.name || !reqBody.mobCcNum){
    const mn = SetRes.mandatory();
    return { flag: false, result: mn };
  }  else {
    return { flag: true };
  }
}

const subPrtUpdtVldn = (req) => {
  if (!req.headers.ctpeuatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.params.id) {
    const mn = SetRes.mandatory();
    return { flag: false, result: mn };
  } else {
    return { flag: true };
  }
}

module.exports = {
  tokenVldn, listVldn, createVldn, viewVldn, statusVldn, updateVldn, subUpdtVldn, subPrtUpdtVldn
};

const bodyValidation = (body) => {
  if (body.sDt && body.sDtStr && body.jobTitle && body.jobDesc && body.skills && body.vType && body.vName && body.vcPerson && body.vcMobCc && body.vcMobNum && body.vcMobCcNum && body.vcEmail && body.city) {
    return true
  } else {
    return false
  }
}
