const colorMessageEl = document.querySelector(".color-message");
function colorPicker(color) {
  this.colorMessage = "";
  this.currentColor = color;
  this.previousColors = [];
  this.useRandomColor = false;
  this.toggleUseRandomColor = function () {
    this.useRandomColor = !this.useRandomColor;
  };
  this.getRandomColor = function () {
    let colorStr = "#";
    for (let i = 0; i < 6; i++) {
      let randomHex = Math.floor(Math.random() * 16).toString(16);
      colorStr += randomHex;
    }
    return colorStr;
  };
  this.setColor = function (newColor) {
    this.previousColors.push(this.currentColor);
    this.currentColor = newColor;
    if (colorMessageEl.textContent !== "") {
      this.colorMessage = "";
      colorMessageEl.textContent = "";
    }
  };
  this.previous = function () {
    if (this.previousColors.length) {
      this.currentColor = this.previousColors.pop();
      if (colorMessageEl.textContent !== "") {
        this.colorMessage = "";
        colorMessageEl.textContent = "";
      }
    } else {
      this.colorMessage =
        "No previous colors available, please choose a new color.";
      if (colorMessageEl.textContent !== this.colorMessage) {
        colorMessageEl.textContent = this.colorMessage;
      }
    }
  };
}

const userColorPicker = new colorPicker("#ffffff");

const colorPickerEl = document.querySelector("#colorpicker");
colorPickerEl.addEventListener("change", (e) => {
  if (e.target.value !== userColorPicker.currentColor) {
    userColorPicker.setColor(e.target.value);
    // document.body.style.backgroundColor = userColorPicker.currentColor;
    // console.log(userColorPicker.previousColors);
  }
});

const previousBtnEl = document.querySelector(".previous");
previousBtnEl.addEventListener("click", () => {
  userColorPicker.previous();
  //   document.body.style.backgroundColor = userColorPicker.currentColor;
});

// Grid related code
function createGrid(rows, columns) {
  const container = document.createElement("div");
  container.classList.add("container");
  for (let i = 0; i < rows; i++) {
    let rowDiv = document.createElement("div");
    rowDiv.classList.add("row-container");
    rowDiv.style.height = `${100 / rows}%`;
    for (let j = 0; j < columns; j++) {
      let newGridItem = document.createElement("div");
      newGridItem.classList.add(`${i}-${j}`, "grid-item");
      newGridItem.style.width = `${100 / columns}%`;
      newGridItem.addEventListener("mouseover", (e) => {
        e.target.style.backgroundColor = userColorPicker.currentColor;
      });
      newGridItem.addEventListener("click", (e) => {
        e.target.style.backgroundColor = userColorPicker.currentColor;
      });

      rowDiv.appendChild(newGridItem);
    }
    container.appendChild(rowDiv);
  }
  document.body.appendChild(container);
}

createGrid(16, 16);
