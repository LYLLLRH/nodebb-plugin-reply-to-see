"use strict";

// var controllers = require('./lib/controllers'),

var winston = module.parent.require('winston'),
	User = module.parent.require('./user'),
	Posts = module.parent.require('./posts'),
	Topics = module.parent.require('./topics'),
	Categories = module.parent.require('./categories'),
	Meta = module.parent.require('./meta'),
	db = module.parent.require('./database'),
	async = module.parent.require('async'),

	plugin = {};


plugin.getPostContent = function(data, callback) {	// There are only two hard things in Computer Science: cache invalidation and naming things. -- Phil Karlton
	var match = true;
	var post;
	Posts.getTopicFields(parseInt(data.posts[0].pid,10),['title'],function(err,fields){
		console.log(fields.title);
		if (/课后复习/.exec(fields.title)) {
			match = false;
			User.isAdministrator(data.uid, function(err, isAdmin) {
		console.log(typeof data.uid);
				if (isAdmin) {
		 			match = true;
		 		} else {
		 	// data.posts[0].content += "是Admin";
		 			for( post in data.posts) {
		 		// console.log(typeof data.posts[post].uid);

		 		// console.log("postid:"+data.posts[post].uid+"   login id:"+data.uid);
		 				if (data.posts[post].uid == data.uid) {
		 					match = true;
		 					break;
		 				}
		 			};
		 		}
 			if (!match) { data.posts[0].content = " <code>[内容回复后并刷新后可见！]</code>";}
			callback(null,data);	
		 		
			}); 
		} else {
			callback(null,data);
		}

	});
};


module.exports = plugin;