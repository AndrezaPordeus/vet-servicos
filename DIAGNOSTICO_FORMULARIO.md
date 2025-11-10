# Diagnóstico: Formulário não está enviando dados para a planilha

## O que foi corrigido no código JavaScript

### 1. Validação de Campos
- ✅ Adicionada validação de campos obrigatórios antes do envio
- ✅ Validação de formato de email
- ✅ Mensagens de erro mais claras para o usuário

### 2. Melhor Tratamento de Dados
- ✅ Limpeza de espaços em branco (trim)
- ✅ Formatação correta dos dados antes do envio
- ✅ Valores padrão para campos opcionais

### 3. Logs de Debug
- ✅ Console logs detalhados para facilitar diagnóstico
- ✅ Logs mostram exatamente quais dados estão sendo enviados
- ✅ Função de teste disponível no console do navegador

### 4. Método Alternativo
- ✅ Implementado fallback usando iframe caso o método principal falhe
- ✅ Melhor tratamento de erros

## Como Diagnosticar o Problema

### Passo 1: Verificar o Console do Navegador

1. Abra o site no navegador
2. Pressione **F12** para abrir as Ferramentas de Desenvolvedor
3. Vá para a aba **Console**
4. Preencha e envie o formulário
5. Verifique os logs que aparecem:
   - Deve aparecer `=== ENVIO DE FORMULÁRIO ===`
   - Deve mostrar os dados que estão sendo enviados
   - Deve mostrar `Requisição enviada com sucesso (modo no-cors)`

### Passo 2: Testar a Conexão

1. Com o console aberto (F12), digite:
   ```javascript
   testGoogleScriptConnection()
   ```
2. Pressione Enter
3. Verifique os logs no console
4. Verifique sua planilha do Google Sheets para ver se apareceu uma linha de teste

### Passo 3: Verificar a Configuração do Google Apps Script

**Este é o passo mais importante!** O problema geralmente está aqui.

Consulte o arquivo `GOOGLE_APPS_SCRIPT_SETUP.md` para instruções detalhadas.

#### Verificações Rápidas:

1. **O script está implantado como "Aplicativo da Web"?**
   - Não apenas salvo, mas **implantado**
   - Tipo: "Aplicativo da Web"
   - "Quem tem acesso": **"Qualquer pessoa"** (muito importante!)

2. **A URL do script está correta?**
   - Verifique se a URL no `main.js` (linha 51) corresponde à URL do deploy
   - A URL deve terminar com `/exec`

3. **O script tem permissões?**
   - O script precisa estar autorizado a acessar a planilha
   - Verifique em: Execuções > Ver logs (pode mostrar erros de permissão)

4. **A planilha existe e está acessível?**
   - Verifique se a planilha foi criada
   - Verifique se o script tem acesso a ela
   - No código do script, verifique se o ID da planilha está correto

### Passo 4: Verificar os Nomes dos Campos

Os nomes dos campos no HTML devem corresponder exatamente aos nomes no Google Apps Script:

**HTML (index.html):**
- `name="tutor-nome"`
- `name="animal-nome"`
- `name="telefone"`
- `name="email"`
- `name="data"`
- `name="hora"`
- `name="motivo"`

**Google Apps Script deve ter:**
```javascript
e.parameter['tutor-nome']
e.parameter['animal-nome']
e.parameter['telefone']
e.parameter['email']
e.parameter['data']
e.parameter['hora']
e.parameter['motivo']
```

### Passo 5: Verificar os Logs do Google Apps Script

1. Acesse [Google Apps Script](https://script.google.com/)
2. Abra seu projeto
3. Vá em **Execuções** (ícone de relógio)
4. Veja se há execuções recentes
5. Se houver erros, clique neles para ver detalhes

## Problemas Comuns e Soluções

### Problema: "Dados não aparecem na planilha"

**Possíveis causas:**
1. Script não está implantado corretamente
2. Permissões não estão configuradas
3. Nomes dos campos não correspondem
4. Planilha não está acessível pelo script

**Solução:**
- Siga as instruções em `GOOGLE_APPS_SCRIPT_SETUP.md`
- Verifique os logs do Google Apps Script
- Teste a URL do script diretamente no navegador com parâmetros

### Problema: "Erro 403 (Acesso Negado)"

**Causa:** O deploy não foi feito com "Qualquer pessoa" ou o script não está autorizado

**Solução:**
1. Faça um novo deploy
2. Certifique-se de selecionar "Quem tem acesso: Qualquer pessoa"
3. Autorize o script quando solicitado

### Problema: "Erro 404 (Não Encontrado)"

**Causa:** URL do script está incorreta ou o script não foi implantado

**Solução:**
1. Verifique se a URL no `main.js` está correta
2. Certifique-se de que o script foi implantado (não apenas salvo)
3. Copie a URL diretamente da página de deploy

### Problema: "Console mostra sucesso, mas dados não aparecem"

**Causa:** O JavaScript está enviando os dados corretamente, mas o Google Apps Script não está processando

**Solução:**
1. Verifique os logs do Google Apps Script
2. Verifique se a função `doPost` está correta
3. Verifique se a planilha está configurada corretamente no script
4. Teste o script manualmente acessando a URL com parâmetros

## Teste Manual do Script

Para testar se o script está funcionando, acesse esta URL no navegador (substitua pela sua URL):

```
https://script.google.com/macros/s/SUA_URL_AQUI/exec?tutor-nome=Teste&animal-nome=Pet&telefone=11999999999&email=teste@teste.com&data=2025-01-15&hora=10:00&motivo=Teste
```

Se os dados aparecerem na planilha, o script está funcionando e o problema está no JavaScript.
Se os dados não aparecerem, o problema está no Google Apps Script.

## Próximos Passos

1. ✅ **Verificar o console do navegador** - ver se há erros JavaScript
2. ✅ **Testar a conexão** - usar `testGoogleScriptConnection()` no console
3. ✅ **Verificar a configuração do Google Apps Script** - seguir `GOOGLE_APPS_SCRIPT_SETUP.md`
4. ✅ **Verificar os logs do Google Apps Script** - ver se há erros de execução
5. ✅ **Testar manualmente** - acessar a URL do script com parâmetros

## Ajuda Adicional

Se após seguir todos os passos o problema persistir:

1. Verifique os logs do console do navegador (F12)
2. Verifique os logs do Google Apps Script
3. Verifique se a planilha está recebendo os dados (pode estar em outra aba)
4. Teste com dados simples primeiro
5. Verifique se há limites de cota no Google Apps Script

## Nota Importante

Com `mode: 'no-cors'` no fetch, não é possível verificar a resposta do servidor diretamente no JavaScript. Isso significa que:

- O JavaScript sempre mostrará "sucesso" se a requisição for enviada
- Você precisa verificar a planilha para confirmar se os dados foram recebidos
- Os logs do Google Apps Script são essenciais para diagnóstico

Por isso, é muito importante verificar:
1. Os logs do console (para ver se os dados estão sendo enviados)
2. Os logs do Google Apps Script (para ver se os dados estão sendo recebidos)
3. A planilha (para ver se os dados foram salvos)

