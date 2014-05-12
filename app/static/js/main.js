$(document).ready(function() {
    $('#close-panel').click(function() {
        $('#panel').hide()
        $('#open-panel').show()
    })
    
    $('#open-panel').click(function() {
        $(this).hide()
        $('#panel').show()
    })
    
    hide_subtypes = true
    $('#toggle-l3').click(function() {
        if(hide_subtypes) {
            $(this).text('Hide subtypes')
            hide_subtypes = false
        }
        else {
            $(this).text('Show subtypes')
            hide_subtypes = true
        }
        $('ul.l3').toggleClass("hide")
    })
})