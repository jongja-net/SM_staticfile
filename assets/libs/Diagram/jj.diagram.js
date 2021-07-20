$.widget("sm.Diagram", {
    options: {
        "width": "100%",
        "height": "100%",
        "accept": ".dataItem, .shapeItem",
        "jsPlumbOption": {
            Endpoint: ["Dot", { radius: 5}],
            HoverPaintStyle: { strokeStyle: "#1e8151", lineWidth: 3 },
            ConnectionOverlays: [
                  ["Arrow", {
                      location: 1,
                      id: "arrow",
                      length: 12,
                      foldback: 0.8
                  }],
                  ["Label", { label: "link", id: "label", cssClass: "aLabel"}]
            ]
        },
        "drawItems": {
            Base: {
                Option: {
                    "id": "", /* $.GUID(), */
                    "title": "",
                    "left": 100,
                    "top": 100,
                    "width": 29,
                    "height": 38,
                    "ntype": "",
                    "key": "",
                    "json": "",
                    "nclass": "",
                    "reSize": true
                }
            }
        },
        "shapesSelector": null,
        "shapes": {
            "workflow" : {
                "connector": {
                    "className": "connector",
                    "display": "start",
                    "role": "shapeItem",
                    "innerHtml": "시작점을 나타냄"
                }
                ,"data": { "className": "data",  "display": "Data", "role": "shapeItem",  "innerHtml": "시작점을 나타냄" }
                , "internal-storage": { "className": "internal-storage", "display": "internal-storage", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "manual-input": { "className": "manual-input", "display": "manual-input", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "off-page-connector": { "className": "off-page-connector", "display": "off-page-connector", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "process": { "className": "process", "display": "process", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "punched-tape": { "className": "punched-tape", "display": "punched-tape", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "sort": { "className": "sort", "display": "sort", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "storage": { "className": "storage", "display": "storage", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "triangle": { "className": "triangle", "display": "Data", "triangle": "shapeItem", "innerHtml": "시작점을 나타냄" }

                , "down-arrow-callout": { "className": "down-arrow-callout", "display": "down-arrow-callout", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "flow-right-arrow": { "className": "flow-right-arrow", "display": "flow-right-arrow", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "left-arrow-callout": { "className": "left-arrow-callout", "display": "left-arrow-callout", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "left-right-arrow-callout": { "className": "left-right-arrow-callout", "display": "left-right-arrow-callout", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "line-callout-2": { "className": "line-callout-2", "display": "line-callout-2", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "quad-arrow-callout": { "className": "quad-arrow-callout", "display": "quad-arrow-callout", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "rectangular-callout": { "className": "rectangular-callout", "display": "rectangular-callout", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "right-arrow": { "className": "right-arrow", "display": "right-arrow", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "right-triangle": { "className": "right-triangle", "display": "right-triangle", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "round-callout": { "className": "round-callout", "display": "round-callout", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "round-rectangle": { "className": "round-rectangle", "display": "round-rectangle", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }
                , "up-down-arrow-callout": { "className": "up-down-arrow-callout", "display": "up-down-arrow-callout", "role": "shapeItem", "innerHtml": "시작점을 나타냄" }

            },
            "jobs": {
                "memo": {
                    "className": "memo",
                    "display": "memo",
                    "role": "memo",
                    "innerHtml": "자료의 목록을 나타냄"
                },
                "page": {
                    "className": "triangle",
                    "display": "page",
                    "role": "page",
                    "innerHtml": "자료의 목록을 나타냄"
                },
                "form": {
                    "className": "form",
                    "display": "form",
                    "role": "form",
                    "innerHtml": "자료의 목록을 나타냄"
                },
                "word": {
                    "className": "word",
                    "display": "word",
                    "role": "word",
                    "innerHtml": "자료의 목록을 나타냄"
                },
                "img": {
                    "className": "img",
                    "display": "img",
                    "role": "img",
                    "innerHtml": "자료의 목록을 나타냄"
                },
                "file": {
                    "className": "file",
                    "display": "file",
                    "role": "file",
                    "innerHtml": "자료의 목록을 나타냄"
                }

            }
        
        },
        "functions": {},
        "description": "문자형자료를 생성합니다"
    },

    _create: function () {
        var _js = this;
        var _obj = this.element.uniqueId();
        var vOption = this.options;
    
        
       // _obj.attr("tabindex", 0);
        $('<label class="info">diagram 1.1</label>').appendTo(_obj);

        //_js.setInfo("loaded");

        _obj.on('paste', function (event, ui) {

            /* 대상이 콘트롤이 아닌 경우는 붙여넣기 팝업으로 인정 */
            var tnode = event.target.nodeName;
            if ('TEXTAREA SELECT INPUT'.indexOf(tnode) >= 0) return;


            event.stopPropagation();
            event.preventDefault();


            var _data = event.originalEvent.clipboardData;
            var text = _data.getData('Text');
            var url = _data.getData('url');

            //_data.types[0] == "Files"

            // alert("클립보드감지 : " + text);
            if (_data.types[0] == "text/plain" && _data.types[1] == "text/html") {
                _data.items[1].getAsString(function(pHtml){
                    _js.clipWord(pHtml);
                })
            } else if (_data.types[0] == "text/plain" && _data.types[1] == "text/uri-list" && _data.types[2] == "text/html") {
                _data.items[2].getAsString(function (pHtml) {
                    _js.clipWord(pHtml);
                })

            } else if (_data.types[0] == "text/plain" && _data.types.length == 1) {
                _js.clipText(text);

            } else if (_data.types[0] == "Files") {
                var blob = _data.items[0].getAsFile();
                var URLObj = window.URL || window.webkitURL;
                var source = URLObj.createObjectURL(blob);

                _js.clipImg(blob);
            } else if (_data.types[0] == "text/html" && _data.types[1] == "Files") {
                var blob = _data.items[1].getAsFile();
                var URLObj = window.URL || window.webkitURL;
                var source = URLObj.createObjectURL(blob);

                _js.clipImg(blob);
            } else if (text !== "") {
             _js.clipText(text);
         }

            

        });

        $(window).on('drop', function (event, ui) {
            /* d윈도우 drop 이벤트는 마우스가 잡히지 않음 */
            var position = {
                "left": "100px",
                "top": "100px",
                "width": "200px",
                "height": "400px"
            }

            if (event.originalEvent.dataTransfer === undefined) return;
           // if ('TEXTAREA SELECT INPUT'.indexOf(event.target.nodeName.tnode) < 0) return;

            event.stopPropagation();
            event.preventDefault();

            _obj.removeClass("win-drag");

            var _data = event.originalEvent.dataTransfer;
            var text = _data.getData('Text');
            var url = _data.getData('url');

            if (_data.types[0] == "text/plain" && _data.types[1] == "text/html") {
                _data.items[1].getAsString(function (pHtml) {
                    _js.clipWord(pHtml);
                })
            } else if (_data.types[0] == "text/plain" && _data.types[1] == "text/uri-list" && _data.types[2] == "text/html") {

                var _t = $.urlTypeRlt(url);
                var
                    op = {
                        "title": "word"
                        , "body": text
                    }
                ;
                switch (_t.ty) {
                    case "youtube":
                        op.url = _t.ul;
                        _js.AddRender["youtube"](_js, op);
                        break;
                    case "facebook":
                        op.url = _t.ul;
                        _js.AddRender["facebook"](_js, op);
                        break;
                    case "jongja":
                        _js.clipPage(_t.ul);
                        break;
                    case "img":
                        _js.clipImg(_t.ul);
                        break;
                    default:
                        _data.items[2].getAsString(function (pHtml) {
                            _js.clipWord(pHtml);
                        })
                }

            } else if (_data.types[0] == "text/plain" && _data.types.length == 1) {
                _js.clipText(text);

            } else if (_data.types[0] == "text/plain" && _data.types[1] == "text/uri-list") {
                _js.clipPage(url);

            } else if (_data.types[0] == "Files") {
                JJ.ajax.formDataUpload(_data.files, {
                    "async": true,
                    "sCallBack": function (data) {
                        var
                            _left = _js.mouseX - 50
                            , _top = _js.mouseY -40
                        ;

                        $.each(data, function (pI, pA) {
                            if (pA[1].indexOf("image") == 0) {
                                _js.AddRender["img"](_js, {"left":_left, "top":_top, "url": pA[0] });
                            } else {
                                _js.AddRender["file"](_js, { "position": {"left": _left, "top": _top}, "url": pA[0], "type": pA[1] });
                            }
                            _left += 120;
                            _top += 100;
                        })
                    }
                })

            } else if (_data.types[0] == "text/html" && _data.types[1] == "Files") {
                var blob = _data.items[1].getAsFile();
                var URLObj = window.URL || window.webkitURL;
                var source = URLObj.createObjectURL(blob);

                _js.clipImg(blob);
            } else if (text !== "") {
                _js.clipText(text);
            }


            //$('<br />').appendTo($('#mainBody'));
            if (event.originalEvent.dataTransfer) {
                var mm;
                /*
                if (event.originalEvent.dataTransfer.types[0] == "Files") {
                    mm = event.originalEvent.dataTransfer.types[0] + ' , ' + event.originalEvent.dataTransfer.files[0].name;
                    $.FileUpload('test', event.originalEvent.dataTransfer.files, function (data) {
                        //data.전달값
                        //http: //localhost:49671/image/upload/cbi-c5c1adc7-9a80-4a27-8b0f-941346f30fd7.jpg
                        if (data.type.indexOf("image") == 0) {
                            $.ImageAdd(data.name);
                        } else {
                            _obj.Diagram('ItemAdd', {
                                "title": data.name,
                                "position": {
                                    "left": _js.mouseX,
                                    "top": _js.mouseY
                                }
                            });
                        }
                    });
                }
                else {
                    mm = event.originalEvent.dataTransfer.types[0] + ' , ' + event.originalEvent.dataTransfer.getData('Text');
                    var text = event.originalEvent.dataTransfer.getData('Text');
                    var url = event.originalEvent.dataTransfer.getData('url');

                    if (text != '' && url == '') {
                        $.textAdd(text, position);
                    } else if (url != '') {
                        var _t = $.urlTypeRlt(url);

                        if (_t.ty == "youtube") {
                            $.youtubeAdd(_t.ul, position);
                        } else if (_t.ty == "facebook") {
                            $.facebookAdd(_t.ul, position);

                        } else if (_t.ty == "jongja") {
                            $.jongjaAdd(_t.ul, position);

                        } else if (_t.ty == "gantter") {
                            $.gantterAdd(_t.ul, position);

                        } else if (_t.ty == "img") {
                            $.ImageAdd(_t.ul, position);
                        } else {
                            $.webAdd(url, position);
                        }

                    }

                }
                //  $('<a>' + mm + '</a>').appendTo($('#mainBody'));
                */
            }
            return false;
        });
        $(window).on('dragover', function (event, ui) {
            if (event.originalEvent.dataTransfer === undefined) {
                return;
            }
            event.stopPropagation();
            event.preventDefault();
            _obj.addClass("win-drag");
            return false;
        });
        $(window).on('dragleave', function (event, ui) {
            if (event.originalEvent.dataTransfer === undefined) {
                return;
            }
            event.stopPropagation();
            event.preventDefault();
            _obj.removeClass("win-drag");
            return false;
        });

        _obj.droppable({
            accept: vOption.accept,
            //  hoverClass: "ui-state-highlight",
            over: function(event, ui){
                _js.setInfo(ui.position.left +"," + $(this)[0].offsetLeft);
            },
            drop: function (event, ui) {
                event.stopPropagation();
                event.preventDefault();
                _js.change("drop");
                var _it = $(ui.draggable[0]);
                if (_it.hasClass('shapeItem')) {
                    var pos = ui.helper.offset(),
                        dpos = $(this).offset()
                    ;

                    _js.itemDrop({
                        "target": ui,
                        "title": _it.attr('title'),
                        "className": "sh " + _it.attr('bizKey'),
                        "role": _it.attr('role'),
                      //  "position": { "left": 10, "top": 10 }
                        "position": { "left": pos.left - dpos.left, "top": pos.top - dpos.top }
                    });
                    return false;
                }
            }
        });

        jsPlumb.ready(function () {
            _js.Diagram = jsPlumb.getInstance({
                Endpoint: ["Dot", { radius: 5}],
                Connector:"StateMachine",
                HoverPaintStyle: { strokeStyle: "#1e8151", lineWidth: 2 },
                ConnectionOverlays: [
                    ["Arrow", {
                        location: 1,
                        id: "arrow",
                        length: 10,
                        foldback: 1
                    }],
                    ["Label", { label: "", id: "label", cssClass: "aLabel"}]
                ],
                Container: _obj.attr('id')
            });

            _js.jsPlumbInit();
            // _js.Diagram.connect({ source: "phone2", target: "rejected" });

            _js.shapesInit();

            _js.Diagram.bind("connection", function (info) {
                _js.change("connection");
            });
            _js.Diagram.bind("dblclick", function (c) {
                if (c.label !== undefined) {
                    c = c.component;
                }

                _js.lineTitle(c);

            });

        });

        //_obj.selectable({
        //    filter: ".w",
        //    stop: function (event, ui) {
        //    }
        //});

        _obj.mousemove(function (event) {
            _js.mouseX = event.offsetX;
            _js.mouseY = event.offsetY;
           
            $("body>footer a.position").remove();
            $("body>footer").append('<a class="position left"> mp: ' + _js.mouseX + ' x ' + _js.mouseY + '</a>');

        });

        //_obj.keydown(function (e) {
        //    if (e.keyCode == 13) {
               
        //    }
        //    alert("키이벤트 발생");
        //});

        //_obj.selectable({
        //    filter: ".w"
        //});

        /* 휴지통 처리 */
        $('<div class="dataTrash" title="item delete"><h3 class="glyphicon glyphicon-trash"></h3></div>').appendTo(_obj).droppable({
            
            accept:function(e) {
                if(e.hasClass('unDeleted')) { 
                    return false;}
                else {  return true;}
            },
                    
            tolerance: "pointer",
            hoverClass: "bg-danger",
            drop: function (event, ui) {

            	if (confirm('선택되 입력항목을 제거 하시겠습니까?')){
            		$(ui.draggable).remove();

            		var
                        _itemId = $(ui.draggable).attr("id")
            		;

            		_js.ItemRemove(_itemId);
            	}
                //JJ.dialog.confirm("delete", "delete ok ?", function () {
                //    $(ui.draggable).remove();

                //    var
                //        _itemId = $(ui.draggable).attr("id")
                //    ;

                //    _js.ItemRemove(_itemId);

                //})
                
            }
        });

    },

    change: function(e){
        //alert(e + " : 변화발생");
        var _js = this;
        var _obj = this.element;
        var vOption = this.options;
        this._trigger("change", event, { "message": e });
    },

    jsPlumbInit: function () {
        var _js = this;
        var _obj = this.element;
        var vOption = this.options;

        var windows = jsPlumb.getSelector(_obj.find(".w")); 
        //".statemachine-demo .w");

        if (windows.length == 0) return;

        _js.Diagram.draggable(windows);


        
        //_js.Diagram.bind("connection", function (info) {
        //    _js.change("connection");
        //    // info.connection.getOverlay("label").setLabel('작업:' + info.connection.id);
        //    //info.connection.getOverlay("label").hide();
        //});

        _js.Diagram.doWhileSuspended(function () {
            var isFilterSupported = _js.Diagram.isDragFilterSupported();

            if (isFilterSupported) {
                _js.Diagram.makeSource(windows, {
                    filter: ".ep",
                    anchor: "Continuous",
                    connector: ["StateMachine", { curviness: 10}],
                    connectorStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 2 },
                    maxConnections: 5,
                    onMaxConnections: function (info, e) {
                        alert("Maximum connections (" + info.maxConnections + ") reached");
                    }
                });
            }
            else {
                var eps = jsPlumb.getSelector(_obj.find(".ep"));
                for (var i = 0; i < eps.length; i++) {
                    var e = eps[i], p = e.parentNode;
                    _js.Diagram.makeSource(e, {
                        parent: p,
                        anchor: "Continuous",
                        connector: ["StateMachine", { curviness: 10}],
                        connectorStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 },
                        maxConnections: 5,
                        onMaxConnections: function (info, e) {
                            alert("Maximum connections (" + info.maxConnections + ") reached");
                        }
                    });
                }
            }
        });

        _js.Diagram.makeTarget(windows, {
            dropOptions: { hoverClass: "dragHover" },
            anchor: "Continuous",
            allowLoopback: true
        });


        // jsPlumb.fire("jsPlumbDemoLoaded", instance);

    },

    shapesInit: function () {
        var _js = this;
        var _obj = this.element;
        var vOption = this.options;

        $('<h5 class="jj-toggle">shapes</h5>').appendTo(vOption.shapesSelector);
        var worflowUl = $("<ul></ul").appendTo(vOption.shapesSelector);
        $.each(vOption.shapes.workflow, function (i, v) {
            var li = $("<li class='shapeItem sh' role='" + v.role + "' bizKey='" + i + "'></li>").appendTo(worflowUl).addClass(v.className).attr("title", v.display);
        });
       // $('<h5  class="bg-primary">Jobjs</h5>').appendTo(vOption.shapesSelector);
       // var JobsUl = $("<ul></ul").appendTo(vOption.shapesSelector);
       // $.each(vOption.shapes.jobs, function (i, v) {
       //     var li = $("<li class='shapeItem sh' role='" + v.role + "' bizKey='" + i + "'></li>").appendTo(JobsUl).addClass(v.className).attr("title", v.display);
       // });

        $(".shapeItem", vOption.shapesSelector).draggable({
            appendTo: "body",
            // containment: "#mainBody",
            helper: "clone"
        });



    },

    setInfo: function (msg) {
        var _js = this;
        var _obj = this.element;
        var vOption = this.options;
        
        $(".info", _obj).html(msg);
    },

    itemDrop: function (op) {
        var _js = this;
        var _obj = this.element;
        var vOption = this.options;

        var _it = $(op.target.draggable[0])
        if (_it.attr('role') == "memo") {
            //   JJ.dialog.getText("memo", "text enter", function (text) {
            op.title = "please edit";
            _js.ItemAdd(op);
            //  });
        } else {
            _js.ItemAdd(op);
        }

    },
    ItemAdd: function (op) {
        if (this.AddRender[op.role] === undefined) {
            alert("init function not found");
            op.target.helper.remove();
        } else {
            this.AddRender[op.role](this, op);
        }

    },

    clipText: function (text) {
        var
            op = {
                "title": "memo"
                , "body": text
            }
        ;

        // 만일 붙여넣는 대상이 URL이라면 관련정보를 링크한다.
        if ($.urlExists(text)) {

            var _t = $.urlTypeRlt(text);

            switch (_t.ty) {
                case "youtube":
                    op.url = _t.ul;
                    this.AddRender["youtube"](this, op);
                    break;
                case "facebook":
                    alert("facebook");
                    op.url = _t.ul;
                    this.AddRender["facebook"](this, op);

                    break;
                case "jongja":
                    this.clipPage(_t.ul);
                    break;
                case "img":
                    this.clipImg(_t.ul);
                    break;
                default:
                    break;
            }

        } else {
            this.AddRender["memo"](this, op);
        }


    },
    clipWord: function (text) {
        var
            op = {
                "title": "word"
                , "body": text
                , "position": { "left": this.mouseX , "top": this.mouseY  }
            }
        ;

        // 만일 붙여넣는 대상이 URL이라면 관련정보를 링크한다.
        if ($.urlExists(text)) {

            var _t = $.urlTypeRlt(text);

            switch (_t.ty) {
                case "youtube":
                    op.url = _t.ul;
                    this.AddRender["youtube"](this, op);
                    break;
                case "facebook":
                    alert("facebook");
                    op.url = _t.ul;
                    this.AddRender["facebook"](this, op);

                    break;
                case "jongja":
                    this.clipPage(_t.ul);
                    break;
                case "img":
                    this.clipImg(_t.ul);
                    break;
                default:
                    var _bg = $("<div></div>").append(text);
                    _bg.find("a[href]").each(function (i, v) {
                        $(this).attr("target", "_blank");
                    });

                    op.body = _bg.html();

                    this.AddRender["word"](this, op);
                    break;
            }

        } else {
            var _bg = $("<div></div>").append(text);
            _bg.find("a[href]").each(function (i, v) {
                $(this).attr("target", "_blank");
                $(this).attr("onclick", "");
            });

            op.body = _bg.html();

            this.AddRender["word"](this, op);
        }




    },

    clipPage: function (url) {
        var
            menuUrl = "";

        if (url.indexOf(window.location.origin + "/#") === 0) {
            menuUrl = url.replace(window.location.origin + "/#", '');
        } else if (url.indexOf(window.location.origin + "/index.html#") === 0) {
            menuUrl = url.replace(window.location.origin + "/index.html#", '');
        }
            

        var
            op = {
                "title": "page"
                , "url": menuUrl
            }
        ;

        this.AddRender["page"](this, op);
        
    },
    clipImg: function (file) {
        var _js = this;
        var _obj = this.element;
        var vOption = this.options;

        JJ.ajax.clipboardUpload(file, {
            "sCallBack": function (data) {
                //alert("업로드파일번호: " + data.restUrl);
                _js.AddRender["img"](_js, { "url": data.restUrl });
            },
            "async": true
            //"progress": _progress
        });
    },
    clipfile: function (file) {
        var _js = this;
        var _obj = this.element;
        var vOption = this.options;

        JJ.ajax.clipboardUpload(file, {
            "sCallBack": function (data) {
                //alert("업로드파일번호: " + data.restUrl);
                _js.AddRender["img"](_js, {
                    "url": data.restUrl,
                    "position": {
                        "left": _js.mouseX,
                        "top": _js.mouseY
                    }
                });
            },
            "async": true
            //"progress": _progress
        });
    },

    AddRender :{
        shapeItem  : function (widget, op) {
            var opt = jQuery.extend({
                "height": "38px",
                "width": "150px"
            }, op);

            var _js = widget;
            var _obj = widget.element;
            var vOption = widget.options;

            var _item = $("<div class='w' ></div>").appendTo(_obj);
            if (opt.id == undefined) {
                _item.attr("id", _js.getId());
                //_item.uniqueId()$.Guid
            } else {
                _item.attr("id", opt.id);
            }

            _item.data('option', opt)
            .css('left', opt.position.left).css('top', opt.position.top)
            .css('height', opt.height)
            .css('width', opt.width)
            .addClass(opt.className)
            .attr("role", opt.role);

            //.resizable({
            //    handles: "e, w",
            //    stop: function (event, ui) {
            //        _js.jsPlumbInit();
            //    }
            //});

            var inLineLabel = $("<a class='numTop' title='" + opt.title + "'>" + opt.title + "</a>").appendTo(_item).attr("helpId", opt.helpId);
            if(opt.helpId){
            	$('<i class="fa fa-question-circle" jj-action="doHelp" jj-data="' + opt.helpId + '" title="상세설명도움말"></i>').appendTo(_item);
			}
            $("<div class='ep'></div>").appendTo(_item);

            _js.jsPlumbInit();

            _item.draggable({
                containment: "parent",
                stop: function (event, ui) {
                    _js.change("move");
                }
            });

            _item.dblclick(function (e) {
                var _text = inLineLabel.html();
                var _helpId = inLineLabel.attr("helpId");
                _js.textBox(_text, _helpId, function (txt, helpId) {
					
                    inLineLabel.html(txt);
                    inLineLabel.attr("helpId",helpId) ;
                });

            });
        },
        word: function (widget, op) {



            var opt = jQuery.extend({
                "height": "100px",
                "width": "300px",
                "title": "word",
                "className": "sh word",
                "body": "sh word",
                "role": "word",
                "position": {
                    "left": "100px",
                    "top": "100px"
                }
            }, op);

            var _js = widget;
            var _obj = widget.element;
            var vOption = widget.options;

            var _item = $("<div class='w' ></div>").appendTo(_obj);
            if (opt.id == undefined) {
                _item.attr("id", _js.getId());
                //_item.uniqueId()$.Guid
            } else {
                _item.attr("id", opt.id);
            }

            _item.data('option', opt)
            .css('left', opt.position.left).css('top', opt.position.top)
            .css('height', opt.height)
            .css('width', opt.width)
            .addClass(opt.className)
            .attr("role", opt.role)
            .resizable({
                //handles: "e, w, n",
                stop: function (event, ui) {
                    _js.jsPlumbInit();
                }
            });

            //_item.mouseover(function (e) {
            //    _js.ItemBtn(true, $(this));
            //})
            //.mouseleave(function (e) {
            //    _js.ItemBtn(false, $(this));
            //});


            var inLineLabel, dragHandle;

            dragHandle = $("<div class='drag-handle' title='move bar'></div>").appendTo(_item);
            inLineLabelArea = $("<div class='word-body'></div>").appendTo(_item);

            if (opt.body === "") {
                opt.body = "plase edit";
            }

            inLineLabelArea.html(opt.body);


            $("<div class='ep'></div>").appendTo(_item);

            inLineLabelArea.dblclick(function (e) {
                _item.addClass("edit");
                inLineLabelArea.summernote({
                    focus: true,
                    toolbar: [
                        ['misc', ['close']],
                        ['fontsize', ['fontsize']],
                        ['color', ['color']],
                        ['style', ['bold', 'italic', 'underline']]
                    ]
                  , buttons: {
                      close: function (context) {
                          var ui = $.summernote.ui;
                          var button = ui.button({
                              contents: 'close',
                              click: function () {
                                  inLineLabelArea.summernote('destroy');
                                  _item.removeClass("edit");
                              }
                          });
                          return button.render();   // return button as jquery object 
                      }
                  }

                });
            });
            /* $("<textarea></textarea>").appendTo(_item);*/


            _js.jsPlumbInit();

            _item.draggable({
                handle: ".drag-handle",
                containment: "parent"
            });


        },
        memo: function (widget, op) {
            
            var opt = jQuery.extend({
                "height": "100px",
                "width": "100px",
                "title": "memo",
                "className": "sh memo",
                "role":"memo",
                "position": {
                    "left": "100px",
                    "top": "100px"
                }
            }, op);

            var _js = widget;
            var _obj = widget.element;
            var vOption = widget.options;

            var _item = $("<div class='w' ></div>").appendTo(_obj);
            if (opt.id == undefined) {
                _item.attr("id", _js.getId());
                //_item.uniqueId()$.Guid
            } else {
                _item.attr("id", opt.id);
            }

            _item.data('option', opt)
            .css('left', opt.position.left).css('top', opt.position.top)
            .css('height', opt.height)
            .css('width', opt.width)
            .addClass(opt.className)
            .attr("role", opt.role)
            .resizable({
                //handles: "e, w, n",
                stop: function (event, ui) {
                    _js.jsPlumbInit();
                }
            });



            var inLineLabel, dragHandle;

            dragHandle = $("<div class='drag-handle' title='move bar'></div>").appendTo(_item);
            inLineLabelArea = $("<textarea class='numTop left'></textarea>").appendTo(_item);

            if (opt.title === "") {
                opt.title = "plase edit";
            }

            inLineLabelArea.val(opt.body);


            $("<div class='ep'></div>").appendTo(_item);
       

            _js.jsPlumbInit();

            _item.draggable({
                handle: ".drag-handle",
                containment: "parent"
            });


        },
        form: function (widget, op) {

            op.height = "10px";

            var opt = jQuery.extend({
                "height": "10px",
                "width": "300px",
                "role": "form",
                "className": "sh form",
                "position": {
                    "left": 100,
                    "top": 100
                }
            }, op);

            var _js = widget;
            var _obj = widget.element;
            var vOption = widget.options;

            var
                _html = ''
    //    +'    <div class="modal-dialog">'
        + '        <div class="modal-content">'
        + '            <div class="modal-header">'
        + '                <span class="right glyphicon glyphicon-cog m-r-20" title="min-window"></span>'
        + '                <span class="right glyphicon glyphicon-unchecked" title="max window"></span>'
        + '                <span class="right glyphicon glyphicon-minus" title="min-window"></span>'
        + '                <h5 class="modal-title">MEMBER REGISTE</h5>'
        + '            </div>'
        + '            <div class="modal-body">'
        + '               <div class="form-group">'
        + '                  <label for="NAME">NAME</label>'
        + '                  <input type="text" class="form-control" id="NAME" placeholder="NAME">'
        + '                </div>'
        + '            </div>'
        + '        </div>'
            //    +'    </div>'


            var _item = $("<div class='w modal-dialog' ></div>").appendTo(_obj);

            if (opt.id == undefined) {
                _item.attr("id", _js.getId());
                //_item.uniqueId()$.Guid
            } else {
                _item.attr("id", opt.id);
            }

            _item.data('option', opt)
            .css('left', opt.position.left).css('top', opt.position.top)
            .css('height', opt.height)
            .css('width', opt.width)
            .addClass(opt.className)
            .attr("role", opt.role)
            .resizable({
                handles: "e",
                stop: function (event, ui) {
                    _js.jsPlumbInit();
                }
            });
            var inLineLabel, dragHandle;

            // dragHandle = $("<div class='drag-handle' title='move bar'></div>").appendTo(_item);

            $(_html).appendTo(_item);

            _item.find(".modal-header .glyphicon-minus").click(function (e) {
                _item.find(".modal-content .modal-body").toggle(false);
                _js.jsPlumbInit();
            });
            _item.find(".modal-header .glyphicon-unchecked").click(function (e) {
                _item.find(".modal-content .modal-body").toggle(true);
                _js.jsPlumbInit();
            });

            $("<div class='ep'></div>").appendTo(_item);


            _js.jsPlumbInit();

            _item.draggable({
                handle: ".modal-header",
                containment: "parent"
            });


        },
        page: function (widget, op) {

            op.height = "10px";
            op.width = "900px";

            var opt = jQuery.extend({
                "height": "800px",
                "width": "900px",
                "role": "page",
                "className": "sh page",
                "title": "페이지",
                "url": "/htmlviewer/24",
                "position": {
                    "left": 100,
                    "top": 100
                }
            }, op);

            var _js = widget;
            var _obj = widget.element;
            var vOption = widget.options;

            var _item = $("<div class='w' ></div>").appendTo(_obj);

            if (opt.id == undefined) {
                _item.attr("id", _js.getId());
                //_item.uniqueId()$.Guid
            } else {
                _item.attr("id", opt.id);
            }

            _item.data('option', opt)
            .css('left', opt.position.left).css('top', opt.position.top)
            .css('height', opt.height)
            .css('width', opt.width)
            .addClass(opt.className)
            .attr("role", opt.role)
            .resizable({
                // handles: "e",
                stop: function (event, ui) {
                    _js.jsPlumbInit();
                }
            });
            var
                _html = ''
                    + '<div class="panel panel-info">'
                    + '    <div class="panel-heading">'
                    + '        <span class="right glyphicon glyphicon-cog m-r-20" title="config"></span>'
                    + '        <span class="right glyphicon glyphicon-remove" title="remove window"></span>'
                    + '        <span class="right glyphicon glyphicon-unchecked" title="max window"></span>'
                    + '        <span class="right glyphicon glyphicon-minus" title="min-window"></span>'
                    + '        <h5 class="panel-title">' + opt.title + '</h5>'
                    + '    </div>'
                    + '    <div class="panel-body tab-pane">'
                    + '    </div>'
                    + '    <div class="panel-footer">'
                    + '       <div class="form-group">'
                    + '          <label>title</label>'
                    + '          <input type="text" class="form-control" data-field="NAME" placeholder="title">'
                    + '        </div>'
                    + '       <div class="form-group">'
                    + '          <label>menu url</label>'
                    + '          <input type="text" class="form-control" data-field="URL" placeholder="menu url...">'
                    + '        </div>'
                    + '        <button class="btn btn-primary" data-job="apply">apply</button>'
                    + '    </div>'
                    + '</div>'

            $(_html).appendTo(_item);
            $("<div class='ep'></div>").appendTo(_item);

            if (opt.url !== "") {
                _item.find(">.panel>.panel-body").load(opt.url);
            }
            _item.find('>.panel>.panel-footer [data-field="NAME"]').val(opt.title);
            _item.find('>.panel>.panel-footer [data-field="URL"]').val(opt.url);

            _item.find(">.panel>.panel-footer").toggle(false);


            _item.find(">.panel>.panel-heading .glyphicon-remove").click(function (e) {

                var
                    _itemId = _item.attr("id")
                ;
                _js.ItemRemove(_itemId);

            });
            _item.find(">.panel>.panel-heading .glyphicon-minus").click(function (e) {
                _item.find(">.panel>.panel-body").toggle(false);
                _js.jsPlumbInit();
            });
            _item.find(">.panel>.panel-heading .glyphicon-unchecked").click(function (e) {
                _item.find(">.panel>.panel-body").toggle(true);
                _js.jsPlumbInit();
            });
            _item.find(">.panel>.panel-heading .glyphicon-cog").click(function (e) {

                if ($(">.panel>.panel-body").css('display') === "none") {
                    /* hidden */
                    _item.find(">.panel>.panel-body").toggle(true);
                    _item.find(">.panel>.panel-footer").toggle(false);
                } else {
                    _item.find(">.panel>.panel-body").toggle(false);
                    _item.find(">.panel>.panel-footer").toggle(true);
                }
            });
            _item.find('>.panel>.panel-footer [data-job="apply"]').click(function (e) {
                var
                    _name = _item.find('>.panel>.panel-footer [data-field="NAME"]').val()
                    , _url = _item.find('>.panel>.panel-footer [data-field="URL"]').val()
                ;
                opt.title = _name;
                opt.url = _url;

                _item.find(".panel-title").text(opt.title);
                _item.find(">.panel>.panel-body").load(opt.url);
                _item.find(">.panel>.panel-body").toggle(true);
                _item.find(">.panel>.panel-footer").toggle(false);
            });

            _js.jsPlumbInit();

            _item.draggable({
                handle: ">.panel>.panel-heading",
                containment: "parent"
                , scroll: true
                , stack: ".w"
                , containment : "parent"
            });
          

            // form.find(".test").uniqueId().html(dochtml.getValue());



        },
        img: function (widget, op) {
            
            var opt = jQuery.extend({
                "height": "300px",
                "width": "250px",
                "title": "memo",
                "className": "sh img",
                "role": "img",
                "url": "/assets/images/team/team-1.jpg",
                "position": {
                    "left": "100px",
                    "top": "100px"
                }
            }, op);

            var _js = widget;
            var _obj = widget.element;
            var vOption = widget.options;

            var _item = $("<div class='w' ></div>").appendTo(_obj);
            if (opt.id == undefined) {
                _item.attr("id", _js.getId());
                //_item.uniqueId()$.Guid
            } else {
                _item.attr("id", opt.id);
            }

            _item.data('option', opt)
            .css('left', opt.position.left).css('top', opt.position.top)
            .css('height', opt.height)
            .css('width', opt.width)
            .addClass(opt.className)
            .attr("role", opt.role)
            .resizable({
                //handles: "e, w, n",
                stop: function (event, ui) {
                    _js.jsPlumbInit();
                }
            });



            var inLineLabel, dragHandle;

           // dragHandle = $("<div class='drag-handle' title='move bar'></div>").appendTo(_item);
            inLineLabelArea = $("<img class='numTop left' />").appendTo(_item);

            if (opt.title === "") {
                opt.title = "plase edit";
            }

            inLineLabelArea.attr("src", opt.url);


            $("<div class='ep'></div>").appendTo(_item);


            _js.jsPlumbInit();

            _item.draggable({
                handle: "img",
                containment: "parent"
            });


        },
        youtube: function (widget, op) {
            
            var opt = jQuery.extend({
                "height": "315px",
                "width": "420px",
                "title": "youtube",
                "className": "sh youtube",
                "role": "youtube",
                "url": "/assets/images/team/team-1.jpg",
                "position": {
                    "left": "100px",
                    "top": "100px"
                }
            }, op);

            var _js = widget;
            var _obj = widget.element;
            var vOption = widget.options;

            var _item = $("<div class='w' ></div>").appendTo(_obj);
            if (opt.id == undefined) {
                _item.attr("id", widget.getId());
                //_item.uniqueId()$.Guid
            } else {
                _item.attr("id", opt.id);
            }

            _item.data('option', opt)
            .css('left', opt.position.left).css('top', opt.position.top)
            .css('height', opt.height)
            .css('width', opt.width)
            .addClass(opt.className)
            .attr("role", opt.role)
           ;

           

            var inLineLabel, dragHandle;


            opt.url = opt.url.replace("watch?v=", "embed/");
            dragHandle = $("<div class='drag-handle' title='move bar'></div>").appendTo(_item);
            inLineLabelArea = $("<div><iframe width='420' height='315' src='" + opt.url + "' frameborder='0' allowfullscreen></iframe></div>").appendTo(_item);


            $("<div class='ep'></div>").appendTo(_item);

            _js.jsPlumbInit();

            _item.draggable({
                handle: ".drag-handle",
                containment: "parent"
            });

        },

        facebook: function (widget, op) {
            
            var opt = jQuery.extend({
                "height": "315px",
                "width": "420px",
                "title": "facebook",
                "className": "sh facebook",
                "role": "facebook",
                "url": "/assets/images/team/team-1.jpg",
                "position": {
                    "left": "100px",
                    "top": "100px"
                }
            }, op);

            var _js = widget;
            var _obj = widget.element;
            var vOption = widget.options;

            var _item = $("<div class='w' ></div>").appendTo(_obj);
            if (opt.id == undefined) {
                _item.attr("id", _js.getId());
                //_item.uniqueId()$.Guid
            } else {
                _item.attr("id", opt.id);
            }

            _item.data('option', opt)
            .css('left', opt.position.left).css('top', opt.position.top)
            .css('height', opt.height)
            .css('width', opt.width)
            .addClass(opt.className)
            .attr("role", opt.role)
             .resizable({
                 //handles: "e, w, n",
                 stop: function (event, ui) {
                     _js.jsPlumbInit();
                 }
             });
            ;



            var inLineLabel, dragHandle;

            opt.url = opt.url.replace("watch?v=", "embed/");
            dragHandle = $("<div class='drag-handle' title='move bar'></div>").appendTo(_item);
            inLineLabelArea = $("<div><iframe width='420' height='315' src='" + opt.url + "' frameborder='0' allowfullscreen></iframe></div>").appendTo(_item);

            $("<div class='ep'></div>").appendTo(_item);

            _js.jsPlumbInit();

            _item.draggable({
                handle: ".drag-handle",
                containment: "parent"
            });

        },


        file: function (widget, op) {
            
            var opt = jQuery.extend(true,{
                "height": "100px",
                "width": "100px",
                "title": "memo",
                "className": "sh file",
                "role": "file",
                "url": "/assets/images/team/team-1.jpg",
                "type": "etc",
                "position": {
                    "left": "100px",
                    "top": "100px"
                }
            }, op);

            opt.height = "80px"
            opt.width = "80px"

            var _js = widget;
            var _obj = widget.element;
            var vOption = widget.options;

            var _item = $('<div class="w" tabindex=0 ></div>').appendTo(_obj);
            if (opt.id == undefined) {
                _item.attr("id", _js.getId());
                //_item.uniqueId()$.Guid
            } else {
                _item.attr("id", opt.id);
            }
            
            var fileName = opt.url.replace(/^.*[\\\/]/, '');
            var typeIcon = JJ.config.file.boxIcon[op.type]
            _item.data('option', opt)
            .css('left', opt.position.left).css('top', opt.position.top)
            .css('height', opt.height)
            .css('width', opt.width)
            .addClass(opt.className)
            .attr("role", opt.role)
            .attr("title", fileName)
            .addClass("file-box-icon "+typeIcon)

            
            ;



            var inLineLabel, dragHandle;
            var fileName = opt.url.replace(/^.*[\\\/]/, '');
           // dragHandle = $("<div class='drag-handle' title='move bar'></div>").appendTo(_item);
          //  inLineLabelArea = $('<img src="/assets/images/files/1458923484_excel.png" />').appendTo(_item);
            inLineLabelArea = $('<a class="text-inline" href="' + opt.url + '">' + fileName + '</a>').appendTo(_item);



            $("<div class='ep'></div>").appendTo(_item);


            _js.jsPlumbInit();

            _item.draggable({
             
               // containment: "parent"
            });

         

        },

    },

    ItemBtn: function (mode, _obj) {
        var _js = this;

        if (mode) {
            var innerBtn = $("<span class='wInnerBtn'>&nbsp;</span>").appendTo(_obj)
                .position({ my: "right top", at: "right-3 top+1", of: _obj });

            innerBtn.mousedown(function (e) {
                var targetBoxId = $(this).parent().attr('id')
                _js.ItemRemove(targetBoxId);
                _js.jsPlumbInit();
                e.stopPropagation();
                e.preventDefault();
                return false;
            });
        } else {
            _obj.find(".wInnerBtn").remove();
        }
    },

    ItemRemove: function (itemId) {
        var _js = this;
        var _obj = this.element;
        var vOption = this.options;

        var itemObj = $('#' + itemId);
        var arConnect = _js.Diagram.getAllConnections();
        _js.Diagram.detachAllConnections(itemId);
        _js.Diagram.removeAllEndpoints(itemId);

        for (i = arConnect.length - 1; i >= 0; i--) {
            var v = arConnect[i];
            if (v.targetId == itemId || v.sourceId == itemId) {
                jsPlumb.detach(v);
            }
        }

        _js.Diagram.detach(itemObj);

        itemObj.remove();
    },

    clear: function () {
        var _js = this;
        var _obj = this.element;
        var vOption = this.options;


        _obj.find("._jsPlumb_overlay").remove();
        _obj.find("._jsPlumb_endpoint").remove();


        var arConnect = _js.Diagram.getAllConnections();
        for (i = arConnect.length - 1; i >= 0; i--) {
            var v = arConnect[i];
            jsPlumb.detach(v);
        }

        _obj.find(".w").each(function (i, v) {
            var itemObj = $(v);
            var itemId = itemObj.attr('id');
            _js.ItemRemove(itemId);

        });

        // _js.Diagram.reset();

        _js.Diagram = jsPlumb.getInstance({
            Endpoint: ["Dot", { radius: 0.5}],
            HoverPaintStyle: { strokeStyle: "#1e8151", lineWidth: 2 },
            ConnectionOverlays: [
              ["Arrow", {
                  location: 1,
                  id: "arrow",
                  length: 10,
                  foldback: 1
              }],
                    ["Label", { label: "", id: "label", cssClass: "aLabel"}]
            ],
            Container: _obj
        });

        _js.jsPlumbInit();


    },
    ItemDia: function (opt) {
        var _js = this;
        var _obj = this.element;
        var vOption = this.options;

        var _item = $("<div class='w' data-shape='Diamond' ></div>").appendTo(_obj)
        //.uniqueId()]
        .attr("id", $.Guid())
        .css('left', 150).css('top', 150)
        .css('height', "38px").css('width', "150px");
        $("<img src='http://www.jsplumb.org/demo/perimeterAnchors/diamond.png' /><a class='numTop'>Diamond</a><div class='ep'></div>").appendTo(_item)

        _js.jsPlumbInit();

    },

    linkAdd: function (opt) {
        var _js = this;
        var _obj = this.element;
        var vOption = this.options;
        var _connect =  _js.Diagram.connect({ source: opt.source, target: opt.target });
        if (opt.label) {
        	_connect.getOverlay("label").setVisible(true);
        	_connect.getOverlay("label").setLabel(opt.label);
        } else {
        	_connect.getOverlay("label").setVisible(false);
		}
        //_js.jsPlumbInit();

    },

    getValue: function () {
        var _js = this;
        var _obj = this.element;
        var vOption = this.options;

        var nodes = {
            node: {},
            link: {}
        }

        $.each(_obj.find(".w"), function (index, value) {
            var _o = {
                "id": $(value).attr('id'),
                "role": $(value).attr('role'),
                "title": $(value).find('a').html(),
                "helpId": $(value).find('a').attr("helpId"),
                "width": $(value).css('width'),
                "height": $(value).css('height'),
                "url" : "",
                "body": "",
                "className": $(value).data('option').className,
                "position": {
                    "left": $(value).css('left'), /* - _x, */
                    "top": $(value).css('top') /* - _y, */
                }
            };

            switch (_o.role) {
                case "memo":
                    _o.title = "memo"
                    _o.body = $(value).find('textarea').val();
                    break;
                case "word":
                    _o.title = "word"
                    //_o.body = $(value).find('.word-body').html();
                    _o.body = $(value).find('.word-body').html();
                    break;
                case "page":
                    _o.title = $(value).data().option.title;
                    _o.url = $(value).data().option.url;
                    break;
                case "youtube":
                    _o.title = $(value).data().option.title;
                    _o.url = $(value).data().option.url;
                    break;
                case "img":
                    _o.title = "img"
                    _o.url = $(value).find('img').attr("src");
                    break;
                case "file":
                    _o.title = $(value).data().option.title;
                    _o.url = $(value).data().option.url;
                    _o.type = $(value).data().option.type;
                    break;

            }

            nodes.node[_o.id] = _o;
        });

        var arConnect = _js.Diagram.getAllConnections();
        for (i = arConnect.length - 1; i >= 0; i--) {
            var value = arConnect[i];
            var _o = { "id": i + 1,
                "source": value.sourceId,
                "target": value.targetId,
                "label": ""
            }

            if (value.getOverlay("label")){
            	_o.label = value.getOverlay("label").label;
			}
			

            nodes.link[_o.id] = _o;
        }
        return nodes;
    },
    setValue: function (datas) {
        var _js = this;
        var _obj = this.element;
        var vOption = this.options;

        _js.clear();

        $.each(datas.node, function (i, v) {
            _js.ItemAdd(v);

        });


        $.each(datas.link, function (i, v) {
            _js.linkAdd(v);
            // 
            // alert(i);

        });


    },

    getId: function () {

        var _js = this;
        var _obj = this.element;
        var vOption = this.options;

        var
            id = 100
        ;

        _obj.find(".w").each(function (pI, pE) {
            var nowId = $(pE).attr('id') * 1;

            id = nowId > id ? nowId : id;
        });
        id++
        return id;

    },

    lineTitle: function (connect) {
        var _js = this;
        var _obj = this.element;
        var vOption = this.options;

                var _html = '<div class="modal fade" >';
                _html += '        <div class="modal-dialog" >';
                _html += '            <div class="modal-content">';
                _html += '                <div class="modal-header">';
                _html += '                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                _html += '                    <h4 class="modal-title" id="myModalLabel">change</h4>';
                _html += '                </div>';
                _html += '                <div class="modal-body">';
                _html += '                   <label class="formLabel control-label no-padding-right">change job description</label>';
                _html += '                   <div class="formData ">';
                _html += '                      <input type="text" datarole="text" class="form-control form-input" maxlength="20">';
                _html += '                    </div>';
                _html += '                </div>';
                _html += '                <div class="modal-footer">';
                _html += '                    <button type="button" class="btn btn-warning" data-role="Delete">Delete</button>';
                _html += '                    <button type="button" class="btn btn-default" data-role="Cancel" data-dismiss="modal">Cancel</button>';
                _html += '                    <button type="button" class="btn btn-primary" data-role="OK">OK</button>';
                _html += '                </div>';
                _html += '            </div>';
                _html += '        </div>';
                _html += '    </div>';

                var _di = $(_html);
                if (connect.getOverlay("label")) {
                	_di.find('input[type="text"]').val(connect.getOverlay("label").getLabel());
                }
                _di.find("button[data-role='OK']").click(function (e) {
                    var _txt = $('input', _di).val();

                    if (_txt !== "") {
                        $(_di).modal('hide');

                        //if (!connect.getOverlay("label")){
                        //	
                        //	connect.addOverlay(["label", { label: _txt, id: "label" }])
						//}

                        connect.getOverlay("label").setLabel(_txt);
                        connect.getOverlay("label").setVisible(true);
                        _di.find("button[data-role='Cancel']").trigger("click");
                        _js.change("connection label change");
                    } else {
                       // alert("입력자료가 없습니다.");
                    	//
                    	connect.getOverlay("label").setVisible(false);
                    	connect.getOverlay("label").setLabel("");

                    	//connect.removeOverlay("label");
                    	_js.change("connection label change");
                    	_di.find("button[data-role='Cancel']").trigger("click");
					}

                });
                _di.find("button[data-role='Delete']").click(function (e) {
                    _js.Diagram.detach(connect);
                    _di.find("button[data-role='Cancel']").trigger("click");
                    _js.change("connection delete");
                });

                $('input', _di).keyup(function (e) {
                    if (e.keyCode == 13) {
                        _di.find("button[data-role='OK']").trigger("click");
                    }
                });

                _di.on('shown.bs.modal', function (e) {
                    $('input', _di).focus();
                });
        

                _di.modal({
                    keyboard: false,
                    backdrop: "static"
                });

    },
    textBox: function (text, helpId, callback) {
        var _js = this;
        var _obj = this.element;
        var vOption = this.options;

        var _html = '<div class="modal fade" >';
        _html += '        <div class="modal-dialog" >';
        _html += '            <div class="modal-content">';
        _html += '                <div class="modal-header">';
        _html += '                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        _html += '                    <h4 class="modal-title" id="myModalLabel">change</h4>';
        _html += '                </div>';
        _html += '                <div class="modal-body">';
        _html += '                   <label class="formLabel control-label no-padding-right">name:</label>';
        _html += '                   <div class="formData ">';
        _html += '                      <input type="text" datarole="text" class="form-control form-input" maxlength="20">';
        _html += '                    </div>';
        _html += '                   <label class="formLabel control-label no-padding-right">도움말번호</label>';
        _html += '                   <div class="formData ">';
        _html += '                      <input type="text" datarole="helpId" class="form-control form-input" maxlength="20">';
        _html += '                    </div>';
        _html += '                </div>';
        _html += '                <div class="modal-footer">';
        _html += '                    <button type="button" class="btn btn-default" data-role="Cancel" data-dismiss="modal">Cancel</button>';
        _html += '                    <button type="button" class="btn btn-primary" data-role="OK">OK</button>';
        _html += '                </div>';
        _html += '            </div>';
        _html += '        </div>';
        _html += '    </div>';

        var _di = $(_html);

        _di.find('input[datarole="text"]').val(text);
        _di.find('input[datarole="helpId"]').val(helpId);

        _di.find("button[data-role='OK']").click(function (e) {
        	var _txt = $('input[datarole="text"]', _di).val();
        	var _helpId = $('input[datarole="helpId"]', _di).val();

            if (_txt !== "") {
                $(_di).modal('hide');
                callback(_txt, _helpId);
                _di.find("button[data-role='Cancel']").trigger("click");
                _js.change("connection label change");
            } else {
                alert("입력자료가 없습니다.");
            }

        });
        $('input', _di).keyup(function (e) {
            if (e.keyCode == 13) {
                _di.find("button[data-role='OK']").trigger("click");
            }
        });

        _di.on('shown.bs.modal', function (e) {
            $('input', _di).focus();
        });


        _di.modal({
            keyboard: false,
            backdrop: "static"
        });

    }


});


$.urlTypeRlt = function (url) {
	var rlt = {
		ty: '',
		ul: url
	}

	if (url.indexOf("youtube") > 5) {
		rlt.ty = 'youtube';
	} else if (url.indexOf("facebook") > 5) {
		rlt.ty = 'facebook';
	} else if (url.indexOf("gantterforgoogledrive") > 5) {
		rlt.ty = 'gantter';
	} else if (url.indexOf(".jpg") > 5) {
		rlt.ty = 'img';
	} else if (url.indexOf(".png") > 5) {
		rlt.ty = 'img';
	} else if (url.indexOf(".gif") > 5) {
		rlt.ty = 'img';
	} else if (url.indexOf("tistory.com/image/") > 5) {
		rlt.ty = 'img';
	} else if (url.indexOf("jongja.net") > 5) {
		rlt.ty = 'jongja';
	} else {
		rlt.ty = 'web';
	}


	return rlt;
};

$.urlExists = function (textval, callback) {
	var RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

	if (RegExp.test(textval)) {
		if (callback) { callback(true); } else { return true;}
	} else {
		if (callback) { callback(false); } else { return false;}
		
	}

	//            $.ajax({
	//                type: 'HEAD',
	//                url: url,
	//                success: function () {
	//                    callback(true);
	//                },
	//                error: function () {
	//                    callback(false);
	//                }
	//            });
};