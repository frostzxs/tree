/**
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
		$.elTreeExpanderClick($(this).parent().parent(".elTree").attr('id').substr(2));
	});
	
	/**отслеживаем событие по клику на флажке и передаем модели*/
    $(".input-group-addon.elCheckbox").click(function() {
        $.elTreeCheckboxClick($(this).parent().parent(".elTree").attr('id').substr(2));
    });	
	
});
/*************************************************************/

/**Модель*/
/**читаем json, парсим в объект и передаем на отрисовку*/
$.documentReady = function() {
	var templ = '{"1":{"name":"уровень1","parent":"0","expand":"-","state":"selected"},'+
	            ' "2":{"name":"уровень2","parent":"1","expand":"-","state":"focused"},'+
	            ' "3":{"name":"уровень3","parent":"2","expand":"+" ,"state":""},'+
	            ' "4":{"name":"уровень4","parent":"3","expand":"" ,"state":""},'+
	            ' "5":{"name":"уровень4","parent":"3","expand":"" ,"state":""},'+
	            ' "6":{"name":"уровень4","parent":"3","expand":"" ,"state":""},'+
	            ' "7":{"name":"уровень4","parent":"3","expand":"" ,"state":""},'+
	            ' "8":{"name":"уровень4","parent":"3","expand":"" ,"state":""},'+	            
	            ' "9":{"name":"уровень3","parent":"2","expand":"" ,"state":""}}';
	var tree = jQuery.parseJSON(templ);
	$.treeDraw(tree);

	/**фиксируем свертывание/развертывание в модели и даем команду на отображение свертывания/развертывания*/
	$.elTreeExpanderClick = function(id) {
		switch (tree[id].expand ) {
		case "+":
			tree[id].expand = "-";
			break;
		case "-":
			tree[id].expand = "+";
			break;
		}
		$.elTreeToggleDraw(id);
	}
	/**фиксируем выбор в модели и даем команду на отображение выбора(переключение флажка элемента)*/
	$.elTreeCheckboxClick = function(id) {
	    switch (tree[id].state ) {
        case "selected":
            tree[id].state = "";
            break;
        default:        
            tree[id].state = "selected";
            break;
        }
        $.elTreeSelectDraw(id);
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
		
		$.each(tree, function(elementId, value) {
			iter++;
			if (tree[elementId].parent == parentId) {

				switch (tree[elementId].expand) {
			    case '+':
                    divExpand = 'glyphicon glyphicon-plus elTreeExpander';
                    break;
                case '-':
                    divExpand = 'glyphicon glyphicon-minus elTreeExpander';
                    break;
                default:
                    divExpand = 'glyphicon glyphicon-leaf';
                }
                
                switch (tree[elementId].state) {
                case 'selected':
                    divState = 'glyphicon glyphicon-check';
                    inputHighlight = 'elTreeSelectedHighlight';
                    break;                
                default:
                    divState = 'glyphicon glyphicon-unchecked';
                    inputHighlight = '';
                }

                p = tree[elementId].parent;
                if (p != '0' && tree[p].expand == '+') {
                    divCollapse = 'collapse';
                } else {
                    divCollapse = 'collapse in';
                }
				divElTree = '<div class="elTree ' + divCollapse + '" id="id' + elementId + '">'+
                                '<div class="input-group">'+
                                    '<span class="input-group-addon action">'+
                                        '<span class="' + divExpand + '"></span>'+
                                    '</span>'+
                                    '<input type="text" class="form-control '+inputHighlight+'" value="' + tree[elementId].name + '">'+
                                    '<span class="input-group-addon elCheckbox">'+
                                        '<span class="' + divState + '">'+
                                    '</span>'+
                                '</div>'+
                            '</div>';
				$("#id" + tree[elementId].parent).append(divElTree);		
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

/**отображение подсветки выбранного элемента*/
$.elTreeSelectDraw = function(id) {
    $('#id' + id).children('.input-group').children('.input-group-addon.elCheckbox').children('span.glyphicon').toggleClass("glyphicon-check").toggleClass("glyphicon-unchecked");
    $('#id' + id).children('.input-group').children('.form-control').toggleClass('elTreeSelectedHighlight');       
}

