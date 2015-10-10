define('admin/plugins/reply2see', ['settings'], function(Settings) {
	'use strict';
	/* globals $, app, socket, require */

	var ACP = {};

	ACP.init = function() {
		Settings.load('reply2see', $('.reply2see'));

		$('#save').on('click', function() {
			Settings.save('reply2see', $('.reply2see'), function() {
				app.alert({
					type: 'success',
					alert_id: 'quickstart-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});
	};

	return ACP;
});