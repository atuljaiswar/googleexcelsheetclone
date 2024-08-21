
// for (let i = 0; i < rows; i++) {
//   let row = [];
//   for (let j = 0; j < columns; j++) {
//     row.push([]);
//   }
//   graphComponentMatrix.push(row);
// }

function isGraphCyclic(graphComponentMatrix) {
  let visited = [];
  let dfsVisted = [];

  for (let i = 0; i < rows; i++) {
    let visitedRow = [];
    let dfsVistedRow = [];
    for (let j = 0; j < columns; j++) {
      visitedRow.push(false);
      dfsVistedRow.push(false);
    }
    visited.push(visitedRow);
    dfsVisted.push(dfsVistedRow);
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (!visited[i][j]) {
        let response = dfsCycleDetection(
          graphComponentMatrix,
          i,
          j,
          visited,
          dfsVisted
        );
        if (response) {
          return [i, j];
        }
      }
    }
  }
  return null;
}

function dfsCycleDetection(adj, sric, scid, visited, dfsVisted) {
  visited[sric][scid] = true;
  dfsVisted[sric][scid] = true;
  for (let x of graphComponentMatrix[sric][scid]) {
    let [crid, ccid] = x;
    if (!visited[crid][ccid]) {
      let response = dfsCycleDetection(
        graphComponentMatrix,
        crid,
        ccid,
        visited,
        dfsVisted
      );
      if (response) return true;
    } else if (visited[crid][ccid] && dfsVisted[crid][ccid]) return true;
  }

  dfsVisted[sric][scid] = false;
  return false;
}
