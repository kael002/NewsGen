/**
 * Created with JetBrains WebStorm.
 * User: Kael
 * Date: 2/8/14
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */
"use strict";
(function(BFG){

	var initializing = false,
		superPattern = /xyz/.test(function(){xyz;})?/\b_super\b/:/.*/;

	BFG.extend = function(obj){
		var 	key,
			args = Array.prototype.slice.call(arguments,1);
		args.forEach(function(value,index,array){
			for (key in value){
				if (value.hasOwnProperty(key)){
					obj[key] = value[key];
				}
			}
		});
		return obj;
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

window.assert = window.assert || function (value,message){
	if(!message){
		message = value;
		value = true;
	}
	var ul = document.getElementById('assert');
	if(!ul){
		ul = document.createElement('ul');
		ul.id = 'assert';
		document.body.appendChild(ul);
	}
	var li = document.createElement('li');
	li.className = value ? 'success':'fail';
	li.appendChild(document.createTextNode(message));
	ul.appendChild(li);
};

Array.prototype.forEach = Array.prototype.forEach || function(callback,context){
	for(var i = 0,len = this.length;i < len;i++){
		callback.call(context || null,this[i],i,this);
	}
};