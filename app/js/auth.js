$(document).ready(function () {
    if (!$('#loginpage').length) {
        return;
    }
    var isLogin = localStorage.getItem("isLogged");
    if (isLogin == null || isLogin == false) {
        $('#qrcodepage').hide();
        console.log('hide');
    } else {
        loggedIn();
    }
    var isLogin = localStorage.getItem("isLogged");
    if (isLogin == null || isLogin == false) {
        $('#qrcodepage').hide();
        console.log('hide');
    } else {
        loggedIn();
    }

});


window.login = function () {
    console.log($('#exampleInputEmail1').val());
    console.log($('#exampleInputPassword1').val());

    if ($('#exampleInputEmail1').val() == 'user@gmail.com' && $('#exampleInputPassword1').val() == '123') {
        console.log('hi');
        localStorage.setItem("isLogged", 'true');
        console.log(localStorage);
        loggedIn();
    }
}

window.loggedIn = function () {
    $('#loginpage').hide();
    $('#qrcodepage').show();
}
