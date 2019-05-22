
let grid = [0, 0, 0, 0]; // create the rows of the grid. Note:length depends on row_num
let row_num = 4; // determine how many row the grid have
let column_num = 4; // determine how many column the grid have
let row_length = 150; // determine the scale of the rows of the grid
let column_length = 150; // determine the scale of the columns of the grid
let topMargins = 20; // determine the top margins of the grid
let sideMargins = 20; // determine the side margins of the grid
let score = 0; // keep tracking the score when 2 tiles combine
let initial = true; // determine if this is the first time the grid is initilized, used in [grawGrid]
let first2048 = true; // determine if this is the first time tile 2048 appeared, used in [GameWon]

function setup() {
  // creste the Cancas
  createCanvas(column_num * column_length + 2 * sideMargins, row_num * row_length + 2 * topMargins);
  // create the columns of the grid. Note:length depends on column_num
  grid = grid.map(x => [0, 0, 0, 0]);
  // add two numbers to the grid, when initializing.
  addNumber();
  addNumber();
  // set the background to white
  background(255);
  // call drawGrid() to draw the grid and display the tiles
  drawGrid();
  // set 'initial' to false after initialization(setup)
  initial = false;
  // display the scoe on screen
  select('#score').html(score);
}

function drawGrid() {
  let w = column_length;
  let h = row_length;
  // double nested loop to go through every element in the grid
  for (let i = 0; i < row_num; ++i) {
    for (let j = 0; j < column_num; ++j) {
      // give the newly_added number a larger strokeweight, except the first time we initialize it
      if (initial) {
        grid[i][j] = Math.abs(grid[i][j]);
      }
      // determine if a tile is newly_added by checking their signs.(the new ones are negative)
      if (grid[i][j] < 0) {
        strokeWeight(12);
        stroke(0, 150);
      // convert the negative tiles to positive
        grid[i][j] *= -1;
      } else {
        strokeWeight(5);
        stroke(80);
      }
      // convert intigers to string, so we can find their length easil
      let val = grid[i][j];
      let s = val.toString();
      let len = s.length - 1;
      // fill the rectangle with the color that correspond to the tile it contains
      fill(SizesAndColors[s].b_color);
      // draw the individual round rectangles to form the grid
      rect(j * w + sideMargins, i * h + topMargins, w, h, 30);
      // display the tiles if they are not zero(0)
      if (grid[i][j] !== 0) {
        textAlign(CENTER, CENTER);
        // determine the font size and color from [SizesAndColors]
        textSize(SizesAndColors[s].size);
        fill(SizesAndColors[s].t_color);
        noStroke();
        text(val, j * h + h / 2 + sideMargins, i * w + w / 2 + topMargins)
      }
    }
  }
}

function update() {
  // draw a white background
  background(255);
  // call drawGrid() function to draw the grid and display the tiles
  drawGrid();
  // If the game is over, print 'GAME OVER' on the screen
  GameOver();
  // run GameWon() function which print stuff if the player achieve certain score
  GameWon();
  // update the score on screen
  select('#score').html(score);
}
