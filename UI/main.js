const nav = document.getElementById('nav')

document.querySelector('div.logo.rounded-edges').addEventListener('click', function(evt){
    evt.preventDefault();
    if (nav) {
        nav.getAttribute('class') === 'nav' ? nav.setAttribute('class', 'nav active') : nav.setAttribute('class', 'nav');
    }
})