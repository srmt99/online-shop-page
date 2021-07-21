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
    window.scrollTo(0, findPos(document.getElementById("product-list-div")));
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
    fetch('http://127.0.0.1:5002/protected/user/id/', {
            method: "GET",
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        }).then(res => res.json())
            .then(function (data) {
                if (data == 'jesus@christ') {
                    window.location.href = "http://127.0.0.1:5002/AdminProfile.html";
                }
                else {
                    window.location.href = "http://127.0.0.1:5002/userProfile.html";
                }
            });
}

function addListeners() {
    if (document.getElementById("sign-in-button") != undefined) {
        document.getElementById("sign-in-button").addEventListener("click", goToSignInPage);
    }
    if (document.getElementById("menu-profile-btn") != undefined) {
        document.getElementById("menu-profile-btn").addEventListener("click", viewDropDownMenu);
        document.getElementById("profile-dropdown-btn").addEventListener("click", goToProfilePage);
        document.getElementById("logout-dropdown-btn").addEventListener("click", logoutJWT);
    }
}


document.getElementById("menu-item-products").addEventListener("click", goToIndexAndScroll);

let loginPromise = new Promise(function (myResolve, myReject) {
    let token = localStorage.getItem('jwt');
    console.log(token);
    console.log(typeof (token));
    let menuButtonDiv = document.getElementById("menu-button-div");
    if (token == null) {
        menuButtonDiv.innerHTML = "<button class=\"white-button-yellow-border\" id=\"sign-in-button\">ورود / ثبت نام</button>"
        myReject("Logged Out");
    }
    else {
        fetch('http://127.0.0.1:5002/protected/user/get_username/', {
            method: "GET",
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        }).then(res => res.json())
            .then(function (data) {
                console.log(data)
                menuButtonDiv.innerHTML = '<div class=\"hidden-div\"><div id=\"menu-dropdown\" class=\"dropdown-content\"><a href=\"#\" class=\"nav-submenu-item\" id=\"profile-dropdown-btn\">پروفایل</a><a href=\"#\" class=\"nav-submenu-item\" id=\"logout-dropdown-btn\">خروج از حساب</a></div></div><button class=\"white-button-yellow-border\" id=\"menu-profile-btn\">'+ data + '</button>'
                myResolve("Logged In");
            });
    }
});

loginPromise.then(
    function (value) {
        document.getElementById("menu-profile-btn").addEventListener("click", viewDropDownMenu);
        document.getElementById("profile-dropdown-btn").addEventListener("click", goToProfilePage);
        document.getElementById("logout-dropdown-btn").addEventListener("click", logoutJWT);
    },
    function (error) {
        document.getElementById("sign-in-button").addEventListener("click", goToSignInPage);
    }
);