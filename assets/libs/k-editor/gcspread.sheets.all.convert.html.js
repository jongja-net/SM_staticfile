function compare(a, b) {
	var r =  a.filter(function(o) {
		return b.indexOf(o) == -1;
	})

	return r;
};

function convertSpreadToHtml(doc) {
	var json = JSON.parse(doc);

	var colorMap = {
		"Background 1":"rgb(255,255,255)",
		"Background 1 80":"rgb(255,255,255)",
		"Background 1 60":"rgb(255,255,255)",
		"Background 1 40":"rgb(255,255,255)",
		"Background 1 -25":"rgb(191,191,191)",
		"Background 1 -50":"rgb(127,127,127)",
		"Text 1":"rgb(0,0,0)",
		"Text 1 80":"rgb(204,204,204)",
		"Text 1 60":"rgb(153,153,153)",
		"Text 1 40":"rgb(102,102,102)",
		"Text 1 -25":"rgb(0,0,0)",
		"Text 1 -50":"rgb(0,0,0)",
		"Background 2":"rgb(231,230,230)",
		"Background 2 80":"rgb(249,251,250)",
		"Background 2 60":"rgb(244,245,245)",
		"Background 2 40":"rgb(240,241,240)",
		"Background 2 -25":"rgb(174,173,172)",
		"Background 2 -50":"rgb(119,113,113)",
		"Text 2":"rgb(68,84,106)",
		"Text 2 80":"rgb(214,221,228)",
		"Text 2 60":"rgb(173,185,201)",
		"Text 2 40":"rgb(133,151,175)",
		"Text 2 -25":"rgb(51,64,81)",
		"Text 2 -50":"rgb(34,43,54)",
		"Accent 1":"rgb(91,155,213)",
		"Accent 1 80":"rgb(222,235,246)",
		"Accent 1 60":"rgb(190,215,238)",
		"Accent 1 40":"rgb(156,195,229)",
		"Accent 1 -25":"rgb(46,119,183)",
		"Accent 1 -50":"rgb(31,79,122)",					
		"Accent 2":"rgb(237,125,49)",
		"Accent 2 80":"rgb(251,230,215)",
		"Accent 2 60":"rgb(247,204,174)",
		"Accent 2 40":"rgb(244,177,133)",
		"Accent 2 -25":"rgb(200,91,17)",
		"Accent 2 -50":"rgb(133,61,11)",				
		"Accent 3":"rgb(165,165,165)",
		"Accent 3 80":"rgb(236,236,236)",
		"Accent 3 60":"rgb(218,218,218)",
		"Accent 3 40":"rgb(200,200,200)",
		"Accent 3 -25":"rgb(124,124,124)",
		"Accent 3 -50":"rgb(82,82,82)",		
		"Accent 4":"rgb(255,192,0)",
		"Accent 4 80":"rgb(252,243,205)",
		"Accent 4 60":"rgb(254,230,154)",
		"Accent 4 40":"rgb(254,217,103)",
		"Accent 4 -25":"rgb(192,144,0)",
		"Accent 4 -50":"rgb(128,96,0)",	
		"Accent 5":"rgb(68,114,196)",
		"Accent 5 80":"rgb(217,227,242)",
		"Accent 5 60":"rgb(180,199,231)",
		"Accent 5 40":"rgb(142,172,219)",
		"Accent 5 -25":"rgb(47,86,151)",
		"Accent 5 -50":"rgb(31,58,101)",	
		"Accent 6":"rgb(112,173,71)",
		"Accent 6 80":"rgb(227,239,218)",
		"Accent 6 60":"rgb(199,223,180)",
		"Accent 6 40":"rgb(171,208,143)",
		"Accent 6 -25":"rgb(87,131,53)",
		"Accent 6 -50":"rgb(58,88,35)",
	};

	var mkHtml = '';
	var table = {};

	var sheets = json.sheets;

	//sheet 정보 카피
	if(sheets) {
		for(var sh in sheets) {
			var sheet = sheets[sh];

			table[sh] = {};
			for(var r=0; r<sheet.rowCount; r++) {
				table[sh][r] = {};
				for(var c=0; c<sheet.columnCount; c++) {
					table[sh][r][c] = {
						style : {}
					};

					if(sheet.data.dataTable && sheet.data.dataTable[r]) {
						if(sheet.data.dataTable[r][c]) {
							if(sheet.data.dataTable[r][c].style) {
								table[sh][r][c]['style'] = sheet.data.dataTable[r][c].style;
							}
							if(sheet.data.dataTable[r][c].value) {
								table[sh][r][c]['value'] = sheet.data.dataTable[r][c].value;
							}
						}
					}
				}
			}

			//deletes empty row 
			/*if(table[sh]) {
				//columns
				var cols = sheets[sh].columnCount -1;
				var tr = Object.keys(table[sh]);

				for(var c=cols; c>0; c--) {
					var isEmptyColumns = false;

					if(tr) {
						for(var r=0; r<tr.length; r++) {
							if(table[sh][r]) {
								var tdItem = table[sh][r][c];

								if(tdItem) {
									var autoFormatter = tdItem.style.autoFormatter;
									var backColor = tdItem.style.backColor;
									var borderBottom = tdItem.style.borderBottom;
									var borderLeft = tdItem.style.borderLeft;
									var borderRight = tdItem.style.borderRight;
									var borderTop = tdItem.style.borderTop;
									var wordWrap = tdItem.style.wordWrap;

									var value = tdItem.value;
									var formula = tdItem.formula;

									if(autoFormatter || backColor || borderBottom || borderLeft || borderRight || borderTop || wordWrap || value || formula) {
										isEmptyColumns = false;
										break;
									}else {
										isEmptyColumns = true;
									}
								}
							}

						}
						if(isEmptyColumns) {
							for(var r=0; r<tr.length; r++) {
								if(table[sh][r]) {
									delete table[sh][r][c];
								}
							}
						}
					}
				}
				
				//rows
				for(var tr in table[sh]) {
					var isEmptyRow = true;
					for(var td in table[sh][tr]) {
						var tdItem = table[sh][tr][td];

						var autoFormatter = tdItem.style.autoFormatter;
						var backColor = tdItem.style.backColor;
						var borderBottom = tdItem.style.borderBottom;
						var borderLeft = tdItem.style.borderLeft;
						var borderRight = tdItem.style.borderRight;
						var borderTop = tdItem.style.borderTop;
						var wordWrap = tdItem.style.wordWrap;

						var value = tdItem.value;
						var formula = tdItem.formula;

						if(autoFormatter || backColor || borderBottom || borderLeft || borderRight || borderTop || wordWrap || value || formula) {
							isEmptyRow = false;
						}
					}

					if(isEmptyRow) {
						delete table[sh][tr];
					}
				}//end row

			}*/
		}
		
		//sheet 정보에 spans 정보 셋팅
		for(var sh in sheets) {
			var spans = sheets[sh].spans;

			if(spans) {
				for(var x=0; x<spans.length; x++) {
					var spanItem = spans[x];
					
					if(spanItem.colCount) {
						if(table[sh][spanItem.row][spanItem.col]) {
							table[sh][spanItem.row][spanItem.col]['colCount'] = spanItem.colCount;
						}
					}
					if(spanItem.rowCount)
						if(table[sh][spanItem.row][spanItem.col]) {
							table[sh][spanItem.row][spanItem.col]['rowCount'] = spanItem.rowCount;
					}
				}
			}
		}

		//셋팅이 완료된 json을 colspan rowspan 에 따라 정리
		var tmpTable = table;
		for(var sheet in table) {
			for(var tr in table[sheet]) {
				for(var td in table[sheet][tr]) {
					//colspan
					if(table[sheet][tr][td].colCount && table[sheet][tr][td].colCount > 1) {
						var sIndex = parseInt(td) + 1;
						var eIndex = (sIndex - 1) + parseInt(table[sheet][tr][td].colCount) - 1;

						for(var x=sIndex; x<=eIndex; x++) {
							delete tmpTable[sheet][tr][x];
						}
					}
					//rowspan
					if(table[sheet][tr][td].rowCount && table[sheet][tr][td].rowCount > 1) {
						var sIndex = parseInt(tr) + 1;
						var eIndex = (sIndex - 1) + parseInt(table[sheet][tr][td].rowCount) - 1;

						for(var x=sIndex; x<=eIndex; x++) {
							delete tmpTable[sheet][x][td];
						}
					}
				}
			}
		}

		
		if(tmpTable) {
			var htmlTable = null;
			for(var sh in tmpTable) {
				/*height 정보*/
				var rows = sheets[sh].rows;
				var cols = sheets[sh].columns;

				var htmlTable = $('<table border="1" width="800" style="border-collapse:collapse; table-layout:fixed;"></table>');
				for(var tr in tmpTable[sh]) {
					var trHtml = '<tr>';
					var tdHtml = '';

					for(var td in tmpTable[sh][tr]) {
						var tdItem = tmpTable[sh][tr][td];

						var colspan = (tdItem.colCount ? 'colspan=' + tdItem.colCount : '');
						var rowspan = (tdItem.rowCount ? 'rowspan=' + tdItem.rowCount : '');

						var value = (tdItem.value ? tdItem.value : '　');
						
						//Style
						var style = 'style=" ';

						var background = tdItem.style.backColor;

						var borderBottom = tdItem.style.borderBottom;
						var borderLeft = tdItem.style.borderLeft;
						var borderRight = tdItem.style.borderRight;
						var borderTop = tdItem.style.borderTop;

						var hasLeftBorder = false, hasBottomBorder = false, hasRightBorder = false, hasTopBorder = false;

						var wordWrap = tdItem.style.wordWrap;
						var formatter = tdItem.style.autoFormatter;

						var hAlign = tdItem.style.hAlign;
						var vAlign = tdItem.style.vAlign;

						var font = tdItem.style.font;
						
						var width = (cols && cols[td] ? cols[td].size : 62);
						var tmpWidth = 0;
						if(tdItem.colCount > 1) {
							var sIndex = parseInt(td);
							var eIndex = (sIndex - 1) + parseInt(tdItem.colCount) - 1;

							for(var x=sIndex; x<=eIndex; x++) {
								if(cols && cols[x]) {
									tmpWidth += Number(cols[x].size);
								}else {
									tmpWidth += 62;
								}
							}
							width = tmpWidth;
						}
						width = width/8/*테이블 전체 width=800 으로 잡고, %로 변환*/;

						var height = (rows && rows[tr] ? rows[tr].size : 20);

						/*if(colspan || rowspan 
							|| value 
							|| formatter
							|| borderBottom || borderLeft || borderRight || borderTop
							|| wordWrap) {
						*/

							if(background) {
								$.each(colorMap, function(key, color) {
									if(key == background) {
										background = color;
									}
								});
								style += 'background-color:' + background + '; ';
							}

							//라인 스타일
							if(borderBottom) {
								if(borderBottom.color) {
									style += 'border-bottom-color:' + borderBottom.color + '; ';
								}
								if(borderBottom.style) {
									style += 'border-bottom-width:' + borderBottom.style + 'pt; border-bottom-style:solid; ';
								}
							}else {
								style += 'border-bottom:1pt solid white; ';
								hasBottomBorder = true;
							}

							if(borderLeft) {
								if(borderLeft.color) {
									style += 'border-left-color:' + borderLeft.color + '; ';
								}
								if(borderLeft.style) {
									style += 'border-left-width:' + borderLeft.style + 'pt; border-left-style:solid; ';
									
								}
							}else {
								style += 'border-left:1pt solid white; ';
								hasLeftBorder = true;
							}

							if(borderRight) {
								if(borderRight.color) {
									style += 'border-right-color:' + borderRight.color + '; ';
								}
								if(borderRight.style) {
									style += 'border-right-width:' + borderRight.style + 'pt; border-right-style:solid; ';
								}
							}else {
								style += 'border-right:1pt solid white; ';
								hasRightBorder = true;
							}

							if(borderTop) {
								if(borderTop.color) {
									style += 'border-top-color:' + borderTop.color + '; ';
								}
								
								
								if(borderTop.style) {
									//이전 bottom style none 셋팅
									var beforeTrBottomLine = $(htmlTable).find('tr:eq(' + (parseInt(tr) - 2) + ')').find('td:eq(' + td + ')').css('border-bottom');
									if(beforeTrBottomLine == null || beforeTrBottomLine == '1pt solid white' || beforeTrBottomLine == '1pt solid rgb(0, 0, 0)') {
										if(tdItem.colCount > 1) {
											var sIndex = parseInt(td);
											var eIndex = (sIndex - 1) + parseInt(tdItem.colCount);
				
											for(var x=sIndex; x<=eIndex; x++) {
												$(htmlTable).find('tr:eq(' + (parseInt(tr) - 1) + ')').find('td:eq(' + x + ')').css('border-bottom', 'none');
												$(htmlTable).find('tr:eq(' + (parseInt(tr) - 2) + ')').find('td:eq(' + x + ')').css('border-bottom', 'none');
												$(htmlTable).find('tr:eq(' + (parseInt(tr) - 3) + ')').find('td:eq(' + x + ')').css('border-bottom', 'none');
											}
										}else {
											$(htmlTable).find('tr:eq(' + (parseInt(tr) - 1) + ')').find('td:eq(' + td + ')').css('border-bottom', 'none');
											$(htmlTable).find('tr:eq(' + (parseInt(tr) - 2) + ')').find('td:eq(' + td + ')').css('border-bottom', 'none');
											$(htmlTable).find('tr:eq(' + (parseInt(tr) - 3) + ')').find('td:eq(' + td + ')').css('border-bottom', 'none');
										}
									}
									style += 'border-top-width:' + borderTop.style + 'pt; border-top-style:solid; ';
								}
							}else {
								style += 'border-top:1pt solid white; ';
								hasTopBorder = true;
							}

							if(hasLeftBorder && hasBottomBorder && hasRightBorder && hasTopBorder) {
								//style += 'border-style:hidden; ';
							}

							if(hAlign) {
								if(hAlign == 0) style += 'text-align:right; ';
								else if(hAlign == 1) style += 'text-align:center; ';
								else style += 'text-align:left; ';
							}
							if(vAlign) {
								if(vAlign == 1) style += 'vertical-align:middle; ';
								else if(vAlign == 2) style += 'vertical-align:bottom; ';
								else style += 'vertical-align:top; ';
							}
							if(font) {
								style += 'font:' + font + '; ';
							}else {
								style += 'font:' + font + '; font-size:9pt; ';/*font 고정*/
							}

							style += '"';
							
							if(typeof value == 'object') {
								value = value._error;
							}
							tdHtml += '<td height="' + height + 'px" width="' + width + '%" ' + colspan + ' ' + rowspan + ' ' + style + '>' + (value.toString()).replace(/\n/gi, '<br/>') + '</td>';
						//}
					}
					trHtml += tdHtml;
					trHtml += '</tr>';

					$(trHtml).appendTo(htmlTable);
				}
				mkHtml += htmlTable[0].outerHTML + '<br/><br/><br/>';
			}
		}
	}
	return mkHtml;
}

function divPrint(html) {
	try {
		var oIframe = document.getElementById('print');
		
		if(oIframe.frameElement) {
			if(oDoc.document) oDoc = oIframe.frameElement.contentWindow.document;	
		}else {
			oDoc = document.getElementById('print').contentDocument;
		}
		
		oDoc.write('<body onload="this.focus(); this.print();">');
		oDoc.write(html)
		oDoc.write('</body>');
		oDoc.close();
	}catch(e) {
		self.print();
	}
	
}