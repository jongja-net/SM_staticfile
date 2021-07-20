	
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
	       				var dataCsv = csvConverter.convertCSV(loadSpreadData.spread, position, data.rows, '^', ',');
	       				
	       				//grid type - row 를 생성하면서 데이터 바인딩 처리
	       				spreadDataBinding.gridDataTypeBind(loadSpreadData.spread, dataCsv, position, '^', ',');
	       				
	       				//grid type - overwrite 
	       				//spreadDataBinding.gridDataTypeBindOverwrite(loadSpreadData.spread, dataCsv, position, '^', ',');
	       				
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
	} var loadSpreadData = new _fnLoadSpreadData();
	

	function SpreadBindingNameUtils() {
		/**
		 * 바인딩 명 셋팅
		 */
		this.setBinding = function(spread, sheet, bindingName, row, col) {
			if(row!=undefined && col!=undefined) {
				var spreadNS = GcSpread.Sheets;
				
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
	                            value = '[' + bindingPath + ']';
	                        }
	                    }
	                }
	                spreadNS.TextCellType.prototype.paint.apply(this, arguments);
	            };
	            if(sheet!=undefined) {
	            	spread.isPaintSuspended(true);
	            	var bindingPathCellType = new BindingPathCellType();
	            	sheet.getCell(row, col).bindingPath(bindingName).cellType(bindingPathCellType).vAlign(spreadNS.VerticalAlign.center);
	            	
	            	spread.isPaintSuspended(false);
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
	}; var spreadBindingName = new SpreadBindingNameUtils();
	
	
	
	
	
	function CSVDataConverterUtils() {
		/**
		 * 데이터를 csv 로 변환
		 */
		this.convertCSV = function(spread, positions, items, rowDelimiter, colDelimiter) {
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
					curCol = positions[2];
					
					for(var c in rowItem) {
						/**
						 * 해당 셀의 포맷이 날짜 포맷인 경우,
						 * 데이터가 8자리 (20160601) 형태인 케이스만 변경함.
						 */
						if(sheet.getCell(positions[1], curCol++).formatter() && sheet.getCell(positions[1], curCol++).formatter().search('yyyy-MM-dd') >= -1) {
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
			var regx = /[<>&\r\n"',]/gm;
			var holders = {
				'<' : 'lt;',
				'>' : 'gt;',
				'&' : 'amp;',
				'\r' : "#13;",
				'\n' : "#10;",
				'"' : 'quot;',
				"'" : 'apos;',
				',' : "，"
			};
			return item.replace(regx, function(match) {
				if(match == ',') {/*내부 변환이 안되는 char 변환*/
					return holders[match];
				}else {
					return '&' + holders[match];	
				}
			});
		}
	}; var csvConverter = new CSVDataConverterUtils();
	
	
	
	
	function SpreadDataBindingUtils() {
		/**
		* Gride Type 데이터 바인딩
		* data row 갯수많큼 row 를 생성시키면서 데이터 바인딩 하는 함수.
		*/
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
			var sheet = spread.getSheetFromName(positions[0])
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
			return {bindingRows : rows, bindingCount : bindingCount};
		}
	} var spreadDataBinding = new SpreadDataBindingUtils();
	
	/**
	 * spreadCustomName.setValue(spread, {'학과': '기계공학과', 'aaa' : 'AAA', 'bbb' : 'BBB', 'ccc' : 'CCC', 'ddd': 'DDD', 'eee' : 'EEE', 'fff' : 'FFF'}) ;
	 */
	function SpreadCustomNames() {
		this.setValue = function(spread, customNameMap) {
			if(customNameMap != null) {
				for(key in customNameMap) {
					var info = this.getCustomNameInfo(key);
					//info._expr.value = customNameMap[key];
					spread.addCustomName(info._name, '"' + customNameMap[key] + '"',  info._baseRow, info._baseColumn);
				}
			}
		}
		this.getCustomNameInfo = function(key) {
			var customNames = spread.getCustomNames();
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
		}
	} var spreadCustomName = new SpreadCustomNames();
	
	function char2colIndex(char){
		var ret = 0;
		char = char.toLocaleUpperCase();
		for(var i=0; i<char.length; i++){
			var sc = char.substr(i,1);
			var scIndex = sc.charCodeAt(0)-65
			ret = ret + Math.pow(26, char.length-i-1)*(scIndex+1);
		}
		if (ret >0) ret = ret -1;
		return ret;
	};
	function colIndex2char(colindex){
		var ret = "";
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
	/*
	SpreadNumSplit("Sheet1!$F$211");
	=> ["Sheet1", "F", "211"]
	*/		
	function convertAlphToSpreadNum(sn){
		var ret = "";
		var scindex="";
		var sp = []
		
		sn = sn.replaceAll('\\$',"");
		
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
		return sp;
	}
	