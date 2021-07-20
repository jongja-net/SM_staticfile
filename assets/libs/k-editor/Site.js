//Import File
function importFileWithIFrame(serverUrl, $fileElement, options) {
    var theFileContainer = $fileElement.parent();
    var theCloneFileElement = $fileElement.clone();
    
    var $iframe = $("<iframe id='xFrame' style='display: none' src='about:blank'></iframe>").appendTo("body");
    $iframe.ready(function () {
        var formDoc = getiframeDocument($iframe);
        formDoc.write("<html><head></head><body><form method='Post' enctype='multipart/form-data' action='" + "ff" + "'></form>dummy windows for postback</body></html>");
        var $form = $(formDoc).find('form');
        //append options to form
        $.each(options, function (index, field) {
            $('<input type="hidden"/>')
                .prop('name', field.name)
                .val(field.value)
                .appendTo($form);
        });
        //append Excel file to form
        $form.append($fileElement.attr("id", "tempFile1"));
        theFileContainer.prepend(theCloneFileElement);
        $form.submit();
    });
    $iframe.bind("load", function (e, args) {
        var formDoc = getiframeDocument($iframe);
        var responseText;
        try {
            responseText = formDoc.body ? formDoc.body.innerText : null;
            if (responseText) {
                formDoc.body.innerText = "";
                var spreadObj = JSON.parse(responseText);
                responseText = null;
                if (spreadObj) {
                    var spread = $("#ss").data("spread");
                    spread.fromJSON(spreadObj);
                    updateSheetList();
                    hideLoading();
                    spreadObj = null;
                } else if (spreadJson.error) {
                    hideLoading();
                    alert(spreadJson.error);
                }
            }
        } catch (error) {
            hideLoading();
            console.log("Import error: ", responseText);
            alert(error);
        }
    });
}

//Export File
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
    var htmlSpecialCharsRegEx = /[<>&\r\n"']/gm;
    var htmlSpecialCharsPlaceHolders = {
        '<': 'lt;',
        '>': 'gt;',
        '&': 'amp;',
        '\r': "#13;",
        '\n': "#10;",
        '"': 'quot;',
        "'": 'apos;' /*single quotes just to be safe*/
    };
    return str.replace(htmlSpecialCharsRegEx, function (match) {
        return '&' + htmlSpecialCharsPlaceHolders[match];
    });
}

function showLoading() {
    $("#loading").css("position", "relative");
    var width = $("#loading").width() + 2, height = $("#loading").height();
    $("<span id='delaySpan'><span id='icon' style='display:inline-block'></span>Importing...</span>")
            .css("left", width / 2 - 70)
            .css("top", height / 2 - 30)
            .css("position", "absolute")
            .css("color", "#4f4f4f")
            .css("background", "#ffffff")
            .css("border", "1px solid #a8a8a8")
            .css("border-radius", "3px")
            .css("-webkit-border-radius", "3px")
            .css("box-shadow", "0 0 10px rgba(0, 0, 0, 0.25")
            .css("font-family", "Arial, sans-serif")
            .css("font-size", "20px")
            .css("padding", "0.4em")
            .insertAfter("#ss");
    $("<div id='delayDiv'></div>")
            .css("background", "#2D5972")
            .css("opacity", 0.3)
            .css("position", "absolute")
            .css("top", 0)
            .css("left", 0)
            .css("width", width)
            .css("height", height)
            .insertAfter("#ss");
}

function hideLoading() {
    $("#delayDiv").remove();
    $("#delaySpan").remove();
}

function updateSheetList() {
    $("#sheetList").empty();
    $("#sheetList").append("<option value='All'>All</option>");
    var spread = $("#ss").data('spread');
    if (spread && spread.sheets && spread.sheets.length >= 0) {
        for (var index = 0; index < spread.sheets.length; index++) {
            var sheetName = spread.sheets[index].getName();
            $("#sheetList").append("<option value='" + sheetName + "'>" + sheetName + "</option>");
        }
    }
}

function getSaveFlags() {
    var ExcelSaveFlags = {
        NoFlagsSet: 0,
        NoFormulas: 1,
        SaveCustomRowHeaders: 2,
        SaveCustomColumnHeaders: 4,
        SaveAsFiltered: 8,
        SaveBothCustomRowAndColumnHeaders: 6,
        SaveAsViewed: 136,
        DataOnly: 32,
        AutoRowHeight: 4096
    };

    var flags = ExcelSaveFlags.NoFlagsSet;
    var collection = $("#saveFlags input");
    $.each(collection, function (i, v) {
        if (collection[i].checked) {
            flags |= ExcelSaveFlags[collection[i].id];
        }
    });
    return flags;
}

