/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

const subFwlsDaoImpl = require('../daos/daosimpls/EuSubmsnsFwlpsDaosImpl');
const subFwlpsDao = require('../daos/EuSubmsnsFwlpsDaos');

const euSubFwlsCreate = (reqBody, tData, callback) => {
  const crtFlwsObj = subFwlsDaoImpl.euSubFwlsCreate(reqBody, tData);
  subFwlpsDao.commonCreateFunc(crtFlwsObj, callback);
}

const euSubFwlsList = (subId, tData, callback) => {  
  const query = subFwlsDaoImpl.getQuery(subId, tData);
  subFwlpsDao.euSubFwlsList(query, callback);
}

const euSubFwlsUpdate = (id, reqBody, tData, callback) => {
  const updtObj = subFwlsDaoImpl.euSubFwlsUpdate(id, reqBody, tData);
  subFwlpsDao.euSubFwlsUpdate(updtObj.query, updtObj.updateObj, callback);
}

module.exports = {
  euSubFwlsCreate, euSubFwlsList, euSubFwlsUpdate
};
