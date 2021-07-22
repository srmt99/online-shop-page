// checking login status
var username = ""
let loginP = new Promise(function (myResolve, myReject) {
    let token = localStorage.getItem('jwt');
    if (token == null) { myReject("Logged Out");}
    else {
        fetch('http://127.0.0.1:5002/protected/user/get_user_username/', {
            method: "GET",
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        }).then(res => res.json())
            .then(function (data) {
              username = data ;
              myResolve("Logged In");
            });
    }
  });

  
/**
 * Class for defining product attributes
 */
class Product {
    constructor(id, imgSource, title, category, price, available, sold) {
        this.id = id;
        this.imgSource = '../static/images/' + imgSource;
        this.title = title;
        this.category = category;
        this.price = price;
        this.available = available;
        this.sold = sold
    }
}

/**
 * Class for defining categories
 */
class Category {
    constructor(catName) {
        this.catName = catName
    }
}

/**
 * Class for pagination of the product list
 */
class Pagination {
    constructor(productList, numOfProductsPerPage, currentPageNum) {
        this.currentPageNum = currentPageNum;
        this.productList = productList;
        this.numOfProductsPerPage = numOfProductsPerPage;
        this.setPaginationSection();
        this.changePage(this.currentPageNum);
        this.setNavigatorEventListeners();
        this.setPageNumberButtinsEventListeners();
        this.setProductPerPageSelectionEventListener();
    }

    /**
     * Get the number of pages based on number of products per page and product list
     * @returns number of required pages
     */
    numOfPages() {
        var totPages = Math.ceil(this.productList.length / this.numOfProductsPerPage);
        return totPages;
    }

    /**
     * Create pagination section buttons
     */
    setPaginationSection() {
        let lastPageNum = this.numOfPages();
        var paginationSection = document.getElementById("pagination-section");
        paginationSection.innerHTML = '<a href=\"#\" class=\"pagination-navigator\" id=\"prev-page\">&laquo;</a>';
        for (var j = 1; j <= lastPageNum; j++) {
            paginationSection.innerHTML += '<a href=\"#\" class=\"pagination-button\">' + j + '</a>';
        }
        paginationSection.innerHTML += '<a href=\"#\" class=\"pagination-navigator\" id=\"next-page\">&raquo;</a>';
    }

    /**
     * Go to given page and view products based on that
     * @param {} pageNum 
     */
    changePage(pageNum) {
        var productSection = document.getElementById("product-list-section");
        let lastPageNum = this.numOfPages();

        if (pageNum < 1) {
            pageNum = 1;
        }
        else {
            if (pageNum > lastPageNum) {
                pageNum = lastPageNum;
            }
        }

        productSection.innerHTML = "";

        if (this.productList.length == 0) {
            productSection.innerHTML += '<p id=\"empty-list-text\">محصولی برای نمایش وجود ندارد.</p>'
        }
        else {
            for (var i = (pageNum - 1) * this.numOfProductsPerPage; i < (pageNum * this.numOfProductsPerPage) && i < this.productList.length; i++) {
                let imgSrc = this.productList[i].imgSource;
                let title = this.productList[i].title;
                let cat = this.productList[i].category;
                let cost = this.productList[i].price;
                let btnID = this.productList[i].id;
                productSection.innerHTML += '<div class=\"product-box\"><img src=' +
                    imgSrc
                    + ' alt=\"\" class=\"product-img\"><div class=\"product-info-wrapper\"><p class=\"product-title\">' +
                    title
                    + '</p><p class=\"product-category\">' +
                    cat
                    + '</p></div><div class=\"bottom-product-wrapper\"><p class=\"product-price\">' +
                    cost
                    + '</p><button class=\"blue-button buy-btn do-hover\" ' + ' onclick=\"buy('+btnID+')\">خرید محصول</button></div></div>'
            }
        }

        var next = document.getElementById("next-page");
        var prev = document.getElementById("prev-page");

        if (pageNum == 1) {
            prev.style.visibility = "hidden";
        } else {
            prev.style.visibility = "visible";
        }

        if (pageNum == lastPageNum) {
            next.style.visibility = "hidden";
        } else {
            next.style.visibility = "visible";
        }
    }

