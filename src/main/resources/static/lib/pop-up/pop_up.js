

function pop_up(opts) {
    var _opts = $.extend({}, {type:'tips',title: '提示', message: '', ok: function(){},yesName:"确定",noName:"取消",autoClose:false,delay:0}, opts || {});
    var overlay = $('.overlay_pop');
    var body = $('body');
    if (overlay.length == 0) {
        overlay = $('<div class="overlay_pop"></div>');
        body.append(overlay);
    } else {
        overlay.show();
    }
    var confirm = $('.wmf-confirm');
    if (confirm.length == 0) {
        confirm = $('<div class="wmf-confirm"></div>');
        renderAlert();
        body.append(confirm);
    } else {
        confirm.empty();
        renderAlert();
        confirm.show();
    }

    function renderAlert() {
        var color='black';
        if(_opts.type=='warning')
            color='orange';
        else if(_opts.type=='error')
            color='red';

        var title = $('<div class="wmf-confirm-title">' + _opts.title + '</div>');
        var x=$('<span class="x">x</span>');
        title.append(x);
        var msg = $('<div class="wmf-confirm-message" style="color: '+color+';">' + _opts.message + '</div>');
        var btns = $('<div class="wmf-confirm-btns"></div>');
        var ok = $('<a href="javascript:void(0)" class="m_btn black">' + _opts.yesName + '</a>');
        var cancel = $('<a href="javascript:void(0)" class="m_btn white">' + _opts.noName + '</a>');
        btns.append(ok, cancel);
        confirm.append(title, msg);
        confirm.append(btns);
        ok.bind('click', function(){
            close();
            _opts.ok();
        });
        cancel.bind('click', function(){
            close();
        });
        x.bind('click', function() {
            close();
        });
        if(_opts.autoClose){
            setTimeout(function () {
                close();
            },_opts.delay);
        }
    }

    function close() {
        confirm.empty().hide();
        overlay.hide();
    }
}

function loadHide(){
    $('#load_overly').hide();
}
function loadShow(){
    $('#load_overly').show();
}

