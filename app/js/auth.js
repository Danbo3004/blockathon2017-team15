import { debug } from "util";

$(document).ready(function () {
    
    // var isLogin = JSON.parse(localStorage.getItem("isLogged"));
    // console.log(isLogin);
    // if (isLogin == null || isLogin != true) {
    //     loggedOut();
    // } else {
    //     loggedIn();
    // }

});


window.login = function () {

    console.log($('#exampleInputEmail1').val());
    console.log($('#exampleInputPassword1').val());

    if ($('#exampleInputEmail1').val() == 'user@gmail.com' && $('#exampleInputPassword1').val() == '123') {
        localStorage.setItem("isLogged", JSON.stringify(true)); 
        console.log(localStorage);
        loggedIn();
    }
}

window.loggedIn = function () {
    $('#loginpage').hide();
    $('#qrcodepage').show();
}

window.loggedOut = function () {
    $('#loginpage').show();
    $('#qrcodepage').hide();
}
