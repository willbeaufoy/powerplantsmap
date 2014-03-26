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

   //  $(':checkbox.all-country-filter').change(function() {
//         console.log(this.checked)
//         if(this.checked) {
//             $(':checkbox.continent-filter').prop("checked", true)
//             $(':checkbox.country-filter').prop("checked", true)
//         }
//         else {
//             $(':checkbox.continent-filter').prop("checked", false)
//             $(':checkbox.country-filter').prop("checked", false)
//         }
//     })
// 
//     $(':checkbox.all-type-filter').change(function() {
//         console.log(this.checked)
//         if(this.checked) {
//             $(':checkbox.type-filter').prop("checked", true)
//         }
//         else {
//             $(':checkbox.type-filter').prop("checked", false)
//         }
// })

})