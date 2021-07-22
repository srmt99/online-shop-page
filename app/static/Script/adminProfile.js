// checking login status
let loginP = new Promise(function (myResolve, myReject) {
  let token = localStorage.getItem('jwt');
  if (token == null) { myReject("Logged Out");}
  else {
      fetch('http://127.0.0.1:5002/protected/user/get_username/', {
          method: "GET",
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
      }).then(res => res.json())
          .then(function (data) {
            username = data ;
            myResolve("Logged In");
          });
  }
});
var username = ""
loginP.then(
  function (value) { console.log("USERNAME:"+username)
  if (username!="jesus"){
    window.location.href = "http://127.0.0.1:5002/userProfile.html"
  } },
  function (error) { window.location.href = "http://127.0.0.1:5002/SignIn.html" }
);

function change_tab_rec(){
    var tab = document.getElementById('rec_tab')
    tab.style.backgroundColor = "#cccccc";
    tab.style.color = "black";
    var tab = document.getElementById('pro_tab')
    tab.style.backgroundColor = "#ebebeb";
    tab.style.color = "gray";
    var tab = document.getElementById('cat_tab')
    tab.style.backgroundColor = "#ebebeb";
    tab.style.color = "gray";
    document.getElementById('new-product').style.display = "none"
    document.getElementsByClassName('product-list')[0].style.display = "none"
    document.getElementById('receipt_section').style.display = "block";
    document.getElementById('category_section').style.display = "none";
    document.getElementById('receipt_search').style.display = "flex";
    
}
function change_tab_pro(){
    var tab = document.getElementById('pro_tab')
    tab.style.backgroundColor = "#cccccc";
    tab.style.color = "black";
    var tab = document.getElementById('rec_tab')
    tab.style.backgroundColor = "#ebebeb";
    tab.style.color = "gray";
    var tab = document.getElementById('cat_tab')
    tab.style.backgroundColor = "#ebebeb";
    tab.style.color = "gray";
    document.getElementById('new-product').style.display = "block"
    document.getElementsByClassName('product-list')[0].style.display = "grid"
    document.getElementById('receipt_section').style.display = "none";
    document.getElementById('category_section').style.display = "none";
    document.getElementById('receipt_search').style.display = "none";
}
function change_tab_cat(){
    var tab = document.getElementById('cat_tab')
    tab.style.backgroundColor = "#cccccc";
    tab.style.color = "black";
    var tab = document.getElementById('rec_tab')
    tab.style.backgroundColor = "#ebebeb";
    tab.style.color = "gray";
    var tab = document.getElementById('pro_tab')
    tab.style.backgroundColor = "#ebebeb";
    tab.style.color = "gray";
    document.getElementById('new-product').style.display = "none"
    document.getElementsByClassName('product-list')[0].style.display = "none"
    document.getElementById('receipt_section').style.display = "none";
    document.getElementById('category_section').style.display = "block";
    document.getElementById('receipt_search').style.display = "none";
}


// fetching products from database
async function fetch_products(){
    try {
      response = await fetch('http://127.0.0.1:5002/product/all_product_list/');
      response = response.json()
      return response;
    } catch (error) {
      console.error('There has been a problem with fetching Products:', error);
    }
  }

// fetching categories from database
async function fetch_categories(){
    try {
      response = await fetch('http://127.0.0.1:5002/categories/get_categories');
      response = response.json();
      return response;
    } catch (error) {
      console.error('There has been a problem with fetching categories:', error);
    }
  }

// fetching receipts from database
async function fetch_receipts(r_code='null'){
    try {

      if (r_code=='null'){ response = await fetch('http://127.0.0.1:5002/receipts/get_receipts')}
      else {response = await fetch('http://127.0.0.1:5002/receipts/'+r_code)}

      response = response.json();
      return response;
    } catch (error) {
      console.error('There has been a problem with fetching receipts:', error);
    }
  }


