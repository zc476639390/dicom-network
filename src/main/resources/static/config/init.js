document.title = eSetting.sysName;
var com = new WPACS.com();
var callbacks = new WPACS.callbacks();
$(document).ready(function () {
    var token = com.param("token");
    var studyId = com.param("studyId");
    $("body").data("studyId", studyId);
    var layout=eSetting.film.layout;
    layout.forEach(function (val,index) {
        $('.layout-select-box').append(template('layoutRadioTemp', {text:val.text,row_col:val.row_col} ));
    });
    $('.layout-select-box').find('input').first().prop("checked", true);
    if (device.mobile() || device.tablet()) {
        window.location = "viewer-tab.html?studyId=" + window.btoa(studyId) + "&token=" + window.btoa(token);      //移动端页面
        exit;
    }
    com.getJpgPrint(function (res) {
        res.data.forEach(function (study) {
            console.log( study)
            if(study.iconsDisplay&&study.iconsDisplay.length>0){

                $('.print-record').show();
                $('.print-record').click(function () {
                    var url="print-record.html?studyId=" + window.btoa(studyId) + "&token=" + window.btoa(token);      //排版打印页面
                    window.open(url,"print-record",'_blank');
                });
                return false;
            }
        })
    });


    var dicomPrint=com.param("dicomPrint");
    if(dicomPrint=='true'||dicomPrint==true){
        getModePage("print");
    }


});