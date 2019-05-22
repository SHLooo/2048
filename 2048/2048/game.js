
// Using key press to control the game
function keyPressed() {
  // give grid a duplicate, which is used to check if it changes
  let dup = duplicate(grid);

  // MOVE LEFT by pressing {LEFT_ARROW} or {a}
  // Note: just <operate()>
  if (keyCode === LEFT_ARROW || keyCode === 65) {
    for (let i = 0; i < row_num; ++i) {
      grid[i] = operate(grid[i]);
    }
  }
  // MOVE RIGHT by pressing {RIGHT_ARROW} or {d}
  // Note: <flip()> => <operate()> => <flip()>
  else if (keyCode === RIGHT_ARROW || keyCode === 68) {
    flip(grid);
    for (let i = 0; i < row_num; ++i) {
      grid[i] = operate(grid[i]);
    }
    flip(grid);
  }
  // MOVE UP by pressing {UP_ARROW} or {w}
  // Note: <rotateGrid()> => <operate()> => <rotateGrid()>
  else if (keyCode === UP_ARROW || keyCode === 87) {
    rotateGrid(grid);
    for (let i = 0; i < row_num; ++i) {
      grid[i] = operate(grid[i]);
    }
    rotateGrid(grid);
  }
  // MOVE DOWN by pressing {DOWN_ARROW} or {s}
  // Note: <rotateGrid()> => flip() => <operate()> => flip() => <rotateGrid()>
  else if (keyCode === DOWN_ARROW || keyCode === 83) {
    rotateGrid(grid);
    flip(grid);
    for (let i = 0; i < row_num; ++i) {
      grid[i] = operate(grid[i]);
    }
    flip(grid);
    rotateGrid(grid);
  }

  // if the grid changes, add a new number to the grid
  let changed = compare(dup, grid);
  if (changed) {
    addNumber();
  }
  // call update(), which update the grid diagram
  update();
}

// flip the grid usong reverse function
function flip(grid) {
  for (let i = 0; i < row_num; ++i) {
    grid[i].reverse();
  }
}

// turn the grid into its transpose
function rotateGrid(grid) {
  let newGrid = duplicate(grid);
  for (let i = 0; i < row_num; ++i) {
    for (let j = 0; j < column_num; ++j) {
      grid[j][i] = newGrid[i][j];
    }
  }
}

// greate a new grid that is exactly the same as the current grid
function duplicate(grid) {
  let dup = [0, 0, 0, 0];
  dup = dup.map(x => [0, 0, 0, 0]);
  for (let i = 0; i < row_num; ++i) {
    for (let j = 0; j < column_num; ++j) {
      dup[i][j] = grid[i][j];
    }
  }
  return dup;
}

// determine of two grids are equal
function compare(a, b) {
  for (let i = 0; i < row_num; ++i) {
    for (let j = 0; j < column_num; ++j) {
      if (a[i][j] != b[i][j]) {
        return true;
      }
    }
  }
  return false;
}

// add a new number to an empty spot(with tile 0) on the grid
function addNumber() {
  let options = [];
  for (let i = 0; i < row_num; ++i) {
    for (let j = 0; j < column_num; ++j) {
      if (grid[i][j] === 0) {
        options.push({
          x: i,
          y: j
        });
      }
    }
  }
  if (options.length > 0) {
    //  randomly chose a spot
    let spot = random(options);
    // randomly generate a number r between 0 and 1
    let r = random(0, 1);
    // if r is greater than 0,then the new tile is 2, otherwise, 4.
    // Note: the new tile are all negative, in order to seperate the newly added ones from other(incresing their strike size)
    grid[spot.x][spot.y] = (r > 0.1 ? -2 : -4);
  }
}

// slide all tiles to the left so they are all adjacent to each other
function slide_left(row) {
  let arr = row.filter(x => x);
  let missing = column_num - arr.length;
  let zeros = Array(missing).fill(0);
  arr = arr.concat(zeros);
  return arr;
}

// combine 2 same tile, and make a new tile that double the old one
// Note: take a row as input => new row as output
function combine_left(row) {
  for (let i = 0; i < column_num; ++i) {
    let a = row[i];
    let b = row[i + 1];
    if (a == b) {
      row[i] = row[i] + row[i + 1];
      row[i + 1] = 0;
      score += row[i];
    }
  }
  return row;
}

// combine a series of moves need to be done every time in this function
// Note: take a row as input => new row as output
function operate(row) {
  // first slide, so all tiles are adjacent to each other
  row = slide_left(row);
  // then combine
  row = combine_left(row);
  // at the end, slide again, to pull the tiles together
  row = slide_left(row);
  return row;
}

// Print"GAME OVER" is there is no moves left
function GameOver() {
  let gameOver = true;
  for (let i = 0; i < row_num; ++i) {
    for (let j = 0; j < column_num; ++j) {
      if (grid[i][j] == 0) {
        gameOver = false;
      }
      if (i < row_num - 1 && grid[i][j] === grid[i + 1][j]) {
        gameOver = false;
      }
      if (j < column_num - 1 && grid[i][j] === grid[i][j + 1]) {
        gameOver = false;
      }
    }
  }
  if (gameOver) {
    fill(200, 50, 0);
    noStroke();
    textSize(84);
    text('GAME OVER', column_num * column_length / 2 + sideMargins,
      row_num * row_length / 2 + topMargins);
  }
}

// Print"YOU WON", if 2048(win the game) is reached
// Print"MAC LEVEL ACHIEVED", if 1048576(2^20) is reached
function GameWon() {
  let counter = 0;
  for (let i = 0; i < row_num; ++i) {
    for (let j = 0; j < column_num; ++j) {
      if (grid[i][j] == 2048 && first2048) {
        fill(25, 150, 0);
        noStroke();
        textSize(86);
        text('YOU WON', column_length * column_num / 2 + sideMargins,
          row_length * row_num / 2 + topMargins);
        first2048 = false;
      }
      if (grid[i][j] == 1048576) {
        fill(200, 50, 0);
        noStroke();
        textSize(90);
        text('MAX LEVEL', column_length * column_num / 2 + sideMargins,
          row_length * row_num / 2 + topMargins - 70);
        text('ACHIEVED!', column_length * column_num / 2 + sideMargins,
          row_length * row_num / 2 + topMargins + 70);
        return;
      } else if (grid[i][j] > 2048) {
        counter = 10;
      }
    }
  }
}
