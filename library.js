"use strict";



var winston = module.parent.require('winston'),

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
	handleSocketIO();
	callback();
}


plugin.getPostContent = function(data, callback) {	
	var match = true;
	var post;
	
	Topics.getTopicData(parseInt(data.posts[0].tid,10),function(err,fields){
		console.log(data);
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

				if (fields.title.match(/题目测试/)) {
					data.posts[0].content=data.posts[0].content.replace(/<p class="rtos">.*<\/p>/g,'<code>[内容回复后并刷新后可见！]</code>')
				} else {
					data.posts[0].content = "<code>[内容回复后并刷新后可见！]</code>";
				}
			}
			callback (null,data);
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

function handleSocketIO() {
	SocketPlugins.RtoS = {};
	SocketPlugins.RtoS.setRtoS = function(socket, data, callback) {		
		Topics.setTopicField(data.tid,'rtos',1);
		callback();	
	};
}

module.exports = plugin;