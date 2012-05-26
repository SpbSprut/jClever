/*
*   jClever HEAD:v 0.1.1 :)
*
*   by Denis Zavgorodny
*   zavgorodny@alterego.biz.ua
*
*   UPD:    up to v 0.1.1
*           + scroll by scrollPane (https://github.com/vitch/jScrollPane/archives/master)
* 
* 
*
*   in next time: radiobutton, checkbox
*
*
*/ 
(function($){
    $.fn.jClever = function(options) {
        var options = $.extend(
                                {
                                    text: ''
                                },
                                options
                                );
        var selects = [];                        
        var jScrollApi = [];                        
        var methods = {
                        init: function(element) {
                            //Инициализируем селекты
                            var innerCounter = 9999;
                            var tabindex = 1;
                            $(element).find('select').each(function(){
                                methods.selectActivate(this,innerCounter, tabindex);
                                innerCounter--;
                                tabindex++;
                            });
                        },
                        destroy: function() {
                            //Раздеваем селекты
                            $('form.clevered').find('select').each(function(){
                                var tmp = $(this).clone();
                                $(this).parents('.jClever-element').empty().after(tmp);
                            });

                            
                            $('.jClever-element').remove();
                            $('form.clevered').removeClass('clevered');
                        },
                        selectActivate: function(select, innerCounter, tabindex) {
                            jScrollApi[$(select).attr('name')] = {};
                            selects[$(select).attr('name')] = {
                                                                    object: $(select),
                                                                    updateFromHTML: function(data){
                                                                                            $('select[name='+this.object[0].name+']').html(data).trigger('update');
                                                                                            
                                                                                            return false;
                                                                                        }
                                                                };

                            $(select).wrap('<div class="jClever-element"><div class="jClever-element-select-wrapper"><div class="jClever-element-select-wrapper-design"><div class="jClever-element-select-wrapper-design">').after('<span class="jClever-element-select-center"></span><span class="jClever-element-select-right">v</span><div class="jClever-element-select-list-wrapper" style="z-index:'+innerCounter+';"><ul class="jClever-element-select-list"></ul></div>');
                            var selectObject = $(select).parents('.jClever-element').attr('tabindex',tabindex);
                            var selectText = selectObject.find('.jClever-element-select-center');
                            var selectRight = selectObject.find('.jClever-element-select-right');
                            var selectList = selectObject.find('.jClever-element-select-list');
                            var selectListWrapper = selectObject.find('.jClever-element-select-list-wrapper');
                            $(select).find('option').each(function(){
                                selectObject.find('.jClever-element-select-list')
                                            .append($('<li data-value="'+$(this).val()+'"><span><i>'+$(this).text()+'</i></span></li>'));
                                
                            });
                            selectText.text($(select).find('option:eq(0)').text());
                            selectObject.on('click', '.jClever-element-select-center',function(){
                                selectListWrapper.show();
                                jScrollApi[$(select).attr('name')] = $('.jClever-element-select-list-wrapper').jScrollPane().data('jsp');            
                            });
                            selectObject.on('click', '.jClever-element-select-right' ,function(){
                                selectListWrapper.show();
                                jScrollApi[$(select).attr('name')] = $('.jClever-element-select-list-wrapper').jScrollPane().data('jsp');            
                            });
                            selectListWrapper.blur(function(){
                                //jScrollApi[$(select).attr('name')].destroy();
                                $(this).hide();
                            });
                            selectObject.on('click','li' ,function(event){
                                var value = $(this).data('value');
                                selectList.find('li.active').removeClass('active');
                                $(this).addClass('active');
                                $(select).find('option').removeAttr('selected');
                                $(select).find('option[value='+value+']').attr('selected','selected');
                                $(select).trigger('change');
                                //jScrollApi[$(select).attr('name')].destroy();
                                selectListWrapper.hide();
                                return false;
                            });
                            $(select).change(function(){
                                selectText.text($(this).find(':selected').text());
                            });
                            $(select).bind('update',function(){
                                var ul = $(this).parents('.jClever-element-select-wrapper')
                                        .find('.jClever-element-select-list')
                                        .empty();
                                $(this).find('option').each(function(){
                                    ul.append($('<li data-value="'+$(this).val()+'"><span><i>'+$(this).text()+'</i></span></li>'));
                                });
                                $(this).parents('.jClever-element-select-wrapper').find('.jClever-element-select-center').text($(select).find('option:eq(0)').text());    
                            });
                            selectObject.focus(function(){$(this).addClass('focused')}).blur(function(){$(this).removeClass('focused')});
                            // Отслеживаем нажатие клавиш для управления клавиатурой
                            selectObject.keydown(function(e){
                                var selectedIndex = $(select)[0].selectedIndex;
                                switch(e.keyCode){
                                    case 40: /* Down */
                                        if (selectedIndex < $(select).find('option').length-1){ selectedIndex++; }
                                        break;
                                    case 38: /* Up */
                                        if (selectedIndex > 0){ selectedIndex--; }
                                        break;
                                    default:
                                        return;
                                        break;
                                }
                                $(select)[0].selectedIndex = selectedIndex;
                                selectObject.find('li.selected').removeClass('selected');
                                selectObject.find('li:eq('+selectedIndex+')').addClass('selected');
                                selectObject.find('option').removeAttr('selected');
                                selectObject.find('option:eq('+selectedIndex+')').attr('selected','selected');
                                $(select).trigger('change');
                                return false;
                            });
                        },
        };
        var publicApi = {
                            selectCollection: selects,
                            destroy: function() {methods.destroy()},
                            scrollingAPI: jScrollApi
                        };
        this.publicMethods = publicApi;    
        return this.each(function(){
            $(this).addClass('clevered');
            methods.init(this);
        });
    };
    /**************************Вспомогательная секция********************/
    //Спасибо jNiсe за идею
        $(document).mousedown(function(event){
            if ($(event.target).parents('.jClever-element-select-wrapper').length === 0) { $('.jClever-element-select-list-wrapper:visible').hide(); }
    });
})(jQuery);    
