/**
 * @author дом
 */

/** показывать подпункты:по событию.click по +/- выбрать все div с классом elTree на текущем уровне DOM и выполнить toggle
 */
$(".expander").click(function() {
	$(this).parent().parent().find(".elTree").collapse('toggle');
	
	/** найти под элементы, если нашел, то, если показаны подэлементы, то показать -, если не показаны, то показать +
	 */
	if ($(this).hasClass("glyphicon glyphicon-plus"))
		$(this).removeClass("glyphicon glyphicon-plus").addClass("glyphicon glyphicon-minus")
	else if ($(this).hasClass("glyphicon glyphicon-minus"))
		$(this).removeClass("glyphicon glyphicon-minus").addClass("glyphicon glyphicon-plus");

});
