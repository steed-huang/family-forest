var scene, camera, renderer, tree;
var drawWidth = window.innerWidth;
var drawHeight = window.innerHeight;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, drawWidth / drawHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(drawWidth, drawHeight);
  document.body.appendChild(renderer.domElement);

  // Models
  var loader = new THREE.GLTFLoader();
  loader.load(
    "https://cdn.glitch.com/b5469c85-7f52-4fd5-a648-8d70ac85ec20%2Ftest.glb?v=1559756997603",
    function(gltf) {
      tree = gltf.scene;
      tree.scale.set(0.5, 0.5, 0.5);
      tree.position.set(-10, -5, 12);
      scene.add(tree);
    }
  );

  // Lighting
  var ambLight = new THREE.AmbientLight(0x404040, 1); // soft white light
  scene.add(ambLight);

  var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 300, 0);
  scene.add(hemiLight);

  var dirLight = new THREE.DirectionalLight(0xffffff, 10);
  dirLight.position.set(75, 300, -75);
  scene.add(dirLight);

  var light = new THREE.PointLight(0x444444, 15, 30);
  light.position.set(-2, 0, -10);
  scene.add(light);

  // Camera
  camera.position.set(0, 2, -10);
  camera.lookAt(new THREE.Vector3(0, 3, 0));

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (tree) {
    tree.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}

window.onload = init;
