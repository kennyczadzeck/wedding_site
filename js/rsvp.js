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

  var url = 'https://script.google.com/macros/s/AKfycbzGAaRHkQqHYcROROpbUOFn7enu8h5210gXzYC-do9cPMSaT1XM/exec';

  var toggle = function(elem, time, cb) {
    // Toggles an element from being shown or hidden.
    elem.show('fast');
    setTimeout(function() {
      elem.hide('fast');
      cb ? cb() : null;
    }, time);
  };

  var validateInputs = function($form) {
    var inputs = [
      'name', 
      '"number of guests"', 
      '"guest name(s)"',
      'phone', 
      'email' 
    ];
    function inputValue(name) {
      return $form.find('input[name='+name+']').val();
    };
    for (var i = 0; i < inputs.length; i++) {
      var value = inputValue(inputs[i]);
      if (i === 1 && value !== '' && isNaN(parseInt(value))) {
        return 'Number of guests must be a number';
      }
      else if (i === 1 && parseInt(value) < 1) {
        return 'Total number of guests must be at least one (yourself)';
      }
      else if (i === 2 && parseInt(inputValue(inputs[1])) > 1 && !inputValue(inputs[2])) {
        return 'Please provide the names of your guest(s)';
      }
      else if (i === 2 && parseInt(inputValue(inputs[1])) === 1 && inputValue(inputs[2])) {
        return 'Do not include additional guest names when RSVPing as a single guest';
      }
      else if (!value && i !== 2) {
        return 'Please provide your '+inputs[i].replace(/\"/g, '');
      } else {
        continue
      }
    }
  };

  var submitRsvp = function($form, alert) {
    // Sets form-submission listener and handler 
    $('#submit-rsvp').on('click', function(e) {
      e.preventDefault();
      var missingData = validateInputs($form);
      if (missingData) {
        alert.$warning.html(missingData);
        toggle(alert.$warning, 2500, function() {
          alert.$warning.html('');
        });
      } else {
        var submitButton = $('#submit-rsvp');
        submitButton.attr('disabled', 'disabled');
        submitButton.html('Please wait...');
        $.ajax({
          url: url,
          method: 'GET',
          dataType: 'json',
          data: $form.serialize()
        })
        .done(function(resp) {
          toggle(alert.$success, 1250, function() {
            $.fancybox.close();
            $form.find('input[type=text]').val('');
            submitButton.removeAttr('disabled');
            submitButton.html('Submit');
          });
        })
        .fail(function(err) {
          console.log(err);
          toggle(alert.$error, 1250);
        });
      }
    });
  };

  var renderForm = function() {
    // Renders the HTML template defined at top of file
    $('.form-zone').append(formTemplate);
  }

  var init = function(){
    // Render HTML and register event listeners
    var $form = $('form#rsvp-form');
    var alert = {
      $success: $('#submit-success').hide(), 
      $warning: $('#submit-warning').hide(),
      $failure: $('#submit-failure').hide()
    };
    submitRsvp($form, alert);
  }

  // Interface
  return { init: init };
})();