function getSavePDFSettings() {
    var author_prop = $("#author").val(),
        title_prop = $("#title").val(),
        subject_prop = $("#subject").val(),
        creator_prop = $("#application").val(),
        keywords_prop = $("#keyWords").val(),
        centerWindow_prop = $("#centerWindow").prop("checked"),
        displayDocTitle_prop = $("#showTitle").prop("checked"),
        hideMenubar_prop = !($("#showMenuBar").prop("checked")),
        fitWindow_prop = $("#fitWindow").prop("checked"),
        hideToolbar_prop = !($("#showToolbar").prop("checked")),
        hideWindowUI_prop = $("#showWindowUI").prop("checked");
    var settings = {
        author: author_prop,
        title: title_prop,
        subject: subject_prop,
        creator: creator_prop,
        keywords: keywords_prop,
        centerWindow: centerWindow_prop,
        displayDocTitle: displayDocTitle_prop,
        hideMenubar: hideMenubar_prop,
        fitWindow: fitWindow_prop,
        hideToolbar: hideToolbar_prop,
        hideWindowUI: hideWindowUI_prop
    };
    return settings;
}

function getSheetList(spread) {
    var sheetCount = spread.getSheetCount();
    var sheetIndexes = [];
    var list = $("#sheetList").val();
    if (list === "All") {
        for (var index = 0; index < sheetCount; index++) {
            sheetIndexes.push(index);
        }
    } else if (list !== "") {
        if (spread && spread.sheets && spread.sheets.length >= 0) {
            for (var index = 0; index < spread.sheets.length; index++) {
                var sheetName = spread.sheets[index].getName();
                if (list === sheetName) {
                    sheetIndexes.push(index);
                    break;
                }
            }
        }
    }
    return sheetIndexes;
}

function setExportFileName(data) {
    var name = $("#exportFileName").val();

    if (data && name) {
        data["exportFileName"] = name;
    }
}

function getExportServerUrl() {
    return $("#exportUrl").val();
}

function getImportServerUrl() {
    return $("#importUrl").val();;
}

//Import and export
$(function () {

    new GcSpread.Sheets.Spread($("#ss")[0], { sheetCount: 1 });

    updateSheetList();

    $("#import_excel").click(function () {
        try {
            //Prepare import data;
            var dataOnly = $('#import_excel_dataOnly').prop('checked') ? 1 : 0,
                    dataAndFormulasOnly = $('#import_excel_dataAndFormulasOnly').prop('checked') ? 3 : 0,
                    rowHeaders = $('#import_excel_rowHeaders').prop('checked') ? 4 : 0,
                    columnHeaders = $('#import_excel_columnHeaders').prop('checked') ? 8 : 0,
                    rowColumnHeaders = $('#import_excel_rowcolumnHeaders').prop('checked') ? 12 : 0,
                    doNotRecalculateAfterLoad = $('#import_excel_donotrecalculateafterload').prop('checked') ? 1024 : 0;
            var excelOpenFlags = (dataOnly | dataAndFormulasOnly | rowHeaders | columnHeaders | rowColumnHeaders | doNotRecalculateAfterLoad);
            var password = $('#importPassword').val();
            var serverUrl = getImportServerUrl();
            var theFile = $("#import_excel_file");

            var formData = [];
            formData.push({ name: "ExcelOpenFlags", value: excelOpenFlags });
            formData.push({ name: "Password", value: password });
            showLoading();
            importFileWithIFrame(serverUrl, theFile, formData);
        } catch (ex) {
            alert(ex);
        }
    });

    $("#export_excel").click(function () {
        var spread = $("#ss").data("spread");
        var saveFlags = getSaveFlags();
        var password = $("#exportPassword").val();
        var dataObj = {
            "spread": spread.toJSON(),
            "exportFileType": "xlsx",
            "excel": {
                "saveFlags": saveFlags,
                "password": password
            }
        };
        setExportFileName(dataObj);
        var content = JSON.stringify(dataObj);
        dataObj = null;
        var serverUrl = getExportServerUrl();
        exportFile(serverUrl, content);
    });

    $("#export_pdf").click(function () {
        var spread = $("#ss").data("spread");
        var settings = getSavePDFSettings();
        var sheetIndexes = getSheetList(spread);
        var dataObj = {
            "spread": spread.toJSON(),
            "exportFileType": "pdf",
            "pdf": {
                "sheetIndexes": sheetIndexes,
                "setting": settings
            }
        };
        setExportFileName(dataObj);
        var content = JSON.stringify(dataObj);
        dataObj = null;
        var serverUrl = getExportServerUrl();
        exportFile(serverUrl, content);
    });
});