/**
 * Copyright (C) SkillworksIT Solutions Pvt Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by SkillworksIT <contact@skillworksit.com>, Aug 2024
 */

var config = require('config');
var mongoose = require('mongoose');
var {v4: uuidv4} = require('uuid');

mongoose.createConnection(config.mongoDBConnection);
const Schema = mongoose.Schema;

// --- Begin: B2B Partner End Users Submission Pay Rates Schema --- //
const schema = new Schema({
  _id: {type: String, default: uuidv4()}, // 

  submission: {type: String, required: true},
  subId: {type: String, required: true}, // Submission ID: AS1289S61577(First Name, Last Name, Current Year(2024) - 2023, Day of Year(289 - 15th Oct), 'S' for submission, Current time in seconds(17:06:17))
  euUser: {type: String, required: true},
  euName: {type: String, required: true},
  euPrimary: {type: String, required: true},
  euRefID: {type: String, required: true},
  b2b: {type: String, required: true},
  b2bName: {type: String, required: true},
  b2bCode: {type: String, required: true},
  org: {type: String, required: false},
  orgName: {type: String, required: false},
  orgCode: {type: String, required: false},

  prHr: {type: Number, required: true}, // Candidate Pay Rate Per Hour
  prNotes: {type: String, required: false}, // Pay Rate Notes
  prFile: {type: String, required: true}, // Pay Rate File Name
  prfActual: {type: String, required: true}, // Pay Rate File Actual Name
  prfPath: {type: String, required: true}, // Pay Rate File (RTR confirmation image) Path

  delFlag: {type: Boolean, default: false}, // Deleted Flag
  cuType: {type: String, required: true}, // Created User Type
  cUser: {type: String, required: true, trim: true}, // Created Users._id
  cuName: {type: String, required: true}, // Created Users.pName
  cuRefID: {type: String, required: true},
  cuRole: {type: String, required: true},
  cDate: {type: Date, required: true}, // Date & Time
  cDtStr: {type: String, required: true}, // Date & Time String - Format = YYYY-MM-DD HH:mm:ss
});

schema.index({delFlag: -1, b2b: 1, submission: 1, euUser: 1});
schema.index({cDtStr: -1});

module.exports = mongoose.model(config.collB2BEuSubmissionPayRates, schema);
// --- End: B2B Partner End Users Submission Pay Rates Schema --- //
