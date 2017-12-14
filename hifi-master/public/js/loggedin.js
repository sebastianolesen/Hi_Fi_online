document.addEventListener("DOMContentLoaded", event => {
    if (localStorage.getItem('token') === null) {
          window.location.assign('login.html');
    }
});