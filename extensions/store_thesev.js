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

	vars : { 
		repeater : 0
	//	theSevDestinations : [
	//		{Z:"United States", ISO:"US", ISOX:"USA"},
	//		{Z:"Albania", ISO:"AL", ISOX:"AL"}
	//	]
	},

	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
				
				app.ext.store_thesev.u.runFooterCarousel();
				
				app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID));
					//if these functions have been run before, no need to run them again
					if(!$context.data('masonized')){
						app.ext.store_thesev.u.runMasonry($context);
						app.ext.store_thesev.u.addMushPot($context);
						app.ext.store_thesev.u.addHomeBanner($context);
						$context.data('masonized',true);
					}
					//except for masonry, if it has been run it is best to reload it to be sure elements don't stack
					//else if($context.data('masonized')) {
					//	app.ext.store_thesev.u.reloadMasonry($context);
					//	app.u.dump('RELOADED');
					//}
					
					var title = "Home";
					app.ext.store_thesev.u.setTitle(title);
				}]);
				
				app.rq.push(['templateFunction','categoryTemplate','onCompletes',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID));
					if(!$context.data('masonized')){
						app.ext.store_thesev.u.runMasonry($context);
						$context.data('masonized',true);
					}
					else if($context.data('masonized')) {
						app.ext.store_thesev.u.reloadMasonry($context);
					}
		
		//Title is forced to default until they are set properly or customer decides the "GOO-0" format is what will display
					var title = "";
		//			var title = app.data["appPageGet|"+infoObj.navcat]['%page'].page_title;
					if(title){
						app.ext.store_thesev.u.setTitle(title);
					}
					else {
						title = "";
						app.ext.store_thesev.u.setTitle();
					}
						
				}]); 
				
				app.rq.push(["templateFunction","customerTemplate","onCompletes",function(infoObj){
					var $sideline = $('.customerSideline', $(app.u.jqSelector('#',infoObj.parentID)));
//					app.u.dump("SIDELINING");
//					app.u.dump(infoObj);
					if(infoObj.show == "createaccount"){
						$sideline.hide();
						}
					else {
						$sideline.show();
						}
						
					var title = "My theSev";
					app.ext.store_thesev.u.setTitle(title);
				}]);
					
				app.rq.push(["templateFunction","companyTemplate","onCompletes",function(infoObj){
					var title = "theSev Information";
					app.ext.store_thesev.u.setTitle(title);
				}]);
				
				
				
				app.rq.push(['templateFunction','productTemplate','onCompletes',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID));
					if(!$context.data('masonized')){
						app.ext.store_thesev.u.runProductPageCarousel($context);
						app.ext.store_thesev.u.sansReviews($context);
						$context.data('masonized',true);
					}
					
					var title = app.data["appProductGet|"+infoObj.pid]['%attribs']['zoovy:prod_name']
					if(title){
						app.ext.store_thesev.u.setTitle(title);
					}
					else { //use default title
						title = "";
						app.ext.store_thesev.u.setTitle(title);
					}
					
			//		app.ext.store_thesev.u.runScroll($context);
				}]);
				
				app.rq.push(['templateFunction','collectionsTemplate','onCompletes',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID));
					if(!$context.data('masonized')){
						app.ext.store_thesev.u.runMasonry($context);
						app.ext.store_thesev.u.addMushPot($context);
						$context.data('masonized',true);
					}
					else if($context.data('masonized')) {
						app.ext.store_thesev.u.reloadMasonry($context);
					}
		
		//Title is forced to default until they are set properly or customer decides the "GOO-0" format is what will display
					var title = "theSev Collections";
		//			var title = app.data["appPageGet|"+infoObj.navcat]['%page'].page_title;
					if(title){
						app.ext.store_thesev.u.setTitle(title);
					}
					else {
						title = "theSev Collections";
						app.ext.store_thesev.u.setTitle(title);
					}
					
				}]);
				
				app.rq.push(['templateFunction', 'pageNotFoundTemplate','onCompletes',function(infoObj){
					var title = "Page not found";
					app.ext.store_thesev.u.setTitle(title);
				}]);
				
				app.rq.push(['templateFunction', 'checkoutTemplate','onCompletes',function(infoObj){
					var title = "Check out";
					app.ext.store_thesev.u.setTitle(title);
				}]);
				
				app.rq.push(['templateFunction', 'searchTemplate','onCompletes',function(infoObj){
					var title = "Search";
					app.ext.store_thesev.u.setTitle(title);
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
	
			showContactPID : function (pid) {
				//app.u.dump('the pid is: '); app.u.dump(pid);
				$('#contactFormOID', 'div', '#contactForm', '#mainContentArea_company').val('SKU: '+pid);
			},

			//copied from app-quickstart.js so additional parameter could be used to assign the error location (for diff. login screens)
			loginFrmSubmit : function(email,password,errorDiv)	{
				var errors = '';
				$errorDiv = errorDiv.empty(); //make sure error screen is empty. do not hide or callback errors won't show up.

				if(app.u.isValidEmail(email) == false){
					errors += "Please provide a valid email address<br \/>";
					}
				if(!password)	{
					errors += "Please provide your password<br \/>";
					}
				if(errors == ''){
					app.calls.appBuyerLogin.init({"login":email,"password":password},{'callback':'authenticateBuyer','extension':'myRIA'});
					app.calls.refreshCart.init({},'immutable'); //cart needs to be updated as part of authentication process.
//					app.calls.buyerProductLists.init('forgetme',{'callback':'handleForgetmeList','extension':'store_prodlist'},'immutable');
					app.model.dispatchThis('immutable');
					}
				else {
					$errorDiv.anymessage({'message':errors});
					}
				showContent('customer',{'show':'myaccount'})
			}, //loginFrmSubmit
			
			wishListPopVal : function($this, $parent) {
				$("input[name='qty']", $parent).val($this.val());
				app.u.dump('++++++++++++++'); app.u.dump($this.siblings($("input[name='qty']")).val());
			},
			
			//shows modal in checkout with international shipping agreement when US is not selected and Ship to billing is checked
			//doesn't close unless agree checkbox is checked
			showInterShipWarningBill : function(val){
				//console.debug(val);
				//app.u.dump('Bill value: '); app.u.dump($('select[name="bill/countrycode"]').val()); 
				//app.u.dump('Ship value: '); app.u.dump($('select[name="ship/countrycode"]').val());
				//app.u.dump('Check value: '); app.u.dump($('input[name="want/bill_to_ship"]:checked').length);
				
				if($('input[name="want/bill_to_ship"]:checked').length == 1 && $('select[name="bill/countrycode"]').val() != "US") {
					$('#shippingWarning').show();
					$('#interShippingModal').dialog({'modal':'true', 'title':'','width':868, height:570, closeOnEscape: false, "dialogClass" : "intShippingModal", open:function(event, ui) {$(".ui-dialog-titlebar-close").hide();}});
				}
				else { //nothing needs to happen, destination is 'Merca, but jus in case...
					$('#shippingWarning').hide();
				}
			}, //showInterShipWarningBill
			
			//shows modal in checkout with international shipping agreement when US is not selected and Ship to billing isn't checked
			//doesn't close unless agree checkbox is checked
			showInterShipWarningShip : function(val){
				if ($('select[name="ship/countrycode"]').val() != "US") {
					$('#shippingWarning').show();
					$('#interShippingModal').dialog({'modal':'true', 'title':'','width':868, height:570, closeOnEscape: false, "dialogClass" : "intShippingModal", open:function(event, ui) {$(".ui-dialog-titlebar-close").hide();}});
				}
				else if ($('input[name="want/bill_to_ship"]:checked').length == 0 && $('select[name="ship/countrycode"]').val() != "US") {
					('#shippingWarning').hide();
				}
			}, //showInterShipWarningShip
			
			//form for international shipping agreement acceptance in checkout
			interShipWarningAcceptClick : function() {
				if($('#interShipAgreeCheck').is(':checked')) {
					$('#noCheckWarning').hide();
					$('#interShippingModal').dialog('close');
					$('.interShippingModalCont').css('height','1045px');
				}
				else {
					$('#noCheckWarning').show();
					$('.interShippingModalCont').css('height','1070px');
				}
			},
			
			//activates drop down menus
			showDropDown : function($tag) {
				if(!$tag.data('timeoutNoShow') || $tag.data('timeoutNoShow') === 'false') {
					var $dropdown = $('.dropdown',$tag);
					var height = 0;
					$dropdown.show();
					if($dropdown.data('height')) {
						height = $dropdown.data('height');
					}
					else {
						$dropdown.children().each(function() {
							height += $(this).outerHeight();
						});
					}
					if($tag.data('timeout') && $tag.data('timeout') !== 'false') {
						clearTimeout($tag.data('timeout'));
						$tag.data('timeout','false');
					}
					$dropdown.stop().animate({'height':height+'px'},500);
					$('#mainContentArea').css('opacity','.25');
					return true;
				}
				return false;
			},
			
			hideDropDown : function($tag) {
				$('.dropdown',$tag).stop().animate({'height':'0px'},500);
				if($tag.data('timeout') && $tag.data('timeout') !== 'false') {
					$tag.data('timeout');
					$tag.data('timeout','false');
				}
				$tag.data('timeout',setTimeout(function() {
					$('.dropdown',$tag).hide();
					$('#mainContentArea').css('opacity','1');
				},500));
				return true;
			},
			
			//expands product page work with me container to show additional content (if it is there)
			//by removing and adding classes to top section element to show and hide functional elements
			showMoreWork : function(pid, _tag) {
				var $context = $(app.u.jqSelector("#","productTemplate_"+pid));
				$('.workWithMe', $context).removeClass('addMoreWork').addClass('addLessWork');
			},
			
			//(revearse of showMoreWork function) reduces product page work with me container to hide additional content
			//by removing and adding classes to top section element to show and hide functional elements
			showLessWork : function(pid, _tag) {
				var $context = $(app.u.jqSelector("#","productTemplate_"+pid));
				$('.workWithMe', $context).removeClass('addLessWork').addClass('addMoreWork');
			},
		
			//places customer reviews on the product page
			showReviews : function(pid, action, hide, show) {
				var $context = $('#productTemplate_'+app.u.makeSafeHTMLId(pid));
				
				app.u.dump('SHOW REVIEW');
			
				$(action, $context).animate(1000);
				setTimeout(function() {
					$(hide, $context).hide();
					$(show, $context).show();
				}, 250);
			}, //END showReviews
			
			//reverts customer reveiws to the product description on the product page
			showDescription : function(pid, action, hide, show) {
				var $context = $('#productTemplate_'+app.u.makeSafeHTMLId(pid));
				
				app.u.dump('SHOW DESC');
				app.u.dump(pid);
				
				$(action, $context).animate(1000);
				setTimeout(function() {
					$(hide, $context).hide();
					$(show, $context).show();
				}, 250);
			} //END showDescription
		
			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
		
			//adds brand image under product image on product page, if one is populated in image99
			addBrandToProductPage : function($tag, data) {
				app.u.dump(data.value['%attribs']['zoovy:prod_image99']);
				if(data.value['%attribs'] && data.value['%attribs']['zoovy:prod_image99']) {
					$tag.append(app.u.makeImage({
						"name"	: data.value['%attribs']['zoovy:prod_image99'],
						"w"		: 125,
						"h"		: 50,
						"b"		: "tttttt",
						"tag"	: 1
					}));
				}
				else { //no image, no showee
				}
			},
			
				//value is set to ISO and sent to API that way. however, cart object returned is in 'pretty'.
				//so a check occurs to set selectedCountry to the selected ISO value so it can be 'selected'
		//	countriesAsOptions : function($tag,data)	{
//				app.u.dump("BEGIN app.ext.cco.renderFormats.countriesAsOptions");
//				app.u.dump(" -> Country: "+data.value);
		//		var r = '';
		//		var L = app.data.appCheckoutDestinations['@destinations'].length;
			//var L = app.ext.cco.vars.theSevDestinations.length;
//				app.u.dump(" -> number of countries = "+L);
		//		for(var i = 0; i < L; i += 1)	{
		//			r += "<option value='"+app.data.appCheckoutDestinations['@destinations'][i].ISO+"' ";
			//r += "<option value='"+app.ext.cco.vars.theSevDestinations[i].ISO+"' ";
		//			if(data.value == app.data.appCheckoutDestinations['@destinations'][i].ISO)	{
		//				r += " selected='selected' ";
		//				}
		//			r += ">"+app.data.appCheckoutDestinations['@destinations'][i].Z+"</option>";
		//			}
				
		//		$tag.html(r);
			//dump for cco...
			//app.u.dump('{Z="'+app.data.appCheckoutDestinations['@destinations'][i].Z+'", ISO="'+app.data.appCheckoutDestinations['@destinations'][i].ISO+'", ISOX="'+app.data.appCheckoutDestinations['@destinations'][i].ISOX+'"}');
		//		},

			//calculates and displays difference till order total is $100
			tillFreeShipping : function($tag, data) {

				if (data.value < 100) {
					var diff = app.u.formatMoney(100-data.value,'$',2,true);
					app.u.dump('DIFF IS: '); app.u.dump(diff);
					$tag.append('<p>Only <span class="primaryCT">'+diff+"</span> 'till your shipping is *FREE!</p>");
				}
				else {
					$tag.append('<p>Congratulations, your shipping is <span class="primaryCT">*FREE!</span></p>');
				}
			},
			
			//puts "Work with me" text into div if present, and if more than 240 characters, adds ellipses and button
			//to expand container to show rest of content.
			showMoreWork : function($tag, data) {
				var pid = data.value.pid;
				var $context = $(app.u.jqSelector("#","productTemplate_"+pid));

				if(data.value['%attribs']['zoovy:prod_detail']) {
					//if there's content, add it; someone will read it.
					var work = data.value['%attribs']['zoovy:prod_detail'];
					$('p', '.workWithMe', $context).text(work);
					//if there's more content than space, make it obvious and add stuff to show that content
					if(work.length > 191) {
						$('p', '.workWithMe', $context).append("<span class='elipsis'>. . . .</span>");
						$tag.addClass('addMoreWork');
					}
				}
				else {
					// to be used if workWithMe section should be hidden when no content in zoovy:prod_detail.
						//otherwise the message currently in the index will be shown as a default.
					//$tag.css('display','none');
					//$('.workTape', $context).hide();
				}
				//app.u.dump('The text is: '); app.u.dump(work.length); app.u.dump(work);
			},
		
			productImages : function($tag,data)	{
//				app.u.dump("BEGIN myRIA.renderFormats.productImages ["+data.value+"]");
				var pdata = app.data['appProductGet|'+data.value]['%attribs']; //short cut to product object in memory.
				var imgs = ''; //all the html for all the images. appended to $tag after loop.
				var imgName; //recycled in loop.
				var pid = data.value;
				for(i = 1; i < 30; i += 1)	{
//					app.u.dump('-------->'); app.u.dump(pid);
					imgName = pdata['zoovy:prod_image'+i];
//					app.u.dump(" -> "+i+": "+imgName);
					if(app.u.isSet(imgName)) {
						imgs += "<li onClick='app.ext.store_product.u.showPicsInModal({\"pid\":\""+pid+"\",\"int\":\""+i+"\"});' class='floatLeft'><div class='productPageBoxShadower pointer'></div><img src='"+app.u.makeImage({'tag':0,'w':280,'h':280,'name':imgName,'b':'ffffff'})+"' \/><\/li>";
					}
				}
				$tag.append(imgs);
			}, //productImages
		
			//randomly assigns size of category and product list divs for masonry layout
			//hides any product in list with inventory < 1
			pickClass : function($tag, data) {
				//ASSIGN SIZING CLASSES
				//app.u.dump($tag);
				var previous = app.ext.store_thesev.vars.repeater;
				var a = Math.random()*4+1;
				var b = a.toString().split('.');
				var number = b[0];
				
				if (number != previous){ //go on with your bad self
				}
				else if (number == previous && number == 4) {
					number = number - 1;		//it's the same but also already the highest number, make it smaller 
				}
				else {
					number = number + 1;		// it's the same, make it one bigger
				}
				app.ext.store_thesev.vars.repeater = number; //store this iteration to compare next time
				//app.u.dump('Previous is: '); app.u.dump(previous);
				//app.u.dump('Number is: '); app.u.dump(number);
				
				//decide which size the cat/prod list element should be
				switch(number) {
					case '1'	:	$tag.addClass('masonOne'); break;
					case '2'	:	$tag.addClass('masonTwo'); break;
					case '3'	:	$tag.addClass('masonThree'); break;
					case '4'	:	$tag.addClass('masonFour'); break;
						//for some reason the above logic concatenates the numbers to be added sometimes,
						//default case adds largest image because that case is acceptable for repetition.
					default		:	$tag.addClass('masonOne');
				}
				
				//HIDE ZERO INVENTORY IN PRODUCT LISTS
				var pid = data.value.pid;
				//app.u.dump('***PID:'); app.u.dump(pid);
				if(data.value['@inventory'] && data.value['@inventory'][pid]) {
					var inventory = data.value['@inventory'][pid]['inv'];
					if(inventory < 1) {
						$tag.addClass('hideMe');
						//$('.boxShadower',$tag).css('background','red');
					}
				}
				
				//SHOW ZERO INVENTORY CLASS IN SEARCH RESULTS (only if prod_outofstock is remove from elastic not filter in store search)
				//app.u.dump(data.value); //['%attribs']['user:prod_outofstock']
				if(data.value['%attribs'] && data.value['%attribs']['user:prod_outofstock'] == 1) {
					$('.invGone',$tag).css('display','block');
				}
			},
			
			processListAlt : function($tag,data){
//			app.u.dump("BEGIN renderFormats.processList");
			$tag.removeClass('loadingBG');
			if(data.bindData.loadsTemplate)	{
				var $o, //recycled. what gets added to $tag for each iteration.
				int = 0;
				for(var i in data.value)	{
					if(data.bindData.limit && int >= Number(data.bindData.limit)) {break;}
					else	{
						$o = app.renderFunctions.transmogrify(data.value[i],data.bindData.loadsTemplate,data.value[i]);
						if(typeof $o == 'object')	{
							if(data.value[i].id){} //if an id was set, do nothing.
							else	{$o.attr('data-obj_index',i)} //set index for easy lookup later.
							$tag.append($o);
							}
						else	{
							$tag.anymessage({'message':'Issue creating template using '+data.bindData.loadsTemplate,'persistant':true});
							}
						}
					int += 1;				
					}
				
				}
			else	{
				$tag.anymessage({'message':'Unable to render list item - no loadsTemplate specified.','persistant':true});
				}
				//hides or shows the order message based on whether orders are present or not.
				app.u.dump('Hide if set function running');
				if($('.orderHistoryList').children().length > 0){
					//app.u.dump('Hiding .ordersNoOrdersMess');
					$('.ordersNoOrdersMess').hide();
				}
				else{
					//app.u.dump('Showing .ordersNoOrdersMess. Length is =< 0');
					$('.ordersNoOrdersMess').show().css('display','block');
				}
			}, //processListAlt
			
			getInfo : function($tag, data) {
				//app.u.dump('*** '); app.u.dump(data.value);
			}
			
		}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
		
	/*		runScroll : function($context) {
				$('.prodSummaryWrapper', $context).jScrollPane({
					autoReinitialise : true
					});
			},
	*/	
			setTitle : function(title) {
				if(title && typeof title === "string") {
					//This is what is expected
				}
				else {
					//set title
					title = "theSev Merchandise"
				}
				document.title = title+" | theSev";
			}, //end setTitle
			
			addHomeBanner : function($context) {
				var a = Math.random()*6+1;
				var b = a.toString().split('.');
				var number = b[0];
				var image = ""; //used to hold image path in switch

				//decide which img to append to the bannerLi
				switch(number) {
					case '1'	:	image = '<img alt="the sev grand opening" src="images/thesev-grandopening-black_316x316.jpg" height:316; width:316; />'; 	break;
					case '2'	:	image = '<img alt="the sev grand opening" src="images/thesev-discountshipping-teal_316x316.jpg" height:316; width:316; />'; break;
					case '3'	:	image = '<img alt="the sev grand opening" src="images/thesev-grandopening-pink_316x316.jpg" height:316; width:316; />';	 	break;
					case '4'	:	image = '<img alt="the sev grand opening" src="images/thesev-discountshipping-black_316x316.jpg" height:316; width:316; />';break;
					case '5'	:	image = '<img alt="the sev grand opening" src="images/thesev-grandopening-teal_316x316.jpg" height:316; width:316; />';	 	break;
					case '6'	:	image = '<img alt="the sev grand opening" src="images/thesev-discountshipping-pink_316x316.jpg" height:316; width:316; />';	break;
				}
				
				$('li:nth-child(3)', $context).after($('.bannerLi',$context));
				$('.bannerLi',$context).append(image);
				$('.bannerLi',$context).show();
			},
			
			addMushPot : function($context) {
				$('li:nth-child(4)', $context).after($('.mushPotLi',$context));
				$('.mushPotLi',$context).show();

				//if collection, only show on top level cat
				var $catID = ($context[0]['attributes']['data-catsafeid'].value);
				if($catID.indexOf('.50_collections.') != -1) {
					$('.mushPotLi',$context).hide();
				}
			},
			
			handleAppLoginCreate : function($form)	{
				if($form)	{
					var formObj = $form.serializeJSON();
					
					if(formObj.pass !== formObj.pass2) {
						app.u.throwMessage('Sorry, your passwords do not match! Please re-enter your password');
						return;
					}
					
					var tagObj = {
						'callback':function(rd) {
							if(app.model.responseHasErrors(rd)) {
								$form.anymessage({'message':rd});
							}
							else {
								showContent('customer',{'show':'myaccount'});
								app.u.throwMessage(app.u.successMsgObject("Your account has been created!"));
							}
						}
					}
					
					formObj._vendor = "thesev";
					app.calls.appBuyerCreate.init(formObj,tagObj,'immutable');
					app.model.dispatchThis('immutable');
				}
				else {
					$('#globalMessaging').anymessage({'message':'$form not passed into myRIA.u.handleBuyerAccountCreate','gMessage':true});
				}
			},
	
			sansReviews : function($context) {
				if($('.noReviews', $context).children().length === 0) {
					app.u.dump('No reviews. Running existing messge check');
					if(($('.reviewsCont', $context).length === 0) || ($('.reviewsCont', $context).length === null)) {
						app.u.dump('No message exists. Display message');
						$('.beFirst', $context).append(
						'<p class="reviewsCont">'
						+'Be the <strong>First</strong> to Review This Product!'
						+'</p>');
						app.u.dump('Reveiw message displaying for : '+$context);
					}
					else {
						app.u.dump('Message exists, do nothing');
					}
				}
				else {
					app.u.dump('Reviews exist, function aborted. Reviews length: '+$('.reviewsBind').children.length);
				}
			},
		
/*
P.pid, P.templateID are both required.
modal id is fixed. data-pid is updated each time a new modal is created.
if a modal is opened and p.pid matches data-pid, do NOT empty it. could be a modal that was closed (populated) but not submitted. preserve data.
if the P.pid and data-pid do not match, empty the modal before openeing/populating.
!!! incomplete.
*/
			showReviewFrmInline : function(P, hide)	{
				if(!P.pid || !P.templateID)	{
					app.u.dump(" -> pid or template id left blank");
					}
				else	{
					var $parent = $('#review-wrapper'+P.pid);
					//if no review wrapper has been created before, create one. 
					if($parent.length == 0)	{
						app.u.dump(" -> wrapper doesn't exist. create it.");
//						app.u.dump($("<div \/>").attr({"id":"review-wrapper",'data-pid':P.pid}));
//						app.u.dump(('.prodWriteReviewContainer','#productTemplate_'+P.pid));
						$parent = $("<div \/>").attr({"id":"review-wrapper"+P.pid,'data-pid':P.pid}).appendTo('.prodWriteReviewContainer','#productTemplate_'+P.pid);
						}
					else	{
						app.u.dump(" -> use existing wrapper. empty it.");
						//this is a new product being displayed in the viewer.
						$parent.empty();
						}
//	$parent.dialog({modal: true,width: ($(window).width() > 500) ? 500 : '90%',height:500,autoOpen:false,"title":"Write a review for "+P.pid});
//the only data needed in the reviews form is the pid.
//the entire product record isn't passed in because it may not be available (such as in invoice or order history, or a third party site).
					$parent.append(app.renderFunctions.transmogrify({id:'review-wrapper_'+P.pid},P.templateID,{'pid':P.pid}));
					$(hide,'#productTemplate_'+P.pid).css('display','none');
					$('.prodWriteReviewContainer','#productTemplate_'+P.pid).css('display','block');
					}
				},
		
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
			
			runProductPageCarousel : function($context) {
				var $target = $('.prodPageCarousel', $context);
				if($target.data('isCarousel')) {} //only make it a carousel once (even though it's in the footer)
				setTimeout(function(){	//for whatever reason, caroufredsel needs to be executed after a moment
					$target.carouFredSel({
						responsive	:	true,
						width		: 	'100%',
						height		:	280,
						items: { 	
							visible	:	{
											min	: 1,
											max	: 1
										},
							width	:	280,//'variable',
							height	:	'variable'
						},
						swipe: {
							onMouse	: 	true,
							onTouch	: 	true
						},
						auto		: 	false,
						next		:	'.prodPrev',
						prev		:	'.prodNext'
					});
				},2000);
			},
			
			runMasonry : function($context) {
				var $target = $('.masonList', $context);
				//initialize
				setTimeout(function() {
					var masonry = $target.masonry({
						columnWidth		:	177,
						itemSelector	:	'.anyMasonry',
						gutter			:	0,
						isFitWidth		:	true,
						transitionDuration : '2s',
						containerStyle	:
						{
							position	:	'relative',
							opacity		:	1,
							transition	:	'opacity 1s',
							'-webkit-transition' : 'opacity 2s 2s'
						}
					});
					//$target.data('masonry',masonry);
				},2000);
			}, //end runMasonry
			
			reloadMasonry : function($context) {
				var $target = $('.masonList', $context);
				setTimeout(function() {
					var masonry = $target.masonry('reloadItems');
				},2000);
			},
		
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