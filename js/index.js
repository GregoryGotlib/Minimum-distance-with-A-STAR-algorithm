//Developed by Gregory Gotlib & Natali Amzaleg for AI final project  

// foundation variables
var openStack = [];
var obstStack = [];
var stack = [];
var gridBorder = 9;
var startPoint = null;
var endPoint = null;
var colorFlag = '';
var startFlag = null;
var endFlag = null;

// Grid contant printer
let sflag = 1;
let eflag = 1;
var Grid = document.querySelectorAll(".container")[1];

for (var i = 9; i>0; i--) {
  for (var j = 1; j<10; j++) {
    Grid.innerHTML = Grid.innerHTML + '<div class="gridContainer"><div class="gridBox" id="b'+j+''+i+'" onclick="updateGrid(this.id)" data-h-g-f-parent="[0, 0, 0, null]" data-locked="0"></div> </div>';  
  }
  Grid.innerHTML = Grid.innerHTML + '<br>';
}

// Color box onclick setter
function setColorFlag(colorType){
	
	if(colorType == 1)
	{
		colorFlag = "black";
	}
	else if (colorType == 2){
		colorFlag = "green";
	}
	else if(colorType == 3){
		colorFlag = "red";
	}
	console.log(colorFlag);
}

// Update grid via selected color box
function updateGrid(node) {
	console.log(node)
	
	if(colorFlag == "black"){
		if ($('#' + node).data('obstacle') == 1)
		{
			$('#' + node).css("background-color", "lightyellow").data('obstacle', 0);
		} 
		else
		{
			$('#' + node).css("background-color", "black")
			.data('obstacle', 1);
		}
	}
	
	else if(colorFlag == "green" ){
		if ($('#' + node).data('start') == 1)
		{
			$('#' + node).css("background-color", "lightyellow").data('start', 0);
			startFlag = null;
			startPoint = null;
		}	
		else
		{
			if( !startFlag)
			{
				$('#' + node).css("background-color", "green")
				.data('start', 1);
				startFlag = 1;
				startPoint = node;
			}
		}
	}
	
	else if(colorFlag == "red"){
		if ($('#' + node).data('end') == 1)
		{
			$('#' + node).css("background-color", "lightyellow").data('end', 0);
			endFlag = null;
			endPoint = null;
		}	
		else
		{
			if(!endFlag){
				$('#' + node).css("background-color", "red")
				.data('end', 1);
				endFlag = 1;
				endPoint = node;
			}
		}
	}
};

// Node color 
function color(node, rang) {
	$('#' + node).css("background-color", rang);
};

// Return node with the smallest f value in openStack
function smallestFvalue() 
{
  var node = openStack[0],
    ele = $('#' + openStack[0]).data('h-g-f-parent');
  for (i in openStack) {
    var attr = $('#' + openStack[i]).data('h-g-f-parent');
    if (attr[2] < ele[2]) {
      ele = attr;
      node = openStack[i];
    } else if (attr[2] == ele[2]) {
      if (attr[1] < ele[1]) {
        ele = attr;
        node = openStack[i];
      }
    }
  }
  var x = parseInt(node.substr(1, 1));
  var y = parseInt(node.substr(2, 1));
  node = "b" + x + y;
  return node;
}

// Grid renewer
function reset() {
  var i, j;
  for (i = 1; i <= gridBorder; i++) {
    for (j = 1; j <= gridBorder; j++) {
      node = "b" + i + j;
      var attr = $('#' + node).data('h-g-f-parent');
      attr[0] = 0;
      attr[1] = 0;
      attr[2] = 0;
      attr[3] = 'null';
      $('#' + node).data('h-g-f-parent', attr);
     
	  //
	   if ($('#' + node).data('obstacle') != 1) {
        color(node, "lightyellow");
      }
    };
  }
  openStack = [];
  obstStack = [];
  stack = [];
  endFlag=null;
  startFlag=null;

}

