"use strict";



var winston = module.parent.require('winston'),
	User = module.parent.require('./user'),
	Posts = module.parent.require('./posts'),
	Topics = module.parent.require('./topics'),
	Categories = module.parent.require('./categories'),
	Meta = module.parent.require('./meta'),
	db = module.parent.require('./database'),
	async = module.parent.require('async'),
	SocketPlugins = module.parent.require('./socket.io/plugins'),

	plugin = {};

plugin.init = function(params,callback){
	handleSocketIO();
	callback();
}


plugin.getPostContent = function(data, callback) {	
	var match = true;
	var post;
	Posts.getTopicFields(parseInt(data.posts[0].pid,10),['rtos'],function(err,fields){
		if (fields.rtos) {
			match = false;
			User.isAdministrator(data.uid,function(err,isAdmin){
				if (isAdmin) {
					match = true;
				} else {
					for (post in data.posts) {
						if (data.posts[post].uid == data.uid) {
							match = true;
							break;
						}
					}
				}
			if (!match) {data.posts[0].content = "<code>[内容回复后并刷新后可见！]</code>";}
			callback (null,data);
			})
		} else {
			callback(null,data);
		}
	})
};

function handleSocketIO() {
	SocketPlugins.RtoS = {};
	SocketPlugins.RtoS.setRtoS = function(socket, data, callback) {		
		Topics.setTopicField(data.tid,'rtos',1);
		callback();	
	};
}

module.exports = plugin;