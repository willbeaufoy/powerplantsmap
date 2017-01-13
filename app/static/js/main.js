$(document).ready(function() {
    $('#close-panel').click(function() {
        $('#panel').hide()

        // Refresh map to avoid grey space
        var evt = document.createEvent('UIEvents');
        evt.initUIEvent('resize', true, false, window, 0);
        window.dispatchEvent(evt);

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