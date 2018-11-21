const modal = document.getElementById('cancelModal');
const modalStarter = document.querySelectorAll('button.button.danger');
const modalCloser = document.getElementById('closeModal');
const cancelConfirm = document.querySelector('#cancelModal > div > p > button');
const openModal = () => { modal.style.display = 'block' };

if (modalStarter) {
    for(let i = 0; i < modalStarter.length; i++) {
        modalStarter[i].addEventListener('click', openModal);
    }
}

const detailsCancelBtn = document.getElementById('actionButton');

if (detailsCancelBtn) detailsCancelBtn.addEventListener('click', openModal)

modalCloser.addEventListener('click', () => { modal.style.display = 'none' });
cancelConfirm.addEventListener('click', () => { modal.style.display = 'none' });

window.onclick = evt => {
    if (evt.target == modal) modal.style.display = 'none';
}


