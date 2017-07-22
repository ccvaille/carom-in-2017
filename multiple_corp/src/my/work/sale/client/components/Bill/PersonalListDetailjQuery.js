export default function showDetail(data) {

(function($) {
  return jQuery(function() {
    "use strict";

    $.fn.autoHide = function(callback) {
      var $ele = $(this);
      $(document).on('mousedown', function (e) {
        if ($ele.is(':visible') && (!e.target.isEqualNode($ele[0]) && $ele.has(e.target).length === 0)) {
          $ele.hide();
          callback && callback()
        }
      });
      return this;
    }

    var ROOT_URL = 'https://my.workec.com/crm/sale/';
    var SALEID = '';
    var AJAXING = false;

    var CURRENCY = {"currency":[{"value":'NONE',"text":"请选择"},{"value":1,"text":"人民币(CNY)"},{"value":2,"text":"港币(HKD)"},{"value":3,"text":"澳门元(MOP)"},{"value":4,"text":"台币(TWD)"},{"value":5,"text":"日元(JPY)"},{"value":6,"text":"美元(USD)"},{"value":7,"text":"英镑(GBP)"},{"value":8,"text":"欧元(EUR)"},{"value":9,"text":"泰铢(THP)"},{"value":10,"text":"越南盾(VND)"},{"value":11,"text":"韩国元(KRW)"},{"value":12,"text":"新加坡元(SGD)"},{"value":13,"text":"加拿大元(CAD)"},{"value":14,"text":"法国法郎(FRF)"},{"value":15,"text":"澳大利亚元(AUD)"},{"value":16,"text":"俄罗斯卢布(SUR)"},{"value":17,"text":"瑞士法郎(CHF)"},{"value":18,"text":"德国马克(DEM)"},{"value":19,"text":"其他"}]};

    var CURRENCY_VALUE_TO_TEXT = [];
    $.each(CURRENCY.currency, function(i, e) {
      CURRENCY_VALUE_TO_TEXT.push(e.text);
    })

    function init(data) {
      tabClick();
      createSale();
      //realTimeVerify();
      realTimeClearTips();
      checkDetailModal(data);
      editDetail();
      selectArrow();
      blurVerify();
      saleCurrencyInputClick();
    }
    init(data);

    function tabClick () {
      $('body').on('click', '#salemoney', function(e) {
        initSaleList();
        onScroll();
      })
    }

    function scrollToError ($dom) {
      var $content = $('.layui-layer-content');
      var _diff = 30;

      if ($dom.offset().top - $content.offset().top != 0) {
        $content.animate({
          scrollTop: $dom.offset().top - $content.offset().top + $content.scrollTop() - _diff
        }, 1000);
      }
    }

    function getCursortPosition (ctrl) {//获取光标位置函数
      var CaretPos = 0;    // IE Support
      if (document.selection) {
        ctrl.focus ();
        var Sel = document.selection.createRange ();
        Sel.moveStart ('character', -ctrl.value.length);
        CaretPos = Sel.text.length;
      }
      // Firefox support
      else if (ctrl.selectionStart || ctrl.selectionStart == '0')
      CaretPos = ctrl.selectionStart;
      return (CaretPos);
    }

    function setCaretPosition(ctrl, pos){//设置光标位置函数
      if(ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos,pos);
      }
      else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    }

    function ajax(config) {
      if (!config || !config.url) {
        console.error('请传入url!')
        return false;
      }
      return $.ajax({
        type: config.type || 'GET',
        url: config.url,
        data: config.data,
        dataType: config.dataType || 'json',
          xhrFields: {
              withCredentials: true
          },
          crossDomain: true,
      })
    }

    function getQueryString(name) {
      var reg = new RegExp("(^|&?)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]); return null;
    }

    function hasFid(id, arr) {
      var _lock = 0
      $.each(arr, function(i, d) {
        if (d.fid == id) {
          ++_lock;
        }
      })
      return _lock > 0 ? true : false;
    }

    function filtrationCheckbox($ele, datas) {
      var _fid = $ele.data('fid');
      var _data = [];
      $('[data-fid="'+ _fid+'"]').each(function(i, d) {
        $(d).attr('checked') && _data.push($(d).val())
      })

      if (!hasFid(_fid, datas)) {
        return datas.push({fid: _fid, fvalue: _data.join('#')});
      }
    }

    function filtrationRadio($ele, datas) {
      var _fid = $ele.data('fid');
      var _data = '';
      $('[data-fid="'+ _fid+'"]').each(function(i, d) {
        if ($(d).attr('checked') && !hasFid(_fid, datas)) {
          return datas.push({fid: _fid, fvalue:  $(d).val()})
        }
      })
    }

    function filtrationCurrency($ele, datas) {
      var _fid = $ele.data('fid');
      var _data = $ele.val();

      if ($ele.hasClass('currency-select')) {
        var _type = $ele.prevAll('select').val()
        if (!hasFid(_fid, datas) && _data && _data.length > 0) {
          _data = _data.split(',').join('');
          _data = _data + '#' + _type;
          return datas.push({fid: _fid, fvalue:  _data});
        }
      }
      else {

        if ($ele.hasClass('sale-currency')) {
           _data = _data.split(',').join('');
          return datas.push({fid: _fid, fvalue:  _data});
        }
        else if (!hasFid(_fid, datas)) {
           return datas.push({fid: _fid, fvalue:  _data});
        }
      }
    }

    function selectArrow () {
      $('body').on('click', function(e) {
        if (e.target.tagName == 'SELECT') {
          $(e.target).toggleClass('selected');
        }
        else {
          $('select').removeClass('selected');
        }
      })
    }

    function currencyRealTimeVerify ($dom, $input) {

      var _type = $dom.find('select').val();
      var _currency = $dom.find('input.sale-currency');
      var _data = _currency.val() || '';
      var _fid = _currency.data('fid');
      var $tips = $input.prevAll('.verify-tips');
      var $isRequired = $input.closest('li').find('.required');
      var _type_text = CURRENCY_VALUE_TO_TEXT[_type];

      if ( _type != 'NONE' && _data.length <= 0) {
        $input.addClass('sale-error-verify');
        $tips.show().find('.verify-tips-text').text('货币格式不正确！');
        $input.attr('data-crmsaleverify', false);
        $input.val(_type_text);
        return false;
      }
      else if ($isRequired.length > 0 && !$input.val() ) {
        $input.addClass('sale-error-verify');
        $tips.show().find('.verify-tips-text').text('内容不能为空');
        $input.attr('data-crmsaleverify', false);
        return false;
      }
      else {
        $input.removeClass('sale-error-verify');
        $tips.hide();
        $input.attr('data-crmsaleverify', true);
        return true;
      }
    }

    function setUICurrencyValueNoVerify($dom, $input) {
      var _type = $dom.find('select').val();
      var _currency = $dom.find('input.sale-currency');
      var _data = _currency.val() || '';
      var _fid = _currency.data('fid');
      var $tips = $input.prevAll('.verify-tips');
      var $isRequired = $input.closest('li').find('.required');

      var _type_text = CURRENCY_VALUE_TO_TEXT[_type];

      if (_data.length > 0 || _type != 'NONE') {
        $input.removeClass('sale-error-verify');
        $tips.hide();
        $input.attr('data-crmsaleverify', true);

        var regStrs = [
          ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
          ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
          ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
          ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
        ];

        $.each(regStrs, function(i, ele) {
          var reg = new RegExp(ele[0]);
          if (_data.replace(reg, ele[1]) != _data) {
            _data = _data.replace(reg, ele[1]);
          }
        })

        var _num = _data;
        _num && _num.length > 0 ? _num = _num : _num = '';
        $input.val(_type_text + ' ' + formatCurrency(_num));
      }
    }

    function setUICurrencyValue ($dom, $input) {
      setUICurrencyValueNoVerify($dom, $input);
      return currencyRealTimeVerify($dom, $input);
    }

    function checkCurrency ($dom, $input) {
      var $select =  $dom.find('select');
      var $currency = $dom.find('input.sale-currency');

      var _current_value = $input.val() || '';

      if (_current_value.length > 0) {
        var _num = _current_value.replace(/\,/g, '').match(/\d+(.\d+)?/g);
        _num && _num.length > 0 ? _num = _num.join('') : _num = '';
        var _cur_type = _current_value.match(/[^0-9]/g).join('').toString().replace(/\$|\,|\./g,'').trim();
        $select.val(CURRENCY_VALUE_TO_TEXT.indexOf(_cur_type) || 'NONE');
        $currency.val(formatCurrency(_num));
      }


      var _type = $select.val();

      if (_type == 'NONE') {
        $currency.attr('disabled', true);
      }
      else {
        $currency.attr('disabled', false);
      }

      $select.on('change', function(e) {
        _type = $select.val();
        var $currecyTips = $currency.closest('.currency-tips-wrapper');
        var $currencyInput = $currecyTips.siblings('.sale-currency-input');
        if (_type == 'NONE') {
          $currency.val('');
          $currency.attr('disabled', true);
          $currency.closest('li').find('.sale-currency-input').val('');
          setUICurrencyValue($currecyTips, $currencyInput);
        }
        else {
          $currency.attr('disabled', false);
        }

        setUICurrencyValueNoVerify($currecyTips, $currencyInput);
      });
    }

    function saleCurrencyInputClick () {
      $(document).on('click', '.sale-currency-input', function(e) {
        //e.stopPropagation();
        var $input = $(e.target);
        var $currecyTips = $input.siblings('.currency-tips-wrapper');
        checkCurrency($currecyTips, $input);
        $currecyTips.toggle().autoHide(function() {
          //$currecyTips.find('.sale-currency').on('blur', function(e) {
            setUICurrencyValue($currecyTips, $input)
          //})
        });
      });
    }

    function submitClickBtnChange () {

      var btn = $('.layui-layer-btn .layui-layer-btn0');
      var btnCancel = $('.layui-layer-btn .layui-layer-btn1');
      AJAXING = false;

      btnCancel
        .attr({"disabled":"disabled"}).addClass('crm_sale_btn_disabled')
        .css('cssText', 'background-color: #f8f9fc !important; border: 1px solid #d4deee !important; color: #96a0b4 !important;');
      btn
        .attr({"disabled":"disabled"}).addClass('crm_sale_btn_disabled')
        .css('cssText', 'color: #96a0b4 !important;');

      btn.html('提交中<span class="ani_dot">...</span>');

    }

    function getInputValue(id, crmid) {
      var btn = $('.sale-edit-detail-layer-wrapper  .layui-layer-btn .layui-layer-btn0');
      var btnCancel = $('.sale-edit-detail-layer-wrapper  .layui-layer-btn .layui-layer-btn1');

      if (!submitVerify() || !verifyForm() ) {
        btn
        .attr({"disabled":"disabled"}).addClass('crm_sale_btn_disabled')
        .css('cssText', 'background-color: #2580e6 !important; border: 1px solid #2580e6 !important; color: #fff;');

        btnCancel
        .css('cssText', 'color: #303642 !important;');
        AJAXING = false;
        return false;
      }

      submitClickBtnChange()
      var data = {}

      id ? data = {
        crmid: crmid,
        userid: window.userid,
        saleid: id,
        datas: []
      } :
      data = {
        crmid: crmid,
        userid: window.userid,
        datas: []
      }

      var def = $.Deferred();
      $('.sale-form-wrapper')
      .find('.post-sale-value')
      .each(function(i, ele) {
        var $ele = $(ele)
        if ($ele.attr('type') == 'checkbox') {
          filtrationCheckbox($ele, data.datas)
        }
        else if($ele.attr('type') == 'radio') {
          filtrationRadio($ele, data.datas)
        }
        else if ($ele.hasClass('sale-currency')) {
          filtrationCurrency($ele, data.datas)
        }
        else {
          data.datas.push({fid: $(ele).data('fid'),
          fvalue: $(ele).val() || $(ele).text()
        });
      }
    })

    def.resolve(data)
    return def;
  }

    function getInitValue() {
      return ajax({url: ROOT_URL + 'list/?crmid='+ getQueryString('crmid')})
    }

    var NEXT_LENGTH = 0;
    var NEXT_NUM = 1;
    function initSaleList(data) {
      var list = document.getElementById('SALE_LIST');
      return getInitValue().done(function(d) {
        NEXT_LENGTH = d.next;
        if (d.code == 200 && d.data && d.data.length > 0) {
          list.innerHTML = '<a class="sale-btn sale-create-btn" href="javascript:;" >新建</a>';
          d && $.each(d.data, function(i, data) {
           list.innerHTML  = list.innerHTML + saleItemTmpl(data);//tmpl("SALE_ITEM_TMPL", data);
          })
        }
        else {
          return false;
        }
      })
    }

    function onScroll() {
      var flag = false;
      $('.pv_left').on('scroll', function(e){

        if(flag){
          return false;
        }

        var divHeight = $(this).height();
        var nScrollHeight = $(this)[0].scrollHeight;
        var nScrollTop = $(this)[0].scrollTop;
        if(nScrollTop + divHeight >= nScrollHeight) {
          //请求数据
          flag = true;
          if ( NEXT_NUM <= NEXT_LENGTH) {
            var _data = {
              crmid: getQueryString('crmid'),
              page: NEXT_NUM
            }
          }
          else {
            flag = true;
            return false;
          }


          ajax({url: ROOT_URL + 'list',data: _data})
            .then(function(d) {
              var list = document.getElementById('SALE_LIST');
              NEXT_NUM++;
              flag = false;
              d && $.each(d.data, function(i, data) {
                list.innerHTML  = list.innerHTML + saleItemTmpl(data);//tmpl("SALE_ITEM_TMPL", data);
              })
            })
        }

      })

    }

    function saleItemTmpl (data) {
      return [
       '<div class="sale-list-wraper">'
           ,'<ul class="list-wrapper">'
             ,'<li id="'+data.id+'" >'
               ,'<h3>状态</h3>'
               ,'<span>'+data.status+'</span>'
               ,'<p class="crm-sale-time">'
                 ,'<span>更新于：</span>'
                 ,'<span >'+data.status_date+'</span>'
               ,'</p>'
             ,'</li>'
             ,'<li>'
               ,'<h3>编号</h3>'
               ,'<p>'+data.numcode+'</p>'
             ,'</li>'
             ,'<li>'
               ,'<h3>主题</h3>'
               ,'<p class="crm-sale-subject">'+data.name+'</p>'
             ,'</li>'
             ,'<li>'
               ,'<h3>总金额</h3>'
               ,'<p>'+data.money+'</p>'
             ,'</li>'
           ,'</ul>'
           ,'<div class="sale-line"></div>'
           ,'<div class="sale-footer">'
             ,'<div class="sale-time-wrapper">'
               ,'<h3>建单时间</h3>'
               ,'<span class="sale-time">'+data.create_time+'</span>'
             ,'</div>'
             ,'&nbsp;'
             ,'<a class="detail-btn data-crmsale-btn" data-crmsale-id="'+data.id+'"  href="javascript:;">查看详情</a>'
           ,'</div>'
         ,'</div>'].join('');
    }

    function verify(data) {
      var isEmpty = data.isEmpty || false;
      if (isEmpty && !data.val) {
        data.$tips.show();
        data.$input.addClass('sale-error-verify')
        //disabledSubmitBtn();
        return false;
      }

      if (data.val && data.val.length > 0 && data.testStr && !data.testStr.test(data.val)) {
        data.$tips.show();
        data.$input.addClass('sale-error-verify')
        //disabledSubmitBtn();
        return false;
      }
      else if (data.val && data.val.length > data.len) {
        data.$tips.show();
        data.$input.addClass('sale-error-verify')
        //disabledSubmitBtn();
        return false;
      }
      else {
        data.$tips.hide();
        data.$input.removeClass('sale-error-verify')
        return true;
      }
    }

    function verifySubject() {
      var $input = $('#SUBJECT');
      var val = $input.val();
      var $errorTips = $input.prevAll('.verify-tips ')
      return verify({$tips: $errorTips, $input: $input,val: val, len: 50, isEmpty: true});
    }

    function verifyNum() {
      var $input = $('#TOTAL_AMOUNT');

      var val = $input.val();
      var value = val.split(',').join('');

      var $errorTips = $input.prevAll('.verify-tips ')
      return verify({$tips: $errorTips,
        $input: $input,
        val: value,
        len: 20,
        isEmpty: false,
        testStr: /^([0-9]\d*(?:\.\d{1,2})|[1-9]\d*|0|0.0|0.00)$/});
    }

    function verifyInfo() {
      var $input = $('#INFO');
      var val = $input.val();
      var $errorTips = $input.prevAll('.verify-tips ')
      return verify({$tips: $errorTips, $input: $input,val: val, len: 50, isEmpty: false})
    }

    function verifyRemark() {
      var $input = $('#REMARK');
      var val = $input.val();
      var $errorTips = $input.prevAll('.verify-tips ')
      return verify({$tips: $errorTips, $input: $input,val: val, len: 150, isEmpty: false})
    }

    function verifyForm() {
      return verifySubject() && verifyInfo() && verifyRemark() && verifyNum();
    }

    function disabledSubmitBtn() {
      $('.layui-layer-btn0').attr({"disabled":"disabled"}).addClass('crm_sale_btn_disabled');
    }

    function abledSubmitBtn() {
      $('.layui-layer-btn0').removeAttr("disabled").removeClass('crm_sale_btn_disabled');
    }

    function submitVerifyCurrency ($input) {
      var $currecyTips = $input.closest('.currency-tips-wrapper');
      var $currencyInput = $currecyTips.siblings('.sale-currency-input');
      //return setUICurrencyValue($currecyTips, $currencyInput);
      return currencyRealTimeVerify($currecyTips, $currencyInput);
    }

    function submitVerifyCheckbox ($input) {
      var _fid = $input.data('fid');
      var _data = [];
      var $isRequired = $input.closest('li').find('.required');

      var $checkboxList =  $('[data-fid="'+ _fid+'"]');

      if ($isRequired.length > 0) {
        $checkboxList.each(function(i, d) {
          $(d).attr('checked') && _data.push($(d).val())
        })

        if (_data.length > 0) {
          $checkboxList.siblings('cite').removeClass('sale-error-verify');
          $input.closest('.crm-sale-label-wrapper').attr('data-crmsaleverify', true);
          return true;
        }
        else {
          $checkboxList.siblings('cite').addClass('sale-error-verify');
          $input.closest('.crm-sale-label-wrapper').attr('data-crmsaleverify', false);
          return false;
        }
      }

    }

    function submitVerifyRadio ($input) {
      var _fid = $input.data('fid');
      var _data = [];
      var $isRequired = $input.closest('li').find('.required');

      var $radioList =  $('[data-fid="'+ _fid+'"]');

      if ($isRequired.length > 0) {
        $radioList.each(function(i, d) {
          $(d).attr('checked') && _data.push($(d).val())
        })

        if (_data.length > 0) {
          $radioList.removeClass('sale-error-verify');
          $input.closest('.crm-sale-label-wrapper').attr('data-crmsaleverify', true);
          return true;
        }
        else {
          $radioList.addClass('sale-error-verify');
          $input.closest('.crm-sale-label-wrapper').attr('data-crmsaleverify', false);
          return false;
        }
      }

    }


    function fieldSpecialVerify ($input) {
      if ($input.hasClass('sale-currency')) {
        submitVerifyCurrency($input);
        return false;
      }
      else if ($input.attr('type') == 'checkbox') {
        submitVerifyCheckbox($input);
        return false;
      }
      else if ($input.attr('type') == 'radio') {
        submitVerifyRadio($input);
        return false;
      }
      else {
        return true;
      }
    }

    function verifyLength(_len, $input, $tips) {
      if (_len) {
        if ($input.val() && $input.val().length <= _len) {
          abledSubmitBtn();
          $input.removeClass('sale-error-verify');
          $tips.hide();
          $input.attr('data-crmsaleverify', true);
          return true;
        }
        else if ($input.val() && $input.val().length > _len) {
          $input.addClass('sale-error-verify');
          $tips.show().find('.verify-tips-text').text('内容不能超过'+ _len +'个字');
          $input.attr('data-crmsaleverify', false);
          return false;
        }
      }
      else {
        abledSubmitBtn();
        $input.removeClass('sale-error-verify');
        $tips.hide();
        $input.attr('data-crmsaleverify', true);
        return true;
      }
    }

    function verifyFieldUtility(e) {
      var $input = $(e);
      var $isRequired = $input.closest('li').find('.required');
      var $tips = $input.prevAll('.verify-tips');
      var _len = $input.data('length');

      if ($('.verify-tips').is(':visible') == false) {
        abledSubmitBtn();
      }

      if (fieldSpecialVerify($input)) {
        if ($isRequired.length > 0 ) {
          if ($input[0].tagName == 'SELECT' && $input.val() == "0") {
            $tips.show().find('.verify-tips-text').text('该项为必选项');
            $input.addClass('sale-error-verify');
            $input.attr('data-crmsaleverify', false);
            return false;
          }
          else if ($input.val().length <= 0 ) {
            if ($input.hasClass('hasDatepicker')) {
              $tips.show().find('.verify-tips-text').text('该项为必选项');
              $input.addClass('sale-error-verify');
              $input.attr('data-crmsaleverify', false)
            }
            else {
              $tips.show().find('.verify-tips-text').text('内容不能为空');
              $input.addClass('sale-error-verify');
              $input.attr('data-crmsaleverify', false);
            }
          }
          else {
            abledSubmitBtn();
            $input.removeClass('sale-error-verify');
            $tips.hide();
            $input.attr('data-crmsaleverify', true);

            verifyLength(_len, $input, $tips)
            return true;
          }

          return false;
        }

        verifyLength(_len, $input, $tips)
      }
    }

    function verifyFieldSubmit () {
      $('.sale-form-control').each(function(i, e) {
        verifyFieldUtility(e);
      })
    }

    function verifyFieldAssist (e) {
      verifyFieldUtility(e.target);
      $('.submit-verify-btn-tips').remove();
    }

    function forBtn () {

      var btn = $('.layui-layer-btn .layui-layer-btn0');
      var btnCancel = $('.layui-layer-btn .layui-layer-btn1');

      btn
      .text('确定')
      .removeAttr("disabled").removeClass('crm_sale_btn_disabled')
      .css('cssText', 'background-color: #2580e6 !important; border: 1px solid #2580e6 !important; color: #fff;');
      btnCancel
      .removeAttr("disabled").removeClass('crm_sale_btn_disabled')
      .css('cssText', 'color: #303642 !important;');



    }

    function verifyField() {
      $('body').on('blur', '.sale-form-control', function(e) {
        var $input = $(e.target);
        if ($input.attr("id") == 'TOTAL_AMOUNT' || $input.hasClass('sale-currency')) {
          var _data = $input.val();
          _data  = _data.split(',').join('');
          if (_data.length - 1 == _data.indexOf('.')) {
            _data = _data.replace(/\./g, '');
            $input.val(formatCurrency(_data));
          }
        }

        verifyFieldAssist(e);
        forBtn();
      })
      .on('input propertychange', '.sale-form-control',  function(e) {
        var $input = $(e.target);
        if (!$input.hasClass('currency-select')) {
          verifyFieldAssist(e);
        }
        forBtn();
      })
      .on('click', '.sale-form-control',  function(e) {
        var $input = $(e.target);
        if (!$input.hasClass('.currency-select')) {
          fieldSpecialVerify($input);
        }
        forBtn();
      })
      .on('focus', '.sale-form-control', function(e) {
        $('.submit-verify-btn-tips').remove();
        var $input = $(e.target);
        var $isRequired = $input.closest('li').find('.required');
        var $tips = $input.prevAll('.verify-tips');
        $input.removeClass('sale-error-verify');
        $tips.hide();
        forBtn();
      })
      .on('mouseenter', '.sale-form-control', function(e) {
        var $input = $(e.target);
        var $tips = $input.prevAll('.verify-tips');
        //$tips.hide();
      })
      .on('mouseleave', '.sale-form-control', function(e) {
        var $input = $(e.target);
        var $tips = $input.prevAll('.verify-tips');
        if ($input.hasClass('sale-error-verify')) {
          //$tips.show();
        }
      });
    }



    function submitVerify() {
      var _lock = 0;
      verifyFieldSubmit();
      $('[data-crmsaleverify="false"]').each(function(i, d) {
        var $this = $(d)
        var $tips = $this.prevAll('.verify-tips');
        ++_lock;
        if (_lock == 1) {
          var _bubble = $tips.find('.bubble-wrapper');
          _bubble.show();
          setTimeout(function() {
            _bubble.hide();
          }, 3000);
          scrollToError($this);
        }
      });

      var _len = $('[data-crmsaleverify="false"]').length;
      if (_len > 0 ) {
        $('.submit-verify-btn-tips').remove();
        $('.layui-layer-btn').prepend('<span class="submit-verify-btn-tips">共' + _len + '处错误，请修改！</span>');
      }

      /*if (_lock > 0) {
        $('.layui-layer-btn').prepend('<span class="submit-verify-btn-tips">共' + _lock + '处错误，请修改！</span>');
        return false;
      }
      */
      else {
        abledSubmitBtn()
        return true;
      }
    }

    function realTimeVerify() {
      $('body').on('blur', '.sale-form-control', function(e) {
        var $input = $(e.target);
        var id = $input.attr('id')
        switch (id) {
          case 'SUBJECT':
            verifySubject();
            break;
          case 'INFO':
            verifyInfo()
            break;
          case 'REMARK':
            verifyRemark()
            break;
          case 'TOTAL_AMOUNT':
            verifyNum()
            break;
          default:
            return true;
        }
      })
    }

    function realTimeClearTips() {
      $('body').on('focus', '.sale-form-control', function(e) {
        var $input = $(e.target);
        //$input.prevAll('.verify-tips').hide();
      })
    }

    function createPost(index) {
      return $.when(getInputValue())
      .done(function(data) {
        if (data) {
          return ajax({type: 'POST', url: ROOT_URL + 'save', data:data})
                  .done(function(d) {
                    if (d.code == 200) {
                      //layer.msg('<span class="ec_puptip ec_puptip_succeed ec_sale_puptip">'+ d.msg+'</span>', {shade: [0.5, '#fff', true]});
                      layer.msg('<span class="ec_puptip ec_puptip_succeed ec_sale_puptip">'+ '新建成功！'+'</span>', {shade: [0.5, '#fff', true]});
                      initSaleList();
                    }
                    else {
                      layer.msg('<span class="ec_puptip  ec_puptip_warning ec_sale_puptip">'+ d.msg+'</span>', {shade: [0.5, '#fff', true]});
                    }
                    //layer.closeAll();
                    AJAXING = false;
                  })
                  .fail(function(d) {
                    layer.msg('<span class="ec_puptip  ec_puptip_warning ec_sale_puptip">'+ (d.msg || '新建失败，请稍候再试！')  +'</span>', {shade: [0.5, '#fff', true]});
                    //layer.closeAll();
                    AJAXING = false;
                  })
        }
        else {
          return false
        }
      });
    }

    function getField() {
      return ajax({type: 'POST', url: ROOT_URL+'getfield'})
        .then(function(data) {
          return data;
        })
    }

    function formatCurrency(num) {
      var num = num.toString().replace(/\$|\,/g,'');
      var input_value = num;
      var decimals = num.split('.')[1];

      if (num == '') {
        return '';
      }

      if(isNaN(num)) {
        return num = '';
      }



      //var sign = (num == (num = Math.abs(num)));
      var sign = true;

      num = Math.floor(num*100+0.50000000001);
      var cents = num%100;
      num = Math.floor(num/100).toString();

      if(cents<10) {
        cents = "0" + cents;
      }

      for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) {
        num = num.substring(0,num.length-(4*i+3))+','+
        num.substring(num.length-(4*i+3));
      }

      if ( input_value.indexOf('.') > 0 || decimals && decimals.length > 0 ) {
        return (((sign)?'':'-') + num + '.' + (decimals && decimals.length > 0 ? decimals : ''));
      }
      else {
        return ((sign)?'':'-') + num ;
      }
    }


      function tipsHTML(text, shortInputTips) {
        return ['<div class="verify-tips ' + (shortInputTips ? shortInputTips: '') + '">'
            ,'<div class="bubble-wrapper">'
              ,'<span class="bot"></span>'
              ,'<span class="top"></span>'
              ,'<p class="verify-tips-text">'
              ,text ||  '内容不为空！'
              ,'</p>'
            ,'</div>'
          ,'<img class="tips-error-icon" src="//www.staticec.com/www/images/sale-error-icon.png"/>'
          ,'</div>'
        ].join('')
      }

      function inputTitle(name, isnotnull, textTop ) {
        if (textTop) {
           return [
           '<span class="crm-sale-title-top">'
           ,'<h3 >'
            ,name
            ,isnotnull == 1 ? '<span class="required">*</span>' : ''
            ,'</h3>'
            ,'</span>'
          ].join('')
        }
        else {
          return ['<h3>'
            ,name
            ,isnotnull == 1 ? '<span class="required">*</span>' : ''
            ,'</h3>'
          ].join('')
        }
      }

      function checkboxSetValue (value, key) {
        if (!value) {
          return false;
        }
        var arr = value.split('#');
        return arr.indexOf(key) > -1 ? true : false
      }

      function editDetailCurrencyValue(data) {
        var arr = data.split('#');
        var cur = CURRENCY_VALUE_TO_TEXT[arr[1]] || '';
        return cur + formatCurrency(arr[0]) + '';
      }

    function fieldHTMLType(type, data, params) {
      var _html = {
        1: ['<li>'
          ,inputTitle(data.name, data.isnotnull)
          ,tipsHTML('内容不为空且在最多50个字！')
          ,'<input data-crmsaleverify="true" data-length="50" '+ " data-fid=" + data.id
          , (data && data.value ? ' value=' + data.value + '  ' : '')
          , ' type="text"  placeholder="最多50个字"  class="sale-form-control post-sale-value" name="6" />'
        ,'</li>'].join(''), // 文本
        6: ['<li class="saleDatepicker">'
          ,inputTitle(data.name, data.isnotnull)
          ,tipsHTML('', 'short-input-tips')
          ,'<input data-crmsaleverify="true"  readonly  type="text" '+ " data-fid=" + data.id
          , (data && data.value ? ' value=' + data.value + '  ' : '')
          ,'   class="short-input  sale-form-control post-sale-value" />'
        ,'</li>'].join(''), // 时间
        7: ['<li class="currency-wrapper">'
          ,inputTitle(data.name, data.isnotnull)
          ,tipsHTML('', 'short-input-tips')

          ,'<input data-crmsaleverify="true"  readonly  type="text" '
          , (data && data.value ? ' value=' + editDetailCurrencyValue( data.value ) : '')
          ,'   class="short-input sale-currency-input  " />'

          ,'<div class="currency-tips-wrapper">'
            ,'<select '+ " data-fid=" + data.id +'   class="short-input " >'
                ,$.map(CURRENCY.currency, function(ele, i ) {
                  var arr = data.value && data.value.split('#') || [];
                  if (arr[1] == ele.value) {
                    return '<option selected="selected" value='+ele.value+'>'+ele.text+'</option>'
                  }
                  else {
                    return '<option value="'+ele.value+'">'+ele.text+'</option>'
                  }
                }).join('')
             ,'</select>'
          ,'<input data-length="50" '+ " data-fid=" + data.id
          , (data && data.value ? ' value=' + data.value.split('#')[0] + '  ' : '')
          ,'   type="text"  placeholder=""  class="sale-form-control post-sale-value sale-currency currency-select" />'
          ,'</div>'

        ,'</li>'].join(''), // 货币
        8: [ '<li>'
          ,inputTitle(data.name, data.isnotnull)
          ,tipsHTML('',  'short-input-tips')
            ,'<select data-crmsaleverify="true"  '+ " data-fid=" + data.id +'   id="STATE" class="short-input sale-form-control post-sale-value" >'
              ,params && $.map(params, function(d, i) {
                if (data.value && d.key == data.value ) {
                  return '<option selected="selected"  value='+ d.key +'>'+ d.value +'</option>'
                }
                else {
                  return '<option value='+ d.key +'>'+ d.value +'</option>'
                }
              }).join('')
           ,'</select>'
          ,'</li>'].join(''), // 下拉
        9: ['<li>'
          ,inputTitle(data.name, data.isnotnull, true)
          //,tipsHTML()
          ,params && ('<div data-crmsaleverify="true"  class="crm-sale-label-wrapper">' +$.map(params, function(d, i) {
              if (data && data.value == d.key) {
                return '<label><input checked="checked" '+ " data-fid=" + data.id +'   class="sale-form-control post-sale-value sale-form-control-radio " type="radio" name="sale'+data.name +'" value='+ d.key +' /><span class="sale-crm-radio-text"> '+d.value+'</span></label>'
              }
              else {
                return '<label><input '+ " data-fid=" + data.id +'   class="sale-form-control post-sale-value sale-form-control-radio " type="radio" name="sale'+data.name +'" value='+ d.key +' /><span class="sale-crm-radio-text"> '+d.value+'</span></label>'
              }
          }).join('') + '</div>')
        ,'</li>'].join(''), // 单选
        10: ['<li>'
          ,inputTitle(data.name, data.isnotnull, true)
          //,tipsHTML()
          ,params && ('<div data-crmsaleverify="true"  class="crm-sale-label-wrapper">' + $.map(params, function(d, i) {

            if (data && checkboxSetValue(data.value, d.key)) {
              return '<label><input checked="checked"'+ " data-fid=" + data.id +'   class="sale-form-control sale-form-control-checkbox  post-sale-value" type="checkbox" name="sale'+data.name +'"  value='+ d.key +' /><cite></cite><span  class="sale-crm-radio-text"> '+d.value+'</span></label>'
            }
            else {
              return '<label><input '+ " data-fid=" + data.id +'   class="sale-form-control sale-form-control-checkbox  post-sale-value" type="checkbox" name="sale'+data.name +'"  value='+ d.key +' /><cite></cite><span  class="sale-crm-radio-text"> '+d.value+'</span></label>'
            }
          }).join('') + '</div>')
        ,'</li>'].join(''), // 复选
        11: ['<li>'
          ,inputTitle(data.name, data.isnotnull)
          ,tipsHTML('',  'short-input-tips')
          ,'<select data-crmsaleverify="true"  '+ " data-fid=" + data.id +'   class="short-input sale-form-control post-sale-value" >'
              ,params && $.map(params, function(d, i) {
                if (data.value && d.key == data.value ) {
                  return '<option selected="selected"  value='+ d.key +'>'+ d.value +'</option>'
                }
                else {
                  return '<option value='+ d.key +'>'+ d.value +'</option>'
                }
              })
           ,'</select>'
           , data.time ? '<span class="status-text">更新于：'+ data.time +'</span>' : ''
          ,'</li>'].join('') // 状态
      }


      return _html[type]
    }

    function sysHTMLType(type, data, params,super_data) {
      var _html = {
        0: ['<li>'
          ,inputTitle(data.name, data.isnotnull)
          ,tipsHTML('内容不为空且在最多50个字')
            ,'<input data-crmsaleverify="true"  data-length="50"  '+ " data-fid=" + data.id
            , (data && data.value ? ' value=' + data.value + '  ' : '')
            ,'   id="OTHER"  class="sale-form-control post-sale-value"  type="text" />'
          ,'</li>'
        ].join(''),
        1: ['<li>'
          ,inputTitle(data.name, data.isnotnull)
          ,tipsHTML('内容不为空且在最多50个字')
          ,'<input data-crmsaleverify="true"  '+ " data-fid=" + data.id +'   id="SUBJECT" data-length="50" '
          , (data && data.value ? ' value=' + data.value + '  ' : '')
          ,' class="sale-form-control post-sale-value" type="text" placeholder="最多50个字" />'
        ,'</li>'].join(''),
        2: ['<li>'
          ,inputTitle(data.name, data.isnotnull)
            ,'<span '+ " data-fid=" + data.id +'   class="post-sale-value" >' + (data.value || window.getname)
            ,'</span>'
          ,'</li>'].join(''),
        3: ['<li class="sale-form-status">'
          ,inputTitle(data.name, data.isnotnull,false,type)
          ,tipsHTML('内容不为空',  'short-input-tips')
            ,'<select data-crmsaleverify="true"  '+ " data-fid=" + data.id
            ,'   id="STATE" class="short-input sale-form-control post-sale-value status-type" >'
              // ,params && $.map(params, function(d, i) {
              //           if (data.value && d.key == data.value ) {
              //             return '<option selected="selected"  value='+ d.key +'>'+ d.value +'</option>'
              //           }
              //           else {
              //               return '<option value='+ d.key +'>'+ d.value +'</option>'
              //           }
              //         }).join('')
            ,super_data.status_name?'<option selected="selected"  value='+ data.value +'>'+ super_data.status_name +'</option>':(params.length>0?'<option selected="selected"  value='+ params[0].key +'>'+ params[0].value +'</option>':'')
           ,'</select>'
           , super_data.status_time ? '<span class="status-text">更新于：'+ super_data.status_time +'</span>' : ''
          ,'</li>'].join(''),
        4: ['<li>'
          ,inputTitle(data.name, data.isnotnull)
          //,tipsHTML('金额必须为数字！')
            ,'<input data-crmsaleverify="true"  '+ " data-fid=" + data.id
            , (data && data.value ? ' value=' + formatCurrency(data.value) + '  ' : '')
            ,'   id="TOTAL_AMOUNT"  class="short-input sale-currency sale-form-control post-sale-value"  type="text" />'
          ,'</li>'
        ].join(''),
        5: ['<li>'
          ,inputTitle(data.name, data.isnotnull)
          ,tipsHTML('内容不为空且在最多50个字')
          ,'<input data-crmsaleverify="true"  '+ " data-fid=" + data.id
          , (data && data.value ? ' value=' + data.value + '  ' : '')
          ,'   id="INFO" data-length="50" type="text"  placeholder="最多50个字"  class="sale-form-control post-sale-value" name="6" />'
        ,'</li>'
        ].join(''),
        6: ['<li>'
          ,'<span class="sale-textarea-title">' + inputTitle(data.name, data.isnotnull)+ '</span>'
          ,tipsHTML('最多150个字')
          ,'<textarea data-crmsaleverify="true"  '+ " data-fid=" + data.id
          ,'   id="REMARK" data-length="150"  rows="4"  class="sale-form-control  post-sale-value" placeholder="最多150个字" name="7">'
          , (data && data.value ? data.value + '' : '')
          ,'</textarea>'
        ,'</li>'
        ].join('')
      }

      return _html[type]
    }

    function sysNameToType(name) {
      var _nameToType = {
        '主题': 1,
        '客户': 2,
        '状态': 3,
        '总金额': 4,
        '产品信息': 5,
        '备注': 6,
        '其他': 0
      }
      return _nameToType[$.trim(name)] || 0;
    }

    function createSale() {
      $('body').on('click', '.sale-create-btn', function(e) {
        getField()
          .then(function(json) {
            var inputList = $.map(json.data, function(d, i) {
              if (!d.fields || d.fields.length <= 0) {
                return ''
              }

              return ['<div class="sale-form-wrapper ">',
                          ,'<h3 class="form-title">'+ d.groupname +'</h3>'
                            ,'<ul>'
                            ,$.trim(d.groupname ) == '基础信息' ?
                              $.map(d.fields, function(d, i) {
                                if (d.status != 1) {
                                  if (sysNameToType(d.name) != 0) {
                                    return sysHTMLType( sysNameToType(d.name), d, d.params,json.data)
                                  }
                                  else {
                                    return fieldHTMLType(d.type, d, d.params)
                                  }
                                }
                              }).join('') :
                              $.map(d.fields, function(d, i) {
                                if (d.status != 1) {
                                  return fieldHTMLType(d.type, d, d.params) //7
                                }
                              }).join('')
                              ,'</ul>'
                            ,'</div>'
                        ].join('');
            })


            var html = inputList.join('')

            layer.confirm(html,
              /*{title: '新建销售金额',
              skin: 'sale-edit-detail-layer-wrapper sale-create-layer-wrapper',
              move: false,
              btn: ['确定', '取消'],
              area:['740px', '484px']
            },
              function (index) {
                console.info(index)
                createPost(index);
                return false;
              },
              function(index) {
                //console.info('cancel')
              }
              */

              {title: '新建销售金额',
              skin: 'sale-edit-detail-layer-wrapper sale-create-layer-wrapper',
              move: false,
              area:['740px', '490px'],
              btn: ['确定', '取消'],
              yes: function(index) {
                createPost(index);
                return false;
              }
            }
            );



            datePicker();
            //blurVerify();
          })
      })
    }


    function datePicker() {

      $('.saleDatepicker input').datetimepicker();
      var _top;
      $('.saleDatepicker input').on('click', function(e) {
        var $saleDatepickerInput = $(e.target);
        var  $datepicker = $('#ui-datepicker-div');
        var $content = $('.layui-layer-dialog .layui-layer-content');
        var _contentHeight = $content.height();
        var _datepickerHeight = $datepicker.height();
        _top = $datepicker.offset().top;
        var _content_top = $content.scrollTop();

        $datepicker.addClass('show-sale-datepicker');

        $content.on('scroll', function(e) {
          var _scroll_top = $content.scrollTop();
          var _diff = _scroll_top - _content_top;
          var _datepickerTop =  _top - _diff;

          var _relative_top = _top - $content.offset().top;
          var _relative_bottom =  _contentHeight - _relative_top;

          $datepicker.offset({top: _datepickerTop})
          if (_diff > 0 ) {
            if (_relative_top - _diff  > 0) {
              if ($datepicker.hasClass('show-sale-datepicker')) {
                $datepicker.show();
              }
            }
            else {
              $datepicker.hide();
            }
          }
          else {
            if (_relative_bottom + _diff  > -_datepickerHeight/4) {
              if ($datepicker.hasClass('show-sale-datepicker')) {
                $datepicker.show();
              }
            }
            else {
              $datepicker.hide();
            }
          }
        });

        $saleDatepickerInput.trigger('propertychange');

        $('body').on("mouseup", function(e) {
          //$saleDatepickerInput.trigger('propertychange');
          if($(e.target).parents('#ui-datepicker-div').length == 0 &&
            $(e.target).parents('.saleDatepicker').length == 0) {
              $datepicker.removeClass('show-sale-datepicker');
          }
        });



        $('body').on('click', '.ui-datepicker-close', function(e) {
          $saleDatepickerInput.trigger('propertychange');
          $datepicker.removeClass('show-sale-datepicker');
        })
      })
    }


    function currencyPropertychange (e, CURSORT_POSITION) {
      var $currency =$(e.target);
      var inputValue = $currency.val();
      var value = $currency.val().split(',').join('');

      if (value && value.length >= 15) {
        var sub_value = value.substring(0, 15);
        value = sub_value;
        $currency.val(formatCurrency(sub_value));
        setCaretPosition(e.target,  19);
      }

      var regStrs = [
        ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
        ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
        ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
        ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
      ];

      CURSORT_POSITION = getCursortPosition(e.target);

      if ($currency.hasClass('sale-currency')) {
        $.each(regStrs, function(i, ele) {
          var reg = new RegExp(ele[0]);
          if (value.replace(reg, ele[1]) != value) {
            $currency.val( value.replace(reg, ele[1]));
            value = $currency.val();
            //$currency.val(formatCurrency(value))
          }
        })
      }

      $currency.val(formatCurrency(value));
      var new_value = $currency.val();

      if (inputValue && inputValue.length > CURSORT_POSITION && !NOT_NUM_KYE) {
        if (inputValue.length < new_value.length) {
          setCaretPosition(e.target, CURSORT_POSITION + 1)
        }
        else if (inputValue.length > new_value.length) {
          if (MOVE) {
            setCaretPosition(e.target, CURSORT_POSITION + 1);
          }
          else {
            setCaretPosition(e.target, CURSORT_POSITION - 1);
          }
        }
        else {
          setCaretPosition(e.target, CURSORT_POSITION );
        }
      }
    }

    function currencyVerify() {
      var CURSORT_POSITION  = 0;
      var MOVE = false;
      var NOT_NUM_KYE = false;
      $('body').on('blur', '.sale-currency', function(e) {
        var $currency =$(e.target)
        var value = $currency.val().split(',').join('');
        var $tips = $currency.prevAll('.verify-tips');

        var $isRequired = $currency.closest('li').find('.required');
      })
      .on('focus', '.sale-currency',  function(e) {
        var $currency =$(e.target);
        CURSORT_POSITION = getCursortPosition(e.target);
      })
      .on('keydown', '.sale-currency',  function(e) {
        var $currency =$(e.target);
        var keyCode = e.keyCode;
        var value = $currency.val().split(',').join('');

        CURSORT_POSITION = getCursortPosition(e.target);

        if ($currency.hasClass('sale-currency')) {
          if ( ((keyCode > 47) && (keyCode < 58)) ||
                ( keyCode >= 96 && keyCode <= 105) ||
                (keyCode == 190) || (keyCode == 17)  || (keyCode == 8) ||
                (keyCode == 37) || (keyCode == 38)  || (keyCode == 39) || (keyCode == 40) ||
                (keyCode == 110)
              ) {

                if ((keyCode == 37) || (keyCode == 38)  || (keyCode == 39) || (keyCode == 40)) {
                  NOT_NUM_KYE = true;
                }
                else {
                  NOT_NUM_KYE = false;
                }

                if (keyCode == 8 ) {
                  MOVE = false;
                }
                else {
                  MOVE = true;
                }

                if (!value) {
                  return true;
                }

                if (value) { //  && value.length < 15
                  return true;
                }
                else {
                  if ((keyCode == 8) ||  (keyCode == 37) || (keyCode == 38)  || (keyCode == 39) || (keyCode == 40)) {
                    return true;
                  }
                  else {
                    return false;
                  }
                }

          }
          else {
            return false;
          }
        }
      })
      .on('input propertychange', '.sale-currency',  function(e) {

        var $currency =$(e.target);
        var inputValue = $currency.val();
        var value = $currency.val().split(',').join('');

        if (value && value.length >= 15) {
          var sub_value = value.substring(0, 15);
          value = sub_value;
          $currency.val(formatCurrency(sub_value));
          setCaretPosition(e.target,  19);
        }

        var regStrs = [
          ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
          ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
          ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
          ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
        ];

        CURSORT_POSITION = getCursortPosition(e.target);

        if ($currency.hasClass('sale-currency')) {
          $.each(regStrs, function(i, ele) {
            var reg = new RegExp(ele[0]);
            if (value.replace(reg, ele[1]) != value) {
              $currency.val( value.replace(reg, ele[1]));
              value = $currency.val();
              //$currency.val(formatCurrency(value))
            }
          })
        }

        $currency.val(formatCurrency(value));
        var new_value = $currency.val();

        if (inputValue && inputValue.length > CURSORT_POSITION && !NOT_NUM_KYE) {
          if (inputValue.length < new_value.length) {
            setCaretPosition(e.target, CURSORT_POSITION + 1)
          }
          else if (inputValue.length > new_value.length) {
            if (MOVE) {
              setCaretPosition(e.target, CURSORT_POSITION + 1);
            }
            else {
              setCaretPosition(e.target, CURSORT_POSITION - 1);
            }
          }
          else {
            setCaretPosition(e.target, CURSORT_POSITION );
          }
        }


        //currencyPropertychange(e, CURSORT_POSITION);
      })
    }

    function blurVerify() {
      verifyField();
      currencyVerify();
    }

    function detailTypeSetValue (data, superData) {
      var types = ['8', '9', '10', '11', '7'];
      if (types.indexOf(data.type) != -1) {
        if (data.type == 10) {
          return $.map(data.params, function(ele, i) {
            var arr = data.value.split('#');
            if (arr.indexOf(ele.key) > -1) {
              return '<span class="checkbox-params">'+escapeChars(ele.value)+'</span>'
            }
          }).join('');
        }
        else if (data.type == '7') {
          var arr = data.value.split('#');
          var cur = CURRENCY_VALUE_TO_TEXT[arr[1]] || '';
          return cur + ' ' +formatCurrency(arr[0]);
        }
        else if (data.type == '8') {
           return $.map(data.params, function(ele, i) {
            var arr = data.value.split('#');
            if (arr.indexOf(ele.key) > -1) {
              return '<span class="checkbox-params">'+escapeChars(ele.value)+'</span>'
            }
          }).join('');
        }
        else if (data.type == '9') {
           return $.map(data.params, function(ele, i) {
            var arr = data.value.split('#');
            if (arr.indexOf(ele.key) > -1) {
              return '<span class="checkbox-params">'+escapeChars(ele.value)+'</span>'
            }
          }).join('');
        }
        else if (data.type == '11') {
          var status_value = null;
            status_value =  $.map(data.params, function(ele, i) {
                if (data.value == ele.key) {
                    return ele.value;
                }
            })

            if (status_value.length > 0) {
                return status_value.join('') + '<span class="sale-detail-status">更新于：'+superData.status_time + '</span>';
            }
            else {
                return '空 <span class="sale-detail-status">更新于：'+superData.status_time + '</span>';
            }
        }
        else {
          return escapeChars(data.value);
        }
      }
      else {
        return escapeChars(data.value);
      }
    }

    function bntSubmiting (SALEID, crmid) {
      var btn = $('.layui-layer-btn .layui-layer-btn0');
      var btnCancel = $('.layui-layer-btn .layui-layer-btn1');

      if (!AJAXING) {
        AJAXING = true;

        updateDetail(SALEID, crmid);

        /*setTimeout(function() {
          AJAXING = false;
          btn.text("提交超时");
          return false;
        }, 30000);
        */
      }
    }

    function checkDetailModal(data) {
      //$('body').on('click', '.data-crmsale-btn', function(e) {
        var id = data;// $(e.target).data('crmsaleId');
        SALEID = id;

        ajax({url: ROOT_URL + 'detail', data: {saleid: id}})
          .then(function(json) {
            //var tmpHeader = tmpl('SALE_DETAIL_BASE_INFO', json.data);
            var tmpHeader = saleDetailbaseInfo(json.data);
            var tmpContent = $.map(json.data.fields, function(d, i) {
              if (!d.fields || d.fields.length <= 0) {
                return ''
              }

              return ['<div class="sale-detail-wrapper sale-form-wrapper">'
              ,'<h3 class="form-title">'
              , d.groupname
              ,'</h3>'
              ,'<ul>'
              ,$.map(d.fields, function(data, i) {
                return [
                  '<li>'
                  ,'<h3>'
                  , escapeChars(data.name)
                  ,'</h3>'
                  ,'<div class="sale-data">'
                  ,detailTypeSetValue(data, json.data)
                  ,'</div>'
                  ,'</li>'
                ]
              }).join('')
              ,'</ul>'
              ,'</div>'].join('');
            });
            var _html = tmpHeader + tmpContent.join('');

            /*layer.confirm(_html,
              {title: '销售金额详情',
              skin: 'sale-detail-layer-wrapper',
              id: 'sale-detail-modal',
              move: false,
              area:['740px', '484px'],
              btn: ['关闭'],
              success: function(data) {
              },
              yes: function(data) {
                layer.closeAll();
              }
            });*/

            layer.confirm(_html,
              {title: '销售金额详情',
              skin: 'sale-edit-detail-layer-wrapper',
              id: 'sale-detail-modal',
              move: false,
              area:['740px', '490px'],
              btn: ['确定', '关闭'],
              success: function(data) {
                //console.info('Success', $btn[0])
              },
              yes: function(d) {
                bntSubmiting(SALEID, json.data.crmid);
                return false;
                //updateDetail(SALEID, json.data.crmid);
                //layer.closeAll();
              },
              btn1: function() {}
            })



            // if ($('#SALE_DETAIL_EDIT_BTN') && $('#SALE_DETAIL_EDIT_BTN').length <= 0 ) {
            //   $('.layui-layer-btn').prepend('<span class="edit-competence-tips">仅建单人有编辑权限！</span>');
            // }

            $('.sale-edit-detail-layer-wrapper .layui-layer-btn0').hide();
          })
        //})
    }

    function salemoneyIsAction() {
      return $('#salemoney').closest('li').hasClass('active');
    }

    function updateDetail(id, crmid) {
      $.when(getInputValue(id, crmid))
      .done(function(data) {
        if (data) {
          return ajax({type: 'POST', url: ROOT_URL + 'save', data:data})
                  .done(function(d) {
                    if (d.code == 200) {
                      layer.msg('<span class="ec_puptip ec_puptip_succeed ec_sale_puptip">'+ d.msg+'</span>', {shade: [0.5, '#fff', true]});
                      //salemoneyIsAction() ? initSaleList() : window.location.reload();
                    }
                    else {
                      layer.msg('<span class="ec_puptip  ec_puptip_warning ec_sale_puptip">'+ d.msg+'</span>', {shade: [0.5, '#fff', true]});
                    }

                    //layer.closeAll();
                    AJAXING = false;

                  })
                  .fail(function(d) {
                    layer.msg('<span class="ec_puptip  ec_puptip_warning ec_sale_puptip">'+ d.msg+'</span>', {shade: [0.5, '#fff', true]});
                    //layer.closeAll();
                    AJAXING = false;
                  })
        }
        else {
          return false
        }
      });
    }

    function escapeChars(str) {
      if (!str) {
        return '';
      }
      str = str.replace(/&/g, '&amp;');
      str = str.replace(/</g, '&lt;');
      str = str.replace(/>/g, '&gt;');
      str = str.replace(/'/g, '&acute;');
      str = str.replace(/"/g, '&quot;');
      str = str.replace(/\|/g, '&brvbar;');
      return str;
    }


    function saleDetailbaseInfo (data) {
      return [
        ,'<div class="sale-detail-base-info-wrapper">'
        ,'<ul>'
        ,'<li>'
        ,'<h3>编号</h3>'
        ,'<p>'+data.numcode+'</p>'
        ,'</li>'
        ,'<li>'
        ,'<h3>建单时间</h3>'
        ,'<p>'+data.create_time+'</p>'
        ,'</li>'
        ,'<li>'
        ,'<h3>建单人</h3>'
        ,'<p>'+ escapeChars(data.username)+'</p>'
        ,'</li>'
        ,'<li>'
        ,'<h3>最后更新时间</h3>'
        ,'<p>'+data.change_time+'</p>'
        ,'</li>'
        ,'</ul>'
        ,'<div class="line-wapper">'
        ,'<div class="sale-line sale-line-no-btn"></div>'
        // ,data.isedit == 1 ? '<div class="sale-line"></div>' : '<div class="sale-line sale-line-no-btn"></div>'
        // ,data.isedit == 1 ? '<a id="SALE_DETAIL_EDIT_BTN" class="sale-detail-edit-btn sale-btn " href="javascript:;">编辑</a>' : ''//'<a disabled="disabled"  id="SALE_DETAIL_EDIT_BTN"  class="sale-detail-edit-btn sale-btn sale-disabled-btn" href="javascript:;">编辑</a>'
        ,'</div>'
        ,'</div>'
      ].join('')
    }

    function editDetail() {
      $('body').on('click', '.sale-detail-edit-btn', function(e) {
        var $btn = $('.sale-detail-edit-btn');
        if ($btn.hasClass('no-edit')) {
          return false;
        }

        ajax({url: ROOT_URL + 'detail', data: {saleid: SALEID}})
          .then(function(json) {
            json.data.isedit = 0;
            var tmpHeader = saleDetailbaseInfo(json.data);
            var tmpContent = $.map(json.data.fields, function(d, i) {
              if (!d.fields || d.fields.length <= 0) {
                return ''
              }
              return ['<div class="sale-form-wrapper ">',
                          ,'<h3 class="form-title">'+ d.groupname +'</h3>'
                            ,'<ul>'
                            ,$.trim(d.groupname ) == '基础信息' ?
                              $.map(d.fields, function(d, i) {
                                if (d.status != 1) {
                                  if (sysNameToType(d.name) != 0) {
                                    return sysHTMLType( sysNameToType(d.name), d, d.params,json.data)
                                  }
                                  else {
                                    return fieldHTMLType(d.type, d, d.params)
                                  }
                                }
                              }).join('') :
                              $.map(d.fields, function(d, i) {
                                if (d.status != 1) {
                                  return fieldHTMLType(d.type, d, d.params) //7
                                }
                              }).join('')
                              ,'</ul>'
                            ,'</div>'
                        ].join('');
                      });
            var _html = tmpHeader + tmpContent.join('');

            /*layer.confirm(_html,
              {title: '编辑销售金额',
              skin: 'sale-edit-detail-layer-wrapper',
              id: 'sale-detail-modal',
              move: false,
              area:['740px', '484px'],
              btn: ['确定', '取消'],
              success: function(data) {
                //console.info('Success', $btn[0])
              },
              yes: function(data) {
                updateDetail(SALEID, json.data.crmid);
                //layer.closeAll();
              },
              btn1: function() {
              }
            })
            */

            var layer_content_dom = $('.sale-edit-detail-layer-wrapper .layui-layer-content')[0];
            layer_content_dom.innerHTML = _html;

            $('.sale-edit-detail-layer-wrapper  .layui-layer-title').text('编辑销售金额');
            $('.sale-edit-detail-layer-wrapper  .layui-layer-btn1').text('取消');
            $('.sale-edit-detail-layer-wrapper .layui-layer-btn0').show();

            datePicker();
            //blurVerify();
          })
        })
    }

  })
})(jQuery)



}
