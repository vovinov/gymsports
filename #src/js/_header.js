
const navLink = document.querySelectorAll('.navigation__link');
for (let i = 1; i < navLink.length; i++) {
    if (navLink[i].nextElementSibling) {
        navLink[i].addEventListener('click', function(e) {
            e.preventDefault();
            navLink[i].classList.toggle('active');
            navLink[i].nextElementSibling.classList.toggle('open');
        })
    }
}
