# Configuração do Google Apps Script para Formulário

## Problema Comum

Se os dados do formulário não estão sendo importados para a planilha do Google Sheets, o problema geralmente está na configuração do Google Apps Script, não no código JavaScript.

## Solução: Configurar o Google Apps Script

### 1. Criar o Script

1. Acesse [Google Apps Script](https://script.google.com/)
2. Crie um novo projeto
3. Cole o seguinte código:

```javascript
function doPost(e) {
  try {
    // Obter a planilha ativa (ou substitua pelo ID da sua planilha)
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Obter os dados do formulário
    var tutorNome = e.parameter['tutor-nome'] || '';
    var animalNome = e.parameter['animal-nome'] || '';
    var telefone = e.parameter['telefone'] || '';
    var email = e.parameter['email'] || '';
    var data = e.parameter['data'] || '';
    var hora = e.parameter['hora'] || '';
    var motivo = e.parameter['motivo'] || 'Não informado';
    
    // Adicionar timestamp
    var timestamp = new Date();
    
    // Verificar se é a primeira linha (cabeçalhos)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Nome do Tutor', 'Nome do Animal', 'Telefone', 'Email', 'Data', 'Hora', 'Motivo']);
    }
    
    // Adicionar os dados na planilha
    sheet.appendRow([timestamp, tutorNome, animalNome, telefone, email, data, hora, motivo]);
    
    // Retornar sucesso
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Dados salvos com sucesso'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Retornar erro
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Função de teste (opcional)
function doGet(e) {
  return ContentService.createTextOutput('Script funcionando corretamente!');
}
```

### 2. Configurar a Planilha

**IMPORTANTE:** Antes de fazer o deploy, você precisa:

1. Criar uma planilha do Google Sheets
2. Compartilhar a planilha (ou o script terá permissões limitadas)
3. No código acima, você pode substituir `SpreadsheetApp.getActiveSpreadsheet()` por:
   ```javascript
   var spreadsheet = SpreadsheetApp.openById('ID_DA_SUA_PLANILHA');
   var sheet = spreadsheet.getSheetByName('Nome_da_Aba') || spreadsheet.getActiveSheet();
   ```

### 3. Fazer o Deploy como Web App

1. No editor do Google Apps Script, clique em **"Implantar"** > **"Nova implantação"**
2. Clique no ícone de engrenagem ⚙️ ao lado de **"Tipo"** e selecione **"Aplicativo da Web"**
3. Configure:
   - **Descrição**: "Formulário de Agendamento"
   - **Executar como**: "Eu" (sua conta)
   - **Quem tem acesso**: **"Qualquer pessoa"** (IMPORTANTE!)
4. Clique em **"Implantar"**
5. **Copie a URL da Web App** - essa é a URL que você deve usar no `main.js`

### 4. Autorizar o Script

Na primeira execução, você precisará autorizar o script:
1. Clique em **"Revisar permissões"**
2. Selecione sua conta do Google
3. Clique em **"Avançado"** > **"Ir para [nome do projeto] (não seguro)"**
4. Autorize o acesso à planilha

### 5. Verificar se está Funcionando

1. Teste o script usando a função `doGet` (deve retornar "Script funcionando corretamente!")
2. Teste o formulário no site
3. Verifique a planilha - os dados devem aparecer automaticamente

## Problemas Comuns e Soluções

### Dados não aparecem na planilha

1. **Verifique as permissões**: O script deve ter acesso à planilha
2. **Verifique o nome dos campos**: Os nomes no script (`e.parameter['tutor-nome']`) devem corresponder aos `name` dos campos no HTML
3. **Verifique o deploy**: Certifique-se de que fez o deploy como "Aplicativo da Web" e não como "Add-on"

### Erro 403 (Acesso Negado)

- Certifique-se de que o deploy foi feito com **"Quem tem acesso: Qualquer pessoa"**
- Verifique se autorizou o script corretamente

### Erro 404 (Não Encontrado)

- Verifique se a URL do script no `main.js` está correta
- Verifique se o script foi implantado corretamente

### Dados aparecem, mas em formato errado

- Verifique se os nomes dos campos no script correspondem aos nomes no HTML
- Adicione logs no script para debug:
  ```javascript
  Logger.log('Dados recebidos: ' + JSON.stringify(e.parameter));
  ```

## Testando o Script

Você pode testar o script diretamente no navegador:

1. Pegue a URL do seu script (a mesma que está no `main.js`)
2. Adicione parâmetros de teste: `?tutor-nome=Teste&animal-nome=Pet&telefone=11999999999&email=teste@teste.com&data=2025-01-15&hora=10:00&motivo=Consulta`
3. Acesse a URL no navegador
4. Verifique se os dados apareceram na planilha

## Melhorias Adicionais

### Adicionar validação no servidor:

```javascript
function doPost(e) {
  try {
    // Validar campos obrigatórios
    var tutorNome = e.parameter['tutor-nome'];
    if (!tutorNome || tutorNome.trim() === '') {
      throw new Error('Nome do tutor é obrigatório');
    }
    
    // ... resto do código
  } catch (error) {
    // ... tratamento de erro
  }
}
```

### Enviar email de notificação:

```javascript
// Adicione após salvar os dados
MailApp.sendEmail({
  to: 'seu-email@exemplo.com',
  subject: 'Novo Agendamento - ' + tutorNome,
  body: 'Novo agendamento recebido:\n\n' +
        'Tutor: ' + tutorNome + '\n' +
        'Animal: ' + animalNome + '\n' +
        'Telefone: ' + telefone + '\n' +
        'Email: ' + email + '\n' +
        'Data: ' + data + '\n' +
        'Hora: ' + hora + '\n' +
        'Motivo: ' + motivo
});
```

## Suporte

Se ainda tiver problemas, verifique:
1. O console do navegador (F12) para erros JavaScript
2. Os logs do Google Apps Script (Execuções > Ver logs)
3. As permissões da planilha e do script

