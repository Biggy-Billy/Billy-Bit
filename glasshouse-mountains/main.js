import * as THREE from 'three.module.js';
import { GLTFLoader } from 'GLTFLoader.js';
import { OrbitControls } from 'OrbitControls.js';

//setup 
  const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfd1e5); 

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(1, 600, 550); 

  const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.target.set(0, 5, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(60, 100, 60);
    dir.castShadow = true;
    scene.add(dir);

  const ground = new THREE.Mesh(
      new THREE.BoxGeometry(400, 20, 400),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 })
  );
  ground.position.set(0, -10, 0);
  ground.name = "Ground";
  ground.receiveShadow = true;
  ground.castShadow = false;
  scene.add(ground);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hovered = null;

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

// get UI elements
const infoPanel  = document.getElementById("infoPanel");
const infoTitle  = document.getElementById("infoTitle");
const infoText   = document.getElementById("infoText");
const closeInfo  = document.getElementById("closeInfo");
const homeBtn    = document.getElementById("homeBtn");
const introPanel = document.getElementById("introPanel");
const closeBtn   = document.getElementById("closeBtn");
const imageGrid  = document.querySelector(".image-grid");
const tooltip    = document.getElementById("tooltip");

// intro close button
closeBtn.addEventListener("click", () => {
  introPanel.classList.add("hidden");
  imageGrid.classList.add("hidden");
  homeBtn.style.display = "block";
});

// home button
homeBtn.addEventListener("click", () => {
  introPanel.classList.remove("hidden");
  imageGrid.classList.remove("hidden");
  homeBtn.style.display = "none";
});

//mountains
  const loader = new GLTFLoader();
  const mountainList = [
    { file: 'beerwah.glb',     name: 'Mount Beerwah',     position: [-330, 10,  -50], rotationY:  200, scale: 0.7 },
    { file: 'coonowrin.glb',   name: 'Mount Coonowrin',   position: [180, 15, 60],    rotationY: -20,  scale: 1.1 },
    { file: 'ngungun.glb',     name: 'Mount Ngungun',     position: [150, 20, -360],  rotationY: 180,  scale: 0.8 },
    { file: 'tibrogargan.glb', name: 'Mount Tibrogargan', position: [160, 20, 20],    rotationY: 180,  scale: 0.5 },
  ];

  let mountainGroups = []; 

  async function loadMountain({ file, name, position, rotationY, scale }) {
    return new Promise((resolve, reject) => {
      loader.load(file, (gltf) => {
        const group = new THREE.Group();
        group.name = name;
        group.position.set(...position);

        const model = gltf.scene;
        model.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });

        model.rotation.y = THREE.MathUtils.degToRad(rotationY);
        model.scale.set(scale, scale, scale);

        group.add(model);
        scene.add(group);
        mountainGroups.push(group);

        resolve(group);
      }, undefined, reject);
    });
  }

  async function initMountains() {
    for (const m of mountainList) {
      try {
        await loadMountain(m);
      } catch (e) {
        console.error('Failed to load', m.file, e);
      }
    }
  }
  initMountains();

