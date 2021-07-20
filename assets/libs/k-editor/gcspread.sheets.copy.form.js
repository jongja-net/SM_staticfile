/**
* 서식 카피시 clipboard 내용이 저장되는 변수
*/
var clipHtml = '';

/**/
function getTdStyle(clsKey) {
	var styleItems = {};

	var html = $(clipHtml);
	var style = null;
	for(var x=0; x<html.length; x++) {
		if(html[x].tagName == 'STYLE') {
			style = ($($(clipHtml)[x]).context.innerHTML);

			var sIndex = style.indexOf(clsKey);
			if(sIndex > 0) {
				style = style.substring(sIndex + clsKey.length);

				var eIndex = style.indexOf('}');
				style = style.substring(0, eIndex);

				sIndex = style.indexOf('{');
				style = style.substring(sIndex + 1);
			}
		}
	}
	if(style.length > 0) {
		var tmpStyles = style.split(';');
		
		var keyValue = null;
		for(var x=0; x<tmpStyles.length; x++) {
			if(tmpStyles[x]) {
				keyValue = $.trim(tmpStyles[x]).split(':');
				styleItems[keyValue[0]] = keyValue[1];
			}
		}
	}
	return styleItems;
}

/*Style*/
function getBorder(cssBorder) {
	if(cssBorder == 'none') {
		return 0;
	}
	var tmp = cssBorder.split(' ');
	if(tmp.length > 1) {
		var b = tmp[0].replace('pt', '');
		return (parseFloat(b) * 2);
	}else {
		return 1;
	}
}
function setStyleOption(o) {
	//console.log(o);
	for(var x=o.row; x<(o.row + o.rowCount); x++) {
		for(var i=o.col; i<(o.col + o.colCount); i++) {
			if(!dataTableItem[x]) {dataTableItem[x] = {};}
			if(!dataTableItem[x][i]) {dataTableItem[x][i] = {};}
			if(!dataTableItem[x][i]['style']) {dataTableItem[x][i]['style'] = {};}

			dataTableItem[x][i]['style']['vAlign'] = 1;
			dataTableItem[x][i]['style']['wordWrap'] = true;

			if(o.borderTop || o.borderRight || o.borderBottom || o.borderLeft) {
				dataTableItem[x][i]['style']['borderTop'] = {'color' : 'Black', 'style' : 1};
				dataTableItem[x][i]['style']['borderRight'] = {'color' : 'Black', 'style' : 1};
				dataTableItem[x][i]['style']['borderBottom'] = {'color' : 'Black', 'style' : 1};
				dataTableItem[x][i]['style']['borderLeft'] = {'color' : 'Black', 'style' : 1};
			}

			if(o.backColor) {
				dataTableItem[x][i]['style']['backColor'] = o.backColor;
			}
			if(o.fontColor) {
				dataTableItem[x][i]['style']['foreColor'] = o.fontColor;
			}
			if(o.textAlign) {
				if(o.textAlign == 'center')
					dataTableItem[x][i]['style']['hAlign'] = $.wijmo.wijspread.HorizontalAlign.center;
				else if(o.textAlign == 'left')
					dataTableItem[x][i]['style']['hAlign'] = $.wijmo.wijspread.HorizontalAlign.left;
				else if(o.textAlign == 'right')
					dataTableItem[x][i]['style']['hAlign'] = $.wijmo.wijspread.HorizontalAlign.right;
			}else {
				dataTableItem[x][i]['style']['hAlign'] = $.wijmo.wijspread.HorizontalAlign.general;
			}

			//new $.wijmo.wijspread.LineBorder("Black", $.wijmo.wijspread.LineStyle.thin)
		}
	}
}

function getColSize(tr) {
	var colSize = 0;
	for(var x=0; x<$(tr).find('td').length; x++) {
		var tdEl = $(tr).find('td')[x];
		
		if($(tdEl[x]).attr('colspan')) {
			colSize += parseInt($(tdEl[x]).attr('colspan'));
		}else {
			colSize += 1;
		}
	}
	return colSize;
}

function setDateFormat(sheet, spreadJson) {
	if(clipHtml.length > 0) {
		console.log(clipHtml);
		clipHtml = '';
	}
	
	if(spreadJson.data && spreadJson.data.dataTable) {
		for(var row in spreadJson.data.dataTable) {
			for(var col in spreadJson.data.dataTable[row]) {
				if(spreadJson.data.dataTable[row][col].value && spreadJson.data.dataTable[row][col].value.indexOf('OADate') > 0) {
					var style = sheet.getStyle(row, col);
					if(!style) {
						style = new GcSpread.Sheets.Style();
					}
					style.formatter = 'yyyy-MM-dd';
					sheet.setStyle(row, col, style);
				}
			}
		}
	}
}

