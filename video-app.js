let currentFile = null;
let compressedVideoBlob = null;

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const dropContent = document.getElementById('dropContent');
const trackInfo = document.getElementById('trackInfo');
const trackName = document.getElementById('trackName');
const trackMeta = document.getElementById('trackMeta');

const resolutionSelect = document.getElementById('resolutionSelect');
const qualitySelect = document.getElementById('qualitySelect');

const origSizeEl = document.getElementById('origSize');
const compSizeEl = document.getElementById('compSize');
const savedRatioEl = document.getElementById('savedRatio');

const compressBtn = document.getElementById('compressBtn');
const downloadVideoBtn = document.getElementById('downloadVideoBtn');
const videoPreview = document.getElementById('videoPreview');
const playerWrapper = document.getElementById('playerWrapper');
const placeholderText = document.getElementById('placeholderText');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

dropZone.addEventListener('click', (e) => {
  if (e.target !== fileInput) fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleVideoFile(e.target.files[0]);
  }
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

['dragleave', 'drop'].forEach((evt) => {
  dropZone.addEventListener(evt, () => dropZone.classList.remove('drag-over'));
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  if (e.dataTransfer.files.length > 0) {
    handleVideoFile(e.dataTransfer.files[0]);
  }
});

function handleVideoFile(file) {
  if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|mkv)$/i)) {
    alert('Please select a valid video file.');
    return;
  }

  currentFile = file;
  dropContent.hidden = true;
  trackInfo.hidden = false;
  trackName.textContent = file.name;

  origSizeEl.textContent = formatBytes(file.size);
  compSizeEl.textContent = '0 MB';
  savedRatioEl.textContent = '0%';

  const videoUrl = URL.createObjectURL(file);
  videoPreview.src = videoUrl;
  
  videoPreview.onloadedmetadata = () => {
    trackMeta.textContent = `${videoPreview.videoWidth}x${videoPreview.videoHeight} | ${Math.round(videoPreview.duration)}s`;
  };

  placeholderText.hidden = true;
  playerWrapper.hidden = false;
  compressBtn.disabled = false;
}

compressBtn.addEventListener('click', async () => {
  if (!currentFile) return;

  compressBtn.disabled = true;
  progressContainer.hidden = false;
  progressBar.style.width = '0%';
  progressText.textContent = 'Simulating Compression... 0%';

  
  for (let i = 1; i <= 100; i++) {
    await new Promise((r) => setTimeout(r, 20));
    progressBar.style.width = `${i}%`;
    progressText.textContent = `Encoding... ${i}%`;
  }

  
  const scale = parseFloat(resolutionSelect.value);
  const reductionFactor = scale === 0.5 ? 0.35 : scale === 0.75 ? 0.6 : 0.8;
  const simulatedCompressedSize = Math.round(currentFile.size * reductionFactor);

  compressedVideoBlob = currentFile; 
  updateStats(currentFile.size, simulatedCompressedSize);

  progressText.textContent = 'Compression Complete!';
  compressBtn.disabled = false;
  downloadVideoBtn.disabled = false;
});

function updateStats(origBytes, compBytes) {
  origSizeEl.textContent = formatBytes(origBytes);
  compSizeEl.textContent = formatBytes(compBytes);

  const savedPercent = (((origBytes - compBytes) / origBytes) * 100).toFixed(1);
  savedRatioEl.textContent = `${savedPercent > 0 ? '-' : '+'}${Math.abs(savedPercent)}%`;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 MB';
  const k = 1024 * 1024;
  return (bytes / k).toFixed(2) + ' MB';
}

downloadVideoBtn.addEventListener('click', () => {
  if (!compressedVideoBlob) return;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(compressedVideoBlob);
  link.download = `hydravid-${Date.now()}.mp4`;
  link.click();
});