    /**
     * Go to previous page
     */
    prevPage(e) {
        if (this.currentPageNum > 1) {
            this.currentPageNum--;
            this.changePage(this.currentPageNum);
        }
        e.preventDefault();
    }

    /**
     * Go to next page
     */
    nextPage(e) {
        let lastPage = this.numOfPages();
        if (this.currentPageNum < lastPage) {
            this.currentPageNum++;
            this.changePage(this.currentPageNum);
        }
        e.preventDefault();
    }

    /**
     * Calling change page to go to the desired page and preventing default event
     * @param {} destNum 
     * @param {*} e 
     */
    destPage(destNum, e) {
        this.currentPageNum = destNum;
        this.changePage(destNum);
        e.preventDefault();
    }

    /**
     * Set the number of viewed products per page based on the selection box
     */
    setPageLimit() {
        var selectSection = document.getElementById('select-page-limit');
        let selectionOptions = selectSection.options;
        let numPerPage = selectionOptions[selectionOptions.selectedIndex].value;
        // console.log("number");
        // console.log(numPerPage);
        for (var opt, j = 0; opt = selectionOptions[j]; j++) {
            if (opt.value == numPerPage) {
                selectSection.selectedIndex = j;
                console.log("selected");
                console.log(j);
                this.numOfProductsPerPage = numPerPage;
                console.log("updated number per page");
                console.log(this.numOfProductsPerPage);
                this.currentPageNum = 1;
                this.setPaginationSection();
                this.changePage(this.currentPageNum);
                this.setNavigatorEventListeners();
                this.setPageNumberButtinsEventListeners();
                break;
            }
        }
    }

    /**
     * Set event listeners for pagination navigation buttons
     */
    setNavigatorEventListeners() {
        var next = document.getElementById("next-page");
        var prev = document.getElementById("prev-page");
        prev.addEventListener('click', this.prevPage.bind(this));
        next.addEventListener('click', this.nextPage.bind(this));
    }

    /**
     * Set event listeners for pagination page number buttons
     */
    setPageNumberButtinsEventListeners() {
        var pageNumBtns = document.getElementsByClassName("pagination-button");
        for (var i = 0; i < pageNumBtns.length; i++) {
            let pageToGo = parseInt(pageNumBtns[i].innerHTML);
            pageNumBtns[i].addEventListener('click', this.destPage.bind(this, pageToGo));
        }
    }

    /**
     * Set event listeners for selection box to change the number of viewed items per page
     */
    setProductPerPageSelectionEventListener() {
        var selectSection = document.getElementById('select-page-limit');
        selectSection.addEventListener('change', this.setPageLimit.bind(this));
    }
}

