
document.addEventListener('DOMContentLoaded', () => {
  const btnTop = document.getElementById("btnTop");
  function toggleBtnTop() {
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    if (scrollPosition >= pageHeight - 20) {
      btnTop.classList.remove('hidden');
    } else {
      btnTop.classList.add('hidden');
    }
  }
  window.addEventListener('scroll', toggleBtnTop);
  toggleBtnTop(); // Ejecutar al cargar
});