// mountain facts
  const mountainFacts = {
  "Mount Beerwah": `
    <p>
      <div class="paragraphs">
      Mount Beerwah, the highest of Queensland's Glass House Mountains, is a 556-meter-high volcanic plug, 
      one of ten in the range, formed about 26 million years ago. It's known for its two peaks, dramatic 
      <em>"Organ Pipes"</em> cliff face, and small caves at its base. The mountain is considered sacred by the Jinibara people, 
      who have traditional stories and customs asking people not to climb it out of respect for its spiritual significance.
      </div>
    </p>

    <div style="width:48%; float:left; display:flex; flex-direction:column; justify-content:stretch; height:320px; margin: 16px 2% 16px 10px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <img src="MountBeerwah3.webp" alt="Mount Beerwah Profile" style="width:100%; height:48%; object-fit:cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom:12px; outline: 2px solid #097238ff;">
      <img src="MountBeerwah2.webp" alt="Mount Beerwah Track" style="width:100%; height:48%; object-fit:cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline: 2px solid #097238ff;">
    </div>
    <img src="MountBeerwah1.jpg" alt="Mount Beerwah Summit View" style="width:45%; float:right; height:320px; object-fit:cover; margin: 16px 0 16px 2%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline: 2px solid #097238ff;">

    <h3>Key Facts</h3>
    <ul>
      <li><strong>Highest Point:</strong> 556 meters (1,824 ft)</li><br>
      <li><strong>Geology:</strong> One of the Glass House Mountains, a series of 10 volcanic plugs.</li><br>
      <li><strong>Name Origin:</strong> From the Dungidau words <em>"birra"</em> (sky) and <em>"wandum"</em> (climbing up).</li><br>
      <li><strong>First Ascent:</strong> Andrew and John Petrie were the first Europeans to climb it.</li>
    </ul>

    <h3>Cultural Significance</h3>
    <ul>
      <li><strong>Jinibara Lore:</strong> The Jinibara people consider Mount Beerwah the pregnant mother of the mountains.</li><br>
      <li><strong>Sacred Site:</strong> The Jinibara view it as deeply spiritual and request it not be climbed.</li>
    </ul>

    <h3>Climbing Information</h3>
    <ul>
      <li><strong>Difficult & Dangerous:</strong> Very challenging — requires stamina, strength, and balance.</li><br>
      <li><strong>Terrain:</strong> Steep, polished rock faces and scrambling.</li><br>
      <li><strong>Conditions:</strong> Dry weather only, experienced climbers with proper equipment.</li><br>
      <li><strong>Views:</strong> Spectacular 360° views from the summit.</li>
    </ul>

    <h3>Geological Significance</h3>
    <ul>
      <li><strong>Formation:</strong> An intrusive plug formed when magma filled small volcanic vents and solidified.</li><br>
      <li><strong>Composition:</strong> Hard trachyte and rhyolite rocks.</li><br>
      <li><strong>Appearance:</strong> Features a distinctive cliff face known as the "Organ Pipes".</li>
    </ul>
  `,

  "Mount Coonowrin": `
    <p><div class="paragraphs">
      Mount Coonowrin is a volcanic plug in Queensland's Glass House Mountains National Park, notable for its distinctive "crookneck" shape and restricted access for public safety. It has significant cultural importance to the Jinibara and Kabi Kabi peoples.
    </div></p>

    <div style="width:48%; float:left; display:flex; flex-direction:column; justify-content:stretch; height:320px; margin: 16px 2% 16px 10px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <img src="MountCoonowrin3.webp" alt="Mount Coonowrin Profile" style="width:100%; height:48%; object-fit:cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom:12px; outline: 2px solid #097238ff;">
      <img src="MountCoonowrin2.jpg" alt="Mount Coonowrin Track" style="width:100%; height:48%; object-fit:cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline: 2px solid #097238ff;">
    </div>
    <img src="MountCoonowrin1.jpg" alt="Mount Coonowrin Summit View" style="width:45%; float:right; height:320px; object-fit:cover; margin: 16px 0 16px 2%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline: 2px solid #097238ff;">

    <h3>Key Facts</h3>
    <ul>
      <li><strong>Formation:</strong> Extinct volcanic plug formed from molten rock millions of years ago.</li><br>
      <li><strong>Height:</strong> 377 meters (1,237 feet) above sea level.</li><br>
      <li><strong>Appearance:</strong> Unique jagged profile — unofficially called "Crookneck".</li><br>
      <li><strong>Access:</strong> Climbing prohibited due to safety concerns. Fines apply.</li>
    </ul>

    <h3>Cultural Significance</h3>
    <ul>
      <li><strong>Aboriginal Heritage:</strong> Sacred to the Jinibara and Kabi Kabi First Nations.</li><br>
      <li><strong>Aboriginal Legend:</strong> Coonowrin is the son who failed to rescue his mother from rising waters — his father struck him, "breaking his neck".</li>
    </ul>

    <h3>Access and Safety</h3>
    <ul>
      <li><strong>Restricted Area:</strong> Restricted since March 1999 under the Nature Conservation Act 1992.</li><br>
      <li><strong>Public Safety:</strong> Highly dangerous — can lead to death or serious injury.</li><br>
      <li><strong>Fines:</strong> On-the-spot fines for unauthorized entry.</li>
    </ul>

    <h3>Geological Significance</h3>
    <ul>
      <li><strong>Composition:</strong> Intrusive plug from volcanic activity approximately 25–27 million years ago.</li><br>
      <li><strong>Formation:</strong> Molten rock solidified into hard trachyte and rhyolite.</li>
    </ul>
  `,

  "Mount Ngungun": `
    <p><div class="paragraphs">
      Mount Ngungun is a popular 253-meter-high peak in Queensland's Glass House Mountains National Park, offering a 2.8km return walk with spectacular panoramic views of the surrounding peaks and the coast.
    </div></p>

    <div style="width:48%; float:left; display:flex; flex-direction:column; justify-content:stretch; height:320px; margin: 16px 2% 16px 10px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <img src="MountNgungun1.avif" alt="Mount Ngungun Summit View" style="width:100%; height:48%; object-fit:cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom:12px; outline: 2px solid #097238ff;">
      <img src="MountNgungun2.jpg" alt="Mount Ngungun Track" style="width:100%; height:48%; object-fit:cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline: 2px solid #097238ff;">
    </div>
    <img src="MountNgungun3.jpg" alt="Mount Ngungun Cave" style="width:45%; float:right; height:320px; object-fit:cover; margin: 16px 0 16px 2%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline: 2px solid #097238ff;">

    <h3>Key Facts</h3>
    <ul>
      <li><strong>Height:</strong> 253 meters above sea level.</li><br>
      <li><strong>Views:</strong> 360° panoramic views including Tibrogargan, Coonowrin, and Beerwah.</li><br>
      <li><strong>Name:</strong> "Ngungun" means charcoal in the local indigenous language.</li>
    </ul>

    <h3>Trail Info</h3>
    <ul>
      <li><strong>Walk:</strong> 2.8km return, approximately 2 hours. Grade 4 — moderately fit people.</li><br>
      <li><strong>Scenic Overhang:</strong> Rock overhang about halfway up — popular rest spot.</li>
    </ul>

    <h3>Access and Safety</h3>
    <ul>
      <li><strong>Accessibility:</strong> One of the most accessible climbs in the Glass House Mountains.</li><br>
      <li><strong>Cliffs:</strong> Stay on track — rocks are very slippery in wet weather.</li><br>
      <li><strong>Disease:</strong> Clean footwear before and after to prevent Phytophthora dieback.</li>
    </ul>

    <h3>Geological Significance</h3>
    <ul>
      <li><strong>Formation:</strong> Intrusive plug formed when magma filled volcanic vents and solidified.</li><br>
      <li><strong>Composition:</strong> Hard trachyte and rhyolite rocks.</li>
    </ul>
  `,

  "Mount Tibrogargan": `
    <p><div class="paragraphs">
      Mount Tibrogargan is a volcanic plug in the Glass House Mountains of Queensland, formed 27 million years ago. It is a significant landmark for the Jinibara people and popular for rock climbing.
    </div></p>

    <img src="MountTibrogargan2.webp" alt="Mount Tibrogargan Warning Sign" style="width:45%; float:left; margin: 16px 2% 16px 15px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline: 2px solid #097238ff;">
    <img src="MountTibrogargan.webp" alt="Mount Tibrogargan View" style="width:45%; float:right; margin: 16px 0 16px 2%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline: 2px solid #097238ff;">
    <img src="MountTibrogargan6.webp" alt="View of Mountain Summit" style="width:45%; float:left; margin: -5px 2% 16px 15px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline: 2px solid #097238ff;">

    <h3>Key Facts</h3>
    <ul>
      <li><strong>Age:</strong> Roughly 27 million years old.</li><br>
      <li><strong>Composition:</strong> Hard alkali rhyolite.</li>
    </ul>

    <h3>Cultural Significance</h3>
    <ul>
      <li><strong>Aboriginal Mythology:</strong> Tibrogargan is the father of the Glass House Mountains in local Dreaming stories.</li><br>
      <li><strong>Spiritual Importance:</strong> Many traditional ceremonial sites still present in the area.</li>
    </ul>

    <h3>Climbing and Recreation</h3>
    <ul>
      <li><strong>Popular for Climbing:</strong> Challenging and steep routes.</li><br>
      <li><strong>Summit Trail:</strong> Significant rock scrambling including a steep section over "Chicken Rock".</li><br>
      <li><strong>Views:</strong> Breathtaking views of the other Glass House Mountains.</li>
    </ul>

    <h3>Geological Significance</h3>
    <ul>
      <li><strong>Formation:</strong> Magma intrusion of hard alkali rhyolite squeezed into ancient volcanic vents 27 million years ago.</li>
    </ul>
  `,
};

