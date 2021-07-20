nhn.husky.SE2M_SCharacter=jindo.$Class({
	name:"SE2M_SCharacter",
	$ON_MSG_APP_READY:function(){
		this.oApp.exec("REGISTER_UI_EVENT",["sCharacter","click","TOGGLE_SCHARACTER_LAYER"]);
	},
	_assignHTMLObjects:function(b){
		b=jindo.$(b)||document;
		this.elDropdownLayer=jindo.$$.getSingle("DIV.husky_seditor_sCharacter_layer",b);
		this.oTextField=jindo.$$.getSingle("INPUT",this.elDropdownLayer);
		this.oInsertButton=jindo.$$.getSingle("BUTTON.se2_confirm",this.elDropdownLayer);
		this.aCloseButton=jindo.$$("BUTTON.husky_se2m_sCharacter_close",this.elDropdownLayer);
		this.aSCharList=jindo.$$("UL.husky_se2m_sCharacter_list",this.elDropdownLayer);
		var a=jindo.$$.getSingle("UL.se2_char_tab",this.elDropdownLayer);
		this.aLabel=jindo.$$(">LI",a);
	},
		
	$LOCAL_BEFORE_FIRST:function(c){
		this.bIE=jindo.$Agent().navigator().ie;
		this._assignHTMLObjects(this.oApp.htOptions.elAppContainer);
		//this.charSet=[];
		//this.charSet[0]=unescape("").replace(/(\S{4})/g,function(e){return"%u"+e}).split(" ");
		//this.charSet[1]=unescape("").replace(/(\S{4})/g,function(e){return"%u"+e}).split(" ");
		//this.charSet[2]=unescape("").replace(/(\S{4})/g,function(e){return"%u"+e}).split(" ");
		//this.charSet[3]=unescape("").replace(/(\S{4})/g,function(e){return"%u"+e}).split(" ");
		//this.charSet[4]=unescape("").replace(/(\S{4})/g,function(e){return"%u"+e}).split(" ");
		//this.charSet[5]=unescape("").replace(/(\S{4})/g,function(e){return"%u"+e}).split(" ");
		var b=jindo.$Fn(this.oApp.exec,this.oApp).bind("INSERT_SCHARACTERS",[this.oTextField.value]);
		jindo.$Fn(b,this).attach(this.oInsertButton,"click");
		this.oApp.exec("SET_SCHARACTER_LIST",[this.charSet]);
		for(var a=0;a<this.aLabel.length;a++){
			var d=jindo.$Fn(this.oApp.exec,this.oApp).bind("CHANGE_SCHARACTER_SET",[a]);
			jindo.$Fn(d,this).attach(this.aLabel[a].firstChild,"mousedown");
		}
		for(var a=0;a<this.aCloseButton.length;a++){
			this.oApp.registerBrowserEvent(this.aCloseButton[a],"click","HIDE_ACTIVE_LAYER",[]);
		}
		this.oApp.registerBrowserEvent(this.elDropdownLayer,"click","EVENT_SCHARACTER_CLICKED",[]);
	},
		
	$ON_TOGGLE_SCHARACTER_LAYER:function(){
		this.oTextField.value="";
		this.oSelection=this.oApp.getSelection();
		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER",[this.elDropdownLayer,null,"MSG_SCHARACTER_LAYER_SHOWN",[],"MSG_SCHARACTER_LAYER_HIDDEN",[""]]);
		this.oApp.exec("MSG_NOTIFY_CLICKCR",["symbol"]);
	},
		
	$ON_MSG_SCHARACTER_LAYER_SHOWN:function(){
		this.oTextField.focus();
		this.oApp.exec("SELECT_UI",["sCharacter"])
	},
	
	$ON_MSG_SCHARACTER_LAYER_HIDDEN:function(){
		this.oApp.exec("DESELECT_UI",["sCharacter"]);
	},
	
	$ON_EVENT_SCHARACTER_CLICKED:function(b){
		var a=nhn.husky.SE2M_Utils.findAncestorByTagName("BUTTON",b.element);
		if(!a||a.tagName!="BUTTON"){
			return;
		}
		if(a.parentNode.tagName!="LI"){
			return;
		}
		var c=a.firstChild.innerHTML;
		if(c.length>1){
			return;
		}
		this.oApp.exec("SELECT_SCHARACTER",[c]);
		b.stop();
	},
	
	$ON_EVENT_SE2_BLOCKQUOTE_LAYER_CLICK:function(b){
		var a=nhn.husky.SE2M_Utils.findAncestorByTagName("BUTTON",b.element);
		if(!a||a.tagName!="BUTTON"){
			return;
		}
		var c=a.className;
		this.oApp.exec("APPLY_BLOCKQUOTE",[c])
	},
	
	
	$ON_SELECT_SCHARACTER:function(a){
		this.oTextField.value+=a;
		if(this.oTextField.createTextRange){
			var b=this.oTextField.createTextRange();
			b.collapse(false);b.select();
		}
		else{
			if(this.oTextField.selectionEnd){
				this.oTextField.selectionEnd=this.oTextField.value.length;
				this.oTextField.focus();
			}
		}
	},
	
	$ON_INSERT_SCHARACTERS:function(){
		this.oApp.exec("RECORD_UNDO_BEFORE_ACTION",["INSERT SCHARACTER"]);
		this.oApp.exec("PASTE_HTML",[this.oTextField.value]);
		this.oApp.exec("FOCUS");
		this.oApp.exec("RECORD_UNDO_AFTER_ACTION",["INSERT SCHARACTER"]);
		this.oApp.exec("HIDE_ACTIVE_LAYER",[]);
	},
	
	$ON_CHANGE_SCHARACTER_SET:function(b){
		for(var a=0;a<this.aSCharList.length;a++){
			if(jindo.$Element(this.aLabel[a]).hasClass("active")){
				if(a==b){
					return;
				}
				jindo.$Element(this.aLabel[a]).removeClass("active");
			}
		}
		this._drawSCharList(b);
		jindo.$Element(this.aLabel[b]).addClass("active");
	},
	
	$ON_SET_SCHARACTER_LIST:function(a){
		this.charSet=a;
		this.bSCharSetDrawn=new Array(this.charSet.length);
		this._drawSCharList(0);
	},
	
	_drawSCharList:function(c){
		if(this.bSCharSetDrawn[c]){
			return;
		}
		this.bSCharSetDrawn[c]=true;
		var a=this.charSet[c].length;
		var f=new Array(a);
		this.aSCharList[c].innerHTML="";
		var b,e;
		for(var d=0;d<a;d++){
			f[d]=jindo.$("<LI>");
			if(this.bIE){
				b=jindo.$("<BUTTON>");
				b.setAttribute("type","button");
			}
			else{
				b=jindo.$("<BUTTON>");
				b.type="button";
			}
			e=jindo.$("<SPAN>");
			e.innerHTML=unescape(this.charSet[c][d]);
			b.appendChild(e);
			f[d].appendChild(b);
			f[d].onmouseover=function(){
				this.className="hover";
			};
			f[d].onmouseout=function(){
				this.className="";
			};
			this.aSCharList[c].appendChild(f[d]);	
		}
	}
});






