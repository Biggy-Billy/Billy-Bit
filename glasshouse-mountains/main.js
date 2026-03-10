import * as THREE from './js/three.module.js';
import { GLTFLoader } from './js/GLTFLoader.js';
import { OrbitControls } from './js/OrbitControls.js';

//setup 
  // create scene and set sky color
  const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfd1e5); 

  //set camera perpective and size
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(1, 600, 550); 

  //set renderer size and enable shadows
  const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      document.body.appendChild(renderer.domElement);

  //add controls (drag to rotate, scroll to zoom), makes rotating smoother, and has auto rotate on in the background
  const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.target.set(0, 5, 0);

  //add lights (v important and v ambient)
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(60, 100, 60);
    dir.castShadow = true;
    scene.add(dir);

  //create ground
  const ground = new THREE.Mesh(
      new THREE.BoxGeometry(400, 20, 400), // width, height (thickness), depth
      new THREE.MeshStandardMaterial({ color: 0xe6f3ff, roughness: 1 })
  );
  ground.position.set(0, -10, 0); // Move baseplate 200 units to the right
  ground.name = "Ground";
  ground.receiveShadow = true;
  ground.castShadow = false;
  scene.add(ground);

  //define the raycaster, mouse, and hovered
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hovered = null;

  //mouse tracking
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    mouseX = event.clientX;
    mouseY = event.clientY;
  });

//intro panel
  window.addEventListener("DOMContentLoaded", () => {
    const introPanel = document.getElementById("introPanel");
    const closeBtn = document.getElementById("closeBtn");
    const imageGrid = document.querySelector(".image-grid");

    closeBtn.onclick = () => {
      introPanel.classList.add("hidden");
      imageGrid.classList.add("hidden");
    };
  });

//home button
  const homeBtn = document.getElementById("homeBtn");
  const introPanel = document.getElementById("introPanel");
  const closeBtn = document.getElementById("closeBtn");
  const imageGrid = document.querySelector(".image-grid");

  homeBtn.addEventListener("click", () => {
    introPanel.classList.remove("hidden");
    imageGrid.classList.remove("hidden")
    homeBtn.style.display = "none"; // hide home when intro is open
  });

  closeBtn.addEventListener("click", () => {
    introPanel.classList.add("hidden");
    homeBtn.style.display = "block"; // show home when intro is closed
  });

