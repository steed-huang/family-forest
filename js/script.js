var scene, camera, renderer, tree;
var drawWidth = window.innerWidth / 2;
var drawHeight = window.innerHeight;

var trees = []; // [model, person info, desc info, pos#]
var model = {
  pagetree:
    "https://cdn.glitch.com/b5469c85-7f52-4fd5-a648-8d70ac85ec20%2Ftest.glb?v=1559756997603",
  tree: "https://cdn.glitch.com/b5469c85-7f52-4fd5-a648-8d70ac85ec20%2Flowpolytree.glb",
  lptree: "https://cdn.glitch.com/b5469c85-7f52-4fd5-a648-8d70ac85ec20%2Ftest2.glb",
  balloon: "https://cdn.glitch.com/2671171a-572f-412a-8934-c57ee91f37bb%2Fballoon.fbx?1557858831042"
};

function init() {
  // Three.JS //
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, drawWidth / drawHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(drawWidth, drawHeight);
  document.getElementById("viewer").appendChild(renderer.domElement);

  // Model loading
  var loader = new THREE.GLTFLoader();
  loader.load(model.pagetree, function(gltf) {
    tree = gltf.scene;
    tree.scale.set(0.4, 0.5, 0.4);
    tree.position.set(0, -3, 0);
    scene.add(tree);
  });

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
  camera.position.set(0, 2, -20);
  camera.lookAt(new THREE.Vector3(0, 3, 0));

  animate();

  // Prismatic //
  /*
  let theta = 0;
  let delta_t = 0;
  let x = 0 + 5 * Math.cos(theta);
  let z = 3 + 5 * Math.sin(theta);
  console.log(delta_t);
  for (let i = 0; i < 8; i++) {
    theta += i * (Math.PI / 4);
    x = Math.round(0 + 5 * Math.cos(theta));
    z = Math.round(3 + 5 * Math.sin(theta));
    loadModel(model.lptree, i.toString(), 4000, 2000, x, -2, z);
  }
  */
  changeMenu("style");
}

function animate() {
  requestAnimationFrame(animate);
  if (tree) {
    tree.rotation.y += 0.005;
  }
  renderer.render(scene, camera);
}

function windowResize() {
  drawWidth = window.innerWidth / 2;
  drawHeight = window.innerHeight;
  camera.aspect = drawWidth / drawHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(drawWidth, drawHeight);
}

function loadModel(src, id, height, width, x, y, z) {
  let model = document.createElement("ml-model");
  model.setAttribute("src", src);
  model.setAttribute("id", id);

  let xpos = (50 * x + 50).toString();
  let ypos = (50 * y + 50).toString();
  let zpos = (500 * z).toString();

  let style =
    "width: " +
    width +
    "px; " +
    "height: " +
    height +
    "px; " +
    "position: absolute; " +
    "left: " +
    xpos +
    "%; " +
    "top: " +
    ypos +
    "%; " +
    "transform: translate(-50%, -50%);";

  model.setAttribute("style", style);
  model.setAttribute("z-offset", zpos);
  model.setAttribute("unbounded", "true");
  model.setAttribute("raycast", true);

  /*
  model.addEventListener("node-raycast", function(e) {
    if (e.detail.inputType === "control") {
      if (e.detail.type === "nodeOnControlExit") {
        model.visibility = "visible";
      } else {
        model.visibility = "hidden";
      }
    }
  });
  */

  document.body.appendChild(model);
}

function changeMenu(button) {
  let popup = document.getElementById("popup");
  while (popup.firstChild) {
    popup.removeChild(popup.firstChild);
  }
  switch (button) {
    case "style":
      title = document.createElement("h1");
      title.setAttribute("id", "pHeader");
      title.innerHTML = "Tree Type";

      let button = [];
      for (let i = 0; i < 4; i++) {
        button[i] = document.createElement("button");
        button[i].setAttribute("id", "pButton");
      }

      button[0].innerHTML = "Style 1";
      button[1].innerHTML = "Style 2";
      button[2].innerHTML = "Style 3";
      button[3].innerHTML = "Style 4";

      let butDiv = document.createElement("div");
      butDiv.setAttribute("id", "butdiv");
      for (let i = 0; i < 4; i++) {
        butDiv.append(button[i]);
      }

      popup.append(title);
      popup.append(butDiv);
      break;
    case "person":
      title = document.createElement("h1");
      title.setAttribute("id", "pHeader");
      title.innerHTML = "Name";
      popup.append(title);

      input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("id", "pSmallInput");
      popup.append(input);

      title = document.createElement("h1");
      title.setAttribute("id", "pHeader");
      title.innerHTML = "Age";
      popup.append(title);

      input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("id", "pSmallInput");
      popup.append(input);

      title = document.createElement("h1");
      title.setAttribute("id", "pHeader");
      title.innerHTML = "Gender";
      popup.append(title);

      input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("id", "pSmallInput");
      popup.append(input);

      confirm = document.createElement("button");
      confirm.setAttribute("id", "confirmButton");
      confirm.innerHTML = "APPLY";
      popup.append(confirm);
      break;
    case "info":
      title = document.createElement("h1");
      title.setAttribute("id", "pHeader");
      title.innerHTML = "Enter Description";
      popup.append(title);

      input = document.createElement("textarea");
      input.setAttribute("id", "pLargeInput");
      popup.append(input);

      confirm = document.createElement("button");
      confirm.setAttribute("id", "confirmButton");
      confirm.innerHTML = "APPLY";
      popup.append(confirm);
      break;
    case "other":
      title = document.createElement("h1");
      title.setAttribute("id", "pHeader");
      title.innerHTML = "Other";
      popup.append(title);
      break;
  }
}

window.onload = init;
window.addEventListener("resize", windowResize, false);
