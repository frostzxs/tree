/**
 *
 * @author дом
 */

/**Контроллер*/
//отслеживаем открытие документа
$(document).ready(function() {
	$.documentReady();
	/**отслеживаем событие по клику на иконке развертывания и передаем модели*/
	$(".input-group-addon.action").click(function() {
		var elId = $(this).parent().parent(".elTree").attr('id').substr(2);
		$.elTreeExpanderClick(elId);
		$.elTreeFocus(elId);
	});
	
	//отслеживаем событие по клику на флажке и передаем модели
    $(".input-group-addon.elCheckbox").click(function() {
    	var elId = $(this).parent().parent(".elTree").attr('id').substr(2);
        $.elTreeCheckboxClick($(this).parent().parent(".elTree").attr('id').substr(2));
        $.elTreeFocus(elId);
    });	
    
    //ставим фокус на элементе, помечаем для редактирования 	
	$(".form-control").focus(function() {
		var elId = $(this).parent().parent(".elTree").attr('id').substr(2);
		$.elTreeFocus(elId);
		$.elTreeFocusEdit("true");
	});
	
	//убираем фокус с элемента, помечаем отмену редактирования 
    $(".form-control").focusout(function(){
        $.elTreeFocusEdit("");            
    });
    //отслеживаем нажатие клавиш

        $(document).keydown(function(e) {
            if (e.keyCode == 13)
                $.elTreeKey(e.ctrlKey,e.keyCode, $('#id0').find('.elTree').find('.elTreeFocusHighlight').val())
            else
                $.elTreeKey(e.ctrlKey,e.keyCode);
        })

});
/*************************************************************/

