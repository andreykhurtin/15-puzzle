import '@/styles/index.css';

const container = document.querySelector('.field');
const restartBtns = document.querySelectorAll('.restart-btn');
const counterEl = document.querySelector('.counter');

const freeCell = { x: 3, y: 3 };
let tiles = [];
let clickCounter = 0;

function createField() {
  for (let y = 0; y < 4; ++y) {
    for (let x = 0; x < 4; ++x) {
      let cell = createCellNull();
      cell.y = y;
      cell.x = x;
      setCellOffset(cell);
      appendCell(cell);
    }
  }
}

function createTiles() {
  for (let y = 0; y < 4; ++y) {
    for (let x = 0; x < 4; ++x) {
      if (x === 3 && y === 3) return;
      let tile = createTile(y * 4 + x + 1);
      tile.y = y;
      tile.x = x;
      setCellOffset(tile);
      appendCell(tile);
      tiles.push(tile);
    }
  }
}

function createCellNull() {
  const cell = document.createElement('div');
  cell.classList.add('field__cell', 'field__cell--null');
  return cell;
}

function createTile(value) {
  const tile = document.createElement('div');
  tile.classList.add('field__cell', 'field__cell--tile');
  tile.innerHTML = value;
  return tile;
}

function setCellOffset(cell) {
  const offset = 18;
  const width = 50;
  const height = 50;
  const top = offset + (offset + height) * cell.y;
  const left = offset + (offset + width) * cell.x;
  cell.style.cssText = `
    top: ${top}px;
    left: ${left}px;
  `;
}

function appendCell(cell) {
  container.append(cell);
}

function between(a, t, b) {
  return (a <= t && t <= b) || (b <= t && t <= a);
}

function tileClick(evt) {
  const target = evt.target;
  const targetPos = { x: target.x, y: target.y };
  if (target.y === freeCell.y) {
    tiles.forEach((e) => {
      if (between(freeCell.x, e.x, target.x) && e.y === freeCell.y) {
        e.x = freeCell.x > target.x ? e.x + 1 : e.x - 1;
        setCellOffset(e);
      }
    });
    freeCell.x = targetPos.x;
    incCounter();
    if (checkVictory()) showWinnerPopup();
  }

  if (target.x === freeCell.x) {
    tiles.forEach((e) => {
      if (between(freeCell.y, e.y, target.y) && e.x === freeCell.x) {
        e.y = freeCell.y > target.y ? e.y + 1 : e.y - 1;
        setCellOffset(e);
      }
    });
    freeCell.y = targetPos.y;
    incCounter();
    if (checkVictory()) showWinnerPopup();
  }
}

function checkVictory() {
  return tiles.every((e, i) => i + 1 === e.y * 4 + e.x + 1);
}

function showWinnerPopup() {
  const modal = document.querySelector('.modal-winner');
  modal.classList.add('modal-winner--show');
}

function hideWinnerPopup() {
  const modal = document.querySelector('.modal-winner');
  modal.classList.remove('modal-winner--show');
}

function shuffleTiles() {
  const randomTileIndex = Math.floor(Math.random() * tiles.length);
  tiles[randomTileIndex].click();
  shuffleTiles.counter++;
  resetCounter();
  hideWinnerPopup();
  if (shuffleTiles.counter <= 400) {
    shuffleTiles();
  }
}
shuffleTiles.counter = 0;

function incCounter() {
  counterEl.innerHTML = ++clickCounter;
}

function resetCounter() {
  clickCounter = 0;
  counterEl.innerHTML = 0;
}

function restartGame() {
  tiles = [];
  freeCell.x = 3;
  freeCell.y = 3;
  container.innerHTML = '';
  hideWinnerPopup();
  resetCounter();
  createField();
  createTiles();

  shuffleTiles.counter = 0;
  setTimeout(() => {
    shuffleTiles();
  }, 200);
}

restartGame();
container.addEventListener('click', tileClick);
[].forEach.call(restartBtns, (e) => {
  e.addEventListener('click', restartGame);
});
