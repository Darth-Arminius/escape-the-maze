function escape(maze) {
  console.log(maze); // Logging the maze to know which maze is being solved. Feel free to remove for increased speed.

  const height = maze.length;
  const width = maze[0].length;
  const directions = ["^", ">", "<", "v"];

  let playerPosition;

  // Getting the player position.
  // Loop through each row of the maze.
  for (let row = 0; row < height; ++row) {
    // Loop through each possible direction the player could be facing.
    for (
      let directionIndex = 0;
      directionIndex < directions.length;
      ++directionIndex
    ) {
      // If that particular row contains one of these direction characters then that is the playerPosition.
      if (maze[row].includes(directions[directionIndex])) {
        playerPosition = {
          x: maze[row].indexOf(directions[directionIndex]),
          y: row,
          direction: directions[directionIndex]
        };
        break; // Once playerPosition is found no longer need to continue loop.
      }
    }

    // Same as above break.
    if (playerPosition !== undefined) {
      break;
    }
  }

  const exits = [];

  // Getting all the exits in the maze.
  // Loop through each row and then each column (character in string).
  for (let row = 0; row < height; ++row) {
    for (let col = 0; col < width; ++col) {
      // This if statement ensures that only the very edges/border of the maze is checked as that is the only possible location for an exit.
      if (!(row > 0 && row < height - 1 && col > 0 && col < width - 1)) {
        if (maze[row][col] !== "#") {
          exits.push({ x: col, y: row });
        }
      }
    }
  }

  let finalMoves = [];

  // Loop through each exit and find the required moves to get to it.
  exits.map(exit => {
    let moves = headDownRoute(maze, playerPosition, {}, exit, false, []);

    // This ensures that the shortest move list is taken each time a new move list is found.
    if (!finalMoves.length) {
      finalMoves = moves;
    } else if (moves.length < finalMoves.length) {
      finalMoves = moves;
    } else {
      return;
    }
  });

  console.log(`THE FINAL MOVE LIST IS ${finalMoves}`);
  return finalMoves;
}

/**
 * This function checks to see if a specific tile is passible (non-bush) based on playerPosition.
 *
 * @param {*} maze
 * @param {*} playerPosition
 * @param {*} xDiff The amount moving on the x-axis.
 * @param {*} yDiff The amount moving on the y-axis.
 * @param {*} passibleTiles
 */
const tileCheck = (maze, playerPosition, xDiff, yDiff, passibleTiles) => {
  if (maze[playerPosition.y + yDiff][playerPosition.x + xDiff] !== "#") {
    passibleTiles.push({
      x: playerPosition.x + xDiff,
      y: playerPosition.y + yDiff
    });
  }
};

/**
 * The main recursive function that navigates the maze and returns a char array of moves.
 *
 * @param {*} maze
 * @param {*} playerPosition
 * @param {*} previousPlayerPosition
 * @param {*} exit
 * @param {*} hasPlayerMoved
 * @param {*} moves
 */