/**Модель*/
//читаем json, парсим в объект и передаем на отрисовку
$.documentReady = function() {
	var templ = '{'+
				'"treeFocus":"2",'+
				'"treeFocusEdit":"",'+
				'"values":{'+
				' "1":{"name":"уровень1","parent":"","expand":"-","state":"selected","prev":"" },'+
	            ' "2":{"name":"уровень2","parent":"1","expand":"-","state":"","prev":"" },'+
	            ' "3":{"name":"уровень3","parent":"2","expand":"+" ,"state":"","prev":"" },'+
	            ' "4":{"name":"уровень4","parent":"3","expand":"" ,"state":"","prev":"" },'+
	            ' "5":{"name":"уровень45","parent":"3","expand":"" ,"state":"","prev":"4" },'+
	            ' "6":{"name":"уровень46","parent":"3","expand":"" ,"state":"","prev":"5" },'+	            
	            ' "7":{"name":"уровень4","parent":"3","expand":"" ,"state":"","prev":"6" },'+
	            ' "8":{"name":"уровень4","parent":"3","expand":"" ,"state":"","prev":"7" },'+
	            ' "9":{"name":"уровень3","parent":"3","expand":"" ,"state":"","prev":"8" },'+
                ' "10":{"name":"уровень4","parent":"2","expand":"" ,"state":"","prev":"3" },'+                         
	            ' "50":{"name":"уровень3","parent":"2","expand":"" ,"state":"","prev":"10"}}}';
	var tree = jQuery.parseJSON(templ);
	$.treeDraw(tree);

	//фиксируем свертывание/развертывание в модели и даем команду на отображение свертывания/развертывания
	$.elTreeExpanderClick = function(id) {
		switch (tree.values[id].expand ) {
		case "+":
			tree.values[id].expand = "-";
			break;
		case "-":
			tree.values[id].expand = "+";
			break;
		}
		$.elTreeToggleDraw(id);
	}
	
	//фиксируем выбор в модели и даем команду на отображение выбора(переключение флажка элемента)
	$.elTreeCheckboxClick = function(id) {
	    switch (tree.values[id].state ) {
        case "selected":
            tree.values[id].state = "";
            break;
        default:        
            tree.values[id].state = "selected";
            break;
        }
        $.elTreeSelectDraw(id);
	}
	
	//фиксируем фокус в модели и даем команду на отображение фокуса
	$.elTreeFocus = function(id) {
	    
		if (tree.treeFocus != id){
			$.elTreeFocusDraw(tree.treeFocus);//убираем старый фокус
			$.elTreeFocusDraw(id);//ставим новый фокус
			tree.treeFocus = id;
    }      
	}
	
    //обрабатываем нажатия клавиатуры


    $.elTreeKey = function(ctrl, key, elTreeValue) {
        var next;
        if (tree.treeFocusEdit == "") {//если поле не редактируется
            if (ctrl) {
                switch(key) {
                case 37:
                    //стрелка влево
                    //создать элемент выше уровнем
                    if (tree.values[tree.treeFocus].parent)
                        $.elTreeFocus(tree.values[tree.treeFocus].parent);
                    break;
                case 38:
                    //стрелка вверх
                    //создать элемент выше
                    if (tree.values[tree.treeFocus].prev)
                        $.elTreeFocus(tree.values[tree.treeFocus].prev);
                    break;
                case 39:
                    //стрелка вправо
                    //создать элемент ниже уровнем
                    child = $.childId(tree.treeFocus);
                    if (child) {
                        if (tree.values[tree.treeFocus].expand == "+")
                            $.elTreeExpanderClick(tree.treeFocus);
                        $.elTreeFocus(child);
                    };
                    break;
                case 40:
                    //стрелка вниз
                    //создать элемент ниже:                    
                    //перевести фокус на этот элемент treeFocus                    
                    $.elTreeFocus($.elTreeAdd("текст",tree.treeFocus,tree.values[tree.treeFocus].parent));
                    break;
                }
            } else {
                switch(key) {
                case 37:
                    //стрелка влево
                    if (tree.values[tree.treeFocus].parent)
                        $.elTreeFocus(tree.values[tree.treeFocus].parent);
                    break;
                case 38:
                    //стрелка вверх
                    if (tree.values[tree.treeFocus].prev)
                        $.elTreeFocus(tree.values[tree.treeFocus].prev);
                    break;
                case 39:
                    //стрелка вправо
                    child = $.childId(tree.treeFocus);
                    if (child) {
                        if (tree.values[tree.treeFocus].expand == "+")
                            $.elTreeExpanderClick(tree.treeFocus);
                        $.elTreeFocus(child)
                    };
                    break;
                case 40:
                    //стрелка вниз
                    next = $.nextId(tree.treeFocus);
                    if (next)
                        $.elTreeFocus(next);
                    break;
                case 13:
                    //клавиша enter
                    $.elTreeFocusEditDraw(tree.treeFocus);
                    break;
                case 17:
                    //клавиша ctrl
                    $.elTreeCheckboxClick(tree.treeFocus);
                    break;
                }
            }
        } else {
            switch(key) {
            case 13:
                //клавиша enter
                tree.values[tree.treeFocus].name = elTreeValue;
                $.elTreeFocusEditDraw(tree.treeFocus, "1");                
                break;
            }
        }
    }



    //поиск следующего по порядку элемента
        $.nextId = function(id) {
            var idNextFound = "";
                $.each(tree.values, function(idNext, value) {
                    if (tree.values[idNext].prev == id)
                        idNextFound = idNext;
                });                        
            return idNextFound;
        }

    //поиск первого потомка
        $.childId = function(id) {
            var idChildFound = "";
            $.each(tree.values, function(idChild, value) {
                if (tree.values[idChild].parent == id && tree.values[idChild].prev == "")                    
                    idChildFound = idChild;
            });
            return idChildFound;
        }


    //переключаем режим редактирования на противоположный	
    $.elTreeFocusEdit = function(checker) {
        if (checker) {
            tree.treeFocusEdit = "true";            
        } else {
            tree.treeFocusEdit = "";            
        }
    }

    //создаем новый элемент

        $.elTreeAdd = function(nameText, prevId, parentId) {
            //найти n - индекс последнего элемента
            var lastKey = 0;
            var next;
            $.each(tree.values, function(elementId, value) {
                if (Number(elementId) > lastKey)
                    lastKey = elementId;
            });
            lastKey = Number(lastKey) + 1;            
            //создать элемент "n+1":{"name":"текст","parent":"родитель текущего","expand":"","state":"","prev":"текущий" }
            next = $.nextId(prevId);
            if (next) tree.values[next].prev = lastKey;
            tree.values[lastKey] = {
                name : nameText,
                parent : parentId,
                expand : "",
                state : "",
                prev : prevId
            };            
            
            $.elTreeAddDraw(lastKey, prevId, parentId);
            return lastKey;
        }; 

}
/*************************************************************/

