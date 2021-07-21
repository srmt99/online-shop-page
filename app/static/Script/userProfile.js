// fetching user info from database
async function fetch_user_info(username){

  try {
      response = await fetch('http://127.0.0.1:5002/protected/user/profile/'+username, {
      method: "GET",
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    });
    console.log("RES:")
    console.log(response)
    return await response.json();
  } catch (error) {
    console.error('There has been a problem with fetching user info:', error);
  }
  
}

// setting user information in input boxes and in the header
async function set_user_info(username){
  
  console.log(username)
  info = await fetch_user_info(username)
  console.log("INFO:")
  console.log(info)
  info = info[0]
  document.getElementById("profile_title_h").innerHTML = info['name'] +" عزیز، خوش آمدید  "
  document.getElementById("profile_title_h2").innerHTML = "|"+ "موجودی حساب شما: " + info['credit']
  document.getElementById("name_input").placeholder = info['name']
  document.getElementById("lastname_input").placeholder = info['lastname']
  document.getElementById("address_input").placeholder = info['address']
}

var username = "user0@gmail.com"

document.getElementById("profile_title_b").addEventListener('click', async function(){
  try {
    // console.log("http://127.0.0.1:5002/protected/user/profile/"+username+"/inc_crd")
    response = await fetch("http://127.0.0.1:5002/protected/user/profile/"+username+"/inc_crd", {
      method: "GET",
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    });
  } catch (error) {
    console.error('There has been a problem with incrementing user credit:', error);
  }
  set_user_info(username)
});

// fetching receipts from database
async function fetch_receipts(r_code){
  try {
    response = await fetch('http://127.0.0.1:5002/receipts/'+r_code);
    return await response.json();
  } catch (error) {
    console.error('There has been a problem with fetching Receipts:', error);
  }
}

// fetching user receipts from database
async function fetch_user_receipts(username){
  try {
    response = await fetch('http://127.0.0.1:5002/protected/user/receipts/'+username,  {
      method: "GET",
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    });
    return await response.json();
  } catch (error) {
    console.error('There has been a problem with fetching user receipts:', error);
  }
}

// adding the receipts to receipt list
async function set_user_receipts(username){
  document.getElementById("receipt_section").innerHTML = `
                <div class="receipt_item" id="receipt_title">
                    <p class="item_1">کد پیگیری</p>
                    <p class="item_2">کالا</p>
                    <p class="item_3">قیمت پرداخت شده</p>
                    <p class="item_4">آدرس ارسال شده</p>
                    <p class="item_5">وضعیت</p>
                </div>
  `
  info = await fetch_user_receipts(username)
  // console.log(info)
  for (let [key, value] of Object.entries(info)) {
    const element = value;
    r_info =  await fetch_receipts(element['r_code'])
    r_info = r_info[0]
    document.getElementById("receipt_section").innerHTML += `
      <div class="receipt_item" id="receipt_title${key}">
          <p class="item_1">${element['r_code']}</p>
          <p class="item_2">${r_info['name']}</p>
          <p class="item_3">${r_info['price']}</p>
          <p class="item_4">${r_info['buyer_address']}</p>
          <p class="item_5">${r_info['status']}</p>
      </div>
    `
  }
}

function change_tab_rec(){
    document.getElementById('profile_title_h2').style.display = "none"
    document.getElementById('profile_title_b').style.display = "none"
    var tab = document.getElementById('rec_tab')
    tab.style.backgroundColor = "#cccccc";
    tab.style.color = "black";
    var tab = document.getElementById('pro_tab')
    tab.style.backgroundColor = "#ebebeb";
    tab.style.color = "gray";
    document.getElementById('profile_info').style.display = "none"
    document.getElementById('receipt_section').style.display = "block";
}
function change_tab_pro(){
    document.getElementById('profile_title_h2').style.display = "block"
    document.getElementById('profile_title_b').style.display = "none"
    document.getElementById('profile_title_b').style.display = "flex"
    var tab = document.getElementById('pro_tab')
    tab.style.backgroundColor = "#cccccc";
    tab.style.color = "black";
    var tab = document.getElementById('rec_tab')
    tab.style.backgroundColor = "#ebebeb";
    tab.style.color = "gray";
    document.getElementById('profile_info').style.display = "block"
    document.getElementById('receipt_section').style.display = "none";
}

// setting restrictions on NAME input
const fname = document.getElementById('name_input');
const fnameError = document.querySelector('#name_input + span.error');

fname.addEventListener('focus', function(event) {
  // first, we'll disappear all other input messages
  resetAll()
  if (fname.validity.valid) {
    // In case there is an error message visible, if the field
    // is valid, we remove the error message.
    fnameError.textContent = ''; // Reset the content of the message
    fnameError.className = 'error'; // Reset the visual state of the message
  } else {
    // If there is still an error, show the correct error
    showError(fname, fnameError);
  }
} );

