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
			elemId:'leaderboard',
			dataCallback:function(){return [];}
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
			this.data = this.config.dataCallback();
			this.data.sort(function(a,b){
				return a.count - b.count;
			});
			this.data =  this.config.maxDisplay > this.data.length?this.data: this.data.slice(0, this.config.maxDisplay);
			//do something about the uiList when it's shorter than maxDisplay
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
			// *find all ui that no longer exist in data and change (fadein/out) to outstanding data
			// *animate ui to new positions based on data sort
			var 	oldElem = [],
				that = this;
			this.data.forEach(function(value,index,ary){
				that.uiList[index].elem.innerHTML = "(" + value.count + ") " + value.title;
			});
			console.log('doTransision');
			return this;
		}
	};

	BFG.Leaderboard = Leaderboard;


	window.BFG = BFG;
})(window.BFG || {});



var test = new BFG.Leaderboard({
	interval:20,
	dataCallback:function(){
		return [//simulates incoming data
			{title:"Arya Stark",count:BFG.rnd(1,800)},
			{title:"Sandor Clegane",count:BFG.rnd(1,800)},
			{title:"Robb Stark",count:BFG.rnd(1,800)},
			{title:"Bronn",count:BFG.rnd(1,800)},
			{title:"Tyrion Lannister",count:BFG.rnd(1,800)},
			{title:"Jon Snow",count:BFG.rnd(1,800)},
			{title:"Daenerys Targaryen",count:BFG.rnd(1,800)},
			{title:"Samwell Tarly",count:BFG.rnd(1,800)},
			{title:"Eddard Stark",count:BFG.rnd(1,800)},
			{title:"Cersei Lannister",count:BFG.rnd(1,800)},
			{title:"Catelyn Stark",count:BFG.rnd(1,800)},
			{title:"Ygritte",count:BFG.rnd(1,800)},
			{title:"Jaime Lannister",count:BFG.rnd(1,800)},
			{title:"Bran Stark",count:BFG.rnd(1,800)},
			{title:"Varys",count:BFG.rnd(1,800)}
		];
	}
});
test.start();