/*html tr/td info*/
var table = {
	rowSize : 0,
	colSize : 0,
	tr : []
};
//style info
var dataTableItem = {};
//rows height info
var rowsItem = [];
//columns width info
var columnsItems = [];
function spreadCopyForm(args/*spread clipboard event arguments*/, clipHtml/*clipboard data*/, spread) {
	var html = $(clipHtml);

	var selectionSRow = args.cellRange.row;
	var selectionRowCount = args.cellRange.rowCount;

	var selectionSCol = args.cellRange.col;
	var selectionColCount = args.cellRange.colCount;

	/*
	* Sheet Data JSON
	*/
	var spreadJson = JSON.parse(JSON.stringify(args.sheet));

	//paste items for
	for(var x=0; x<html.length; x++) {
		if(html[x].tagName == 'TABLE') {
			if($(html[x]).find('tr') && $(html[x]).find('tr').length > 0) {
				table.rowSize = $(html[x]).find('tr').length;

				//tr el
				var trEl = $(html[x]).find('tr');

				//put table.colSize
				var tdEl =  $(trEl[0]).find('td');
				for(var j=0; j<tdEl.length; j++) {
					if($(tdEl[j]).attr('colspan')) {
						//console.log(parseInt($(tdEl[j]).attr('colspan')));
						table.colSize += parseInt($(tdEl[j]).attr('colspan'));
					}else {
						table.colSize += 1;
					}
				}
				
				//tr for
				for(var i=0; i<trEl.length; i++) {
					//row height 정보
					rowsItem[i + selectionSRow] = {};
					rowsItem[i + selectionSRow] = {'size' : (parseInt($(trEl[i]).attr('height')))};

					if(!table.tr[i]) {
						table.tr[i] = {
							rowIndex : i,
							colSize : getColSize($(trEl[i])),
							height : ($(trEl).attr('height') ? $(trEl).attr('height') : 0),
							td : []
						};
					}

					//td for
					for(var j=0; j<$(trEl[i]).find('td').length; j++) {
						var tdEl = $(trEl[i]).find('td')[j];
						
						var rowspan = $(tdEl).attr('rowspan');
						var colspan = $(tdEl).attr('colspan');

						/*
						* set td, search empty index
						*/
						var tmpTdIndex = 0;
						for(var k=0; k<table.colSize; k++) {
							if(!table.tr[i].td[k]) {
								tmpTdIndex = k;
								break;
							}
						}
						//if(!table.tr[i].td[tmpTdIndex]) {table.tr[i].td[tmpTdIndex] = {};}
						table.tr[i].td[tmpTdIndex] = {
							rowIndex : i,
							colIndex : tmpTdIndex,
							rowspan : (rowspan ? parseInt(rowspan) : 0),
							colspan : (colspan ? parseInt(colspan) : 0),
							value : ($(tdEl).text() ? $(tdEl).text() : '')
						};

						/*style parsing*/
						var bgcolor = null;
						var fontColor = null;
						var textAlign = null;

						var borderTop = null;
						var borderBottom = null;
						var borderLeft = null;
						var borderRight = null;

						if($(tdEl).attr('class')) {
							//getTdStyle($(tdEl).attr('class')
							$(tdEl).css(getTdStyle($(tdEl).attr('class')));

							if($(tdEl).css('background')) {
								bgcolor = $(tdEl).css('background');
								table.tr[i].td[tmpTdIndex]['background'] = bgcolor;
							}
							if($(tdEl).css('color')) {
								fontColor = $(tdEl).css('color');
								table.tr[i].td[tmpTdIndex]['fontColor'] = fontColor;
							}
							if($(tdEl).css('text-align')) {
								textAlign = $(tdEl).css('text-align');
								table.tr[i].td[tmpTdIndex]['textAlign'] = textAlign;
							}

							if($(tdEl).css('border-top')) {
								borderTop = $(tdEl).css('border-top');
								table.tr[i].td[tmpTdIndex]['borderTop'] = borderTop;
							}
							if($(tdEl).css('border-bottom')) {
								borderBottom = $(tdEl).css('border-bottom');
								table.tr[i].td[tmpTdIndex]['borderBottom'] = borderBottom;
							}
							if($(tdEl).css('border-left')) {
								borderLeft = $(tdEl).css('border-left');
								table.tr[i].td[tmpTdIndex]['borderLeft'] = borderLeft;
							}
							if($(tdEl).css('border-right')) {
								borderRight = $(tdEl).css('border-right');
								table.tr[i].td[tmpTdIndex]['borderRight'] = borderRight;
							}
						}
						//console.log('[' + i + ']' + 'rowspan=[' + rowspan + '], colspan=[' + colspan + ']');
//console.log('td ID =>>' + (tmpTdIndex));
						if(!rowspan && colspan) {
							for(var k=(tmpTdIndex + 1); k<(parseInt(colspan) + tmpTdIndex); k++) {
								if(!table.tr[i].td[k]) {
									table.tr[i].td[k] = {
										rowIndex : i,
										colIndex : k,
										rowspan : 0,
										colspan : 0,
										value : '',
										background : bgcolor,
										fontColor : fontColor,
										textAlign : textAlign,
										borderTop : borderTop,
										borderBottom : borderBottom,
										borderLeft : borderLeft,
										borderRight : borderRight
									};
								}
							}
						}else if(rowspan) {
							var rowLen = parseInt(rowspan);
							var colLen = 0;
							for(var k=0; k<table.tr[i].td.length; k++) {
								if(table.tr[i].td[k]) {
									colLen += table.tr[i].td[k].colspan;
								}
							}
							//현재 row 의 colspan 갯수 만큼 td 생성
							if(colLen > 0) {
								for(var l=1; l<parseInt(colspan); l++) {
									//if(!table.tr[i].td) table.tr[i].td = {};
									//col index 는 이전 td의 모든 colspan 을 더해서.. 
									table.tr[i].td[tmpTdIndex + l] = {
										rowIndex : i,
										colIndex : colLen + 1 + l/*j : 해당 col 이전의 모든 col 갯수*/,
										rowspan : 0,
										colspan : 0,
										value : '',
										background : bgcolor,
										fontColor : fontColor,
										textAlign : textAlign,
										borderTop : borderTop,
										borderBottom : borderBottom,
										borderLeft : borderLeft,
										borderRight : borderRight
									};
								}
							}

							//현재 cell 의 rowspan 만큼 tr 생성
							for(var k=(i + 1); k<(rowLen + i); k++) {
								if(!table.tr[k]) {
									table.tr[k] = {
										rowIndex : k,
										colSize : 0,
										height : 0,
										td : []
									};
								}
								if(colLen > 0) {
									for(var l=0; l<parseInt(colspan); l++) {
										//col index 는 이전 td의 모든 colspan 을 더해서.. 
										table.tr[k].td[tmpTdIndex + l] = {
											rowIndex : k,
											colIndex : colLen + l/*j : 해당 col 이전의 모든 col 갯수*/,
											rowspan : 0,
											colspan : 0,
											value : '',
											background : bgcolor,
											fontColor : fontColor,
											textAlign : textAlign,
											borderTop : borderTop,
											borderBottom : borderBottom,
											borderLeft : borderLeft,
											borderRight : borderRight
										};
									}
								}else {
									//col index 는 이전 td의 모든 colspan 을 더해서.. 
									table.tr[k].td[tmpTdIndex] = {
										rowIndex : k,
										colIndex : colLen/*j : 해당 col 이전의 모든 col 갯수*/,
										rowspan : 0,
										colspan : 0,
										value : '',
										background : bgcolor,
										fontColor : fontColor,
										textAlign : textAlign,
										borderTop : borderTop,
										borderBottom : borderBottom,
										borderLeft : borderLeft,
										borderRight : borderRight
									};
								}

							}
						}
						
					}
					
				}
			}
		}
	}

	//merge info
	var spanItems = [];
	var spanItemIndex = 0;

	if(table.rowSize > 0) {
		for(var tr in table.tr) {
			for(var td in table.tr[tr].td) {
				if(table.tr[tr].td[td].rowspan > 0 && table.tr[tr].td[td].colspan <= 0) {
					spanItems[spanItemIndex] = {};
					spanItems[spanItemIndex]['row'] = parseInt(tr) + selectionSRow;
					spanItems[spanItemIndex]['rowCount'] = table.tr[tr].td[td].rowspan;
					spanItems[spanItemIndex]['col'] = parseInt(table.tr[tr].td[td].colIndex) + selectionSCol;
					spanItems[spanItemIndex]['colCount'] = 1;
					//background color
					spanItems[spanItemIndex]['backColor'] = table.tr[tr].td[td].background;
					spanItems[spanItemIndex]['fontColor'] = table.tr[tr].td[td].fontColor;
					spanItems[spanItemIndex]['textAlign'] = table.tr[tr].td[td].textAlign;

					spanItems[spanItemIndex]['borderTop'] = table.tr[tr].td[td].borderTop;
					spanItems[spanItemIndex]['borderBottom'] = table.tr[tr].td[td].borderBottom;
					spanItems[spanItemIndex]['borderLeft'] = table.tr[tr].td[td].borderLeft;
					spanItems[spanItemIndex++]['borderRight'] = table.tr[tr].td[td].borderRight;
				}else if(table.tr[tr].td[td].rowspan <= 0 && table.tr[tr].td[td].colspan > 0) {
					spanItems[spanItemIndex] = {};
					spanItems[spanItemIndex]['row'] = parseInt(tr) + selectionSRow;
					spanItems[spanItemIndex]['rowCount'] = 1;
					spanItems[spanItemIndex]['col'] = parseInt(table.tr[tr].td[td].colIndex) + selectionSCol ;
					spanItems[spanItemIndex]['colCount'] = table.tr[tr].td[td].colspan;
					//background color
					spanItems[spanItemIndex]['backColor'] = table.tr[tr].td[td].background;
					spanItems[spanItemIndex]['fontColor'] = table.tr[tr].td[td].fontColor;
					spanItems[spanItemIndex]['textAlign'] = table.tr[tr].td[td].textAlign;

					spanItems[spanItemIndex]['borderTop'] = table.tr[tr].td[td].borderTop;
					spanItems[spanItemIndex]['borderBottom'] = table.tr[tr].td[td].borderBottom;
					spanItems[spanItemIndex]['borderLeft'] = table.tr[tr].td[td].borderLeft;
					spanItems[spanItemIndex++]['borderRight'] = table.tr[tr].td[td].borderRight;
				}else if(table.tr[tr].td[td].rowspan > 0 && table.tr[tr].td[td].colspan > 0) {
					spanItems[spanItemIndex] = {};
					spanItems[spanItemIndex]['row'] = parseInt(tr) + selectionSRow;
					spanItems[spanItemIndex]['rowCount'] = table.tr[tr].td[td].rowspan;
					spanItems[spanItemIndex]['col'] = parseInt(table.tr[tr].td[td].colIndex) + selectionSCol;
					spanItems[spanItemIndex]['colCount'] = table.tr[tr].td[td].colspan;

					//background color
					spanItems[spanItemIndex]['backColor'] = table.tr[tr].td[td].background;
					spanItems[spanItemIndex]['fontColor'] = table.tr[tr].td[td].fontColor;
					spanItems[spanItemIndex]['textAlign'] = table.tr[tr].td[td].textAlign;

					spanItems[spanItemIndex]['borderTop'] = table.tr[tr].td[td].borderTop;
					spanItems[spanItemIndex]['borderBottom'] = table.tr[tr].td[td].borderBottom;
					spanItems[spanItemIndex]['borderLeft'] = table.tr[tr].td[td].borderLeft;
					spanItems[spanItemIndex++]['borderRight'] = table.tr[tr].td[td].borderRight;
				}
			}
		}
	}

	//Style
	for(var x=selectionSRow; x<selectionRowCount + selectionSRow; x++) {
		for(var i=selectionSCol; i<selectionColCount + selectionSCol; i++) {
			var optItem = table.tr[x-selectionSRow].td[i-selectionSCol];
			if(optItem) {
				setStyleOption({
					'row' : x, 
					'rowCount': (optItem.rowspan <= 0 ? 1 : optItem.rowspan),
					'col' : i, 
					'colCount' : (optItem.colspan <= 0 ? 1: optItem.colspan),
					'backColor' : optItem.background,
					'fontColor' : optItem.fontColor,
					'textAlign' : optItem.textAlign,
					'borderTop' : optItem.borderTop,
					'borderBottom' : optItem.borderBottom,
					'borderLeft' : optItem.borderLeft,
					'borderRight' : optItem.borderRight
				});
			}
		}
	}

	spreadJson.data.dataTable = dataTableItem;/*data info/cell style*/
	spreadJson.spans = spanItems;/*merge info*/

	spreadJson.rows = rowsItem;/*row height info*/
	//spreadJson.columns = columnsItems;

	var sheet = spread.getActiveSheet();
	
	spread.isPaintSuspended(true);
	sheet.fromJSON(spreadJson);
	spread.isPaintSuspended(false);

	clipHtml = '';
	dataTableItem = {};
	spanItem = [];
	table = {rowSize : 0, colSize : 0, tr : []};

	//날짜 포맷 변환
	setDateFormat(sheet, sheet.toJSON());
}
