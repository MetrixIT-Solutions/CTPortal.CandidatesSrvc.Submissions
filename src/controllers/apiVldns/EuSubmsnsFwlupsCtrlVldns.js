/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const SetRes = require('../../SetRes');

const euSubFwlsCreate = (req) => {
  const reqBody = req.body;
  if (!req.headers.ctpeuatoken) {
    const tr = SetRes.tokenRequired();
    return { flag: false, result: tr };
  } else if (!req.headers.ctpeuua){
    const hr = SetRes.headersRequired();
    return {flag: false, result: hr};
  } else {
    const data = euSubVldnData(reqBody)
    if (!data) {
      const mandatory = SetRes.mandatory();
      return { flag: false, result: mandatory };
    } else {
      return { flag: true };
    }
  }
}

const euSubFwlsList = (req) => {
  if (!req.headers.ctpeuatoken) {
    const te = SetRes.tokenRequired();
    return { flag: false, result: te };
  } else if (!req.headers.ctpeuua){
    const hr = SetRes.headersRequired();
    return {flag: false, result: hr};
  } else if (!req.params.subId) {
    const ad = SetRes.mandatory();
    return { flag: false, result: ad };
  } else {
    return { flag: true };
  }
}

const euSubFwlsUpdate = (req) => {
  const reqBody = req.body;
  if (!req.headers.ctpeuatoken) {
    const tr = SetRes.tokenRequired();
    return { flag: false, result: tr };
  } else if (!req.headers.ctpeuua){
    const hr = SetRes.headersRequired();
    return {flag: false, result: hr};
  } else {
    if (!reqBody.notes && !req.params.recordId) {
      const mandatory = SetRes.mandatory();
      return { flag: false, result: mandatory };
    } else {
      return { flag: true };
    }
  }
}

module.exports = {
  euSubFwlsCreate, euSubFwlsList, euSubFwlsUpdate  
};

const euSubVldnData = (reqBody) => {
  if (!reqBody.submission && !reqBody.subId && !reqBody.euUser && !reqBody.euName && !reqBody.notes) {
    return false;
  } else {
    return true;
  }
}