async function getProducts() {
  document.getElementById("product_list").innerHTML = ""
    data = await fetch_products()
    for (let [key, value] of Object.entries(data)) {
      const current = value;
      document.getElementById("product_list").innerHTML += '<div class=\"product-box\"><img src="../static/images/' +
        current.picture
        + '" alt=\"\" class=\"product-img\"><div class=\"product-info-wrapper\"><p class=\"product-title\">' +
        current.name
        + '</p><p class=\"product-category\">' +
        current.category
        + '</p></div><div class=\"bottom-product-wrapper\"><p class=\"product-price\">' +
        current.price
        + '</p><button class=\"blue-button do-hover\" ' + ' id=\"' + 'product-btn-' + current.p_id + '\"' + ' onclick="edit_prod('+current.p_id+')">ویرایش محصول</button></div></div>'
        // console.log(current.picture)
    } 
    }

async function getCategories() {
  document.getElementById("category_section").innerHTML = `
                <div class="receipt_item" id="receipt_title">
                    <p class="item_1">نام دسته بندی</p>
                    <p class="item_2">عملیات</p>
                </div>
  `
    data = await fetch_categories()
    for (let [key, value] of Object.entries(data)) {
      const current = value;
            document.getElementById("category_section").innerHTML += `
            <div class="receipt_item">
                <p class="item_1 category">${current['name']}</p>
                <button class="item_2" onclick="edit_cat('${current['name']}')">ویرایش دسته بندی</button>
                <button class="item_3" onclick="delete_cat('${current['name']}')">×حذف دسته بندی</button>
            </div>
        `
    };

}

async function getReceipts(data=null) {
    document.getElementById("receipt_section").innerHTML = `
    <div class="receipt_item" id="receipt_title">
                    <p class="item_1">کد پیگیری</p>
                    <p class="item_2">کالا</p>
                    <p class="item_3">قیمت پرداخت شده</p>
                    <p class="item_4">نام خریدار</p>
                    <p class="item_5">نام خانوادگی</p>
                    <p class="item_6">آدرس ارسال شده</p>
                    <p class="item_7">وضعیت</p>
                </div>`
    if (data==null) {data = await fetch_receipts()}
    console.log(data)
    for (let [key, value] of Object.entries(data)) {
      const current = value;
            document.getElementById("receipt_section").innerHTML += `
                <div class="receipt_item">
                    <p class="item_1">${current['r_code']}</p>
                    <p class="item_2">${current['name']}</p>
                    <p class="item_3">${current['price']}</p>
                    <p class="item_4">${current['buyer_firstname']}</p>
                    <p class="item_5">${current['buyer_lastname']}</p>
                    <p class="item_6">${current['buyer_address']}</p>
                    <button class="item_7" onclick="edit_rec('${current['r_code']}')">${current['status']}</button>
                </div>
        `
    };
}

async function get_product(p_id){
    try {
        url = 'http://127.0.0.1:5002/product/'+p_id+'/'
        response = await fetch(url);
        response = response.json();
        return response;
      } catch (error) {
        console.error('There has been a problem with fetching Product:', error);
      }
}

