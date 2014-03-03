/**
 * Created with JetBrains WebStorm.
 * User: Kael
 * Date: 2/8/14
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */

(function(){
	"use strict";
	var initializing = false,
		superPattern = /xyz/.test(function(){xyz;})?/\b_super\b/:/.*/;

})();
function assert(value,message){
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
}
