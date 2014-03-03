/**
 * Created with JetBrains WebStorm.
 * User: Kael
 * Date: 2/19/14
 * Time: 4:22 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * Story
 *  Paragraphs
 *      Sentences
 *          Clauses [s+p]
 *              Subject [n][d+n][d+m+n][d+n+m]
 *                  Noun
 *                  Determinative //the
 *                  Modifier //ugly or on the sofa
 *              Predicate [v+n]
 *							Verb //Bill drove.
 *							Prepositional Phrase //
 *								Preposition
 *								PrepositionObject (noun)
 *							Participial Phrase //Slid out of control
 *								Participial
 *								ParticipialObject (noun)
 *							Gerund Phrase //doing | increasing, the business
 *								Gerund
 *  							GerundObject (noun)
 *							Infinitive Phrase //to give the letter
 *								Infinitive
 *  							InfinitiveObject (noun)
 *                  
 * */

/*
Paragraph types:
Chronology - d0-d1-d2-d3 d:date | date,first,second,finally,also
Classification (support) - c+s+s+s+s+f c:claim,s:support,ce:claim end | for example,for instance,in other words
Compare and Contrast - cs+cc+cc+cc+cc cs:compare statement,cc:compare | although, but, whereas,however,meanwhile,similarly, in the same way
Question and Answer - q+a+q+a+a+q+a q:question, a:answer | ?
Cause and Effect - con+ca+ef+ca+ef con:condition,ca:cause,ef:effect | because, therefore, as a result,consequently, for this reason,since
* */

