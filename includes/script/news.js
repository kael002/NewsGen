/*
 subject + predicate
 s subject
 v predicate (verb)
 av adverb
 p prepresentional phase
 pp predicate
 po object
 patterns
 s + v "Woman roared"
 s + v + pp + po "Woman roared at the man"
 s + v + av "Woman roared loudly"

 subject + predicate + direct object
 s subject
 v predicate
 do direct object
 p prepresentional phase
 pp predicate
 po object
 patterns
 s + v + do "Woman killed man"
 s + v + do + pp + po "Woman killed man with sword"

 subject + predicate + direct object + indirect object
 s subject
 v predicate
 do direct object
 io indirect object
 patterns
 s + v + io + do "Woman gave man sword"

 subject + linking verb + noun/adjective compliment (comparing)
 s subject
 lv linking verb
 nc noun compliment
 ac adjective compliment
 patterns
 s + lv + nc "Woman is warrior"
 s + lv + ac "Woman is old"

 subject
 [full,short,alt,gender]
 ["Mr. Jose Wales","Jose","Mr. Wales","m"],
 [""]
 */
var fakeAjax = {
	story_config:["test1","test2","test3","test4","test5","test6"],
	noun_proper:[
		{base:"Arya Stark",short:"Arya",alt:"Princess of Winterfell",gender:"f"},
		{base:"Eddard Stark",short:"Ned",alt:"King of Winterfell",gender:"m"},
		{base:"Tyrion Lanister",short:"Tyrion",alt:"the Imp",gender:"m"},
		{base:"Robert Baratheon",short:"Robert",alt:"The King",gender:"m"},
		{base:"Jon Snow",short:"Jon",alt:"Bastard",gender:"m"}
	],
	noun_proper_plural:[
		{base:"Hinterland",alt:"death bogs",gender:"p"},
		{base:"Everglade",alt:"glades",gender:"p"}
	],
	noun_common:["cat","dog","bird","book"],
	noun_common_mass:["trash","food","milk","wool","spaghetti"],
	noun_common_of_many:["stone"],
	verb_transitive:[ // John hits Bob
		{present:"kicks",past:"kicked"},
		{present:"applauds",past:"applauded"},
		{present:"kills",past:"killed"},
		{present:"hits",past:"hit"}
	],
	verb_intransitive:[ // John walked [quickly]
		{present:"walks",past:"walked",future:"will walk"},
		{present:"tell",past:"told"},
		{present:"rise",past:"rose"},
		{present:"sleeps",past:"slept"}
	],
	verb_linking:[ // John remained sleepy|witty|a big man
		{present:"remains",past:"remained"},
		{present:"seems",past:"seemes"},
		{present:"becomes",past:"became"},
		{present:"feels",past:"felt"}
	],
	verb_aux:["will","must","can","should","may","might"]
};
(function(bfg,$){
	"use strict";
	function Story(elem,options){
		var defaults = {
				title:"Untitled",
				paraCount:3,
				paraElemName:"div"
			},
			moods = ["dark","sports","scandal","burglary"];
		this.config = $.extend(defaults,options||{});
		this.storyConfig = bfg.getData("story_config");
		this.paragraphs = [];
		
		if(!elem){
			elem = document.createElement('div');
			document.body.appendChild(elem);
		} else {
			elem = document.getElementById(elem);
		}
		this.elem = elem;
	}
	Story.prototype = {
		generate: function(){
			var elem,
				i = 0,
				paragraph = new Paragraph();
			for( ;i < this.config.paraCount;i++){
				this.paragraphs.push(paragraph.get());
				elem = document.createElement(this.config.paraElemName);
				elem.innerHTML = this.paragraphs[i];
				this.elem.appendChild(elem);
			}
			return this.paragraphs.join(" ");
		}
	};

	function Paragraph(subjects){
		this.subjects = subjects;
	}

	Paragraph.prototype = function(){
		return {
			get:function(){
				var result = "",
					sentence = new Sentence();
				for(var i = 0;i < 5;i++){
					result += sentence.parse("s+v+ppo");
				}
				return result;
			}
		};
	}();


	function Sentence(params){
		params = params || {};
		var rxTrans = /\W+/i,
			rxChars = /\w+/i,
			parts = {
				subject:new Part('subject',params.subject||[new Noun("Barry",{type:"proper"}),new Noun("cat"),new Noun("Mary",{type:"proper"}),new Noun("rock",{type:"commonofmany"})]),
				verb:new Part('verb',["ran","bought","smiled","laughed"]),
				verbTrans:new Part('verb',["applauded","killed","smiled at","laughed at"]),
				linkverb:new Part('linkverb',["was","is","has been","will be"]),
				prepPred:new Part('prepPred',["about","behind","except","outside","above","below","for","over","across","beneath","from","past","after","beside","in","through","against","between","inside","to","along","beyond","into","under","among","by","near","until","around","despite","of","up","at","down","off","with","before","during","on","without"]),
				prepObj:new Part('prepObj',["sword","man","dog","cat"]),
				adj:new Part('adj',["loudly","quickly","fast","lovely"])
			},
			tokens = {
				s:function(index){
					if (index !== undefined){
						return parts.subject.item(index);
					}else{
						return parts.subject.next();
					}
				},
				v:function(){
					return parts.verb.random();
					//return parts.verbTrans.random();
					//return parts.linkverb.random();
				},
				p:function(token){
					var prepDirectObject="",
						prepPredicate="",
						i = 1,
						len = token.length;
					for ( ; i < len;i++){
						prepDirectObject = token[i]==='o'?parts.prepObj.random():prepDirectObject;
						prepPredicate = token[i]==='p'?parts.prepPred.random():prepPredicate;
					}
					return prepDirectObject + prepPredicate;
				},
				a:function(){
					return parts.adj.random();
				},
				"+":" ",
				"&":" and ",
				"!":", but ",
				",":", then "
			};
		this.parse = function parse(pat){
			var results = "",
				index,base,
				chars = pat.split(rxTrans),
				trans = pat.split(rxChars),
				result = function(token){
					var result = "";
					if(token){
						result = typeof tokens[token[0]] === "function" ? tokens[token[0]](token) : tokens[token[0]];
					}
					return result||"";
				};
			for (var iterToken in trans){
				results += result(trans[iterToken]);
				results += result(chars[iterToken]);
			}
			return results[0].toUpperCase() + results.slice(1).trim() + ". ";
		};
	}

	function Noun(base,options){
		options = options||{};
		var genderIndex,
			genders = ["thing","male,","female","place","title","time"],
			matrix = {
				//[single,the single,a single,some single,the plural,plural]
				proper:             [0,0,0,0,0,0],
				proper_plural:      [4,4,4,4,4,4],
				common:             [1,1,2,1,4,5],
				common_mass:        [0,1,1,3,1,0],
				common_of_many:     [0,1,2,3,4,5]
			},
			defaults = {
				type:"common",// thing,male,female,place,title,time
				gender:genders[2],
				plural:base + "s", //fix this later - 's','es'
				possession:false
			};
		
		if (typeof base !== "string"){
			return;
		}
		this.config = $.extend(defaults,options);
		this.base = base;
		genderIndex = genders.indexOf(this.config.gender)||0;
		if ([1,2,4,5].indexOf(genderIndex) < 0){
			this.typeUseArray = matrix.proper;
		}else if (genderIndex === 3){
			this.typeUseArray = matrix.proper_plural;
		}else{
			this.typeUseArray = matrix[this.config.type]||matrix.common;
		}
		
		this.forms = [
			base,                       // 0 - single
			"the " + base,              // 1 - the single
			"a " + base,                // 2 - a single
			"some " + base,             // 3 - some single
			"the " + this.config.plural,   // 4 - the plural
			this.config.plural             // 5 - plural
		];
	}
	Noun.prototype = function(){
		return {
			get:function(use){
				var sub;
				sub = {single:0,single_the:1,single_a:0,single_some:3,plural_the:4,plural:5}[use]||0;
				return this.forms[this.typeUseArray[sub]];
			}
		};
	}();

	function Part(type,itemArray){
		this.currentItem = -1;
		this.type = type;
		this.list = itemArray||[];
	}
	Part.prototype = function(){
		return {
			random:function(){
				this.currentItem = rnd(this.list.length-1);
				return this.get(this.list[this.currentItem]);
			},
			next:function(){
				this.currentItem++;
				this.currentItem = this.list[this.currentItem]?this.currentItem:0;
				return this.get(this.list[this.currentItem]);
			},
			item:function(index){
				this.currentItem = this.list[index]?index:0;
				return this.get(this.list[this.currentItem]);
			},
			get:function(item){
				if (item instanceof Noun){
					return item.get();
				}else{
					return item;
				}
			}
		};
	}();

	function rnd (min,max){
		if (min === undefined){
			min = 100;
		}
		if (!max){
			max = min;
			min = 0;
		}

		return	Math.floor(Math.random() * (max-min+1) + min);
	}

	bfg.Story = Story;
	bfg.getData = function(get,options){
		var result,data,
			defaults = {
				random:true,
				tags:[],
				qty:1
			};
		options=options||{};
		if(!get){
			return;
		}
		jQuery.extend(defaults,options);
		data = fakeAjax[get];
		if (data){
			if (defaults.qty === 1){
				result = data[rnd(data.length-1)];
			} else {
				result = [];
				for (var i = 0;i<defaults.qty;i++){
					result.push(data[rnd(data.length)]);
				}
			}
		}
		return result;
	};
	window.BFG = bfg;
}(window.BFG||{},jQuery));

var myStory = new BFG.Story('news');
myStory.generate();
//mypar.parse("s+v+s+pp+po&v+av");
//mypar.parse("s+v+s+pp+po!v+av");
//mypar.parse("s0+vt+s1,v");
