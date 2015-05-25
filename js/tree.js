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

/**Модель*/

/**отрисовываем документ*/
$.documentReady = function() {
	var templ = '{"values":[{"id":"1","name":"уровень1","parent":"0"},{"id":"2","name":"уровень2","parent":"1"}]}';
	var tree = jQuery.parseJSON(templ);
	$.treeDraw(tree);
}
/**даем команду на отображение свертывания/развертывания*/
$.elTreeExpanderClick = function(selector) {
	$.elTreeToggleDraw(selector);
}
/**Представление*/
/**Отрисовка дерева по json*/
$.treeDraw = function(tree) {
	var elementsTree = tree.values;
	var divTree;
	for (var i in elementsTree) {
		divTree = "<div class='elTree' id='id" + elementsTree[i].id + "'><p><span class='glyphicon glyphicon-minus elTreeExpander'></span><span class='elTreeText'>" + elementsTree[i].name + "</span></p></div>";
		if (elementsTree[i].parent == "0") {
			$("div.tree").append(divTree)
		} else {
			$("#id" + elementsTree[i].parent).append(divTree)
		}
	}
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