/**Представление*/
//Отрисовка дерева из модели
$.treeDraw = function(tree) {	
	var divElTree;
	var divExpand;
	var divState;
	var divCollapse;
	var inputHighlight;
	var iter = 0;
	var p;
    //дальше идет рекурсивно: функция рисует все подэлементы у указанной ветки, затем рисует подэлементы у каждого потомка ветки и т.д.   
	$.drawTree = function(parentId) {	
		
		$.each(tree.values, function(elementId, value) {
			iter++;//считаем количество итераций
			if (tree.values[elementId].parent == parentId) {

				switch (tree.values[elementId].expand) {
			    case '+':
                    divExpand = 'glyphicon glyphicon-plus elTreeExpander';
                    break;
                case '-':
                    divExpand = 'glyphicon glyphicon-minus elTreeExpander';
                    break;
                default:
                    divExpand = 'glyphicon glyphicon-leaf';
                }
                
                switch (tree.values[elementId].state) {
                case 'selected':
                    divState = 'glyphicon glyphicon-check';                    
                    break;                
                default:
                    divState = 'glyphicon glyphicon-unchecked';                    
                }
                
                switch (tree.treeFocus){
                case elementId:
                    inputHighlight = 'elTreeFocusHighlight';                    
                    break;
                default:
                    inputHighlight = '';
                }
                
                p = tree.values[elementId].parent;
                if (p && tree.values[p].expand == '+') {
                    divCollapse = 'collapse';
                } else {
                    divCollapse = 'collapse in';
                }
				divElTree = '<div class="elTree ' + divCollapse + '" id="id' + elementId + '">'+
                                '<div class="input-group">'+
                                    '<span class="input-group-addon action">'+
                                        '<span class="' + divExpand + '"></span>'+
                                    '</span>'+
                                    '<input type="text" class="form-control '+inputHighlight+'" value="' + tree.values[elementId].name + '">'+
                                    '<span class="input-group-addon elCheckbox">'+
                                        '<span class="' + divState + '"></span>'+
                                    '</span>'+
                                '</div>'+
                            '</div>';
                if(tree.values[elementId].parent){
				        $("#id" + tree.values[elementId].parent).append(divElTree);
				        }else{
				        $("#id0").append(divElTree);
				        };
				$.drawTree(elementId);
			}			
		})
	}
	$.drawTree("");	
	alert('готов!'+iter);
}

//отображение свертывания/развертывания
$.elTreeToggleDraw = function(id) {
	//ищем кнопочку + или -,скрываем вложенные элементы, меняем кнопочку +/-	
	var selector = $('#id' + id).children('.input-group').find('.elTreeExpander');
	$('#id' + id).children(".elTree").collapse('toggle');
	if ((selector.hasClass("glyphicon-plus")) || (selector.hasClass("glyphicon-minus")))
		selector.toggleClass("glyphicon-plus").toggleClass("glyphicon-minus");
	}

//отображение флажка для выбранного элемента
$.elTreeSelectDraw = function(id) {
    $('#id' + id).children('.input-group').children('.input-group-addon.elCheckbox').children('span.glyphicon').toggleClass("glyphicon-check").toggleClass("glyphicon-unchecked");
}
//отображение подсветки фокуса
$.elTreeFocusDraw = function(id){
	$('#id' + id).children('.input-group').children('.form-control').toggleClass('elTreeFocusHighlight');
}

//режим редактирования
$.elTreeFocusEditDraw = function(id,unfocus) {
    if (unfocus == "1") {
        $('#id' + id).children('.input-group').children('.form-control').blur();       
    } else {                
        $('#id' + id).children('.input-group').children('.form-control').focus();        
    }
}

//добавляем элемент
$.elTreeAddDraw = function(id,prevId,parent){
    divElTree = '<div class="elTree" id="id' + id + '">'+
                                '<div class="input-group">'+
                                    '<span class="input-group-addon action">'+
                                        '<span class="glyphicon glyphicon-leaf"></span>'+
                                    '</span>'+
                                    '<input type="text" class="form-control" value="текст">'+
                                    '<span class="input-group-addon elCheckbox">'+
                                        '<span class="glyphicon glyphicon-unchecked"></span>'+
                                    '</span>'+
                                '</div>'+
                            '</div>';
    
    if (prevId)
        $('#id' + prevId).after(divElTree)
    else {
        if (parent)
            $('#id' + parent).prepend(divElTree)
        else
            $('#id0').prepend(divElTree)
         };    
}
