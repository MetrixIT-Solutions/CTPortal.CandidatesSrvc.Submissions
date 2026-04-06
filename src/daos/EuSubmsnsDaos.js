/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

const SetRes = require('../SetRes');
const B2BEuSubmissions = require('../schemas/B2BEuSubmissions');
const B2BEuSubmissionsStsLcs = require('../schemas/B2BEuSubmissionsStsLcs');
const logger = require('../lib/logger');
const { uniq } = require('../consts/EuSubmsnsConsts.json')

const getEuSubmsnsList = (query, body, callback) => {
  const { pgNum, limit } = body;
  let resultObj = { submsnsListCount: 0, submsnsList: [] };
  B2BEuSubmissions.find(query).skip((pgNum - 1) * limit).limit(limit).sort({ sDtStr: -1, uDtStr: -1 }).then((resObj) => {
    if (resObj && resObj.length > 0) {
      submsnsTotalCount(query, resObj, callback);
    } else {
      const noData = SetRes.noData(resultObj);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/EuSubmsnsDaos.js, at getEuSubmsnsList:' + error);
    const err = SetRes.unKnownErr(resultObj);
    callback(err);
  });
}

const submsnsAggregateQuery = (query, callback) => {
  B2BEuSubmissions.aggregate(query).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/EuSubmsnsDaos.js, at submsnsAggregateQuery:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}

const postEuSubmsnCreate = (createObj, callback) => {
  createObj.save().then((resObj) => {
    if (resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const sf = SetRes.createFailed({});
      callback(sf);
    }
  }).catch((error) => {
    if (error.keyPattern && error.keyPattern.subId) {
      logger.error('Uniqueness(subId) Error in daos/EuSubmsnsDaos.js, at postEuSubmsnCreate:' + error);
      const err = SetRes.uniqueErr(uniq.subIdErr);
      callback(err);
    } else {
      logger.error('Un-known Error in daos/EuSubmsnsDaos.js, at postEuSubmsnCreate:' + error);
      const err = SetRes.unKnownErr({});
      callback(err);
    }
  });
}

const getEuSubmsnView = (query, callback) => {
  B2BEuSubmissions.findOne(query).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData({});
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/EuSubmsnsDaos.js, at getEuSubmsnView:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  });
}

const putEuSubmsnUpdate = (query, updateObj, callback) => {
  B2BEuSubmissions.findOneAndUpdate(query, updateObj, { new: true }).then((resObj) => {
    if (resObj && resObj._id) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const uf = SetRes.updateFailed({});
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/EuSubmsnsDaos.js, at putEuSubmsnUpdate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

const getEuSubmsnStsHistory = (query, callback) => {
  B2BEuSubmissionsStsLcs.find(query).sort({cDtStr: -1}).then((resObj) => {
    if (resObj && resObj.length > 0) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const noData = SetRes.noData([]);
      callback(noData);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/EuSubmsnsDaos.js, at getEuSubmsnStsHistory:' + error);
    const err = SetRes.unKnownErr([]);
    callback(err);
  });
}

const profileSubUpdate = (query, updateObj, callback) => {
  B2BEuSubmissions.updateMany(query, updateObj, { new: true }).then((resObj) => {            
    if (resObj) {
      const result = SetRes.successRes(resObj);
      callback(result);
    } else {
      const uf = SetRes.updateFailed([]);
      callback(uf);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/EuSubmsnsDaos.js, at profileSubUpdate:' + error);
    const err = SetRes.unKnownErr({});
    callback(err);
  })
}

module.exports = {
  getEuSubmsnsList, submsnsAggregateQuery, postEuSubmsnCreate, getEuSubmsnView, putEuSubmsnUpdate,
  getEuSubmsnStsHistory, profileSubUpdate
};

const submsnsTotalCount = (query, resObj, callback) => {
  let resultObj = { submsnsListCount: resObj.length, submsnsList: resObj };
  B2BEuSubmissions.countDocuments(query).then((resultCount) => {
    if (resultCount) {
      resultObj = { submsnsListCount: resultCount, submsnsList: resObj };
      const result = SetRes.successRes(resultObj);
      callback(result);
    } else {
      const result = SetRes.successRes(resultObj);
      callback(result);
    }
  }).catch((error) => {
    logger.error('Un-known Error in daos/EuSubmsnsDaos.js, at submsnsTotalCount:' + error);
    const result = SetRes.successRes(resultObj);
    callback(result);
  });
}
