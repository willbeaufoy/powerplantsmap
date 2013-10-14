function geocode(id){
   var address = $('textarea[name="' + id + 'address"]').val()
   var geocoder = new google.maps.Geocoder()
   geocoder.geocode({
      'address': address
   },
   function(results, status){
      if(status == google.maps.GeocoderStatus.OK){
         $('input[name="' + id + 'latitude"]').val(results[0].geometry.location.lat())
         $('input[name="' + id + 'longitude"]').val(results[0].geometry.location.lng())
      }
      else {
         $('input[name="' + id + 'latitude"]').val('Geocoding failed')
         $('input[name="' + id + 'longitude"]').val('Geocoding failed')
      }
   })
}

function onLeaveAddress(){
   $('textarea[name$="address"]').focusout(function(){
      console.log('ert')
      var name = $(this).attr('name')
      var id = name.replace('address', '')
      geocode(id)
   })
}

$(document).ready(function(){
   
   onLeaveAddress()
   
   if($('span#successmessage').hasClass('success')) {
      $(':text').removeAttr('value')
      $('textarea').text('')
   }
   
   $('#addRow').click(function() {
      var newRow = $('tbody tr:first-child').clone()
      newRow.find(':text').each(function(){
         $(this).removeAttr('value')
      })
      var newNum = '-' + $('tbody tr').size() + '-'
      newRow.html(function(i, oldHTML) {
         return oldHTML.replace(/-0-/g, newNum)
      })
      $('tbody').append(newRow)
      onLeaveAddress()
   })   
   
   $('#removeRow').click(function() {
      if($('tbody tr').size() > 1) {
         $('tbody tr:last-child').remove()
      }
   }) 
})
   