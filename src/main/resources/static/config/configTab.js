 var prefix = window.location.protocol + '//' + window.location.host;
// var prefix='http://192.168.1.238';//本地测试
var sysName='医学影像诊断系统';//页面的title值，即系统名称
var engineConfig = {
    markerScale:400,
    magnifyScale:2,//胶片打印放大倍数 默认2  可根据设备清晰度配置
    msgServer: 'ws://localhost:8285',
    serverIp: prefix+'/api/',//服务器IP
    vrServer: 'ws://localhost:8286',//三维服务socket地址
    printServer: 'ws://localhost:8181',//本地打印服务
    loadCountTH: 50,//手机端加载数据设置加载阈值
    framesPerSecond:2,//移动端默认播放速度，不支持调节速度
    loadThreshold:6,//pc  加载时允许最大异步阈值
    defaultEncodeWay:'GB18030'//'GB18030' ; 'ISO_IR 100' ;  'ISO_IR 192';'ISO 10646-1';encodeWay=='ISO 10646-2'//默认编码设置

};