nhn.husky.SE2M_Quote=jindo.$Class({
	name:"SE2M_Quote",
	htQuoteStyles_view:null,
	$init:function(){
		var a=nhn.husky.SE2M_Configuration.Quote||{};
		var b=a.sImageBaseURL;
		this.nMaxLevel=a.nMaxLevel||14;
		this.htQuoteStyles_view={};
		this.htQuoteStyles_view.se2_quote1="";
		this.htQuoteStyles_view.se2_quote2="";
		this.htQuoteStyles_view.se2_quote3="";
		this.htQuoteStyles_view.se2_quote4="";
		this.htQuoteStyles_view.se2_quote5="";
		this.htQuoteStyles_view.se2_quote6="";
		this.htQuoteStyles_view.se2_quote7="";
		this.htQuoteStyles_view.se2_quote8="";
		this.htQuoteStyles_view.se2_quote10="";
	},
	_assignHTMLElements:function(){
		this.elDropdownLayer=jindo.$$.getSingle("DIV.husky_seditor_blockquote_layer",this.oApp.htOptions.elAppContainer);
		this.aLI=jindo.$$("LI",this.elDropdownLayer)
	},
	$ON_REGISTER_CONVERTERS:function(){
		this.oApp.exec("ADD_CONVERTER",["DB_TO_IR",jindo.$Fn(function(a){
			a=a.replace(/<(blockquote)[^>]*class=['"]?(se2_quote[0-9]+)['"]?[^>]*>/gi,"<$1 class=$2>");
			return a
		},this).bind()]);
		this.oApp.exec("ADD_CONVERTER",["IR_TO_DB",jindo.$Fn(function(a){
			var b=this.htQuoteStyles_view;a=a.replace(/<(blockquote)[^>]*class=['"]?(se2_quote[0-9]+)['"]?[^>]*>/gi,
				function(e,d,c){return"<"+d+" class="+c+' style="'+b[c]+'">'});return a},this).bind()]);
		this.htSE1toSE2Map={"01":"1","02":"2","03":"6","04":"8","05":"9","07":"3","08":"5"}},
		$LOCAL_BEFORE_FIRST:function(){this._assignHTMLElements();this.oApp.registerBrowserEvent(this.elDropdownLayer,"click","EVENT_SE2_BLOCKQUOTE_LAYER_CLICK",[]);this.oApp.delayedExec("SE2_ATTACH_HOVER_EVENTS",[this.aLI],0)},
		$ON_MSG_APP_READY:function(){this.oApp.exec("REGISTER_UI_EVENT",["quote","click","TOGGLE_BLOCKQUOTE_LAYER"])},
		$ON_TOGGLE_BLOCKQUOTE_LAYER:function(){this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER",[this.elDropdownLayer,null,"SELECT_UI",["quote"],"DESELECT_UI",["quote"]]);this.oApp.exec("MSG_NOTIFY_CLICKCR",["quote"])},
		$ON_EVENT_SE2_BLOCKQUOTE_LAYER_CLICK:function(b){var a=nhn.husky.SE2M_Utils.findAncestorByTagName("BUTTON",b.element);if(!a||a.tagName!="BUTTON"){return}var c=a.className;this.oApp.exec("APPLY_BLOCKQUOTE",[c])},
		$ON_APPLY_BLOCKQUOTE:function(a){if(a.match(/(se2_quote[0-9]+)/)){this._wrapBlock("BLOCKQUOTE",RegExp.$1)}else{this._unwrapBlock("BLOCKQUOTE")}this.oApp.exec("HIDE_ACTIVE_LAYER",[])},_isExceedMaxDepth:function(b){var a=function(c){var f=c.firstChild;var d=0;var e=0;if(!f){if(c.tagName&&c.tagName==="BLOCKQUOTE"){return 1}else{return 0}}while(f){if(f.nodeType===1){d=a(f);if(f.tagName==="BLOCKQUOTE"){d+=1}if(e<d){e=d}if(e>=this.nMaxLevel){return e}}f=f.nextSibling}return e};return(a(b)>=this.nMaxLevel)},_unwrapBlock:function(a){var b=this.oApp.getSelection();var c=b.commonAncestorContainer;while(c&&c.tagName!=a){c=c.parentNode}if(!c){return}this.oApp.exec("RECORD_UNDO_BEFORE_ACTION",["CANCEL BLOCK QUOTE",{sSaveTarget:"BODY"}]);while(c.firstChild){c.parentNode.insertBefore(c.firstChild,c)}c.parentNode.removeChild(c);this.oApp.exec("RECORD_UNDO_AFTER_ACTION",["CANCEL BLOCK QUOTE",{sSaveTarget:"BODY"}])},_wrapBlock:function(D,H){var y,q,u,x,c=/BODY|TD|LI/i,l,A,d,g,j,B,a,z,K,f,b,r,G,h,J,C;this.oApp.exec("RECORD_UNDO_BEFORE_ACTION",["BLOCK QUOTE",{sSaveTarget:"BODY"}]);y=this.oApp.getSelection();if(y.startContainer===y.endContainer){if(y.startContainer.nodeType===1&&y.startContainer.tagName==="P"){if(nhn.husky.SE2M_Utils.isBlankNode(y.startContainer)||nhn.husky.SE2M_Utils.isFirstChildOfNode("IMG",y.startContainer.tagName,y.startContainer)||nhn.husky.SE2M_Utils.isFirstChildOfNode("IFRAME",y.startContainer.tagName,y.startContainer)){q=y.getLineInfo(true)}else{q=y.getLineInfo(false)}}else{var s=y.startContainer;var k=y.startOffset;var F=y.endContainer;var E=y.endOffset;var m=y.placeStringBookmark();var e=y.getStringBookmark(m);var n=e.parentNode;var w=nhn.husky.SE2M_Utils.findAncestorByTagName("P",n);var v=["TD","BODY"];if(!w){for(var G=0,o=v.length;G<o;G++){w=nhn.husky.SE2M_Utils.findAncestorByTagName(v[G],n);if(w){break}}var t=document.createElement("P");var I=w.childNodes;for(var G=0,o=I.length;G<o;G++){t.appendChild(I[0])}w.appendChild(t)}y.removeStringBookmark(m);y=this.oApp.getSelection();y.setStart(s,k);y.setEnd(F,E);q=y.getLineInfo(true)}}else{q=y.getLineInfo(false)}u=q.oStart;x=q.oEnd;if(u.bParentBreak&&!c.test(u.oLineBreaker.tagName)){l=u.oNode.parentNode}else{l=u.oNode}if(x.bParentBreak&&!c.test(x.oLineBreaker.tagName)){A=x.oNode.parentNode}else{A=x.oNode}y.setStartBefore(l);y.setEndAfter(A);d=this._expandToTableStart(y,A);if(d){A=d;y.setEndAfter(d)}d=this._expandToTableStart(y,l);if(d){l=d;y.setStartBefore(d)}d=l;y.fixCommonAncestorContainer();g=y.commonAncestorContainer;if(y.startContainer==y.endContainer&&y.endOffset-y.startOffset==1){j=y.startContainer.childNodes[y.startOffset]}else{j=y.commonAncestorContainer}B=this._findParentQuote(j);if(B){B.className=H;return}while(!g.tagName||(g.tagName&&g.tagName.match(/UL|OL|LI|IMG|IFRAME/))){g=g.parentNode}while(d&&d!=g&&d.parentNode!=g){d=d.parentNode}if(d==g){a=g.firstChild}else{a=d}z=y._document.createElement(D);if(H){z.className=H;this._setStyle(z,this.htQuoteStyles_view[H])}g.insertBefore(z,a);y.setStartAfter(z);y.setEndAfter(A);y.surroundContents(z);if(this._isExceedMaxDepth(z)){alert(this.oApp.$MSG("SE2M_Quote.exceedMaxCount").replace("#MaxCount#",(this.nMaxLevel+1)));this.oApp.exec("HIDE_ACTIVE_LAYER",[]);K=z.nextSibling;f=z.parentNode;b=z.childNodes;r=[];jindo.$Element(z).leave();for(G=0,h=b.length;G<h;G++){r[G]=b[G]}for(G=0,h=r.length;G<h;G++){if(!!K){jindo.$Element(K).before(r[G])}else{jindo.$Element(f).append(r[G])}}return}y.selectNodeContents(z);if(z&&z.parentNode&&z.parentNode.tagName=="BODY"&&!z.nextSibling){J=y._document.createElement("P");J.innerHTML="&nbsp;";z.parentNode.insertBefore(J,z.nextSibling)}if(nhn.husky.SE2M_Utils.isBlankNode(z)){var p=jindo.$Agent().navigator();if(p.chrome){z.innerHTML="<p>&nbsp;</p>"}else{z.innerHTML="&nbsp;"}y.selectNodeContents(z);y.collapseToStart();y.select()}this.oApp.exec("REFRESH_WYSIWYG");setTimeout(jindo.$Fn(function(L){C=L.placeStringBookmark();L.select();L.removeStringBookmark(C);this.oApp.exec("FOCUS")},this).bind(y),0);this.oApp.exec("RECORD_UNDO_AFTER_ACTION",["BLOCK QUOTE",{sSaveTarget:"BODY"}]);return z},_expandToTableStart:function(c,d){var e=c.commonAncestorContainer;var a=null;var b=false;while(d&&!b){if(d==e){b=true}if(/TBODY|TFOOT|THEAD|TR/i.test(d.tagName)){a=this._getTableRoot(d);break}d=d.parentNode}return a},_getTableRoot:function(a){while(a&&a.tagName!="TABLE"){a=a.parentNode}return a},_setStyle:function(a,b){a.setAttribute("style",b);a.style.cssText=b},
		$ON_EVENT_EDITING_AREA_KEYDOWN:function(c){var a,b;if("WYSIWYG"!==this.oApp.getEditingMode()){return}if(8!==c.key().keyCode){return}a=this.oApp.getSelection();a.fixCommonAncestorContainer();b=this._findParentQuote(a.commonAncestorContainer);if(!b){return}if(this._isBlankQuote(b)){c.stop(jindo.$Event.CANCEL_DEFAULT);a.selectNode(b);a.collapseToStart();jindo.$Element(b).leave();a.select()}},
		$ON_EVENT_EDITING_AREA_KEYUP:function(c){var a,b,d;if("WYSIWYG"!==this.oApp.getEditingMode()){return}if(46!==c.key().keyCode){return}a=this.oApp.getSelection();a.fixCommonAncestorContainer();b=this._findParentQuote(a.commonAncestorContainer);if(!b){return false}if(!b.nextSibling){c.stop(jindo.$Event.CANCEL_DEFAULT);d=a._document.createElement("P");d.innerHTML="&nbsp;";jindo.$Element(b).after(d);setTimeout(jindo.$Fn(function(e){var f=e.placeStringBookmark();e.select();e.removeStringBookmark(f)},this).bind(a),0)}},_isBlankQuote:function(c){var n,f,g,m,l=this.oApp.oNavigator.chrome,d=this.oApp.oNavigator.safari,a=function(o){o=o.replace(/[\r\n]/ig,"").replace(unescape("%uFEFF"),"");if(o===""){return true}if(o==="&nbsp;"||o===" "){return true}return false},b=function(o){if(o.nodeType===3&&a(o.nodeValue)){return true}if((o.tagName==="P"||o.tagName==="SPAN")&&(a(o.innerHTML)||o.innerHTML==="<br>")){return true}return false},e=function(o){if((jindo.$$("tr",o)).length===0){return true}return false};if(a(c.innerHTML)||c.innerHTML==="<br>"){return true}if(l||d){var j=jindo.$$("TABLE",c),h=j.length,k;for(g=0;g<h;g++){k=j[g];if(e(k)){jindo.$Element(k).leave()}}}f=c.childNodes;for(g=0,m=f.length;g<m;g++){n=f[g];if(!b(n)){return false}}return true},_findParentQuote:function(a){return this._findAncestor(jindo.$Fn(function(c){if(!c){return false}if(c.tagName!=="BLOCKQUOTE"){return false}if(!c.className){return false}var b=c.className;if(!this.htQuoteStyles_view[b]){return false}return true},this).bind(),a)},_findAncestor:function(a,b){while(b&&!a(b)){b=b.parentNode}return b}});