	$.widget("jj.KEditor",{
        "options": {
        	valblFormatTmplatNo: "",
        	bDragMode: false,
        	bEditMode: true,
        	focusColor: "red",
        	backColor: "gray",
        	adminShow: false,
        	getDocUrl :     "/cm/s/ke/valblFormatTmplatCtr/getValblFormatTmplat.do",
        	setFullDocUrl : "/cm/s/ke/valblFormatTmplatCtr/saveValblFormatTmplat.do",
        	setDocUrl :     "/cm/s/ke/valblFormatTmplatCtr/saveValblFormatTmplatCn.do",
        	getSqlUrl : "/cm/s/ke/valblFormatBsisDtaMappingCtr/getBsisDtaMappingSqlList.do",
        	queryUrl  : "/cm/s/saas/documentInputCtr/getInputsList.do",
        	menuUrl  : "/appspeed/smsys/auth/k-editor.menu.html",
        	libPath: "https://www.appspeed.net:8444/appspeed/libs/k-editor/",
        	width : "100%",
        	height : "600px",
        	sheetTabMoveUp: true,
        	lockMessage:"",
        	rowCount : 51,
        	colCount : 13,
        	busnsSeCode: "NCMA0031N00220",
        	loadCallBack: function() {}
        },
        _create: function () {
	        this.spread ="";
	        this.nameBox ="";
	        this.formulaBar ="";
	        this.toolbar ={};
	        this.spreadAce ={};
	        this.exportSet ={};
	        this.bLoopChk =true;
	        this.aSyncCnt =0;
	        this.sqlPara = {};
	        this.docInfo = {};
	        this.el ={};
	        this.dataSource ={};
	        this.editMode ="pencil";
	        this.modals = {};
	        this.setFocusClicked = false;

	    	var _this = this
	    		,_obj = this.element
	        	,vOption = this.options
	        ;



	    	_obj.addClass("KEDITOR");

	    	if (!_obj.attr("id")){_obj.uniqueId();}

	    	var id = _obj.attr("id");

	    	Jinja.KEditors[id] = this;

	    	var setfontstyle = '<div class="setfontstyle"  style="display: none; font-style: normal; font-variant: normal; font-weight: 700; font-stretch: normal; font-size: 11pt; line-height: normal; font-family: Arial;"></div>';
	    	$(setfontstyle).appendTo(_obj);

	    	var _ContextMenu = ''
	        +'<ul  class="spreadContextMenu dropdown-menu" role="menu" style="display: none">'
	        +'    <li><a class="localize" data-action="cut">잘라내기</a></li>'
	        +'    <li><a class="localize" data-action="copy">복사</a></li>'
	        +'    <li><a class="localize" data-action="paste">붙여넣기</a></li>'
	        +'    <li class="context-header divider"></li>'
	        +'    <li class="context-header"><a class="localize" data-action="insert">삽입</a></li>'
	        +'    <li class="context-header"><a class="localize" data-action="delete">삭제</a></li>'
	        +'    <li class="context-cell divider"></li>'
	        +'    <li class="context-cell context-merge"><a class="localize" data-action="merge">병합</a></li>'
	        +'    <li class="context-cell context-unmerge"><a class="localize" data-action="unmerge">병합해제</a></li>'
	        +'</ul>'
	    	$(_ContextMenu).appendTo(_obj);


			var html = ''
				+'<div class="ke-body"> '
/*				+' <div class="tableTitle"> '
				+'    <label>서식 : </label> '
				+'    <span class="docSheet"><ul></ul></span> '
				+' </div> '
				+' <header><h3><span class="keicon"></span><label class="titleName"></label></h3></header> '
*/
				+' <div class="spreadDocFrame"> '
				+' <div class="MenuArea"></div> '
				+' <div class="option-row"> '
				+' 	<div class="btn-group nameBoxArea"> '
				+'       <input type="text" class="nameBox" title="이름상자"/> '
				+' 	  <a type="button" class="btn btn-danger dropdown-toggle nameBoxBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" title="정의된 이름상자의 목록을 보여줍니다"> '
				+' 	    <span class="caret"></span> '
				+' 	  </a> '
				+' 	  <ul class="dropdown-menu customNameList"></ul> '
				+' 	</div> '
				+'     <div class="formulaBar" contenteditable="true" spellcheck="false" ></div> '
				+' </div> '
				+'  <div class="spreadDoc"></div> '
				+'  <input class="hidden" type="file" name="files[]" multiple="" id="import_excel_file" accept=".xlsx,.xls" /> '
				+'  <div class="spreadJsonDocArea" > '
				+'     <button class="jsonSource">source</button> '
				+'     <button class="jsonData">data</button> '
				+'     <div class="spreadAce"  style="display:block;width:100%; height: 600px;" ></div> '
				+'  </div> '
				+'</div> '
				+'</div> ';

	        $(html).appendTo(_obj);

			var _ubHtml = '<!-- 유비리포트 뷰어 --> '
			+'<!-- UbiReport Samnple code : START --> '
			+'<div id="ubiprint" class="ubiprint" style="display:none; position:absolute; border: solid 1px #aaa; background-color:#909090; top:30%; left:50%; width:300px; height:150px; margin-left:-150px; margin-top:-75px;"> '
			+'	<div id="ubititle" style="border-bottom: solid 1px #aaa; top:0px; left:0px; width:100%; height:30px; background-color:#666666;"> '
			+'		<table height="30" cellpadding="0" cellspacing="0"> '
			+'			<tr> '
			+'				<td width="100%" style="color:#FFFFFF; font-family:맑은고딕; font-size:9pt; font-weight:bold;"> '
			+'					&nbsp;&nbsp;리포트 설정 '
			+'				</td> '
			+'				<td width="100" align="right"> '
			+'					<input type="button" value="X" class="goUbiCancel" XXonclick=\'document.getElementById("ubiprint").style.display="none";\' style="color:#FFFFFF; background-color:transparent; border:0; font-size:12pt; font-weight:bold;"> '
			+'				</td> '
			+'			</tr> '
			+'		</table> '
			+'	</div> '
			+'	<div style="position:relative; top:10px; left:10px; font-weight:bold; color:white; width:90%;"> '
			+'		<table cellpadding="0" cellspacing="0" style="width:100%;"> '
			+'			<tr> '
			+'				<td width="100px"> '
			+'				템플릿 선택 :  '
			+'				</td> '
			+'				<td width="*"> '
			+'				  <input type="radio" class="ubiland"  XXXid="ubiland" name="ubiorientation" value="L">가로&nbsp;&nbsp;&nbsp; '
			+'				  <input type="radio" class="ubiport"  XXid="ubiport" name="ubiorientation" value="P" checked>세로 '
			+'				</td> '
			+'			</tr> '
			+'			<tr> '
			+'				<td width="100%" colspan=2 style="text-align:center; padding-top:30px; color:black;"> '
			+'				  <input type="button" value="인쇄" class="goUbiReport" XXonclick="goUbiReport();">&nbsp;&nbsp;&nbsp; '
			+'				  <input type="button" value="취소" class="goUbiCancel" XXonclick="";\'> '
			+'				</td> '
			+'			</tr> '
			+'		</table> '
			+'	</div> '
			+'<div> '
			+' '
			+'<div id="ubipopup" class="ubipopup" style="display:none; border: solid 1px #aaa; position:absolute; top:100px; left:100px; width:800px; height:630px"> '
			+'	<div id="ubititle" style="border-bottom: solid 1px #aaa; position:absolute; top:0px; left:0px; width:800px; height:30px; background-color:#666666;"> '
			+'		<table height="30" cellpadding="0" cellspacing="0"> '
			+'			<tr> '
			+'				<td width="700" style="color:#FFFFFF; font-family:맑은고딕; font-size:9pt; font-weight:bold;"> '
			+'					&nbsp;&nbsp;유비리포트 미리보기 '
			+'				</td> '
			+'				<td width="100" align="right"> '
			+'					<input type="button" value="X" onclick="closeReport()" style="color:#FFFFFF; background-color:transparent; border:0; font-size:12pt; font-weight:bold;"> '
			+'				</td> '
			+'			</tr> '
			+'		</table> '
			+'	</div> '
			+'	<div class="ubireport" id="ubireport"> '
			+'	<form class="ubi_frm_' + id +'" name="ubi_frm_'+ id +'" id="ubi_frm_' + id +'" method="POST" action="/cm/ubireport/ubireport_ke.jsp" target="POP_REPORT"> '
			+'		<input type="hidden" class="runtimedata" id="runtimedata"  name="runtimedata" value=""> '
			+'		<input type="hidden" class="jrffile" id="jrffile" name="jrffile" value=""> '
			+'	</form> '
			+'	</div> '
			+'</div>	'
			+'<!-- UbiReport Samnple code : END -->'
			;

		    $(_ubHtml).appendTo(_obj);

		    _obj.find(".goUbiReport").click(function(e) {
		    	_this.goUbiReport();
		    });
		    _obj.find(".goUbiCancel").click(function(e) {
		    	_obj.find('.ubiprint').css("display", "none");
		    });

        	_this.nameBox = _obj.find(".nameBox");
        	_this.formulaBar = _obj.find(".formulaBar");

        	$(".MenuArea",_obj).load(_this.options.menuUrl +  "?"+_this.getTimeStamp(), function(e) {
        		_this.toolbar = _obj.find(".ke-topmenu");

        		_this._menuBind();
        		/* 풀다운 메뉴의 지연 시간을 부여하여 사용자가 메뉴를 벗어나도 다시 찾을수 있도록 처리함 */
    	        _this._on(".ke-topmenu > ul.nav.navbar-nav > li.dropdown",
    	        		{
    	        			"mouseenter": function(e) {
    	        				if (!$(e.currentTarget).find(">.dropdown-menu").hasClass("active")){
    	        					_obj.find(".ke-topmenu .dropdown-menu.show").css("display","none").removeClass("active show");
    	        				}
    	        				$(e.currentTarget).find(">.dropdown-menu").css("display","block").addClass("active show");

    	        			},
    	        			"mouseleave": function(e) {
    	        				$(e.currentTarget).find(">.dropdown-menu").removeClass("active");
    	        				setTimeout(function () {
    	        					if (!$(e.currentTarget).find(">.dropdown-menu").hasClass("active")) {
    	        						$(e.currentTarget).find(">.dropdown-menu").removeClass("show").css("display","none");
    	        					}
    	        			    }, 500);

    	        			}

    	        });
    	        /* 풀다운 메뉴 지연시간 부여 종료 */
    	        _this._on(".ke-topmenu > ul.nav.navbar-nav > li.dropdown > ul.dropdown-menu li",
    	        		{
    	        			"click": function(e) {
	        					_obj.find(".ke-topmenu .dropdown-menu.show").css("display","none").removeClass("active show");
    	        			}

    	        });

        	});

 	       	_obj.find(".ke-body").css("width", _this.options.width);
 	       	_obj.find(".spreadDoc").css("height", _this.options.height);

        	_this.spread = new GcSpread.Sheets.Spread(_obj.find(".spreadDoc")[0], {

        	}) ;

            _this.defaultStyle = new GcSpread.Sheets.Style();
            _this.defaultStyle.font = "11pt 맑은 고딕";
            // sheet.setGridlineOptions({color:"#d7dae0", showVerticalGridline: bchk, showHorizontalGridline: bchk});
            /*
            var defaultStyle = sheet.getDefaultStyle();
            if (!style) {
                style = new GcSpread.Sheets.Style();
            }
            if (!style.font) {
                style.font = defaultStyle.font || "11pt 맑은 고딕";
			*/

        	var fbx = new GcSpread.Sheets.FormulaTextBox(_this.formulaBar[0]);

        	fbx.spread(_this.spread);

	        _this.spread.canUserEditFormula(true);
	        _obj.find(".spreadAce").uniqueId();

        	_this._setEditMode();

	        if (_this.options.bDragMode){
	        	_this._setDragMode();
	        	} else {

	        	}

	        /* 조회모드에서 select객체등이 편집가능셀로 이동하는 문제를 해결하기 위해서
	         * 조회모드에서는 drag 기능을 비 활성 시킴
	         * 2016-11-23 . 채용 임헌명과장 문제제기한 사항
	         */
	        if (_this.options.bEditMode) {
	        	_this._setSpreadSheetTabMoveUp();
        		_this.spread.canUserDragDrop(true);
	        }
	        else {
        		_this.spread.canUserDragDrop(false);
        	}



	        _this._createEvent();
	        _this.setCulture("ko");
			_this.docInfo = {
				"valblFormatTmplatNo": ""
				,"valblFormatNm"	: "새 서식"
				,"valblFormatDc"	: "일 만듬"
				,"valblFormatBusnsSeCode"	: "NCMA0031N00220"
				,"writngYy": "2017"
				,"formSize": "formtype1"
			}

	        _this._initDoc();
	        _this.dataSource = new GcSpread.Sheets.CellBindingSource({});

	        if (_this.options.valblFormatTmplatNo){
	        	_this.getDoc(_this.options.valblFormatTmplatNo, function(d) {
	        	});
	        } else {

	        }
	        _this.options.loadCallBack();
        },
        _createEvent: function(){
	    	var _this = this, _obj = this.element, vOption = this.options;

			// 셀편집을 시작할때 크기가 40이상이면 여러불을 입력하는것으로 판단해서 엔터키 동작을 제어한다.
			/*
			_this.spread.bind($.wijmo.wijspread.Events.EditStarting, function(event, data) {
				if(data.sheet.getCellRect(data.sheet._activeRowIndex, data.sheet._activeColIndex).height > 50) {
				   data.sheet.removeKeyMap($.wijmo.wijspread.Key.enter, false, false, false, false);
				}else {
				   data.sheet.removeKeyMap($.wijmo.wijspread.Key.enter, false, false, false, false);
				   data.sheet.addKeyMap($.wijmo.wijspread.Key.enter, false, false, false, false,$.wijmo.wijspread.SpreadActions.commitInputNavigationDown);
				}
			});
			*/


			/* 줄바꿈행에 대해서 편집이 발생하면 해당줄을 새로 계산한다 */

	    	this.spread.bind($.wijmo.wijspread.Events.ValueChanged, function (event, data) {

	    		var row = data.row, col = data.col, sheet = data.sheet;



	    		if (sheet.getCell(row, col).wordWrap()) {

	    			sheet.autoFitRow(row);

	    		}

	    	});


	    	this.spread.bind($.wijmo.wijspread.Events.ActiveSheetChanged, function (event, data) {

	    		/* 시트가 활성될때마다 기본스타일을 항상 업데이트 한다
	    		 * 시트가 생성될때 해주면 좋지만 해당 이벤트를 감지할수 없어서 이렇게 처리함
	    		 * 김성민 2016-11-08
	    		 */
	    		data.newSheet.setDefaultStyle(_this.defaultStyle, GcSpread.Sheets.SheetArea.viewport);

	    		/* 시트의 초기  gridline를 설정하는 방법이 제공되지 않아서
	    		 * 서식저장형식에서 관련정보를 획득하여 사용자가 설정했는지 안했는지 판단한다
	    		 * 김성민 2016-11-08
	    		 */
	    		if (!_this.spread.toJSON().sheets[data.newSheet._name].gridline) {
	    			data.newSheet.setGridlineOptions({color:"#d7dae0", showVerticalGridline: true, showHorizontalGridline: true});
	    		} // end

	    		if (data.newSheet.activeColViewportIndex == 0 && data.newSheet.activeRowViewportIndex == 0){
	    			data.newSheet.setSelection(0,0,1,1);
	    		}

	    		//alert("시트활성");


	    		data.newSheet.addKeyMap(113, false, false, false, false, function () {
	    			if (!data.newSheet.isEditing()) {
	    				data.newSheet.startEdit();
	    			}
	    		});


	    	});

	    	/* 채용쪽 요구사항에 의해서 메시지 를 표시하고 수정이 반영되지 않음  2016-10-14 김성민 */
			this.spread.bind($.wijmo.wijspread.Events.ClipboardChanging, function(event, data) {

				if (vOption.lockMessage){
					alert(vOption.lockMessage);
					data.cancel = true;
				}
			});

	    	/* 채용쪽 요구사항에 의해서 메시지 를 표시하고 수정이 반영되지 않음  2016-10-14 김성민 */
			this.spread.bind($.wijmo.wijspread.Events.EditStarting, function(event, data) {

				if (vOption.lockMessage){
					alert(vOption.lockMessage);
					data.cancel = true;
				}

				var cellType = data.sheet.getCellType(data.row, data.col);
				if(cellType.typeName == 'TextAreaCellType') {
					cellType.height = data.sheet.getRowHeight(data.row, GcSpread.Sheets.SheetArea.viewport);
				}
			});

			/* 에디터를 선택할때 툴바를 바꿈 */
			this.spread.bind($.wijmo.wijspread.Events.EnterCell, function(event, data) {
				var cellType = data.sheet.getCellType(data.row, data.col);

				if(cellType.typeName == 'TextAreaCellType') {
					data.sheet.removeKeyMap($.wijmo.wijspread.Key.enter, false, false, false, false);
				}else {
					data.sheet.addKeyMap($.wijmo.wijspread.Key.enter, false, false, false, false,$.wijmo.wijspread.SpreadActions.commitInputNavigationDown);
				}

				_this._CellFocusToolbar(event, data);
			});

			/* 에디터를 선택할때 툴바를 바꿈 */
			this.spread.bind($.wijmo.wijspread.Events.CellClick, function(event, data) {
				var cellType = data.sheet.getCellType(data.row, data.col);

				if(cellType.typeName == 'TextAreaCellType') {
					data.sheet.removeKeyMap($.wijmo.wijspread.Key.enter, false, false, false, false);
				}else {
					data.sheet.addKeyMap($.wijmo.wijspread.Key.enter, false, false, false, false,$.wijmo.wijspread.SpreadActions.commitInputNavigationDown);
				}

				_this._CellFocusToolbar(event, data);
			});

			this.spread.bind($.wijmo.wijspread.Events.ButtonClicked, function(event, args) {
				var cellType = args.sheet.getCellType(args.row, args.col);

				if(cellType instanceof $.wijmo.wijspread.ButtonCellType) {
					var text = args.sheet.getCellType(args.row, args.col).text();

					text = text.replace(/ /g, '');

					if(text && text == '추가') {
						args.sheet.addRows((args.row + 2), 1);
						args.sheet.getRow((args.row + 2)).locked(true);
						//fromRow, fromColumn, toRow, toColumn, rowCount, columnCount, option
						args.sheet.copyTo((args.row + 1), 0, (args.row + 2), 0, 1, args.col + 1, GcSpread.Sheets.CopyToOption.All);

						for (var i=0; i<args.sheet.getColumnCount(); i++){
							var _lock  = args.sheet.getCell(args.row+1,i).locked();

							if (!_lock){
								args.sheet.getCell(args.row+2,i).locked(false);
							}
						}

						//삭제 버튼 추가
			            var deleteButton = new GcSpread.Sheets.ButtonCellType();

			            deleteButton.text("삭제");
			            deleteButton.marginLeft(1);
			            deleteButton.marginTop(1);
			            deleteButton.marginRight(1);
			            deleteButton.marginBottom(1);

			            args.sheet.setCellType((args.row + 2), args.col, deleteButton, GcSpread.Sheets.SheetArea.viewport);
			            //삭제 버튼 추가
			            args.sheet.getCell(args.row + 2, args.col).vAlign(GcSpread.Sheets.VerticalAlign.center);
		            	args.sheet.getCell(args.row + 2, args.col).hAlign(GcSpread.Sheets.HorizontalAlign.center);

						for(var x=0; x<args.col; x++) {
							var formula = args.sheet.getFormula((args.row + 2), x);
							if(formula && formula.length > 0) {

							}else {
								args.sheet.getCell((args.row + 2), x).value(null);
							}
						}
					}else if(text && text == '삭제') {
						// 만일 삭제버튼이 마지막이라면 삭제하지 않는다.
						// args.sheet
						args.sheet.isPaintSuspended(true);

						var bfCellType = args.sheet.getCellType(args.row, args.col);

						var _getTag, _getPath;

						for (var nc = args.col; nc >=0 ; nc--){
							_getTag = args.sheet.getTag(args.row, nc);
							_getPath = args.sheet.getCell(args.row, nc).bindingPath();

							if (_getTag || _getPath){
								break;
							}
						}

						if 	(_getPath){
							for (var nc = args.col; nc >=0 ; nc--){
								args.sheet.getCell(args.row, nc).value(null);
								args.sheet.setTag(args.row, nc, null);
							}
						} else if (_getTag){
							if(bfCellType instanceof $.wijmo.wijspread.ButtonCellType) {
								args.sheet.deleteRows(args.row, 1);
							}
						} else {
							  args.sheet.deleteRows(args.row, 1);
							 //_this.getCustomNameValue("결과값");
						}
						args.sheet.isPaintSuspended(false);
						_this.spread.repaint();
					}else if(text && text == '검색') {
						_this.clearDataBind();
						_this.setDataBind();
					}else if(text.indexOf("증빙")>= 0 || text.indexOf("파일")>= 0  ) {
						fileGroupNo = args.sheet.getValue( args.row,args.col);

						if (fileGroupNo == null){fileGroupNo = "";}

						STD.Popup.filePopup(this, fileGroupNo, function(groupId) {
						  	args.sheet.setValue( args.row,args.col, groupId);
						  	//args.sheet.getCellType(args.row, args.col)._buttonBackColor = "yellow"

						  	_this.getFileList(groupId, function(data) {
						  		args.sheet.getCellType(args.row, args.col)._text = "파일("+data.rows.fileList.length+")";
						  		_this.spread.repaint();
						  	});
					   	 });
					}
				}
			});

			this.spread.bind($.wijmo.wijspread.Events.SelectionChanged, function(event, data) {
				if (_this.editMode == "table") {
					_this.tableDraw();
				}
			});


/*
			//EditEnded
			//this.spread.bind($.wijmo.wijspread.Events.EditEnding  , function(event, data) {
			this.spread.bind($.wijmo.wijspread.Events.EditEnded  , function(event, data) {

				// 테이블 내에서 수식을 편집한 경우에 테이블 내부 포물러로 저장시킴
				if (data.editingText == null) return;

				var
				sheet = data.sheet
				,table =  sheet.findTable(data.row, data.col)
				,cell  =  sheet.getCell(data.row, data.col)
				;

				try{

					//data.cancel;
					if (table) {
						var colId = data.col - table._col;
	               	    //table._columns[fi].name(ti);

		                if (table.dataRange().contains(data.row, data.col, 1, 1)){
						    //alert("테이블이 인지되어 테이블 포큘러로 처리합니다.");
		                	//if (data.editingText.substr(0,1)== "="){
		                		//table._columns[colId].dataField(null);
		                		try{
		                			//table._columns[colId].dataField(null);
		                			//table.setColumnDataFormula(colId,data.editingText);
		                			//sheet.setValue(data.row, data.col,null);
		                			//sheet.setValue(data.row, data.col, "'"+data.editingText, GcSpread.Sheets.SheetArea.viewport);
		                			//table._columns[colId].dataField(null);
		                			if (data.editingText.substr(0,1)== "="){
		                				//table.setColumnDataFormula(colId,"");
		                				table.setColumnDataFormula(colId, data.editingText);
		                			//table.refresh();
		                			//_this.spread.repaint();

		                	//		 var doc = _this.toJson();
		                	//		 doc = JSON.stringify(doc)
		                	//		 //jQuery.parseJSON(v)
		                	//		 var doc = JSON.parse(doc);
		                	//		_this.fromJson(doc);
		                	//
		                	//		}
		                			//alert(data.editingText+" : 표의 컬럼 연산식이 변경되었습니다.");



		                			//sheet.reset();
		                		} catch(e){
		                			alert("해당수식이 부적합하여 처리가 되지 않았습니다. 수식을 수정해주세요.");
		                			//컬럼의 포큘러지정형식오류 - "+ data.editingText+" >>->> "+ e);
		                			sheet.setValue(data.row, data.col, "'"+data.editingText, GcSpread.Sheets.SheetArea.viewport);
		                		}

		                	//}
		                }

					}
				 } catch (ex) {
					 alert("해당수식이 부적합하여 처리가 되지 않았습니다. 수식을 수정해주세요.");
					 // alert("수식EditEnding - "+ data.editingText+" >> -"+ex);
					 //sheet.setValue(data.row, data.col,"'"+data.editingText, GcSpread.Sheets.SheetArea.viewport);
                    //alert(!!ex.message ? ex.message : ex);
                }
			});
*/
			//엑셀 카피

			this.spread.bind($.wijmo.wijspread.Events.ClipboardPasted, function(sender, args) {
				spreadCopyForm(args, clipHtml, _this.spread);
			});

			$(document).bind('paste', function(e) {
				if(window.clipboardData && window.clipboardData.getData) { // IE
				}else if(e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) { //chrome
					clipHtml = e.originalEvent.clipboardData.getData('text/html');
					e.originalEvent.clipboardData.setData('text/html', '');
				}
			});

			// 이름상자를 지정합니다
			_this.nameBox.keyup(function (e) {
	            if (e.keyCode == 13) {
	                var k = $(this).val(), v = $(this).attr('fullName');

	                _this.setCustomName(k,v)  ;
	            }
			});

			_obj.find(".option-row").resizable({
	        	"handles":"s",
	        	resize: function (event, ui) { /* ------------------ stop event 시작 ---------------------------*/
	        		_this.formulaBar.css("height", $(this).css("height"));
	        	},
	        });

			$("button.jsonSource", _obj).click(function(event){
		    	var doc = _this.toJson();

		    	_this.spreadAce.setValue(JSON.stringify(doc, null, 4));
			});

			$("button.jsonData", _obj).click(function(event){
		    	var doc = _this.dataSource;

		    	_this.spreadAce.setValue(JSON.stringify(doc, null, 4));
			});

			$("button.LoadData", _obj).click(function(event){
		    	var doc = _this.spreadAce.getValue();

		    	doc = jQuery.parseJSON(doc);
		    	_this.fromJson(doc);

			});

			// 이름상자 목록에 채움니다
			$(".nameBoxBtn", _obj).click(function(event){
				$(".nameBoxArea .dropdown-menu", _obj).empty();

				if(_this.spread.toJSON().names){
					$.each(_this.spread.toJSON().names, function(i,k){
						if(k.formula != "\"\"" && k.col==0 && k.row==0 ) {
							$('<li aria-command="fontName" aria-value="맑은 고딕" formula="'+k.formula+'"  ><a>'+k.name+'</a></li>').appendTo($(".nameBoxArea .dropdown-menu", _obj)).click(function(e){
								var formula = $(this).attr("formula");
								var po = convertAlphToSpreadNum(formula);

								_this._setSelection(po[0],po[2],po[1],po[4],po[3]);
							})
						}
					});
				}
			});

			$(".docSheet ul", _obj).click(function(event){
				$(this).find(".active").removeClass("active");
				var sheetName = $(event.target).text();
				var sheetIndex = $(event.target).attr("index")*1;
				$(event.target).addClass("active");
				_this.spread.setActiveSheetIndex(sheetIndex);
				_this.spread.repaint();
			});


        },

        setupUbiReport:  function setupUbiReport() {
        	var _this = this;
	    	var _obj = this.element;
	        var vOption = this.options;
			//document.getElementById('ubiprint').style.display = '';
	        _obj.find('.ubiprint').css("display", "block");
		},

        goUbiReport: function goUbiReport() {
			
			var _this = this;
	    	var _obj = this.element;
			var id = _obj.attr("id");
	        var vOption = this.options;

	        var _docJson = JSON.stringify(_this.spread.toJSON());
			var _rs_ = String.fromCharCode(30);
			var datasource = [];
			//console.log(_this.dataSource);
			var jsonDatasource = JSON.stringify({"dataSource" :_this.dataSource}) ;
			//console.log(jsonDatasource);
			//'{ "dataSource": { "_source": { "TB:20170116152124-5003": { "CNT": 1, "TIT": "가나다" }, "DB:20170116155228-5003": 1 }, "__cellBindingSource__": true }  }';

			datasource.push(_rs_ + "datasource" + _rs_);
			datasource.push(jsonDatasource);
			_obj.find('.runtimedata').val(_docJson + datasource.join(""));

	        //_obj.find('#runtimedata').val(_docJson);

			if (_obj.find('.ubiport').is(":checked")) {
				_obj.find('.jrffile').val('portrait_m5.tpl');
			} else {
				_obj.find('.jrffile').val('landscape_m5.tpl');
			}

			var win = window.open("","POP_REPORT","toolbar=yes, scrollbars=yes, resizable=yes, top=0, left=0, width=1050, height=800");
			//document.getElementById('ubiprint').style.display = 'none';
			//var frm = _obj.find('ubi_frm_'+id);
			var frm = document.getElementById('ubi_frm_'+id);
			var tempdata = _docJson + datasource.join("");
			tempdata = tempdata.replace(/\\/g,"\\\\");
			tempdata = tempdata.replace(/'/g,"\\'");
			//console.log(tempdata);
			frm.runtimedata.value = tempdata;

			if (_obj.find('.ubiport').is(":checked")) {
				frm.jrffile.value = 'portrait_m5.tpl';
			} else {
				frm.jrffile.value = 'landscape_m5.tpl';
			}
			frm.submit();
			//alert(document.getElemetById("ubi_frm_"+id));
			_obj.find('.ubiprint').css("display", "none");
		},


        _menuBind: function() {
        	var _this = this;
	    	var _obj = this.element;
	        var vOption = this.options;

			$(".btn-toolbar [aria-command], .ke-topmenu [aria-command]", _obj).click(function(e) {
				var
					_jc = $(e.target).closest("[aria-command]")
					,_jm = _jc.attr("aria-command")
					,_js = _jc.hasClass("active")
					,_jv = _jc.attr("aria-value")
				;

				if (_jm == undefined ) {
					return;
				}

				if (_jv == undefined ){_jv = _js;}

				var activeSheet = _this.spread.getActiveSheet();
				var selectedRanges = activeSheet.getSelections();

				_this.bLoopChk == false;

				for(var i = 0; i < selectedRanges.length; i++){
					var
						_r = selectedRanges[i].row
						,_rc =selectedRanges[i].rowCount
						,_c = selectedRanges[i].col
						,_cc = selectedRanges[i].colCount
					;

					var sCell = activeSheet.getCells(_r,_c, _r+_rc-1, _c+_cc-1);

					_this.bLoopChk = _this._commandRun(sCell,_jm, _jv);

					if (_this.bLoopChk) {
						break;
					}
				}
			});

			$(".btn-toolbar input.fontSize", _obj).change(function(e) {
				var activeSheet = _this.spread.getActiveSheet();
				var selectedRanges = activeSheet.getSelections();

				for(var i = 0; i < selectedRanges.length; i++){
					var
						_r = selectedRanges[i].row
						,_rc =selectedRanges[i].rowCount
						,_c = selectedRanges[i].col
						,_cc = selectedRanges[i].colCount
					;

					var sCell = activeSheet.getCells(_r,_c, _r+_rc-1, _c+_cc-1);

					_this._commandRun(sCell,"fontSize", $(this).val());
				}
			});

			$(".btn-toolbar input.formatter", _obj).change(function(e) {
				var activeSheet = _this.spread.getActiveSheet();
				var selectedRanges = activeSheet.getSelections();

				for(var i = 0; i < selectedRanges.length; i++){
					var
						_r = selectedRanges[i].row
						,_rc =selectedRanges[i].rowCount
						,_c = selectedRanges[i].col
						,_cc = selectedRanges[i].colCount
					;

					var sCell = activeSheet.getCells(_r,_c, _r+_rc-1, _c+_cc-1);

					_this._commandRun(sCell,"formatter", $(this).val());
				}
			});

	        $(".video button.play",_obj).click(function(e) {
	        	var keVideo = $(".video video",_obj)[0];

	        	if (keVideo.paused){keVideo.play();} else {keVideo.pause();}
	        });

        	$(".dropdown-menu li[role='separator'], .dropdown-menu li.dropdown-header",_obj).click(function (e) {
                e.stopPropagation();
            });

        	/*

        	_obj.bind("contextmenu", function(e) { _this._processSpreadContextMenu(e);});
        	_obj.mouseup(function (e) {
                // hide context menu when the mouse down on SpreadJS
                if (e.button !== 2) {
                	_this._hideSpreadContextMenu();
                }
            });
			*/
        },

        _getCellInSelections: function getCellInSelections(selections, row, col) {
            var count = selections.length, range;
            for (var i = 0; i < count; i++) {
                range = selections[i];
                if (range.contains(row, col)) {
                    return range;
                }
            }
            return null;
        },
        _getHitTest: function getHitTest(pageX, pageY, sheet) {
        	var _this = this;
	    	var _obj = this.element;

            var offset = _obj.offset(),
                    x = pageX - offset.left,
                    y = pageY - offset.top;
            return sheet.hitTest(x, y);
        },

        _processSpreadContextMenu: function processSpreadContextMenu(e) {
        	var _this = this;
	    	var _obj = this.element;
	        var vOption = this.options;

            // move the context menu to the position of the mouse point
	        //e.pageX-420, top: e.pageY-230
            var sheet = _this.spread.getActiveSheet(),
                target = _this._getHitTest(e.pageX, e.pageY, sheet),
                hitTestType = target.hitTestType,
                row = target.row,
                col = target.col,
                selections = sheet.getSelections();

            var isHideContextMenu = false;

            if (hitTestType === GcSpread.Sheets.SheetArea.colHeader) {
                if (_this._getCellInSelections(selections, row, col) === null) {
                    sheet.setSelection(-1, col, sheet.getRowCount(), 1);
                }
                if (row !== undefined && col !== undefined) {
                    $(".context-header").show();
                    $(".context-cell").hide();
                }
            } else if (hitTestType === GcSpread.Sheets.SheetArea.rowHeader) {
                if (_this._getCellInSelections(selections, row, col) === null) {
                    sheet.setSelection(row, -1, 1, sheet.getColumnCount());
                }
                if (row !== undefined && col !== undefined) {
                    $(".context-header").show();
                    $(".context-cell").hide();
                }
            } else if (hitTestType === GcSpread.Sheets.SheetArea.viewport) {
                if (_this._getCellInSelections(selections, row, col) === null) {
                  //  sheet.clearSelection();
                  //  sheet.endEdit();
                  //  sheet.setActiveCell(row, col);
                   // _this._updateMergeButtonsState();
                }
                if (row !== undefined && col !== undefined) {
                    $(".context-header").hide();
                    $(".context-cell").hide();
                    _this._showMergeContextMenu();
                } else {
                    isHideContextMenu = true;
                }
            } else if (hitTestType === GcSpread.Sheets.SheetArea.corner) {
                sheet.setSelection(-1, -1, sheet.getRowCount(), sheet.getColumnCount());
                if (row !== undefined && col !== undefined) {
                    $(".context-header").hide();
                    $(".context-cell").show();
                }
            }

            var $contextMenu = _obj.find(".spreadContextMenu");
            $contextMenu.data("sheetArea", hitTestType);
            if (isHideContextMenu) {
                _this._hideSpreadContextMenu();
            } else {
                $contextMenu.css({ left: e.pageX-420, top: e.pageY-230 });
                $contextMenu.show();

                $(document).on("mousedown.contextmenu", function () {
                    if ($(event.target).parents(".spreadContextMenu").length === 0) {
                        _this._hideSpreadContextMenu();
                    }
                });
            }
        },

        _updateMergeButtonsState: function updateMergeButtonsState() {
        	var _this = this;
	    	var _obj = this.element;
	        var vOption = this.options;

            var sheet = _this.spread.getActiveSheet();
            var sels = sheet.getSelections(),
                mergable = false,
                unmergable = false;

            sels.forEach(function (range) {
                var ranges = sheet.getSpans(range),
                    spanCount = ranges.length;

                if (!mergable) {
                    if (spanCount > 1 || (spanCount === 0 && (range.rowCount > 1 || range.colCount > 1))) {
                        mergable = true;
                    } else if (spanCount === 1) {
                        var range2 = ranges[0];
                        if (range2.row !== range.row || range2.col !== range.col ||
                            range2.rowCount !== range2.rowCount || range2.colCount !== range.colCount) {
                            mergable = true;
                        }
                    }
                }
                if (!unmergable) {
                    unmergable = spanCount > 0;
                }
            });

            $("#mergeCells").attr("disabled", mergable ? null : "disabled");
            $("#unmergeCells").attr("disabled", unmergable ? null : "disabled");
        },



        _hideSpreadContextMenu: function hideSpreadContextMenu() {
        	var _this = this;
	    	var _obj = this.element;
	        var vOption = this.options;

	        _obj.find(".spreadContextMenu").hide();
            $(document).off("mousedown.contextmenu");
        },

        _showMergeContextMenu: function showMergeContextMenu() {
            // use the result of updateMergeButtonsState
            if ($("#mergeCells").attr("disabled")) {
                $(".context-merge").hide();
            } else {
                $(".context-cell.divider").show();
                $(".context-merge").show();
            }

            if ($("#unmergeCells").attr("disabled")) {
                $(".context-unmerge").hide();
            } else {
                $(".context-cell.divider").show();
                $(".context-unmerge").show();
            }
        },
        _processContextMenuClicked: function processContextMenuClicked() {
        	var _this = this;
	    	var _obj = this.element;
	        var vOption = this.options;

            var action = $(this).data("action");
            var sheet = spread.getActiveSheet();
            var sheetArea = $("#spreadContextMenu").data("sheetArea");

            _this._hideSpreadContextMenu();

            switch (action) {
                case "cut":
                    GcSpread.Sheets.SpreadActions.cut.call(sheet);
                    break;
                case "copy":
                    GcSpread.Sheets.SpreadActions.copy.call(sheet);
                    break;
                case "paste":
                    GcSpread.Sheets.SpreadActions.paste.call(sheet);
                    break;
                case "insert":
                    if (sheetArea === GcSpread.Sheets.SheetArea.colHeader) {
                        sheet.addColumns(sheet.getActiveColumnIndex(), sheet.getSelections()[0].colCount);
                    } else if (sheetArea === GcSpread.Sheets.SheetArea.rowHeader) {
                        sheet.addRows(sheet.getActiveRowIndex(), sheet.getSelections()[0].rowCount);
                    }
                    break;
                case "delete":
                    if (sheetArea === GcSpread.Sheets.SheetArea.colHeader) {
                        sheet.deleteColumns(sheet.getActiveColumnIndex(), sheet.getSelections()[0].colCount);
                    } else if (sheetArea === GcSpread.Sheets.SheetArea.rowHeader) {
                        sheet.deleteRows(sheet.getActiveRowIndex(), sheet.getSelections()[0].rowCount);
                    }
                    break;
                case "merge":
                    var sel = sheet.getSelections();
                    if (sel.length > 0) {
                        sel = sel[sel.length - 1];
                        sheet.addSpan(sel.row, sel.col, sel.rowCount, sel.colCount, GcSpread.Sheets.SheetArea.viewport);
                    }
                    _this._updateMergeButtonsState();
                    break;
                case "unmerge":
                    var sels = sheet.getSelections();
                    for (var i = 0; i < sels.length; i++) {
                        var sel = getActualCellRange(sels[i], sheet.getRowCount(), sheet.getColumnCount());
                        for (var r = 0; r < sel.rowCount; r++) {
                            for (var c = 0; c < sel.colCount; c++) {
                                var span = sheet.getSpan(r + sel.row, c + sel.col, GcSpread.Sheets.SheetArea.viewport);
                                if (span) {
                                    sheet.removeSpan(span.row, span.col, GcSpread.Sheets.SheetArea.viewport);
                                }
                            }
                        }
                    }
                    _this._updateMergeButtonsState();
                    break;
                default:
                    break;
            }
        },
        // context menu related items (end)

        _setSpreadSheetTabMoveUp: function (){
        	/* keditor 하단시트 영역의 위치를 옮긴다 - 서식작성모드이 기본형 */
	    	var _this = this, _obj = this.element;
	    	if (this.options.sheetTabMoveUp){
	    		$(".spreadDoc > table  > tr:eq(1)",_obj).insertBefore($(".spreadDoc > table  > tr:eq(0)",_obj));
	    	}
        },
        _commandRun: function( target, job, value){
	    	var _this = this;
	    	var _obj = this.element;
	        var vOption = this.options;
	        var sheet = _this.spread.getActiveSheet();

        	switch(job){
	    		case "fontName":
	        		_this.setStyleFont(sheet, "font-family", [value], value);

	        		break;
	        	case "fontSize":
	                value += "pt";
	                _this.setStyleFont(sheet, "font-size", [value], value);


	        		break;
	        	case "bold":
	        		_this.setStyleFont(sheet, "font-weight", ["700", "bold"], "normal");
	        		break;

	        	case "italic":
	        		_this.setStyleFont(sheet, "font-style", ["italic"], "normal");

	        		break;

	        	case "fontColor":
	        		target.foreColor(value);

	        		break;
	        	case "backColor":
	        		target.backColor(value);

	        		break;
	        	case "cellLock":
	        		target.locked(!value);

					if (!value){
						$("[aria-command='cellLock']",_this.toolbar).removeClass("active").addClass("active");
						$("[aria-command='cellLock'] i",_this.toolbar).removeClass("fa-lock fa-unlock txtYellow").addClass("fa-lock");
					}else {
						$("[aria-command='cellLock']",_this.toolbar).removeClass("active");
						$("[aria-command='cellLock'] i",_this.toolbar).removeClass("fa-lock fa-unlock txtYellow").addClass("fa-unlock txtYellow");
					}

	        		break;
	        	case "lineThrough":
	        		value = (target.textDecoration() == GcSpread.Sheets.TextDecorationType.LineThrough);

	        		target.textDecoration(value?GcSpread.Sheets.TextDecorationType.None:GcSpread.Sheets.TextDecorationType.LineThrough);

	        		break;
	        	case "underline":
	        		value = (target.textDecoration() == GcSpread.Sheets.TextDecorationType.Underline);

	        		target.textDecoration(value?GcSpread.Sheets.TextDecorationType.None:GcSpread.Sheets.TextDecorationType.Underline);

	        		break;
	        	case "align-left":
	        		target.hAlign(GcSpread.Sheets.HorizontalAlign.left);

	        		break;
	        	case "center-middle":
	        		target.hAlign(GcSpread.Sheets.HorizontalAlign.center);
	        		target.vAlign(GcSpread.Sheets.VerticalAlign.center);

	        		break;
	        	case "align-center":
	        		target.hAlign(GcSpread.Sheets.HorizontalAlign.center);

	        		break;
	        	case "align-right":
	        		target.hAlign(GcSpread.Sheets.HorizontalAlign.right);

	        		break;
	        	case "align-top":
	        		target.vAlign(GcSpread.Sheets.VerticalAlign.top);

	        		break;
	        	case "align-middle":
	        		target.vAlign(GcSpread.Sheets.VerticalAlign.center);

	        		break;
	        	case "align-bottom":
	        		target.vAlign(GcSpread.Sheets.VerticalAlign.bottom);

	        		break;
	        	case "wordWarp":
	        		target.wordWrap(!target.wordWrap());
	        		/* 줄바꿈시 자동으로 Row크기 정하기 */
	        		if (target.wordWrap()){
	        			var sheet = _this.spread.getActiveSheet();
	        			sheet.autoFitRow(target.row);
	        		}
	        		break;
	        	case "allowCellOverflow":
	        		var sheet = _this.spread.getActiveSheet();

	        		sheet.allowCellOverflow(!sheet.allowCellOverflow());

	        		break;
	        	case "textIndent":
	        		var ind = target.textIndent();

	        		if (ind == undefined){ind = 0;}

	        		target.textIndent(ind+1);

	        		break;
	        	case "textUnIndent":
	        		var ind = target.textIndent();

	        		if (ind == undefined){ind = 0;}

	        		if (ind == 0){ind = 1;}

	        		target.textIndent(ind-1);

	        		break;
	        	case "table":
	        		_this._addTable();

	        		break;
	        	case "removeTable":
	                var sheet = _this.spread.getActiveSheet();

	                try {
	                    var cr = sheet.getSelections()[0];

	                    if (cr) {
	                        cr = getActualRange(cr, sheet.getRowCount(), sheet.getColumnCount());

	                        var table  = sheet.findTable(cr.row, cr.col);

	                        if (table){
	                        	sheet.removeTable(table);
	                        }
	                    }
	                } catch (ex) {
	                    alert(!!ex.message ? ex.message : ex);
	                }

	        		break;
	        	case "columnInsert":
	        		_this._columnInsert();

	        		break;
	        	case "columnDelete":
	        		_this._columnDelete();

	        		break;
	        	case "tableSpan":
	        		_this._tableSpan();

	        		break;
	        	case "Merge":
	                var sheet = _this.spread.getActiveSheet();
		            var sel = sheet.getSelections();

		            if (sel.length > 0) {
		                sel = getActualCellRange(sel[sel.length - 1], sheet.getRowCount(), sheet.getColumnCount());
		                sheet.addSpan(sel.row, sel.col, sel.rowCount, sel.colCount);
		                _this._setNameBox();
		            }

		            break;
	        	case "unMerge":
	                var sheet = _this.spread.getActiveSheet();
		            var sel = sheet.getSelections();

		            if (sel.length > 0) {
		                sel = getActualCellRange(sel[sel.length - 1], sheet.getRowCount(), sheet.getColumnCount());

		                sheet.isPaintSuspended(true);

		                for (var i = 0; i < sel.rowCount; i++) {
		                    for (var j = 0; j < sel.colCount; j++) {
		                        sheet.removeSpan(i + sel.row, j + sel.col);
		                    }
		                }

		                _this._setNameBox();
		                sheet.isPaintSuspended(false);
		            }

	        		break;
	        	case "Border":
	                var sheet = _this.spread.getActiveSheet();
		            var sel = sheet.getSelections();

		            if (sel.length > 0) {
		                sel = getActualCellRange(sel[sel.length - 1], sheet.getRowCount(), sheet.getColumnCount());
		                sheet.setBorder(sel, new GcSpread.Sheets.LineBorder("Black", GcSpread.Sheets.LineStyle.thin), { all: true });
		                //sheet.setBorder(sel, new GcSpread.Sheets.LineBorder("Black", GcSpread.Sheets.LineStyle.thin), { inside: true });
		                //sheet.setBorder(sel, new GcSpread.Sheets.LineBorder("Black", GcSpread.Sheets.LineStyle.thin), { outline: true });
		            }

	        		break;
	        	case "BorderOuter":
	                var sheet = _this.spread.getActiveSheet();
		            var sel = sheet.getSelections();

		            if (sel.length > 0) {
		                sel = getActualCellRange(sel[sel.length - 1], sheet.getRowCount(), sheet.getColumnCount());
		                sheet.setBorder(sel, new GcSpread.Sheets.LineBorder("Black", GcSpread.Sheets.LineStyle.thin), { outline: true });
		            }

		            break;
	        	case "BorderDbl":
	                var sheet = _this.spread.getActiveSheet();
		            var sel = sheet.getSelections();

		            if (sel.length > 0) {
		                sel = getActualCellRange(sel[sel.length - 1], sheet.getRowCount(), sheet.getColumnCount());
		                sheet.setBorder(sel, new GcSpread.Sheets.LineBorder("Black", GcSpread.Sheets.LineStyle.medium), { outline: true });
		            }

	        		break;
	        	case "BorderDash":
	                var sheet = _this.spread.getActiveSheet();
		            var sel = sheet.getSelections();

		            if (sel.length > 0) {
		                sel = getActualCellRange(sel[sel.length - 1], sheet.getRowCount(), sheet.getColumnCount());
		                sheet.setBorder(sel, new GcSpread.Sheets.LineBorder("gray", GcSpread.Sheets.LineStyle.dotted), { bottom: true });
		            }

	        		break;
	        	case "BorderEmpty":
	                var sheet = _this.spread.getActiveSheet();
		            var sel = sheet.getSelections();

		            if (sel.length > 0) {
		                sel = getActualCellRange(sel[sel.length - 1], sheet.getRowCount(), sheet.getColumnCount());
		                sheet.setBorder(sel, new GcSpread.Sheets.LineBorder("Black", GcSpread.Sheets.LineStyle.empty), { all: true });
		                //sheet.setBorder(sel, new GcSpread.Sheets.LineBorder("Black", GcSpread.Sheets.LineStyle.thin), { inside: true });
		                //sheet.setBorder(sel, new GcSpread.Sheets.LineBorder("Black", GcSpread.Sheets.LineStyle.thin), { outline: true });
		            }

	        		break;
	        	case "frozen":
	                var sheet = _this.spread.getActiveSheet();
		            var sel = sheet.getSelections();

		            sheet.setFrozenRowCount(sel[0].row);
	        		sheet.setFrozenColumnCount(sel[0].col);

	        		break;
	        	case "unFrozen":
	                var sheet = _this.spread.getActiveSheet();

	                sheet.setFrozenRowCount(0);
	        		sheet.setFrozenColumnCount(0);

	        		break;
	        	case "data-sql":
	        		_this.SqlDataDrag();

	        		break;
	        	case "dlgTableFromView":
	        		_this.dlgTableFromView();

	        		break;
	        	case "dlgTableFromSql":
	        		_this.dlgTableFromSql();

	        		break;
	        	case "dlgCsvFromSql":
	        		_this.dlgCsvFromSql();

	        		break;
	        	case "dlgCsvFromView":
	        		_this.dlgCsvFromView();

	        		return true;

	        		break;
	        	case "dlgCellFromSql":
	        		_this.dlgCellFromSql();

	        		return true;

	        		break;
	        	case "setDataBind":
	        		_this.setDataBind();
	        		//_this.setDataBind2();

	        		break;
	        	case "clearDataBind":
	        		_this.clearDataBind();

	        		break;
	        	case "tableDraw":
	        		_this.tableDraw();

	        		break;
	        	case "new":
	        		_this.newDoc();

	        		break;
	        	case "open":
	        		_this.findDoc();
	        		break;
	        	case "save":
	        		_this.saveDoc();

	        		break;
	        	case "saveAs":
	        		_this.saveAsDoc();

	        		break;
	        	case "exportToJSON":
	        		_this.exportToJSON(value);

	        		break;
	        	case "importFromJSON":
	        		_this.importFromJSON();

	        		break;

	        	case "delete":
	        		_this.deleteDoc();

	        		break;
	        	case "print":
	        		_this.printDoc();

	        		break;
	        	case "ub-print":
	        		_this.setupUbiReport();
	        		//_this.goUbiReport();

	        		break;
	        	case "importFromXls":
	        		_this.importFromXls();

	        		break;
	        	case "exportToXls":
	        		_this.exportToXls();

	        		break;
	        	case "docProperty":
	        		_this.docProperty();

	        		break;
	        	case "sheetProperty":
	        		_this.sheetProperty();

	        		break;
	        	case "tableProperty":
	        		_this.tableProperty();

	        		break;
	        	case "spreadJson":
	        		$(".spreadJsonDocArea", _obj).toggle();

	        		//parent.resizeContentIFrameSize(1200);

	        		break;
	        	case "copy":
	        		var sheet = _this.spread.getActiveSheet();

	        		GcSpread.Sheets.SpreadActions.copy.call(sheet);

	        		break;
	        	case "paste":
	        		var sheet = _this.spread.getActiveSheet();

	        		GcSpread.Sheets.SpreadActions.paste.call(sheet);

	        		break;
	        	case "eraser":
	        		//_this._doClear(GcSpread.Sheets.StorageType.Style, true);
	        		_this._doClear(255, true);

	        		break;
		        case "cellColInsert":
		        	var sheet = _this.spread.getActiveSheet();

		        	sheet.addColumns(sheet.getActiveColumnIndex(), sheet.getSelections()[0].colCount);

		        	break;
		        case "cellRowInsert":
		        	var sheet = _this.spread.getActiveSheet();

		        	sheet.addRows(sheet.getActiveRowIndex(), sheet.getSelections()[0].rowCount);

		        	break;
		        case "cellColDelete":

		        	var sheet = _this.spread.getActiveSheet();
		        	var colCount = sheet.getColumnCount();
		        	if (sheet.getSelections()[0].colCount == colCount){
		        		alert("전체 열이 선택되어 삭제할수 없습니다.")
		        	} else {
		        		sheet.deleteColumns(sheet.getActiveColumnIndex(), sheet.getSelections()[0].colCount);
		        	}

		        	break;
		        case "cellRowDelete":
		        	var sheet = _this.spread.getActiveSheet();
		        	var rowCount = sheet.getRowCount();
		        	if (sheet.getSelections()[0].rowCount == rowCount){
		        		alert("전체 행이 선택되어 삭제할수 없습니다.")
		        	} else {
			        	sheet.deleteRows(sheet.getActiveRowIndex(), sheet.getSelections()[0].rowCount);
		        	}


		        	break;
		        case "colWidth":
		        	_this._colWidth();

		        	return true;

		        	break;
		        case "rowHeight":
		        	_this._rowHeight();

		        	return true;

		        	break;
	        	case "button":
	                var sheet = _this.spread.getActiveSheet();
		            var sel = sheet.getSelections();

		            if (sel.length > 0) {
			            var b0 = new GcSpread.Sheets.ButtonCellType();

			            b0.buttonBackColor("rgb(255, 192, 0)");
			            b0.text("파일");

			            sheet.setCellType(sel[0].row, sel[0].col, b0, GcSpread.Sheets.SheetArea.viewport);

			            target.vAlign(GcSpread.Sheets.VerticalAlign.center);
			            target.hAlign(GcSpread.Sheets.HorizontalAlign.center);
		            }

	        		break;
	        	case "btnDataRefresh":
	                var sheet = _this.spread.getActiveSheet();
		            var sel = sheet.getSelections();

		            if (sel.length > 0) {
			            var b0 = new GcSpread.Sheets.ButtonCellType();

			            b0.buttonBackColor("rgb(255, 192, 0)");
			            b0.text("검색");

			            sheet.setCellType(sel[0].row, sel[0].col, b0, GcSpread.Sheets.SheetArea.viewport);

			            target.vAlign(GcSpread.Sheets.VerticalAlign.center);
			            target.hAlign(GcSpread.Sheets.HorizontalAlign.center);
		            }

	        		break;
	        	case "CheckBoxCellType":
		            var c = new GcSpread.Sheets.CheckBoxCellType();

		            c.isThreeState(false);

		            _this._getCheckText('선택','취소', function(tText, fText){
			            c.textTrue(tText);
			            c.textFalse(fText);
			            target.cellType(c);
		            });

		            return true;

		            break;
	        	case "ComboBoxCellType":
		            var c = new GcSpread.Sheets.ComboBoxCellType();

		            _this._getComboText('우리나라,무궁화','1,2', function(tText, vText){
		            	var atText = tText.split(',');
		            	var avText = vText.split(',');
		            	var _item = [];

		            	$.each(atText, function(i,c){
		            		_item.push({
		            			text : atText[i],
		            			value: avText[i]
		            		})
		            	})

		            	c.items(_item).editorValueType(GcSpread.Sheets.EditorValueType.Value);

		            	target.cellType(c);
		            });

		            return true;

		            break;
	        	case "FormulaListValidator":
		            var gcdv = GcSpread.Sheets.DefaultDataValidator;

		            _this._getText("선택항목 참조영역을 입력하세요","", function(text){
		        		var ddv = gcdv.createFormulaListValidator(text);

		        		if (ddv != null) {
		        			target.dataValidator(ddv);
		        		}
		            });

		            return true;

		            break;
	        	case "addRow":
	                var sheet = _this.spread.getActiveSheet();
		            var sel = sheet.getSelections();

		            if (sel.length > 0) {
			            var b0 = new GcSpread.Sheets.ButtonCellType();

			            b0.text("추가");

			            sheet.setCellType(sel[0].row, sel[0].col, b0, GcSpread.Sheets.SheetArea.viewport);

			            target.vAlign(GcSpread.Sheets.VerticalAlign.center);
			            target.hAlign(GcSpread.Sheets.HorizontalAlign.center);
		            }

	        		break;
	        	case "textarea":
	                var sheet = _this.spread.getActiveSheet();
		            var sel = sheet.getSelections();

		            if (sel.length > 0) {
			            var b0 = new TextAreaCellType();

			            sheet.setCellType(sel[0].row, sel[0].col, b0, GcSpread.Sheets.SheetArea.viewport);
		            }

	        		break;
	        	case "editMode-table":
	        		_this._setWriteMode("table");

	        		break;
	        	case "editMode-pencil":
	        		_this._setWriteMode("pencil");

	        		break;
	        	case "formatter":
	        		target.formatter(new GcSpread.Sheets.GeneralFormatter(value));

	        		$("input.formatter", _this.toolbar).val($("li[aria-command='formatter'][aria-value='" + value + "']", _this.toolbar).find("a").text());

	        		break;
	        	case "dlgCustomNameFind":
	        		_this.dlgCustomNameFind();

	        		break;

	        	case "dlgDataSetFind":
	        		_this.dlgDataSetFind();

	        		break;

	        	case "preViewer":
	        		_this.preViewer();

	        		break;
	        	case "help":
	        		break;
        	}
        },

        parseFont: function parseFont(font) {
	    	var _this = this

	    	if (!font){
	            return {
	                "fontStyle": "normal",
	                "fontVariant": "normal",
	                "fontWeight": "normal",
	                "fontSize": "11pt",
	                "lineHeight": "normal",
	                "fontFamily": "맑은 고딕"
	            };

	    	}

            var fontFamily = null,
                fontSize = null,
                fontStyle = "normal",
                fontWeight = "normal",
                fontVariant = "normal",
                lineHeight = "normal";

            var elements = font.split(/\s+/);
            var element;
            while ((element = elements.shift())) {
                switch (element) {
                    case "normal":
                        break;

                    case "italic":
                    case "oblique":
                        fontStyle = element;
                        break;

                    case "small-caps":
                        fontVariant = element;
                        break;

                    case "bold":
                    case "bolder":
                    case "lighter":
                    case "100":
                    case "200":
                    case "300":
                    case "400":
                    case "500":
                    case "600":
                    case "700":
                    case "800":
                    case "900":
                        fontWeight = element;
                        break;

                    default:
                        if (!fontSize) {
                            var parts = element.split("/");
                            fontSize = parts[0];
                            if (fontSize.indexOf("px") !== -1) {
                                fontSize = _this.px2pt(parseFloat(fontSize)) + 'pt';
                            }
                            if (parts.length > 1) {
                                lineHeight = parts[1];
                                if (lineHeight.indexOf("px") !== -1) {
                                    lineHeight = _this.px2pt(parseFloat(lineHeight)) + 'pt';
                                }
                            }
                            break;
                        }

                        fontFamily = element;
                        if (elements.length)
                            fontFamily += " " + elements.join(" ");

                        return {
                            "fontStyle": fontStyle,
                            "fontVariant": fontVariant,
                            "fontWeight": fontWeight,
                            "fontSize": fontSize,
                            "lineHeight": lineHeight,
                            "fontFamily": fontFamily
                        };
                }
            }

            return {
                "fontStyle": fontStyle,
                "fontVariant": fontVariant,
                "fontWeight": fontWeight,
                "fontSize": fontSize,
                "lineHeight": lineHeight,
                "fontFamily": fontFamily
            };
        },

        setStyleFont: function setStyleFont(sheet, prop, optionValue1, optionValue2) {
	    	var _this = this
    		,_obj = this.element
        	,vOption = this.options
        ;

            var styleEle = _obj.find(".setfontstyle")[0],
                selections = sheet.getSelections(),
                rowCount = sheet.getRowCount(),
                columnCount = sheet.getColumnCount();

            sheet.isPaintSuspended(true);
            for (var n = 0; n < selections.length; n++) {
                var sel = getActualCellRange(selections[n], rowCount, columnCount);
                for (var r = sel.row; r < sel.row + sel.rowCount; r++) {
                    for (var c = sel.col; c < sel.col + sel.colCount; c++) {
                        var style = sheet.getStyle(r, c);
                        var defaultStyle = sheet.getDefaultStyle();
                        if (!style) {
                            style = new GcSpread.Sheets.Style();
                        }
                        if (!style.font) {
                            style.font = defaultStyle.font || "11pt 맑은 고딕";
                        }
                        // reset themeFont to make sure font be used
                        style.themeFont = undefined;
                        styleEle.style.font = style.font;
                        var styleFont = $(styleEle).css(prop);
                        if (styleFont === optionValue1[0] || styleFont === optionValue1[1]) {
                            if (defaultStyle.font) {
                                styleEle.style.font = defaultStyle.font;
                                defaultFontProp = $(styleEle).css(prop);
                                styleEle.style.font = style.font;
                                $(styleEle).css(prop, defaultFontProp);
                            }
                            else {
                                $(styleEle).css(prop, optionValue2);
                            }
                        } else {
                            $(styleEle).css(prop, optionValue1[0]);
                        }
                        style.font = styleEle.style.font;
                        sheet.setStyle(r, c, style);
                    }
                }
            }
            sheet.isPaintSuspended(false);
        },

        px2pt: function(pxValue) {
        	var tempSpan = $("<span></span>");
            tempSpan.css({
                "font-size": "96pt",
                "display": "none"
            });
            tempSpan.appendTo($(document.body));
            var tempPx = tempSpan.css("font-size");
            if (tempPx.indexOf("px") !== -1) {
                var tempPxValue = parseFloat(tempPx);
                return Math.round(pxValue * 96 / tempPxValue);
            }
            else {  // when browser have not convert pt to px, use 96 DPI.
                return Math.round(pxValue * 72 / 96);
            }
        },


        _tableSpan: function(){
        	/* 테이블에 데이터를 채우고 머지된 경우가 있는지 파악하고 자동머지작업을 진행한다 */
	    	var _this = this;
	    	var _obj = this.element;

	    	$.each(_this.spread.sheets, function(i, sheet){
            	var tables  = sheet.getTables()

            	$.each(tables, function(ti, table) {
                	var _r = new GcSpread.Sheets.Range(table._row, table._col, 1,table._colCount);
                	var _s = sheet.getSpans(_r);

                	/* 만일 테이블은 존재하는데 데이터를 바인딩한 경우는 제외하고 실제 데이터 바인딩된 경우에 대해서만 진해함 */
                	if (table._bindingManager != null){
	                	for(var j=1; j<=table._bindingManager._dataSource.length+1; j++){
	                		for(var k=0; k<_s.length; k++){
	                			sheet.addSpan(_s[k].row+j, _s[k].col, 1, _s[k].colCount);
	                		}
	                	}
                	}
                });
            })
        },
        _addTable: function() {
	    	var _this = this;
	    	var _obj = this.element;
            var sheet = _this.spread.getActiveSheet();

            try {
                var cr = sheet.getSelections()[0];

                if (cr) {
                    cr = getActualRange(cr, sheet.getRowCount(), sheet.getColumnCount());

                    if (cr.rowCount > 1 || cr.colCount > 1 ) {
	                    var table  = sheet.findTable(cr.row, cr.col);

	                    if (!table){
		                    var newTable = sheet.addTable(getTableName(sheet), cr.row, cr.col, cr.rowCount, cr.colCount, GcSpread.Sheets.TableStyles.light15());

		                    newTable.showHeader(true);
		                    newTable.showFooter(true);
		                    newTable.bandRows(false);
		                    _this.spread.repaint();
		                   // newTable.bindingPath("TB:"+_this.getTimeStamp());
		                   // for (var i=0; i<newTable._colCount;i++){
		                   // 	newTable.filterButtonVisible(i,false);
		                   // }
	                    }
                    }
                }
            } catch (ex) {
                alert(!!ex.message ? ex.message : ex);
            }
        },
        tableDraw: function() {
	    	var _this = this;
	    	var _obj = this.element;
            var sheet = _this.spread.getActiveSheet();

            try {
                var sel = sheet.getSelections()[0];

                if (sel) {
                	if (sel.rowCount < 4){
                		alert("표그리기는 최소 4줄이상 범위가 선택되어야 합니다.");

                		return false;
                	}

	                sheet.setBorder(sel, new GcSpread.Sheets.LineBorder("Black", GcSpread.Sheets.LineStyle.thin), { all: true });
	                sheet.setBorder(sel, new GcSpread.Sheets.LineBorder("Black", GcSpread.Sheets.LineStyle.medium), { outline: true });

	                var _r = new GcSpread.Sheets.Range(sel.row, sel.col, 1, sel.colCount);

                	for (var i=sel.col; i< sel.col+sel.colCount; i++ ){
                		sheet.getCell(sel.row, i).backColor("rgb(190, 215, 238)");
                	}

                	for (var i=sel.col; i< sel.col+sel.colCount; i++ ){
                		sheet.getCell(sel.row+sel.rowCount-1, i).backColor("rgb(218, 218, 218)");
                	}

                	sheet.setRowHeight(sel.row+sel.rowCount-2, 10);
                }
            } catch (ex) {
                alert(!!ex.message ? ex.message : ex);
            }
        },
        _columnInsert: function(){
	    	var _this = this;
	    	var _obj = this.element;
            var sheet = _this.spread.getActiveSheet();
            var cr = sheet.getSelections()[0];
            var table  = sheet.findTable(cr.row, cr.col);

            if (table){
            	sheet.resizeTable(table,table._rowCount,table._colCount+1 );

            	var incCol = cr.col - table._col;

            	if (incCol<0){
            		alert("삽입할 위치를 선택하세요");

            		return;
            	}

            	for(var i=table._colCount-1; i>=incCol;i--){
            		var _dataField 	= table._columns[i-1].dataField();
            		var _formula    = table._columns[i-1].dataAreaFormula()
            		var _name		= table._columns[i-1].name();

            		table._columns[i].dataField(_dataField);
            		table._columns[i].dataAreaFormula(_formula);
            		table._columns[i].name(_name);
            	}

           		table._columns[incCol].dataField("");
           		table._columns[incCol].dataAreaFormula("");
           		table._columns[incCol].name("");

            	// setColumnDataFormula
            	// setColumnName
            	_this.spread.isPaintSuspended(true);
           		_this.clearDataBind();
           		_this.setDataBind();
           		sheet.repaint();
           		_this.spread.isPaintSuspended(false);
            } else {
            	alert("삽입할 테이블을 선택하세요.");
            }
        },
        _columnDelete: function(){
	    	var _this = this;
	    	var _obj = this.element;
            var sheet = _this.spread.getActiveSheet();
            var cr = sheet.getSelections()[0];
            var table  = sheet.findTable(cr.row, cr.col);

            if (table){
            	var incCol = cr.col - table._col;

            	if (incCol<0){
            		alert("삽입할 위치를 선택하세요.");

            		return;
            	}

            	for(var i=incCol; i<table._colCount-1;i++){
            		var _dataField 	= table._columns[i+1].dataField();
            		var _formula    = table._columns[i+1].dataAreaFormula()
            		var _name		= table._columns[i+1].name();

            		table._columns[i].dataField(_dataField);
            		table._columns[i].dataAreaFormula(_formula);
            		table._columns[i].name(_name);
            	}

            	sheet.resizeTable(table,table._rowCount,table._colCount-1 );

            	_this.spread.isPaintSuspended(true);
           		_this.clearDataBind();
           		_this.setDataBind();
           		sheet.repaint();
           		_this.spread.isPaintSuspended(false);
            } else {
            	alert("삽입할 테이블을 선택하세요.");
            }
        },
        _doClear: function doClear(types, clearSpans) {
        	/* 해당영역 지우기 */
	    	var _this = this;
	    	var _obj = this.element;
		    var sheet = _this.spread.getActiveSheet()
		        ,selections = sheet.getSelections()
		        ,_this = this
		        ;

		    selections.forEach(function (selection) {
		        sheet.clear(selection.row, selection.col, selection.rowCount, selection.colCount, GcSpread.Sheets.SheetArea.viewport, types);

		        if (clearSpans) {
		            _this._clearSpansInSelection(sheet, selection);
		        }
		    });

		    $(Object.keys(_this.exportSet.sqlBind)).each(function(i, key) {
		    	var _bindInfo = _this._getBindingInfo(key);

		    	if(_bindInfo[0] == undefined) {
		    		delete _this.exportSet.sqlBind[key];
		    	}
		    });
		},
		_clearSpansInSelection: function (sheet, selection) {
			/* 병함된 영역도 지우기 */
	    	var _this = this;
	    	var _obj = this.element;

	    	if (sheet && selection) {
		        var ranges = [],
		            row = selection.row, col = selection.col,
		            rowCount = selection.rowCount, colCount = selection.colCount;

		        sheet.getSpans().forEach(function (range) {
		            if (range.intersect(row, col, rowCount, colCount)) {
		                ranges.push(range);
		            }
		        });

		        ranges.forEach(function (range) {
		            sheet.removeSpan(range.row, range.col);
		        });
		    }
		},
        _CellFocusToolbar: function(event, data){
	    	var _this = this;
	    	var _obj = this.element;
	        var vOption = this.options;

			var
			 _Cell = _this.spread.sheets[ _this.spread.getActiveSheetIndex()].getCell(data.row, data.col)
			 ,_Font = _Cell.font()
			 ,_A = $("<a></a>").appendTo(document.body).css("font", _Font)
			 ,_fo = _this.parseFont(_Font);
			 ;



			var
				_fontSize 	  = _fo.fontSize.replace("pt","") /*  pt. _A.css("font-size") */
				, _fontName   =  _fo.fontFamily /* _A.css("font-family").replaceAll('"', '') */
				, _bold       =   _fo.fontWeight /*  700  _A.css("font-weight") */
				, _italic     =  _fo.fontStyle  /* "italic" _A.css("font-style") */
				, _foreColor  = _Cell.foreColor()
				, _backColor  = _Cell.backColor()
				, _Decoration = _Cell.textDecoration()
				, _hAlign     = _Cell.hAlign()
				, _vAlign     = _Cell.vAlign()
				, _locked     = _Cell.locked()
			;

			_foreColor = (_foreColor==undefined)? "black":_foreColor;
			_backColor = (_backColor==undefined)? "white":_backColor;
			_fontSize  = (_fontSize==undefined)? "14":_fontSize;
			_fontSize  = parseInt(_fontSize);

			_align_left    = _hAlign==0?"active":"";
			_align_center  = _hAlign==1?"active":"";
			_align_right   = _hAlign==2?"active":"";

			_align_top    = _vAlign==0?"active":"";
			_align_middle = _vAlign==1?"active":"";
			_align_bottom = _vAlign==2?"active":"";

			$("a.fontName",_this.toolbar).text(_fontName);
			$("input.fontSize", _this.toolbar).val(_fontSize);
			$("a.fontColor label",_this.toolbar).css("background-color", _backColor);
			$("a.fontColor label",_this.toolbar).css("color", _foreColor);

			//$("[aria-command='cellLock']",_this.toolbar).removeClass("active").addClass(  _locked?"active":"");
			if (_locked){
				$("[aria-command='cellLock']",_this.toolbar).removeClass("active").addClass("active");
				$("[aria-command='cellLock'] i",_this.toolbar).removeClass("fa-lock fa-unlock txtYellow").addClass("fa-lock");
			}else {
				$("[aria-command='cellLock']",_this.toolbar).removeClass("active");
				$("[aria-command='cellLock'] i",_this.toolbar).removeClass("fa-lock fa-unlock txtYellow").addClass("fa-unlock txtYellow");
			}

			$("[aria-command='bold']",_this.toolbar).removeClass("active").addClass(  _bold=="normal"?"":"active");
			$("[aria-command='italic']",_this.toolbar).removeClass("active").addClass(_italic=="normal"?"":"active");
			$("[aria-command='lineThrough']",_this.toolbar).removeClass("active").addClass(_Decoration==GcSpread.Sheets.TextDecorationType.LineThrough?"active":"");
			$("[aria-command='underline']",_this.toolbar).removeClass("active").addClass(_Decoration==GcSpread.Sheets.TextDecorationType.Underline?"active":"");

			$("[aria-command='align-left']",_this.toolbar).removeClass("active").addClass(_align_left);
			$("[aria-command='align-center']",_this.toolbar).removeClass("active").addClass(_align_center);
			$("[aria-command='align-right']",_this.toolbar).removeClass("active").addClass(_align_right);

			//$("[aria-command='align-top']",toolbar).removeClass("active").addClass(_align_top);
			//$("[aria-command='align-middle']",toolbar).removeClass("active").addClass(_align_middle);
			//$("[aria-command='align-bottom']",toolbar).removeClass("active").addClass(_align_bottom);

			_this._setNameBox(data);
        },

        // 위치정보를 가지고 해당셀의 범위를 표시함
        // 단일셀 선택시는 표시가 잘 안됨 << 개선노력 필요함
        _setSelection: function(st,row,col,rowCount,colCount){
	    	var _this = this;
	    	var _obj = this.element;
	        var vOption = this.options;

	        if (rowCount == undefined){rowCount = 1;}
	        if (colCount == undefined){colCount = 1;}

        	_this.spread.setActiveSheet(st);
        	sheet = _this.spread.getActiveSheet();
        	sheet.setSelection(row,col,rowCount,colCount);
        	_this._CellFocusToolbar("nameBoxSelect", {"col":col, "row":row, "sheet":sheet, "sheetName":st });
        	_this.spread.showCell(row, col, GcSpread.Sheets.VerticalPosition.top, GcSpread.Sheets.HorizontalPosition.left);
        },
        _setNameBox: function(data){
	    	var _this = this;
	    	var _obj = this.element;

        	var
        	  	sheet = _this.spread.getActiveSheet()
	          	,selections = sheet.getSelections()
	           	,_scell = selections[0]
        		,_sName = sheet.getName()
	          ;

        	if (selections.length == 0){
        		var
	        	  	_scell=sheet.getCell(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex())
	        	    ,_cellSpreadNum = convertSpreadNumToAlph(_sName, _scell.col, _scell.row)
	        	    ,_cellSpreadNumS = convertSpreadNumToAlphS(_scell.col, _scell.row)
	        	;

        		_this.nameBox.val(_cellSpreadNumS);
	        	_this.nameBox.attr('fullName', _cellSpreadNum);
        	} else {
		        var
			        _fromName = convertSpreadNumToAlph(_sName, _scell.col, _scell.row)
			        ,_toName = convertSpreadNumToAlph(_sName, _scell.col + _scell.colCount-1, _scell.row + _scell.rowCount-1)
			        ,_fromNameS = convertSpreadNumToAlphS(_scell.col, _scell.row)
			        ,_toNameS = convertSpreadNumToAlphS(_scell.col + _scell.colCount-1, _scell.row + _scell.rowCount-1)
			        ;

		        // 선택영역이 머지된 경우라면 첫번째 셀을 리턴한다
		        //if (_this._isMergeCell(sheet,_scell)){
		        if (_this._isMergeCell()){
		        	_toName = _fromName;
		        }

		        if (_fromName == _toName){
		        	_this.nameBox.val(_fromNameS);
		        	_this.nameBox.attr('fullName', _fromName);
		        } else {
		        	_this.nameBox.val(_fromNameS+":"+_toNameS);
		        	//_this.nameBox.val(_fromName+":"+_toName.replace(_sName+"!",""));
		        	_this.nameBox.attr('fullName', _fromName+":"+_toName.replace(_sName+"!",""));
		        }
	        }

	        _this._showCustomName();
        },

        _showCustomName: function() {
	    	var _this = this, _obj = this.element;
    	  	var _selectFormula = _this.nameBox.attr('fullName');

    	  	if (_selectFormula && _this.spread.toJSON().names){
				$.each(_this.spread.toJSON().names, function(i,k){
					if(_selectFormula == k.formula) {
						_this.nameBox.val(k.name);

						return false;
					}
				});
    	  	}
        },
        _isMergeCell: function(_sheet, _scell){
        /* 선택영역이 머지된 셀인지 파악한다 */
			var _this = this, _obj = this.element;
        	var
        	    sheet = _this.spread.getActiveSheet()
	          , selections = sheet.getSelections()
	          , scell = selections[0]
	        ;

			if (_sheet){sheet = _sheet;}
			if (_scell){scell = _scell;}

			if (scell.length == 0){
				return false;
			}

			var
				nextColCell = sheet._getNextColumn(scell.row, scell.col)
			,	nextRowCell = sheet._getNextRow(scell.row, scell.col)
			,	isMerge = false
			;

			if (scell.colCount > 1 && (nextColCell.c >= scell.col+scell.colCount)){
				isMerge = true;
			}

			if (scell.rowCount > 1 && (nextRowCell.r >= scell.row+scell.rowCount)){
				isMerge = true;
			}

			return isMerge;
        },
        /* ------------------------------------------------------------------------------------------------------------
         *  환경설정영역
        ------------------------------------------------------------------------------------------------------------ */
        _setOptions: function setOptions() {
	    	var _this = this, _obj = this.element;

		    this._superApply( arguments );
		},
		_setOption: function setOption( key, value ) {
	    	var _this = this;
	    	var _obj = this.element;

		    try{
		    	var _this = this;

		    	_this._super( key, value );

		    	if (typeof (value) == "string" ) {
		    		value = value.trim();
		    	}

		    	switch (key){
			    	case "bDragMode":
			    		_this._setDragMode();
			    		break;
			    	case "bEditMode":
			    		_this._setEditMode();
			    		break;
		    	}
		    } catch(e){
		    	alert(e);
		    }
		},
		/* 표모드와 편집모드로 나눔  신규작성은 표모드, 오픈시는 편집모드로 구성함 */
		_setWriteMode: function(para) {
			/* 테이블작성모드인지 셀편집모드인지 결정함 */
			var _this = this, _obj = this.element;
			$("[aria-command='editMode-table'],[aria-command='editMode-pencil']",_this.toolbar).removeClass("active");

			if (para=="table"){
				$("[aria-command='editMode-table']",_this.toolbar).addClass("active");
				_this.editMode = "table";
			}else if (para=="pencil"){
				$("[aria-command='editMode-pencil']",_this.toolbar).addClass("active");
				_this.editMode ="pencil";
			}
		},
        _setEditMode: function(bMode){
    		var _this = this;
    		var _obj = this.element;

    		_this.spread.isPaintSuspended(true);

    		if (bMode != undefined){_this.options.bEditMode = bMode;}

    		if (_this.options.bEditMode) {
	    		_this.spread.tabEditable(true); // 탭명칭 바로 수정하기 설정
				_this.spread.newTabVisible(true);
				_this.spread.tabStripVisible(true);
				_this.spread.scrollbarShowMax(false);
				_this.spread.scrollbarMaxAlign(true);
				_this.spread.showHorizontalScrollbar(true);
				_this.spread.showVerticalScrollbar(true);

	    		for(var i=0;i< _this.spread.sheets.length;i++) {
					var sheet = _this.spread.sheets[i];
					sheet.setDefaultStyle(_this.defaultStyle, GcSpread.Sheets.SheetArea.viewport);

					sheet.setRowHeaderVisible(true);
					sheet.setColumnHeaderVisible(true);
					sheet.setIsProtected(false);
				}

				$(".tableTitle", _obj).toggle(false);

				_this._setOption("bDragMode", false);
				_this._setBackColor();

    		} else {
				$(".MenuArea", _obj).toggle(false);

				_obj.find(".option-row, .spreadJson, header, input[type='file']").toggle(false);

				_this.spread.tabStripVisible(false);
				_this.spread.tabEditable(false); // 탭명칭 바로 수정하기 설정
				_this.spread.showHorizontalScrollbar(true);
				_this.spread.showVerticalScrollbar(true);

	    		for(var i=0;i< _this.spread.sheets.length;i++) {
					var sheet = _this.spread.sheets[i];
					sheet.setDefaultStyle(_this.defaultStyle, GcSpread.Sheets.SheetArea.viewport);

					sheet.setRowHeaderVisible(false);
					sheet.setColumnHeaderVisible(false);
					sheet.setIsProtected(true);
					sheet.clearSelection();
				}

	    		_this.spread.setActiveSheetIndex(0);
    		}

			_this.spread.isPaintSuspended(false);
        },

        refresh: function(){
        	this.spread.refresh();

        },
		_setDragMode: function(){
    		var _this = this;
    		var _obj = this.element;

			_this.spread.bind($.wijmo.wijspread.Events.CellClick, function(event, data) {
				var CellName = convertSpreadNumToAlph(data.sheetName , data.col , data.row);
				var _y = data.sheet._currentTarget.y + _obj.find(".spreadDoc")[0].offsetTop ;
				var _x = data.sheet._currentTarget.x + _obj.find(".spreadDoc")[0].offsetLeft;

				if (data.row == undefined || data.col == undefined ) {
					return false;
				}

				$("#dropcell").remove();

				if (_this.options.bDragMode){
					$("<a id='dropcell' style='position: absolute; top:"+_y+"px; left:"+ _x+"px;'>"+CellName+"</a>").appendTo(_obj).draggable({
						stop: function(event, ui ) {
				    	  	ui.helper.remove();
				      	}
					});
				}
			});
        },
        _initDoc: function(){
        	var _this = this,  _obj = this.element;

			_this.spread.clearSheets();
			_this.spread.clearCustomNames();
			//_this.spread.clearCustomFunctions();

			if (_this.options.bEditMode){
				var newSheet = new GcSpread.Sheets.Sheet('Sheet1');
				//var newSheet = new _this.spread.Sheet('Sheet1');

				_this.spread.addSheet(0, newSheet);
			}

			_this.exportSet = {};

			var sheet = _this.spread.getActiveSheet();

			if (sheet){
				sheet.setColumnCount(_this.options.colCount);
				sheet.setRowCount(_this.options.rowCount);
				sheet.setSelection(0,0,1,1);
				sheet.setDefaultStyle(_this.defaultStyle, GcSpread.Sheets.SheetArea.viewport);
				sheet.setGridlineOptions({color:"#d7dae0", showVerticalGridline: true, showHorizontalGridline: true});
				sheet.addKeyMap(113, false, false, false, false, function () {
	    			if (!sheet.isEditing()) {
	    				sheet.startEdit();
	    			}
	    		});


			}

			_this.setTitle(_this.docInfo.valblFormatNm);
        },
		_setBackColor: function(color){
			var _this = this, _obj = this.element

			if (color){_this.options.backColor = color;}

			_obj.find(".spreadDocFrame").css("background-color",_this.options.backColor );
		},
        /* ------------------------------------------------------------------------------------------------------------
         *  서식여역
        ------------------------------------------------------------------------------------------------------------ */
		clearDoc: function(){
			this._initDoc();
		},
		newDoc: function() {
        	var _this = this, _obj = this.element;

        	_this._modalLoad("dlgDocNew","dlgDocNew.htm");
		},
		findDocLastedit: function(valblFormatNm){
			var
				_this = this
				,params = {
	            	"valblFormatNm": valblFormatNm,
	            	"lastUpdtUserId": 1004
	            };

			App.ajax.getCallData("/cm/s/ke/valblFormatTmplatCtr/getValblFormatTmplatListForJoinKey.do"
				, params
				, function ScCallBack(data){
					data.rows = _this.sort(data.rows, "lastUpdtDt", false);
					_this.getDoc(data.rows[0].valblFormatTmplatNo);
				}
			);
		},
		lockMessage: function(message){
			this.options.lockMessage = message;
		},
        getDoc: function (valblFormatTmplatNo, callback){
        	var _this = this,  _obj = this.element;

			App.ajax.getCallData(this.options.getDocUrl
				, { 'valblFormatTmplatNo': valblFormatTmplatNo}
				, function ScCallBack(data){
					_this.docInfo = data.rows;
					_this.docInfo["valblFormatTmplatNo"] = valblFormatTmplatNo;

					var txtDoc = _this.docInfo.valblFormatCn;

					txtDoc = txtDoc.replaceAll('m/d/yyyy', 'yyyy-mm-dd');

					var doc = JSON.parse(txtDoc);

					_this.setTitle(_this.docInfo.valblFormatNm);
					_obj.find("[aria-command='save'],[aria-command='delete'],[aria-command='print']").toggle(true);
					_this._setWriteMode("pencil");
					_this.fromJson(doc, callback);

					if (_this.docInfo["editPosblAt"] == "2"){

						if(_this.options.bEditMode) {
							alert("서식잠김 상태입니다. 해당서식이 업무에서 적용되어 사용중입니다.");
						}
			    		for(var i=0;i< _this.spread.sheets.length;i++) {
							var sheet = _this.spread.sheets[i];
							sheet.setIsProtected(true);
						}

					} else {
						//alert("잠김문서해제");
						//_this.options.bEditMode = true;
					}

					parent.window.scroll(0,0);
				}
				, function ErCallBack(data){
					alert('error');
				}
			);
        },
        setTitle: function(str) {
        	var _this = this,  _obj = this.element;

        	$("header .titleName", _obj).text(str);
        },
        deleteDoc: function(){
        	var _this = this,  _obj = this.element;

        	if (_this.docInfo.valblFormatTmplatNo == ""){
				_this._initDoc();

				return;
			}

			_this.docInfo["rowSttus"] = "3"
			_this.docInfo["menuPID"] = parent.PT.utils.url.params.mId;

			var rows = [_this.docInfo] , params = {"MM8701546635740": JSON.stringify(rows)};

			STD.Mssage.message(this,"CM0037","delDoc",function(mId){
				if(mId == "delDocTrue"){
					App.ajax.getCallData(_this.options.setFullDocUrl
						, params
						, function ScCallBack(data){
							_this._initDoc();
						}
					);
				}
			});

        },
        /* 삭제후 서식 작성모드 */
        saveDoc: function(){
        	var _this = this,  _obj = this.element;

        	if (_this.docInfo.valblFormatTmplatNo == ""){
				_this.docInfo["rowSttus"] = "1"
			} else {
				_this.docInfo["rowSttus"] = "2"
			}

        	if(_this.docInfo["editPosblAt"] == "2"){
        		alert("서식 잠김 상태에서는 저장할수 없습니다. 다른이름으로 저장하기를 통해서 복사저장하세요");
        		return;
        	}

        	var doc = _this.toJson();
			_this.docInfo["valblFormatCn"] = JSON.stringify(doc);
			_this.docInfo["menuPID"] = parent.PT.utils.url.params.mId;

			var rows = [];

			rows.push(_this.docInfo);

			var params = {"MM8701546635740": JSON.stringify(rows)};

			App.ajax.getCallData(_this.options.setFullDocUrl
				, params
				, function ScCallBack(data){
					if (_this.docInfo["rowSttus"] == "1"){
						_this.findDocLastedit(_this.docInfo["valblFormatNm"]);
					}
				}
			);
        },
        saveAsDoc: function(){
        	var _this = this, _obj = this.element;

        	_this._modalLoad("dlgDocSaveAs","dlgDocSaveAs.htm");
        },
		findDoc: function() {
        	var _this = this, _obj = this.element;
        	_this._modalLoad("dlgDocFind","dlgDocFind.htm");
		},
        docProperty: function() {
        	var _this = this, _obj = this.element;

        	_this._modalLoad("dlgDocProperty","dlgDocProperty.htm");
        },
        dlgCustomNameFind: function() {
        	var _this = this, _obj = this.element;

        	_this._modalLoad("dlgCustomNameFind","dlgCustomNameFind.htm");
        },
        dlgDataSetFind: function() {
        	var _this = this, _obj = this.element;

        	_this._modalLoad("dlgDataSetFind","dlgDataSetFind.htm");
        },

        sheetProperty: function() {
        	var _this = this, _obj = this.element;

        	_this._modalLoad("sheetProperty","sheetProperty.htm");
        },
        tableProperty: function() {
        	var _this = this, _obj = this.element;

        	_this._modalLoad("tableProperty","tableProperty.htm");
        },
        setFocus: function(position) {
	    	var _this = this, _obj = this.element;
	    	if(_this.setFocusClicked){
	    		return;
	    	} else {
	    		_this.setFocusClicked  = true;
	    	}

			var cellPosition = position.split(".");
			var sheetIndex = _this.spread.getSheetIndex(cellPosition[0]);
			var sheet = _this.spread.getSheet(sheetIndex);

			_this.spread.setActiveSheetIndex(sheetIndex);

			var oldColor = sheet.getCell(cellPosition[2], cellPosition[1]).backColor();

			sheet.getCell(cellPosition[2], cellPosition[1]).backColor(_this.options.focusColor);

			var moveRowIndex = (cellPosition[2]-10) >=0 ? cellPosition[2]-10 : 0 ;

			_this.spread.showCell(moveRowIndex, 0, GcSpread.Sheets.VerticalPosition.top, GcSpread.Sheets.HorizontalPosition.left);

			window.setTimeout(
				function() {
					sheet.getCell(cellPosition[2], cellPosition[1]).backColor(oldColor);
					_this.setFocusClicked  = false;
				}
				, 300
			);
		},
        /* 모달창 공통팝업용 */
        _modalLoad: function(name, url, callback){
        	var _this = this, _obj = this.element, kid = _obj.attr("id");

        	if (!kid){
        		alert("KEDITOR ID확인이 되지 않아서 modal창을 실행할수 없습니다.");

        		return;
        	}

        	if (_this.modals[name]){
        		_this.modals[name].modal("show");
        	} else {
				_this.modals[name] = $('<div class="modal fade" name="'+name+'" keditor="'+ kid +'" ></div>').appendTo(document.body); //.appendTo(_obj);
				_this.modals[name].load(_this.options.libPath +  url+"?"+_this.getTimeStamp(), function(d){
					if (callback){callback(d,_this.modals[name]);}
				});
        	}
	    },
        /* ------------------------------------------------------------------------------------------------------------
         *  export / impport
        ------------------------------------------------------------------------------------------------------------ */
        exportToJSON: function(option)  {
	    	var _this = this;
	    	var _obj = this.element;


	    	function getFileName() {
		        function to2DigitsString(num) {
		            return ("0" + num).substr(-2);
		        }

		        var date = new Date();

		        return [
		            //"export",
		            _this.docInfo.valblFormatNm,
		            "-",
		            date.getFullYear(), to2DigitsString(date.getMonth() + 1), to2DigitsString(date.getDate()),
		            to2DigitsString(date.getHours()), to2DigitsString(date.getMinutes()), to2DigitsString(date.getSeconds())
		        ].join("");
		    }

		    var json = _this.toJson();

		    if (option == "blank"){
		    	json["dataSource"] = {};
		    	json["exportSet"] = {};
		    }

		    var text = JSON.stringify(json);
		    var fileName = getFileName();

		    saveAs(new Blob([text], { type: "text/plain;charset=utf-8" }), fileName + ".kef");
		},
		exportToXls: function() {
    		var _this = this, _obj = this.element;
		    var doc = {
		    	"spread": _this.spread.toJSON(),
		    	"exportFileType":"xlsx",
		    	"excel":{"saveFlags":0,"password":""}
		    };

		    exportFile("http://spread.grapecity.com/Demos/JS/ExcelIOSample/Home/Export", JSON.stringify(doc));
		},

		importFromJSON: function(){
    		var _this = this, _obj = this.element;

    		$('input[type="file"]', _obj).attr("accept",".kef,.json");
			$('input[type="file"]', _obj).unbind( "change" ).change(function(e){

	        	var file = e.target.files[0];

	        	function importSuccessCallback(responseText) {
	        		/* 엑셀로 컨버전한 경우의 서식를 읽어올때 날짜서식 포멧이 틀리는 경우를 바로잡기 */
	        		responseText = responseText.replaceAll("m/d/yyyy", "yyyy-MM-dd")

				    var doc = JSON.parse(responseText);

				    if (doc.version && doc.sheets) {

				        _this.fromJson(doc);
					    /* 동일한 외부 kef 파일을 가져오는 경우 초기화 하지 않음 change 이벤트가 발새아지 않는 문제 해결 */
					    /* 김성민 2016-11-22 */
					   $('input[type="file"]', _obj).val("");

				    } else {
				        alert(getResource("messages.invalidImportFile"));
				    }
				}

	            var reader = new FileReader();

	            reader.onload = function () {
				    importSuccessCallback(this.result);
				};

				reader.readAsText(file);
			 });

			 $('input[type="file"]', _obj).trigger('click');
		},
		importFromXls: function(){
    		var _this = this, _obj = this.element;

    		$('input[type="file"]', _obj).attr("accept",".xlsx,.xls");
			$('input[type="file"]', _obj).unbind( "change" ).change(function(e){

				var _formData = new FormData();

				_formData.append('file[0]', e.target.files[0]);

		        $.ajax({
		            type: "POST",
		            url: "http://spread.grapecity.com/Demos/JS/ExcelIOSample/Home/Import",
		            data: _formData,
		            cache: false,
		            contentType: false,
		            processData: false,
		            success: function (msg) {
		            	var doc = JSON.parse(msg);

		            	_this.fromJson(doc);
		            },
		            error: function (msg) {
		            	alert("upload오류");
		            }
		        });
			 });

			 $('input[type="file"]', _obj).trigger('click');
		},
        /* ------------------------------------------------------------------------------------------------------------
         *  data query bind
        ------------------------------------------------------------------------------------------------------------ */
	    SqlDataDrag: function() {
	    	var _this = this, _obj = this.element;

	    	_this.modalLoad("dlgCellTable","dlgCellTable.htm");
	    },
        dlgTableFromView: function(){
        	var _this = this, _obj = this.element;

        	_this._modalLoad("dlgTableFromView","dlgTableFromView.htm");
        },
        dlgTableFromSql: function(){
        	var _this = this, _obj = this.element;

        	_this._modalLoad("dlgTableFromSql","dlgTableFromSql.htm");
        },
        dlgCellFromSql: function(){
        	var _this = this, _obj = this.element;

        	_this._modalLoad("dlgCellFromSql","dlgCellFromSql.htm");
        },
        dlgCsvFromSql: function(){
        	var _this = this, _obj = this.element;

        	_this._modalLoad("dlgCsvFromSql","dlgCsvFromSql.htm");
        },
        dlgCsvFromView: function(){
        	var _this = this, _obj = this.element;

        	_this._modalLoad("dlgCsvFromView","dlgCsvFromView.htm");
        },
        _colWidth : function() {
        	var _this = this;
        	var _obj = this.element;
            var sheet = _this.spread.getActiveSheet();
        	var _Selections = sheet.getSelections();
        	var _width = sheet.getColumnWidth(_Selections[0].col);
        	//instance.getColumnWidth(col, sheetArea);

        	_this._getText("열 너비를 입력하세요",_width, function(text){
        		$.each(_Selections, function(select, colHead) {
        			for(var i=colHead.col; i< colHead.col+colHead.colCount ; i++ ){
        				 sheet.setColumnWidth(i, text);
        			}
        		})
        	});
        },
        _rowHeight : function() {
        	var _this = this;
        	var _obj = this.element;
            var sheet = _this.spread.getActiveSheet();
        	var _Selections = sheet.getSelections();
        	var _width = sheet.getRowHeight(_Selections[0].row);

        	_this._getText("행 높이를 입력하세요",_width, function(text){
        		$.each(_Selections, function(select, rowHead) {
        			for(var i=rowHead.row; i< rowHead.row+rowHead.rowCount ; i++ ){
        				 sheet.setRowHeight(i, text);
        			}
        		})
        	});
        },
        _getText: function(title,value, callback) {
        	var _this = this;
        	var _obj = this.element;

			var
				dHtml = ''
					+' <div class="modal fade">'
					+'     <div class="modal-dialog sql-bind modal-sm">'
					+'         <div class="modal-content">'
					+'             <div class="modal-header">'
					+'                 <button type="button" class="close" data-dismiss="modal" aria-command="Close"><span aria-hidden="true">&times;</span></button>'
					+'                 <h4 class="modal-title"><label>'+title+' </label></h4>'
					+'             </div>'
					+'             <div class="modal-body SaaS">'
					+'             		<div class="form-group">'
					+'             			<input type="text" class="form-control" name="getText">'
					+'             		</div>'
					+'             </div>'
					+'             <div class="modal-footer">'
					+'                 <button type="button" role="Ok" class="btn btn-default"  data-dismiss="modal">확인</button>'
					+'                 <button type="button" role="close" class="btn btn-default" data-dismiss="modal">닫기</button>'
					+'             </div>'
					+'         </div>'
					+'     </div>'
				;

			var frmDialog = $(dHtml);

			$('[role="Ok"]',frmDialog).click(function(e){
				var getText = frmDialog.find("input[name='getText']").val();

				if (callback){
  					callback(getText);
  				}
			});

			frmDialog.on('shown.bs.modal', function (e) {
				if(value){
					frmDialog.find("input[name='getText']").val(value);
				}
			}).on('hide.bs.modal', function (e) {
				frmDialog.remove();
			});

			frmDialog.modal();
        },
        _getCheckText: function(tText, fText, callback) {
        	var _this = this;
        	var _obj = this.element;

			var
			    dHtml = ''
					+' <div class="modal fade">'
					+'     <div class="modal-dialog sql-bind modal-sm">'
					+'         <div class="modal-content">'
					+'             <div class="modal-header">'
					+'                 <button type="button" class="close" data-dismiss="modal" aria-command="Close"><span aria-hidden="true">&times;</span></button>'
					+'                 <h4 class="modal-title"><label>체크박스 옵션 </label></h4>'
					+'             </div>'
					+'             <div class="modal-body SaaS">'
					+'             		<div class="form-group">'
					+'             			<label>선택 표시</label>'
					+'             			<input type="text" class="form-control" name="tText">'
					+'             		</div>'
					+'             		<div class="form-group">'
					+'             			<label>비선택 표시</label>'
					+'             			<input type="text" class="form-control" name="fText">'
					+'             		</div>'
					+'             </div>'
					+'             <div class="modal-footer">'
					+'                 <button type="button" role="Ok" class="btn btn-default"  data-dismiss="modal">확인</button>'
					+'                 <button type="button" role="close" class="btn btn-default" data-dismiss="modal">닫기</button>'
					+'             </div>'
					+'         </div>'
					+'     </div>'
				;

			var frmDialog = $(dHtml);

			$('[role="Ok"]',frmDialog).click(function(e){
				var tText = frmDialog.find("input[name='tText']").val();
				var fText = frmDialog.find("input[name='fText']").val();

				if (callback){
  					callback(tText, fText);
  				}
			});

			frmDialog.on('shown.bs.modal', function (e) {
				if(!tText){tText = "선택";}
				if(!fText){fText = "취소";}

				frmDialog.find("input[name='tText']").val(tText);
				frmDialog.find("input[name='fText']").val(fText);
			}).on('hide.bs.modal', function (e) {
				frmDialog.remove();
			});

			frmDialog.modal();
        },
        _getComboText: function(tText, vText, callback) {
        	var _this = this;
        	var _obj = this.element;

			var
			    dHtml = ''
					+' <div class="modal fade">'
					+'     <div class="modal-dialog sql-bind modal-sm">'
					+'         <div class="modal-content">'
					+'             <div class="modal-header">'
					+'                 <button type="button" class="close" data-dismiss="modal" aria-command="Close"><span aria-hidden="true">&times;</span></button>'
					+'                 <h4 class="modal-title"><label>선택박스 옵션 </label></h4>'
					+'             </div>'
					+'             <div class="modal-body SaaS">'
					+'             		<div class="form-group">'
					+'             			<label>표시</label>'
					+'             			<input type="text" class="form-control" name="tText">'
					+'             		</div>'
					+'             		<div class="form-group">'
					+'             			<label>값</label>'
					+'             			<input type="text" class="form-control" name="vText">'
					+'             		</div>'
					+'             </div>'
					+'             <div class="modal-footer">'
					+'                 <button type="button" role="Ok" class="btn btn-default"  data-dismiss="modal">확인</button>'
					+'                 <button type="button" role="close" class="btn btn-default" data-dismiss="modal">닫기</button>'
					+'             </div>'
					+'         </div>'
					+'     </div>'
				;

			var frmDialog = $(dHtml);

			$('[role="Ok"]',frmDialog).click(function(e){
				var tText = frmDialog.find("input[name='tText']").val();
				var vText = frmDialog.find("input[name='vText']").val();

				if (callback){
  					callback(tText, vText);
  				}
			});

			frmDialog.on('shown.bs.modal', function (e) {
				if(!tText){tText = "우리나라,무궁화";}
				if(!vText){vText = "1,2";}

				frmDialog.find("input[name='tText']").val(tText);
				frmDialog.find("input[name='vText']").val(vText);
			}).on('hide.bs.modal', function (e) {
				frmDialog.remove();
			});

			frmDialog.modal();
        },
        _camelToDash: function (str) {
        	var rlt =  str.replace(/\W+/g, '_').replace(/([a-z\d])([A-Z])/g, '$1_$2');

        	return rlt.toUpperCase()
        },
        /* -------------------------------------------------------------------------------------
         *  sql 데이터를 폼양식에 바인딩한다
         ------------------------------------------------------------------------------------- */
        clearDataBind: function(){
        /* 시트의 데이터 바인딩된 정로를 지움 */
        	var _this = this;
	    	var _obj = this.element;

	    	//_this.clearCsvFromDBSql();
			var dataSetClear = {};

			/* 기존버전의 바인딩 유지 */
        	if (_this.exportSet.sqlBind){
				$.each(_this.exportSet.sqlBind, function(k, row) {
					_this.clearCsvDataBind(k);
				});
        	}

			for(var i=0;i< _this.spread.sheets.length;i++) {
				var sheet = _this.spread.sheets[i];

				$.each(sheet._tableManager._tableList, function(i, table) {
					var bindName = table._bindingPath;

					dataSetClear[bindName] = [];
					_this.dataSource._source[bindName] = [];
				});
    		}

			dataSourceClear = new GcSpread.Sheets.CellBindingSource(dataSetClear);

			/* 시트의 초기화 */
			for(var i=0;i< _this.spread.sheets.length;i++) {
				_this.spread.sheets[i].setDataSource(dataSourceClear);
			}
        },
        setDataBind: function (){
	    	var _this = this;
	    	var _obj = this.element;

	    	_this.bLoopChk = false;
	    	/* 구 SQL DB관리용 버전 데이터 바인딩 */
	    	// _this.setCsvFromDBSql();

       		_this.clearDataBind();

//        	_this.spread.isPaintSuspended(false);
        	try {
				/* 시트의 초기화 */
        		var dataSetClear = {};

        		dataSourceClear = new GcSpread.Sheets.CellBindingSource(dataSetClear);

				for(var i=0;i< _this.spread.sheets.length;i++) {
					var sheet = _this.spread.sheets[i];

					sheet.setDataSource(dataSourceClear);
				}

		    	/* 기존버전의 바인딩 유지 */
	        	if (_this.exportSet.sqlBind){
					_this.aSyncCnt = Object.keys(_this.exportSet.sqlBind).length;

					$.each(_this.exportSet.sqlBind, function(k, row) {
						sql = row.sql;
						bdName = k;

						_this._setDataBind(bdName, sql);

						//if (!_this.bLoopChk) {
						//	return false;
						//}
					});
	        	}

				if (!_this.exportSet.tableBind) {
					return;
				}

				var bindCount = Object.keys(_this.exportSet.tableBind).length;

				$.each(_this.exportSet.tableBind, function(bindName, table) {
					var sql = _this.exportSet.tableBind[bindName].sql;

					if(!sql) {
						alert("자료추출을 위한 "+ bindName + " : command not found");

						return;
					}

					sql = _this._SqlAddPara(sql);

                    var pi = {
                            "para": Jinja.global.string({"excute":sql })
                    };

			        var promise = Jinja.ajax.post({
				        "url": "/webService/jdo.2.2.asmx/jdoExcute",
				        "data":pi,
				        "async": true
			        })
                    .done(function(){
		     			try {
		     				if (_this.exportSet.tableBind[bindName].type == "tableBind"){
		     					_this.dataSource._source[bindName] = data.rows;
		     				} else if (_this.exportSet.tableBind[bindName].type == "cellBind"){
		     					_this.dataSource._source[bindName] = data.rows[0];
		     				}
		     				bindCount--;
		     				if(bindCount == 0){
								for(var i=0;i< _this.spread.sheets.length;i++) {
									_this.spread.sheets[i].setDataSource(_this.dataSource);
								}
								_this._tableSpan();
								//_this.spread.isPaintSuspended(false);
								//alert("바인딩완료");
							}
		     			}catch(e){
		     				bindCount--;

		     				alert(e);

		     				if(bindCount == 0){
								for(var i=0;i< _this.spread.sheets.length;i++) {
									_this.spread.sheets[i].setDataSource(_this.dataSource);
								}

								_this._tableSpan();
								//_this.spread.isPaintSuspended(false);
								//alert("바인딩중지");
							}
		     			}
                    })
                    .fail(function(data){
						alert(data.responseJSON.message);

						bindCount--;

						if(bindCount == 0){
							for(var i=0;i< _this.spread.sheets.length;i++) {
								_this.spread.sheets[i].setDataSource(_this.dataSource);
							}

							_this._tableSpan();
							//_this.spread.isPaintSuspended(false);
							//alert("바인딩중지");
						}

                    });

				});
			} catch(e){
				alert("setDataBind error :"+ e);
			}
        },
        setDataBind2: function (){
	    	var _this = this;
	    	var _obj = this.element;

	    	_this.bLoopChk = false;

       		_this.clearDataBind();

        	try {
        		var dataSetClear = {};

        		dataSourceClear = new GcSpread.Sheets.CellBindingSource(dataSetClear);

				for(var i=0;i< _this.spread.sheets.length;i++) {
					var sheet = _this.spread.sheets[i];

					sheet.setDataSource(dataSourceClear);
				}

	        	if(_this.exportSet.sqlBind){
					_this.aSyncCnt = Object.keys(_this.exportSet.sqlBind).length;

					_this._setDataBindAll(_this.exportSet.sqlBind);
	        	}

				if(!_this.exportSet.tableBind) {
					return;
				}

				var bindCount = Object.keys(_this.exportSet.tableBind).length;

				$.each(_this.exportSet.tableBind, function(bindName, table) {
					var sql = _this.exportSet.tableBind[bindName].sql;

					if(!sql) {
						alert("자료추출을 위한 "+ bindName + " : command not found");

						return;
					}

					sql = _this._SqlAddPara(sql);

                    var pi = {
                            "para": Jinja.global.string({"excute":sql })
                    };

			        Jinja.ajax.post({
				        "url": "/webService/jdo.2.2.asmx/jdoExcute",
				        "data":pi,
				        "async": true
                     })
                    .done(function (data) {
		     			try {
		     				if (_this.exportSet.tableBind[bindName].type == "tableBind"){
		     					_this.dataSource._source[bindName] = data.rows;
		     				} else if (_this.exportSet.tableBind[bindName].type == "cellBind"){
		     					_this.dataSource._source[bindName] = data.rows[0];
		     				}
		     				bindCount--;
		     				if(bindCount == 0){
								for(var i=0;i< _this.spread.sheets.length;i++) {
									_this.spread.sheets[i].setDataSource(_this.dataSource);
								}
								_this._tableSpan();
							}
		     			}
                        catch(e){
		     				bindCount--;

		     				alert(e);

		     				if(bindCount == 0){
								for(var i=0;i< _this.spread.sheets.length;i++) {
									_this.spread.sheets[i].setDataSource(_this.dataSource);
								}

								_this._tableSpan();
							}
		     			}
        
			        })
                    .fail(function(data){
						alert(data.responseJSON.message);

						bindCount--;

						if(bindCount == 0){
							for(var i=0;i< _this.spread.sheets.length;i++) {
								_this.spread.sheets[i].setDataSource(_this.dataSource);
							}

							_this._tableSpan();
						}
				        
			        });
				});
			} catch(e){
				alert("setDataBind2 error :"+ e);
			}
        },
        dlgBCsvFromSql: function (valblFormatTmplatNo,  para){
        	/* 구  sql별도 DB관리용 바인딩 */
	    	var _this = this;
	    	var _obj = this.element;

	    	_this.setCsvFromDBSql(valblFormatTmplatNo,  para);
        },
        setCsvFromDBSql: function (valblFormatTmplatNo,  para){
        	/* 구  sql별도 DB관리용 바인딩 */
	    	var _this = this;
	    	var _obj = this.element;

	    	if (valblFormatTmplatNo == undefined){
        		valblFormatTmplatNo = _this.docInfo .valblFormatTmplatNo;
        	}

	    	var params = {"valblFormatTmplatNo" : valblFormatTmplatNo};

	    	if(para){_this.sqlPara = para;}

        	if (valblFormatTmplatNo == "") {
				return ;
			}

			App.ajax.getCallData(this.options.getSqlUrl
				, params
				, function ScCallBack(data){
					totBintCount = data.rows.length ;
					endBintCount = data.rows.length ;
					_this.aSyncCnt = data.rows.length;

					$.each(data.rows, function(i, row) {
       					sql = row.excelMapngSqlCn;
        				bdName = row.bsisDtaMapngNm;
       					_this._setDataBind(bdName, sql);

       					//if (!_this.bLoopChk) {

	       				//	return false;
	       				//}
       				});
				}
				, function ErCallBack(data){
	       			alert('기초자료생성을 위한 정보수집이 장애가 발생하였습니다.');
				}
			);
        },
        clearCsvFromDBSql: function (valblFormatTmplatNo){
        	/* 구  sql별도 DB관리용 바인딩 */
	    	var _this = this;
	    	var _obj = this.element;

	    	if (valblFormatTmplatNo == undefined){
        		valblFormatTmplatNo = _this.docInfo .valblFormatTmplatNo;
        	}
        	var params = {"valblFormatTmplatNo" : valblFormatTmplatNo};

			App.ajax.getCallData(this.options.getSqlUrl
				, params
				, function ScCallBack(data){
					totBintCount = data.rows.length ;
					endBintCount = data.rows.length ;
					_this.aSyncCnt = data.rows.length;

					$.each(data.rows, function(i, row) {
        				bdName = row.bsisDtaMapngNm;
       					_this.clearCsvDataBind(bdName);
       				});
				}
				, function ErCallBack(data){
	       			alert('기초자료 초기화작업에 장애가 발생하였습니다.');
				}
			);
        },
        clearCsvDataBind: function (BingingName){
        	/* 구 csv 방식 데이터 정리 */
	    	var _this = this;
	    	var _obj = this.element;

       		//셋팅한 바인딩 정보 조회
			var bindingInfo = _this._getBindingInfo(BingingName);

			sheet = _this.spread.getSheetFromName(bindingInfo[0])

    		//바인딩 데이터 해제(데이터 삭제 처리)
			if (bindingInfo.length > 0) {
				_this._removeGridDataTypeBinding(sheet, bindingInfo, 50) ;
			}
        },

        setCsvDataBind: function (BingingName, row,col,sql){
        	/* 구 CSV방식의 데이터 바인딩 */
	    	var _this = this;
	    	var _obj = this.element;

	    	sql = _this._SqlAddPara(sql);


            var pi = {
                    "para": Jinja.global.string({"excute":sql })
            };

			Jinja.ajax.post({
				"url": "/webService/jdo.2.2.asmx/jdoExcute",
				"data":pi,
				"async": true
             })
            .done(function (data) {
     			try {

       				var sheet = _this.spread.getActiveSheet();

       				//바인딩 명 셋팅
       				_this._setBingingName(sheet, BingingName, row, col);
       				//셋팅한 바인딩 정보 조회

       				var bindingInfo = _this._getBindingInfo(BingingName);
       				//데이터 컨버팅
       				var csv = _this._convertDataToCsv(bindingInfo, data.rows, '^', '|');
       				//데이터 spread 에 셋팅

       				_this._setGridDataTypeBinding(csv, bindingInfo, '^', '|');
     			}catch(e){
     				alert(e + ':기초자료를 가져왔으나 해당 서식에서 바인딩영역를 인지할수 없습니다.');

     				_this.bLoopChk = false;

     				return false;
     			}
			})
            .fail(function(data){
     			alert('해당하는 기초자료를 수집할수 없습니다.');

     			_this.bLoopChk = false;
				
			});

        },
        _setBindTable: function (table, sql, sht){
	    	var _this = this;
	    	var _obj = this.element;

	    	var bindName = table.bindingPath();

	    	table.autoGenerateColumns(false);

			_this._setBindSql(bindName, sql, sht, table);

	        for (var i=0; i<table._colCount;i++){
	        //	table.filterButtonVisible(i,false);
	        }
        },
        _setBindSql: function (bindName, sql, sht, tbl){
	    	var _this = this;
	    	var _obj = this.element;
			var sheet ;

			if (sht){
				sheet = sht;
			} else {
				sheet = _this.spread.getActiveSheet();
			}

	   		sql = _this._SqlAddPara(sql);

            var pi = {
                    "para": Jinja.global.string({"excute":sql })
            };


			Jinja.ajax.post({
				"url": "/webService/jdo.2.2.asmx/jdoExcute",
				"data":pi,
				"async": true
            })
            .done(function (data) {
     			try {
     				_this.spread.isPaintSuspended(true);
     				_this.dataSource._source[bindName] = data.rows;

     				sheet.setDataSource(_this.dataSource, false);

     				if (tbl){
					    for (var i=0; i<tbl._colCount;i++){
					        //tbl.filterButtonVisible(i,false);
					    }
     				}
     				_this.spread.isPaintSuspended(false);
     			}catch(e){
     				alert('기초자료를 가져왔으나 해당 서식에서 바인딩영역를 인지할수 없습니다.');

     				_this.bLoopChk = false;

     				return false;
     			}
            })
            .fail(function(data){
     			alert('해당하는 기초자료를 수집할수 없습니다.');

     			_this.bLoopChk = false;
			});

        },
		/* 기초자료 쿼리를 실행해서 시트에 채움 */
		_setDataBind: function(bdName, sql){
	    	var _this = this;
	    	var _obj = this.element;
			var bindingName = bdName;
//			var bidingPosition = spreadBindingName.getBindingPositionByName(_this.spread, bdName);
//			if(bidingPosition.length == 0) {
//				delete _this.exportSet.sqlBind[bindingName];
//				return;
//			}

			sql = _this._SqlAddPara(sql);

            var pi = {
                    "para": Jinja.global.string({"excute":sql })
            };

			Jinja.ajax.post({
				"url": "/webService/jdo.2.2.asmx/jdoExcute",
				"data":pi,
				"async": true
            })
            .done(function (data) {
     			try {
     				if (data.rows.length > 0){
     					if (_this.dataSource._source == undefined){
     						_this.dataSource._source = {};
     					}

						var bidingPosition = spreadBindingName.getBindingPositionByName(_this.spread, bdName);

						if(bidingPosition.length == 0) {
							delete _this.exportSet.sqlBind[bindingName];

							return;
						}

     					_this.dataSource._source[bdName] = data.rows[0][Object.keys(data.rows[0])[0]];
	     				//alert(_this.dataSource._source[bdName]);

	  	   				var dataCsv = csvConverter.convertCSV(_this.spread, bidingPosition, data.rows, '^', '|');

	  	   				spreadDataBinding.gridDataTypeBind(_this.spread, dataCsv, bidingPosition, '^', '|');
     				} else {
     					//alert("해당되는 자료가 없습니다.")
     				}
     			}catch(e){
     				alert(e + ':기초자료를 가져왔으나 해당 서식에서 바인딩영역를 인지할수 없습니다.');

     				_this.bLoopChk = false;

     				return false;
     			}
            })
            .fail(function(data){
     			alert('해당하는 기초자료를 수집할수 없습니다.');

     			_this.bLoopChk = false;
			});
		},
		/* 기초자료 쿼리를 실행해서 시트에 채움 */
		_setDataBindAll: function(sqlBind){
	    	var _this = this;
	    	var _obj = this.element;
	    	var bdNames = new Array();
	    	var sqls = new Array();

	    	$.each(sqlBind, function(k, row) {
				var bidingPosition = spreadBindingName.getBindingPositionByName(_this.spread, k);

				if(bidingPosition.length == 0) {
					delete _this.exportSet.sqlBind[k];
				} else {
					bdNames.push(k);

					var sql = _this._SqlAddPara(row.sql);

					sqls.push(sql);
				}
			});

			var params = {
				'bdNames' : JSON.stringify(bdNames),
				'sqls' : JSON.stringify(sqls)
			};

			App.ajax.getCallData("/cm/s/saas/documentInputCtr/getInputsListAll.do"
				, params
				, function ScCallBack(data) {
					for(var i=0; i<data.rows.length; i++) {
 						try {
	 						var bdName = bdNames[i];

							if(data.rows[i][bdName].length > 0) {
	     						if (_this.dataSource._source == undefined){
	     							_this.dataSource._source = {};
	     						}

	     						var bidingPosition = spreadBindingName.getBindingPositionByName(_this.spread, bdName);

	     						_this.dataSource._source[bdName] = data.rows[i][bdName][0][Object.keys(data.rows[i][bdName][0])[0]];

		  	   					var dataCsv = csvConverter.convertCSV(_this.spread, bidingPosition, data.rows[i][bdName], '^', '|');

		  	   					spreadDataBinding.gridDataTypeBind(_this.spread, dataCsv, bidingPosition, '^', '|');
	     					}
 						} catch(e) {
 	     					alert("바인딩시 오류가 발생 하였습니다.");
 	     				}
 					}
				}
				, function ErCallBack(data) {
					alert(data);
				}
				, false
			);
		},
		_SqlAddPara: function (sql){
			var _this = this;
	    	var _obj = this.element;

			//에디터 모드일 경우 조회 건수 제한
	        if(_this.options.bEditMode) {
	        	sql = _this._SqlAddPara2(sql);
	        } else {
	        	var LineReg = RegExp("\/[\*]?.*[@]?.*[@] ?.* [\*]\/", "gim");
		        var LineArr = sql.match(LineReg);

		        if (LineArr == null) {
		        	return sql;
		        }

		        $.each(LineArr, function (k, mLine) {
		        	var cLine = mLine.replace("/*", "").replace("*/", "");
		        	var paraReg = new RegExp("@+[ a-zA-Z0-9가-힣-_ ]*@", "gim");
		        	var paraArr = cLine.match(paraReg);

			        if (paraArr != null) {
				        $.each(paraArr, function (k2, mPara) {
				        	var cPara = mPara.replace("@", "").replace("@", "").trim();
				        	var ckeyValue = _this.getCustomNameValue(cPara);

				        	if(typeof(ckeyValue) == "string"){
				        		ckeyValue = ckeyValue.trim();
				        	}

				        	if (_this.sqlPara[cPara] !== undefined) {
				        		cPara = _this.sqlPara[cPara];
				        		cLine = cLine.replace(mPara, "'"+cPara+"'");
				        	} else if (ckeyValue != undefined && ckeyValue != "") {
				        		cPara = _this.getCustomNameValue(cPara);
				        		cLine = cLine.replace(mPara, "'"+cPara+"'");
				        	} else {
				        		cLine = mLine;
				        		//alert("K-EDITOR의 전역변수["+mPara+"]가 사용되지만 호출하는 페이지에서 정의가 되지 않았습니다.");

				        		return;
				        	}
				        });

				        sql = sql.replace(mLine,cLine);
	  		        }
		        });
	        }

	        return sql;
		},
		_SqlAddPara2: function (sql){
	    	var _this = this;
	    	var _obj = this.element;
	        var LineReg = RegExp("\/[\*][\#] ?.* [\#][\*]\/", "gim");
	        var LineArr = sql.match(LineReg);

	        if (LineArr == null) {
	        	return sql;
	        }

	        $.each(LineArr, function (k, mLine) {
	        	var cLine = mLine.replace("/*#", "").replace("#*/", "");
	        	var paraReg = new RegExp("@+[ a-zA-Z0-9가-힣-_ ]*@", "gim");
	        	var paraArr = cLine.match(paraReg);

		        if (paraArr != null) {
			        $.each(paraArr, function (k2, mPara) {
			        	var cPara = mPara.replace("@", "").replace("@", "").trim();
			        	var ckeyValue = _this.getCustomNameValue(cPara);

			        	if(typeof(ckeyValue) == "string"){
			        		ckeyValue = ckeyValue.trim();
			        	}

			        	if (_this.sqlPara[cPara] !== undefined) {
			        		cPara = _this.sqlPara[cPara];
			        		cLine = cLine.replace(mPara, "'"+cPara+"'");
			        	} else if (ckeyValue != undefined && ckeyValue != "") {
			        		cPara = _this.getCustomNameValue(cPara);
			        		cLine = cLine.replace(mPara, "'"+cPara+"'");
			        	} else {
			        		cLine = mLine;
			        		//alert("K-EDITOR의 전역변수["+mPara+"]가 사용되지만 호출하는 페이지에서 정의가 되지 않았습니다.");

			        		return;
			        	}
			        });

			        sql = sql.replace(mLine,cLine);
  		        } else {
  		        	sql = sql.replace(mLine,cLine);
  		        }
	        });

	        return sql;
		},
		preViewer: function(){
        	var _this = this, _obj = this.element,	kid = _obj.attr("id");
        	var name = 'previewer', url = "previewer.htm";

        	if (!kid){
        		alert("KEDITOR ID확인이 되지 않아서 modal창을 실행할수 없습니다.");
        		return;
        	}

			var pv = $('<div class="ke-previewer" name="'+name+'" keditor="'+ kid +'" ></div>').appendTo(document.body); //.appendTo(_obj);

			pv.load(_this.options.libPath+url, function(e) {
				parent.window.scroll(0,0);
			});
		},
		/*start 추가 lsh*/
		//바인딩 관련 함수
		/**
		 * 셀에 바인딩 명 셋팅
		 *
		 * @param
		 * 		sheet
		 * 		bindingName
		 * 		row
		 * 		col
		 * @return
		 *
		 */
		_setBingingName: function(sheet, bindingName, row, col) {
	    	var _this = this;
	    	var _obj = this.element;

	    	if(row != null && col != null) {
/*
				function BindingPathCellType() {
	                GcSpread.Sheets.TextCellType.call(this);
	            }

				BindingPathCellType.prototype = new GcSpread.Sheets.TextCellType();
				BindingPathCellType.prototype.paint = function (ctx, value, x, y, w, h, style, context) {
	                if (value === null || value === undefined) {
	                    var sheet = context.sheet
	                    var row = context.row
	                    var col = context.col;
	                    if (sheet && (row === 0 || !!row) && (col === 0 || !!col)) {
	                        var bindingPath = sheet.getBindingPath(context.row, context.col);
	                        if (bindingPath) {
	                           // value = '[' + bindingPath + ']';
	                        }
	                    }
	                }
	                GcSpread.Sheets.TextCellType.prototype.paint.apply(this, arguments);
	            };
*/
	            if(sheet != null) {
	            	//_this.spread.isPaintSuspended(true);
	            	var bindingPathCellType = new BindingPathCellType();

	            	sheet.getCell(row, col).bindingPath(bindingName).cellType(bindingPathCellType).vAlign(GcSpread.Sheets.VerticalAlign.center);

	            	//_this.spread.isPaintSuspended(false);
	            }
			}
		},
		/**
		 * spread 에서 binding 명을 조회 한다.
		 *
		 * @param bindingName
		 * @return
		 * 		[sheetName, row, col, bindingName]
		 */
		_getBindingInfo: function(bindingName) {
	    	var _this = this;
	    	var _obj = this.element;
			var info = [];

			for(var i=0;i< _this.spread.sheets.length;i++){
				var sheet = _this.spread.sheets[i];

				for(var r=0; r<sheet.getRowCount(); r++) {
					for(var c=0; c<sheet.getColumnCount(); c++) {
						var bidingPath = sheet.getBindingPath(r, c, $.wijmo.wijspread.SheetArea.viewport);

						if(bidingPath && bidingPath.length > 0) {
							if(bidingPath.indexOf(bindingName) > -1) {
								info = [sheet._name, r, c, bindingName];

								break;
							}
						}
					}
				}
			}

			return info;
		},
		/**
		 * spread 의 모든 bindingPath 정보 조회
		 *
		 * @param
		 * @return
		 * 		[{
		 * 			sheet: sheet,
		 * 			row: row,
		 * 			col: col,
		 * 			bindingPath: bindingName
		 *		}, {}, {}]
		 */
		_getAllBindingNames: function() {
	    	var _this = this;
	    	var _obj = this.element;
			var info = [];

			for(var i=0;i< _this.spread.sheets.length;i++){
				var sheet = _this.spread.sheets[i];

				for(var r=0; r<sheet.getRowCount(); r++) {
					for(var c=0; c<sheet.getColumnCount(); c++) {
						var path = sheet.getBindingPath(r, c, $.wijmo.wijspread.SheetArea.viewport);

						if(path) {
							info[info.length] = {
								'sheet': sheet, 'row': r, 'col': c, 'bindingPath': path
							};
						}
					}
				}
			}

			return info;
		},
		/**
		 * spread 의 모든  bindingPath 제거
		 *
		 * @param
		 * @return
		 */
		_deleteAllBindingNames: function() {
	    	var _this = this;
	    	var _obj = this.element;

			for(var i=0;i< _this.spread.sheets.length;i++){
				var sheet = _this.spread.sheets[i];

				for(var r=0; r<sheet.getRowCount(); r++) {
					for(var c=0; c<sheet.getColumnCount(); c++) {
						var bidingPath = sheet.getBindingPath(r, c, $.wijmo.wijspread.SheetArea.viewport);

						if(bidingPath) {
							sheet.getCell(r, c).bindingPath('');
						}
					}
				}
		 	}
		},
		//데이터 convert 관련 함수
		/**
		 * data to csv converter
		 * @param
		 * 		bindingInfo		바인딩 정보
		 * 		data			데이터
		 * 		rowDelimiter	row 구분자
		 * 		colDelimiter	col 구분자
		 * @return
		 * 		{
		 * 			csv: string type csv
		 * 			rowCount: row 갯수
		 * 			colCount: col 갯수
		 * 			lastColIndex: 마지막 col index
		 * 		}
		 */
		_convertDataToCsv: function(bindingInfo, data, rowDelimiter, colDelimiter) {
	    	var _this = this;
	    	var _obj = this.element;
			var csv = '';
			var rowCount = 0;
			var colCount = 0;

			if(data && data.length) {
				rowCount = Object.keys(data).length;
				colCount = Object.keys(data[0]).length;

				var sheet = _this.spread.getSheetFromName(bindingInfo[0])
				var rowIndex = bindingInfo[1];
				var colIndex = bindingInfo[2];
				var curCol = bindingInfo[2];



				for(var r in data) {
					var rowItem = data[r];
					var colItem = [];

					colIndex = bindingInfo[2];
					//curCol = bindingInfo[2];

					for(var c in rowItem) {
						/**
						 * 해당 셀의 포맷이 날짜 포맷인 경우,
						 * 데이터가 8자리 (20160601) 형태인 케이스만 변경함.
						 */
						if(sheet.getCell(bindingInfo[1], colIndex).formatter() != undefined ){
							//	if (sheet.getCell(bindingInfo[1], curCol).formatter() && sheet.getCell(bindingInfo[1], curCol).formatter().search('yyyy-MM-dd') >= -1) {
							   if (sheet.getCell(bindingInfo[1], colIndex).formatter().formatCached == 'yyyy-MM-dd'
								   || sheet.getCell(bindingInfo[1], colIndex).formatter().formatCached == 'yy-MM-dd'
									   || sheet.getCell(bindingInfo[1], colIndex).formatter().formatCached == "yyyy'년' m'월' d'일'") {

									var tmp = _this._removeSpecialChar($.trim(rowItem[c]));

									if(tmp.length == 8) {
										var y = tmp.substring(0, 4);
										var m = tmp.substring(4, 6);
										var d = tmp.substring(6);

										colItem[colItem.length] = y + '-' + m + '-' + d;
									}else {
										colItem[colItem.length] = _this._removeSpecialChar($.trim(rowItem[c]));
									}
								} else {
									colItem[colItem.length] = _this._removeSpecialChar($.trim(rowItem[c]));
								}
						}else {
							colItem[colItem.length] = _this._removeSpecialChar($.trim(rowItem[c]));
						}

						var spanInfo = null;

						try {
							spanInfo = sheet.getSpan(bindingInfo[1], colIndex);
						}catch(e) {
							spanInfo = null;
						}

						//col span 셋팅
						if(spanInfo && spanInfo.colCount > 1) {
							for(var x=0; x<(spanInfo.colCount - 1); x++) {
								colItem[colItem.length] = '';
								colIndex++;
							}
						}

						colIndex++;
					}

					//cvs 문자열 조합
					if(csv.length > 0) {
						csv+= rowDelimiter;
					}

					csv += colItem.join(colDelimiter);

					//row span 셋팅
					var rowSpanInfo = null

					try {
						rowSpanInfo = sheet.getSpan(bindingInfo[1], bindingInfo[2]);
					}catch(e) {
						rowSpanInfo = null;
					}

					if(rowSpanInfo && rowSpanInfo.rowCount > 1) {
						for(var x=0; x<(rowSpanInfo.rowCount - 1); x++) {
							csv += rowDelimiter;
						}
					}
					//end of row span 셋팅

					rowIndex++;
				}
			}

			return {
				csv : csv,
				rowCount : rowCount,
				colCount : colCount,
				lastColIndex : colIndex
			};
		},
		_removeSpecialChar: function(data) {

			var regx = /[<>\r\n"',]/gm;
			var holders = {
				'<' : 'lt;',
				'>' : 'gt;',
				'\r' : "#13;",
			//	'\n' : "#10;",
				'"' : 'quot;',
				',' : ',',
				"'" : 'apos;'
			};

			return data.replace(regx, function(match) {
				if(match == ',') {/*내부 변환이 안되는 char 변환*/
					return holders[match];
				}else {
					return '&' + holders[match];
				}
			});
		},
		//데이터 바인딩 관련 함수
		_setGridDataTypeBinding: function(csv, bindingInfo, rowDelimiter, colDelimiter) {

			var _this = this;
	    	var _obj = this.element;
			var sheet = _this.spread.getSheetFromName(bindingInfo[0]);
			var row = bindingInfo[1];
			var col = bindingInfo[2];
			var bindingName = bindingInfo[3];
			var csvDataStr = csv.csv;
			var rowCount = csv.rowCount;
			var colCount = csv.colCount;
			var lastColIndex = csv.lastColIndex;
			var targetInfo = _this._getTagInfo(bindingInfo);

			if(targetInfo && targetInfo.bindingCount > 0) {
				if(targetInfo.bindingCount > 1) {
					//첫번째 행은 값만 삭제(이후 서식 카피에서 첫번째 행 사용해야함.)
					sheet.deleteRows(targetInfo.bindingRows[1], (targetInfo.bindingCount - 1));
				}else {
					//값만 삭제후 다시 입력(기본 overwriting 됨.)
				}
			}

			sheet.addRows(row + 1, rowCount - 1);

			//데이터 바인딩
			sheet.setCsv(row, col, csvDataStr, rowDelimiter, colDelimiter);

			/**
			* row 별로 cell Merge 셋팅
			*/
			for(var r=(row + 1); r<(row + rowCount); r++) {
				for(var c=0; c<sheet.getColumnCount(); c++) {
					if(sheet.getSpan(row, c) &&
							sheet.getSpan(row, c).rowCount <= 1 &&
							sheet.getSpan(row, c).colCount > 1) {

						var colSpan = sheet.getSpan(row, c).colCount;

						sheet.copyTo(row, c, r, c, 1, colSpan, GcSpread.Sheets.CopyToOption.Span);
						c += colSpan - 1;
					}

				}
			}

			// copy style
			for(var r=(row + 1); r<(row + rowCount); r++) {
				sheet.copyTo(row, 1, r, 1, 1, (sheet.getColumnCount() - 1), GcSpread.Sheets.CopyToOption.Formula);
				sheet.copyTo(row, 1, r, 1, 1, (sheet.getColumnCount() - 1), GcSpread.Sheets.CopyToOption.Style);
			}

			/**
			* set tag -> Binding row의 첫번재 cell
			*/
			for(var x=row; x<(row + rowCount); x++) {
				sheet.setTag(x, col, bindingName);
			}
		},
		/**
		 * 바인딩된 데이터 삭제 처리
		 *
		 * @param
		 * 		sheet
		 * 		bindingInfo
		 * 		colCount
		 * @return
		 */
		_removeGridDataTypeBinding: function(sheet, bindingInfo, colCount) {
	    	var _this = this;
	    	var _obj = this.element;
			var info = _this._getTagInfo(bindingInfo);

			if(info && info.bindingCount > 0) {
				if(info.bindingCount > 1) {
					//첫번째 행은 값만 삭제(이후 서식 카피에서 첫번째 행 사용해야함.)
					sheet.deleteRows(info.bindingRows[1], (info.bindingCount - 1));
				}else {
					//값만 삭제후 다시 입력(기본 overwriting 됨.)
				}

				for(var x=bindingInfo[2]; x<=colCount; x++) {
					sheet.getCell(bindingInfo[1], x).value(null);
					sheet.setTag(bindingInfo[1], x, null);
				}
			}
		},
		_setOverwriteGrdiDataTypeBinding: function(csv, bindingInfo, rowDelimiter, colDelimiter) {
	    	var _this = this;
	    	var _obj = this.element;
			var sheet = _this.spread.getSheetFromName(bindingInfo[0])
			var row = bindingInfo[1];
			var col = bindingInfo[2];
			var bindingName = bindingInfo[3];
			var csvDataStr = csv.csv;
			var rowCount = csv.rowCount;
			var colCount = csv.colCount;
			var lastColIndex = csv.lastColIndex;
			var targetInfo = _this._getTagInfo(bindingInfo);

			if(targetInfo && targetInfo.bindingCount > 0) {
				for(var r=0; r<targetInfo.bindingRows.length; r++) {
					for(var c=col; c<(csv.lastColIndex); c++) {
						sheet.getCell(targetInfo.bindingRows[r], c).value('');
						sheet.setTag(x, col, '');
					}
				}
			}

			//데이터 바인딩
			sheet.setCsv(row, col, csv, rowDelimiter, colDelimiter);

			/**
			* set tag -> Binding row의 첫번재 cell
			*/
			for(var x=row; x<(row + rowCount); x++) {
				sheet.setTag(x, col, bindingName);
			}
		},
		/**
		 * cell 에 지정된 tag 정보 조회
		 *
		 * @param
		 * 		bindingInfo		바인딩 정보
		 * @return
		 * 		{
		 * 			bindingRows: [바인딩 된 row Index, index, index]
		 * 			bindingCount: 총 바인딩된 row 갯수
		 * 		}
		 */
		_getTagInfo: function(bindingInfo) {
	    	var _this = this;
	    	var _obj = this.element;
			var sheet = _this.spread.getSheetFromName(bindingInfo[0])
			var row = bindingInfo[1];
			var col = bindingInfo[2];
			var bindingName = bindingInfo[3];
			var rows = [];
			var bindingCount = 0;

			for(var r=row; r<sheet.getRowCount(); r++) {
				var tag = sheet.getTag(r, col);
				if(tag && tag == bindingName) {
					rows[rows.length] = r;
					bindingCount++;
				}
			}

			return {bindingRows : rows, bindingCount : bindingCount};
		},
		//사용자 지정 명 관련 함수
		setCustomName: function (key, data){
	    	var _this = this;
	    	var _obj = this.element;

	    	key = key.toString();

	    	if (data){
				_this.spread.addCustomName(key, data, 0, 0);
			} else {
				_this.spread.removeCustomName(key);
			}
		},
		removeCustomName: function (key){
	    	var _this = this;
	    	var _obj = this.element;

			_this.spread.removeCustomName(key);
		},
		getCustomNames: function (){
	    	var _this = this;
	    	var _obj = this.element;
	    	var names = _this.spread.toJSON().names;

	    	return names;
		},
		getCustomNameValue: function (key){
	    	var _this = this;
	    	var _obj = this.element;
	    	var _val = "" ;
			var formula = "";

			if (_this.spread.toJSON().names) {
				$.each(_this.spread.toJSON().names, function(i,k){
					if(k.name == key) {
						formula = k.formula;
					}
				});

				_val = _this.getFormulaValue(formula);
			}

			return _val;
		},
		getCustomNameValues: function (keys){
			var _this = this;
	    	var _obj = this.element;
	    	var val = [];
			var formula = "";

			$(keys).each(function(j,l){
				var curVal = "";

				if (_this.spread.toJSON().names) {
					$.each(_this.spread.toJSON().names, function(i,k){
						if(k.name == l) {
							formula = k.formula;

							curVal = _this.getFormulaValue(formula);
						}
					});
				}

				val.push(curVal);
			});

			return val;
		},
		getCustomNameLikeValue: function (key){
	    	var _this = this;
	    	var _obj = this.element;
	    	var val = [];
			var formula = "";

			if (_this.spread.toJSON().names) {
				$.each(_this.spread.toJSON().names, function(i,k){
					if(k.name.startsWith(key)) {
						formula = k.formula;

						val.push(_this.getFormulaValue(formula));
					}
				});
			}

			return val;
		},
		getFormulaValue: function (formula){
	    	var _this = this;
	    	var _obj = this.element;
			var _p = convertAlphToSpreadNum(formula);
			var val = "";

			if(_p != null && _p.length > 0) {
				try{


				  val = _this.spread.getSheetFromName(_p[0]).getValue(_p[2],_p[1]);

				  var _sheet = _this.spread.getSheetFromName(_p[0]);
				  var _cell  = _sheet.getCell(_p[2],_p[1]);
				  var _row   = _p[2];
				  var _col   = _p[1];
				  var _getPath = "";
				  var _bindCol = 0;
				  var _arVal = [];


					for (var nc = _col; nc >=0 ; nc--){
						_getPath = _sheet.getCell(_row, nc).bindingPath();
						if (_getPath){
							_bindCol = nc;
							break;
						}
					}

					/* 테이블 단위 추출인 경우 */
					if (_getPath){
						_arVal.push(val);
						for (var nr = _row+1; nr <=10000 ; nr++){
							_getTag = _sheet.getTag(nr, _bindCol);
							if (_getTag){
								var _tagVal = _sheet.getValue(nr, _col);
								_arVal.push(_tagVal);
							} else {
								break;
							}
						}

					}




				} catch(e){
				  val = e;
				}
			}
			if (_getPath){
				return _arVal;
			} else {
				return val;
			}
		},

		getFormulaText: function (formula) {
			var _this = this;
			var _obj = this.element;
			var _p = convertAlphToSpreadNum(formula);
			var val = "";

			if (_p != null && _p.length > 0) {
				try {


					val = _this.spread.getSheetFromName(_p[0]).getText(_p[2], _p[1]);

					var _sheet = _this.spread.getSheetFromName(_p[0]);
					var _cell = _sheet.getCell(_p[2], _p[1]);
					var _row = _p[2];
					var _col = _p[1];
					var _getPath = "";
					var _bindCol = 0;
					var _arVal = [];


					for (var nc = _col; nc >= 0 ; nc--) {
						_getPath = _sheet.getCell(_row, nc).bindingPath();
						if (_getPath) {
							_bindCol = nc;
							break;
						}
					}

					/* 테이블 단위 추출인 경우 */
					if (_getPath) {
						_arVal.push(val);
						for (var nr = _row + 1; nr <= 10000 ; nr++) {
							_getTag = _sheet.getTag(nr, _bindCol);
							if (_getTag) {
								var _tagVal = _sheet.getText(nr, _col);
								_arVal.push(_tagVal);
							} else {
								break;
							}
						}

					}


				} catch (e) {
					val = e;
				}
			}
			if (_getPath) {
				return _arVal;
			} else {
				return val;
			}
		},


		getFormulaCell: function (formula){
	    	var _this = this;
	    	var _obj = this.element;
			var _p = convertAlphToSpreadNum(formula);
			var val = "";

			if(_p != null && _p.length > 0) {
				try{
				  val = _this.spread.getSheetFromName(_p[0]).getCell(_p[2],_p[1]);
				} catch(e){
				  val = e;
				}
			}

			return val;
		},
		getCustomNameCell: function (key){
	    	var _this = this;
	    	var _obj = this.element;
			var formula = "";

			$.each(_this.spread.toJSON().names, function(i,k){
				if(k.name == key) {
					formula = k.formula;
				}
			});

			var _p = convertAlphToSpreadNum(formula);
			var val = "";

			if(_p != null && _p.length > 0) {
				val = _this.spread.getSheetFromName(_p[0]).getCell(_p[2],_p[1]);
			}

			return val;
		},
		setCustomNameValue: function (key, value){
	    	var _this = this;
	    	var _obj = this.element;
			var formula = "";

			$.each(_this.spread.toJSON().names, function(i,k){
				if(k.name == key) {
					formula = k.formula;
				}
			});

			var _p = convertAlphToSpreadNum(formula);

			if(_p != null && _p.length > 0) {
				_this.spread.getSheetFromName(_p[0]).setValue(_p[2],_p[1], value);
			}
		},
		_setCustomNameValues: function(customNameMap) {
			var _this = this;

			if(customNameMap != null) {
				for(key in customNameMap) {
					var info = _this._getCustomNameInfo(key);
					//info._expr.value = customNameMap[key];

					_this.spread.addCustomName(info._name, '"' + customNameMap[key] + '"',  info._baseRow, info._baseColumn);
				}
			}
		},
		_getCustomNameInfo: function(key) {
	    	var _this = this;
	    	var _obj = this.element;
			var customNames = _this.spread.getCustomNames();
			var rtn = null;

			if(customNames && customNames.length > 0) {
				for(var x=0; x<customNames.length; x++) {
					if(customNames[x]._name == key) {
						rtn = customNames[x];

						break;
					}
				}
			}

			return rtn;
		},
		/*end 추가 lsh*/
		printDoc: function(){

	    	var _this = this;
	    	var _obj = this.element;

			for(var i=0;i< _this.spread.sheets.length;i++) {
				var sheet = _this.spread.sheets[i];

				printInfo = sheet.printInfo();

				printInfo.showColumnHeader(GcSpread.Sheets.PrintVisibilityType.Hide);
				printInfo.showRowHeader(GcSpread.Sheets.PrintVisibilityType.Hide);
	            printInfo.showBorder(false);
	            printInfo.showGridLine(false);
	            printInfo.margin({top:10, bottom:5, left:5, right:5, header:10, footer:5});

	            sheet.printInfo(printInfo);
			}

            _this.spread.print();
		},
        verUp: function(){
	    	var _this = this;
	    	var _obj = this.element;
	        var vOption = this.options;

	        _this.exportSet = {};
        },
        fromJson: function(doc, callback){
	    	var _this = this;
	    	var _obj = this.element;
	        var vOption = this.options;

			_this.spread.isPaintSuspended(true);
			_this.spread.fromJSON(doc);



			_this.spread.setActiveSheetIndex(0);
			_this.spread.sheets[0].setSelection(0,0,1,1);
			var activeSheet = _this.spread.getActiveSheet();

    		if (!_this.spread.toJSON().sheets[_this.spread.sheets[0]._name].gridline) {
    			_this.spread.sheets[0].setGridlineOptions({color:"#d7dae0", showVerticalGridline: true, showHorizontalGridline: true});
    		} // end


			if (doc["exportSet"]){
				_this.exportSet = doc["exportSet"];
			}

			if (doc["dataSource"]){
				_this.dataSource = new GcSpread.Sheets.CellBindingSource(doc["dataSource"]._source);
			}

			$(".docSheet ul", _obj).empty();
			for(var i=0;i< _this.spread.sheets.length;i++) {
				var sheet = _this.spread.sheets[i];

				if (_this.options.bEditMode) {
					$(".docSheet ul", _obj ).append('<li index="'+i+'"> ['+ sheet._name + '] </li>');
					sheet.visible(true);
				} else if(!_this.exportSet.UsedHide) {
					$(".docSheet ul", _obj ).append('<li index="'+i+'"> ['+ sheet._name + '] </li>');
					sheet.visible(true);

				} else if (_this.exportSet.UsedHide[sheet._name] && vOption.adminShow === false ){
					//$(".docSheet ul", _obj ).append('<li index="'+i+'"> ['+ sheet._name + '] </li>');
					sheet.visible(false);
				} else {
					$(".docSheet ul", _obj ).append('<li index="'+i+'"> ['+ sheet._name + '] </li>');
					sheet.visible(true);

				}

			}
			$(".docSheet ul li:eq(0)", _obj ).trigger('click');

			for(var i=0;i< _this.spread.sheets.length;i++) {
				var sheet = _this.spread.sheets[i];

				try{
					_this.spread.sheets[i].setDataSource(_this.dataSource);
				} catch(e) {
					alert("시트 ["+_this.spread.sheets[i].getName() +"] 표에 데이터 가져오기에 문제가 있습니다. 표 속성을 통해서 확인바랍니다.");
				}
			}


			activeSheet.addKeyMap(113, false, false, false, false, function () {
    			if (!activeSheet.isEditing()) {
    				activeSheet.startEdit();
    			}
    		});



			_this._setEditMode();
			_this.spread.isPaintSuspended(false);
			_this._tableSpan();
			parent.window.scroll(0,0);
			if (callback){
				callback(doc);
			}
        },
	     /* 파일정보를 알아온다 */
	    getFileList: function getFileList(fileGrpId, callBack){
	    	var _this = this;
	    	var _obj = this.element;
			var   params = {
					"attfgNo": fileGrpId
			    };

			App.ajax.getCallData( '/cm/c/cm/FileCtr/getFileList.do'
				, params
				, function ScCallBack(data){
					callBack(data);
				}
				, function ErCallBack(data){
					alert("file이 없습니다");
				}
			);
	    },
        toJson: function(){
	    	var _this = this;
	    	var _obj = this.element;
	        var vOption = this.options;
			var doc = _this.spread.toJSON();

			$.each(doc.sheets, function(i,s) {

				delete s["selections"];
				s.selections = {
						"0": {
		                    "row": 0,
		                    "rowCount": 1,
		                    "col": 0,
		                    "colCount": 1
						}
				};
				s.activeRow = 0;
				s.activeCol = 0;

			});

			if (_this.exportSet){
				doc["exportSet"] = this.exportSet;
			}

			if (_this.dataSource){
				doc["dataSource"] = this.dataSource;
			}

			return doc;
        },
        exportSetData: function(data){
	    	var _this = this;
	    	var _obj = this.element;

        	if (data) {
        		this.exportSet = data;
        	}

        	return this.exportSet;
        },
        setCulture: function(cultureName) {
	    	var _this = this;
	    	var _obj = this.element;

            Globalize.culture(cultureName);

            var cultureTextInfo = { "af": ";", "af-ZA": ";", "am": ";", "am-ET": ";", "ar": ";", "ar-AE": ";", "ar-BH": ";", "ar-DZ": ";", "ar-EG": ";", "ar-IQ": ";", "ar-JO": ";", "ar-KW": ";", "ar-LB": ";", "ar-LY": ";", "ar-MA": ";", "ar-OM": ";", "ar-QA": ";", "ar-SA": ";", "ar-SY": ";", "ar-TN": ";", "ar-YE": ";", "arn": ",", "arn-CL": ",", "as": ",", "as-IN": ",", "az": ";", "az-Cyrl": ";", "az-Cyrl-AZ": ";", "az-Latn": ";", "az-Latn-AZ": ";", "ba": ";", "ba-RU": ";", "be": ";", "be-BY": ";", "bg": ";", "bg-BG": ";", "bn": ",", "bn-BD": ",", "bn-IN": ",", "bo": ",", "bo-CN": ",", "br": ";", "br-FR": ";", "bs": ";", "bs-Cyrl": ";", "bs-Cyrl-BA": ";", "bs-Latn": ";", "bs-Latn-BA": ";", "ca": ";", "ca-ES": ";", "co": ";", "co-FR": ";", "cs": ";", "cs-CZ": ";", "cy": ";", "cy-GB": ";", "da": ";", "da-DK": ";", "de": ";", "de-AT": ";", "de-CH": ";", "de-DE": ";", "de-LI": ";", "de-LU": ";", "dsb": ";", "dsb-DE": ";", "dv": "،", "dv-MV": "،", "el": ";", "el-GR": ";", "en": ",", "en-029": ",", "en-AU": ",", "en-BZ": ",", "en-CA": ",", "en-GB": ",", "en-IE": ",", "en-IN": ",", "en-JM": ",", "en-MY": ",", "en-NZ": ",", "en-PH": ",", "en-SG": ",", "en-TT": ",", "en-US": ",", "en-ZA": ",", "en-ZW": ",", "es": ";", "es-AR": ";", "es-BO": ";", "es-CL": ";", "es-CO": ";", "es-CR": ";", "es-DO": ";", "es-EC": ";", "es-ES": ";", "es-GT": ";", "es-HN": ";", "es-MX": ",", "es-NI": ";", "es-PA": ";", "es-PE": ";", "es-PR": ";", "es-PY": ";", "es-SV": ";", "es-US": ",", "es-UY": ";", "es-VE": ";", "et": ";", "et-EE": ";", "eu": ";", "eu-ES": ";", "fa": "؛", "fa-IR": "؛", "fi": ";", "fi-FI": ";", "fil": ";", "fil-PH": ";", "fo": ";", "fo-FO": ";", "fr": ";", "fr-BE": ";", "fr-CA": ";", "fr-CH": ";", "fr-FR": ";", "fr-LU": ";", "fr-MC": ";", "fy": ";", "fy-NL": ";", "ga": ";", "ga-IE": ";", "gd": ";", "gd-GB": ";", "gl": ";", "gl-ES": ";", "gsw": ";", "gsw-FR": ";", "gu": ",", "gu-IN": ",", "ha": ";", "ha-Latn": ";", "ha-Latn-NG": ";", "he": ",", "he-IL": ",", "hi": ",", "hi-IN": ",", "hr": ";", "hr-BA": ";", "hr-HR": ";", "hsb": ";", "hsb-DE": ";", "hu": ";", "hu-HU": ";", "hy": ",", "hy-AM": ",", "id": ";", "id-ID": ";", "ig": ";", "ig-NG": ";", "ii": ";", "ii-CN": ";", "is": ";", "is-IS": ";", "it": ";", "it-CH": ";", "it-IT": ";", "iu": ",", "iu-Cans": ",", "iu-Cans-CA": ",", "iu-Latn": ",", "iu-Latn-CA": ",", "ja": ",", "ja-JP": ",", "ka": ";", "ka-GE": ";", "kk": ";", "kk-KZ": ";", "kl": ";", "kl-GL": ";", "km": ",", "km-KH": ",", "kn": ",", "kn-IN": ",", "ko": ",", "ko-KR": ",", "kok": ",", "kok-IN": ",", "ky": ";", "ky-KG": ";", "lb": ";", "lb-LU": ";", "lo": ";", "lo-LA": ";", "lt": ";", "lt-LT": ";", "lv": ";", "lv-LV": ";", "mi": ",", "mi-NZ": ",", "mk": ";", "mk-MK": ";", "ml": ",", "ml-IN": ",", "mn": ";", "mn-Cyrl": ";", "mn-MN": ";", "mn-Mong": ",", "mn-Mong-CN": ",", "moh": ",", "moh-CA": ",", "mr": ",", "mr-IN": ",", "ms": ";", "ms-BN": ";", "ms-MY": ";", "mt": ";", "mt-MT": ";", "nb": ";", "nb-NO": ";", "ne": ",", "ne-NP": ",", "nl": ";", "nl-BE": ";", "nl-NL": ";", "nn": ";", "nn-NO": ";", "no": ";", "nso": ";", "nso-ZA": ";", "oc": ";", "oc-FR": ";", "or": ",", "or-IN": ",", "pa": ",", "pa-IN": ",", "pl": ";", "pl-PL": ";", "prs": ";", "prs-AF": ";", "ps": ";", "ps-AF": ";", "pt": ";", "pt-BR": ";", "pt-PT": ";", "qut": ",", "qut-GT": ",", "quz": ",", "quz-BO": ",", "quz-EC": ",", "quz-PE": ",", "rm": ";", "rm-CH": ";", "ro": ";", "ro-RO": ";", "ru": ";", "ru-RU": ";", "rw": ";", "rw-RW": ";", "sa": ",", "sa-IN": ",", "sah": ";", "sah-RU": ";", "se": ";", "se-FI": ";", "se-NO": ";", "se-SE": ";", "si": ";", "si-LK": ";", "sk": ";", "sk-SK": ";", "sl": ";", "sl-SI": ";", "sma": ";", "sma-NO": ";", "sma-SE": ";", "smj": ";", "smj-NO": ";", "smj-SE": ";", "smn": ";", "smn-FI": ";", "sms": ";", "sms-FI": ";", "sq": ";", "sq-AL": ";", "sr": ";", "sr-Cyrl": ";", "sr-Cyrl-BA": ";", "sr-Cyrl-CS": ";", "sr-Cyrl-ME": ";", "sr-Cyrl-RS": ";", "sr-Latn": ";", "sr-Latn-BA": ";", "sr-Latn-CS": ";", "sr-Latn-ME": ";", "sr-Latn-RS": ";", "sv": ";", "sv-FI": ";", "sv-SE": ";", "sw": ";", "sw-KE": ";", "syr": ",", "syr-SY": ",", "ta": ",", "ta-IN": ",", "te": ",", "te-IN": ",", "tg": ";", "tg-Cyrl": ";", "tg-Cyrl-TJ": ";", "th": ",", "th-TH": ",", "tk": ";", "tk-TM": ";", "tn": ";", "tn-ZA": ";", "tr": ";", "tr-TR": ";", "tt": ";", "tt-RU": ";", "tzm": ";", "tzm-Latn": ";", "tzm-Latn-DZ": ";", "ug": ",", "ug-CN": ",", "uk": ";", "uk-UA": ";", "ur": ";", "ur-PK": ";", "uz": ";", "uz-Cyrl": ";", "uz-Cyrl-UZ": ";", "uz-Latn": ";", "uz-Latn-UZ": ";", "vi": ",", "vi-VN": ",", "wo": ";", "wo-SN": ";", "xh": ";", "xh-ZA": ";", "yo": ";", "yo-NG": ";", "zh": ",", "zh-CHS": ",", "zh-CHT": ",", "zh-CN": ",", "zh-HK": ",", "zh-Hans": ",", "zh-Hant": ",", "zh-MO": ",", "zh-SG": ",", "zh-TW": ",", "zu": ";", "zu-ZA": ";" };
            var myCulture = new GcSpread.Sheets.CultureInfo(),
                selectedCulture = Globalize.culture(),
                numberFormat = selectedCulture.numberFormat,
                standardCalendar = selectedCulture.calendars.standard,
                patterns = standardCalendar.patterns;

            myCulture.currencySymbol = numberFormat.currency.symbol;
            myCulture.numberDecimalSeparator = numberFormat["."];
            myCulture.numberGroupSeparator = numberFormat[","];
            myCulture.listSeparator = cultureTextInfo[cultureName] === myCulture.numberDecimalSeparator ? specialListSeparator : cultureTextInfo[cultureName];
            myCulture.arrayListSeparator = myCulture.listSeparator === myCulture.arrayGroupSeparator ? '\\' : myCulture.listSeparator;
            myCulture.isReadOnly = true;

            if (standardCalendar.AM && standardCalendar.AM.length > 0) {
                myCulture.amDesignator = standardCalendar.AM[0];
            }

            if (standardCalendar.PM && standardCalendar.PM.length > 0) {
                myCulture.pmDesignator = standardCalendar.PM[0];
            }

            myCulture.abbreviatedMonthNames = standardCalendar.months.namesAbbr;
            myCulture.abbreviatedDayNames = standardCalendar.days.namesAbbr;
            myCulture.abbreviatedMonthGenitiveNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""];
            myCulture.dateSeparator = standardCalendar["/"];
            myCulture.dayNames = standardCalendar.days.names;
            myCulture.fullDateTimePattern = patterns.F;
            myCulture.longDatePattern = patterns.D;
            myCulture.longTimePattern = patterns.T;
            myCulture.monthDayPattern = patterns.M;
            myCulture.monthNames = standardCalendar.months.names;
            myCulture.monthGenitiveNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""];
            myCulture.rFC1123Pattern = "ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'";
            myCulture.shortDatePattern = patterns.d;
            myCulture.shortTimePattern = patterns.t;
            myCulture.sortableDateTimePattern = patterns.S;
            myCulture.universalSortableDateTimePattern = "yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'";
            myCulture.yearMonthPattern = patterns.Y;
            myCulture.calendarIsReadOnly = true;

            GcSpread.Sheets.addCultureInfo(cultureName, myCulture);
            GcSpread.Sheets.Culture(cultureName);
		},
		getSpread: function (){
			return this.spread;
		},
		sort: function (rows,sortField,asc){
			if (asc == undefined){asc = true};

			rows = rows.sort(function (a, b) {
                if (asc) {
					return (nullSpace(a[sortField]) > nullSpace(b[sortField])) ? 1 : ((nullSpace(a[sortField]) < nullSpace(b[sortField])) ? -1 : 0);
				} else {
					return (nullSpace(b[sortField]) > nullSpace(a[sortField])) ? 1 : ((nullSpace(b[sortField]) < nullSpace(a[sortField])) ? -1 : 0);
				}
            });

	        return rows
		},
		getTimeStamp: function(){
			var d = new Date();
            var s =
	            fillZero(d.getFullYear(), 4)+
	            fillZero(d.getMonth() + 1, 2)+
	            fillZero(d.getDate(), 2) +
	            fillZero(d.getHours(), 2) +
	            fillZero(d.getMinutes(), 2) +
	            fillZero(d.getSeconds(), 2) +"-"+
	            "1004";

            return s;
		},
        Whois: function (a) {
            return a;
        }
    });



    function TextAreaCellType() {
		this.typeName = 'TextAreaCellType';
		this.height = 100;
    }

    TextAreaCellType.prototype = new GcSpread.Sheets.CustomCellType();
    TextAreaCellType.prototype.paint = function (ctx, value, x, y, w, h, style, options) {
        if(value) {
			GcSpread.Sheets.CustomCellType.prototype.paint.apply(this, [ctx, value.textarea, x, y, w, h, style, options]);
        }
    };

    TextAreaCellType.prototype.updateEditor = function(editorContext, cellStyle, cellRect) {
        if(editorContext) {
			$(editorContext).width(cellRect.width);
			$(editorContext).height(this.height);
		}
    };

    TextAreaCellType.prototype.createEditorElement = function () {
        var div = document.createElement("div");
        var $div = $(div);

        $div.attr("gcUIElement", "gcEditingInput");
        $div.css("background-color", "white");
        $div.css("position", "absolute");
        $div.css("overflow", "hidden");
        $div.css("border", "2px #5292f7 solid");

        var $span1 = $("<span></span>");

        $span1.css("display", "block");

		var $textarea1 = $("<textarea style='width:100%; height:100%'/>");

        $div.append($span1);
        $div.append($textarea1);

        return div;
    };

    TextAreaCellType.prototype.getEditorValue = function (editorContext) {
        if (editorContext && editorContext.children.length === 2) {
            var textarea1 = editorContext.children[1];
            var textarea = $(textarea1).val();
            //return { textarea: textarea };

            return textarea;
        }
    };

    TextAreaCellType.prototype.setEditorValue = function (editorContext, value) {
        if (editorContext && editorContext.children.length === 2) {
            var span1 = editorContext.children[0];

            if (value) {
                var input1 = editorContext.children[1];

                $(input1).val(value);
            }
        }
    };

    TextAreaCellType.prototype.paint = function (ctx, value, x, y, w, h, style, options) {
        if (value) {
            GcSpread.Sheets.CustomCellType.prototype.paint.apply(this, [ctx, value, x, y, w, h, style, options]);
        }
    };

    TextAreaCellType.prototype.isEditingValueChanged = function(oldValue, newValue) {
        return true;
    };

    function BindingPathCellType() {
		this.typeName = 'BindingPathCellType';
		//this.height = 100;
		//GcSpread.Sheets.TextCellType.call(this);
    }

    //BindingPathCellType.prototype = new GcSpread.Sheets.TextCellType();
    BindingPathCellType.prototype = new GcSpread.Sheets.TextCellType();
    BindingPathCellType.prototype.paint = function (ctx, value, x, y, w, h, style, context) {
        if (value === null || value === undefined) {
            var sheet = context.sheet, row = context.row, col = context.col;

            if (sheet && (row === 0 || !!row) && (col === 0 || !!col)) {
                var bindingPath = sheet.getBindingPath(context.row, context.col);

                if (bindingPath) {
                    //value = "[" + bindingPath + "]";
                }
            }
        }

        GcSpread.Sheets.TextCellType.prototype.paint.apply(this, arguments);
    };

	// 숫자앞에 문자열을 0 문자로 채우기
    function fillZero(n, digits) {
	    var zero = '';

	    n = n.toString();

	    if (n.length < digits) {
	        for (var i = 0; i < digits - n.length; i++)
	            zero += '0';
	    }

	    return zero + n;
	};

	function char2colIndex(char){
		if(!char) {
			return;
		}
		var ret = 0;
		try{
			char = char.toLocaleUpperCase();
			for(var i=0; i<char.length; i++){
				var sc = char.substr(i,1);
				var scIndex = sc.charCodeAt(0)-65
				ret = ret + Math.pow(26, char.length-i-1)*(scIndex+1);
			}
			if (ret >0) ret = ret -1;
		}catch(e) {
			alert("har2colIndex - "+ char +"-"+ e);
		}

		return ret;
	};

	function colIndex2char(colindex){
		var ret = "";

		if(!colindex && colindex !== 0) {
			return;
		}

		var scindex = colindex.toString(26);

		for(var i=0; i<scindex.length; i++){
			var sc = scindex.substr(i,1).toLocaleUpperCase();

			if (sc>="0" && sc<="9"){
				var cs = sc.charCodeAt(0)+17;

				if (i<scindex.length-1) {
					cs = cs-1;
				}

				ret = ret + String.fromCharCode(cs);
			} else {
				var cs = sc.charCodeAt(0)+10;

				if (i<scindex.length-1) {
					cs = cs-1;
				}

				ret = ret + String.fromCharCode(cs);
			}
		}
		return ret;
	};

	function convertSpreadNumToAlph(st,c,r){
		return st + '!$'+ colIndex2char(c) + '$' +(r+1)
	}

	function convertSpreadNumToAlphS(c,r){
		return colIndex2char(c) + (r+1)
	}

	function convertAlphToSpreadNum(sn){
		var ret = "";
		var scindex="";
		var sp = []

		sn = sn.replaceAll('\\$',"");

		if (sn.split(":").length == 2){
			sp = convertAlphToSpreadNum(sn.split(":")[0]);
			sp =  sp.concat(convertAlphToSpreadNum(sn.split(":")[1]));
			// 위치기준에서 length 개념으로 전환함
			if (sp.length == 5) {
				sp[3] = sp[3] - sp[1] +1;
				sp[4] = sp[4] - sp[2] +1;
			} else {
				sp[2] = sp[2] - sp[0] +1;
				sp[3] = sp[3] - sp[1] +1;
			}
		} else {

			if (sn.split("!").length == 2){
				sp.push(sn.split("!")[0]);
				scindex = sn.split("!")[1];
			} else {
				scindex = sn.split("!")[0];
			}

			for(var i=0; i<scindex.length; i++){
				var sc = scindex.substr(i,1).toLocaleUpperCase();
				if (sc>="0" && sc<="9"){
					var fs = scindex.substr(0, scindex.indexOf(sc));
					sp.push(char2colIndex(fs));
					sp.push(scindex.replace(fs,"")*1 -1);
					break;
				}
			}
		}
		return sp;
	}

	function convertAlphToCell(sn){
		var ret = "";
		var scindex="";
		var sp = []

		sn = sn.replaceAll('\\$',"");

		if (sn.split(":").length == 2){
			sp = convertAlphToSpreadNum(sn.split(":")[0]);
			sp =  sp.concat(convertAlphToSpreadNum(sn.split(":")[1]));
			// 위치기준에서 length 개념으로 전환함
			if (sp.length == 5) {
				sp[3] = sp[3] - sp[1] +1;
				sp[4] = sp[4] - sp[2] +1;
			} else {
				sp[2] = sp[2] - sp[0] +1;
				sp[3] = sp[3] - sp[1] +1;
			}
		} else {

			if (sn.split("!").length == 2){
				sp.push(sn.split("!")[0]);
				scindex = sn.split("!")[1];
			} else {
				scindex = sn.split("!")[0];
			}

			for(var i=0; i<scindex.length; i++){
				var sc = scindex.substr(i,1).toLocaleUpperCase();

				if (sc>="0" && sc<="9"){
					var fs = scindex.substr(0, scindex.indexOf(sc));

					sp.push(char2colIndex(fs));
					sp.push(scindex.replace(fs,"")*1 -1);

					break;
				}
			}
		}

		return sp;
	}

    function getActualCellRange(cellRange, rowCount, columnCount) {
        if (cellRange.row == -1 && cellRange.col == -1) {
            return new GcSpread.Sheets.Range(0, 0, rowCount, columnCount);
        } else if (cellRange.row == -1) {
            return new GcSpread.Sheets.Range(0, cellRange.col, rowCount, cellRange.colCount);
        } else if (cellRange.col == -1) {
            return new GcSpread.Sheets.Range(cellRange.row, 0, cellRange.rowCount, columnCount);
        }

        return cellRange;
    }

	function getActualRange(range, maxRowCount, maxColCount) {
        var row = range.row < 0 ? 0 : range.row;
        var col = range.col < 0 ? 0 : range.col;
        var rowCount = range.rowCount < 0 ? maxRowCount : range.rowCount;
        var colCount = range.colCount < 0 ? maxColCount : range.colCount;

        return new GcSpread.Sheets.Range(row, col, rowCount, colCount);
    }

    function getTableName(sheet) {
        var i = 0;

        while (true) {
            var name = "table" + i.toString();

            if (!sheet.findTableByName(name)) {
                return name;
            }

            i++;
        }
    }

	function unSerialize(queryParams) {
		var chunks = queryParams.split('&');
		var o = {};

		for(var x=0; x<chunks.length; x++) {
			var split = chunks[x].split('=', 2);

			o[split[0]] = split[1];
		}

		return o;
	}

	function exportFile(serverUrl, content) {
	    var formInnerHtml = '<input type="hidden" name="type" value="application/json" />';

	    formInnerHtml += '<input type="hidden" name="data" value="' + htmlSpecialCharsEntityEncode(content) + '" />';
	    content = null;

	    var $iframe = $("<iframe style='display: none' src='about:blank'></iframe>").appendTo("body");

	    $iframe.ready(function () {
	        var formDoc = getiframeDocument($iframe);

	        formDoc.write("<html><head></head><body><form method='Post' action='" + serverUrl + "'>" + formInnerHtml + "</form>dummy windows for postback</body></html>");
	        formInnerHtml = null;

	        var $form = $(formDoc).find('form');

	        $form.submit();
	        $form[0].reset();
	    });
	}

	//Help Method
	function getiframeDocument($iframe) {
	    var iframeDoc = $iframe[0].contentWindow || $iframe[0].contentDocument;

	    if (iframeDoc.document) {
	        iframeDoc = iframeDoc.document;
	    }

	    return iframeDoc;
	}

	function htmlSpecialCharsEntityEncode(str) {
	    var htmlSpecialCharsRegEx = /[<>\r\n"',]/gm;
	    var htmlSpecialCharsPlaceHolders = {
	        '<': 'lt;',
	        '>': 'gt;',
	        '\r': "#13;",
	  //      '\n': "#10;",
	        '"': 'quot;',
			',' : ',',
	        "'": 'apos;' /*single quotes just to be safe*/
	    };

	    return str.replace(htmlSpecialCharsRegEx, function (match) {
	        return '&' + htmlSpecialCharsPlaceHolders[match];
	    });
	}

	/**
	* 사번입력시, 이름 가져오기(테스트)
	*/
	function KorusBindNameFunction() {
	    this.name = "KFINDNAME";
	    this.maxArgs = 1;
	    this.minArgs = 1;
	}

	//KorusBindNameFunction.prototype = new $.wijmo.wijspread.Calc.Functions.Function();
	KorusBindNameFunction.prototype = new GcSpread.Sheets.Calc.Functions.Function();
	KorusBindNameFunction.prototype.evaluate = function(args) {
		var result = '#VALUE!';

		//테스트 코드
		var url = '/hr/h/fa/TbHrbm010Ctr/getTcherEmpSearchList.do';

		$.ajax(url, {
			type: 'post',
			dataType: 'json',
			data: {sklstfNoNm : args[0], hffcSttusCode:"NHRA0057N00010" },
			async : false,
    		success: function(data) {
				result = data.rows[0].sklstfNm;
			},
			error: function() {
				alert('error');
			}
		});
		//테스트 코드

		return result;
	}

	var korusBindNameDescription = {
		name: 'KFINDNAME',
		description: '이름 가져오기',
		parameters: [{name : 'value'}]
	};

	/**
	 * Spread Data Load 함수
	 * loadSpreadData.load({
	 * 		spread : spread,
	 * 		valblFormatTmplatNo : '9992016010',
	 * 		before : function() {},
	 * 		end : function() {}
	 * })
	 */
	function _fnLoadSpreadData() {
		this.spread = null;
		this.options = {};
		this.resultTotal = 0;
		this.resultCount = 0;

		/**
		 * 서식 로드 후 loadSpreadData.load
		 * opt
		 * {
		 * 		'spread' : spread,
		 * 		valblFormatTmplatNo : '9992016010',
		 * 		before : function() {},
		 * 		end : function() {}
		 * }
		 * 로 데이터 바인딩 처리.
		 */
		this.load = function(opt) {
			this.options = opt;

			if(opt.before) {
				opt.before();
			}

			this.spread = opt.spread;

    		$.ajax('/cm/s/ke/valblFormatBsisDtaMappingCtr/getBsisDtaMappingSqlList.do', {
    			type: 'post',
    			dataType: 'json',
    			data: {'valblFormatTmplatNo' : opt.valblFormatTmplatNo},
    			success: function(data) {
    				if(data.rows && data.rows.length > 0) {
    					//전체 쿼리 갯수 셋팅
	    				$.each(data.rows, function(_idx, _row) {
	    					if(_row.bindnDtaUseAt == '1') {/*바인딩자료 사용여부*/
								loadSpreadData.resultTotal++;
	    					}
	    				});

	    				$.each(data.rows, function(_idx, _row) {
	    					if(_row.bindnDtaUseAt == '1') {/*바인딩자료 사용여부*/
								if(_row.valblFormatTmplatNo && _row.bsisDtaSn) {
		    						loadSpreadData.getData(_row.valblFormatTmplatNo, _row.bsisDtaSn, _row.bsisDtaMapngNm);
		    					}
	    					}
	    				});
    				}else {
						if(loadSpreadData.options.end) {
							loadSpreadData.options.end({total: 0, load: 0});
						}
    				}
    			},
    			error: function() {
    				alert('error');
    			}
    		});
		}

		this.getData = function(valblFormatTmplatNo, bsisDtaSn, bsisDtaMapngNm) {
    		$.ajax('/cm/s/ke/valblFormatBsisDtaMappingCtr/getBsisDtaMappingSqlDataList.do', {
    			type: 'post',
    			dataType: 'json',
    			data: {
    				'valblFormatTmplatNo' : valblFormatTmplatNo,
    				'bsisDtaSn' : bsisDtaSn,
    				'_lbsisDtaMapngNm': bsisDtaMapngNm
    			},
    			async : false,
    			success: function(data) {
    				var p = loadSpreadData.unSerialize(this.data);

    				var position = spreadBindingName.getBindingPositionByName(loadSpreadData.spread, p._lbsisDtaMapngNm);

    				if(position && position.length > 0) {
	       				var dataCsv = csvConverter.convertCSV(loadSpreadData.spread, position, data.rows, '^', '|');
	       				spreadDataBinding.gridDataTypeBind(loadSpreadData.spread, dataCsv, position, '^', '|');

	       				loadSpreadData.resultCount++;

	       				if(loadSpreadData.resultCount >= loadSpreadData.resultTotal) {
							if(loadSpreadData.options.end) {
								loadSpreadData.options.end({total: loadSpreadData.resultTotal, load : loadSpreadData.resultCount});
							}
	       				}
    				}
    			},
    			error: function() {
    				alert('error');
    			}
    		});
		}

		this.getDataEx = function(valblFormatTmplatNo,bsisDtaSn,exVariable,callback){
			$.ajax('/cm/s/ke/valblFormatBsisDtaMappingCtr/getBsisDtaMappingSqlDataListEx.do', {
				type: 'post',
				dataType: 'json',
				data: {"valblFormatTmplatNo":valblFormatTmplatNo,"bsisDtaSn":bsisDtaSn,"KEPara":exVariable},
				async : false,
				success: function(data) {
				    callback(data);
				},
				error: function(er, error, message) {
				    STD.Mssage.serverErrAlert(this,"errMsg",message);
				}
			});
		}

		this.unSerialize = function(queryParams) {
			var chunks = queryParams.split('&');
			var o = {};

			for(var x=0; x<chunks.length; x++) {
				var split = chunks[x].split('=', 2);

				o[split[0]] = split[1];
			}

			return o;
		}
	}

	var loadSpreadData = new _fnLoadSpreadData();

	function SpreadBindingNameUtils() {
		/**
		 * 바인딩 명 셋팅
		 */
		this.setBinding = function(spread, sheet, bindingName, row, col) {
			if(row!=undefined && col!=undefined) {
				var spreadNS = GcSpread.Sheets;

				/*
	            //define BindingPathCellType
	            function BindingPathCellType() {
	                spreadNS.TextCellType.call(this);
	            }
	            BindingPathCellType.prototype = new spreadNS.TextCellType();
	            BindingPathCellType.prototype.paint = function (ctx, value, x, y, w, h, style, context) {
	                if (value === null || value === undefined) {
	                    var sheet = context.sheet
	                    var row = context.row
	                    var col = context.col;
	                    if (sheet && (row === 0 || !!row) && (col === 0 || !!col)) {
	                        var bindingPath = sheet.getBindingPath(context.row, context.col);
	                        if (bindingPath) {
	                           // value = '[' + bindingPath + ']';
	                        }
	                    }
	                }
	                spreadNS.TextCellType.prototype.paint.apply(this, arguments);
	            };
	            */

	            if(sheet!=undefined) {
	            	//spread.isPaintSuspended(true);
	            	var bindingPathCellType = new BindingPathCellType();

	            	 sheet.getCell(row, col).bindingPath(bindingName).cellType(bindingPathCellType).vAlign(spreadNS.VerticalAlign.center);

	            	//spread.isPaintSuspended(false);
	            }
			}
		};

		/**
		 * spread 의 모든 바인딩 정보 조회
		 */
		this.getAllBindingPaths = function(spread) {
			var bindingPath = [];

			for(var i=0;i<spread.sheets.length;i++){
				var sheet = spread.sheets[i];

				for(var r=0; r<sheet.getRowCount(); r++) {
					for(var c=0; c<sheet.getColumnCount(); c++) {
						var path = sheet.getBindingPath(r, c, $.wijmo.wijspread.SheetArea.viewport);

						if(path) {
							bindingPath[bindingPath.length] = {
								'sheet': sheet, 'row': r, 'col': c, 'bindingPath': path
							};
						}
					}
				}
		 	}

			return bindingPath;
		};

		/**
		 * spread 의 모든 바인딩 정보 삭제 처리
		 */
		this.deleteAllBindingPaths = function(spread) {
			for(var i=0;i<spread.sheets.length;i++){
				var sheet = spread.sheets[i];

				for(var r=0; r<sheet.getRowCount(); r++) {
					for(var c=0; c<sheet.getColumnCount(); c++) {
						var bidingPath = sheet.getBindingPath(r, c, $.wijmo.wijspread.SheetArea.viewport);

						if(bidingPath) {
							sheet.getCell(r, c).bindingPath('');
						}
					}
				}
		 	}
		}

		/**
		 * 바인딩 명으로 spread 에서 조회
		 */
		this.getBindingPositionByName = function(spread, bindingName) {
			var positions = [];

			for(var i=0;i<spread.sheets.length;i++){
				var sheet = spread.sheets[i];

				for(var r=0; r<sheet.getRowCount(); r++) {
					for(var c=0; c<sheet.getColumnCount(); c++) {
						var bidingPath = sheet.getBindingPath(r, c, $.wijmo.wijspread.SheetArea.viewport);

						if(bidingPath && bidingPath.length > 0) {
							if(bidingPath == bindingName) {
								positions = [sheet._name, r, c, bindingName];

								break;
							}
						}
					}
				}
		 	}

			return positions;
		};
	};

	var spreadBindingName = new SpreadBindingNameUtils();

	function CSVDataConverterUtils() {
		/**
		 * 데이터를 csv 로 변환
		 */
		this.convertCSV = function(spread, positions, items, rowDelimiter, colDelimiter) {
			var _this = this;
			csvString = '';

			this.rowCount = 0;
			this.colCount = 0;
			this.rowSpanCount = 0;

			if(items && items.length) {
				//data count
				this.rowCount = Object.keys(items).length;
				this.colCount = Object.keys(items[0]).length;

				var sheet = spread.getSheetFromName(positions[0])
				var rowIndex = positions[1];
				var colIndex = positions[2];
				var curCol = positions[2];

				for(var r in items) {
					var rowItem = items[r];
					var colItem = [];

					colIndex = positions[2];
					//curCol = positions[2];

					for(var c in rowItem) {
						/**
						 * 해당 셀의 포맷이 날짜 포맷인 경우,
						 * 데이터가 8자리 (20160601) 형태인 케이스만 변경함.
						 */


			/*
						var _for = sheet.getCell(positions[1], curCol++).formatter();

						try{

							//if(sheet.getCell(positions[1], curCol++).formatter() && sheet.getCell(positions[1], curCol++).formatter().search('yyyy-MM-dd') >= -1) {
								var tmp = this.removeSpecialChar($.trim(rowItem[c]));

								if(tmp.length == 8) {
									var y = tmp.substring(0, 4);
									var m = tmp.substring(4, 6);
									var d = tmp.substring(6);

									colItem[colItem.length] = y + '-' + m + '-' + d;
								}else {
									colItem[colItem.length] = this.removeSpecialChar($.trim(rowItem[c]));
								}
							}else {
								colItem[colItem.length] = this.removeSpecialChar($.trim(rowItem[c]));
							}
						} catch(e){
							colItem[colItem.length] = this.removeSpecialChar($.trim(rowItem[c]));
						}
*/

						if(sheet.getCell(positions[1], colIndex).formatter()){
							//	if (sheet.getCell(bindingInfo[1], curCol).formatter() && sheet.getCell(bindingInfo[1], curCol).formatter().search('yyyy-MM-dd') >= -1) {
							   if (sheet.getCell(positions[1], colIndex).formatter().formatCached == 'yyyy-MM-dd'
								   || sheet.getCell(positions[1], colIndex).formatter().formatCached == 'yy-MM-dd'
									   || sheet.getCell(positions[1], colIndex).formatter().formatCached == "yyyy'년' m'월' d'일'") {

									var tmp = this.removeSpecialChar($.trim(rowItem[c]));

									if(tmp.length == 8) {
										var y = tmp.substring(0, 4);
										var m = tmp.substring(4, 6);
										var d = tmp.substring(6);

										colItem[colItem.length] = y + '-' + m + '-' + d;
									}else {
										colItem[colItem.length] = this.removeSpecialChar($.trim(rowItem[c]));
									}
								} else {
									colItem[colItem.length] = this.removeSpecialChar($.trim(rowItem[c]));
								}
						}else {
							colItem[colItem.length] = this.removeSpecialChar($.trim(rowItem[c]));
						}


						var spanInfo = null;

						try {
							spanInfo = sheet.getSpan(positions[1], colIndex);
						}catch(e) {
							spanInfo = null;
						}

						//col span 셋팅
						if(spanInfo && spanInfo.colCount > 1) {
							for(var x=0; x<(spanInfo.colCount - 1); x++) {
								colItem[colItem.length] = '';
								colIndex++;
							}
						}

						colIndex++;
					}

					//cvs 문자열 조합
					if(csvString.length > 0) {
						csvString += rowDelimiter;
					}

					csvString += colItem.join(colDelimiter);

					//row span 셋팅
					var rowSpanInfo = null

					try {
						rowSpanInfo = sheet.getSpan(positions[1], positions[2]);
					}catch(e) {
						rowSpanInfo = null;
					}

					if(rowSpanInfo && rowSpanInfo.rowCount > 1) {
						for(var x=0; x<(rowSpanInfo.rowCount - 1); x++) {
							csvString += rowDelimiter;
						}
					}
					//end of row span 셋팅

					rowIndex++;
				}
			}

			//return [csvString, this.rowCount, this.colCount];
			return {csv : csvString, rowCount : this.rowCount, colCount : this.colCount, lastColIndex : colIndex};
		};

		this.removeSpecialChar = function(item) {

			var regx = /[<>\r\n"',]/gm;
//			var regx = /[<>\r"',]/gm;
			var holders = {
				'<' : 'lt;',
				'>' : 'gt;',
				'\r' : "#13;",
				'\n' : "#10;",
				'"' : 'quot;',
				',' : ',',
				"'" : 'apos;'
			};
			return item.replace(regx, function(match) {
				if(match == ',') {/*내부 변환이 안되는 char 변환*/
					return holders[match];
				}else {
					return '&' + holders[match];
				}
			});
		}
	};

	var csvConverter = new CSVDataConverterUtils();

	function goUbiReport() {

		document.getElementById('runtimedata').value = JSON.stringify(spread.toJSON());
		if (document.getElementById('ubiport').checked) {
			document.getElementById('jrffile').value = 'portrait_m5.tpl';
		} else {
			document.getElementById('jrffile').value = 'landscape_m5.tpl';
		}

		win = window.open("./ubireport.html","POP_REPORT","toolbar=yes, scrollbars=yes, resizable=yes, top=0, left=0, width=1050, height=800");
		document.getElementById('ubiprint').style.display = 'none';
	}

	function SpreadDataBindingUtils() {

		this.gridDataTypeBind = function(spread, csvData, positions, rowDelimiter, colDelimiter) {
            
			var spreadNS = GcSpread.Sheets;
			var sheet = spread.getSheetFromName(positions[0])
			var row = positions[1];
			var col = positions[2];
			var bindingName = positions[3];
			var csvDataStr = csvData.csv;
			var rowCount = csvData.rowCount;
			var colCount = csvData.colCount;
			var lastColIndex = csvData.lastColIndex;
			var targetInfo = this.getTagForRows(spread, positions);


			if(targetInfo && targetInfo.bindingCount > 0) {
				if(targetInfo.bindingCount > 1) {
					//첫번째 행은 값만 삭제(이후 서식 카피에서 첫번째 행 사용해야함.)
					sheet.deleteRows(targetInfo.bindingRows[1], (targetInfo.bindingCount - 1));
				}else {
					//값만 삭제후 다시 입력(기본 overwriting 됨.)
				}
			}

			sheet.addRows(row + 1, rowCount - 1);

			//데이터 바인딩
			//alert("바인딩시작4-5");
			sheet.setCsv(row, col, csvDataStr, rowDelimiter, colDelimiter);

			/**
			* row 별로 cell Merge 셋팅
			*/
			for(var r=(row + 1); r<(row + rowCount); r++) {
				for(var c=0; c<sheet.getColumnCount(); c++) {
					if(sheet.getSpan(row, c) && sheet.getSpan(row, c).rowCount <= 1 && sheet.getSpan(row, c).colCount > 1) {
						var colSpan = sheet.getSpan(row, c).colCount;

						sheet.copyTo(row, c, r, c, 1, colSpan, spreadNS.CopyToOption.Span);

						c += colSpan - 1;
					}
				}
			}


			var startCell = {
					"row":  row ,
					"col" : col
			}

			for(var c=col; c<(col+colCount); c++) {
				var moveCell = sheet._getNextColumn(startCell.row, startCell.col);
				startCell.col = moveCell.c;
			}
			//var relaColCount = startCell.col - col;
			var relaColCount = startCell.col ;
			for(var r=(row + 1); r<(row + rowCount); r++) {
				try{
					if (col > 1){
						sheet.copyTo(row, 1, r, 1, 1, col -1 , spreadNS.CopyToOption.Value);/* 데이터 바인딩 이전 까지 복사 */
					}
					if ((sheet.getColumnCount() - relaColCount) > 0 ){
						sheet.copyTo(row, relaColCount, r, relaColCount, 1, (sheet.getColumnCount() - relaColCount), spreadNS.CopyToOption.Value); /* 데이터 바인딩 이후 복사 */
					}

				} catch(e) {
					alert(e);
				}


				sheet.copyTo(row, 1, r, 1, 1, (sheet.getColumnCount() - 1), spreadNS.CopyToOption.Formula);
				sheet.copyTo(row, 1, r, 1, 1, (sheet.getColumnCount() - 1), spreadNS.CopyToOption.Style);

			}

			/* 서식에 포뮬러와 값이 동시에 존재하는 경우는 값을 제거한다 */
			for(var r=row; r<(row + rowCount); r++) {
				for(var c=col; c<(col+colCount); c++) {
					var frCell = sheet.getCell(r, c);
					a=1
				}
			}

			// row height copy
        	var _RowHeight = sheet.getRowHeight(row);

			for(var r=(row + 1); r<(row + rowCount); r++) {
				 sheet.setRowHeight(r, _RowHeight);
			}


			// lock copy
			for (var i=0; i<sheet.getColumnCount(); i++){
				var _lock  = sheet.getCell(row,i).locked();

				if (!_lock){
					for(var r=(row + 1); r<(row + rowCount); r++) {
						sheet.getCell(r,i).locked(false);
					}
				}
			}

			/**
			* set tag -> Binding row의 첫번재 cell
			*/
			for(var x=row; x<(row + rowCount); x++) {
				sheet.setTag(x, col, bindingName);
			}

			// &#10;
			/* 개행처리 */
			/* 김성민 오류작업  2016-11-22 개행처리를 서식복사 이전에 하는 경우에 문제가 있어 개형처리 순서를 서식복사후에 하는 것으로 조정함*/
			for(var r=row; r<(row + rowCount); r++) {
				for(var c=col; c<(col+colCount); c++) {
					var crChar = sheet.getValue(r, c);
					if (crChar && crChar.toString().indexOf("&#10;")>= 0){
						crChar = crChar.replaceAll("&#10;","\n");
						sheet.setValue(r, c, crChar);
					}
				}
			}

		}



		/**
		* Gride Type 데이터 바인딩
		* data row 갯수많큼 row 를 생성시키면서 데이터 바인딩 하는 함수.
		*/
		this.gridDataTypeBind22 = function(spread, csvData, positions, rowDelimiter, colDelimiter) {
			var spreadNS = GcSpread.Sheets;

			var sheet = spread.getSheetFromName(positions[0])
			var row = positions[1];
			var col = positions[2];
			var bindingName = positions[3];

			var csvDataStr = csvData.csv;
			var rowCount = csvData.rowCount;
			var colCount = csvData.colCount;
			var lastColIndex = csvData.lastColIndex;

			var targetInfo = this.getTagForRows(spread, positions);
			if(targetInfo && targetInfo.bindingCount > 0) {
				if(targetInfo.bindingCount > 1) {
					//첫번째 행은 값만 삭제(이후 서식 카피에서 첫번째 행 사용해야함.)
					sheet.deleteRows(targetInfo.bindingRows[1], (targetInfo.bindingCount - 1));
				}else {
					//값만 삭제후 다시 입력(기본 overwriting 됨.)
				}
			}
			sheet.addRows(row + 1, rowCount - 1);

			//데이터 바인딩
			sheet.setCsv(row, col, csvDataStr, rowDelimiter, colDelimiter);
			//alert("머지셀");
			/**
			* row 별로 cell Merge 셋팅
			*/
			for(var r=(row + 1); r<(row + rowCount); r++) {
				for(var c=0; c<sheet.getColumnCount(); c++) {
					if(sheet.getSpan(row, c) &&
							sheet.getSpan(row, c).rowCount <= 1 &&
							sheet.getSpan(row, c).colCount > 1) {

						var colSpan = sheet.getSpan(row, c).colCount;

						sheet.copyTo(row, c, r, c, 1, colSpan, spreadNS.CopyToOption.Span);
						c += colSpan - 1;
					}

				}
			}

			// copy style
			for(var r=(row + 1); r<(row + rowCount); r++) {
				sheet.copyTo(row, 1, r, 1, 1, (sheet.getColumnCount() - 1), spreadNS.CopyToOption.Formula);
				sheet.copyTo(row, 1, r, 1, 1, (sheet.getColumnCount() - 1), spreadNS.CopyToOption.Style);
			}

			/**
			* set tag -> Binding row의 첫번재 cell
			*/
			for(var x=row; x<(row + rowCount); x++) {
				sheet.setTag(x, col, bindingName);
			}
		}

		this.gridDataTypeBindBak = function(spread, csvData, positions, rowDelimiter, colDelimiter) {
			var spreadNS = GcSpread.Sheets;
			var sheet = spread.getSheetFromName(positions[0]);
			var row = positions[1];
			var col = positions[2];
			var bindingName = positions[3];
			var csvDataStr = csvData.csv;
			var rowCount = csvData.rowCount;
			var colCount = csvData.colCount;
			var lastColIndex = csvData.lastColIndex;
			var targetInfo = this.getTagForRows(spread, positions);
			var sheetColCnount = sheet.getColumnCount();

			if(targetInfo && targetInfo.bindingCount > 0) {
				if(targetInfo.bindingCount > 1) {
					//첫번째 행은 값만 삭제(이후 서식 카피에서 첫번째 행 사용해야함.)
					sheet.deleteRows(targetInfo.bindingRows[1], (targetInfo.bindingCount - 1));
				}else {
					//값만 삭제후 다시 입력(기본 overwriting 됨.)
				}
			}

			sheet.addRows(row + 1, rowCount - 1);

			var _RowHeight = sheet.getRowHeight(row);
        	var _lock = [];
        	var bindingPath = sheet.getBindingPath(row, col);

        	sheet.setBindingPath(row, col, "");

        	for(var i=0; i<sheetColCnount; i++) {
				_lock[i] = sheet.getCell(row, i).locked();
        	}

			for(var r=0; r<rowCount; r++) {
				if(r > 0) {
					sheet.copyTo(row, 0, row + r, 0, 1, sheetColCnount, spreadNS.CopyToOption.All);

					// row height copy
					sheet.setRowHeight(row + r, _RowHeight);

					for(var i=0; i<sheetColCnount; i++) {
						if(!_lock[i]) {
							// lock copy
							sheet.getCell(r, i).locked(false);
						}
					}
				}

				sheet.setTag(row + r, col, bindingName);
			}

			sheet.setBindingPath(row, col, bindingPath);

			//데이터 바인딩
			sheet.setCsv(row, col, csvDataStr, rowDelimiter, colDelimiter);

			// &#10; -> 개행처리
			// 김성민 오류작업  2016-11-22 개행처리를 서식복사 이전에 하는 경우에 문제가 있어 개형처리 순서를 서식복사후에 하는 것으로 조정함
			for(var r=row; r<(row + rowCount); r++) {
				for(var c=col; c<(col+colCount); c++) {
					var crChar = sheet.getValue(r, c);

					if (crChar && crChar.toString().indexOf("&#10;")>= 0){
						crChar = crChar.replaceAll("&#10;","\n");
						sheet.setValue(r, c, crChar);
					}
				}
			}
		}


		/**
		* Gride Type 데이터 바인딩
		* 서식에 데이터만 overwrite
		*/
		this.gridDataTypeBindOverwrite = function(spread, csvData, positions, rowDelimiter, colDelimiter) {
			var spreadNS = GcSpread.Sheets;
			var sheet = spread.getSheetFromName(positions[0])
			var row = positions[1];
			var col = positions[2];
			var bindingName = positions[3];
			var csvDataStr = csvData.csv;
			var rowCount = csvData.rowCount;
			var colCount = csvData.colCount;
			var lastColIndex = csvData.lastColIndex;
			var targetInfo = this.getTagForRows(spread, positions);

			if(targetInfo && targetInfo.bindingCount > 0) {
				for(var r=0; r<targetInfo.bindingRows.length; r++) {
					for(var c=col; c<(csvData.lastColIndex); c++) {
						sheet.getCell(targetInfo.bindingRows[r], c).value('');
						sheet.setTag(x, col, '');
					}
				}
			}

			//데이터 바인딩
			sheet.setCsv(row, col, csvDataStr, rowDelimiter, colDelimiter);

			/**
			* set tag -> Binding row의 첫번재 cell
			*/
			for(var x=row; x<(row + rowCount); x++) {
				sheet.setTag(x, col, bindingName);
			}
		}

		this.removeDataForRows = function(spread, sheet, positions, colCount) {
			var bindingInfo = this.getTagForRows(spread, positions);

			if(bindingInfo && bindingInfo.bindingCount > 0) {
				if(bindingInfo.bindingCount > 1) {
					//첫번째 행은 값만 삭제(이후 서식 카피에서 첫번째 행 사용해야함.)
					sheet.deleteRows(bindingInfo.bindingRows[1], (bindingInfo.bindingCount - 1));
				}else {
					//값만 삭제후 다시 입력(기본 overwriting 됨.)
				}

				for(var x=positions[2]; x<=colCount; x++) {
					sheet.getCell(positions[1], x).value('');
					sheet.setTag(positions[1], x, '');
				}
			}
		}

		this.getTagForRows = function(spread, positions) {
			var sheet = spread.getSheetFromName(positions[0]);
			var row = positions[1];
			var col = positions[2];
			var bindingName = positions[3];
			var rows = [];
			var bindingCount = 0;

			for(var r=row; r<sheet.getRowCount(); r++) {
				var tag = sheet.getTag(r, col);

				if(tag && tag == bindingName) {
					rows[rows.length] = r;
					bindingCount++;
				}
			}

			return {
				"bindingRows" : rows,
				"bindingCount" : bindingCount
			};
		}
	};

	var spreadDataBinding = new SpreadDataBindingUtils();

	function CmmnUtils() {
		//바인딩 쿼리 파라미터 추가
		this.setSqlParam = function(code, sql) {
			sql += "\n/*#   AND ROWNUM < 10 #*/";

			// 교원업적평가 파라미터 설정
			if(code == "NCMA0031N00220") {
				sql += "\n/*   AND EVL_YY = @평가연도@ */";
				sql += "\n/*   AND SKLSTF_NO = @교직원번호@ */";
			}

			// 교원채용 파라미터 설정
			if(code == "NCMA0031N00150") {
				sql += "\n/*   AND EMPMN_INFO_ID = @empmnInfoId@ */";
				sql += "\n/*   AND RCRIT_REALM_ID = @rcritRealmId@ */";
				sql += "\n/*   AND EMPMN_STEP_BUSNS_PRCS_ID = @empmnStepBusnsPrcsId@ */";
				sql += "\n/*   AND JUDGE_TRGTER_NO = @judgeTrgterNo@ */";
				sql += "\n/*   AND SPORT_RCEPT_NO = @sportRceptNo@ */";
			}

			// 교원인사 파라미터 설정
			if(code == "NCMA0031N00130") {

			}

			return sql;
		}
	}

	var cmmnUtils = new CmmnUtils();


