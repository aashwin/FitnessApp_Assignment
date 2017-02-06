var ActivityDAO = require('../../framework/DAO/activities.dao');
const mongoose = require('mongoose');
const Activity = mongoose.model('Activity');
exports.getAll = function (userId) {
    return new Promise(function (resolve, reject) {
        ActivityDAO.findByUserId(userId, function (activitiesList) {
            if (!activitiesList || !(activitiesList instanceof Array)) {
                reject();
                return;
            }
            resolve(activitiesList);
        });
    });
};

exports.createActivity = function (activity) {
    var activity2 = new Activity(activity);
    activity2.save();
    return activity2;
};
exports.validateAndClean = function (data, user) {
    var errors = [];
    return new Promise(function (resolve, reject) {
            if (data) {
                data.name = data.name || "";
                data.distance = data.distance || 0;
                data.distanceType = data.distanceType || {"value": 0};
                data.distanceType.value = data.distanceType.value || 0;
                data.elevation = data.elevation || 0;
                data.durationH = data.durationH || 0;
                data.durationM = data.durationM || 0;
                data.durationS = data.durationS || 0;
                data.notes = data.notes || "";
                const now = (new Date).getTime() / 1000;
                if (data.name.length < 3 || data.name > 50) {
                    errors.push('Activity name has to be between 3-50 characters');
                } else if (!data.name.match(/^[a-zA-Z0-9_ #()\[\]!@-]+$/)) {
                    errors.push('Activity name contains some invalid characters');
                }
                if (!data.dateTime) {
                    errors.push('Date Time cannot be empty');

                } else if (!data.dateTime.toString().match(/^[0-9\.]+$/) || data.dateTime < now - (3600 * 24) * 2000 || data.dateTime > now) {
                    errors.push('Date Time cannot be in the future or very old');
                }


                if (!data.distanceType.value.toString().match(/^[0-9\.]+$/) || data.distanceType.value > 2000 || data.distanceType.value <= 0) {
                    errors.push('Distance Type not correct, try again!');

                } else if (!data.distance.toString().match(/^[0-9\.]+$/) || data.distance * data.distanceType.value < 0 || data.distance * data.distanceType.value > 999999) {
                    errors.push('Distance is too big, are you sure you did that much?');
                }

                if (!data.elevation.toString().match(/^[0-9\.]+$/) || data.elevation < 0 || data.elevation > 999) {
                    errors.push('Elevation must be between 0-999, are you sure you did that much?');
                }
                if (!data.durationH.toString().match(/^[0-9\.]+$/) || data.durationH < 0 || data.durationH > 99) {
                    errors.push('Hours must be between 0-99, are you sure you did that much?');
                }
                if (!data.durationM.toString().match(/^[0-9\.]+$/) || data.durationM < 0 || data.durationM > 59) {
                    errors.push('Minutes must be between 0-59');
                }
                if (!data.durationS.toString().match(/^[0-9\.]+$/) || data.durationS < 0 || data.durationS > 59) {
                    errors.push('Seconds must be between 0-59');
                }
            }
            else {
                errors.push('Malformed data');
            }
            if (errors.length === 0) {

                var activity = {
                    name: data.name,
                    createdBy: user._id,
                    dateTime: data.dateTime,
                    distanceInMeters: data.distance * data.distanceType.value,
                    elevationInMeters: data.elevation,
                    durationInSeconds: data.durationH * 3600 + data.durationM * 60 + data.durationS,
                    notes: data.notes
                };
                resolve(activity);
            } else {
                reject({"errors": errors});
            }
        }
    )
        ;
}
;