// Script para capturar os dados do formulário de cadastro
document.addEventListener('DOMContentLoaded', function() {
  // Procura pelo formulário de cadastro quando o DOM estiver carregado
  const observeDOM = () => {
    const cadastroForm = document.getElementById('cadastro-form') || 
                         document.querySelector('form:has(input[name="nome-completo"])') || 
                         document.querySelector('form:has(#nome-completo)');
    
    if (cadastroForm) {
      // Adiciona manipulador de eventos ao formulário
      cadastroForm.addEventListener('submit', handleCadastroSubmit);
      console.log('Manipulador de eventos adicionado ao formulário de cadastro');
      return true;
    }
    return false;
  };

  // Função para capturar os dados do formulário
  function handleCadastroSubmit(event) {
    // Não interrompe o envio normal do formulário
    
    // Coleta os dados do formulário
    const formElements = event.target.elements;
    
    // Cria um objeto com os dados do usuário
    const userData = {
      name: getValue(formElements, 'nome-completo', 'nome'),
      email: getValue(formElements, 'email'),
      cpf: getValue(formElements, 'cpf'),
      phone: getValue(formElements, 'telefone'),
      address: getValue(formElements, 'endereco'),
      cep: getValue(formElements, 'cep'),
      bairro: getValue(formElements, 'bairro'),
      estado: getValue(formElements, 'estado'),
      pix: getValue(formElements, 'pix')
    };
    
    // Salva os dados do usuário no localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    
    console.log('Dados do cadastro salvos no localStorage:', userData);
  }
  
  // Função auxiliar para obter valor de campos (tenta diferentes nomes possíveis)
  function getValue(elements, ...possibleNames) {
    for (const name of possibleNames) {
      const element = elements[name] || document.getElementById(name) || 
                      document.querySelector(`[name="${name}"]`) || document.querySelector(`#${name}`);
      if (element && element.value) {
        return element.value;
      }
    }
    return '';
  }
  
  // Se não encontrar o formulário imediatamente, configure um MutationObserver para vigiar mudanças no DOM
  if (!observeDOM()) {
    const observer = new MutationObserver((mutations) => {
      if (observeDOM()) {
        observer.disconnect(); // Para de observar quando o formulário for encontrado
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
});