// show info panel
function showInfoPanel(name) {
  infoTitle.textContent = name;
  infoText.innerHTML = mountainFacts[name] || "No information available.";
  infoPanel.classList.add("show");
  homeBtn.style.display = "none";
}

// hide info panel
function hideInfoPanel() {
  infoPanel.classList.remove("show");
  resetScene();
  homeBtn.style.display = "block";
}

closeInfo.addEventListener("click", hideInfoPanel);

// zoom in on click
let selectedMountain = null;

function focusOnMountain(group) {
  selectedMountain = group;
  mountainGroups.forEach(g => g.visible = g === group);

  const box = new THREE.Box3().setFromObject(group);
  const center = new THREE.Vector3();
  box.getCenter(center);

  const newCamPos = new THREE.Vector3(center.x - 200, center.y + 100, center.z + 100);

  gsap.to(camera.position, { duration: 1.5, x: newCamPos.x, y: newCamPos.y, z: newCamPos.z, ease: "power2.inOut" });
  gsap.to(controls.target, { duration: 1.5, x: center.x, y: center.y, z: center.z, ease: "power2.inOut" });

  showInfoPanel(group.name);
}

window.addEventListener("click", () => {
  if (!hovered || selectedMountain) return;
  const group = getParentGroup(hovered);
  if (!group) return;
  focusOnMountain(group);
});

