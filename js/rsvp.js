var formTemplate = (function () {/*
  <a class="fancybox" data-fancybox="formmodal" data-src="#formmodal" href="javascript:;"><div class="a-wrap"><h2 style="font-weight: 600;">RSVP Here!</h2></div></a>        
  <div id="formmodal" style="display: none;"><!-- begin modal content -->
    <div class="container-fluid">

      <form id="rsvp-form">
        <div class="form-group">
          <label for="name">name</label>
          <input type="text" name="name" class="form-control" placeholder="name"/>
        </div>

         <div class="form-group">
           <label for="number of guests">number of guests</label>
           <input type="text" name="number of guests" class="form-control" placeholder="number of guests"/>
         </div>

         <div class="form-group">
           <label for="guest name(s)">guest name(s)</label>
           <input type="text" name="guest name(s)" class="form-control" placeholder="guest name(s)"/>
         </div>

         <div class="form-group">
           <label>dietary restrictions</label>
           <input type="text" name="dietary restrictions" class="form-control" placeholder="dietary restrictions"/>
         </div>

         <div class="form-group">
           <label>phone</label>
           <input type="text" name="phone" class="form-control" placeholder="phone"/>
         </div>

         <div class="form-group">
           <label>email</label>
           <input type="text" name="email" class="form-control" placeholder="email"/>
         </div>
         
         <div class="form-group">
           <label>accomodations</label>
           <input type="text" name="accomodations" class="form-control" placeholder="accomodations"/>
         </div>

         <div class="form-group">
           <button type="submit" id="submit-rsvp" class="btn btn-primary">Submit</button>
         </div>
       </form>
       <div class="alert alert-success" id="submit-success" role="alert">Success!</div>
       <div class="alert alert-danger" id="submit-failure" role="alert">Try again!</div>
     </div>
   </div>        
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];


// RSVP Form Code
var RSVP = (function() {
  console.log(alert)

  var url = 'https://script.google.com/macros/s/AKfycbzGAaRHkQqHYcROROpbUOFn7enu8h5210gXzYC-do9cPMSaT1XM/exec';

  var toggle = function(elem, time, cb) {
    // Toggles an element from being shown or hidden.
    elem.show('fast');
    setTimeout(function() {
      elem.hide('fast');
      cb();
    }, time);
  };

  var submitRsvp = function($form, alert) {
    // Sets form-submission listener and handler 
    $('#submit-rsvp').on('click', function(e) {
      e.preventDefault();
      $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        data: $form.serialize()
      })
      .done(function(resp) {
        toggle(alert.$success, 2000, function() {
          $.fancybox.close();
          $form.find('input[type=text]').val('');
        });
      })
      .fail(function(err) {
        console.log(err);
        toggle(alert.$error, 2000);
      });
    });
  };

  var renderForm = function() {
    // Renders the HTML template defined at top of file
    $('.form-zone').append(formTemplate);
  }

  var init = function(){
    // Render HTML and register event listeners
    renderForm();
    var $form = $('form#rsvp-form');
    var alert = {
      $success: $('#submit-success').hide(), 
      $failure: $('#submit-failure').hide()
    };
    submitRsvp($form, alert);
  }

  // Interface
  return { init: init };
})();