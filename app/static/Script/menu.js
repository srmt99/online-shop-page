function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    console.log(curtop)
    return [curtop];
    }
}

function goToIndexAndScroll(e) {
    e.preventDefault();
    var pathname = window.location.pathname.split("/").pop();
    console.log(pathname);
    if (pathname != 'index.html') {
        console.log("not in index")
        window.location.href = "index.html#product-list-div";
    }
    /*location.href = "#product-list-div";*/
    console.log("continuing")
    /*window.focus();*/
    window.scrollTo(0,findPos(document.getElementById("product-list-div")));
}

function goToSignInPage(e) {
    e.preventDefault();
    window.location.href = "SignIn.html";
}


document.getElementById("menu-item-products").addEventListener("click", goToIndexAndScroll);
document.getElementById("sign-in-button").addEventListener("click", goToSignInPage)