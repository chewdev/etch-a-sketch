const colorPickerProxyEl = document.querySelector(".colorpicker-proxy");
colorPickerProxyEl.addEventListener("click", () => {
  colorPickerEl.click();
  colorPickerEl.focus();
});

// const colorMessageEl = document.querySelector(".color-message");
const recentColorsEl = document.querySelector(".recent-colors");

const fillBtnEl = document.querySelector(".fill");
fillBtnEl.addEventListener("click", () => {
  userColorPicker.toggleUseFill();
});

const drawBtnEl = document.querySelector(".draw");
drawBtnEl.addEventListener("click", () => {
  userColorPicker.setUseDraw();
});

function colorPicker() {
  //   this.colorMessage = "";
  this.currentColor = "#000000";
  this.previousColors = [];
  this.fillColor = "#777777";
  this.columns = 16;
  this.rows = 16;
  this.useDraw = true;
  this.useFill = false;
  this.useEraser = false;
  this.useRandomColor = false;
  this.useDarkenColor = false;
  this.useLightenColor = false;
  this.setUseDraw = function (shouldUpdate = true) {
    this.useDraw = true;
    drawBtnEl.classList.add("selected");
    if (shouldUpdate) {
      this.updateOtherControls("draw");
    }
  };
  this.unsetUseDraw = function () {
    this.useDraw = false;
    drawBtnEl.classList.remove("selected");
  };
  this.toggleUseFill = function (shouldUpdate = true) {
    this.useFill = !this.useFill;
    if (this.useFill) {
      fillBtnEl.classList.add("selected");
      this.updateOtherControls("fill");
    } else {
      fillBtnEl.classList.remove("selected");
      this.setUseDraw(false);
    }
  };
  this.toggleUseEraser = function (shouldUpdate = true) {
    this.useEraser = !this.useEraser;
    if (this.useEraser) {
      this.setColor("#ffffff");
      eraserEl.classList.add("selected");
      if (shouldUpdate) {
        this.updateOtherControls("eraser");
      }
    } else {
      eraserEl.classList.remove("selected");
      if (this.previousColors.length) {
        this.previous();
      }
      this.setUseDraw(false);
    }
  };
  this.toggleUseRandomColor = function (shouldUpdate = true) {
    this.useRandomColor = !this.useRandomColor;
    if (this.useRandomColor) {
      randomBtnEl.classList.add("selected");
      if (
        this.currentColor !==
        (this.previousColors &&
          this.previousColors[this.previousColors.length - 1])
      ) {
        this.previousColors.push(this.currentColor);
        this.showRecentColors();
      }
      if (shouldUpdate) {
        this.updateOtherControls("random");
      }
    } else {
      randomBtnEl.classList.remove("selected");
      this.setUseDraw(false);
    }
  };
  this.toggleUseDarkenColor = function (shouldUpdate = true) {
    this.useDarkenColor = !this.useDarkenColor;
    if (this.useDarkenColor) {
      darkenEl.classList.add("selected");
      if (shouldUpdate) {
        this.updateOtherControls("darken");
      }
    } else {
      darkenEl.classList.remove("selected");
      this.setUseDraw(false);
    }
  };
  this.toggleUseLightenColor = function (shouldUpdate = true) {
    this.useLightenColor = !this.useLightenColor;
    if (this.useLightenColor) {
      lightenEl.classList.add("selected");
      if (shouldUpdate) {
        this.updateOtherControls("lighten");
      }
    } else {
      lightenEl.classList.remove("selected");
      this.setUseDraw(false);
    }
  };
  this.updateOtherControls = function (selectedBtn) {
    if (this.useFill && selectedBtn !== "fill") {
      this.toggleUseFill(false);
    } else if (this.useEraser && selectedBtn !== "eraser") {
      this.toggleUseEraser(false);
    } else if (this.useRandomColor && selectedBtn !== "random") {
      this.toggleUseRandomColor(false);
    } else if (this.useDarkenColor && selectedBtn !== "darken") {
      this.toggleUseDarkenColor(false);
    } else if (this.useLightenColor && selectedBtn !== "lighten") {
      this.toggleUseLightenColor(false);
    }

    if (this.useDraw && selectedBtn !== "draw") {
      this.unsetUseDraw();
    }
  };
  this.setUseDraw();
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
    this.showRecentColors();
    this.currentColor = newColor;
    colorPickerProxyEl.style.backgroundColor = newColor;
    // if (colorMessageEl.textContent !== "") {
    //   this.colorMessage = "";
    //   colorMessageEl.textContent = "";
    // }
  };
  this.previous = function () {
    if (this.previousColors.length) {
      this.setColor(this.previousColors.pop(), true);
      colorPickerEl.value = this.currentColor;
    }
    // else {
    //   this.colorMessage =
    //     "No previous colors available, please choose a new color.";
    //   if (colorMessageEl.textContent !== this.colorMessage) {
    //     colorMessageEl.textContent = this.colorMessage;
    //   }
    // }
  };
  this.showRecentColors = function () {
    if (this.previousColors.length) {
      let recentColors =
        this.previousColors.length > 5
          ? this.previousColors.slice(-5)
          : this.previousColors;
      document.querySelectorAll(".recent-colors *").forEach((el) => {
        recentColorsEl.removeChild(el);
      });

      recentColors.forEach((color, i) => {
        let recentColorSpan = document.createElement("span");
        recentColorSpan.classList.add("recent-color");
        recentColorSpan.style.backgroundColor = color;
        recentColorSpan.addEventListener("click", () => {
          this.previousColors =
            this.previousColors.length > 5
              ? this.previousColors.splice(
                  this.previousColors.length - 5 + i,
                  1
                ) && this.previousColors
              : this.previousColors.splice(i, 1) && this.previousColors;
          this.showRecentColors();
          this.setColor(color);
        });
        recentColorsEl.appendChild(recentColorSpan);
      });
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
  userColorPicker.toggleUseEraser();
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

function isSameBackgroundColor(el1, el2) {
  return getStyle(el1, "backgroundColor") === getStyle(el2, "backgroundColor");
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
      newGridItem.addEventListener("click", (e) => {
        if (userColorPicker.useFill) {
          fill(e.target);
        } else {
          setBackground(e);
        }
      });
      newGridItem.addEventListener("pointerdown", (e) => {
        newGridItem.releasePointerCapture(e.pointerId); // <- Enables touch sensing using pointerenter for all other elements after touch start
      });
      newGridItem.addEventListener("pointerenter", (e) => {
        if (userColorPicker.useFill) {
          return;
        }
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
  userColorPicker.rows = userColorPicker.columns = rows;
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

function checkConnectedSameColor(
  currBackgroundColor,
  checkedEls,
  row,
  column,
  rowDiff,
  columnDiff
) {
  const checkRow = Number(row) + rowDiff;
  const checkColumn = Number(column) + columnDiff;
  const checkInd = `${checkRow}-${checkColumn}`;
  if (checkedEls[checkInd]) {
    return [];
  }
  const checkEl = document.getElementsByClassName(checkInd)[0];
  checkedEls[checkInd] = true;
  if (currBackgroundColor === getStyle(checkEl, "backgroundColor")) {
    return findConnectedSameColor(checkEl, checkedEls);
  } else {
    return [];
  }
}

function findConnectedSameColor(el, checkedEls = {}) {
  let connectedEls = [el];
  let currentElInd;
  const currBackgroundColor = getStyle(el, "backgroundColor");
  el.classList.forEach((className) => {
    if (className.match(/\d+-\d+/)) {
      currentElInd = className;
    }
  });
  let [row, column] = currentElInd.split("-");
  checkedEls[`${row}-${column}`] = true;
  // check left
  if (column >= 1) {
    connectedEls = connectedEls.concat(
      checkConnectedSameColor(
        currBackgroundColor,
        checkedEls,
        row,
        column,
        0,
        -1
      )
    );
  }
  // check right
  if (column <= userColorPicker.columns - 2) {
    connectedEls = connectedEls.concat(
      checkConnectedSameColor(
        currBackgroundColor,
        checkedEls,
        row,
        column,
        0,
        1
      )
    );
  }
  //check up
  if (row >= 1) {
    connectedEls = connectedEls.concat(
      checkConnectedSameColor(
        currBackgroundColor,
        checkedEls,
        row,
        column,
        -1,
        0
      )
    );
  }
  //check down
  if (row <= userColorPicker.rows - 2) {
    connectedEls = connectedEls.concat(
      checkConnectedSameColor(
        currBackgroundColor,
        checkedEls,
        row,
        column,
        1,
        0
      )
    );
  }
  return connectedEls;
}

function fill(el) {
  let fillEls = findConnectedSameColor(el);
  fillEls.forEach((el) => {
    el.style.backgroundColor = userColorPicker.currentColor;
  });
}

function setSameHeight() {
  const left = document.querySelector(".colors-container");
  const topRight = document.querySelector(".grid-input-label");
  const bottomRight = document.querySelector(".range-container");
  const leftHeightPx = getStyle(left, "height");
  const topRightHeightPx = getStyle(topRight, "height");
  const leftHeight = leftHeightPx.match(/\d+/)[0];
  const topRightHeight = topRightHeightPx.match(/\d+/)[0];
  const bottomRightHeight = Number(leftHeight) - Number(topRightHeight);
  bottomRight.style.height = `${bottomRightHeight - 2}px`;
}

setSameHeight();

/*
TODO:
Make controls into a select so that only one option is selected at a time
Add Draw option for the default draw
Add .selected class to whichever option is currently selected

*/
