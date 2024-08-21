const sheetBtn = document.querySelector('.sheet-add-icon');
const sheetFolderContainer = document.querySelector('.sheet-folder-container');
let prevSheetId = '';
let prevSheet = '';

function handleDelete(itemIndex) {
  const childElement = document.getElementById(`${itemIndex}`);
  childElement.remove();
}

sheetBtn.addEventListener('click', function () {
  let sheet = document.createElement('div');
  sheet.className = 'sheet-folder';
  let allSheetFolders = document.querySelectorAll('.sheet-folder');

  sheet.id = allSheetFolders.length;
  sheet.innerHTML = `<div class="sheet-content">Sheet ${
    allSheetFolders?.length + 1
  }</div>`;
  sheetFolderContainer.appendChild(sheet);
  createSheetDB();
  createGraphComponentMatrix();
  handleActiveSheet(sheet);
  sheet.click();
});

function handleSheetProperties() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let cell123 = document.querySelector(
        `.row-column-cell[rid="${i}"][cid="${j}"]`
      );
      const cellValue = sheetDB[i][j];
      // this condition will only work for the cell which has value and on that only click event get fired and the cell that dont have value that cell will not get clicked and that the previos sheet cell value is getting show though it is not there
      // if (cellValue.value) {
      //   console.log(cellValue, ' cell123.innerText', cell123.innerText);
      // }
      cell123.click();
    }
  }
  // By default click on first cell via DOM
  let firstCell = document.querySelector('.row-column-cell');
  firstCell.click();
}

function handleSheetDB(sheetIdx) {
  sheetDB = collectionSheetDB[sheetIdx];
  graphComponentMatrix = collectionGraphComponentMatrix[sheetIdx];
}

function handleActiveSheet(sheet) {
  sheet.addEventListener('click', () => {
    const sheetIndex = Number(sheet.getAttribute('id'));
    handleSheetDB(sheetIndex);
    handleSheetProperties();
    handleHighlightSheet(sheet);
  });
}

function handleHighlightSheet(sheet) {
  const currentSheetId = sheet.getAttribute('id');
  if (prevSheetId && prevSheetId !== currentSheetId) {
    prevSheet.style.backgroundColor = 'transparent';
  }
  sheet.style.backgroundColor = '#D3E3FD';
  prevSheetId = currentSheetId;
  prevSheet = sheet;
}

function createSheetDB() {
  let sheetDB = [];
  for (let i = 0; i < rows; i++) {
    let sheetRow = [];
    for (let j = 0; j < columns; j++) {
      let cellProps = {
        bold: false,
        italic: false,
        underline: false,
        alignment: 'left',
        fontFamily: 'roboto',
        fontSize: '14',
        fontColor: '#000000',
        bgColor: '#000000',
        value: '',
        formula: '',
        children: [],
        RC: `${i}-${j}`,
      };
      sheetRow.push(cellProps);
    }
    sheetDB.push(sheetRow);
  }
  collectionSheetDB.push(sheetDB);
}

function createGraphComponentMatrix() {
  let graphComponentMatrix = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < columns; j++) {
      row.push([]);
    }
    graphComponentMatrix.push(row);
  }
  collectionGraphComponentMatrix.push(graphComponentMatrix);
}

let allSheetFolders = document.querySelector('.sheet-folder-container');

allSheetFolders.addEventListener('mousedown', function (e) {
  if(e.button !==2) return;

  let allSheetFolders = document.querySelectorAll('.sheet-folder');
  if(allSheetFolders.length <2) {
    alert('You need to have atleast one sheet!!');
    return;
  }

  let response = confirm(
    'Your sheet will be removed permanently, Are you sure?'
  );
  if (!response) return;

  const currentElement = e.target;
   const parentNode = currentElement.parentElement;
  let sheetIndex = parentNode.getAttribute('id');
    console.log({currentElement},{sheetIndex})

  //DB
  collectionSheetDB.splice(sheetIndex, 1);
  collectionGraphComponentMatrix.splice(sheetIndex, 1);
  parentNode.remove(); 
  //UI
  handleSheetUIRemoval();

  // By default DB to sheet 1 (active)
  sheetDB = collectionSheetDB[0];
  graphComponentMatrix = collectionGraphComponentMatrix[0];
  handleSheetProperties();

  //removed clicked sheet tab 
  
});

function handleSheetUIRemoval() {
  let allSheetFolders = document.querySelectorAll('.sheet-folder');
  console.log({allSheetFolders})
  for (let i = 0; i < allSheetFolders.length; i++) {
    allSheetFolders[i].setAttribute('id', i);
    let sheetContent = allSheetFolders[i].querySelector('.sheet-content');
    sheetContent.innerText = `Sheet ${i + 1}`;
    allSheetFolders[i].style.backgroundColor = 'transparent';
  }

  allSheetFolders[0].style.backgroundColor = '#D3E3FD';
}


