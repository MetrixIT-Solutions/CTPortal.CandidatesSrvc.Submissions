/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Skillworks IT <contact@skillworksit.com>, Aug 2024
 */

var axios = require('axios');
var config = require('config');

const getB2bUserData= (id, callback) => {
  axios.get(config.getB2bUserDataApi + id, {}).then((res) => callback(null, res.data)).catch((err) => callback(err, null));
}

const createVendor = (data, callback) => {
  axios.post(config.createVendorApi, data, {})
    .then((res) => callback(null, res.data)).catch((err) => callback(err, null));
}

const getSmtpDetails = (body, callback) => {
  axios.post(config.getSmtpDetailsApi, body, {}).then((res) => callback(null, res.data)).catch((err) => callback(err, null));
}

const notificationCreate = (data, callback) => {
  axios.post(config.postNtfcCreatApi, data).then((res) => callback(null, res.data)).catch((err) => callback(err, null));
}

module.exports = {
  getB2bUserData, createVendor, getSmtpDetails, notificationCreate
};
