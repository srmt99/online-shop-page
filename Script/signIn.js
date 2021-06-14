// setting restrictions on EMAIL input
const email = document.getElementById('email_input');
const emailError = document.querySelector('#email_input + span.error');

email.addEventListener('focus', function(event) { 
    passError.textContent = '';
  // first, we'll disappear all other input message
  if (email.validity.valid) {
    // In case there is an error message visible, if the field
    // is valid, we remove the error message
    emailError.textContent = ''; // Reset the content of the message
    emailError.className = 'error'; // Reset the visual state of the message
  } else {
      // If there is still an error, show the correct error
    showError(email, emailError);
  } } );

email.addEventListener('input', function (event) {
  // Each time the user types something, we check if the
  // form fields are valid.
  if (email.validity.valid) {
      // In case there is an error message visible, if the field
    // is valid, we remove the error message.
    emailError.textContent = ''; // Reset the content of the message
    emailError.className = 'error'; // Reset the visual state of the message
  } else {
      // If there is still an error, show the correct error
    showError(email, emailError);
  }
});

// setting restrictions on PASSWORD input, same as above
const pass = document.getElementById('pass_input');
const passError = document.querySelector('#pass_input + span.error');

pass.addEventListener('focus', function(event) { 
    emailError.textContent = '';
  if (pass.validity.valid) {
    passError.textContent = '';
    passError.className = 'error';
  }
  else {
    showError(pass, passError);
  } } );

pass.addEventListener('input', function (event) {
  if (pass.validity.valid) {
    passError.textContent = '';
    passError.className = 'error';
  }
  else {
    showError(pass, passError);
  }
});

const form  = document.getElementsByTagName('form')[0];
// Get the modal
var modal = document.getElementById("modalWindow");
// Get the <span> element that closes the modal
var closeModal = document.getElementsByClassName("modalClose")[0];
// When the user clicks on the button, open the modal
closeModal.onclick = function() {
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
} 
form.addEventListener('submit', function (event) {

  
  var users = {"test@test":"123", "mamad@mamad":"123", "ali@mamad":"111"};

  email.value = email.value.trim()

  if ((!email.validity.valid) ||(!pass.validity.valid)) {
    // If all inputs aren't valid, we display an appropriate error message 
    message = document.getElementById('modal-message')
    message.innerHTML = `
    <p>ورود شما انجام نشد</p>
    <p>لطفا یک ایمیل معتبر و رمز عبور را وارد کنید</p>
    `;

    document.getElementById("modal").style.borderColor = 'red';
    modal.style.display = "block";
    // Then we prevent the form from being sent by canceling the event
    event.preventDefault();
  }
  else if ((email.value in users) && (pass.value!=users[email.value])) { // if the email is valid but not correct
    message = document.getElementById('modal-message')
    message.innerHTML = `
    <p>ورود شما انجام نشد</p>
    <p>ایمیل یا رمز عبور صحیح نیست</p>
    `;
    document.getElementById("modal").style.borderColor = 'red';
    modal.style.display = "block";
    // Then we prevent the form from being sent by canceling the event
    event.preventDefault();
  }
  else if ((email.value in users) && (pass.value==users[email.value])) { // form is valid
    message = document.getElementById('modal-message')
    message.innerHTML = `
    <p>شما با موفقیت وارد شدید</p>
    `;
    document.getElementById("modal").style.borderColor = '#30f04d';
    modal.style.display = "block";
    // handle the event
    event.preventDefault();
  }
  else { // no such user exists
    message = document.getElementById('modal-message')
    message.innerHTML = `
    <p>ورود شما انجام نشد</p>
    <p>این ایمیل ثبت نشده است</p>
    `;
    document.getElementById("modal").style.borderColor = 'red';
    modal.style.display = "block";
    // handle the event
    event.preventDefault();
  }
});

function showError(entity, entityERROR, minl=0, maxl=255, is_password=false) {
    if(entity.validity.valueMissing) {
      // If the field is empty,
      // display the following error message.
      entityERROR.textContent = 'این فیلد نباید خالی باشد';
    } else if(entity.validity.typeMismatch) {
      // If the field doesn't contain an name address,
      // display the following error message.
      entityERROR.textContent = 'یک مقدار معتبر وارد نمایید';
    } else if(entity.validity.tooLong || entity.value.length>maxl) {
      // If the data is too long,
      // display the following error message.
      entityERROR.textContent = `حداکثر تعداد کاراکتر قابل قبول ${ maxl } است`;
    }
    else if(entity.validity.tooShort || entity.value.length<minl) {
        // If the data is too short,
        // display the following error message.
        entityERROR.textContent = `حداقل تعداد کاراکتر قابل قبول ${ minl } است`;
      }
  
    // Set the styling appropriately
    entityERROR.className = 'error active';
  }