// zoom back out
function resetScene() {
  selectedMountain = null;
  mountainGroups.forEach(g => g.visible = true);
  gsap.to(camera.position, { duration: 1.5, x: 1, y: 600, z: 550, ease: "power2.inOut" });
  gsap.to(controls.target, { duration: 1.5, x: 0, y: 5, z: 0, ease: "power2.inOut" });
}

// hover effect
function setHoverColor(obj, factor) {
  obj.traverse(child => {
    if (child.isMesh && child.material) {
      child.material.color.multiplyScalar(factor);
    }
  });
}

// animation loop
function getParentGroup(obj) {
  let parent = obj;
  while (parent) {
    if (mountainGroups.includes(parent)) return parent;
    parent = parent.parent;
  }
  return null;
}

function getParentName(obj) {
  const group = getParentGroup(obj);
  return group ? group.name : null;
}

function animate() {
  requestAnimationFrame(animate);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    const group = getParentName(obj);

    if (!group || obj.name === "Ground") {
      if (hovered) setHoverColor(hovered, 1 / 0.7);
      hovered = null;
      tooltip.style.opacity = 0;
      controls.autoRotate = true;
    } else {
      if (hovered !== obj) {
        if (hovered) setHoverColor(hovered, 1 / 0.7);
        hovered = obj;
        setHoverColor(hovered, 0.7);
        controls.autoRotate = false;
      }
      tooltip.style.opacity = 1;
      tooltip.innerHTML = getParentName(obj);
      tooltip.style.left = `${mouseX + 10}px`;
      tooltip.style.top  = `${mouseY + 10}px`;
    }
  } else {
    if (hovered) setHoverColor(hovered, 1 / 0.7);
    hovered = null;
    tooltip.style.opacity = 0;
    controls.autoRotate = true;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

// resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log("main.js running");