async function edit_prod(p_id) {
    product = await get_product(p_id)
    product = product[0]
    console.log(product)
    var modal = document.getElementById("modalWindow");
    message = document.getElementById('modal-message')
    message.innerHTML = `
    <p style="padding-bottom:5%;">مشخصات کالای مورد نظر را مشخص نمایید</p>
    <form id="p_info_inputs" action="">
                <div class="p_info">
                    <label class="input_label" style="margin-right: 5%;" for="p_name_input">نام محصول:</label>
                    <input class="input_box" type="text" id="p_name_input" name="p_name_input" value="${product['name']}">
                </div>
                <div class="p_info">
                    <label class="input_label" style="margin-right: 5%;" for="p_available_input">تعداد موجود:</label>
                    <input class="input_box" type="number" id="p_available_input" name="p_available_input" step="1" value="${product['available']}">
                </div>
                <div class="p_info">
                    <label class="input_label" style="margin-right: 5%;" for="p_cat_input">دسته بندی:</label>
                    <input class="input_box" type="text" id="p_cat_input" name="p_cat_input" value="${product['category']}">
                </div>
                <div class="p_info">
                    <label class="input_label" style="margin-right: 5%;" for="p_price_input">قیمت:</label>
                    <input class="input_box" type="text" id="p_price_input" name="p_price_input" value="${product['price']}">
                </div>
                <button class="blue-button submit_receipt" id="change_product">ثبت تغییرات</button>
    </form> 
    `;
    document.getElementById("modal").style.borderColor = 'blue';
    modal.style.display = "block";

    document.getElementById("p_info_inputs").addEventListener('submit', async function (event) {
        new_name = document.getElementById("p_name_input")
        new_avi = document.getElementById("p_available_input")
        new_cat = document.getElementById("p_cat_input")
        new_price = document.getElementById("p_price_input")
        if ((new_name.value.length < 1) || (new_avi.value < 0) || (new_cat.value.length < 1) || (isNaN(new_price.value)) || (new_price.value.length < 1)){
            document.getElementById("modal").style.borderColor = 'red';
            message.innerHTML = "<h3>مشکلی در داده ها وجود داشت - تغییرات اعمال نشد</h3>"
        }
        else{
            document.getElementById("modal").style.borderColor = 'green';
            message.innerHTML = "<h3>تغییرات با موفقیت اعمال شد</h3>"
            try {
                url = 'http://127.0.0.1:5002/product/update/'+p_id+'?name='+new_name.value+ '&category='+new_cat.value
                + '&price='+new_price.value+'&available='+new_avi.value
                console.log(url)
                response = await fetch(url);
                // response = response.json();
                getProducts()
              } catch (error) {
                console.error('There has been a problem with updating Products:', error);
              }
        }});

}
async function delete_cat(category){
  var modal = document.getElementById("modalWindow");
  message = document.getElementById('modal-message')
  if (category=="uncategorized"){
    message.innerHTML = `
    <h3>دسته بندی مورد نظر حذف شدنی نیست</h3>
    `;
    document.getElementById("modal").style.borderColor = 'red';
    modal.style.display = "block";
  }
  else{
    try {
        url = 'http://127.0.0.1:5002/categories/delete/'+category
        console.log(url)
        response = await fetch(url);
      } catch (error) {
        console.error('There has been a problem with delete the Category:', error);
      }
    
    message.innerHTML = `
    <h3>دسته بندی مورد نظر حذف شد</h3>
    `;
    document.getElementById("modal").style.borderColor = 'blue';
    modal.style.display = "block";
    getCategories()
}
}

async function edit_rec(r_code) {
  var modal = document.getElementById("modalWindow");
  message = document.getElementById('modal-message')
  message.innerHTML = `
  <p style="padding-bottom:5%;">وضعیت رسید مد نظر را مشخص نمایید</p>
  <form id="r_info_inputs">
              <div class="r_info" >
                  <label class="input_label" style="margin-right: 5%;" for="r_name_select">وضعیت رسید:</label>
                  <select name="r_name_select" id="r_name_select">
                    <option value="pending">pending</option>
                    <option value="in progress">in progress</option>
                    <option value="DONE">DONE</option>
                  </select>
              </div>
              <button class="blue-button submit_receipt" id="change_receipt">ثبت تغییرات</button>
  </form> 
  `;
  document.getElementById("modal").style.borderColor = 'blue';
  modal.style.display = "block";

  document.getElementById("r_info_inputs").addEventListener('submit', async function (event) {
          event.preventDefault()
          new_status = document.getElementById("r_name_select").value
          try {
              url = 'http://127.0.0.1:5002/protected/receipts/change_status/'+r_code+"/?new_status="+new_status
              console.log(url)
              response = await fetch(url);
              document.getElementById("modal").style.borderColor = 'green';
              message.innerHTML = "<h3>تغییرات با موفقیت اعمال شد</h3>"
              getReceipts()
            } catch (error) {
              console.error('There has been a problem with updating the Receipt:', error);
            }
          });
}

