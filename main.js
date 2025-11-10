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
    
    // Validação dos campos obrigatórios
    const tutorNome = document.getElementById('tutor-nome').value.trim();
    const animalNome = document.getElementById('animal-nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const motivo = document.getElementById('motivo').value.trim();

    // Validação básica
    if (!tutorNome || !animalNome || !telefone || !email || !data || !hora) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um email válido.');
        return;
    }

    const scriptURL = 'https://script.google.com/macros/s/AKfycbyZeeAcGbr0idMQyL-Qi0jC2IWPCTSpdc2oJCtF5f4O46oZSATaZka0y5vURZdA1ZUU/exec'; 
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML = 'Enviando...';

    // Preparar dados - usando URLSearchParams para melhor compatibilidade com Google Apps Script
    const params = new URLSearchParams();
    params.append('tutor-nome', tutorNome);
    params.append('animal-nome', animalNome);
    params.append('telefone', telefone);
    params.append('email', email);
    params.append('data', data);
    params.append('hora', hora);
    params.append('motivo', motivo || 'Não informado');

    // Log dos dados para debug
    console.log('=== ENVIO DE FORMULÁRIO ===');
    console.log('URL:', scriptURL);
    console.log('Dados:', {
        'tutor-nome': tutorNome,
        'animal-nome': animalNome,
        'telefone': telefone,
        'email': email,
        'data': data,
        'hora': hora,
        'motivo': motivo || 'Não informado'
    });

    // Método 1: Tentar com fetch usando FormData (mais comum)
    try {
        const formData = new FormData();
        params.forEach((value, key) => {
            formData.append(key, value);
        });

        const response = await fetch(scriptURL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Necessário para Google Apps Script
        });

        console.log('Requisição enviada com sucesso (modo no-cors)');
        console.log('NOTA: Com mode:no-cors, não é possível verificar a resposta do servidor');
        console.log('Verifique sua planilha do Google Sheets para confirmar se os dados foram recebidos');
        
        // Aguardar um pouco para dar tempo do script processar
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert('Agendamento solicitado com sucesso! Entraremos em contato em breve para confirmar.');
        form.reset();
        
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        console.error('Detalhes do erro:', {
            message: error.message,
            stack: error.stack
        });
        
        // Tentar método alternativo usando iframe (fallback)
        console.log('Tentando método alternativo com iframe...');
        try {
            submitViaIframe(scriptURL, params);
            alert('Agendamento solicitado com sucesso! Entraremos em contato em breve para confirmar.');
            form.reset();
        } catch (iframeError) {
            console.error('Erro também no método iframe:', iframeError);
            alert('Ocorreu um erro ao enviar sua solicitação. Por favor, verifique sua conexão e tente novamente.\n\nSe o problema persistir, verifique se o Google Apps Script está configurado corretamente.');
        }
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});

// Função auxiliar para enviar via iframe (método alternativo)
function submitViaIframe(url, params) {
    // Criar iframe oculto
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'hidden_iframe';
    document.body.appendChild(iframe);

    // Criar form temporário
    const tempForm = document.createElement('form');
    tempForm.method = 'POST';
    tempForm.action = url;
    tempForm.target = 'hidden_iframe';
    tempForm.style.display = 'none';

    // Adicionar campos ao form
    params.forEach((value, key) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        tempForm.appendChild(input);
    });

    document.body.appendChild(tempForm);
    tempForm.submit();

    // Limpar após envio
    setTimeout(() => {
        if (document.body.contains(tempForm)) {
            document.body.removeChild(tempForm);
        }
        if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
        }
    }, 2000);
}

// Função para testar conexão com o Google Apps Script (útil para debug)
// Para usar: testGoogleScriptConnection() no console do navegador
function testGoogleScriptConnection() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbz7-nNbmb9kwRHFNjWjrQBZJM1Z3RRV4KklaPUJoss30dfF9yS5S7p9Q7RuHF_4ssQjIg/exec';
    
    console.log('=== TESTE DE CONEXÃO COM GOOGLE APPS SCRIPT ===');
    console.log('URL:', scriptURL);
    
    // Testar com GET (se o script tiver função doGet)
    fetch(scriptURL + '?teste=1', { mode: 'no-cors' })
        .then(() => {
            console.log('✓ Requisição GET enviada (modo no-cors)');
            console.log('NOTA: Com no-cors não é possível ver a resposta');
        })
        .catch(err => {
            console.error('✗ Erro na requisição GET:', err);
        });
    
    // Testar com dados de exemplo
    const testData = new FormData();
    testData.append('tutor-nome', 'Teste');
    testData.append('animal-nome', 'Pet Teste');
    testData.append('telefone', '(11) 99999-9999');
    testData.append('email', 'teste@teste.com');
    testData.append('data', '2025-12-31');
    testData.append('hora', '10:00');
    testData.append('motivo', 'Teste de conexão');
    
    fetch(scriptURL, {
        method: 'POST',
        body: testData,
        mode: 'no-cors'
    })
    .then(() => {
        console.log('✓ Requisição POST de teste enviada');
        console.log('Verifique sua planilha do Google Sheets para ver se os dados foram recebidos');
    })
    .catch(err => {
        console.error('✗ Erro na requisição POST:', err);
    });
}

// Expor função de teste no escopo global para uso no console
window.testGoogleScriptConnection = testGoogleScriptConnection;

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