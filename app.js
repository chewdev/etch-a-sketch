const colorPickerProxyEl = document.querySelector(".colorpicker-proxy");
colorPickerProxyEl.addEventListener("click", () => {
  colorPickerEl.click();
  colorPickerEl.focus();
});

const colorMessageEl = document.querySelector(".color-message");

function colorPicker() {
  this.colorMessage = "";
  this.currentColor = "#000000";
  this.previousColors = [];
  this.useRandomColor = false;
  this.useDarkenColor = false;
  this.useLightenColor = false;
  this.toggleUseRandomColor = function () {
    this.useRandomColor = !this.useRandomColor;
    if (
      this.currentColor !==
      (this.previousColors &&
        this.previousColors[this.previousColors.length - 1])
    ) {
      this.previousColors.push(this.currentColor);
    }
    this.useDarkenColor = this.useLightenColor = false;
  };
  this.toggleUseDarkenColor = function () {
    this.useDarkenColor = !this.useDarkenColor;
    if (this.useDarkenColor) {
      this.useRandomColor = this.useLightenColor = false;
    }
  };
  this.toggleUseLightenColor = function () {
    this.useLightenColor = !this.useLightenColor;
    if (this.useLightenColor) {
      this.useRandomColor = this.useDarkenColor = false;
    }
  };
  this.getRandomColor = function () {
    let colorStr = "#";
    for (let i = 0; i < 6; i++) {
      let randomHex = Math.floor(Math.random() * 16).toString(16);
      colorStr += randomHex;
    }
    return colorStr;
  };
  this.setColor = function (newColor, isPrevious = false) {
    if (
      !isPrevious &&
      this.currentColor !== this.previousColors[this.previousColors.length - 1]
    ) {
      this.previousColors.push(this.currentColor);
    }
    this.currentColor = newColor;
    colorPickerProxyEl.style.backgroundColor = newColor;
    if (colorMessageEl.textContent !== "") {
      this.colorMessage = "";
      colorMessageEl.textContent = "";
    }
    this.useRandomColor = false;
    this.useDarkenColor = false;
    this.useLightenColor = false;
  };
  this.previous = function () {
    if (this.previousColors.length) {
      this.setColor(this.previousColors.pop(), true);
      colorPickerEl.value = this.currentColor;
    } else {
      this.colorMessage =
        "No previous colors available, please choose a new color.";
      if (colorMessageEl.textContent !== this.colorMessage) {
        colorMessageEl.textContent = this.colorMessage;
      }
    }
  };
}

const userColorPicker = new colorPicker();
userColorPicker.setColor("#000000");

const colorPickerEl = document.querySelector("#colorpicker");
colorPickerEl.addEventListener("change", (e) => {
  if (e.target.value !== userColorPicker.currentColor) {
    userColorPicker.setColor(e.target.value);
  }
});

const previousBtnEl = document.querySelector(".previous");
previousBtnEl.addEventListener("click", () => {
  userColorPicker.previous();
});

const randomBtnEl = document.querySelector(".random");
randomBtnEl.addEventListener("click", () => {
  userColorPicker.toggleUseRandomColor();
});

function setBackground(e) {
  if (userColorPicker.useRandomColor) {
    e.target.style.backgroundColor = userColorPicker.getRandomColor();
  } else if (userColorPicker.useDarkenColor) {
    e.target.style.backgroundColor = darken(
      getStyle(e.target, "backgroundColor")
    );
  } else if (userColorPicker.useLightenColor) {
    e.target.style.backgroundColor = lighten(
      getStyle(e.target, "backgroundColor")
    );
  } else {
    e.target.style.backgroundColor = userColorPicker.currentColor;
  }
}

const eraserEl = document.querySelector(".eraser");
eraserEl.addEventListener("click", () => {
  userColorPicker.setColor("#ffffff");
});

function getDarkenHex(hexColor, beginInd, endInd) {
  let currentInt = parseInt(hexColor.slice(beginInd, endInd), 16);
  let darkenInt = currentInt - 32;
  let darkenHex = darkenInt < 0 ? "00" : darkenInt.toString(16);
  return darkenHex.length < 2 ? "0".concat(darkenHex) : darkenHex;
}

function getLightenHex(hexColor, beginInd, endInd) {
  let currentInt = parseInt(hexColor.slice(beginInd, endInd), 16);
  let lightenInt = currentInt + 32;
  let lightenHex = lightenInt > 255 ? "ff" : lightenInt.toString(16);
  return lightenHex;
}

function rgbToHex(rgbColor) {
  return `#${rgbColor
    .match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    .slice(1)
    .map((n) => parseInt(n, 10).toString(16).padStart(2, "0"))
    .join("")}`;
}

function darken(rgbColor) {
  let hexColor = rgbToHex(rgbColor);
  const r = getDarkenHex(hexColor, 1, 3);
  const g = getDarkenHex(hexColor, 3, 5);
  const b = getDarkenHex(hexColor, 5, 7);
  return `#${r}${g}${b}`;
}

const darkenEl = document.querySelector(".darken");
darkenEl.addEventListener("click", () => {
  userColorPicker.toggleUseDarkenColor();
});

function lighten(rgbColor) {
  let hexColor = rgbToHex(rgbColor);
  const r = getLightenHex(hexColor, 1, 3);
  const g = getLightenHex(hexColor, 3, 5);
  const b = getLightenHex(hexColor, 5, 7);
  return `#${r}${g}${b}`;
}

const lightenEl = document.querySelector(".lighten");
lightenEl.addEventListener("click", () => {
  userColorPicker.toggleUseLightenColor();
});

function getStyle(el, styleProp) {
  if (el.currentStyle) {
    return el.currentStyle[styleProp];
  }

  return document.defaultView.getComputedStyle(el, null)[styleProp];
}

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
      //   newGridItem.addEventListener("click", (e) => {
      //     setBackground(e);
      //   });
      newGridItem.addEventListener("pointerdown", (e) => {
        // e.stopPropagation();
        newGridItem.releasePointerCapture(e.pointerId); // <- Enables touch sensing using pointerenter for all other elements after touch start
      });
      newGridItem.addEventListener("pointerenter", (e) => {
        // e.stopPropagation();
        setBackground(e);
      });

      rowDiv.appendChild(newGridItem);
    }
    container.appendChild(rowDiv);
  }
  document.body.appendChild(container);
}

function removeGrid(rows, columns) {
  const container = document.querySelector(".container");
  document.body.removeChild(container);
  createGrid(rows, columns);
}

const createGridInput = document.querySelector("#grid-input");
createGridInput.addEventListener("change", (e) => {
  let rows, columns;
  rows = columns = e.target.value;
  if (document.querySelector(".container")) {
    removeGrid(rows, columns);
  } else {
    createGrid(rows, columns);
  }
});
const createGridInputLabel = document.querySelector(".grid-input-label");
createGridInput.addEventListener("input", (e) => {
  createGridInputLabel.textContent = `Rows/Columns: ${e.target.value}`;
});

createGrid(16, 16);

const clearEl = document.querySelector(".clear");
clearEl.addEventListener("click", () => {
  removeGrid(createGridInput.value, createGridInput.value);
});