var fakeAjax = {
	story_config:["test1","test2","test3","test4","test5","test6"],
	patterns:{
		story:["r"],
		paragraph:{
			chronology:["t-t-t-t-te"],
			classification:["c+s+s+s+s+f"],
			//compare:["cs+cc+cc+cc+cc"],
			question:["q+a+q+a+q+a+c","q+c+c+c+c+a"]//,
			//cause:["con+ca+ef+ca+ef"]
	}, //r:random,
	sentence:{
		time:["c"],
		time_end:["c"],
		claim:["c"],
		support:["c"],
		claim_conclusion:["c"],
		compare_statement:["c"],
		compare:["c"],
		question:["c"],
		answer:["c"],
		condition:["c"],
		cause:["c"],
		effect:["c"]
	},
	clause:["s+p","s+p,+p","s+p,&p"], //s:subject,p:predicate
	subject:["n+"], // n:noun
	predicate:["v","vt+do"] //v:verb,vt:verb_transitive,do:direct_object(noun)
	},
	noun_proper:[
		{base:"Arya Stark",short:"Arya",alt:"Princess of Winterfell",gender:"f"},
		{base:"Eddard Stark",short:"Ned",alt:"King of Winterfell",gender:"m"},
		{base:"Tyrion Lanister",short:"Tyrion",alt:"the Imp",gender:"m"},
		{base:"Robert Baratheon",short:"Robert",alt:"The King",gender:"m"},
		{base:"Jon Snow",short:"Jon",alt:"Bastard",gender:"m"},
		{base:"Alex May",short:"Alex",alt:"Bastard",gender:"m"},
		{base:"Krack Ho",short:"Slut",alt:"Nasty Ass",gender:"f"},
		{base:"Piece of Meat",short:"Meat",alt:"Meat",gender:"t"}
	],
	noun_proper_plural:[
		{base:"Hinterland",alt:"death bogs",gender:"p"},
		{base:"Everglade",alt:"glades",gender:"p"}
	],
	noun_common:["cat","dog","bird","book","snake","skateboard","book","horse","bike","card","car"],
	noun_common_mass:["trash","food","milk","wool","spaghetti"],
	noun_common_of_many:["stone"],
	verb:[ // John hits Bob
		{present:"growl",past:"growled"},
		{present:"cough",past:"coughed"},
		{present:"jump",past:"jumped"},
		{present:"puke",past:"puked"},
		{present:"laugh",past:"laughed"}
	],
	verb_transitive:[ // John hits Bob
		{present:"kick",past:"kicked"},
		{present:"applaud",past:"applauded"},
		{present:"kill",past:"killed"},
		{present:"hit",past:"hit"},
		{present:"laugh",past:"laughed at"}
	],
	verb_intransitive:[ // John walked [quickly]
		{present:"walks",past:"walked",future:"will walk"},
		{present:"tell",past:"told"},
		{present:"rise",past:"rose"},
		{present:"sleeps",past:"slept"}
	],
	verb_linking:[ // John remained sleepy|witty|a big man
		{present:"remains",past:"remained"},
		{present:"seems",past:"seemed"},
		{present:"becomes",past:"became"},
		{present:"feels",past:"felt"}
	],
	verb_aux:["will","must","can","should","may","might"]
};
(function(bfg){
	"use strict";
	var 	store = {
				transitions:{
					"+":" ",
					",":", ",
					",+":", then ",
					",!":", but ",
					",&":" and "
				}
			},
			forge = {};
	function Story(elem,options){
		console.time("test");
		var para,
			result = "",
			i = 0,
			pCount = rnd(5,8),
			defaults = {
				title:"Untitled",
				paraCount:3,
				paraElemName:"div"
			};
		this.config = $.extend(defaults,options||{});
		this.subject = rnd(fakeAjax.noun_proper);
		this.title = "A Story About " + this.subject;
		this.tense = this.currentTense = "past";
		$.extend(forge,{
			paragraph: new Paragraph(this),
			sentence: new Sentence(this),
			clause: new Clause(this),
			subject: new Subject(this),
			predicate: new Predicate(this),
			noun_proper: new Words("noun_proper"),
			noun_proper_plural: new Words("noun_proper_plural"),
			noun_common: new Words("noun_common",true),
			noun_common_mass: new Words("noun_common_mass"),
			noun_common_of_many: new Words("noun_common_of_many"),
			verb: new Words("verb",true),
			verb_transitive: new Words("verb_transitive",true),
			verb_intransitive: new Words("verb_intransitive",true),
			verb_linking: new Words("verb_linking",true),
			verb_aux: new Words("verb_aux",true)
		});
		if(!elem){
			elem = document.createElement('div');
			document.body.appendChild(elem);
		} else {
			elem = document.getElementById(elem);
		}
		this.elem = elem;
		for ( ;i < pCount;i++){
			para = document.createElement('P');
			para.innerHTML = forge.paragraph.get();
			elem.appendChild(para);
		}
		console.timeEnd("test");
	}
	Story.prototype = {
		
	};

	/** Paragraph ************************************/
	/*************************************************/
	function Paragraph(root){
		this.root = root;
		this.pattern =  new Pattern(root,"paragraph",{
			c:function(){
				var claim = ["it is a fact that ","indeed, ","for sure, ","history says that "];
				return rnd(claim) + forge.sentence.get("claim");
			},
			s:function(){
				var support = ["for example, ","for instance, ","in other words, ","also, ","in fact, ","therefore, "];
				return rnd(support) + forge.sentence.get("support");
			},
			f:function(){
				var end = ["as the record states, ","so you can see, ","there is no doubt that ","in conclusion, ","the proof is on the pudding, "];
				return rnd(end) + forge.sentence.get("claim_conclusion");
			},
			t:function(){
				var time = ["first, ","then, ","after, ","next, ","furthermore, "];
				return (forge.sentence.index===0?time[0]:time[rnd(1,time.length-1)]) +  forge.sentence.get("time");
			},
			te:function(){
				return "finally, " + forge.sentence.get("time_end");
			},
			q:function(){
				var result;
				this.punctuation = "?";
				this.root.currentTense = "present";
				result = "Why did " + forge.sentence.get("question");
				this.root.currentTense = this.root.tense;
				return result;
			},
			a:function(){
				var answer = ["Obviously, ","The answer is that "];
				return rnd(answer) + forge.sentence.get("answer");
			}
		},
		function(result){
			result = result!==""?result[0].toUpperCase() + result.slice(1).trim() + this.punctuation + " ":"";
			this.punctuation = ".";
			return result;
		});
	}
	Paragraph.prototype = {
		get:function(){
			var result = "";
			result = this.pattern.parse(true);
			forge.sentence.index = 0;
			return result;
		}
	};
	/** Sentence ************************************/
	/*************************************************/
	function Sentence(root){
		this.root = root;
		this.index = 0;
		this.pattern =  new Pattern(root,"sentence",{
			c:function(){
				var result = forge.clause.get();
				forge.sentence.index++;
				return result;
			}
		});
	}
	Sentence.prototype = {
		get:function(item){
			this.pattern.changePattern(item);
			return this.pattern.parse(true);
		}
	};

	/** Clause ************************************/
	/*************************************************/
	function Clause(root){
		this.root = root;
		this.pattern = new Pattern(root,"clause",{
			s:function(){

				return forge.subject.get();
			},
			p:function(){
				return forge.predicate.get();
			}
		});
	}
	Clause.prototype = {
		get:function(){
			return this.pattern.parse(true);
		}
	};

	/** Subject ************************************/
	/*************************************************/
	function Subject(root){
		var words = new Words("noun_proper");
		this.phrase = root.subject.base;
		this.pattern = new Pattern(root,"subject",{
			n:function(){
				if(forge.sentence.index > 0 && words.getParam("gender")){
					return {m:"he",f:"she",t:"it"}[words.getParam("gender")]||words.get("base");
				}
				return words.get("base");
			}
		});
	}
	Subject.prototype = {
		get:function(intSub){
			return intSub||this.pattern.parse(true);
		}
	};

	/** Predicate ************************************/
	/*************************************************/
	function Predicate(root){
		this.root = root;
		this.phrase = "Predicate";
		this.pattern = new Pattern(root,"predicate",{
			v:function(){
				return forge.verb.get(root.currentTense);
			},
			vt:function(){
				return forge.verb_transitive.get(root.currentTense);
			},
			do:function(){
				return forge.noun_common.get();
			},
			pr:function(){
				return rnd(["fast","slow","quickly","terribly"]);
			},
			pa:function(){
				return "out of control";
			},
			g:function(){
				return "increased";
			},
			i:function(){
				return ",to be honest";
			}
		});
	}
	Predicate.prototype = {
		get:function(){
			return this.pattern.parse(true);
		}
	};
	/** Word *****************************************/
	/*************************************************/
	function Words(type,isDynamic){
		this.type = type;
		this.words = fakeAjax[type];
		this.current = this.special(rnd(this.words));
		this.isDynamic = isDynamic||false;
	}
	Words.prototype = {
		get:function(type){
			type = type||"base";
			if (this.isDynamic){
				this.current = this.special(rnd(this.words));
			}
			if (typeof this.current === "object"){
				return this.current[type]||"";
			}else{
				return this.current||"";
			}
		},
		special:function(word){
			if (this.type === "noun_common"){return handleNoun(word,"noun_common","single");}
			return word;
		},
		getParam:function(param){
			return this.current[param];
		}
	};
	/** Pattern **************************************/
	/*************************************************/
	function Pattern(root,type,callback,postCallback){
		var pat,chars,trans,rxMatch,
			rxTrans = /\W+/i,
			rxChars = /\w+/i,
			rxString = /\|(.*?)\|/ig;
		this.patternList = [];
		this.commands = [];
		this.transitions = [];
		this.injections = [];
		this.root = root;
		this.type = type;
		this.punctuation = ".";
		this.callback = callback;
		this.postCallback = postCallback;
		this.newPat = function(){
			this.commands = this.transitions = this.injections = [];
			pat = rnd(this.patternList);
			if (pat !== "" && typeof pat === "string"){
				while((rxMatch = rxString.exec(pat)) !== null){
					this.injections.push(rxMatch);
				}
				pat = pat.replace(rxString,"z^z");
				this.commands = pat.split(rxTrans);
				this.transitions = pat.split(rxChars);
			}
		};
		this.changePattern();
	}
	Pattern.prototype = {
		changePattern: function(item){
			this.patternList = this.findPat(fakeAjax.patterns,this.type,item);
			if (this.patternList){
				this.newPat();
			}
		},
		findPat: function(node,type,item){
			
			item = item||"";
			if(typeof node[type] === "object" && !(node[type] instanceof Array)){
				if(node[type][item]){
					return node[type][item];
				}
				return this.findPat(node[type],rnd(node[type])); //if we don't find a specific object, return random
			}else{
				return node[type];
			}
		},
		parse: function(isNewPat){
			var iToken,
				transResults = "",
				results = "",
				injectionIndex = 0,
				that = this,
				result = function(token,data){
					var result = "";
					if(token === "^"){
						return that.injections[injectionIndex++][1];
					}
					if(token !== undefined && token !== ""){
						result = typeof data[token] === "function" ? data[token].call(that,token) : data[token];
					}
				
					return result||"";
				};
				
			if(isNewPat){
				this.changePattern();
			}
						
			for (iToken in this.transitions){
				results += result(this.transitions[iToken],store.transitions);
				transResults = result(this.commands[iToken],this.callback);
				if(this.postCallback){
					transResults = this.postCallback(transResults);
				}
				results += transResults;
			}

			return results;
		}
	};

	/** Helpers ************************************/
	/*************************************************/
	function handleNoun(noun,type,use){
		var sub,
			matrix = {
				//[single,the single,a single,some single,the plural,plural]
				proper:                 [0,0,0,0,0,0],
				proper_plural:          [4,4,4,4,4,4],
				noun_common:             [1,1,2,1,4,5],
				noun_common_mass:        [0,1,1,3,1,0],
				noun_common_of_many:     [0,1,2,3,4,5]
			},
			forms = [
				noun,                       // 0 - single
				"the " + noun,              // 1 - the single
				"a " + noun,                // 2 - a single
				"some " + noun,             // 3 - some single
				"the " + noun + "s",        // 4 - the plural
				noun + "s"                  // 5 - plural
			];
		sub = {single:0,single_the:1,single_a:0,single_some:3,plural_the:4,plural:5}[use]||0;
		return forms[matrix[type][sub]];
	}

	function rnd (min,max){
		if (min instanceof Array){
			if(min.length === 0){
				return undefined;
			}
			if(min.length === 1){
				return min[0];
			}
			return min[rnd(0,min.length-1)];
		}
		if(typeof min === "object"){
			min = Object.keys(min);
			return min[rnd(min.length-1)];
		}
		min = min === undefined?100:min;
		if (!max){
			max = min;
			min = 0;
		}
		return	Math.floor(Math.random() * (max-min+1) + min);
	}
	if (!Object.keys) Object.keys = function(o) {
		if (o !== Object(o))
			throw new TypeError('Object.keys called on a non-object');
		var k=[],p;
		for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
		return k;
	}
	bfg.Story = Story;
	window.BFG = bfg;
}(window.BFG||{}));

var myStory = new BFG.Story("news");