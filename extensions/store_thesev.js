/* **************************************************************

   Copyright 2013 Zoovy, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

************************************************************** */



//    !!! ->   TODO: replace 'username' in the line below with the merchants username.     <- !!!

var store_thesev = function() {
	var theseTemplates = new Array('');
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
				
				app.ext.store_thesev.u.runFooterCarousel();
				app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID));
					app.ext.store_thesev.u.runHomepageMasonry($context);
				}]);
				
				//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.
				r = true;

				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				app.u.dump('BEGIN admin_orders.callbacks.init.onError');
				}
			},
			
			startExtension : {
				onSuccess : function() {
					if(app.ext.myRIA && app.ext.myRIA.template){
						app.u.dump("store_thesev Extension Started");
					} else	{
						setTimeout(function(){app.ext.store_thesev.callbacks.startExtension.onSuccess()},250);
					}
				},
				onError : function (){
					app.u.dump('BEGIN app.ext.store_thesev.callbacks.startExtension.onError');
				}
			}
			
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {
			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
		
			pickClass : function($tag) {
				//app.u.dump($tag);
				var a = Math.random()*4+1;
				var b = a.toString().split('.');
				var number = b[0];
				switch(number) {
					case '1'	:	$tag.addClass('masonOne'); break;
					case '2'	:	$tag.addClass('masonTwo'); break;
					case '3'	:	$tag.addClass('masonThree'); break;
					case '4'	:	$tag.addClass('masonFour'); break;
				}
			},
		
			getInfo : function($tag, data) {
				//app.u.dump('*** '); app.u.dump(data.value);
			}
			
		}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
		
			runFooterCarousel : function() {
				var $target = $('.logoCarousel');
				if($target.data('isCarousel')) {} //only make it a carousel once (even though it's in the footer)
				setTimeout(function(){	//for whatever reason, caroufredsel needs to be executed after a moment
					$target.carouFredSel({
						responsive	:	true,
						width		: 	'100%',
						height		:	100,
						items: { 	
							visible	:	{
											min	: 1,
											max	: 5
										},
							width	:	125,//'variable',
							height	:	'variable'//100
						},
						swipe: {
							onMouse	: 	true,
							onTouch	: 	true
						},
						auto		: 	false,
						next		:	'.footerPrev',
						prev		:	'.footerNext'
					});
				},2000);
			},
			
			runHomepageMasonry : function($context) {
				var $target = $('.categoryList', $context);
				//initialize
				setTimeout(function() {
					$target.masonry({
						columnWidth		:	50,
						itemSelector	:	'.anyMasonry',
					});
				},2000);
				var poo = $target.data('masonry');
				app.u.dump("****"); app.u.dump(poo);
			} //end runHomepageMasonry
		
			}, //u [utilities]

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
			} //e [app Events]
		} //r object.
	return r;
	}