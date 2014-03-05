// request a list periodically
// Build the html frame work
// allow for  custom transitions
// allow for custom sorts
// allow for custom click/hover events
"use strict";
(function(BFG){
	var Leaderboard = function(o){
		this.config = BFG.extend({
			maxDisplay:10,
			interval:10,
			hover:function(){
				return;
			},
			transition:function(){
				return;
			}
		},o);
		this.data = [];
		this.uiList = [];
		this.run();
		console.log(this.config);
	};
	Leaderboard.prototype = {
		run:function(){

			console.log('hit');
			requestAnimationFrame( this.run );
		},
		stop:function(){
			clearInterval(this.timer);
		},
		getData:function(){
			console.log('getData');
			return this;
		},
		buildUI:function(){
			console.log('build UI');
			return this;
		},
		doTransition:function(){
			console.log('doTransision');
			return this;
		}
	};

	BFG.Leaderboard = Leaderboard;

	BFG.extend = function(){
		var 	result = {},
			args = Array.prototype.slice.apply(arguments);
		args.forEach(function(value,index,array){
			var key ;
			for (key in value){
				if (value.hasOwnProperty(key)){
					result[key] = value[key];
				}
			}
		});
		return result;
	};

	Array.prototype.forEach = Array.prototype.forEach || function(callback,context){
		for(var i = 0,len = this.length;i < len;i++){
			callback.call(context || null,this[i],i,this);
		}
	};
	window.BFG = BFG;
})(window.BFG || {});

//Erik Möller - polyfill for requestAnimationFrame
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var test = new BFG.Leaderboard({interval:20});
