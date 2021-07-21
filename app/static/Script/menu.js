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
        window.location.href = "http://127.0.0.1:5002/#product-list-div";
    }
    /*location.href = "#product-list-div";*/
    console.log("continuing")
    /*window.focus();*/
    window.scrollTo(0,findPos(document.getElementById("product-list-div")));
}

function goToSignInPage(e) {
    e.preventDefault();
    window.location.href = "http://127.0.0.1:5002/SignIn.html";
}

function viewDropDownMenu(e) {
    e.preventDefault();
    let dropDownMenu = document.getElementById("menu-dropdown");
    dropDownMenu.classList.toggle("show");
}

function logoutJWT(e) {
    e.preventDefault();
    localStorage.removeItem('jwt');
    console.log('signed out');
    window.location.href = "http://127.0.0.1:5002/SignIn.html"; 
}

function goToProfilePage(e) {
    e.preventDefault();
    window.location.href = "http://127.0.0.1:5002/userProfile.html";
}


document.getElementById("menu-item-products").addEventListener("click", goToIndexAndScroll);
if (document.getElementById("sign-in-button") != undefined) {
    document.getElementById("sign-in-button").addEventListener("click", goToSignInPage);
}
if (document.getElementById("menu-profile-btn") != undefined) {
    document.getElementById("menu-profile-btn").addEventListener("click", viewDropDownMenu);
    document.getElementById("profile-dropdown-btn").addEventListener("click", goToProfilePage);
    document.getElementById("logout-dropdown-btn").addEventListener("click", logoutJWT);
}