// Grid renewer
function resetAll() {
  var i, j;
  for (i = 1; i <= gridBorder; i++) {
    for (j = 1; j <= gridBorder; j++) {
      node = "b" + i + j;
      var attr = $('#' + node).data('h-g-f-parent');
      attr[0] = 0;
      attr[1] = 0;
      attr[2] = 0;
      attr[3] = 'null';
      $('#' + node).data('h-g-f-parent', attr);
	  color(node, "lightyellow");
    };
  }
  openStack = [];
  obstStack = [];
  stack = [];
  endFlag=null;
  startFlag=null;

}

// Insert node to  open/obstacle stack
function insertNode(list, node) {
	if(node == null){
		alert("You have to chose starting point!")
	}
	else{
		var i = list.indexOf(node);
		if (i == -1) {
			list.push(node);
		} 
	}
}

// Delete node from stack
function deleteNode(list, node) {
  color(node, "lightyellow");
  var i = list.indexOf(node);
  if (i > -1) {
    list.splice(i, 1);
  }
}

// Find node in stack
function findNode(list, node) {
  if (list.indexOf(node) == -1) {
    return 0;
  } else {
    return 1;
  }
}

//Compares if child is actually fit to be one
function compareNodes(node1, node2, diag)
{
  var increment; 
  if (diag) {
    increment = 14;
  }
  increment = 10;
  var attr1 = $('#' + node1).data('h-g-f-parent');
  var attr2 = $('#' + node2).data('h-g-f-parent');
  return attr1[1] > attr2[1] + increment;
}

function checkIfLocked(node) {
  return $('#' + node).data('obstacle');
}

function updateNode(node, parent, diag, e) {
  var increment = 10;
  if (diag) {
    increment = 14;
  }
  var attr = $('#' + node).data('h-g-f-parent');
  var attr_parent = $('#' + parent).data('h-g-f-parent');
  if (e) //Enable : First Time Visit, Calculate Heurestic
  {
    var x = parseInt(node.substr(1, 1));
    var y = parseInt(node.substr(2, 1));
    attr[0] = 10 * (2 * gridBorder - x - y); //Math.abs(x-gridBorder) + Math.abs(y-gridBorder);
  }
  attr[1] = attr_parent[1] + increment;
  attr[2] = attr[0] + attr[1];
  attr[3] = parent;
  $('#' + node).data('h-g-f-parent', attr);
};

function updateFriends(node) {
  var x = parseInt(node.substr(1, 1));
  var y = parseInt(node.substr(2, 1));
  var adjacent = [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
    [x - 1, y - 1],
    [x + 1, y - 1],
    [x - 1, y + 1],
    [x + 1, y + 1]
  ];
  for (i in adjacent) {
    temp = adjacent[i];
    adj_node = "b" + temp[0] + temp[1];
    diag = 0;
    if (i > 3) {
      diag = 1;
    }
    if (temp[0] <= gridBorder && temp[0] > 0 && temp[1] <= gridBorder && temp[1] > 0 && !findNode(obstStack, adj_node) && !checkIfLocked(adj_node)) {
      
      var attr = $('#' + adj_node).data('h-g-f-parent');
      var attr_parent = $('#' + node).data('h-g-f-parent');      

      if (!findNode(openStack, adj_node))
      {
        updateNode(adj_node, node, diag, 1); 
        insertNode(openStack, adj_node);
      } else 
      {
        if (compareNodes(adj_node, node, diag))
        {
          updateNode(adj_node, node, diag, 0); 
          insertNode(openStack, adj_node);
        }
      }
    }
  }
}

function traceback(node) {
  stack.push(node);
  var attr = $('#' + node).data('h-g-f-parent');
  if (attr[3] == 'null') {
    return;
  } else {
    traceback(attr[3]);
  }
}

// A star algorithm 
function A_STAR() {
  reset();
  insertNode(openStack, startPoint);
  while (1) {
    if (openStack.length > 0) {
      var current = smallestFvalue();
      deleteNode(openStack, current);
      insertNode(obstStack, current);
      if (current == endPoint) {
        traceback(current);
        while (stack.length > 0) 
        {
          temp_node = stack.pop();
          color(temp_node, "green");
        }
        break;
      }
      updateFriends(current);
    } else {
      alert("All the paths are blocked! please try again..");
      break;
    }
  }
  startPoint=null;
  endPoint=null;
};