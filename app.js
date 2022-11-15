class Seat {
  constructor(block, row, column, classSeat, passenger) {
    this.block = block;
    this.row = row;
    this.column = column;
    this.classSeat = classSeat;
    this.passenger = passenger;
  }
}

var controller = {
  init: function () {
    //----------Getting Elements from HTML
    let seats = document.getElementById("seats");
    let result = [];
    document.getElementById("button").addEventListener("click", function () {
      //---------- Filling Inputs
      let queue = document.getElementById('queue').value;
      let stringRowsColumns = document.getElementById("rowsColumns").value;
      let inputArrayRowsColumns = controller.parseInput(stringRowsColumns);
      result = [];

      //----------Clearing View 
      view.clearFromDOM(seats);
      //---------- Checking Validation
      if (controller.isInputValid(inputArrayRowsColumns, queue) === false) { return false };
      //----------Sorting 
      controller.sortSeat(inputArrayRowsColumns, result);
      result.sort(controller.comparator('column'));
      result.sort(controller.comparator('classSeat'));
      controller.seatPassengers(result, queue);
      result.sort(controller.comparator('row', 'column', 'block'));
      //----------Table
      view.createTableResults(inputArrayRowsColumns, result);
    });
  },

  //---------- Getting string from input in the format of '[[x,y],[x,y]]'
  //----------Return an array [[x, y], [x, y]]
  parseInput: function (string) {
    //----------  Removing spaces
    string = string.replace(/\s/g, '');
    //----------  Removing parents [] Brackets
    string = string.substring(2, string.length - 2);

    //---------- String ====> Array
    let array = string.split("],[").map(function (x) {
      return x.split(",");
    });

    //---------- String ====>Number
    for (i = 0; i < array.length; i++) {
      for (j = 0; j < array[i].length; j++) {
        array[i][j] = parseInt(array[i][j]);
      }
    };
    return array;
  },
  //----------  Deviding Seats
  comparator: function (key) {
    return function (a, b) {
      return a[key] - b[key];
    }
  },
  //----------  Validation 
  isInputValid: function (arrayRowsColumns, que) {
    //----------  less than 8 items in input array 
    if (arrayRowsColumns.length > 8) {
      alert('Too many sections with the rows and columns!');
      document.getElementById("rowsColumns").focus();
      return false;
    }
    //----------  greater than 0 in row and columns
    for (i = 0; i < arrayRowsColumns.length; i++) {
      for (j = 0; j < arrayRowsColumns[i].length; j++) {
        if (arrayRowsColumns[i][j] < 1 || Number.isNaN(arrayRowsColumns[i][j])) {
          alert('The rows and columns must be more than 0!');
          document.getElementById("rowsColumns").focus();
          return false;
        }
      }
    }
    //----------  number of passengers greater than 0
    if (que < 1 || que % 1 != 0) {
      alert('Incorrect input!');
      document.getElementById("queue").focus();
      return false;
    }
  },

  sortSeat: function (inputArray, resultArr) {
    for (block = 1; block <= inputArray.length; block++) {
      //[1,3] ** index of 1 is 0 and index of 3=1
      for (column = 1; column <= inputArray[block - 1][0]; column++) {
        //[1,3] ** index of 1 is 0 and index of 3=1
        for (row = 1; row <= inputArray[block - 1][1]; row++) {
          if (block === 1 && column === 1 && inputArray[block - 1][0] > 1) {
            newSeat = new Seat(block, column, row, 2);
            resultArr.push(newSeat);
          } else if (block === inputArray.length
            && column === inputArray[block - 1][0]
            && inputArray[block - 1][0] > 1) {
            newSeat = new Seat(block, column, row, 2);
            resultArr.push(newSeat);
          } else if (column === 1 || column === (inputArray[block - 1][0])) {
            newSeat = new Seat(block, column, row, 1);
            resultArr.push(newSeat);
          } else {
            newSeat = new Seat(block, column, row, 3);
            resultArr.push(newSeat);
          }
        }
      }
    }
  },

  seatPassengers: function (res, que) {
    if (res.length < que) {
      alert("Only the first " + res.length + " passengers will be able to fly away.");
      for (i = 0; i < res.length; i++) {
        res[i].passenger = i + 1;
      }
    } else {
      for (i = 0; i < que; i++) {
        res[i].passenger = i + 1;
      }
    }
  }
};

var view = {
  clearFromDOM: function (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },


  createTableResults: function (arrInput, arrResult) {
    for (i = 0; i < arrInput.length; i++) {
      table = document.createElement('table');
      table.setAttribute('class', 'table' + (i + 1));

      for (j = 0; j < arrInput[i][1]; j++) {
        tr = document.createElement('tr');
        tr.setAttribute('class', 'tr' + (j + 1));
        for (z = 0; z < arrResult.length; z++) {
          if (arrResult[z].block === i + 1 && arrResult[z].column === j + 1) {
            td = document.createElement('td');
            td.setAttribute('class', 'class' + arrResult[z].classSeat);
            if (isNaN(arrResult[z].passenger) === false) {
              td.innerText = arrResult[z].passenger;
            } else {
              td.innerText = "";
            }
            tr.appendChild(td);
          }
        }
        table.appendChild(tr);
      }
      seats.appendChild(table);
    }
  }
}

controller.init();
