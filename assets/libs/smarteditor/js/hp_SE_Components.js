var compid = 1;
nhn.husky.SE_Components = jindo.$Class({
	name: "SE_Components",
	$init: function(elAppContainer){
		this._assignHTMLObjects(elAppContainer);
	},
	_assignHTMLObjects:function(elAppContainer){
		this.oDropdownLayer = jindo.$$.getSingle("DIV.husky_seditor_Components_layer",elAppContainer);
		this.oButton1 = jindo.$$("BUTTON.husky_se2m_component_btn1",this.elDropdownLayer);
		this.oButton2 = jindo.$$("BUTTON.husky_se2m_component_btn2",this.elDropdownLayer);
		this.oButton3 = jindo.$$("BUTTON.husky_se2m_component_btn3",this.elDropdownLayer);
		this.oButton4 = jindo.$$("BUTTON.husky_se2m_component_btn4",this.elDropdownLayer);
		this.oButton5 = jindo.$$("BUTTON.husky_se2m_component_btn5",this.elDropdownLayer);
		this.oCancletButton = jindo.$$("BUTTON.husky_se2m_component_close",this.elDropdownLayer);
		this.aComponentList=jindo.$$("UL.husky_se2m_component_list",this.elDropdownLayer);
		
	},
	$ON_MSG_APP_READY : function(){
		this.oApp.exec("REGISTER_UI_EVENT",["Components","click","SE_TOGGLE_COMPONENT_LAYER"]);
		this.oApp.registerBrowserEvent(this.oCancletButton, 'click' , 'CANCEL_LAYER');
		this.oApp.registerBrowserEvent(this.oButton1, 'click' , 'BTN1_EVENT');
		this.oApp.registerBrowserEvent(this.oButton2, 'click' , 'BTN2_EVENT');
		this.oApp.registerBrowserEvent(this.oButton3, 'click' , 'BTN3_EVENT');
		this.oApp.registerBrowserEvent(this.oButton4, 'click' , 'BTN4_EVENT');
		this.oApp.registerBrowserEvent(this.oButton5, 'click' , 'BTN5_EVENT');
	},
	$ON_SE_TOGGLE_COMPONENT_LAYER:function(){
		//this.oTextField.value="";
		//this.oSelection=this.oApp.getSelection();
		//this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER",[this.elDropdownLayer,null,"MSG_COMPONENTS_LAYER_SHOWN",[],"MSG_COMPONENTS_LAYER_HIDDEN",[""]]);
		
		//this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER",[this.elDropdownLayer,null,"SELECT_UI",["components_elements"],"DESELECT_UI",["components_elements"]]);
		//this.oApp.exec("MSG_NOTIFY_CLICKCR",["symbol"]);
		this.oApp.exec("TOGGLE_TOOLBAR_ACTIVE_LAYER",[this.oDropdownLayer],null,"SELECT_UI",[],"HIDE_ACTIVE_LAYER",[]);
	},
	
	$ON_EVENT_EDITING_AREA_KEYUP:function(o){
		/*editor event 시, arguments 추가 : HR 임성호*/
		this.oApp.htOptions.keyUpCall(o);
		
	},
		
	$ON_CANCEL_LAYER:function(){
		this.oApp.registerBrowserEvent(this.oCancletButton,"click","HIDE_ACTIVE_LAYER",[]);
		
	},
	
	$ON_BTN1_EVENT:function(){
		this.oApp.exec("PASTE_HTML",["<input type='text' class='nuss nu_text' style='cursor: pointer; width:90%; color: #393f48; padding: 3px 10px; border: 2px solid #929ba7; border-radius: 5px;'>"]);
		this.oApp.exec("HIDE_ACTIVE_LAYER",[]);
	},
	$ON_BTN2_EVENT:function(){
		this.oApp.exec("PASTE_HTML",["<textarea  class='nuss nu_textarea'  style='cursor: pointer; width:90%; height:100%;'></textarea>"]);
		this.oApp.exec("HIDE_ACTIVE_LAYER",[]);
	},
	$ON_BTN3_EVENT:function(){
		this.oApp.exec("PASTE_HTML",["<select  class='nuss nu_select'  style='cursor: pointer; width:90%;'></select>"]);
		this.oApp.exec("HIDE_ACTIVE_LAYER",[]);
	},
	$ON_BTN4_EVENT:function(){
//		this.oApp.exec("PASTE_HTML",["<input type='checkbox' value='1' class='nuss nu_check'  style='cursor: pointer;'>"]);
		this.oApp.exec("PASTE_HTML",["<input type='text' class='nuss nu_text' style='cursor: pointer; width:50px;'>"]);
		this.oApp.exec("HIDE_ACTIVE_LAYER",[]);
	},
	$ON_BTN5_EVENT:function(){
		compid++;
		this.oApp.exec("PASTE_HTML",["<label style='cursor: pointer;' class='nuss nu_raio'><input style='cursor: pointer;' type='radio' name='nussradio"+compid+"'>사용</label><label  style='cursor: pointer;' class='nuss nu_check'><input style='cursor: pointer;' type='radio' name='nussradio"+compid+"'>미사용</label>"]);
		this.oApp.exec("HIDE_ACTIVE_LAYER",[]);
	}
});