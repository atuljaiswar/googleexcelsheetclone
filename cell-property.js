
// for (let i = 0; i < rows; i++) {
//   let sheetRow = [];
//   for (let j = 0; j < columns; j++) {
//     let cellProps = {
//       bold: false,
//       italic: false,
//       underline: false,
//       alignment: 'left',
//       fontFamily: 'roboto',
//       fontSize: '14',
//       fontColor: '#000000',
//       bgColor: '#000000',
//       value: '',
//       formula: '',
//       children: [],
//       RC: `${i}-${j}`,
//     };
//     sheetRow.push(cellProps);
//   }
//   sheetDB.push(sheetRow);
// }
{
  let sheetBtn = document.querySelector('.sheet-add-icon');
  sheetBtn.click();
  // handleSheetProperties();
}

let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

bold.addEventListener('click', () => {
  let [cell, cellProp] = activeCell(addressBar.value);
  cellProp.bold = !cellProp?.bold;
  cell.style.fontWeight = cellProp?.bold ? 'bold' : 'normal';
  bold.style.backgroundColor = cellProp?.bold
    ? activeColorProp
    : inActiveColorProp;
});

italic.addEventListener('click', () => {
  let [cell, cellProp] = activeCell(addressBar.value);
  cellProp.italic = !cellProp?.italic;
  cell.style.fontStyle = cellProp?.italic ? 'italic' : 'normal';
  italic.style.backgroundColor = cellProp?.italic
    ? activeColorProp
    : inActiveColorProp;
});

underline.addEventListener('click', () => {
  let [cell, cellProp] = activeCell(addressBar.value);
  cellProp.underline = !cellProp?.underline;
  cell.style.textDecoration = cellProp?.underline ? 'underline' : 'none';
  underline.style.backgroundColor = cellProp?.underline
    ? activeColorProp
    : inActiveColorProp;
});

fontFamily.addEventListener('change', (e) => {
  let [cell, cellProp] = activeCell(addressBar.value);
  const fontFamilyValue = e.target.value;
  cellProp.fontFamily = fontFamilyValue;
  cell.style.fontFamily = cellProp?.fontFamily;
});

fontSize.addEventListener('change', (e) => {
  let [cell, cellProp] = activeCell(addressBar.value);
  const fontSizeValue = e.target.value;

  cellProp.fontSize = fontSizeValue;
  cell.style.fontSize = `${fontSizeValue}px`;
});

textColor.addEventListener('change', (e) => {
  let [cell, cellProp] = activeCell(addressBar.value);
  const textFontColorValue = e.target.value;
  cellProp.fontColor = textFontColorValue;
  cell.style.color = `${textFontColorValue}`;
});

bgColor.addEventListener('change', (e) => {
  let [cell, cellProp] = activeCell(addressBar.value);
  const textBgFontColorValue = e.target.value;
  cellProp.bgColor = textBgFontColorValue;
  cell.style.backgroundColor = `${textBgFontColorValue}`;
});

let prevAlign = null;
alignment.forEach((item) => {
  item.addEventListener('click', function () {
    let [cell, cellProp] = activeCell(addressBar.value);
    const alignmentValue = item?.getAttribute('data-align');

    if (prevAlign) {
      prevAlign.style.backgroundColor = 'transparent';
    }

    cellProp.alignment = alignmentValue;
    cell.style.textAlign = `${alignmentValue}`;
    item.style.backgroundColor = activeColorProp;
    prevAlign = item;
  });
});

function activeCell(address) {
  let [rid, cid] = decodingAsciiValue(address);
  let cell = document.querySelector(
    `.row-column-cell[rid="${rid}"][cid="${cid}"]`
  );
  let cellProp = sheetDB[rid][cid];

  return [cell, cellProp];
}

function decodingAsciiValue(cellAddress) {
  let rid = Number(cellAddress[1]) - 1;
  let cid = Number(cellAddress[0]?.charCodeAt(0)) - 65;
  return [rid, cid];
}
