function handleUpload(uploadId, outputId, spinnerId, previewId) {
  const input = document.getElementById(uploadId);
  input.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
      // Show image preview
      const preview = document.getElementById(previewId);
      preview.src = reader.result;
      preview.style.display = 'block';

      document.getElementById(spinnerId).style.display = 'block';
      document.getElementById(outputId).innerText = '';

      Tesseract.recognize(
        reader.result,
        'eng',
        { logger: m => console.log(m) }
      ).then(({ data: { text } }) => {
        document.getElementById(spinnerId).style.display = 'none';
        document.getElementById(outputId).innerText = text;
      }).catch(err => {
        document.getElementById(spinnerId).style.display = 'none';
        document.getElementById(outputId).innerText = 'Failed to read text.';
      });
    };
    reader.readAsDataURL(file);
  });
}

// Call with preview IDs too
handleUpload('uploadleft', 'outputleft', 'spinnerleft', 'previewleft');
handleUpload('uploadright', 'outputright', 'spinnerright', 'previewright');


function clearOCR(uploadId, outputId) {
  const input = document.getElementById(uploadId);
  const output = document.getElementById(outputId);

  input.value = ''; // Clear file input
  output.innerText = 'Text will appear here...'; // Clear OCR output

  const preview = document.getElementById('preview' + uploadId.slice(-1)); // e.g., 'preview1' from 'upload1'
  preview.src = '';
  preview.style.display = 'none';
}


function downloadText(outputId, filename) {
  const text = document.getElementById(outputId).innerText;
  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function openFullPreview(previewId) {
  const src = document.getElementById(previewId).src;
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");

  modalImg.src = src;
  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}
