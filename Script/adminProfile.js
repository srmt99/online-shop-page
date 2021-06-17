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
}