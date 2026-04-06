/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const async = require('async');
const moment = require('moment');
var config = require('config');
const mail = require('../../../config/mail');
const ApiCalls = require('../../Apicalls');

const EuSubmsnsDaos = require('../../daos/EuSubmsnsDaos');
const bEuSubStsLc = require('../../schemas/B2BEuSubmissionsStsLcs');
const SetRes = require('../../SetRes');
const logger = require('../../lib/logger');

const getEuSubmsnsListWithAsync = (matchQuery, countQuery, reqBody, callback) => {
  async.parallel([
    function (cb1) {
      EuSubmsnsDaos.getEuSubmsnsList(matchQuery, reqBody, (resObj1) => {
        cb1(null, resObj1.resData.result);
      });
    },
    function (cb2) {
      EuSubmsnsDaos.submsnsAggregateQuery(countQuery, (resObj2) => {
        cb2(null, resObj2.resData.result);
      });
    },
  ], function (err, result) {
    if (err) {
      logger.error('There was an Un-known Error occured in daos/EuSumsnsSrvcImpls.js' + 'at getEuSubmsnsListWithAsync:' + err);
    }
    let resArr = {}
    if (result) {
      resArr = { submsnsListCount: result[0].submsnsListCount, submsnsList: result[0].submsnsList, submsnsCountByStatus: result[1] }
    } else {
      resArr = { submsnsListCount: result[0].submsnsListCount, submsnsList: result[0].submsnsList, submsnsCountByStatus: result[1] };
    }
    callback(SetRes.successRes(resArr));
  });
}

const sendEmailLink = (reqBody, resData, tData) => {
  const recData = reqBody.ua && reqBody.ua.length ? reqBody.ua.filter(item => (item.role == 'Recruiter')) : {};
  const sdt = moment(reqBody.sDt).format('DD MMM, YYYY');
  let mailSub = `Candiadate Submission - ${resData.subId}`;
  let mh = `<p>You have received a new job holder submission. Below are the details of the submission:</p>`;
  let nm = `<p>Submitted By: <b>${resData.canName}</b></p>`;
  let subId = `<p>Submission ID: <b>${resData.subId}</b></p>`;
  let subDt = `<p>Submission Date: <b>${sdt}</b></p>`;
  let jt = `<p>Email: <b>${resData.canEmail}</b></p>`;
  let jd = `<p>Job Title: <b>${reqBody.jobTitle}</b></p>`;
  let sk = `<p>Key Skills: <b>${reqBody.skills}</b></p>`;
  let lcn = `<p>Job location: <b>${reqBody.city}, ${reqBody.state}, ${reqBody.country}</b></p>`;
  let mcf = `<p>Thank you,</p>`;
  const htmlContent1 = `${mh} ${nm} ${subId} ${subDt} ${jt} ${jd} ${sk}  ${lcn} ${mcf}`
  recData && recData.length && recData.forEach(item => sendSubMail(item.emID, item.name, mailSub, htmlContent1, tData));
}

const createSubStatusData = (data) => {
  const createData = new bEuSubStsLc(data);
  EuSubmsnsDaos.postEuSubmsnCreate(createData, resObj => {})
}

module.exports = {
  getEuSubmsnsListWithAsync, sendEmailLink, createSubStatusData
};

const sendSubMail = (email, name, mailSub, content, tData) => {
  let gr = `<p>Dear ${name},</b></p>`;
  const htmlContent = `${gr} ${content}`;
  const body = { org: tData.org, b2b: tData.b2b };
  ApiCalls.getSmtpDetails(body, (err, resObj) => {
    if (resObj && resObj.status == '200') {
      const data = resObj.resData.result;
      if (data.smtp && data.smtpPort && data.senderMail && data.senderMailPswd && data.from) {
        const smtpData = { service: data.service, host: data.smtp, port: data.smtpPort, user: data.senderMail, pass: data.senderMailPswd, from: data.from };
        mail.sendEMail(email, mailSub, htmlContent, smtpData, resObj => { });
      } else {
        const smtpData = { service: 'gmail', host: config.smtp, port: config.smtpPort, user: config.senderMail, pass: config.senderMailPswd, from: config.from };
        mail.sendEMail(email, mailSub, htmlContent, smtpData, resObj => { });
      }
    } else {
      const smtpData = { service: 'gmail', host: config.smtp, port: config.smtpPort, user: config.senderMail, pass: config.senderMailPswd, from: config.from };
      mail.sendEMail(email, mailSub, htmlContent, smtpData, resObj => { });
    }
  });
}