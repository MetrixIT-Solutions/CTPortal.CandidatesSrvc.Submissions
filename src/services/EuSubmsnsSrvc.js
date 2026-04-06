/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

var { v4: uuidv4 } = require('uuid');

const euSubmsnsDaosImpl = require('../daos/daosimpls/EuSubmsnsDaosImpl');
const euSubmsnsSrvcImpl = require('./srvcimpls/EuSubmsnsSrvcImpl');
const euSubmsnsDaos = require('../daos/EuSubmsnsDaos');
const Apicalls = require('../Apicalls');
const SetRes = require('../SetRes');
const bEuSubmsnsLcs = require('../schemas/B2BEuSubmissionsLcs');

const getEuSubmsnsList = (reqBody, tData, callback) => {
  const obj = euSubmsnsDaosImpl.euSubmsnsListQuery(reqBody, tData);
  euSubmsnsSrvcImpl.getEuSubmsnsListWithAsync(obj.matchQuery, obj.countQuery, reqBody, callback);
}

const postEuSubmsnCreate = (reqBody, tData, callback) => {
  Apicalls.getB2bUserData(reqBody.cUser, (err, resObj) => {
    if (resObj.status == '200') {
      const obj = euSubmsnsDaosImpl.euSubmsnsCreateQuery(reqBody, tData.tokenData, resObj.resData.result);      
      euSubmsnsDaos.postEuSubmsnCreate(obj.createObj, (resObj1) => {
        if (resObj1.status == '200') {
          euSubmsnsDaos.postEuSubmsnCreate(obj.lfycObj, (resObj2) => { });
          const subData = Object.assign({}, resObj1.resData.result.toObject());
          const data1  ={...subData, nTitle: 'Submission Created', nMessage: resObj1.resData.result.canName + ' submission('+resObj1.resData.result.subId+') has been created, please review', nFrom: 'Submissions'};
          resObj1.resData.result.sStatus === 'Submitted' &&  Apicalls.notificationCreate(data1, (err, resData) =>{});
          euSubmsnsSrvcImpl.sendEmailLink(reqBody, resObj1.resData.result, tData.tokenData)
          const data = euSubmsnsDaosImpl.setVendorCreateObj(reqBody, tData.tokenData);
          Apicalls.createVendor(data, (err, resObj3) => {});
          const subStsData = euSubmsnsDaosImpl.subStsData(resObj1.resData.result, reqBody.sNotes, tData.tokenData);
          euSubmsnsSrvcImpl.createSubStatusData(subStsData);
        }
        callback(resObj1);
      });
    } else {
      callback(SetRes.createFailed({}));
    }
  });
}

const getEuSubmsnView = (id, tData, callback) => {
  const query = euSubmsnsDaosImpl.euSubmsnViewQuery(id, tData);
  euSubmsnsDaos.getEuSubmsnView(query, callback)
}

const putEuSubmsnStatusUpdate = (req, tData, callback) => {
  const query = euSubmsnsDaosImpl.euSubmsnViewQuery(req.params.recordid, tData);
  const upObj = euSubmsnsDaosImpl.putEuSubmsnStatusUpdate(req.body, tData);
  euSubmsnsDaos.putEuSubmsnUpdate(query, upObj, callback);
}

const putEuSubmsnUpdate = (req, tData, callback) => {
  const query = euSubmsnsDaosImpl.euSubmsnViewQuery(req.params.recordid, tData);
  const upObj = euSubmsnsDaosImpl.putEuSubmsnUpdateObj(req.body, tData);
  euSubmsnsDaos.putEuSubmsnUpdate(query, upObj, (resObj) => {
    if (resObj.status == '200') {
      const data = Object.assign({}, resObj.resData.result.toObject());
      const data1 = { ...data, _id: uuidv4(), submission: resObj.resData.result._id };
      const crObj = new bEuSubmsnsLcs(data1);
      euSubmsnsDaos.postEuSubmsnCreate(crObj, (resObj1) => { });
      const updateData = Object.assign({}, resObj.resData.result.toObject());
      const setUpData = {...updateData, nTitle: 'Submission Modified', nMessage: updateData.canName + ' submission('+updateData.subId+') has been modified, please review', nFrom: 'Submissions'};
      resObj.resData.result.sStatus === 'Submitted' &&  Apicalls.notificationCreate(setUpData,  (err, resData) =>{});
      const reqData = euSubmsnsDaosImpl.setVendorCreateObj(req.body, tData);
      Apicalls.createVendor(reqData, (err, resObj3) => {});
      const subStsData = euSubmsnsDaosImpl.subStsData(resObj.resData.result, 'Submission modified', tData);
      euSubmsnsSrvcImpl.createSubStatusData(subStsData);
      setTimeout(() => {
        const reSubstsData = euSubmsnsDaosImpl.subStsData(resObj.resData.result, 'Resubmitted', tData);
        euSubmsnsSrvcImpl.createSubStatusData(reSubstsData);
      }, 1100)
    }
    callback(resObj);
  });
}

const getEuSubmsnStsHistory = (id, tData, callback) => {
  const qry = euSubmsnsDaosImpl.eusubHstrQry(id, tData);
  euSubmsnsDaos.getEuSubmsnStsHistory(qry, callback);
}

const putSubDataUpdate = (reqBody, tData, callback) => {    
  const updateObj = euSubmsnsDaosImpl.euUsrSubUpdate(reqBody, tData);  
  euSubmsnsDaos.profileSubUpdate(updateObj.query, updateObj.updtObj, callback);
}

const postSubmsnPriCreate = (id, reqBody, tData, callback) => {
  const updtObj = euSubmsnsDaosImpl.setPrtQuery(id, reqBody, tData);
  euSubmsnsDaos.putEuSubmsnUpdate(updtObj.query, updtObj.setPrtObj, callback);
}

module.exports = {
  getEuSubmsnsList, postEuSubmsnCreate, getEuSubmsnView, putEuSubmsnStatusUpdate, putEuSubmsnUpdate,
  getEuSubmsnStsHistory, putSubDataUpdate, postSubmsnPriCreate
};
