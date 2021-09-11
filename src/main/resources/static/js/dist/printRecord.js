//Service socket
var socketPrinter;//胶片打印的socket
var socketVR;//VR的socket
var socketMsg;//用于发送消息和命令的socket


/**
 * socket 连接错误提示
 * 胶片打印服务的错误提示
 * */
function socketConnectionTips(errorType) {
    switch (errorType) {
        case -1:
            pop_up({
                type: "error",
                title: "打印服务连接提示",
                message: "tips1:浏览器不支持服务，推荐使用谷歌浏览器，\r\t360极速浏览器（极速模式），搜狗浏览器（极速模式）!",
                yesName: "确定",
                noName: "取消"
            });

            if (window.stop)
                window.stop();
            else
                document.execCommand("Stop");
            break;
        case 3:

            pop_up({
                type: "error",
                title: "打印服务连接提示",
                message: "tips2:下载服务连接失败,请检查服务是否正确安装并打开。\r\t如未安装服务请先安装该服务再进入胶片打印页面。\r\t下载该服务请点击确定按钮！",
                ok: downloadPrintServe,
                yesName: "确定",
                noName: "取消"
            });
            if (window.stop)
                window.stop();
            else
                document.execCommand("Stop");
            break;
        case 2:

            pop_up({
                title: "打印服务连接提示",
                message: "tips3:下载服务连接失败,请检查服务是否正确安装并打开。\r\t如未安装服务请先安装该服务再进入胶片打印页面。\r\t下载该服务请点击确定按钮！",
                ok: downloadPrintServe,
                yesName: "确定",
                noName: "取消"
            });

            if (window.stop)
                window.stop();
            else
                document.execCommand("Stop");
            break;
        case 1:

            break;
        default:
            window.confirm("default");

            break;
    }


}


/**
 * 打印jpg图像
 * printObj 打印对象；
 * type 图像信息的生成方式  前端、后台
 * @data 胶片数据
 * */
function jpegPrint(data) {
    var studyId = GetUrlParam("studyId");
    new AjaxRequest({
        type: "get",
        url: "dicom/getByStudyId",
        param: {
            opt: 'detail',
            studyId: studyId//jpg
        },
        desc: '详情',
        isShowLoader: true,
        dataType: "",
        callBack: function (res) {
            if (res.status == 200) {
                var idPrefix = "printArea";
                $("iframe#" + idPrefix).remove();//移除之前创建的临时元素
                var iframeId = idPrefix;
                var iframeStyle = 'position:absolute;width:100%;height:100%;left:-10000px;top:-10000px;';
                var iframe = document.createElement('IFRAME');
                $(iframe).attr({
                    style: iframeStyle,
                    id: iframeId
                });
                document.body.appendChild(iframe);
                var jpgInfo = $("body").data("print");
                var showState = jpgInfo.isShow;
                var header = jpgInfo.header;
                var addr = jpgInfo.addr;
                var tele = jpgInfo.tele;
                var logoPath = jpgInfo.logoPath;
                var name = res.data[0].name;
                var age = res.data[0].ageView;
                var gender = res.data[0].gender;
                var outpatientNum = res.data[0].outpatientNum;
                var admissionNum = res.data[0].admissionNum;

                var doc = iframe.contentWindow.document;
                doc.write('<link type="text/css" rel="stylesheet" href="../css/printfilm/film.css?v=1.2" >');
                if (showState) {

                    //循环将图像添加到打印元素中
                    for (var i = 0, len = data.length; i < len; i++) {
                        var paperSet = '_' + data[i].paperType + '_' + data[i].paperDirect;


                        doc.write(template('jpgPrintTemp', {
                            paperSet: paperSet,
                            logoPath: logoPath,
                            hosName: header,
                            imgData: data[i].img,
                            addr: addr,
                            tele: tele,
                            showState: showState,
                            age: age,
                            name: name,
                            gender: gender,
                            labelNumber: admissionNum ? admissionNum : outpatientNum ? outpatientNum : '--'
                        }))


                    }
                } else {
                    //循环将图像添加到打印元素中
                    for (var i = 0, len = data.length; i < len; i++) {
                        var paperSet = '_' + data[i].paperType + '_' + data[i].paperDirect;
                        doc.write('<div class="film ' + paperSet + '"  style="margin:0;padding:0;border: none;">' +

                            '<img class="filmImg"   src=' + data[i].img + '   style="width:100%;height:100%;margin:0;padding:0; ">' +

                            '</div>');
                    }

                }


                doc.close();

                //获取打印对象并打印
                var frameWindow = iframe.contentWindow;
                frameWindow.close();
                frameWindow.focus();
                setTimeout(function () {
                    frameWindow.print();//调用打印接口
                }, 800);
            } else {

                pop_up({type: "error", title: "提示", message: res.msg, yesName: "确定", noName: "取消"});
            }
        }
    });

}


