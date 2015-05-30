/**
 *
 * @author дом
 */

/** показывать подпункты:по событию.click по +/- выбрать все div с классом elTree на текущем уровне DOM и выполнить toggle
 */

/**Контроллер*/
/**отслеживаем открытие документа*/
$(document).ready(function() {
	$.documentReady();
	/**отслеживаем событие по клику на иконке развертывания и передаем модели*/
	$(".input-group-addon.action").click(function() {
		var elId = $(this).parent().parent(".elTree").attr('id').substr(2);
		$.elTreeExpanderClick(elId);
		$.elTreeFocus(elId);
	});
	
	/**отслеживаем событие по клику на флажке и передаем модели*/
    $(".input-group-addon.elCheckbox").click(function() {
    	var elId = $(this).parent().parent(".elTree").attr('id').substr(2);
        $.elTreeCheckboxClick($(this).parent().parent(".elTree").attr('id').substr(2));
        $.elTreeFocus(elId);
    });	
	
	/**отлавливаем нажатие enter на элементе*/
    $(".form-control").keypress(function(e) {        
        if (e.keyCode == 13) {
            //нажата клавиша enter - здесь ваш код            
            $(this).blur();         
        }
    }); 
    
	
	$(".form-control").focus(function() {
		var elId = $(this).parent().parent(".elTree").attr('id').substr(2);
		$.elTreeFocus(elId);
		$.elTreeFocusEdit("true");
	});
	
    $(".form-control").focusout(function(){
        $.elTreeFocusEdit("");            
    });
    
    $(document).keydown(function(e){
        $.elTreeKey(e.keyCode);
    })
});
/*************************************************************/

/**Модель*/
/**читаем json, парсим в объект и передаем на отрисовку*/
$.documentReady = function() {
	var templ = '{'+
				'"treeFocus":"2",'+
				'"treeFocusEdit":"",'+
				'"values":{'+
				' "1":{"name":"уровень1","parent":"0","expand":"-","state":"selected","prev":"" },'+
	            ' "2":{"name":"уровень2","parent":"1","expand":"-","state":"","prev":"1" },'+
	            ' "3":{"name":"уровень3","parent":"2","expand":"+" ,"state":"","prev":"2" },'+
	            ' "4":{"name":"уровень4","parent":"3","expand":"" ,"state":"","prev":"3" },'+
	            ' "5":{"name":"уровень45","parent":"3","expand":"" ,"state":"","prev":"4" },'+
	            ' "6":{"name":"уровень46","parent":"3","expand":"" ,"state":"","prev":"5" },'+	            
	            ' "7":{"name":"уровень4","parent":"3","expand":"" ,"state":"","prev":"7" },'+
	            ' "8":{"name":"уровень4","parent":"3","expand":"" ,"state":"","prev":"6" },'+
	            ' "9":{"name":"уровень3","parent":"2","expand":"" ,"state":"","prev":"8" },'+
                ' "10":{"name":"уровень4","parent":"3","expand":"" ,"state":"","prev":"9" },'+                         
	            ' "50":{"name":"уровень3","parent":"2","expand":"" ,"state":"","prev":"10"}}}';
	var tree = jQuery.parseJSON(templ);	
	$.treeDraw(tree);

	/**фиксируем свертывание/развертывание в модели и даем команду на отображение свертывания/развертывания*/
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
	
	/**фиксируем выбор в модели и даем команду на отображение выбора(переключение флажка элемента)*/
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
	
	/**фиксируем фокус в модели и даем команду на отображение фокуса*/
	$.elTreeFocus = function(id) {
	    
		if (tree.treeFocus != id){
			$.elTreeFocusDraw(tree.treeFocus);//убираем старый фокус
			$.elTreeFocusDraw(id);//ставим новый фокус
			tree.treeFocus = id;
    }      
	}
	
	
    
    $.elTreeKey = function(key) {
        var next;
        if (tree.treeFocusEdit == "") {
            switch(key) {
            case 38:
                if (tree.values[tree.treeFocus].prev) 
                    $.elTreeFocus(tree.values[tree.treeFocus].prev);
                break;
            case 40:
                next = $.nextId(tree.treeFocus);
                if (next) 
                    $.elTreeFocus(next);
                break;
            }

        }
    }

    
    $.nextId = function(id) {
        var idNextFound = "";
        $.each(tree.values, function(idNext, value) {
            if (tree.values[idNext].prev == id)
                idNextFound = idNext;
        });
        return idNextFound;
    }



	
    $.elTreeFocusEdit = function(checker) {
        if (checker) {
            tree.treeFocusEdit = "true";            
        } else {
            tree.treeFocusEdit = "";            
        }
    }

}
/*************************************************************/

/**Представление*/
/**Отрисовка дерева из модели*/
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
                if (p != '0' && tree.values[p].expand == '+') {
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
				$("#id" + tree.values[elementId].parent).append(divElTree);
				$.drawTree(elementId);
			}			
		})
	}
	$.drawTree("0");	
	alert('готов!'+iter);
}

/**отображение свертывания/развертывания*/
$.elTreeToggleDraw = function(id) {
	//ищем кнопочку + или -,скрываем вложенные элементы, меняем кнопочку +/-	
	var selector = $('#id' + id).children('.input-group').find('.elTreeExpander');
	$('#id' + id).children(".elTree").collapse('toggle');
	if ((selector.hasClass("glyphicon-plus")) || (selector.hasClass("glyphicon-minus")))
		selector.toggleClass("glyphicon-plus").toggleClass("glyphicon-minus");
	}

/**отображение флажка для выбранного элемента*/
$.elTreeSelectDraw = function(id) {
    $('#id' + id).children('.input-group').children('.input-group-addon.elCheckbox').children('span.glyphicon').toggleClass("glyphicon-check").toggleClass("glyphicon-unchecked");
}
/**отображение подсветки фокуса*/
$.elTreeFocusDraw = function(id){
	$('#id' + id).children('.input-group').children('.form-control').toggleClass('elTreeFocusHighlight');
}

/**режим редактирования*/

/**перемещение по дереву*/
