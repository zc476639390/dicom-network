/**
 * Created by ss on 2019/5/6.
 * Version: 图像浏览器 4.0
 * Description:
 */


/**
 * IP配置
 * */
// var prefix='http://192.168.1.238';//本地测试
var prefix = window.location.protocol + '//' + window.location.host;
var eSetting={
    date: new Date(),
    version: "4.1.0",//版本号
    sysName: '医学影像诊断系统',//页面的title值，即系统名称
    defaultEncodeWay: 'GB18030',//dicom默认编码 'GB18030' ; 'ISO_IR 100' ;  'ISO_IR 192';'ISO 10646-1';encodeWay=='ISO 10646-2'
    addrIni: {
        serverIp: prefix + '/api/',//服务器IP
        vrServer: 'ws://localhost:8286',//三维服务socket地址
        printServer: 'ws://localhost:8181',//胶片打印本地服务
        msgServer: 'ws://localhost:8285',//用于与本地服务握手的消息商品（好像兼容超声）
    },
    load: {
        syncTH: 1,//加载同步线程数
        asyncTH: 6//加载异步线程数
    },
    tool: {
        play: {
            framesPerSecond: 2//移动端默认播放速度，不支持调节速度
        },
        markers: {
            scale: 400,
            isShowAllMarkers: true,//是否显示所有方向标识
            drawMarkers: true,//默认显示方向标识  左上
            drawAllMarkers: true//默认显示方向标识  右下
        },
        clipping: {
            magnifySize: 3.0//裁剪放大倍数
        },
        overlay:{
            color:'#e4ad00'//标识的显示颜色
        }
    },
    //胶片设置
    film: {
        //默认胶片设置
        default: {
            type: '8INX10IN',
            direct: '1',
            row: 1,
            col: 1,
            exitPrint: true,//打印后是否退出打印界面
            font: 'pictos',//'宋体','pictos'
        },

        magnifyScale:2,//绘制胶片以几倍绘制，默认2倍
        //本地jpg打印信息设置
        jpgInfo: {
            header: "成都影达科技有限公司",
            addr: "地址:天府软件园B3-319",
            tele: "联系电话:12345678900",
            logoPath: "../img/hoslogo/hoslogo.png",//院徽图像地址
            isShow: true//是否在打印时显示添加信息
        },
        fontMode:'scale',//'scale' 基于fontBase 计算等比例下的字号大小;'const' 使用fontSize配置字号
        fontBase:26,
        //胶片字号设置(默认小字号)
        fontSize: {
            _min: 10,
            _300: 12,
            _305: 14,
            _507: 18,
            _709: 22,
            _910: 24,
            _101: 28,
            _max: 34
        },
        //备用大字号
        /*   fontSize: {
               _min: 18,
               _300: 20,
               _305: 24,
               _507: 26,
               _709: 28,
               _910: 30,
               _101: 32,
               _max: 36
           },*/
        //常用胶片布局设置
      // 先行后列
      layout: [

            // {text:"1(1*1)",row_col:"1*1"},
            // {text:"2(2*1)",row_col:"2*1"},
            // {text:"2(1*2)",row_col:"1*2"},
            // {text:"4(2*2)",row_col:"2*2"},
            {text: "6(2*3)", row_col: "2*3"},
            {text: "9(3*3)", row_col: "3*3"},
            {text: "12(3*4)", row_col: "3*4"},
            {text: "16(4*4)", row_col: "4*4"},
            {text: "20(4*5)", row_col: "4*5"},
            {text: "24(4*6)", row_col: "4*6"},
            {text: "25(5*5)", row_col: "5*5"},
            {text: "30(5*6)", row_col: "5*6"},
            {text: "35(5*7)", row_col: "5*7"},
            {text: "36(6*6)", row_col: "6*6"},
            {text: "42(6*7)", row_col: "6*7"},
            {text: "48(6*8)", row_col: "6*8"},
            {text: "49(7*7)", row_col: "7*7"},
            {text: "56(7*8)", row_col: "7*8"},
            {text: "63(7*9)", row_col: "7*9"},
            {text: "64(8*8)", row_col: "8*8"},
            {text: "81(9*9)", row_col: "9*9"},
            {text: "100(10*10)", row_col: "10*10"},
            {text: "110(10*11)", row_col: "10*11"},
        ]

        //// 先列后行
      /*  layout: [

            // {text:"1(1*1)",row_col:"1*1"},
            // {text:"2(2*1)",row_col:"1*2"},
            // {text:"2(1*2)",row_col:"2*1"},
            // {text:"4(2*2)",row_col:"2*2"},
            {text: "6(2*3)", row_col: "3*2"},
            {text: "9(3*3)", row_col: "3*3"},
            {text: "12(3*4)", row_col: "4*3"},
            {text: "16(4*4)", row_col: "4*4"},
            {text: "20(4*5)", row_col: "5*4"},
            {text: "24(4*6)", row_col: "6*4"},
            {text: "25(5*5)", row_col: "5*5"},
            {text: "30(5*6)", row_col: "6*5"},
            {text: "35(5*7)", row_col: "7*5"},
            {text: "36(6*6)", row_col: "6*6"},
            {text: "42(6*7)", row_col: "7*6"},
            {text: "48(6*8)", row_col: "8*6"},
            {text: "49(7*7)", row_col: "7*7"},
            {text: "56(7*8)", row_col: "8*7"},
            {text: "63(7*9)", row_col: "9*7"},
            {text: "64(8*8)", row_col: "8*8"},
            {text: "81(9*9)", row_col: "9*9"},
            {text: "100(10*10)", row_col: "10*10"},
            {text: "110(10*11)", row_col: "11*10"},
        ]*/
    },
    //排版打印测试
    printRecord:{
        exit:false
    },
    //dcm下载配置
    download:{
        shield:true,
        replaceCharCode:42,
        data:[
            'x00100010',//patientName
            'x00081010',//stationName
            'x00080080',//institutionName
            'x00080081',//institutionAddress
        ]//标签值
    }
};
$(document).ready(function () {
    $("body").data("config", eSetting);
    $("body").data("print", eSetting.film.jpgInfo);
});
