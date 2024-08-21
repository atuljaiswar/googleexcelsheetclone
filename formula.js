let formulaBar = document.querySelector('.formula-bar-container input');

// function handleFormula(cell, prevCell, currentCellObj) {
//   console.log(
//     { prevCell },
//     'handleFormula',
//     cell,
//     currentCellObj,
//     prevCell.innerText
//   );
//   // if (prevCell.innerText) currentCellObj.value = prevCell.innerText;
//   console.log('currentCellObj', currentCellObj, sheetDB);
// }

formulaBar.addEventListener('keydown', async (e) => {
  let formulaValue = formulaBar.value;
  let addressBarValue = addressBar.value;
  if (e.key === 'Enter' && formulaValue) {
    const [cell, cellProps] = activeCell(addressBarValue);
    if (cellProps.formula && cellProps.formula !== formulaValue) {
      removeExistingChildForAddressBarCell(cellProps.formula);
    }
    addChidToGraphComponent(formulaValue, addressBarValue);
    const isCyclic = isGraphCyclic(graphComponentMatrix);
    if (isCyclic) {
      let response = confirm('Your formula is cylic.Do you trace a path?');
      while (response === true) {
        //keep on tracking color until user is satisfy
        await isGraphCylicTracePath(graphComponentMatrix, isCyclic);
        response = confirm('Your formula is cylic.Do you trace a path?');
      }
      removeChildFromGraphComoponent(formulaValue, addressBarValue);
      return;
      // alert('This is cyclic');
    }

    // this function use to calculate the formula added in formula bar
    let evaluatedValue = evaluatedFormula(formulaValue);

    // this function will display result of evaluated formulat to the current cell, which is our address bar value
    setCellAndCellProps(evaluatedValue, formulaValue, addressBarValue);
    addChildToParent(formulaValue);
    updateChildrenProps(addressBarValue);
    // }
  }
});

function addChidToGraphComponent(formulaValue, addressBarValue) {
  const [crid, ccid] = decodingAsciiValue(addressBarValue);

  const encodedFormula = formulaValue.split(' ');
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula?.[i]?.charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      const [prid, pcid] = decodingAsciiValue(encodedFormula[i]);
      // B1: A1 + 10;
      // prid, pcid -- A1
      // crid, ccid -- B1
      graphComponentMatrix[prid][pcid].push([crid, ccid]);
    }
  }
}

function removeChildFromGraphComoponent(formulaValue, addressBarValue) {
  const [crid, ccid] = decodingAsciiValue(addressBarValue);

  const encodedFormula = formulaValue.split(' ');
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula?.[i]?.charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      const [prid, pcid] = decodingAsciiValue(encodedFormula[i]);
      // B1: A1 + 10;
      // prid, pcid -- A1
      // crid, ccid -- B1
      graphComponentMatrix[prid][pcid].pop([crid, ccid]);
    }
  }
}

function updateChildrenProps(address) {
  let [parentCell, parentCellProps] = activeCell(address);
  let children = parentCellProps.children;

  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [childCell, childrenCellProps] = activeCell(childAddress);
    let childFormula = childrenCellProps.formula;
    let evaluatedValue = evaluatedFormula(childFormula);
    setCellAndCellProps(evaluatedValue, childFormula, childAddress);
    updateChildrenProps(childAddress);
  }
}

function addChildToParent(formula) {
  const encodedFormula = formula.split(' ');
  const childAddress = addressBar.value;
  encodedFormula.forEach((item, i) => {
    // reason to put this asciivalue logic here is we only need column title for eg. A1,B2 etc. because that where formula evaluated value will be shown
    const asciiValue = item[0].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      // this line is to get parent which is parent of current cell where where evaluated are getting display
      const [parentCell, parentCellProps] = activeCell(item);
      parentCellProps.children.push(childAddress);
    }
  });
}

function removeExistingChildForAddressBarCell(exitingFormulaInCurrentCell) {
  const encodedFormula = exitingFormulaInCurrentCell.split(' ');
  const childAddress = addressBar.value;
  encodedFormula.forEach((item, i) => {
    const asciiValue = item[0].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      const [cell, parentCellProps] = activeCell(item);
      const index = parentCellProps.children.indexOf(childAddress);
      parentCellProps.children.splice(index, 1);
    }
  });
}

function evaluatedFormula(formula) {
  let encodedFormula = formula.split(' ');
  encodedFormula.forEach((item, i) => {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [cell, cellProp] = activeCell(item);
      encodedFormula[i] = cellProp.value;
    }
  });
  formula = encodedFormula.join(' ');
  return eval(formula);
}

function setCellAndCellProps(evaluatedValue, formula, address) {
  let [cell, cellProp] = activeCell(address);
  cell.innerText = evaluatedValue;
  cellProp.value = evaluatedValue;
  cellProp.formula = formula;
}
