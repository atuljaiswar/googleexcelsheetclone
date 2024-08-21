// For delay and wait
function colorPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

async function isGraphCylicTracePath(graphComponentMatrix, cyclicCell) {
  console.log('cyclicCell', cyclicCell);
  let [srcr, srcc] = cyclicCell;
  let visited = [];
  let dfsVisited = [];

  for (let i = 0; i < rows; i++) {
    let visitedRow = [];
    let dfsVisitedRow = [];
    for (let j = 0; j < columns; j++) {
      visitedRow.push(false);
      dfsVisitedRow.push(false);
    }
    visited.push(visitedRow);
    dfsVisited.push(dfsVisitedRow);
  }

  let response = await dfsCycleDetectionTracePath(
    graphComponentMatrix,
    srcr,
    srcc,
    visited,
    dfsVisited
  );
  console.log('RESPONSE-TREU', response);
  if (response === true) {
    return Promise.resolve(true);
  }

  return Promise.resolve(false);
}

async function dfsCycleDetectionTracePath(
  graphComponentMatrix,
  srcr,
  srcc,
  visited,
  dfsVisited
) {
  console.log({ srcr }, { srcc });
  visited[srcr][srcc] = true;
  dfsVisited[srcr][srcc] = true;

  let cell = document.querySelector(
    `.row-column-cell[rid="${srcr}"][cid="${srcc}"]`
  );
  cell.style.backgroundColor = 'lightblue';
  await colorPromise(); // 1sec finished

  for (let x of graphComponentMatrix[srcr][srcc]) {
    console.log({ x });
    let [crid, ccid] = x;
    if (!visited[crid][ccid]) {
      console.log('FALSE VISIT', crid, ccid);
      let response = await dfsCycleDetectionTracePath(
        graphComponentMatrix,
        crid,
        ccid,
        visited,
        dfsVisited
      );
      if (response) {
        cell.style.backgroundColor = 'transparent';
        await colorPromise();
        return Promise.resolve(true);
      }
    } else if (visited[crid][ccid] && dfsVisited[crid][ccid]) {
      console.log('ELSEEEE', crid, ccid);
      let cyclicCell1 = document.querySelector(
        `.row-column-cell[rid="${crid}"][cid="${ccid}"]`
      );
      console.log({ cyclicCell1 });

      cyclicCell1.style.backgroundColor = 'lightsalmon';
      await colorPromise();
      cyclicCell1.style.backgroundColor = 'transparent';

      cell.style.backgroundColor = 'transparent';
      await colorPromise();

      return Promise.resolve(true);
    }
  }

  dfsVisited[srcr][srcc] = false;
  return Promise.resolve(false);
}
