document.addEventListener('DOMContentLoaded', function () {

  const heroBtn = document.getElementById('hero-btn');
  if (!heroBtn) return;

  // Klasse beim Laden auch auf html setzen
  document.documentElement.classList.add('inhalt-gesperrt');

  heroBtn.addEventListener('click', function () {
    // Scroll-Sperre auf body UND html aufheben
    document.body.classList.remove('inhalt-gesperrt');
    document.documentElement.classList.remove('inhalt-gesperrt');
    // Sanft zum Inhalt scrollen
    document.getElementById('inhalt').scrollIntoView({ behavior: 'smooth' });
  });

});