fname.addEventListener('input', function (event) {
  // Each time the user types something, we check if the
  // form fields are valid.
  if (fname.validity.valid) {
    // In case there is an error message visible, if the field
    // is valid, we remove the error message.
    fnameError.textContent = ''; // Reset the content of the message
    fnameError.className = 'error'; // Reset the visual state of the message
  } else {
    // If there is still an error, show the correct error
    showError(fname, fnameError);
  }
});

// setting restrictions on LASTNAME input, same as above
const lname = document.getElementById('lastname_input');
const lnameError = document.querySelector('#lastname_input + span.error');

lname.addEventListener('focus', function(event) { 
  resetAll()
  if (lname.validity.valid) {
    lnameError.textContent = '';
    lnameError.className = 'error';
  } else {
    showError(lname, lnameError);
  } } );
lname.addEventListener('input', function (event) {
  if (lname.validity.valid) {
    lnameError.textContent = '';
    lnameError.className = 'error';
  } else {
    showError(lname, lnameError);
  }
});

// setting restrictions on PASSWORD input, same as above
const pass = document.getElementById('pass_input');
const passError = document.querySelector('#pass_input + span.error');

pass.addEventListener('focus', function(event) { 
  resetAll()
  if ((pass.validity.valid) && (/\d/.test(pass.value)) && (/\D/.test(pass.value)) ) {
    passError.textContent = '';
    passError.className = 'error';
  }
  else {
    pass.validity.valid = false;
    showError(pass, passError, minl=8, maxl=255, is_password=true);
  } } );

pass.addEventListener('input', function (event) {
  if ((pass.validity.valid) && (/\d/.test(pass.value)) && (/\D/.test(pass.value)) ) {
    passError.textContent = '';
    passError.className = 'error';
  }
  else {
    pass.validity.valid = false;
    showError(pass, passError, minl=8, maxl=255, is_password=true);
  }
});

// setting restrictions on ADDRESS input, same as above
const adrr = document.getElementById('address_input');
const adrrError = document.querySelector('#address_input + span.error');

adrr.addEventListener('focus', function(event) { 
  resetAll()
  if (adrr.validity.valid) {
    adrrError.textContent = '';
    adrrError.className = 'error';
  } else {
    showError(adrr, adrrError, maxl=10);
  } } );

adrr.addEventListener('input', function (event) {
  if (adrr.validity.valid) {
    adrrError.textContent = '';
    adrrError.className = 'error';
  } else {
    showError(adrr, adrrError, maxl=10);
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
form.addEventListener('submit', async function (event) {

  fname.value = fname.value.trim()
  lname.value = lname.value.trim()

  if ((!fname.validity.valid) || (!lname.validity.valid) ||
     (!pass.validity.valid) || (!adrr.validity.valid)) {
    // If all inputs aren't valid, we display an appropriate error message 
    message = document.getElementById('modal-message')
    message.innerHTML = `
    <p>تغییر اطلاعات شما انجام نشد</p>
    <p>اشکالی در اطلاعات وارد شده وجود دارد</p>
    <p>لطفا دوباره فیلد های وارد شده را برسی کنید</p>
    `;

    document.getElementById("modal").style.borderColor = 'red';
    document.getElementById("modalWindow").style.display = "block";
    // Then we prevent the form from being sent by canceling the event
    event.preventDefault();
  }
  else { // form is valid

    // const data = {
    //   "name": name,
    //   "lastname" : lastname,
    //   "password" : password,
    //   "address" : address
    //   }
    
    try {
      url = "http://127.0.0.1:5002/protected/user/profile/"+username+"/update_prof?name="+fname.value
      +"&lastname="+lname.value+"&password="+pass.value+"&address="+adrr.value, {
        method: "GET",
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
      }
      response = await fetch(url)
    } catch (error) {
      console.error('There has been a problem with sumbiting user info:', error);
    }
    // set_user_info(username)

    message = document.getElementById('modal-message')
    message.innerHTML = `
    <p>تغییر اطلاعات شما با موفقیت انجام شد</p>
    `;
    document.getElementById("modal").style.borderColor = '#30f04d';
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
    else if(is_password)
    {
        entityERROR.textContent = 'رمز عبور باید شامل لااقل یک عدد و یک حرف باشد';
    }
  
    // Set the styling appropriately
    entityERROR.className = 'error active';
  }
function resetAll() {
  fnameError.textContent = '';
  lnameError.textContent = '';
  passError.textContent = '';
  adrrError.textContent = '';
}

set_user_info(username) // THIS HAS TO CHANGE FOR EACH LOGGED IN USER
set_user_receipts(username) // THIS HAS TO CHANGE FOR EACH LOGGED IN USER