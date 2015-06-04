var domain = 'http://localhost:8080/musics/';

$(function(){

	activateAudioBullet();

})

function activateAudioBullet() {

	var showPopover = function($root, obj) {

		var $anchor = $root.find('.bullet-anchor[anchor-timestamp="'+obj.currentTime+'"]');
		var offset = $anchor.css('left');
		$root.find('.bullet-popover').css('left', offset);
		if (!$anchor.length) return;

		setTimeout(function(){
			$root.find('.bullet-popover').removeClass('bullet-popover-hide');
		},250)

		$root.find('.bullet-popover').text($anchor.data('bullet').text);

	}

	var hidePopover = function($root) {
		$root.find('.bullet-popover').addClass('bullet-popover-hide');
	}


	$('.audio-bullet').one('audio:play',function(){
		$(this).closest('.music-widget').find('.bullet-form').slideDown();

	})


	$('.audio-bullet').on('audio:timeUpdate', function(e, obj) {

		// console.log(obj.currentTime);
		showPopover($(this).closest('.music-widget'), obj);


	})

	$('.audio-bullet').on('bulletAdded', function(e, obj, board){

		// $('pre').text(arr);
		console.log(board);
		
	})

	$('.audio-bullet').on('hasBullet', function(e, arr){

		// var $panel = $('.bullet-panel');
		// $panel.empty();

		// $.each(arr, function(){

		// 	var $bullet = $('<p class="bullet"></p>');
		// 	$bullet.text(this.uname + ": " + this.text);
		// 	$panel.append($bullet);
		// })
		

	})

	$('.audio-bullet').on('audio:change', function() {
		// var $panel = $(this).closest(".music-widget").find('.bullet-panel');
		// $panel.empty();
		hidePopover($(this).closest('.music-widget'));
	})

	$('.bullet-form').on('submit', function(){
		var uname = 'me';
		var obj = {};
		obj.uname = uname;
		obj.text = $(this).find('input').val();

		$(this).closest('.music-widget').find('.audio-bullet').audiobullet('add', obj);
		$(this).find('input').val("");
		return false;
	})	

	//preload comment
	$('.audio-bullet').on('buildSuccess', function(){
		var url = domain;
		var $audio = $(this);
		var id = $audio.closest('.music-widget').attr('data-id');
		$.get(url+id, function(data){

			// console.log(data);
			var comments = data.bulletComments;
			
			comments.forEach(function(comment){
				comment.preload = true;
				comment.text = comment.content;
				comment.timestamp = comment.timeStamp;
				delete comment.timeStamp;
				delete comment.content;
				$audio.audiobullet('add', comment);
			})
		})


	})


	//save comment
	$('.audio-bullet').on('beforeBulletAdded', function(e, obj){


		var url = domain;
		var data = {};
		// data.id = 1;
		data.timeStamp = obj.rawTime;
		data.user = null;
		data.content = obj.text;

		var musicId = $(this).closest('.music-widget').attr("data-id");
		url += musicId + "/addComment/";
		$.ajax({
			url: url,
			crossDomain:true,
			type: 'POST',
			data: JSON.stringify(data),
			contentType:'application/json',
			// dataType: 'text',
			success: function(d) {
				console.log(d);
			},

			error: function() {
				console.dir(arguments);
			}
		})

	})

	// $('body').on('mouseenter','.bullet-anchor', function(){
	// 	var $bullet = $('<span></span>');
	// 	// $bullet.css("position", "absolute").css("left", "")
	// 	$bullet.css({
	// 		position: "absolute",
	// 		left: "3px",
	// 		bottom: 0,
	// 	})
	// 	$bullet.text($(this).attr('anchor-bullet'));
	// 	var _this = this;
	// 	setTimeout(function(){
	// 		$(_this).append($bullet);
	// 	},100)

	// })

	// $('body').on('mouseout','.bullet-anchor', function(){
	// 	$(this).empty();
	// })

}












