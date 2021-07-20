/**
* 사번입력시, 이름 가져오기(테스트)
*/
function KorusBindNameFunction() {
    this.name = "KORUSBINDNAME";
    this.maxArgs = 1;
    this.minArgs = 1;
}
KorusBindNameFunction.prototype = new $.wijmo.wijspread.Calc.Functions.Function();
KorusBindNameFunction.prototype.evaluate = function(args) {
	var result = '#VALUE!';
	
	//테스트 코드
	var url = '/cm/s/saas/documentAggregateCtr/getDocumentConfigList.do';
	$.ajax(url, {
		type: 'post',
		dataType: 'json',
		data: {docSeq : 7},
		async : false,
		success: function(data) {
			result = data.rows[0].ttlItmNm;
		},
		error: function() {
			alert('error');
		}
	});
	//테스트 코드
	
	return result;
}
var KorusBindNameDescription = {
	name: 'KORUSBINDNAME',
	description: '이름 가져오기',
	parameters: [{name : 'value'}]
}; var korusBindName = new KorusBindNameFunction();





function RegistCustomFunction(spread) {
	/*
	* regist Custom function 
	*/
	spread.addCustomFunction(korusBindName);
	spread.addCustomFunctionDescription(KorusBindNameDescription);
}