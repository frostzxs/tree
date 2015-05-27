/**
 * @author дом
 */

/** показывать подпункты:по событию.click по +/- выбрать все div с классом elTree на текущем уровне DOM и выполнить toggle
 */

/**Контроллер*/
/**отслеживаем открытие документа*/
$(document).ready(function() {
	$.documentReady();
	/**отслеживаем событие по клику на тексте и передаем модели*/
	$(".input-group-addon").click(function() {
		$.elTreeExpanderClick($(this).parent().parent(".elTree").attr('id').substr(2));
	});	
	
	
});
/*************************************************************/

/**Модель*/
/**читаем json, парсим в объект и передаем на отрисовку*/
$.documentReady = function() {
	var templ = '{"1":{"name":"уровень1","parent":"0","expand":"+"},\
				  "2":{"name":"уровень2","parent":"1","expand":"+"},\
				  "3":{"name":"уровень3","parent":"2","expand":""}}';
	var tree = jQuery.parseJSON(templ);
	$.treeDraw(tree);

	/**даем команду на отображение свертывания/развертывания*/
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
}
/*************************************************************/

/**Представление*/
/**Отрисовка дерева*/
$.treeDraw = function(tree) {
	var divElTree;
	var divExpand;
	var divCollapse;

	$.drawTree = function(parentId) {
		var p;

		$.each(tree, function(elementId, value) {
			if (tree[elementId].parent == parentId) {

				switch (tree[elementId].expand) {
				case "+":
					divExpand = "glyphicon glyphicon-plus elTreeExpander";
					break;
				case "-":
					divExpand = "glyphicon glyphicon-minus elTreeExpander";
					break;
				default:
					divExpand = "glyphicon glyphicon-leaf";
				}

				p = tree[elementId].parent;
				if (p != "0" && tree[p].expand == "+") {
					divCollapse = "collapse";
				} else {
					divCollapse = "collapse in";
				}

				divElTree = "<div class='elTree " + divCollapse + "' id='id" + elementId + "'>\
								<div class='input-group'>\
									<span class='input-group-addon'>\
										<span class='" + divExpand + "'></span>\
									</span>\
									<input type='text' class='form-control' value='" + tree[elementId].name + "'>\
								</div>\
							 </div>";
				$("#id" + tree[elementId].parent).append(divElTree);
				$.drawTree(elementId);
			}
		})
	}
	$.drawTree("0");
	alert('готов!');
}

/**отображение свертывания/развертывания*/
$.elTreeToggleDraw = function(id) {
	var selector = $('#id' + id).children('.input-group').children('.input-group-addon').children('.elTreeExpander');
	$('#id' + id).children(".elTree").collapse('toggle');

	/** найти подэлементы, если нашел, то, если показаны подэлементы, то показать -, если не показаны, то показать +
	 */
	if (selector.hasClass("glyphicon glyphicon-plus"))
		selector.removeClass("glyphicon glyphicon-plus").addClass("glyphicon glyphicon-minus")
	else if (selector.hasClass("glyphicon glyphicon-minus"))
		selector.removeClass("glyphicon glyphicon-minus").addClass("glyphicon glyphicon-plus");
}