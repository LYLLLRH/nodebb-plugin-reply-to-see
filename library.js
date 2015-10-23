"use strict";



var controllers = require('./lib/controllers'),
	winston = module.parent.require('winston'),
	User = module.parent.require('./user'),
	Posts = module.parent.require('./posts'),
	Topics = module.parent.require('./topics'),
	Categories = module.parent.require('./categories'),
	Meta = module.parent.require('./meta'),
	db = module.parent.require('./database'),
	async = module.parent.require('async'),
	_ = module.parent.require('underscore'),
	SocketPlugins = module.parent.require('./socket.io/plugins'),

	plugin = {};

plugin.init = function(params,callback){
	var router = params.router,
		hostMiddleware = params.middleware,
		hostControllers = params.controllers;
		
	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin/plugins/reply2see', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/reply2see', controllers.renderAdminPage);

	handleSocketIO();
	callback();
}


plugin.getPostContent = function(data, callback) {	
	var match = true;
	var post;
	
	Topics.getTopicData(parseInt(data.posts[0].tid,10),function(err,fields){
		if (fields.rtos) {
			match = false;
			User.isAdministrator(data.uid,function(err,isAdmin){
				if (isAdmin || data.uid == data.posts[0].uid) {
					match = true;
				} else {
					if (fields.replyerIds) {
						 if (_.indexOf(JSON.parse(fields.replyerIds),parseInt(data.uid)) >= 0 ) {
						 	match = true;
						 }
					}
				}
				if (!match) {
					Meta.settings.get('reply2see', function (err, settings) {
						if (fields.title.match(settings.title)) {
							data.posts[0].content=data.posts[0].content.replace(/<p class="rtos">.*<\/p>/gm,'<code>[内容回复后并刷新后可见！]</code>')
						} else {
							data.posts[0].content = "<code>[内容回复后并刷新后可见！]</code>";
						}
						callback (null,data);
					});
				} else {
				callback (null,data);
				}
			})
		} else {
			callback(null,data);
		}
	})
};

plugin.setReplyerId = function(data,callback) {
	 Topics.getTopicData(parseInt(data.tid),function(err,fields){
	 	if (fields.rtos) { 

				var replyerIds = fields.replyerIds?JSON.parse(fields.replyerIds):[];
				if ( _.indexOf(replyerIds,parseInt(data.uid)) === -1) {
					replyerIds.push(parseInt(data.uid));
					Topics.setTopicField(parseInt(data.tid),'replyerIds',JSON.stringify(replyerIds));
				}
		} 
    })
	callback(null,data);
}

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/plugins/reply2see',
		icon: 'fa-tint',
		name: 'Rely post to see content'
	});

	callback(null, header);
};

function handleSocketIO() {
	SocketPlugins.RtoS = {};
	SocketPlugins.RtoS.setRtoS = function(socket, data, callback) {		
		Topics.setTopicField(data.tid,'rtos',1);
		callback;	
	};

}
module.exports = plugin;