// Modal page for buying a product
const form = document.getElementsByTagName('form')[0];
// Get the modal
var modal = document.getElementById("modalWindow");
// Get the <span> element that closes the modal
var closeModal = document.getElementsByClassName("modalClose")[0];
// When the user clicks on the button, open the modal
closeModal.onclick = function () {
    modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// fetching a product from database
async function fetch_product(p_id){
    try {
      response = await fetch('http://127.0.0.1:5002/product/'+p_id+'/');
      response = response.json()
      return await response;
    } catch (error) {
      console.error('There has been a problem with fetching Products:', error);
    }
  }

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

async function decrease_credit(username, amount){
    try {
        response = await fetch("http://127.0.0.1:5002/protected/user/profile/"+username+"/dec_crd/"+parseInt(amount), {
          method: "GET",
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        });
      } catch (error) {
        console.error('There has been a problem with incrementing user credit:', error);
      }
}

async function decrease_product(p_id, name, category, price, available, picture, sold){
    try {
        url = 'http://127.0.0.1:5002/product/update/'+p_id+'?name='+name+ '&category='+category
        + '&price='+price+'&available='+available +"&picture_addr="+picture+"&sold="+sold
        console.log(url)
        response = await fetch(url);
      } catch (error) {
        console.error('There has been a problem with updating Products:', error);
      }
}

async function set_receipt(name, buyer_username, number_sold, buyer_firstname, buyer_lastname, buyer_address, price){
    try {
        response = await fetch("http://127.0.0.1:5002/buy/?name="+name+"&buyer_username="+buyer_username+
        "&number_sold="+number_sold+"&buyer_firstname="+buyer_firstname+"&buyer_lastname="+buyer_lastname+
        "&buyer_address="+buyer_address+"&price="+price, {
          method: "GET",
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        });
      } catch (error) {
        console.error('There has been a problem with incrementing user credit:', error);
      }
}

async function buy(p_id) {

    loginP.then(
    function (value) { console.log("USERNAME:"+username)
    if (username=="jesus"){ // if admin is logged in
        window.location.href = "http://127.0.0.1:5002/AdminProfile.html";
        return 'redirected'
    } },
    function (error) {
        window.location.href = "http://127.0.0.1:5002/SignIn.html"
        return 'redirected' }
    );

    prod = await fetch_product(p_id)
    prod = prod[0]
    user = await fetch_user_info(username)
    user = user[0]
    var modal = document.getElementById("modalWindow");
    var price = prod['price']
    var credit = user['credit']
    var available = prod['available']
    message = document.getElementById('modal-message')
    message.innerHTML = `
    <p style="padding-bottom:5%;">لطفا تعداد مورد نظر از کالا را انتخاب فرمایید</p>
    <form id="buy_info">
                <label style="margin-right: 5%;" for="points">تعداد</label>
                <input class="buy_num" type="number" id="points" name="points" step="1" value="1">
                <label id="total_price" for="points">قیمت نهایی ${price} تومان</label>
                <h4 id="your-cred" style="margin-right:110px; margin-top:50px;">موجودی انبار:${available}</h4>
                <h4 id="your-cred" style="margin-right:90px; margin-top:5px;">اعتبار شما:${credit}</h4>
                <button class="blue-button" id="submit_receipt">ثبت سفارش</button>
    </form> 
    `;
    document.getElementById("modal").style.borderColor = 'orange';
    modal.style.display = "block";
    document.getElementById('points').addEventListener('change', function (event) {
        var tPrice = document.getElementById('total_price')
        amount = document.getElementById('points').value
        tPrice.innerHTML = " قیمت نهایی " + amount * price + " تومان "
    });
    document.getElementById("buy_info").addEventListener('submit', function (event) {
        amount = document.getElementById('points').value
        if ((amount * price)>credit){
            message.innerHTML = `
            <h3>اعتبار شما کافی نیست</h3>
            `
            document.getElementById("modal").style.borderColor = 'red';
        }
        else if ((amount>available) || amount<0){
            message.innerHTML = `
            <h3>موجودی انبار کافی نیست</h3>
            `
            document.getElementById("modal").style.borderColor = 'red';
        }
        else {
            console.log(amount)
            console.log(available)
            decrease_credit(username, (amount * price))
            set_receipt(prod['name'], username, amount, user['name'], user['lastname'], user['address'], (amount * price))
            decrease_product(prod['p_id'], prod['name'], prod['category'], prod['price'], available-amount, prod['picture'], amount)
            message.innerHTML = `
            <h3>خرید با موفقیت انجام شد</h3>
            `
            document.getElementById("modal").style.borderColor = 'green';
            credit -= (amount * price);
        }
        event.preventDefault();
    });
    // document.getElementById("modal").style.borderColor = '#30f04d';
}

/**
 * Create proper URL for fetching products from server
 * @param {*} optional_params 
 * @returns 
 */
function createGetProductsURL(optional_params) {
    /*orderBy, order, category, searchText, min_price, max_price*/
    let URL = 'http://127.0.0.1:5002/product/product_list/';
    if (Object.keys(optional_params).length > 0) {
        URL += '?'
        if (optional_params.orderBy !== undefined) {
            if (URL != 'http://127.0.0.1:5002/product/product_list/?') {
                URL += '&'
            }
            URL += 'orderBy=' + optional_params.orderBy
        }
        if (optional_params.order !== undefined) {
            if (URL != 'http://127.0.0.1:5002/product/product_list/?') {
                URL += '&'
            }
            URL += 'order=' + optional_params.order
        }
        if (optional_params.category !== undefined) {
            if (URL != 'http://127.0.0.1:5002/product/product_list/?') {
                URL += '&'
            }
            URL += 'category=' + optional_params.category
        }
        if (optional_params.searchText !== undefined) {
            if (URL != 'http://127.0.0.1:5002/product/product_list/?') {
                URL += '&'
            }
            URL += 'searchText=' + optional_params.searchText
        }
        if (optional_params.min_price !== undefined) {
            if (URL != 'http://127.0.0.1:5002/product/product_list/?') {
                URL += '&'
            }
            URL += 'min_price=' + optional_params.min_price
        }
        if (optional_params.max_price !== undefined) {
            if (URL != 'http://127.0.0.1:5002/product/product_list/?') {
                URL += '&'
            }
            URL += 'max_price=' + optional_params.max_price
        }
    }
    console.log(URL)
    return URL;
}


/**
 * Get products from server given the proper URL
 * @param {} URL 
 */
function getProducts(URL) {
    fetch(URL)
        .then(res => res.json()) // the .json() method parses the JSON response into a JS object literal
        .then(function (data) {
            let retrievedProducts = [];
            for (var k in data) {
                let current = data[k];
                let newProduct = new Product(current.p_id, current.picture, current.name, current.category, current.price, current.available, current.sold);
                retrievedProducts.push(newProduct);
            }
            // console.log(retrievedProducts);
            new Pagination(retrievedProducts, productsPerPage, 1);
            document.getElementById("min-price-input").placeholder = Math.min.apply(Math, retrievedProducts.map(function (o) { return o.price; })).toString();
            document.getElementById("max-price-input").placeholder = Math.max.apply(Math, retrievedProducts.map(function (o) { return o.price; })).toString();
        });
}

/**
 * Get all available categories from server
 */
function getCategories() {
    fetch('http://127.0.0.1:5002/category/category_list/')
        .then(res => res.json()) // the .json() method parses the JSON response into a JS object literal
        .then(function (data) {
            let retrievedCategories = [];
            for (var k in data) {
                let current = data[k];
                let newCategory = new Category(current.name);
                retrievedCategories.push(newCategory);
            }
            // console.log(retrievedCategories);
            viewCategories(retrievedCategories);
        });
}


/**
 * View all categories in the category filter box
 * @param {*} categoryList 
 */
function viewCategories(categoryList) {
    var catForm = document.getElementById("category-form");
    catForm.innerHTML = "";

    if (categoryList.length == 0) {
        catForm.innerHTML += '<p id=\"empty-list-text\">دسته بندی برای نمایش وجود ندارد.</p>';
    }
    else {
        for (var i = 0; i < categoryList.length; i++) {
            let categoryName = categoryList[i].catName;
            catForm.innerHTML += '<div class=\"checkbox-wrapper\"></div><input class=\"filter-checkbox\" type=\"checkbox\" id=\"filter-' +
                categoryName + '\" value=\"' + categoryName + '"><label for=\"filter-' +
                categoryName + '\"> ' +
                categoryName + '</label><br>';
        }
    }
}

/**
 * Get all category checkboxes with a checked status
 * @returns 
 */
function getCheckedCategories() {
    let availableategories = document.getElementsByClassName('filter-checkbox');
    let checkedCategories = [];
    for (let j = 0; j < availableategories.length; ++j) {
        if (availableategories[j].checked == true) {
            checkedCategories.push(availableategories[j].value);
        }
    }
    return checkedCategories;
}


/**
 * Handler for search button - get all products according to page state
 * @param {} e 
 */
function searchText(e) {
    e.preventDefault();
    let pageStatURL = createGetProductsURL(productViewStat());
    console.log("finished URL: " + pageStatURL);
    getProducts(pageStatURL);
}

/**
 * Handler for sort buttons - get all products according to page state
 * @param {} e 
 */
function changeSort(e) {
    e.preventDefault();
    let currentSort = document.getElementsByClassName("sort-option blue-button")[0];
    // console.log(currentSort);
    if (this.id == currentSort.id) {
        console.log("same sort")
    }
    else {
        currentSort.classList.remove('blue-button');
        currentSort.classList.remove('do-hover');
        currentSort.classList.add('white-button');
        this.classList.remove('white-button');
        this.classList.add('blue-button');
        this.classList.add('do-hover');
    }
    let pageStatURL = createGetProductsURL(productViewStat());
    console.log("finished URL: " + pageStatURL);
    getProducts(pageStatURL);
}

/**
 * Set handlers for all sort buttons
 */
function setSortOptionsEventListener() {
    let sortOptions = document.getElementsByClassName("sort-option");
    console.log(sortOptions);
    for (let index = 0; index < sortOptions.length; ++index) {
        sortOptions[index].addEventListener('click', changeSort)
    }
}

/**
 * Handler for category checkboxes - get all products according to page state
 * @param {*} e 
 */
function filterByCategory(e) {
    e.preventDefault();
    console.log("CHANGE DETECTED");
    let pageStatURL = createGetProductsURL(productViewStat());
    getProducts(pageStatURL);
}

/**
 * Set handlers for category filter checkboxes
 */
function setCategoryCheckboxesEventListener() {
    let categoryForm = document.getElementById('category-form');
    categoryForm.addEventListener('change', filterByCategory);
}

/**
 * Determine the proper parameters that need to be in the URL to get products according to the page's state
 * @returns
 */
function productViewStat() {
    let searchInput = document.getElementById("product-input").value;
    if (searchInput == "") {
        searchInput = undefined;
    }
    console.log("searched Text = " + searchInput)
    let sortMode = document.getElementsByClassName("sort-option blue-button")[0];
    let sortModeText = sortMode.innerHTML;
    if (sortMode.id == 'sort-by-max-sale-button') {
        sortModeText = 'sold'
    }
    else if (sortMode.id == "sort-by-price-desc") {
        sortModeText = 'price'
    }
    else if (sortMode.id == "sort-by-price-asc") {
        sortModeText = 'price'
    }
    else if (sortMode.id == "sort-by-date") {
        sortModeText = 'date'
    }
    console.log("sort Mode = " + sortModeText);
    let orderview = undefined;
    if (sortMode.id == "sort-by-price-desc") {
        orderview = 'desc';
    }
    else if (sortMode.id == "sort-by-price-asc") {
        orderview = 'asc';
    }
    console.log("orderview Mode = " + orderview)
    let startPrice = document.getElementById("min-price-input").value;
    if (startPrice == "") {
        startPrice = undefined;
    }
    else if (startPrice === parseInt(startPrice, 10)) {
        startPrice = parseInt(data, 10);
    }
    let stopPrice = document.getElementById("max-price-input").value;
    if (stopPrice == "") {
        stopPrice = undefined;
    }
    else if (stopPrice === parseInt(stopPrice, 10)) {
        stopPrice = parseInt(data, 10);
    }
    console.log("range = " + startPrice + ",  " + stopPrice);
    let selectedCategories = getCheckedCategories();
    if (selectedCategories.length == 0) {
        selectedCategories = undefined
    }
    console.log("selected categories: ", selectedCategories);
    return { orderBy: sortModeText, order: orderview, category: selectedCategories, searchText: searchInput, min_price: startPrice, max_price: stopPrice }
}

/**
 * Handler for price submit button - get all products according to page state
 * @param {} e 
 */
function priceRangeHandler(e) {
    e.preventDefault();
    let pageStatURL = createGetProductsURL(productViewStat());
    console.log("finished URL: " + pageStatURL);
    getProducts(pageStatURL);
}

/**
 * Number of products per page
 */
let productsPerPage = 15;

getProducts(createGetProductsURL({ orderBy: 'price', order: 'asc' }));
getCategories();
setSortOptionsEventListener();
setCategoryCheckboxesEventListener();

let productSubmitButton = document.getElementById("product-submit");
productSubmitButton.addEventListener('click', searchText);

let priceRangeSubmitButton = document.getElementById("price-filter-submit");
priceRangeSubmitButton.addEventListener('click', priceRangeHandler);

/**
 * JWT token authentication and protected resource access example
 */
/*
let postData = {
    "username": "user0@gmail.com",
    "password": "11111111"
};
jsonData = JSON.stringify(postData);
fetch('http://127.0.0.1:5002/login/?username=user0@gmail.com&password=11111111', {
    method: "POST",
    body: JSON.stringify(postData)
}).then(res => res.json())
.then(function (data) {
    console.log("JWT Token:")
    console.log(data)
    let jwtToken = data['access_token'];
    localStorage.setItem('jwt', jwtToken)
});

fetch('http://127.0.0.1:5002/protected/', {
    method: "GET",
    headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
}).then(res => res.json())  
.then(function (data) {
    console.log(data);
});
*/