/**
 * Created by SongJing on 2019/5/13.
 * Version: 图像浏览器 4.0
 * Description: 连接本地dcm打印服务
 * @selecter 打印机连接状态显示文本节点
 */
function connectPrintServer(selecter) {
    if (!socketPrinter || socketPrinter.readyState != 1) {
        var socketState = 0;
        if ("WebSocket" in window) {
            try {
                socketPrinter = new WebSocket(eSetting.addrIni.printServer);
                socketPrinter.onopen = function () {
                    if (socketPrinter.readyState == 1) {
                        selecter.text("已连接");
                    }
                };
                socketPrinter.onmessage = function (evt) {
                    console.log("我发消息了-------------", evt);
                };
                socketPrinter.onclose = function (e) {
                    console.log("我关闭了-------------", e);
                };
                socketPrinter.error = function (e) {
                    console.log("我出错了-------------", e);
                };
            } catch (e) {
                socketState = 3;
                console.log(e);
            }
        } else {
            //浏览器不支持
            socketState = -1;
        }
        if (socketPrinter) {
            socketState = 2;
        }
        setTimeout(function () {
            if (socketPrinter.readyState != 1) {
                socketConnectionTips(socketState);
                selecter.text("连接失败");
            }
        }, 3000);
    }
}


/**
 * 本地socket 发送数据
 * 发送胶片打印数据
 * */
function sendDataPrint(data, params) {


    var serviceType = "print";
    var printSetStr = "serviceType:" + serviceType + "#orientation:" + params.paperDirect + "#filmSize:" + params.paperType + "#copys:" + 1 + "#IP:" + params.ip + "#port:" + params.port + "#AET:" + params.aet +
        "#localAET:" + params.aetLocal +
        "#filmObj:" + params.position + "#filmType:" + params.type + "#quality:" + params.priority + "#grayEnable:" + params.color + "#magnifyType:" + params.magnifyType;
    console.log("本地dcm打印发送参数：" + printSetStr, params);

    if (!socketPrinter) {
        pop_up({
            type: "warning",
            title: "打印服务连接提示",
            message: "tips4:创建链接失败，请下载打印服务!\r\t下载该服务请点击确定按钮！",
            ok: downloadPrintServe,//下载打印服务
            yesName: "确定",
            noName: "取消"
        });
        return;
    }
    if (socketPrinter.readyState != 1) {
        connectPrintServer($('.printer-state'));
        setTimeout(function () {
            if (socketPrinter.readyState != 1) {
                pop_up({
                    type: "warning",
                    title: "打印服务连接提示",
                    message: "tips5:链接服务失败，请检查打印服务是否开启!",
                    yesName: "确定",
                    noName: "取消"
                });
            } else {
                socketPrinter.send(printSetStr);
                socketPrinter.send(convertImgDataToBlob(data));
                console.log("成功发送打印数据", printSetStr);
            }
        }, 1000)
    } else {

        socketPrinter.send(printSetStr);
        socketPrinter.send(convertImgDataToBlob(data));
        console.log("成功发送打印数据", socketPrinter);


    }
}

var convertImgDataToBlob = function (base64Data) {
    var format = "image/jpeg";
    var base64 = base64Data;
    var code = window.atob(base64.split(",")[1]);
    var aBuffer = new window.ArrayBuffer(code.length);
    var uBuffer = new window.Uint8Array(aBuffer);
    for (var i = 0; i < code.length; i++) {
        uBuffer[i] = code.charCodeAt(i) & 0xff;
    }
    var blob = null;
    try {
        blob = new Blob([uBuffer], {type: format});
    } catch (e) {
        window.BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;
        if (e.name == 'TypeError' && window.BlobBuilder) {
            var bb = new window.BlobBuilder();
            bb.append(uBuffer.buffer);
            blob = bb.getBlob("image/jpeg");

        } else if (e.name == "InvalidStateError") {
            blob = new Blob([aBuffer], {type: format});
        } else {

        }
    }
    return blob;

};


/***
 * 时间格式转换
 * */
