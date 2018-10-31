const switchTab = () => {
    const tabContentArray = document.getElementsByClassName('tab')
    for(let i = 0; i < tabContent.length; i++) {
        tabContentArray[i].style.display = 'none';
    }

    // document.getElementById("")
}


const signInTab = document.getElementById("signIn");
const signUpTab = document.getElementById("signUp");


// document.on('domcontentloaded', _ => {
//     alert('DOM content loaded')
// })
const intercept = evt => {
    console.log(evt.target)
    const currentAttr = evt.target.getAttribute('href');
    console.log(currentAttr)
    clearActive([signInTab, signUpTab], "tab");
    document.getElementById(currentAttr.replace("#", "")).setAttribute('class', "tab active");
    console.log([signInTab, signUpTab])
    evt.stopPropagation()
}

const clearActive = (nodes, baseClass) => {
    nodes.forEach(element => {
        // console.log(element)
        element.setAttribute('class', baseClass);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const parentTabLinks = document.querySelector('.tab__links');
    parentTabLinks.addEventListener('click', intercept, false);
})

