$(document).ready(function() {
	var adr = ["<a href=\"mai", "lto:", "will@wil", "lbeaufoy.net\">wil", "l@willbea", "ufoy.net</a>"]
	$('#ctc').click(function() {
		var $this = $(this)
		$this.html($this.html() == adr.join('') ? 'Get in touch' : adr.join(''))
	});
})

$(document).ready(function() {
	$('a[data-toggle="collapse"] i').click(function() {
		var hidden = 'icon-chevron-right'
		var shown = 'icon-chevron-down'
		console.log($(this))
		if($(this).hasClass(hidden)) {
			$(this).addClass(shown)
			$(this).removeClass(hidden)
		}
		else {
			$(this).addClass(hidden)
			$(this).removeClass(shown)
		}
	});
})