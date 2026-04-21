let pdfDoc = null;
let scale = 1.3;

// ✔ Worker correcto SIEMPRE arriba
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

// 👉 Cargar PDF desde index
window.onload = function () {
  const file = localStorage.getItem("pdf_url");
  const title = localStorage.getItem("pdf_title");

  console.log("PDF URL:", file);

  if (title) {
    document.getElementById("title").innerText = title;
  }

  if (file) {
    loadPDF(file);
  } else {
    console.error("No hay PDF en localStorage");
  }
};

// 👉 Cargar PDF
function loadPDF(url) {
  console.log("Cargando PDF:", url);

  pdfjsLib.getDocument(url).promise
    .then(pdf => {
      pdfDoc = pdf;
      renderPDF();
    })
    .catch(error => {
      console.error("❌ Error cargando PDF:", error);
    });
}

// 👉 Render
function renderPDF() {
  const container = document.getElementById("viewer");
  container.innerHTML = "";

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    pdfDoc.getPage(i).then(page => {
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      canvas.className = "shadow-lg rounded-lg bg-white";

      container.appendChild(canvas);

      page.render({
        canvasContext: ctx,
        viewport: viewport
      });
    });
  }
}