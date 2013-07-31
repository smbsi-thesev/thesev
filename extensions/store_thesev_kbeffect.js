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

var store_thesev_kbeffect = function() {
	
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

	vars : { 
		dontKenBurns : false
	},

	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
				
				//reads checkbox value to stop ken burns effect on cat/prod list images from local storage and puts in app accordingly
				app.ext.store_thesev_kbeffect.u.whoIsKenBurns();
				
				app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID));
					app.ext.store_thesev_kbeffect.u.catImageInit($context);
				}]);
				
				app.rq.push(['templateFunction','categoryTemplate','onCompletes',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID));
					app.ext.store_thesev_kbeffect.u.catImageInit($context);
					app.ext.store_thesev_kbeffect.u.kenburnsInit($context);
				}]) 	

				app.rq.push(['templateFunction','collectionsTemplate','onCompletes',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID));
					app.ext.store_thesev_kbeffect.u.catImageInit($context);
					app.ext.store_thesev_kbeffect.u.kenburnsInit($context);
				}]) 	
				
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
					if(app.ext.myRIA && app.ext.myRIA.template && app.ext.store_thesev){
						app.u.dump("store_thesev_kbeffect Extension Started");
					} else	{
						setTimeout(function(){app.ext.store_thesev_kbeffect.callbacks.startExtension.onSuccess()},250);
					}
				},
				onError : function (){
					app.u.dump('BEGIN app.ext.store_thesev_kbeffect.callbacks.startExtension.onError');
				}
			}
			
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {
		
			holdKenBurnsEffect : function($this) {
				if($this.is(':checked')) {
					$('.kbCheckBox','#appView').val(':checked');
					app.ext.store_thesev_kbeffect.vars.dontKenBurns = true;
					app.storageFunctions.writeLocal(app.ext.store_thesev_kbeffect.vars.dontKenBurns,true);
					//app.u.dump(app.ext.store_thesev_kbeffect.vars.dontKenBurns);
					//app.u.dump('Now ken burns is: '); app.u.dump(app.storageFunctions.readLocal);
				}
				else {
					app.ext.store_thesev_kbeffect.vars.dontKenBurns = false;
					app.storageFunctions.writeLocal(app.ext.store_thesev_kbeffect.vars.dontKenBurns,false);
					//app.u.dump(app.ext.store_thesev_kbeffect.vars.dontKenBurns);
				}
			},
		
			kbEffectize :  function($container) {
				
				var $canvas = $('canvas',$container);
				//app.u.dump("kbeffectize");

					if(!$canvas.data('kenburns')){
					
					if(!app.ext.store_thesev_kbeffect.vars.dontKenBurns) {
										
						$('.masonImage',$container).hide();
						
						var pid = $canvas.data('pid');
						
						var images = $canvas.data('images') || [];
						
						if(images.length == 0){
							var tmp = []
							for(var i = 1; i<10; i++){
								if(app.data["appProductGet|"+pid]["%attribs"]["zoovy:prod_image"+i]){
									tmp.push(app.u.makeImage({
										"name":app.data["appProductGet|"+pid]["%attribs"]["zoovy:prod_image"+i],
										"b":"ffffff"
										}));
									}
								}
							
							for(var i=0; i<3;i++){
								for(var index in tmp){
									images.push(tmp[index]);
									}
								}
							
							$canvas.data('images',images);
							
							}
						
						$canvas.show();
						$canvas.kenburns({
							"images":images,
							"background_color":"#FFFFFF",
							"zoom_level":5,
							"padding":1.5,
							"fade_time": 500,
							"display_time":3000
							});
							
							}
							
							
						$container.on('mouseleave.kenburns', function(){
							app.ext.store_thesev_kbeffect.a.kbUnEffectize($(this));
							$(this).off('mouseleave.kenburns');
							});
						}
				},
				
			kbUnEffectize : function($container){
				//app.u.dump("uneffectize");
				var $canvas = $('canvas',$container);
				clearInterval($canvas.data('kenburns'));
				$canvas.removeData('kenburns');
				$canvas.hide();
				$('.masonImage', $container).show();
				$container.on('mouseenter.kenburns', function(){
					app.ext.store_thesev_kbeffect.a.kbEffectize($(this));
					$(this).off('mouseenter.kenburns');
					});
				}
			
			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
			
		}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
			kenburnsInit : function($context) {
				$('.masonImage', $context).each(function() {
					//app.u.dump('Width: '); app.u.dump($(this).innerWidth()); app.u.dump('Height'); app.u.dump($(this).innerHeight()); 
					$(this).append(app.u.makeImage({
						"name"	: $(this).data('imgsrc'),
						"w"		: $(this).innerWidth(),
						"h"		: $(this).innerHeight(),
						"b"		: "tttttt",
						"tag"	: 1
					}));
					$(this).removeClass('masonImage');
				});
				$('.kenburnsMouseover',$context).on('mouseenter.kenburns', function(){
					app.ext.store_thesev_kbeffect.a.kbEffectize($(this));
					$(this).off('mouseenter.kenburns');
					$(this).removeClass('kenburnsMouseover');
					});
			},
			
			catImageInit : function($context) {
				$('.catMasonImage', $context).each(function() {
					//app.u.dump($(this));
					app.u.dump('Width: '); app.u.dump($(this).parent().innerWidth()); app.u.dump('Height'); app.u.dump($(this).parent().innerHeight()); 
					$(this).append(app.u.makeImage({
						"name"	: $(this).data('imgsrc'),
						"w"		: $(this).innerWidth(),
						"h"		: $(this).innerHeight(),
						"b"		: "tttttt",
						"tag"	: 1
					}));
					//$(this).removeClass('catMasonImage');
				});
			},
			
			whoIsKenBurns : function() {
				//app.u.dump('This is ken burns: '); app.u.dump(app.storageFunctions.readLocal("dontKenBurns"));
				if(app.storageFunctions.readLocal("dontKenBurns") === true) {
					app.u.dump('Ken Burns is local');
					app.ext.store_thesev_kbeffect.vars.dontKenBurns = true;
				}
				else {
					app.u.dump('Ken Burns is NOT local');
					app.ext.store_thesev_kbeffect.vars.dontKenBurns = false;
				}
	
			}
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