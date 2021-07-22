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
  else { // form is valid
    
    /**
     * JWT token authentication and protected resource access example
     */
    
    let postData = {
      "username": email.value,
      "password": pass.value
    };
    jsonData = JSON.stringify(postData);
    fetch('http://127.0.0.1:5002/login/?username='+postData['username']+'&password='+postData['password'], {
      method: "POST",
      body: JSON.stringify(postData)
    }).then(res => res.json())
    .then(function (data) {
      console.log("JWT Token:")
      console.log(data)
      if( data['msg']  == "Bad username"){
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
      else if ( data['msg']  == "Bad username or password"){
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
      else {
        let jwtToken = data['access_token'];
        localStorage.setItem('jwt', jwtToken)
        message = document.getElementById('modal-message')
        message.innerHTML = `
        <p>شما با موفقیت وارد شدید</p>
        `;
        document.getElementById("modal").style.borderColor = '#30f04d';
        modal.style.display = "block";

        // info = await fetch_user_info(username) = 
        // document.getElementById("menu-button-div").innerHTML = `
        //     <button class="white-button-yellow-border">${}</button>
        //     <div class="hidden-div">
        //         <div id="menu-dropdown" class="dropdown-content">
        //             <a href="#" class="nav-submenu-item">پروفایل</a>
        //             <a href="#" class="nav-submenu-item">خروج از حساب</a>
        //         </div>
        //     </div>
        //`
                    

        // window.setTimeout(function(){
        //   // Move to a new location 
        // window.location.href = "file:///E:/soroush/hW/WD/project/online-shop-page/index.html"; }, 2000);
         window.setTimeout(function(){
           console.log(postData['username'])
           // Move to a new location
         if (postData['username']=='jesus@christ'){
          window.location.href = "http://127.0.0.1:5002/AdminProfile.html"; 
         }
         else {
          window.location.href = "http://127.0.0.1:5002/userProfile.html"; 
         }
        }, 2000);

      }
    });
    // handle the event
    event.preventDefault();
  }
});

// fetching user info from database
// async function fetch_user_info(username){

//   try {
//       response = await fetch('http://127.0.0.1:5002/protected/user/profile/'+username, {
//       method: "GET",
//       headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
//     });
//     console.log("RES:")
//     console.log(response)
//     return await response.json();
//   } catch (error) {
//     console.error('There has been a problem with fetching user info:', error);
//   }
  
// }
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