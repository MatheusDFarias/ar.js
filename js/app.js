const DESTINATION = {
  lat: -3.7413823,
  lng: -38.5131173
};


function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;

  const a =
    Math.sin(dLat/2) ** 2 +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

window.addEventListener("gps-camera-update-position", (e) => {
  const lat = e.detail.position.latitude;
  const lng = e.detail.position.longitude;

  const dist = distanceMeters(
    lat,
    lng,
    DESTINATION.lat,
    DESTINATION.lng
  );

  document.getElementById("distance").innerText =
    `Distância até o destino: ${dist.toFixed(0)} m`;
});
