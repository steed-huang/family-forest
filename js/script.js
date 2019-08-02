var scene, camera, renderer, loader, tree;
var ambLight, hemiLight, dirLight, light;
var drawWidth = window.innerWidth / 2;
var drawHeight = window.innerHeight;

var curMen, active;
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

var audio = {
  plant: new Audio("assets/plant.mp3"),
  switch: new Audio("assets/switch.mp3"),
  click: new Audio("assets/click.mp3"),
  activate: new Audio("assets/activate.mp3"),
  detect: new Audio("assets/detect.mp3"),
  info: new Audio("assets/info.mp3"),
  beep: new Audio("assets/beep.mp3")
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

function loadModel(src, id, tree, height, width, x, y, z) {
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

  model.addEventListener("node-raycast", function(e) {
    if (e.detail.inputType === "headpos") {
      if (e.detail.type === "nodeOnHeadEnter") {
        model.wiggle();
      }
    }
    if (e.detail.inputType === "control") {
      if (e.detail.type === "nodeOnControlEnter") {
        updateTreeInfo(tree);
      }
    }
  });

  document.body.appendChild(model);
}

function updateTreeInfo(t) {
  if (curMen == 3 && active == true) {
    audio.detect.play();
    let n = document
      .getElementById("popup")
      .getElementsByTagName("div")[0]
      .getElementsByTagName("h1")[1];
    let i = document
      .getElementById("popup")
      .getElementsByTagName("div")[0]
      .getElementsByTagName("h1")[2];
    let d = document
      .getElementById("popup")
      .getElementsByTagName("div")[0]
      .getElementsByTagName("h1")[3];
    n.innerHTML = t.person[0];
    i.innerHTML = t.person[1] + ", " + t.person[2];
    d.innerHTML = t.desc;
  }
}

function createTree(t) {
  loadModel(model[t.model], "filler", t, 2000, 1000, 0, 0, 1);
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
  audio.click.play();
  let popup = document.getElementById("popup");
  while (popup.firstChild) {
    popup.removeChild(popup.firstChild);
  }
  switch (curMen) {
    case 0:
      title = document.createElement("h1");
      title.setAttribute("class", "pHeader");
      title.innerHTML = "Tree Style";

      let button = [];
      for (let i = 0; i < 8; i++) {
        button[i] = document.createElement("button");
        button[i].setAttribute("class", "pButton");
        button[i].addEventListener("click", () => {
          audio.switch.play();
          changeTree(i);
        });
      }

      button[0].innerHTML = "Oak";
      button[1].innerHTML = "Spruce";
      button[2].innerHTML = "Baby";
      button[3].innerHTML = "Palm";
      button[4].innerHTML = "Sequoia";
      button[5].innerHTML = "Acacia";
      button[6].innerHTML = "Sakura";
      button[7].innerHTML = "Bonsai";

      let butDiv = document.createElement("div");
      butDiv.setAttribute("id", "butdiv");
      for (let i = 0; i < 8; i++) {
        butDiv.append(button[i]);
      }

      tInfo = document.createElement("div");
      tInfo.setAttribute(
        "style",
        "text-align: center; font-family: 'Rubik', sans-serif; font-style: bold; font-size: 120%; margin-top: 8%; margin-left: 50%; transform: translate(-50%, 0%); width: 85%;"
      );
      tInfo.innerHTML =
        "Lorem ipsum, the quick brown fox jumped over the lazy dog. My uncle is a cool guy.";

      popup.append(title);
      popup.append(butDiv);
      popup.append(tInfo);

      changeTreeText();
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
        audio.beep.play();
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
        audio.beep.play();
        getInfo();
      });
      popup.append(confirm);
      break;
    case 3:
      title = document.createElement("h1");
      title.setAttribute("class", "pHeader");
      title.innerHTML = "Tree Inspector";
      tutorial = document.createElement("div");
      tutorial.setAttribute(
        "style",
        "text-align: center; font-family: 'Rubik', sans-serif; font-style: bold; font-size: 180%; margin-top: 0; margin-left: 50%; transform: translate(-50%, 0%); width: 80%;"
      );
      tutorial.innerHTML = "Point controller beam to trees to view their information";
      inspBut = document.createElement("button");
      inspBut.setAttribute(
        "style",
        "font-family: 'Rubik', sans-serif; font-style: bold; font-size: 300%; margin-top: 20%;"
      );
      inspBut.addEventListener("click", () => {
        audio.activate.play();
        active = true;
        updateInsp();
      });
      inspBut.innerHTML = "ACTIVATE";

      popup.append(title);
      popup.append(tutorial);
      popup.append(inspBut);
      updateInsp();
      break;
  }
}

