async function carregarTerramotos() {
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
    const listaDiv = document.getElementById("lista");
    listaDiv.innerHTML = "🔎 A carregar...";

    try 
{
    const resposta = await fetch(url);
    const dados = await resposta.json();

    listaDiv.innerHTML = ""; // limpa antes de mostrar
    document.getElementById("contador").textContent = "Total de terramotos: " + dados.features.length;

    dados.features.forEach(eq => {
        const props = eq.properties;
        const coords = eq.geometry.coordinates;

        const magnitude = props.mag;
        const local = props.place;
        const data = tempoRelativo(props.time);
        const link = props.url;

        // Decide classe visual com base na magnitude
        let classe = "leve";
        if (magnitude >= 5) 
            classe = "forte";
        else if (magnitude >= 3) 
            classe = "moderado";

        // Cria elemento HTML
        const div = document.createElement("div");
        div.className = "terramoto " + classe;
        div.innerHTML = 
            `<strong>${local}</strong><br>
            Magnitude: ${magnitude}<br>
            Data/hora: ${data}<br>
            <a href="${link}" target="_blank">Mais detalhes</a>`;
        listaDiv.appendChild(div);
    });

} 
  catch (erro) 
  {
    listaDiv.innerHTML = "❌ Erro ao carregar dados.";
    console.error(erro);
  }
  function tempoRelativo(timestamp) 
  {
    const agora = Date.now();
    const diferenca = agora - timestamp;

    const segundos = Math.floor(diferenca / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (segundos < 60) 
        return `há ${segundos} segundos`;
    else if (minutos < 60) 
        return `há ${minutos} minutos`;
    else if (horas < 24) 
         `há ${horas} horas`;
    else
    return `há ${dias} dia${dias > 1 ? "s" : ""}`;
}
}
// Atualiza a cada 60 segundos
setInterval(function () 
{
  carregarTerramotos();
}, 60000);

