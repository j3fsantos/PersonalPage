$(function () {
	var papers = $('#papers .bibtex');
	
	$('#bibtex_div div').each(function(index){
		var bibtex_div = $(this);
		//alert($(papers[index]).text()); 
		$(papers[index]).click(function () {
		    bibtex_div.dialog({
			title: 'Bibtex', 
			buttons: {
				Dismiss: function () {
					$(this).dialog('close');
				}
			}, 
			width: 800});	
		});	
	});
	
});
