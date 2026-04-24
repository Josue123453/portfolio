let pdfDoc = null;
let scale = 1.5;

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

// LinkService completo para pdf.js 2.16
class PDFLinkService {
  constructor() {
    this.externalLinkTarget = 2; // _blank
    this.externalLinkRel = "noopener noreferrer nofollow";
    this.externalLinkEnabled = true;
    this._pagesRefCache = {};
  }

  // ← ESTE es el método que faltaba
  addLinkAttributes(element, url, newWindow = true) {
    element.href = url;
    element.rel  = this.externalLinkRel;
    if (newWindow) {
      element.target = "_blank";
    }
    element.onclick = () => {
      window.open(url, "_blank", "noopener,noreferrer");
      return false;
    };
  }

  getDestinationHash(dest)    { return "#"; }
  getAnchorUrl(hash)          { return "#"; }
  setHash(hash)               {}
  executeNamedAction(action)  {}
  cachePageRef(pageNum, ref)  { this._pagesRefCache[ref] = pageNum; }
  isPageVisible(n)            { return true; }
  get pagesCount()            { return 0; }
  get page()                  { return 0; }
  set page(v)                 {}
  get rotation()              { return 0; }
  set rotation(v)             {}
  goToDestination(dest)       {}
  goToPage(val)               {}
  navigateTo(dest)            {}
  getPageIndex(ref)           { return Promise.resolve(0); }
}

window.onload = function () {
  const file  = localStorage.getItem("pdf_url");
  const title = localStorage.getItem("pdf_title");
  if (title) document.getElementById("title").innerText = title;
  if (file)  loadPDF(file);
};

function loadPDF(url) {
  pdfjsLib.getDocument(url).promise
    .then(pdf => { pdfDoc = pdf; renderPDF(); })
    .catch(err => console.error("Error cargando PDF:", err));
}

async function renderPDF() {
  const container  = document.getElementById("viewer");
  container.innerHTML = "";
  const linkService = new PDFLinkService();

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page     = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const pageDiv = document.createElement("div");
    pageDiv.style.cssText = `
      position: relative;
      width: ${viewport.width}px;
      height: ${viewport.height}px;
      margin-bottom: 20px;
    `;

    const canvas = document.createElement("canvas");
    canvas.width  = viewport.width;
    canvas.height = viewport.height;
    canvas.style.cssText = "position: absolute; top: 0; left: 0; display: block;";

    const annotDiv = document.createElement("div");
    annotDiv.className = "annotationLayer";
    annotDiv.style.cssText = `
      position: absolute;
      top: 0; left: 0;
      width: ${viewport.width}px;
      height: ${viewport.height}px;
      z-index: 10;
    `;

    pageDiv.appendChild(canvas);
    pageDiv.appendChild(annotDiv);
    container.appendChild(pageDiv);

    await page.render({
      canvasContext: canvas.getContext("2d"),
      viewport
    }).promise;

    try {
      const annotations = await page.getAnnotations({ intent: "display" });
      if (annotations?.length) {
        pdfjsLib.AnnotationLayer.render({
          viewport: viewport.clone({ dontFlip: false }),
          div:         annotDiv,
          annotations,
          page,
          linkService,
          renderForms: false,
        });
      }
    } catch (e) {
      console.warn(`Annotation error página ${i}:`, e);
    }
  }
}
