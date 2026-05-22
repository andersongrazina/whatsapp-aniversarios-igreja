function verificarAniversariantes() {
  var urlDaPlanilha = "https://docs.google.com/spreadsheets/d/1uFKtr-BX1OhpLsEcuTmsgPIy_ANLVLv8sVOWSf8UFfg/edit?resourcekey=&gid=300307844#gid=300307844";
  var planilha = SpreadsheetApp.openByUrl(urlDaPlanilha);
  
  // 1. LER OS ANIVERSARIANTES
  var abaRespostas = planilha.getSheets()[0]; 
  var data = abaRespostas.getDataRange().getValues();
  
  var hoje = new Date();
  var diaHoje = hoje.getDate();
  var mesHoje = hoje.getMonth() + 1;
  var anoHoje = hoje.getFullYear();

  var listaAniversariantes = ""; 
  var encontrouAlguem = false;

  for (var i = 1; i < data.length; i++) {
    var nome = data[i][1];               // Coluna B
    var telefone = data[i][2];           // Coluna C (Apanha o telefone da pessoa)
    var dataNasc = new Date(data[i][3]); // Coluna D
    
    if (dataNasc instanceof Date && !isNaN(dataNasc)) {
      var diaNasc = dataNasc.getDate();
      var mesNasc = dataNasc.getMonth() + 1;
      var anoNasc = dataNasc.getFullYear();
      
      if (diaNasc === diaHoje && mesNasc === mesHoje) {
        var idade = anoHoje - anoNasc;
        
        // Formato atualizado com o seu template (mantive o negrito no nome para destacar)
        listaAniversariantes += "🎉 *" + nome + "* ➔ " + idade + " anos ➔ Tel: " + telefone + "\n";
        encontrouAlguem = true;
      }
    }
  }

  // 2. DEFINE A MENSAGEM FINAL
  var mensagemFinal = "";
  if (encontrouAlguem) {
    mensagemFinal = "🎂 *Aniversariantes de Hoje:*\n\n" + listaAniversariantes;
  } else {
    mensagemFinal = "Poxa... Ninguém faz aniversário hoje 😔\nQue dia triste!";
  }

  // 3. ENVIA PARA A LISTA DA ABA "Líderes"
  var abaLideres = planilha.getSheetByName("Líderes");
  
  if (!abaLideres) {
    Logger.log("Erro: Aba 'Líderes' não encontrada.");
    return;
  }
  
  var dadosLideres = abaLideres.getDataRange().getValues();
  
  for (var j = 1; j < dadosLideres.length; j++) {
    var nomeLider = dadosLideres[j][0];    
    var telefoneLider = dadosLideres[j][1]; 
    var apiKeyLider = dadosLideres[j][2];   
    
    if (telefoneLider && apiKeyLider) {
      enviarCallMeBot(telefoneLider, apiKeyLider, mensagemFinal);
      Utilities.sleep(1500); 
    }
  }
}

// 4. FUNÇÃO DE DISPARO
function enviarCallMeBot(numeroDestino, apiKey, textoDaMensagem) {
  var textoCodificado = encodeURIComponent(textoDaMensagem);
  var url = "https://api.callmebot.com/whatsapp.php?phone=" + numeroDestino + "&text=" + textoCodificado + "&apikey=" + apiKey;
  
  var options = {
    "method": "get",
    "muteHttpExceptions": true 
  };
  
  var resposta = UrlFetchApp.fetch(url, options);
  Logger.log("Envio para " + numeroDestino + " | Status: " + resposta.getContentText());
}
