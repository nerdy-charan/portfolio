// Vanta Background
let vantaEffect = VANTA.WAVES({
  el: "#vanta-background",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00,
  color: 0x000000,
  shininess: 25,
  waveHeight: 30,
  waveSpeed: 0.5,
  zoom: 1.6
});

// Toggle Customizer
/*
const customizerBtn = document.getElementById('customizer-btn');
const customizer = document.getElementById('customizer');
customizerBtn.addEventListener('click', () => {
  customizer.classList.toggle('active');
}); */

// Customizer Controls
/*
document.getElementById('color').addEventListener('input', (e) => {
  const colorHex = e.target.value.replace('#', '0x');
  vantaEffect.setOptions({ color: parseInt(colorHex) });
});

document.getElementById('shininess').addEventListener('input', (e) => {
  vantaEffect.setOptions({ shininess: parseInt(e.target.value) });
});

document.getElementById('waveHeight').addEventListener('input', (e) => {
  vantaEffect.setOptions({ waveHeight: parseInt(e.target.value) });
});

document.getElementById('waveSpeed').addEventListener('input', (e) => {
  vantaEffect.setOptions({ waveSpeed: parseFloat(e.target.value) });
});

document.getElementById('zoom').addEventListener('input', (e) => {
  vantaEffect.setOptions({ zoom: parseFloat(e.target.value) });
}); */

// Spotlight Functionality
document.querySelectorAll('.card-spotlight').forEach(card => {
  const spotlight = card.querySelector('.spotlight');

  card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      spotlight.style.left = `${x}px`;
      spotlight.style.top = `${y}px`;
  });

  card.addEventListener('mouseleave', () => {
      spotlight.style.opacity = 0;
  });

  card.addEventListener('mouseenter', () => {
      spotlight.style.opacity = 1;
  });

   
});
