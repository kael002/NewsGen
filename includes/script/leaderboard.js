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
			elemId:'leaderboard'
		},o);
		this.data = [];
		this.uiList = [];
		this.animationRequestId = 0;
	};
	Leaderboard.prototype = {
		constructor:Leaderboard,
		start:function(){
			var 	that = this,
				tStart = 0,
				progress = 0,
				interval = that.config.interval * 1000,
				doBuildUI = this.uiList.length === 0;
			if (doBuildUI){
				this.buildUI();
			}
			(function run(timestamp){ //This should be moved into it's own .. passing in something like {startTime:0,interval:1000,callback:fn,endOnly:true}
				progress = timestamp - tStart ;
				if (progress > interval || progress === 0){
					tStart = timestamp;
					that.getData();
					that.doTransition();
				}
				requestAnimationFrame( run );
			})(0);
		},
		stop:function(){
			//This no worky
			console.log(this.animationRequestId);
			cancelAnimationFrame(0);
		},
		getData:function(){
			console.log('getData');
			return this;
		},
		buildUI:function(){
			var 	elem = document.getElementById(this.config.elemId) || document.body.appendChild(document.createElement("div")),
				ul = elem.appendChild(document.createElement("ul"));
			for (var i = 0;i < this.config.maxDisplay;i++){
				this.uiList.push({
					elem:ul.appendChild(document.createElement("li")),
					targetX:0,
					targetY:0
				});
				this.uiList[i].elem.innerHTML = "Loading...";
			}
			return this;
		},
		doTransition:function(){
			console.log('doTransision');
			return this;
		}
	};

	BFG.Leaderboard = Leaderboard;


	window.BFG = BFG;
})(window.BFG || {});



var test = new BFG.Leaderboard({interval:20});
test.start();
