var name, age, gender, desc;

function exit() {
  close();
}

function init() {
  name = getQV("name");
  age = getQV("age");
  gender = getQV("gen");
  desc = getQV("desc");
  changeText();
}

function changeText() {
  let n = document.getElementById("name").getElementsByTagName("h1")[0];
  let i = document.getElementById("info").getElementsByTagName("h1")[0];
  let d = document.getElementById("desc").getElementsByTagName("h1")[0];
  if (name && name != "false") n.innerHTML = name;
  if (age && gender) i.innerHTML = age + ", " + gender;
  if (desc) d.innerHTML = desc;
}

function getQV(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1]
        .split("%20")
        .join(" ")
        .split("%27")
        .join("'");
    }
  }
  return false;
}

window.onload = init;
