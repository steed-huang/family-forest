var scene, camera, renderer, mesh;
var meshFloor;

var keyboard = {};
var player = { height: 3, speed: 0.2, turnSpeed: Math.PI * 0.015 };
var USE_WIREFRAME = false;
var drawWidth = window.innerWidth * 0.99;
var drawHeight = window.innerHeight * 0.99; // It extends past end at full innerHeight?

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, drawWidth / drawHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(drawWidth, drawHeight);
  document.body.appendChild(renderer.domElement);

  // Box
  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshNormalMaterial({ color: 0xff4444, wireframe: USE_WIREFRAME })
  );
  mesh.position.y += 2; // Move the mesh up 1 meter
  scene.add(mesh);

  // Room
  meshRoom = new THREE.Mesh(
    new THREE.BoxGeometry(30, 10, 30, 30, 10, 30),
    new THREE.MeshPhongMaterial({ color: 0x636363, wireframe: USE_WIREFRAME })
  );
  meshRoom.position.y += 5 - player.height;
  meshRoom.material.side = THREE.DoubleSide;
  scene.add(meshRoom);

  // Picture
  var pl = new THREE.TextureLoader();
  var mat = new THREE.MeshLambertMaterial({
    map: pl.load(
      "https://cdn.shopify.com/s/files/1/0889/4322/products/starry-night_2048x.jpg?v=1540488662"
    )
  });
  var geo = new THREE.PlaneGeometry(10, 10);
  var pic = new THREE.Mesh(geo, mat);
  pic.position.set(0, 2, -14.9);
  pic.rotation.z -= Math.PI;
  scene.add(pic);

  // Floor
  meshFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30, 30, 30),
    new THREE.MeshPhongMaterial({ color: 0x575757, wireframe: USE_WIREFRAME })
  );
  meshFloor.position.y -= 1.99;
  meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
  scene.add(meshFloor);

  // Light
  var light = new THREE.PointLight(0xffffff, 1, 30, 1);
  light.position.set(0, 2, 0);
  scene.add(light);
  var light = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(light);

  // Camera
  camera.position.set(0, player.height, -5);
  camera.lookAt(new THREE.Vector3(0, player.height, 0));

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  mesh.rotation.x += 0.02;
  mesh.rotation.y += 0.01;
  mesh.rotation.z += 0.01;

  // Keyboard movement inputs
  if (keyboard[87]) {
    // W key
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
  }
  if (keyboard[83]) {
    // S key
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
  }
  if (keyboard[65]) {
    // A key
    // Redirect motion by 90 degrees
    camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
  }
  if (keyboard[68]) {
    // D key
    camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
  }

  // Keyboard turn inputs
  if (keyboard[81]) {
    // "q" key
    camera.rotation.y -= player.turnSpeed;
  }
  if (keyboard[69]) {
    // "e" key
    camera.rotation.y += player.turnSpeed;
  }

  renderer.render(scene, camera);
}

function keyDown(event) {
  keyboard[event.keyCode] = true;
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

window.onload = init;
