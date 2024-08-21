let download = document.querySelector('.download');
let upload = document.querySelector('.upload');

download.addEventListener('click', (e) => {
  let jsonData = JSON.stringify([sheetDB, graphComponentMatrix]);
  let file = new Blob([jsonData], { type: 'application/json' });

  let a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = 'SheetData.json';
  a.click();
});

upload.addEventListener('click', () => {
  let input = document.createElement('input');
  input.type = 'file';
  input.click();

  input.addEventListener('change', (e) => {
    let fr = new FileReader();
    let file = input.files;
    let fileObj = file[0];

    fr.readAsText(fileObj);
    fr.addEventListener('load', (e) => {
      let readSheetData = JSON.parse(fr.result);

      sheetBtn.click();

      sheetDB = readSheetData[0];
      graphComponentMatrix = readSheetData[1];

      collectionSheetDB[collectionSheetDB.length - 1] = sheetDB;
      collectionGraphComponentMatrix[
        collectionGraphComponentMatrix.length - 1
      ] = graphComponentMatrix;

      handleSheetProperties();
    });
  });
});