function updateInsp() {
  if (active) {
    let popup = document.getElementById("popup");
    while (popup.firstChild) {
      popup.removeChild(popup.firstChild);
    }
    let wrapper = document.createElement("div");
    wrapper.setAttribute(
      "style",
      "text-align: center; position: absolute; width: 80%; left: 50%; transform: translate(-50%, 0%); height: 100%;"
    );

    title = document.createElement("h1");
    title.setAttribute("class", "pHeader");
    title.innerHTML = "Tree Inspector";
    let subTitle = document.createElement("h1");
    subTitle.setAttribute(
      "style",
      "font-family: 'Rubik', sans-serif; color: #003300; font-style: bold; top: 5%; bottom: 0; font-size: 2.5vh;"
    );
    subTitle.innerHTML = "This tree is dedicated to:";
    let pname = document.createElement("h1");
    pname.setAttribute(
      "style",
      "font-family: 'Rubik', sans-serif; top: 0; color: #003300; font-style: bold; font-size: 7vh; position: absolute; top: 0; left: 50%; transform: translate(-50%, 0%); width: 100%;"
    );
    pname.innerHTML = "Person Name";
    let pinfo = document.createElement("h1");
    pinfo.setAttribute(
      "style",
      "font-family: 'Rubik', sans-serif; color: #003300; font-style: bold; font-size: 4vh; position: absolute; top: 12%; width: 100%;"
    );
    pinfo.innerHTML = "Age, Gender";
    let pdesc = document.createElement("h1");
    pdesc.setAttribute(
      "style",
      "font-family: 'Rubik', sans-serif; color: #26160d; font-style: bold; font-size: 3.5vh; position: absolute; top: 25%; width: 100%;"
    );
    pdesc.innerHTML =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam iaculis tellus sed ullamcorpe pellentesque. Vivamus at convallis eros.";
    let pimg = document.createElement("img");
    pimg.setAttribute(
      "style",
      "position: absolute; opacity: 0.15; height: 70%; width: 100%; transform: rotate(90deg); left: -10%; top: 31%;z-index: 9999;"
    );
    pimg.setAttribute("src", "assets/branch.png");

    popup.append(title);
    popup.append(pimg);
    wrapper.append(subTitle);
    wrapper.append(pname);
    wrapper.append(pinfo);
    wrapper.append(pdesc);
    popup.append(wrapper);
  }
}

function changeTreeText() {
  let treeDesc = document.getElementById("popup").getElementsByTagName("div")[1];
  if (curTree.model == "oak") {
    treeDesc.innerHTML =
      "Found all over the world, from the Americas to Asia, with over 600 known varieties. It is known as a cornerstone species, as its acorns and trunk provide food and shelter to thousands of species, many of which depend on the oak to survive. The oak represents a person who is caring but steadfast, willing and able to extend a helping hand to people in need no matter the situation.";
  } else if (curTree.model == "spruce") {
    treeDesc.innerHTML =
      "Found in northern temperate regions of earth, spruce trees, like other evergreens, are covered in pointy spines. Within the needle covered branches lie seed filled pinecones, and even further inside the branches sweet sap can be found. The spruce represents a person who at first seems thorny and unapproachable, but turn out to be nice to be around once you get to know them.";
  } else if (curTree.model == "long") {
    treeDesc.innerHTML =
      "Although small, the baby has boundless potential. The baby represents a person whos journey has only just begun, who knows what the future has in store?";
  } else if (curTree.model == "palm") {
    treeDesc.innerHTML =
      "Found in tropical and subtropical regions like the carribeans, the palm trees branches were a symbol of peace in ancient civilisations. The palm represents a person who doesnt worry, but rather appreciates the good things in life, always looking on the bright side of things.";
  } else if (curTree.model == "tall") {
    treeDesc.innerHTML =
      "The Sequoia, also known as the giant redwood, only grows in the Sierra Nevada Mountains of California. They are the largest individual trees on earth, with the largest growing to almost 100 meters tall. The Sequoia represents a person who is willing to see things from the bigger picture, and able to push themselves past their own boundaries.";
  } else if (curTree.model == "old") {
    treeDesc.innerHTML =
      "Found in Africa and Australia, the Acacia possess a fire resistance that allows it to endure the common shrub fires that consume other less fortunate plants. The acacia represents a person who is stubborn and perseverant, who wont budge or falter no matter what the world throws at them.";
  } else if (curTree.model == "japanese") {
    treeDesc.innerHTML =
      "The cherry blossom tree, the most famous of which is the Japanese cherry. It is famous for its blooming season when the branches of the trees are briefly filled with bright pink petals. The sakura represents a person who enjoys the now, making the most of today without worrying about tomorrow.";
  } else if (curTree.model == "oval") {
    treeDesc.innerHTML =
      "A japanese art form of cultivating miniature trees. Bonsais are cultivated over multiple generations, with plans coming to fruition decades into the future. The bonsai represents a person who is organised and meticulous, willing to sacrifice luxuries in the present to see the payoff weeks, months, or even years into the future.";
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
  changeTreeText();
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
  audio.info.play();
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
  audio.plant.play();
  let treeCopy = Object.assign({}, curTree);
  trees.push(treeCopy);
  createTree(treeCopy);
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
