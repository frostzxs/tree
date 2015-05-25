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
	$(".elTreeExpander").click(function() {
		$.elTreeExpanderClick(this);
	});
});
/*************************************************************/

/**Модель*/
/**читаем json, парсим в объект и передаем на отрисовку*/
$.documentReady = function() {
	var templ = '{"1":{"name":"уровень1","parent":"0","expand":"+"},"2":{"name":"уровень2","parent":"1","expand":"-"},"3":{"name":"уровень3","parent":"2","expand":""}}';
	var tree = jQuery.parseJSON(templ);
	$.treeDraw(tree);
}
/**даем команду на отображение свертывания/развертывания*/
$.elTreeExpanderClick = function(selector) {
	$.elTreeToggleDraw(selector);
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
					divExpand = "glyphicon glyphicon-plus";
					break;
				case "-":
					divExpand = "glyphicon glyphicon-minus";
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

				divElTree = "<div class='elTree " + divCollapse + "' id='id" + elementId + "'><p><span class='" + divExpand + " elTreeExpander'></span><span class='elTreeText'>" + tree[elementId].name + "</span></p></div>";
				$("#id" + tree[elementId].parent).append(divElTree);
				$.drawTree(elementId);
			}
		})
	}
	$.drawTree("0");
	alert('готов!');
}
/**отображение свертывания/развертывания*/
$.elTreeToggleDraw = function(selector) {
	$(selector).parent().parent().find(".elTree").collapse('toggle');

	/** найти под элементы, если нашел, то, если показаны подэлементы, то показать -, если не показаны, то показать +
	 */
	if ($(selector).hasClass("glyphicon glyphicon-plus"))
		$(selector).removeClass("glyphicon glyphicon-plus").addClass("glyphicon glyphicon-minus")
	else if ($(selector).hasClass("glyphicon glyphicon-minus"))
		$(selector).removeClass("glyphicon glyphicon-minus").addClass("glyphicon glyphicon-plus");
}