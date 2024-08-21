let copy = document.querySelector('.copy');
let cut = document.querySelector('.cut');
let paste = document.querySelector('.paste');

let ctrlKey = null;
document.addEventListener('keydown', function (e) {
  ctrlKey = e.ctrlKey;
});

document.addEventListener('keyup', function (e) {
  ctrlKey = e.ctrlKey;
});

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < columns; j++) {
    let cell = document.querySelector(
      `.row-column-cell[rid="${i}"][cid="${j}"]`
    );
    handleSelectedCell(cell);
  }
}

let rangeStorage = [];
function handleSelectedCell(cell) {
  cell.addEventListener('click', () => {
    if (!ctrlKey) return;
    if (rangeStorage.length >= 2) {
      rangeStorage = [];
    }
    cell.style.border = '3px solid #218c74';
    let rid = Number(cell.getAttribute('rid'));
    let cid = Number(cell.getAttribute('cid'));
    rangeStorage.push([rid, cid]);
  });
}
let copyData = [];
copy.addEventListener('click', () => {
  if (rangeStorage.length < 2) return;
  copyData = [];
  let startRow = rangeStorage[0][0];
  let endRow = rangeStorage[1][0];
  let startColumn = rangeStorage[0][1];
  let endColumn = rangeStorage[1][1];
  for (let i = startRow; i <= endRow; i++) {
    let copyRow = [];
    for (let j = startColumn; j <= endColumn; j++) {
      let copyProp = sheetDB[i][j];
      copyRow.push(copyProp);
    }
    copyData.push(copyRow);
  }

  console.log({ copyData });
});

let cutData = [];
cut.addEventListener('click', () => {
  if (rangeStorage.length < 2) return;
  cutData = [];
  let startRow = rangeStorage[0][0];
  let endRow = rangeStorage[1][0];
  let startColumn = rangeStorage[0][1];
  let endColumn = rangeStorage[1][1];
  for (let i = startRow; i <= endRow; i++) {
    let cutRow = [];
    for (let j = startColumn; j <= endColumn; j++) {
      let cutProp = { ...sheetDB[i][j] }
      cutRow.push(cutProp);
    }
    cutData.push(cutRow);
  }

  console.log({ cutData });
  handleCutClear()
  
});

function handleCutClear() {
  let startRow = rangeStorage[0][0];
  let endRow = rangeStorage[1][0];
  let startColumn = rangeStorage[0][1];
  let endColumn = rangeStorage[1][1];
  for (let i = startRow; i <= endRow; i++) {
    for (let j = startColumn; j <= endColumn; j++) {
      let cutProp = sheetDB[i][j];
      let cell = document.querySelector(
        `.row-column-cell[rid="${i}"][cid="${j}"]`
      );

      cutProp.value = '';
      cutProp.bold = false;
      cutProp.italic = false;
      cutProp.underline = false;
      cutProp.fontSize = '14';
      cutProp.fontFamily = 'roboto';
      cutProp.fontColor = '#000000';
      cutProp.bgColor = 'transparent';
      cutProp.alignment = 'left';
      cell.click();
    }
  }
}

paste.addEventListener('click', () => {
  if (rangeStorage.length < 2) return;
  let address = addressBar.value;
  let [stRow, stCol] = decodingAsciiValue(address);

  let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
  let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);
 
  let cell = document.querySelector(
    `.row-column-cell[rid="${stRow}"][cid="${stCol}"]`
    );
    cell.click();
  for (let i = stRow, r = 0; i <= stRow + rowDiff; i++, r++) {
    for (let j = stCol, c = 0; j <= stCol + colDiff; j++, c++) {
      let cell = document.querySelector(`.row-column-cell[rid="${i}"][cid="${j}"]`);
      if (!cell) continue;

      // DB
      let data = cutData?.length ? cutData[r][c]: copyData[r][c];
      let cellProp = sheetDB[i][j];

      cellProp.value = data.value;
      cellProp.bold = data.bold;
      cellProp.italic = data.italic;
      cellProp.underline = data.underline;
      cellProp.fontSize = data.fontSize;
      cellProp.fontFamily = data.fontFamily;
      cellProp.fontColor = data.fontColor;
      cellProp.bgColor = data.bgColor;
      cellProp.alignment = data.alignment;

      // UI
      cell.click();
    }
  }
});
