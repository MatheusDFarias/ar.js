const DESTINATION = {
  lat: -3.7413823,
  lng: -38.5131173
};

function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Vincula a lógica assim que a página e a câmera do A-Frame carregarem
window.addEventListener("load", () => {
  const cameraEl = document.querySelector('[gps-new-camera]');
  const waypointEl = document.getElementById('waypoint');
  const distanceDiv = document.getElementById("distance");

  if (!cameraEl) return;

  // Mudança crucial: escutar o evento diretamente no elemento da câmera
  cameraEl.addEventListener("gps-camera-update-position", (e) => {
    const lat = e.detail.position.latitude;
    const lng = e.detail.position.longitude;

    const dist = distanceMeters(
      lat,
      lng,
      DESTINATION.lat,
      DESTINATION.lng
    );

    // 1. Atualizar Painel de texto e conferir limite de 1km
    if (dist > 1000) {
      distanceDiv.innerText = `Destino: ${dist.toFixed(0)} m (Fora do raio de 1km)`;
      waypointEl.setAttribute('visible', 'false');
      return;
    } else {
      waypointEl.setAttribute('visible', 'true');
      distanceDiv.innerText = `Distância até o destino: ${dist.toFixed(0)} m`;
    }

    // 2. Lógica de Escala Dinâmica para visualização até 1km
    if (dist > 600) {
      waypointEl.setAttribute('scale', '25 25 25'); // Gigante no horizonte
    } else if (dist > 250) {
      waypointEl.setAttribute('scale', '12 12 12');
    } else if (dist > 50) {
      waypointEl.setAttribute('scale', '5 5 5');
    } else {
      waypointEl.setAttribute('scale', '1 1 1');     // Tamanho normal ao chegar perto
    }

    // 3. Feedback visual ao chegar bem perto (menos de 15 metros)
    if (dist <= 15) {
      waypointEl.setAttribute('material', 'color', 'green');
      distanceDiv.innerHTML = `Distância: ${dist.toFixed(0)} m <br><strong>Você chegou!</strong>`;
    } else {
      waypointEl.setAttribute('material', 'color', 'red');
    }
  });
});