let rowCell = document.querySelector('.row-cell');
let headingCell = document.querySelector('.heading-column-cell');
let gridCells = document.querySelector('.grid-cells');
let addressBar = document.querySelector('.address-bar input');
let bold = document.querySelector('.bold');
let italic = document.querySelector('.italic');
let underline = document.querySelector('.underline');
let alignment = document.querySelectorAll('.alignment');
let fontFamily = document.querySelector('.font-family-prop');
let fontSize = document.querySelector('.font-size-prop');
let bgColor = document.querySelector('.bg-color');
let textColor = document.querySelector('.text-color');

let rows = 75;
let columns = 26;
let charCode = 64;
let prev = null;
let collectionSheetDB = [];
let sheetDB = [];

let collectionGraphComponentMatrix = [];
let graphComponentMatrix = [];

let activeColorProp = '#d1d8e0';
let inActiveColorProp = '#ecf0f1';

for (let i = 1; i <= rows; i++) {
  let rowIndividualCell = document.createElement('div');
  rowIndividualCell.className = 'row-individual-cell';
  rowIndividualCell.innerText = i;
  rowCell.appendChild(rowIndividualCell);
}

for (let i = 1; i <= columns; i++) {
  let columnsIndividualCell = document.createElement('div');
  columnsIndividualCell.className = 'column-heading-individual-cell';
  if (charCode <= 90) {
    columnsIndividualCell.innerText = String.fromCharCode(64 + i);
  }
  headingCell.appendChild(columnsIndividualCell);
}

for (let i = 0; i < rows; i++) {
  let rows = document.createElement('div');
  rows.classList = 'grid-row';
  for (let j = 0; j < columns; j++) {
    let rowColumnCell = document.createElement('div');
    rowColumnCell.classList = 'row-column-cell';
    rowColumnCell.setAttribute('contenteditable', true);
    // cell identification after clicking on cell so that we can style that cell
    rowColumnCell.setAttribute('rid', i);
    rowColumnCell.setAttribute('cid', j);
    rowColumnCell.setAttribute('spellcheck', false);

    // the reason we can not use click event is once user click on the cell all line of code will execute but once the update some value on the input we will not get update value, thats why we blur so that after clicking on cell, let user modify how many time he want in the ene we will get update value as blue will get fire once user get out of the focus of input
    rowColumnCell.addEventListener('blur', function () {
      let enteredData = rowColumnCell.innerText;
      let cellValue = enteredData;

      if (enteredData === sheetDB[i][j].value) return;

      sheetDB[i][j].value = cellValue;
      sheetDB[i][j].formula &&
        removeExistingChildForAddressBarCell(sheetDB[i][j].formula);
      sheetDB[i][j].formula = '';
      updateChildrenProps(addressBar.value);
    });

    rowColumnCell.addEventListener('click', function () {
      let cell1 = document.querySelector(
        `.row-column-cell[rid="${i}"][cid="${j}"]`
      );
      getRowColumnId(i, j);
      highLightCell(cell1, i, j);
      let formulaBar = document.querySelector('.formula-bar-container input');
      const currentCellObjNew = sheetDB[i][j];
      formulaBar.value = currentCellObjNew.formula;
      cell1.innerText = currentCellObjNew.value;
      cell1.style.fontSize = `${currentCellObjNew.fontSize}px`;
      cell1.style.fontWeight = currentCellObjNew.bold ?'bold':'normal';
      cell1.style.fontFamily = currentCellObjNew.fontFamily;
      cell1.style.textDecoration = currentCellObjNew.underline ?'underline':'';
      cell1.style.fontStyle = currentCellObjNew.italic ?'italic':'';
      cell1.style.textAlign = currentCellObjNew.alignment;
      cell1.style.color = currentCellObjNew.fontColor;
      cell1.style.backgroundColor =
        currentCellObjNew?.bgColor === '#000000'
          ? 'transparent'
          : currentCellObjNew?.bgColor;
    
    });
    rows.appendChild(rowColumnCell);
  }
  gridCells.appendChild(rows);
}

function highLightCell(cell1, i, j) {
  let currentCell = sheetDB?.[i]?.[j];
  if (prev && cell1 != prev) {
    prev.style.borderWith = '0';
    prev.style.borderColor = '#dfe4ea';
  }
  cell1.style.borderWidth = '2px';
  cell1.style.borderColor = 'blue';
  prev = cell1;
  // currentCell.value = cell1.innerText;
  handleTextFormatHighlight(cell1, currentCell);
}

function handleTextFormatHighlight(cell, currentCellObj) {



  bold.style.backgroundColor = currentCellObj?.bold
    ? activeColorProp
    : inActiveColorProp;

  italic.style.backgroundColor = currentCellObj?.italic
    ? activeColorProp
    : inActiveColorProp;

  underline.style.backgroundColor = currentCellObj?.underline
    ? activeColorProp
    : inActiveColorProp;

  fontFamily.value = currentCellObj?.fontFamily;

  fontSize.value = currentCellObj?.fontSize;
  // console.log({ currentCellObj });
  bgColor.value =
    currentCellObj?.bgColor === '#000000' ? '#dfe4ea' : currentCellObj?.bgColor;

  textColor.value = currentCellObj?.fontColor;

  alignment.forEach((item) => {
    if (
      cell.innerText &&
      item.getAttribute('data-align') === currentCellObj?.alignment
    ) {
      item.style.backgroundColor = activeColorProp;
    } else {
      item.style.backgroundColor = inActiveColorProp;
    }
  });
}

function getRowColumnId(i, j) {
  let rowId = i + 1;
  let columnId = String.fromCharCode(65 + j);
  addressBar.value = `${columnId}${rowId}`;
}

// document.addEventListener('DOMContentLoaded', () => {
//   document.querySelector('.row-column-cell').click();
// });