function timeChange(time) {
    var date = time.substr(0, 10); //年月日
    var hours = time.substring(11, 13);
    var minutes = time.substring(14, 16);
    var seconds = time.substring(17, 19);
    var timeFlag = date + ' ' + hours + ':' + minutes + ':' + seconds;
    timeFlag = timeFlag.replace(/-/g, "/");
    timeFlag = new Date(timeFlag);
    timeFlag = new Date(timeFlag.getTime() + 8 * 3600 * 1000);
    timeFlag = timeFlag.getFullYear() + '-' + ((timeFlag.getMonth() + 1) < 10 ? "0" + (timeFlag.getMonth() + 1) : (timeFlag.getMonth() + 1)) + '-' + (timeFlag.getDate() < 10 ? "0" + timeFlag.getDate() : timeFlag.getDate()) + ' ' + timeFlag.getHours() + ':' + timeFlag.getMinutes() + ':' + (timeFlag.getSeconds() < 10 ? "0" + timeFlag.getSeconds() : timeFlag.getSeconds());
    return timeFlag;
};


/**
 * Created by SongJing on 2019/1/2.
 * Version: 图像浏览器 4.0
 * Description:设置Cookie相关操作
 */
/**
 * 获取cookie内容
 * */
function getCookie(name) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0] == name) {
            addCookie(name, arr[1], 24 * 30);//获取到cookie，再保存一次
            return arr[1];
        }
    }
    return "";
}

/**
 * 添加cookie
 * */
function addCookie(name, value, expiresHours) {
    // var cookieString = name + "=" + escape(value);
    var cookieString = name + "=" + value;
    if (expiresHours > 0) {
        var date = new Date();
        date.setTime(date.getTime + expiresHours * 3600 * 1000);
        cookieString = cookieString + "; expires=" + date.toDateString() + ";path=/;";
    }
    document.cookie = cookieString;

}

/**
 * 删除cookie
 * */
