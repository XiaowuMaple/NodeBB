'use strict';

const async = require('async');
const db = require('../../database');


module.exports = {
	name: 'Upgrading config urls to use assets route',
	timestamp: Date.UTC(2017, 1, 28),
	method: function (callback) {
		async.waterfall([
			function (cb) {
				db.getObject('config', cb);
			},
			function (config, cb) {
				if (!config) {
					return cb();
				}

				const keys = ['brand:favicon', 'brand:touchicon', 'og:image', 'brand:logo:url', 'defaultAvatar', 'profile:defaultCovers'];

				keys.forEach((key) => {
					const oldValue = config[key];

					if (!oldValue || typeof oldValue !== 'string') {
						return;
					}

					config[key] = oldValue.replace(/(?:\/assets)?\/(images|uploads)\//g, '/assets/$1/');
				});

				db.setObject('config', config, cb);
			},
		], callback);
	},
};
