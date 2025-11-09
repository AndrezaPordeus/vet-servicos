// Inicialização do Swiper (Carrossel de Serviços)
var swiper = new Swiper(".servicesCarousel", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        // Quando a largura da janela for >= 768px
        768: {
            slidesPerView: 2,
            spaceBetween: 30
        },
        // Quando a largura da janela for >= 1024px
        1024: {
            slidesPerView: 3,
            spaceBetween: 30
        }
    }
});

// Lógica do Formulário de Agendamento
const form = document.getElementById('agendamento-form');
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const scriptURL = 'https://script.google.com/macros/s/AKfycbz7-nNbmb9kwRHFNjWjrQBZJM1Z3RRV4KklaPUJoss30dfF9yS5S7p9Q7RuHF_4ssQjIg/exec'; 
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML = 'Enviando...';

    try {
        await fetch(scriptURL, { method: 'POST', body: formData, mode: 'no-cors' });
        alert('Agendamento solicitado com sucesso! Entraremos em contato em breve para confirmar.');
        form.reset();
    } catch (error) {
        console.error('Erro ao enviar o formulário (pode ser um erro de rede):', error);
        alert('Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente mais tarde.');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});

// Lógica do Menu Hambúrguer
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Script para formatar o campo de telefone
const telefoneInput = document.getElementById('telefone');
telefoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{5})(\d{4})$/, '$1-$2');
    e.target.value = value;
});