const headDownRoute = (
  maze,
  playerPosition,
  previousPlayerPosition,
  exit,
  hasPlayerMoved,
  moves
) => {
  const height = maze.length;
  const width = maze[0].length;
  const passibleTiles = [];

  // The start (when the player hasn't move yet) requires a 4 tile check around the playerPosition.
  if (!hasPlayerMoved) {
    tileCheck(maze, playerPosition, 0, -1, passibleTiles);
    tileCheck(maze, playerPosition, 0, 1, passibleTiles);
    tileCheck(maze, playerPosition, -1, 0, passibleTiles);
    tileCheck(maze, playerPosition, 1, 0, passibleTiles);
  }
  // After the player has moved, the tiles to check is based on the direction the player moved before that way we don't check behind us.
  else {
    const xMovementDifference = playerPosition.x - previousPlayerPosition.x;
    const yMovementDifference = playerPosition.y - previousPlayerPosition.y;

    // Last move was on the y-axis.
    if (xMovementDifference !== 0) {
      if (!playerPosition.y - 1 < 0) {
        tileCheck(maze, playerPosition, 0, -1, passibleTiles); // Check tile above.
      }

      if (playerPosition.y + 1 <= height - 1) {
        tileCheck(maze, playerPosition, 0, 1, passibleTiles); // Check tile below.
      }

      if (
        !(
          playerPosition.x + xMovementDifference < 0 ||
          playerPosition.x + xMovementDifference > width - 1
        )
      ) {
        tileCheck(maze, playerPosition, +xMovementDifference, 0, passibleTiles); // Check tile left or right based on xMovementDifference (+1 or -1).
      }
    }
    // Last move was on the x-axis.
    else if (yMovementDifference !== 0) {
      if (!playerPosition.x - 1 < 0) {
        tileCheck(maze, playerPosition, -1, 0, passibleTiles); // Check tile left.
      }

      if (playerPosition.x + 1 <= width - 1) {
        tileCheck(maze, playerPosition, 1, 0, passibleTiles); // Check tile right.
      }

      if (
        !(
          playerPosition.y + yMovementDifference < 0 ||
          playerPosition.y + yMovementDifference > height - 1
        )
      ) {
        tileCheck(maze, playerPosition, 0, +yMovementDifference, passibleTiles); // Check tile up or down based on yMovementDifference (+1 or -1).
      }
    } else {
      return [];
    }
  }

  // If a dead-end has been reached (no more passible tiles to move to).
  if (!passibleTiles.length) {
    return [];
  }

  let newPlayerPosition = {};

  // If there is only one passible tile to move to then move to it.
  if (passibleTiles.length === 1) {
    const xDifference = passibleTiles[0].x - playerPosition.x;
    const yDifference = passibleTiles[0].y - playerPosition.y;

    let instruction = {};

    // Moving on x-axis.
    if (xDifference !== 0) {
      instruction = calculateXInstruction(playerPosition, xDifference);
    }

    // Moving on y-axis.
    if (yDifference !== 0) {
      instruction = calculateYInstruction(playerPosition, yDifference);
    }

    // Update current moves taken and position + direction of player.
    moves.push(...instruction.moves);
    newPlayerPosition.direction = instruction.direction;
    newPlayerPosition.x = passibleTiles[0].x;
    newPlayerPosition.y = passibleTiles[0].y;
  }
  // If there is more than one passible tile (route) to move to then begin loop recursion to find the correct/fastest route.
  else {
    for (let tileIndex = 0; tileIndex < passibleTiles.length; ++tileIndex) {
      const xDifference = passibleTiles[tileIndex].x - playerPosition.x;
      const yDifference = passibleTiles[tileIndex].y - playerPosition.y;
      // We want to work with a clean array here as it is for a specific route that may lead to a dead-end so we don't want to dirty the main moves array.
      const routeSpecificMoves = [];

      let instruction = {};

      // Moving on x-axis.
      if (xDifference !== 0) {
        instruction = calculateXInstruction(playerPosition, xDifference);
      }

      // Moving on y-axis.
      if (yDifference !== 0) {
        instruction = calculateYInstruction(playerPosition, yDifference);
      }

      // Update route/recursion specific current moves taken and position + direction of player.
      routeSpecificMoves.push(...instruction.moves);
      newPlayerPosition.direction = instruction.direction;
      newPlayerPosition.x = passibleTiles[tileIndex].x;
      newPlayerPosition.y = passibleTiles[tileIndex].y;

      // If the player has reached the exit then update main moves array and end recursion for this route (not entire loop).
      if (newPlayerPosition.x === exit.x && newPlayerPosition.y === exit.y) {
        moves.push(...routeSpecificMoves);
        return moves;
      }

      // Continue to recurse down route until either a dead-end or the exit is reached.
      // The route specific moves are passed as it doesn't care about the main moves right now, if the exit is found down one of these recursions then main is updated below.
      const recursiveMoves = headDownRoute(
        maze,
        newPlayerPosition,
        playerPosition,
        exit,
        true,
        routeSpecificMoves
      );

      // If the route recursion completes and a dead-end wasn't reached/exit was reached then update main moves array and end recursion of route (not entire loop).
      if (recursiveMoves.length) {
        moves.push(...recursiveMoves);
        return moves;
      }
    }
  }

  // Single route specific (non route recursion) exit check. Ends main recursion if reached.
  if (newPlayerPosition.x === exit.x && newPlayerPosition.y === exit.y) {
    return moves;
  }

  // Recursive call if exit hasn't been found but still currently on a single tile route (one passible tile to go down).
  const finalMoves = headDownRoute(
    maze,
    newPlayerPosition,
    playerPosition,
    exit,
    true,
    moves
  );

  // End of total recursive function and returns all moves collated into a single array. Called if not on a recursed route.
  return finalMoves;
};

/**
 * Calculates the exact moves needed to be done based on player position + direction and the x direction (difference) of travel (+1 on x-axis, -1 on x-axis, etc).
 *
 * @param {*} playerPosition
 * @param {*} difference
 */
const calculateXInstruction = (playerPosition, difference) => {
  // Positive on x-axis (moving right).
  if (difference > 0) {
    if (playerPosition.direction === ">") {
      return { moves: ["F"], direction: ">" };
    } else if (playerPosition.direction === "^") {
      return { moves: ["R", "F"], direction: ">" };
    } else if (playerPosition.direction === "v") {
      return { moves: ["L", "F"], direction: ">" };
    } else if (playerPosition.direction === "<") {
      return { moves: ["B", "F"], direction: ">" };
    } else {
      return { moves: [], direction: ">" };
    }
  }
  // Negative on x-axis (moving left).
  else if (difference < 0) {
    if (playerPosition.direction === ">") {
      return { moves: ["B", "F"], direction: "<" };
    } else if (playerPosition.direction === "^") {
      return { moves: ["L", "F"], direction: "<" };
    } else if (playerPosition.direction === "v") {
      return { moves: ["R", "F"], direction: "<" };
    } else if (playerPosition.direction === "<") {
      return { moves: ["F"], direction: "<" };
    } else {
      return { moves: [], direction: "<" };
    }
  }
};

/**
 * Calculates the exact moves needed to be done based on player position + direction and the y direction (difference) of travel (+1 on y-axis, -1 on y-axis, etc).
 *
 * @param {*} playerPosition
 * @param {*} difference
 */
const calculateYInstruction = (playerPosition, difference) => {
  // Positive on y-axis (moving down).
  if (difference > 0) {
    if (playerPosition.direction === ">") {
      return { moves: ["R", "F"], direction: "v" };
    } else if (playerPosition.direction === "^") {
      return { moves: ["B", "F"], direction: "v" };
    } else if (playerPosition.direction === "v") {
      return { moves: ["F"], direction: "v" };
    } else if (playerPosition.direction === "<") {
      return { moves: ["L", "F"], direction: "v" };
    } else {
      return { moves: [], direction: "v" };
    }
  }
  // Negative on y-axis (moving up).
  else if (difference < 0) {
    if (playerPosition.direction === ">") {
      return { moves: ["L", "F"], direction: "^" };
    } else if (playerPosition.direction === "^") {
      return { moves: ["F"], direction: "^" };
    } else if (playerPosition.direction === "v") {
      return { moves: ["B", "F"], direction: "^" };
    } else if (playerPosition.direction === "<") {
      return { moves: ["R", "F"], direction: "^" };
    } else {
      return { moves: [], direction: "^" };
    }
  }
};
