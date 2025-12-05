let html5QrCode;

document.getElementById("btn-scanner").onclick = () => {
  document.getElementById("scanner-modal").classList.remove("hidden");
  startScanner();
};

function closeScanner() {
  stopScanner();
  document.getElementById("scanner-modal").classList.add("hidden");
}

async function startScanner() {
  html5QrCode = new Html5Qrcode("reader");
  
  const cams = await Html5Qrcode.getCameras();
  const camID = cams.find(c => c.label.toLowerCase().includes("back"))?.id || cams[0].id;

  await html5QrCode.start(
    camID,
    { fps: 10, qrbox: 250 },
    codigo => processarEntrada(codigo)
  );
}

function stopScanner() {
  if (html5QrCode) html5QrCode.stop();
}