async function edit_cat(category) {
    var modal = document.getElementById("modalWindow");
    message = document.getElementById('modal-message')
    message.innerHTML = `
    <p style="padding-bottom:5%;">مشخصات دسته بندی مورد نظر را مشخص نمایید</p>
    <form id="c_info_inputs" action="">
                <div class="c_info">
                    <label class="input_label" style="margin-right: 5%;" for="c_name_input">نام دسته بندی:</label>
                    <input class="input_box" type="text" id="c_name_input" name="c_name_input" value="${category}">
                </div>
                <button class="blue-button submit_receipt" id="change_category">ثبت تغییرات</button>
    </form> 
    `;
    document.getElementById("modal").style.borderColor = 'blue';
    modal.style.display = "block";

    document.getElementById("c_info_inputs").addEventListener('submit', async function (event) {
        new_name = document.getElementById("c_name_input")
        if (category=="uncategorized"){
          message.innerHTML = `
          <h3>دسته بندی مورد نظر حذف شدنی نیست</h3>
          `;
          document.getElementById("modal").style.borderColor = 'red';
          modal.style.display = "block";
        }
        else{
        if (new_name.value.length < 1){
            document.getElementById("modal").style.borderColor = 'red';
            message.innerHTML = "<h3>مشکلی در داده ها وجود داشت - تغییرات اعمال نشد</h3>"
        }
        else{
            document.getElementById("modal").style.borderColor = 'green';
            message.innerHTML = "<h3>تغییرات با موفقیت اعمال شد</h3>"
            try {
                url = 'http://127.0.0.1:5002/categories/update/'+category+"?name="+new_name.value
                console.log(url)
                response = await fetch(url);
                getCategories()
              } catch (error) {
                console.error('There has been a problem with updating the Category:', error);
              }
            }
    }});

}

function add_product(){
    var modal = document.getElementById("modalWindow");
    message = document.getElementById('modal-message')
    message.innerHTML = `
    <p style="padding-bottom:5%;">مشخصات کالای مورد نظر را مشخص نمایید</p>
    <form id="p_info_inputs_create" action="">
                <div class="p_info">
                    <label class="input_label" style="margin-right: 5%;" for="p_name_input_create">نام محصول:</label>
                    <input class="input_box" type="text" id="p_name_input_create" name="p_name_input_create" placeholder="نام کالا">
                </div>
                <div class="p_info">
                    <label class="input_label" style="margin-right: 5%;" for="p_available_input_create">تعداد موجود:</label>
                    <input class="input_box" type="number" id="p_available_input_create" name="p_available_input_create" step="1" value="1">
                </div>
                <div class="p_info">
                    <label class="input_label" style="margin-right: 5%;" for="p_cat_input_create">دسته بندی:</label>
                    <input class="input_box" type="text" id="p_cat_input_create" name="p_cat_input_create" value="uncategorized">
                </div>
                <div class="p_info">
                    <label class="input_label" style="margin-right: 5%;" for="p_price_input_create">قیمت:</label>
                    <input class="input_box" type="text" id="p_price_input_create" name="p_price_input_create" placeholder="قیمت کالا">
                </div>
                <button class="blue-button" id="submit_product">ایجاد کالا</button>
    </form> 
    `;
    document.getElementById("modal").style.borderColor = 'blue';
    modal.style.display = "block";

    document.getElementById("p_info_inputs_create").addEventListener('submit', async function (event) {
        new_name = document.getElementById("p_name_input_create")
        new_avi = document.getElementById("p_available_input_create")
        new_cat = document.getElementById("p_cat_input_create")
        new_price = document.getElementById("p_price_input_create")
        if ((new_name.value.length < 1) || (new_avi.value < 0) || (new_cat.value.length < 1) || (isNaN(new_price.value)) || (new_price.value.length < 1)){
            document.getElementById("modal").style.borderColor = 'red';
            message.innerHTML = "<h3>مشکلی در داده ها وجود داشت - کالای جدید ایجاد نشد</h3>"
        }
        else{
            document.getElementById("modal").style.borderColor = 'green';
            message.innerHTML = "<h3>کالای جدید با موفقیت ایجاد شد</h3>"
            try {
                url = 'http://127.0.0.1:5002/create/product?name='+new_name.value+ '&category='+new_cat.value
                + '&price='+new_price.value+'&available='+new_avi.value
                console.log(url)
                response = await fetch(url);
                getProducts()
                getReceipts()
              } catch (error) {
                console.error('There has been a problem with fetching Products:', error);
              }
        }});

}

document.getElementById("search_input").addEventListener('input', async function (event){
    r_code = document.getElementById("search_input").value;
    data = await fetch_receipts(r_code)
    getReceipts(data)
});

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

getProducts()
getCategories()
getReceipts()