var scene, camera, renderer, loader, tree;
var ambLight, hemiLight, dirLight, light;
var drawWidth = window.innerWidth / 2;
var drawHeight = window.innerHeight;

var curMen;
var trees = [];
var curTree = {
  model: "oak",
  person: ["Name", "", ""],
  desc: ""
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
  ambLight = new THREE.AmbientLight(0x404040, 1); // soft white light
  scene.add(ambLight);

  hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  hemiLight.position.set(0, 300, 0);
  scene.add(hemiLight);

  dirLight = new THREE.DirectionalLight(0xffffff, 10);
  dirLight.position.set(75, 300, -75);
  scene.add(dirLight);

  light = new THREE.PointLight(0x444444, 15, 30);
  light.position.set(-2, 0, -10);
  scene.add(light);

  // Camera
  camera.position.set(0, 2, -20);
  camera.lookAt(new THREE.Vector3(0, 3, 0));

  animate();
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

function createTree(n, t) {
  // not working, should test on webpage and get working before ML
  let theta = 0;
  let x = 0 + 5 * Math.cos(theta);
  let z = 3 + 5 * Math.sin(theta);
  for (let i = 0; i < 8; i++) {
    theta += i * (Math.PI / 4);
    x = Math.round(0 + 5 * Math.cos(theta));
    z = Math.round(3 + 5 * Math.sin(theta));
    if (i == n) {
      loadModel(model[t.model], i.toString(), 2000, 1000, x, -2, z);
      break;
    }
  }
  // window.open(getLink(curTree));
}

function getLink(t) {
  return (
    "info.html?name=" +
    t.person[0] +
    "&age=" +
    t.person[1] +
    "&gen=" +
    t.person[2] +
    "&desc=" +
    t.desc
  );
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
      confirm.addEventListener("click", () => {
        getInfo();
      });
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
      confirm.addEventListener("click", () => {
        getInfo();
      });
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
      curTree.model = "oak";
      break;
    case 1:
      addTree(model.spruce, [9, 9, 9], [0, -3, 0]);
      curTree.model = "spruce";
      break;
    case 2:
      addTree(model.long, [0.015, 0.015, 0.015], [0, -1, 0]);
      curTree.model = "long";
      break;
    case 3:
      addTree(model.palm, [0.9, 0.9, 0.9], [0, -3.5, 0]);
      curTree.model = "palm";
      break;
    case 4:
      addTree(model.tall, [1.5, 1.5, 1.5], [0, -2.8, 0]);
      curTree.model = "tall";
      break;
    case 5:
      addTree(model.old, [2.6, 2.6, 2.6], [0, 4.3, 0]);
      curTree.model = "old";
      break;
    case 6:
      addTree(model.japanese, [3.5, 5, 3.5], [0, -3, 0]);
      curTree.model = "japanese";
      break;
    case 7:
      addTree(model.oval, [2.7, 2.7, 2.7], [0, 6.5, 0]);
      curTree.model = "oval";
      break;
  }
  updateInfo();
}

// oak spruce long palm tall old japanese oval
function addTree(src, scale, pos) {
  loader.load(src, function(gltf) {
    tree = gltf.scene;
    tree.scale.set(scale[0], scale[1], scale[2]);
    tree.position.set(pos[0], pos[1], pos[2]);
    if (src == model.oak) {
      ambLight.intensity = 1;
      hemiLight.intensity = 1;
      dirLight.intensity = 10;
      light.intensity = 15;
    } else if (src == model.spruce) {
      ambLight.intensity = 1;
      hemiLight.intensity = 2.3;
      dirLight.intensity = 0.1;
      light.intensity = 1;
    } else if (src == model.long) {
      ambLight.intensity = 1.2;
      hemiLight.intensity = 0.6;
      dirLight.intensity = 0.7;
      light.intensity = 1;
    } else if (src == model.palm) {
      ambLight.intensity = 0.3;
      hemiLight.intensity = 0.8;
      dirLight.intensity = 0.3;
      light.intensity = 1.2;
    } else if (src == model.tall) {
      ambLight.intensity = 1.5;
      hemiLight.intensity = 0.8;
      dirLight.intensity = 2.7;
      light.intensity = 5.3;
    } else if (src == model.old) {
      // centers the model
      tree.traverse(function(child) {
        if (child.isMesh) {
          child.geometry.center();
        }
      });
      ambLight.intensity = 1.5;
      hemiLight.intensity = 0.8;
      dirLight.intensity = 2.7;
      light.intensity = 5.3;
    } else if (src == model.japanese) {
      ambLight.intensity = 1.5;
      hemiLight.intensity = 0.8;
      dirLight.intensity = 2.7;
      light.intensity = 5.3;
    } else if (src == model.oval) {
      ambLight.intensity = 1.5;
      hemiLight.intensity = 2;
      dirLight.intensity = 2.7;
      light.intensity = 5.3;
    }
    scene.add(tree);
  });
}

function toggleInfo() {
  updateInfo();
  let info = document.getElementById("infoPopup");
  info.style.visibility = info.style.visibility == "visible" ? "hidden" : "visible";
}

function getInfo() {
  if (curMen == 1) {
    let inputs = document.getElementsByClassName("pSmallInput");
    curTree.person = [inputs[0].value, inputs[1].value, inputs[2].value];
  } else {
    let inputs = document.getElementsByClassName("pLargeInput");
    curTree.desc = inputs[0].value;
  }
  updateInfo();
}

function updateInfo() {
  let popup = document.getElementById("infoPopup");
  let name = popup.getElementsByClassName("infoTitle")[0];
  name.innerHTML = curTree.person[0];
  let text = popup.getElementsByClassName("info");
  text[0].innerHTML = "Age: " + curTree.person[1];
  text[1].innerHTML = "Gender: " + curTree.person[2];
  text[2].innerHTML = "Tree Style: " + curTree.model;
  text[3].innerHTML = "Description: " + curTree.desc;
}

function plantTree() {
  let treeCopy = Object.assign({}, curTree);
  trees.push(treeCopy);
  createTree(trees.indexOf(treeCopy), treeCopy);
  curTree = {
    model: "oak",
    person: ["Name", "", ""],
    desc: ""
  };
  updateInfo();
  changeTree(0);
}

window.onload = init;
window.addEventListener("resize", windowResize, false);