function deleteCookie(name) {
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    // document.cookie = name + "=; expires=" + date.toDateString()+";path=/;";
    document.cookie = name + '=;  expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}


/***
 *  下载打印服务
 * */
function downloadPrintServe() {
    var triggerDownload = $("<a>").attr("href", "../serviceFiles/printService.zip").attr("download", "PrintService.zip").appendTo("body");
    triggerDownload[0].click();
    triggerDownload.remove();
}

/**
 * 获取指定Url参数的方法
 * */
function GetUrlParam(paraName) {
    var url = document.location.toString();
    var arrObj = url.split("?");

    if (arrObj.length > 1) {
        var arrPara = arrObj[1].split("&");
        var arr;

        for (var i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");

            if (arr != null && arr[0] == paraName) {
                var paraVal = arr[1];
                if (paraName == 'token' || paraName == 'studyId')
                    paraVal = window.atob(arr[1]);
                return paraVal;
            }
        }
        return null;
    } else {
        return null;
    }
}

$(function () {


    $(document).ready(function () {


        (function () {
            function AjaxRequest(opts) {
                this.type = opts.type || "get";
                // this.url = 'http://192.168.1.44:8081/' + opts.url;
                this.url = prefix+':/api/' + opts.url;//代理环境
                // this.url=eSetting.addrIni.serverIp+opts.url;
                // this.url = 'http://127.0.0.1:8084/api/' + opts.url;//代理环境

                // console.log("接口地址",engineConfig.serverIp,opts.url, this.url);

                this.param = opts.param || {};
                this.isShowLoader = opts.isShowLoader || false;
                this.dataType = opts.dataType || "json";
                this.callBack = opts.callBack;
                this.errorBack = opts.errorBack;
                this.init();
            }

            AjaxRequest.prototype = {
                //初始化
                init: function () {
                    this.sendRequest();
                },
                //渲染loader
                showLoader: function () {
                    if (this.isShowLoader) {
                        var loader = '<div class="ajaxLoader"><div class="loader">加载中...</div></div>';
                        $("body").append(loader);
                    }
                },
                //隐藏loader
                hideLoader: function () {
                    if (this.isShowLoader) {
                        $(".ajaxLoader").remove();
                    }
                },
                //发送请求
                sendRequest: function () {
                    var self = this;
                    $.ajax({
                        type: this.type,
                        url: this.url,
                        data: this.param,
                        dataType: this.dataType,
                        beforeSend: function (request) {
                            self.showLoader();
                            // var tokenName = "Admin-Token";
                            // var token = getCookie(tokenName);
                            // console.log("Admin-Token:", token);
                            var token = GetUrlParam("token");
                            request.setRequestHeader("accessToken", token);
                            request.setRequestHeader("Content-Type", 'application/json;charset=UTF-8');
                        },
                        success: function (res) {
                            // console.log(res);
                            self.hideLoader();
                            if (res != null && res != "") {
                                if (res.status == 200 && self.callBack) {
                                    if (Object.prototype.toString.call(self.callBack) === "[object Function]") {                                                     //Object.prototype.toString.call方法--精确判断对象的类型
                                        self.callBack(res);
                                    } else {
                                        console.log("callBack is not a function");
                                    }
                                } else {

                                    if (self.errorBack) {

                                        self.errorBack(res);
                                    } else {
                                        pop_up({title: "error提示", message: res.msg, yesName: "确定", noName: "取消"});
                                    }
                                }
                            }
                        },
                        error: function (res) {
                            console.log("error", res);
                        }
                    });
                }
            };
            window.AjaxRequest = AjaxRequest;
        })();


        var studyId = GetUrlParam("studyId");
        new AjaxRequest({
            type: "get",
            url: "print/getJpgPrint",
            desc: '获取检查',
            param: {
                studyIds: studyId//jpg
            },
            isShowLoader: true,
            dataType: "",
            callBack: function (res) {
                $(".container").append(template('studyListTemp', {
                    studyArr: res.data,
                    prefix: prefix,
                    timeChange: timeChange
                }));
            }
        });


        new AjaxRequest({
            type: "get",
            url: "printerSet/getPrinter",
            desc: '打印机设置',
            param: {},
            isShowLoader: true,
            dataType: "",
            callBack: function (res) {

                var cookieName = "printerName";
                var cookieValue = getCookie(cookieName);
                $('.printer-select').empty();
                res.data.forEach(function (printer) {
                    var opt = $("<option>" + printer.name + "</option>");
                    opt.data('detail', printer);

                    if (cookieValue == printer.name) {
                        opt.attr('selected', true);
                    }
                    $('.printer-select').append(opt);
                });
                var opt = $("<option>localPrinter</option>");
                var localPrinter = {
                    aet: "localPrinter",
                    aetLocal: "localPrinter",
                    color: "localPrinter",
                    hosCode: "localPrinter",
                    id: "localPrinter",
                    ip: "localPrinter",
                    magnifyType: "localPrinter",
                    name: "localPrinter",
                    port: "localPrinter",
                    position: "localPrinter",
                    printerType: "localPrinter",
                    priority: "localPrinter",
                    type: "localPrinter",
                };
                opt.data('detail', localPrinter);
                if (cookieValue == 'localPrinter') {
                    opt.attr('selected', true);
                }
                $('.printer-select').append(opt);

            }
        });

    });

    /**
     * 打印机切换
     * */
    $('.printer-select').bind('change', function () {
        //    cookie 保存选择
        var cookieName = "printerName";
        var cookieValue = $('.printer-select').val();
        addCookie(cookieName, cookieValue, 24 * 30);
    });


    /**
     * 图像选中
     * */
    $(document).on('click', '.single-check', function () {
        var value = $(this).is(":checked");
        if (value) {
            $(this).parents('.film-box').addClass('film-box-check');
        } else {
            $(this).parents('.film-box').removeClass('film-box-check');
            $(this).parents('.study-box').find('.study-check').prop("checked", value);
        }

        $('.page-total').text($('.film-box-check').length);
    });
    /**
     * 检查全选
     * */
    $(document).on('click', '.study-check', function () {
        var value = $(this).is(":checked");
        if (value) {
            $(this).parents('.study-box').find('.film-box').addClass('film-box-check');
        } else {
            $(this).parents('.study-box').find('.film-box').removeClass('film-box-check');
        }
        $(this).parents('.study-box').find('.single-check').prop("checked", value);
        $('.page-total').text($('.film-box-check').length);
    });
    /**
     * 图像显隐
     * */
    $(document).on('click', '.display-radio', function () {
        var select = $(this).data('select');
        if (select === 'film-box-check') {
            $('.film-box').hide();
        }
        $('.' + select).show();
    });
    /**
     * 折叠检查
     * */
    $(document).on('click', '.study-fold', function () {
        var value = $(this).is(":checked");
        if (value) {
            $(this).parents('.study-box').find('.films-box').addClass('films-box-min');
        } else {
            $(this).parents('.study-box').find('.films-box').removeClass('films-box-min');
        }
    });

    /**
     * 隐藏放大查看框
     * */
    $(document).on('click', '.close', function () {
        $('.magnify-box').hide();
    });
    /**
     *双击查看详情与大图
     * */
    $(document).on('dblclick', '.film', function () {
        var imgUrl = $(this).find('img').attr("src");
        $('.magnify-img').attr('src', imgUrl);
        var detail = $(this).parents('.film-box').data('detail');

        var info = {
            timeChange: timeChange,
            gender: $(this).parents('.study-box').data('gender'),
            pointName: $(this).parents('.study-box').data('pointname'),
            name: $(this).parents('.study-box').data('name'),
            deptName: $(this).parents('.study-box').data('deptname'),
            num: $(this).parents('.study-box').data('num'),
            ageView: $(this).parents('.study-box').data('ageview'),
            detail: detail
        };
        $('.magnify-box').find('.info-box').empty();
        $('.magnify-box').find('.info-box').append(template('infoTemp', info));
        $('.magnify-box').show();
    });
    /**
     * 双击隐藏
     * */
    $(document).on('dblclick', '.magnify-box', function () {
        $('.magnify-box').hide();
    });
    /**
     * 确认打印信息
     * */
    $(document).on('click', '#printSure', function () {

        if(parseInt($('.page-total').text())==0){
            pop_up({
                title: "打印提示", message: "当前没有选中任何排版数据！",
                yesName: "确定",
                noName: "取消",
                autoClose: true,
                delay: 5000
            });
            return false;
        }
        var films = [];
        $('.film-box-check').each(function () {
            films.push($(this).data('detail'));
        });
        var printer = $(".printer-select option:selected").data('detail'); //获取选中的项

        if(printer.name=='localPrinter'){
            print(printer);
        }else{
            var printerState = '未连接';
            if (socketPrinter != undefined) {
                printerState = socketPrinter.readyState == 1 ? '已连接' : '未连接';
            }
            var data = {
                films: films,
                printer: printer.name,
                printerState: printerState,
                totalPage: $('.film-box-check').length,
            };

            if(printer.name==''){

            }else{
                $('.verify-box').show();
                $('.verify-box').find('.info-box').empty();
                $('.verify-box').find('.info-box').append(template('printerVerifyTemp', data));

                $('.print-verify').data("films", films);
                $('.print-verify').data("printer", printer);
                if (printerState == '未连接') {
                    connectPrintServer($('.printer-state'));
                }
            }
        }


    });
    /**
     * 重连打印机
     * */
    $(document).on('click', '.item-retry', function () {
        connectPrintServer($('.printer-state'));
    });
    /**
     * 刷新打印机连接状态
     * */
    $(document).on('click', '.item-update', function () {
        var printerState = "未连接";
        if (socketPrinter.readyState == 1) {
            printerState = "已连接";
        } else if (socketPrinter.readyState == 1) {
            printerState = "未连接";
        }
        $('.printer-state').text(printerState);
    });

    /**
     * 确认打印
     * */
    $(document).on('click', '#printVerify', function () {
        var printer = $('.print-verify').data("printer");
        print(printer);

        /*  var canvas = document.getElementById("draw-temp");
          var filmDatas = [];
          // 发送到打印机
          $('.film-box-check').each(function () {
              var detail = $(this).data('detail');
              var img = $(this).find('img')[0];
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              var ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              if (printer.name == 'localPrinter') {
                  filmDatas.push({
                      img: canvas.toDataURL("image/jpeg"),
                      paperType: detail.paperSize,
                      paperDirect: detail.printDirection == 'PORTRAIT' ? 1 : 0
                  });
              } else {
                  var data = {paperType: detail.paperSize, paperDirect: detail.printDirection, ...printer};
                  sendDataPrint(canvas.toDataURL("image/jpeg"), data);
              }
          });
          // jpg打印
          if (filmDatas.length > 0) {
              jpegPrint(filmDatas)
          }*/

    });


    function print(printer) {
        var filmDatas = [];
        var canvas = document.getElementById("draw-temp");
        // 发送到打印机
        $('.film-box-check').each(function () {
            var detail = $(this).data('detail');
            var img = $(this).find('img')[0];
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            if (printer.name == 'localPrinter') {
                filmDatas.push({
                    img: canvas.toDataURL("image/jpeg"),
                    paperType: detail.paperSize,
                    paperDirect: detail.printDirection == 'PORTRAIT' ? 1 : 0
                });
            } else {
                var data = {paperType: detail.paperSize, paperDirect: detail.printDirection, ...printer};
                sendDataPrint(canvas.toDataURL("image/jpeg"), data);
            }
        });
        // jpg打印
        if (filmDatas.length > 0) {
            jpegPrint(filmDatas)
        }
    }

});