//mountains
  const loader = new GLTFLoader();
  const mountainList = [
    { file: './glb/beerwah.glb',     name: 'Mount Beerwah',     position: [-330, 10,  -50], rotationY:  200, scale: 0.7 },
    { file: './glb/coonowrin.glb',   name: 'Mount Coonowrin',   position: [180, 15, 60], rotationY: -20, scale: 1.1 },
    { file: './glb/ngungun.glb',     name: 'Mount Ngungun',     position: [150, 20, -360], rotationY: 180, scale: 0.8 },
    { file: './glb/tibrogargan.glb', name: 'Mount Tibrogargan', position: [160, 20, 20], rotationY: 180, scale: 0.5 },
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

    <div style="width:48%; float:left; display:flex; flex-direction:column; justify-content:stretch; height:320px; margin: 16px 2% 16px 10px;  border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <img src="./Beerwah-Pics/MountBeerwah3.webp" alt="Mount Beerwah Profile" style="width:100%; height:48%; object-fit:cover; border-radius: 8px 8px 8px 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom:12px; outline : 2px solid #097238ff;">
      <img src="./Beerwah-Pics/MountBeerwah2.webp" alt="Mount Beerwah Track" style="width:100%; height:48%; object-fit:cover; border-radius: 8px 8px 8px 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline : 2px solid #097238ff;">
    </div>
    <img src="./Beerwah-Pics/MountBeerwah1.jpg" alt="Mount Beerwah Summit View" style="width:45%; float:right; height:320px; object-fit:cover; margin: 16px 0 16px 2%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline : 2px solid #097238ff;">

    <h3>Key Facts</h3>
    <ul>
      <li><strong>Highest Point:</strong> 556 meters (1,824 ft)</li><br>
      <li><strong>Geology:</strong> One of the Glass House Mountains, a series of 10 volcanic plugs, believed to be significantly eroded from its original height.</li><br>
      <li><strong>Name Origin:</strong> From the Dungidau words <em>"birra"</em> (sky) and <em>"wandum"</em> (climbing up).</li><br>
      <li><strong>First Ascent:</strong> Andrew and John Petrie were the first Europeans to climb it.</li>
    </ul>

    <h3>Cultural Significance</h3>
    <ul>
      <li><strong>Jinibara Lore:</strong> The Jinibara people consider Mount Beerwah the pregnant mother of the mountains, with Mount Tibrogargan as the father.</li><br>
      <li><strong>Sacred Site:</strong> The Jinibara view it as deeply spiritual and request it not be climbed.</li>
    </ul>

    <h3>Climbing Information</h3>
    <ul>
      <li><strong>Difficult & Dangerous:</strong> The summit climb is a very challenging rock climb requiring stamina, strength, and balance.</li><br>
      <li><strong>Terrain:</strong> Involves steep, polished rock faces and scrambling.</li><br>
      <li><strong>Conditions:</strong> Should only be attempted in dry weather by experienced climbers with proper footwear and equipment.</li><br>
      <li><strong>Views:</strong> The summit offers spectacular 360° views of the surrounding area.</li>
    </ul>

    <h3>Geological Significance</h3>
    <ul>
      <li><strong>Formation:</strong> Mount Beerwah is an intrusive plug, formed when molten rock (magma) filled small volcanic vents or intruded into the earth's crust and then solidified.</li><br>
      <li><strong>Composition:</strong> The mountain is composed of hard trachyte and rhyolite rocks.</li><br>
      <li><strong>Appearance:</strong> This mountain can be seen from a certain angle to resemble a gorilla facing the ocean. It also features a distinctive cliff face known as the "Organ Pipes", formed by vertical columns of rock created as the magma cooled and contracted.</li>
    </ul>
  `,

  "Mount Coonowrin":`
    <p><div class="paragraphs">
      Mount Coonowrin is a volcanic plug in Queensland's Glass House Mountains National Park, notable for its distinctive "crookneck" shape and restricted access for public safety. It has significant cultural importance to the Jinibara and Kabi Kabi peoples and features unique flora and fauna within the park. Climbing the mountain is dangerous, with fines for unauthorized entry, and the area is protected under the Nature Conservation Act 1992.  
    </div></p>

    <div style="width:48%; float:left; display:flex; flex-direction:column; justify-content:stretch; height:320px; margin: 16px 2% 16px 10px;  border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <img src="./Coonowrin-Pics/MountCoonowrin3.webp" alt="Mount Coonowrin Profile" style="width:100%; height:48%; object-fit:cover; border-radius: 8px 8px 8px 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom:12px; outline : 2px solid #097238ff;">
      <img src="./Coonowrin-Pics/MountCoonowrin2.jpg" alt="Mount Coonowrin Track" style="width:100%; height:48%; object-fit:cover; border-radius: 8px 8px 8px 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline : 2px solid #097238ff;">
    </div>
    <img src="./Coonowrin-Pics/MountCoonowrin1.jpg" alt="Mount Coonowrin Summit View" style="width:45%; float:right; height:320px; object-fit:cover; margin: 16px 0 16px 2%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline : 2px solid #097238ff;">

    <h3>Key Facts</h3>
    <ul>
      <li><strong>Formation:</strong> Mount Coonowrin is an extinct volcanic plug, formed from molten rock that cooled millions of years ago. </li><br>
      <li><strong>Height:</strong> It rises to 377 meters (1,237 feet) above sea level.</li><br>
      <li><strong>Appearance:</strong> It is easily recognizable by its unique, jagged, and steep profile, which gives it the unofficial name "Crookneck". </li><br>
      <li><strong>Access Restrictions:</strong> Climbing is prohibited due to safety concerns following rockfalls and erosion. Fines apply for unauthorized access.</li>
    </ul>

    <h3>Cultural Significance</h3>
    <ul>
      <li><strong>Aboriginal Heritage:</strong> Mount Coonowrin is of great cultural and spiritual importance to the local Traditional Owners, the Jinibara and Kabi Kabi First Nations. </li><br>
      <li><strong>Aboriginal Legend:</strong> An Aboriginal tale describes Coonowrin as the son of Tibrogargan (the father) and Beerwah (the mother) who failed to rescue his mother from rising waters, leading to his father striking him and "breaking his neck". </li>
    </ul>

    <h3>Access and Safety</h3>
    <ul>
      <li><strong>Restricted Area:</strong> Since March 1999, Mount Coonowrin has been a Restricted Access Area under the Nature Conservation Act 1992. </li><br>
      <li><strong>Public Safety:</strong> The restriction is in place for public safety, as climbing is considered highly dangerous and can lead to death or serious injury. </li><br>
      <li><strong>Fines:</strong> Unauthorized entry into the restricted area results in on-the-spot fines.</li><br>
      <li><strong>Views:</strong> The summit offers spectacular 360° views of the surrounding area.</li>
    </ul>

    <h3>Geological Significance</h3>
    <ul>
      <li><strong>Composition:</strong> Mount Coonowrin is an intrusive plug—remnant of volcanic activity that occurred approximately 25-27 million years ago.</li><br>
      <li><strong>Appearance:</strong> It is easily recognizable by its unique, jagged, and steep profile, which gives it the unofficial name "Crookneck". Millions of years of erosion have removed the surrounding exteriors of the volcanic cones and softer sandstone rocks, leaving the magnificent landscape features you see today. Interesting vertical columns that formed as the volcanic mountains cooled can be seen at Mount Beerwah and Mount Ngungun.</li><br>
      <li><strong>Formation:</strong> Molten rock filled small vents or intruded as bodies beneath the surface and solidified into hard rocks—trachyte and rhyolite.</li>
      `,
  "Mount Ngungun":`
    <p>  <div class="paragraphs">
      Mount Ngungun is a popular 253-meter-high peak in Queensland's Glass House Mountains National Park, offering a 2.8km return walk with spectacular panoramic views of the surrounding peaks and the coast. The climb is suitable for most fitness levels, takes about two hours, features a rock overhang or 'cave' along the way, and is managed by the Queensland Parks and Wildlife Service. Visitors should be aware there are no toilets or facilities on the mountain, and the track can be slippery in wet conditions.  
    </div> </p> 

    <div style="width:48%; float:left; display:flex; flex-direction:column; justify-content:stretch; height:320px; margin: 16px 2% 16px 10px;  border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <img src="./Ngungun-Pics/MountNgungun1.avif" alt="Mount Ngungun Summit View" style="width:100%; height:48%; object-fit:cover; border-radius: 8px 8px 8px 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom:12px; outline : 2px solid #097238ff;">
      <img src="./Ngungun-Pics/MountNgungun2.jpg" alt="Mount Ngungun Track" style="width:100%; height:48%; object-fit:cover; border-radius: 8px 8px 8px 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline : 2px solid #097238ff;">
    </div>
    <img src="./Ngungun-Pics/MountNgungun3.jpg" alt="Mount Ngungun Cave" style="width:45%; float:right; height:320px; object-fit:cover; margin: 16px 0 16px 2%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline : 2px solid #097238ff;">

    <h3>Key Facts</h3>
    <ul>
      <li><strong>Height:</strong> 253 meters above sea level.</li>
      <br>
      <li><strong>Views:</strong> Offers 360-degree panoramic views from the top, including nearby mountains like Tibrogargan, Coonowrin, and Beerwah. </li><br>
      <li><strong>Name:</strong> "Ngungun" means charcoal in the indigenous language of the area. </li>
      <br>
    </ul>

    <h3>Trail Info</h3>
    <ul>
      <li><strong>Walk:</strong> A 2.8km return summit track that takes approximately 2 hours. A Grade 4 track suitable for moderately fit people, with some steep sections and steps. </li><br>
      <li><strong>Scenic Overhang:</strong> The track passes a rock overhang about halfway up, which is a popular spot for a rest. </li>
    </ul>

    <h3>Access and Safety</h3>
    <ul>
      <li><strong>Accessibility:</strong> Considered one of the most accessible and achievable climbs in the Glass House Mountains. </li><br>
      <li><strong>Cliffs:</strong> The track passes close to cliff edges, so stay on the track and supervise children closely. The rocks can be very slippery in wet weather. </li><br>
      <li><strong>Disease:</strong> To prevent the spread of Phytophthora dieback, clean your footwear before and after your visit. </li><br>
      <li><strong>Fines:</strong> Unauthorized entry into the restricted area results in on-the-spot fines.</li>
    </ul>

    <h3>Geological Significance</h3>
    <ul>
      <li><strong>Formation</strong> Mount Ngungun is an intrusive plug, formed when molten rock (magma) filled small volcanic vents or intruded into the earth's crust and then solidified.</li><br>
      <li><strong>Composition</strong>The mountain is composed of hard trachyte and rhyolite rocks.</li>
  `,

  "Mount Tibrogargan":`
    <p>  <div class="paragraphs">
      Mount Tibrogargan is a volcanic plug in the Glass House Mountains of Queensland, Australia, formed 27 million years ago from a magma intrusion of hard alkali rhyolite, with an elevation of 364 meters. It is a significant landmark for the Jinibara people, considered the "father" of the mountains in local Dreaming stories. The mountain is popular for rock climbing and features a steep, challenging climb to its summit, offering rewarding views of the surrounding peaks.  
  </div></p>

<img src="./Tibrogargan-Pics/MountTibrogargan2.webp" alt="Mount Tibrogargan Warning Sign" style="width:45%; float:left; margin: 16px 2% 16px 15px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline : 2px solid #097238ff;">
<img src="./Tibrogargan-Pics/MountTibrogargan.webp" alt="Mount Tibrogargan View" style="width:45%; float:right; margin: 16px 0 16px 2%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline : 2px solid #097238ff;">
<img src="./Tibrogargan-Pics/MountTibrogargan6.webp" alt="Veiw of Mountain Summit" style="width:45%; float:left; margin: -5px 2% 16px 15px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); outline : 2px solid #097238ff;">
    <h3>Key Facts</h3>
    <ul>
      <li><strong>Age:</strong> Mount Tibrogargan is a volcanic plug that is roughly 27 million years old. </li><br>
      <li><strong>Composition:</strong> It is composed of hard alkali rhyolite, a type of rock that solidified into the resistant plug we see today. </li>
    </ul>

    <h3>Cultural Significance</h3>
    <ul>
      <li><strong>Aboriginal Mythology:</strong> In local Dreaming stories, Tibrogargan is regarded as the father of the Glass House Mountains, with Mount Beerwah (the mother) and Mount Coonowrin (the son) being other key figures. </li><br>
      <li><strong>Spiritual Importance: </strong> The entire Glass House Mountains area holds spiritual significance, with many traditional ceremonial sites still present. </li>
    </ul>

      <h3>Climbing and Recreation:</h3>
    <ul>
      <li><strong>Popular for Climbing:</strong> It is a very popular mountain for rock climbing, known for its challenging and steep routes. </li><br>
      <li><strong>Summit Trail:</strong> The trail to the summit involves significant rock scrambling, including a steep section over "Chicken Rock".  </li><br>
      <li><strong>Spectacular Views:</strong> The summit provides breathtaking views of the other mountains in the Glass House range. </li>
    </ul>

      <h3>Geological Significance</h3>
    <ul>
      <li><strong>Formation and Composition:</strong> Mount Tibrogargan is a magma intrusion of hard alkali rhyolite that squeezed up into the vents of an ancient volcano 27 million years ago.</li>
    </ul>


  `,
};

   //show info panel function
 function showInfoPanel(name) {
  infoTitle.textContent = name;
  infoText.innerHTML = mountainFacts[name] || "No information available.";
  infoPanel.classList.add("show");
  homeBtn.style.display = 'none';
}

  //hide info panel function
  function hideInfoPanel() {
    infoPanel.classList.remove("show");
    resetScene();
    homeBtn.style.display = 'block';
  }
  closeInfo.onclick = hideInfoPanel;

//zoom in on click and zoom out on close
    let selectedMountain = null;

  //function to zoom in
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

  //click to zoom in
  window.addEventListener("click", () => {
      if (!hovered || selectedMountain) return;

      const group = getParentGroup(hovered);
      if (!group) return;

      focusOnMountain(group);
  });

  //function to zoom back out
  function resetScene() {
    selectedMountain = null;

    mountainGroups.forEach(g => g.visible = true);

    gsap.to(camera.position, { duration: 1.5, x: 1, y: 600, z: 550, ease: "power2.inOut" });
    gsap.to(controls.target, { duration: 1.5, x: 0, y: 5, z: 0, ease: "power2.inOut" });
  }

//hover effect
function setHoverColor(obj, factor) {
  obj.traverse(child => {
    if (child.isMesh && child.material) {
      child.material.color.multiplyScalar(factor);
    }
  });
}

const tooltip = document.getElementById("tooltip");

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
          tooltip.innerHTML = getParentName(obj); // reliably gets the mountain name
          tooltip.style.left = `${mouseX + 10}px`;
          tooltip.style.top = `${mouseY + 10}px`;
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

//resize to fit screen
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log("main.js running");
