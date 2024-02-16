var cpuIcon = 'X';
var playerIcon = 'O';
var AIMove;
var currentPlayer = 'player'; 
var liveBoard = [1, -1, -1, -1, 1, 1, 1, -1, -1];
var winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function renderBoard(board) {
  board.forEach(function(el, i) {
    var squareId = '#' + i.toString();
    if (el === -1) {
      $(squareId).text(playerIcon);
    } else if (el === 1) {
      $(squareId).text(cpuIcon);
    }
  });
  
  $('.square:contains(X)').addClass('x-marker');
  $('.square:contains(O)').addClass('o-marker');
}

function animateWinLine() {
  var idxOfArray = winningLines.map(function(winLines) {
    return winLines.map(function(winLine) {
      return liveBoard[winLine];
    }).reduce(function(prev, cur) {
      return prev + cur;
    });
  });
  var squaresToAnimate = winningLines[idxOfArray.indexOf(Math.abs(3))];
  
  squaresToAnimate.forEach(function(el) {
      $('#' + el).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200);
    });
}

function chooseMarker() {
    $('.modal-container').css('display', 'block');
    $('.choose-modal').addClass('animated bounceInUp');
  
    $('.button-area span').click(function () {
      var marker = $(this).text();
      playerIcon = marker === 'X' ? 'X' : 'O';
      cpuIcon = marker === 'X' ? 'O' : 'X';
  
      $('.choose-modal').addClass('animated bounceOutDown');
      setTimeout(function () {
        $('.modal-container').css('display', 'none');
        $('.choose-modal').css('display', 'none');
        startNewGame();
        displayCurrentPlayer(); 
      }, 700);
  
      $('.button-area span').off();
    });
  }

  function endGameMessage(){
    var result = checkVictory(liveBoard);
    var message;
    if (result === 'win') {
      message = currentPlayer === 'player' ? 'Player Won' : 'CPU Won';
    } else if (result === 'lose') {
      message = currentPlayer === 'player' ? 'Player Won' : 'CPU Won';
    } else {s
      message = "It's a Draw";
    }

    $('.end-game-modal h3').text(message);
    
    $('.modal-container').css('display', 'block');
    $('.end-game-modal').css('display','block').removeClass('animated bounceOutDown').addClass('animated bounceInUp');
   
    $('.button-area span').click(function() {
      
      $('.end-game-modal').removeClass('animated bounceInUp').addClass('animated bounceOutDown');
      
      setTimeout(function() {
        $('.modal-container').css('display', 'none');
        startNewGame();
      }, 700);
      
      $('.button-area span').off();
    });
}

function startNewGame() {
    liveBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    $('.square').text("").removeClass('o-marker x-marker');
    renderBoard(liveBoard);
    currentPlayer = 'player'; 
    displayCurrentPlayer(); 
    playerTakeTurn();
  }
function playerTakeTurn() {
    $('.square:empty').hover(function() {
      $(this).text(playerIcon).css('cursor', 'pointer');
    }, function() {
      $(this).text('');
    });
  
    $('.square:empty').click(function() {
      $(this).css('cursor', 'default');
      liveBoard[parseInt($(this).attr('id'))] = -1;
      renderBoard(liveBoard);
      
      if (checkVictory(liveBoard)) {    
        setTimeout(endGameMessage,(checkVictory(liveBoard) === 'win') ? 700 : 100);
      } else {
        changePlayer(); 
        displayCurrentPlayer(); 
        setTimeout(aiTakeTurn, 1000);
      }
      $('.square').off();
    });
  }
  
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function aiTakeTurn() {
    var randomChance = getRandomInt(1, 100);
    if (randomChance <= 20) {
      AIMove = availableMoves(liveBoard)[getRandomInt(0, availableMoves(liveBoard).length - 1)];
    } else {
      miniMax(liveBoard, 'aiPlayer');
    }
    
    liveBoard[AIMove] = 1;
    renderBoard(liveBoard);
    
    if (checkVictory(liveBoard)) {
      animateWinLine();
      setTimeout(endGameMessage, checkVictory(liveBoard) === 'win' ? 700 : 100);
    } else {
      changePlayer();
      displayCurrentPlayer();
      setTimeout(playerTakeTurn, 100);
    }
  }
function checkVictory(board) {
  var squaresInPlay = board.reduce(function(prev, cur) {
    return Math.abs(prev) + Math.abs(cur);
  });

  var outcome = winningLines.map(function(winLines) {
    return winLines.map(function(winLine) {
      return board[winLine];
    }).reduce(function(prev, cur) {
      return prev + cur;
    });
  }).filter(function(winLineTotal) {
    return Math.abs(winLineTotal) === 3;
  });

  if (outcome[0] === 3) {
    return 'win';
  } else if (outcome[0] === -3) {
    return 'lose';
  } else if (squaresInPlay === 9) {
    return 'draw';
  } else {
    return false;
  }
}

function availableMoves(board) {
  return board.map(function(el, i) {
    if (!el) {
      return i;
    }
  }).filter(function(e) {
    return (typeof e !== "undefined");
  });
}
function miniMax(state, player) {
  var rv = checkVictory(state);
  if (rv === 'win') {
    return 10;
  }
  if (rv === 'lose') {
    return -10;
  }
  if (rv === 'draw') {
    return 0;
  }

  var moves = [];
  var scores = [];
  availableMoves(state).forEach(function(square) {
    state[square] = (player === 'aiPlayer') ? 1 : -1;
    scores.push(miniMax(state, (player === 'aiPlayer') ? 'opponent' : 'aiPlayer'));
    moves.push(square);
    state[square] = 0;
  });


  if (player === 'aiPlayer') {
    AIMove = moves[scores.indexOf(Math.max.apply(Math, scores))];
    return Math.max.apply(Math, scores);
  } else {
    AIMove = moves[scores.indexOf(Math.min.apply(Math, scores))];
    return Math.min.apply(Math, scores);
  }
}

renderBoard(liveBoard);
chooseMarker();
var currentPlayer = 'player'; 

function changePlayer() {
    currentPlayer = currentPlayer === 'player' ? 'cpu' : 'player';
}

function displayCurrentPlayer() {
    var currentPlayerDisplay = currentPlayer === 'player' ? 'Player' : 'CPU';
    $('#current-player').text('Current Player: ' + currentPlayerDisplay);
}