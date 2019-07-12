var scene, camera, renderer, loader, tree;
var drawWidth = window.innerWidth / 2;
var drawHeight = window.innerHeight;

var curMen;
var trees = [];
var curTree = {
  model: "oak",
  person: ["Name", "Age", "Gender"],
  desc: "Lorem Ipsum"
};
var model = {
  oak: "https://cdn.glitch.com/b5469c85-7f52-4fd5-a648-8d70ac85ec20%2Foak.glb?v=1562944365116",
  spruce:
    "https://cdn.glitch.com/b5469c85-7f52-4fd5-a648-8d70ac85ec20%2Fspruce.glb?v=1562943689292",
  long: "https://cdn.glitch.com/b5469c85-7f52-4fd5-a648-8d70ac85ec20%2Flong.glb?v=1562944386367",
  palm: "https://cdn.glitch.com/b5469c85-7f52-4fd5-a648-8d70ac85ec20%2Fpalm.glb?v=1562944386589",
  tall: "https://cdn.glitch.com/b5469c85-7f52-4fd5-a648-8d70ac85ec20%2Ftall.glb?v=1562944386648",
  old: "https://cdn.glitch.com/b5469c85-7f52-4fd5-a648-8d70ac85ec20%2Fold.glb?v=1562944386824",
  japanese:
    "https://cdn.glitch.com/b5469c85-7f52-4fd5-a648-8d70ac85ec20%2Fjapanese.glb?v=1562944387133",
  oval: "https://cdn.glitch.com/b5469c85-7f52-4fd5-a648-8d70ac85ec20%2Foval.glb?v=1562948388275"
};

function init() {
  // Three.JS //
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, drawWidth / drawHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(drawWidth, drawHeight);
  document.getElementById("viewer").appendChild(renderer.domElement);

  // Default model
  loader = new THREE.GLTFLoader();
  loader.load(model.oak, function(gltf) {
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
  getMenu(0);
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

function getMenu(n) {
  curMen = n;
  changeMenu();
}

function changeMenu() {
  let popup = document.getElementById("popup");
  while (popup.firstChild) {
    popup.removeChild(popup.firstChild);
  }
  switch (curMen) {
    case 0:
      title = document.createElement("h1");
      title.setAttribute("class", "pHeader");
      title.innerHTML = "Tree Type";

      let button = [];
      for (let i = 0; i < 8; i++) {
        button[i] = document.createElement("button");
        button[i].setAttribute("class", "pButton");
        button[i].addEventListener("click", () => {
          changeTree(i);
        });
      }

      button[0].innerHTML = "Style 1";
      button[1].innerHTML = "Style 2";
      button[2].innerHTML = "Style 3";
      button[3].innerHTML = "Style 4";
      button[4].innerHTML = "Style 5";
      button[5].innerHTML = "Style 6";
      button[6].innerHTML = "Style 7";
      button[7].innerHTML = "Style 8";

      let butDiv = document.createElement("div");
      butDiv.setAttribute("id", "butdiv");
      for (let i = 0; i < 8; i++) {
        butDiv.append(button[i]);
      }

      popup.append(title);
      popup.append(butDiv);
      break;
    case 1:
      title = document.createElement("h1");
      title.setAttribute("class", "pHeader");
      title.innerHTML = "Name";
      popup.append(title);

      input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("class", "pSmallInput");
      popup.append(input);

      title = document.createElement("h1");
      title.setAttribute("class", "pHeader");
      title.innerHTML = "Age";
      popup.append(title);

      input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("class", "pSmallInput");
      popup.append(input);

      title = document.createElement("h1");
      title.setAttribute("class", "pHeader");
      title.innerHTML = "Gender";
      popup.append(title);

      input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("class", "pSmallInput");
      popup.append(input);

      confirm = document.createElement("button");
      confirm.setAttribute("class", "confirmButton");
      confirm.innerHTML = "APPLY";
      popup.append(confirm);
      break;
    case 2:
      title = document.createElement("h1");
      title.setAttribute("class", "pHeader");
      title.innerHTML = "Enter Description";
      popup.append(title);

      input = document.createElement("textarea");
      input.setAttribute("class", "pLargeInput");
      popup.append(input);

      confirm = document.createElement("button");
      confirm.setAttribute("class", "confirmButton");
      confirm.innerHTML = "APPLY";
      popup.append(confirm);
      break;
    case 3:
      title = document.createElement("h1");
      title.setAttribute("class", "pHeader");
      title.innerHTML = "Other";
      popup.append(title);
      break;
  }
}

function changeTree(n) {
  scene.remove(tree);
  switch (n) {
    case 0:
      addTree(model.oak, [0.4, 0.5, 0.4], [0, -3, 0]);
      break;
    case 1:
      addTree(model.spruce, [9, 9, 9], [0, -3, 0]);
      break;
    case 2:
      addTree(model.long, [0.015, 0.015, 0.015], [0, -1, 0]);
      break;
    case 3:
      addTree(model.palm, [0.9, 0.9, 0.9], [0, -3.5, 0]);
      break;
    case 4:
      addTree(model.tall, [1.5, 1.5, 1.5], [0, -2.8, 0]);
      break;
    case 5:
      addTree(model.old, [2.6, 2.6, 2.6], [0, 4.3, 0]);
      break;
    case 6:
      addTree(model.japanese, [3.5, 5, 3.5], [0, -3, 0]);
      break;
    case 7:
      addTree(model.oval, [2.7, 2.7, 2.7], [0, 6.5, 0]);
      break;
  }
}

function addTree(src, scale, pos) {
  loader.load(src, function(gltf) {
    tree = gltf.scene;
    tree.scale.set(scale[0], scale[1], scale[2]);
    tree.position.set(pos[0], pos[1], pos[2]);
    // centers the model
    if (src == model.old) {
      tree.traverse(function(child) {
        if (child.isMesh) {
          child.geometry.center();
        }
      });
    }
    scene.add(tree);
  });
}

function toggleInfo() {
  let info = document.getElementById("info");
  info.style.visibility = info.style.visibility == "visible" ? "hidden" : "visible";
}

window.onload = init;
window.addEventListener("resize", windowResize, false);
