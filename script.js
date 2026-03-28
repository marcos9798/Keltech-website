const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");
const yearEl = document.getElementById("year");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (yearEl) yearEl.textContent = new Date().getFullYear();

if (menuBtn && mainNav) {
  menuBtn.addEventListener("click", () => {
    const opened = mainNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(opened));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", () => {
    formStatus.textContent = "Submitting your message...";
  });
}

const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);
reveals.forEach((el) => revealObserver.observe(el));

const tiltElements = document.querySelectorAll("[data-tilt]");
tiltElements.forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  });

  el.addEventListener("mouseleave", () => {
    el.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
  });
});

function initThreeBackground() {
  if (!window.THREE) return;

  const canvas = document.getElementById("three-bg");
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 9;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const light = new THREE.PointLight(0x7dd3fc, 1.8, 100);
  light.position.set(5, 3, 8);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x4979ff, 0.42));

  const meshes = [];
  const geometries = [
    new THREE.IcosahedronGeometry(0.6, 0),
    new THREE.TorusKnotGeometry(0.36, 0.12, 100, 14),
    new THREE.OctahedronGeometry(0.58, 0),
  ];

  for (let i = 0; i < 16; i++) {
    const geometry = geometries[i % geometries.length];
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(`hsl(${205 + Math.random() * 35}, 90%, ${50 + Math.random() * 15}%)`),
      metalness: 0.55,
      roughness: 0.25,
      transparent: true,
      opacity: 0.7,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12);
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    mesh.userData = {
      speed: 0.0015 + Math.random() * 0.004,
      drift: (Math.random() - 0.5) * 0.003,
    };
    scene.add(mesh);
    meshes.push(mesh);
  }

  const pointer = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  function animate() {
    requestAnimationFrame(animate);

    meshes.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.speed;
      mesh.rotation.y += mesh.userData.speed * 1.2;
      mesh.position.y += mesh.userData.drift;

      if (mesh.position.y > 7 || mesh.position.y < -7) {
        mesh.userData.drift *= -1;
      }
    });

    camera.position.x += (pointer.x * 0.9 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.55 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

initThreeBackground();
