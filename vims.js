'use strict'
const winston = require('winston')
const request = require('request')
const URI = require('urijs')
const _ = require('underscore')
const immDataElements = require('./terminologies/vims-immunization-valuesets.json')

module.exports = function (cnf) {
  const config = cnf
  return {
    isValidJson: function(json){
      try{
        JSON.parse(json);
        return true;
      }
      catch (error){
        return false;
      }
    },

    getPeriod: function(vimsFacId,callback) {
      var url = URI(config.url).segment('rest-api/ivd/periods/'+vimsFacId+'/82')
      var username = config.username
      var password = config.password
      var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
      var options = {
        url: url.toString(),
        headers: {
          Authorization: auth
        }
      }

      request.get(options, (err, res, body) => {
        if (err) {
          return callback(err)
        }
        var periods = []
        if(body.indexOf('error') == -1) {
          body = JSON.parse(body)
          body.periods.forEach ((period,index)=>{
            if(period.id > 0)
            periods.push({'id':period.id,'periodName':period.periodName})
            if(index == body.periods.length-1)
            callback(periods)
          })
        }
        else {
          callback(periods)
        }

      })
    },

    getImmunDataElmnts: function (callback) {
      var concept = immDataElements.compose.include[0].concept
      var dataElmnts = []
      concept.forEach ((code,index) => {
        dataElmnts.push({'code':code.code})
        if(concept.length-1 == index)
          callback('',dataElmnts)
      })
    },

    saveImmunizationData: function (vimsVaccCode) {

    }
  }
}
