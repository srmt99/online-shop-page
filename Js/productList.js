/**
 * Class for defining product attributes
 */
 class Product {
    constructor(imgSource, title, category, price) {
        this.imgSource = imgSource;
        this.title = title;
        this.category = category;
        this.price = price;
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
    setPaginationSection(){
        let lastPageNum = this.numOfPages();
        var paginationSection = document.getElementById("pagination-section");
        paginationSection.innerHTML = '<a href=\"#\" class=\"pagination-navigator\" id=\"prev-page\">&laquo;</a>';
        for (var j = 1; j <= lastPageNum; j++){
            paginationSection.innerHTML += '<a href=\"#\" class=\"pagination-button\">'+j+'</a>';
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

        if (pageNum < 1){
            pageNum = 1;
        }
        else{
            if (pageNum > lastPageNum){
                pageNum = lastPageNum;
            }
        }

        productSection.innerHTML = "";
        for (var i = (pageNum-1) * this.numOfProductsPerPage; i < (pageNum * this.numOfProductsPerPage) && i<this.productList.length; i++) {
            let imgSrc = this.productList[i].imgSource;
            let title = this.productList[i].title;
            let cat = this.productList[i].category;
            let cost = this.productList[i].price;
            productSection.innerHTML += '<div class=\"product-box\"><img src='+
            imgSrc
            +' alt=\"\" class=\"product-img\"><div class=\"product-info-wrapper\"><p class=\"product-title\">'+
            title
            +'</p><p class=\"product-category\">'+
            cat
            +'</p></div><div class=\"bottom-product-wrapper\"><p class=\"product-price\">'+
            cost
            +'</p><button class=\"blue-button\">خرید محصول</button></div></div>'
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
    destPage(destNum, e){
        this.currentPageNum = destNum;
        this.changePage(destNum);
        e.preventDefault();
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
    setPageNumberButtinsEventListeners(){
        var pageNumBtns = document.getElementsByClassName("pagination-button");
        for (var i = 0; i < pageNumBtns.length; i++){
            let pageToGo = parseInt(pageNumBtns[i].innerHTML);
            pageNumBtns[i].addEventListener('click', this.destPage.bind(this, pageToGo));
        }
    }
}

/**
 * Hard-coding products
 */
pr1Title = 'محصول1';
pr1Cat = 'دسته بندی دوم';
pr1Src = 'images/backpack.jpg';
pr1Price = 10000;
let pr1 = new Product(pr1Src, pr1Title, pr1Cat, pr1Price);

pr2Title = 'محصول2';
pr2Cat = 'دسته بندی دوم';
pr2Src = 'images/backpack.jpg';
pr2Price = 20000;
let pr2 = new Product(pr2Src, pr2Title, pr2Cat, pr2Price);

pr3Title = 'محصول3';
pr3Cat = 'دسته بندی دوم';
pr3Src = 'images/backpack.jpg';
pr3Price = 30000;
let pr3 = new Product(pr3Src, pr3Title, pr3Cat, pr3Price);

pr4Title = 'محصول4';
pr4Cat = 'دسته بندی دوم';
pr4Src = 'images/backpack.jpg';
pr4Price = 40000;
let pr4 = new Product(pr4Src, pr4Title, pr4Cat, pr4Price);

pr5Title = 'محصول5';
pr5Cat = 'دسته بندی دوم';
pr5Src = 'images/backpack.jpg';
pr5Price = 50000;
let pr5 = new Product(pr5Src, pr5Title, pr5Cat, pr5Price);

pr6Title = 'محصول6';
pr6Cat = 'دسته بندی دوم';
pr6Src = 'images/backpack.jpg';
pr6Price = 60000;
let pr6 = new Product(pr6Src, pr6Title, pr6Cat, pr6Price);

pr7Title = 'محصول7';
pr7Cat = 'دسته بندی دوم';
pr7Src = 'images/backpack.jpg';
pr7Price = 70000;
let pr7 = new Product(pr7Src, pr7Title, pr7Cat, pr7Price);

pr8Title = 'محصول8';
pr8Cat = 'دسته بندی دوم';
pr8Src = 'images/backpack.jpg';
pr8Price = 80000;
let pr8 = new Product(pr8Src, pr8Title, pr8Cat, pr8Price);

pr9Title = 'محصول9';
pr9Cat = 'دسته بندی دوم';
pr9Src = 'images/backpack.jpg';
pr9Price = 90000;
let pr9 = new Product(pr9Src, pr9Title, pr9Cat, pr9Price);

pr10Title = 'محصول10';
pr10Cat = 'دسته بندی دوم';
pr10Src = 'images/backpack.jpg';
pr10Price = 100000;
let pr10 = new Product(pr10Src, pr10Title, pr10Cat, pr10Price);

pr11Title = 'محصول11';
pr11Cat = 'دسته بندی دوم';
pr11Src = 'images/backpack.jpg';
pr11Price = 110000;
let pr11 = new Product(pr11Src, pr11Title, pr11Cat, pr11Price);

pr12Title = 'محصول12';
pr12Cat = 'دسته بندی دوم';
pr12Src = 'images/backpack.jpg';
pr12Price = 120000;
let pr12 = new Product(pr12Src, pr12Title, pr12Cat, pr12Price);

pr13Title = 'محصول13';
pr13Cat = 'دسته بندی دوم';
pr13Src = 'images/backpack.jpg';
pr13Price = 130000;
let pr13 = new Product(pr13Src, pr13Title, pr13Cat, pr13Price);

pr14Title = 'محصول14';
pr14Cat = 'دسته بندی دوم';
pr14Src = 'images/backpack.jpg';
pr14Price = 140000;
let pr14 = new Product(pr14Src, pr14Title, pr14Cat, pr14Price);

pr15Title = 'محصول15';
pr15Cat = 'دسته بندی دوم';
pr15Src = 'images/backpack.jpg';
pr15Price = 150000;
let pr15 = new Product(pr15Src, pr15Title, pr15Cat, pr15Price);

pr16Title = 'محصول16';
pr16Cat = 'دسته بندی دوم';
pr16Src = 'images/backpack.jpg';
pr16Price = 160000;
let pr16 = new Product(pr16Src, pr16Title, pr16Cat, pr16Price);

pr17Title = 'محصول17';
pr17Cat = 'دسته بندی دوم';
pr17Src = 'images/backpack.jpg';
pr17Price = 170000;
let pr17 = new Product(pr17Src, pr17Title, pr17Cat, pr17Price);

pr18Title = 'محصول18';
pr18Cat = 'دسته بندی دوم';
pr18Src = 'images/backpack.jpg';
pr18Price = 180000;
let pr18 = new Product(pr18Src, pr18Title, pr18Cat, pr18Price);

pr19Title = 'محصول19';
pr19Cat = 'دسته بندی دوم';
pr19Src = 'images/backpack.jpg';
pr19Price = 190000;
let pr19 = new Product(pr19Src, pr19Title, pr19Cat, pr19Price);

pr20Title = 'محصول20';
pr20Cat = 'دسته بندی دوم';
pr20Src = 'images/backpack.jpg';
pr20Price = 200000;
let pr20 = new Product(pr20Src, pr20Title, pr20Cat, pr20Price);

pr21Title = 'محصول21';
pr21Cat = 'دسته بندی دوم';
pr21Src = 'images/backpack.jpg';
pr21Price = 210000;
let pr21 = new Product(pr21Src, pr21Title, pr21Cat, pr21Price);

pr22Title = 'محصول22';
pr22Cat = 'دسته بندی دوم';
pr22Src = 'images/backpack.jpg';
pr22Price = 220000;
let pr22 = new Product(pr22Src, pr22Title, pr22Cat, pr22Price);

pr23Title = 'محصول23';
pr23Cat = 'دسته بندی دوم';
pr23Src = 'images/backpack.jpg';
pr23Price = 230000;
let pr23 = new Product(pr23Src, pr23Title, pr23Cat, pr23Price);

pr24Title = 'محصول24';
pr24Cat = 'دسته بندی دوم';
pr24Src = 'images/backpack.jpg';
pr24Price = 240000;
let pr24 = new Product(pr24Src, pr24Title, pr24Cat, pr24Price);

pr25Title = 'محصول25';
pr25Cat = 'دسته بندی دوم';
pr25Src = 'images/backpack.jpg';
pr25Price = 250000;
let pr25 = new Product(pr25Src, pr25Title, pr25Cat, pr25Price);

pr26Title = 'محصول26';
pr26Cat = 'دسته بندی دوم';
pr26Src = 'images/backpack.jpg';
pr26Price = 260000;
let pr26 = new Product(pr26Src, pr26Title, pr26Cat, pr26Price);

pr27Title = 'محصول27';
pr27Cat = 'دسته بندی دوم';
pr27Src = 'images/backpack.jpg';
pr27Price = 270000;
let pr27 = new Product(pr27Src, pr27Title, pr27Cat, pr27Price);

pr28Title = 'محصول28';
pr28Cat = 'دسته بندی دوم';
pr28Src = 'images/backpack.jpg';
pr28Price = 280000;
let pr28 = new Product(pr28Src, pr28Title, pr28Cat, pr28Price);

pr29Title = 'محصول29';
pr29Cat = 'دسته بندی دوم';
pr29Src = 'images/backpack.jpg';
pr29Price = 290000;
let pr29 = new Product(pr29Src, pr29Title, pr29Cat, pr29Price);

pr30Title = 'محصول30';
pr30Cat = 'دسته بندی دوم';
pr30Src = 'images/backpack.jpg';
pr30Price = 300000;
let pr30 = new Product(pr30Src, pr30Title, pr30Cat, pr30Price);

pr31Title = 'محصول31';
pr31Cat = 'دسته بندی دوم';
pr31Src = 'images/backpack.jpg';
pr31Price = 310000;
let pr31 = new Product(pr31Src, pr31Title, pr31Cat, pr31Price);

pr32Title = 'محصول32';
pr32Cat = 'دسته بندی دوم';
pr32Src = 'images/backpack.jpg';
pr32Price = 320000;
let pr32 = new Product(pr32Src, pr32Title, pr32Cat, pr32Price);

pr33Title = 'محصول33';
pr33Cat = 'دسته بندی دوم';
pr33Src = 'images/backpack.jpg';
pr33Price = 330000;
let pr33 = new Product(pr33Src, pr33Title, pr33Cat, pr33Price);

pr34Title = 'محصول34';
pr34Cat = 'دسته بندی دوم';
pr34Src = 'images/backpack.jpg';
pr34Price = 340000;
let pr34 = new Product(pr34Src, pr34Title, pr34Cat, pr34Price);

pr35Title = 'محصول35';
pr35Cat = 'دسته بندی دوم';
pr35Src = 'images/backpack.jpg';
pr35Price = 350000;
let pr35 = new Product(pr35Src, pr35Title, pr35Cat, pr35Price);

pr36Title = 'محصول36';
pr36Cat = 'دسته بندی دوم';
pr36Src = 'images/backpack.jpg';
pr36Price = 360000;
let pr36 = new Product(pr36Src, pr36Title, pr36Cat, pr36Price);

pr37Title = 'محصول37';
pr37Cat = 'دسته بندی دوم';
pr37Src = 'images/backpack.jpg';
pr37Price = 370000;
let pr37 = new Product(pr37Src, pr37Title, pr37Cat, pr37Price);

pr38Title = 'محصول38';
pr38Cat = 'دسته بندی دوم';
pr38Src = 'images/backpack.jpg';
pr38Price = 380000;
let pr38 = new Product(pr38Src, pr38Title, pr38Cat, pr38Price);

pr39Title = 'محصول39';
pr39Cat = 'دسته بندی دوم';
pr39Src = 'images/backpack.jpg';;
pr39Price = 390000;
let pr39 = new Product(pr39Src, pr39Title, pr39Cat, pr39Price);

pr40Title = 'محصول40';
pr40Cat = 'دسته بندی دوم';
pr40Src = 'images/backpack.jpg';
pr40Price = 400000;
let pr40 = new Product(pr40Src, pr40Title, pr40Cat, pr40Price);

/**
 * Creating an array of created products
 */
let products = [
    pr1,
    pr2,
    pr3,
    pr4,
    pr5,
    pr6,
    pr7,
    pr8,
    pr9,
    pr10,
    pr11,
    pr12,
    pr13,
    pr14,
    pr15,
    pr16,
    pr17,
    pr18,
    pr19,
    pr20,
    pr21,
    pr22,
    pr23,
    pr24,
    pr25,
    pr26,
    pr27,
    pr28,
    pr29,
    pr30,
    pr31,
    pr32,
    pr33,
    pr34,
    pr35,
    pr36,
    pr37,
    pr38,
    pr39,
    pr40
];

/**
 * Number of products per page
 */
let productsPerPage = 15;

/**
 * Creating pagination
 */
new Pagination(products, productsPerPage, 1)