// object for storing in local storage
var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')): {
    incomplete: [],
    inprogress: [],
    complete: [],
    history: []
};

// variables for inner html
var removeFA = '<i class="fas fa-times"></i>';
var doneFA = '<i class="fas fa-arrow-right"></i>';

// On start up, get data in local storage
renderTodoList(); // has to occur after global variables are declared

// if there was only one button this function could just go in the event listener creation
// but breaking down code into functions is key for reusability, obviously
document.getElementById('add').addEventListener('click', function() {
    var value = document.getElementById('item').value;
    if (value) { // empty string is always false        
        addOnClick(this.value);
    }
});

// don't just have to click, it will add also on enter button
document.getElementById('item').addEventListener('keydown', function (e) {
    if (e.code === 'Enter' && this.value) {
        addOnClick(this.value);
    }
});

// Adding from input line
function addOnClick(value) {
    addItemToDOM(value, "inc"); // if there is any text in the item field, add that text to the todo list
    document.getElementById('item').value = ''; // reset value so input field is empty

    data.incomplete.push(value);
    dataObjectUpdate();
}

// On start up, get data in local storage
function renderTodoList() {
    if (!data.incomplete.length && !data.inprogress.length && !data.complete.length) return;

    for (var i = 0; i < data.incomplete.length; i++) {
        var value = data.incomplete[i];
        addItemToDOM(value, "inc");
    }

    for (var j = 0; j < data.inprogress.length; j++) {
        var value = data.inprogress[j];
        addItemToDOM(value, "inp");
    }

    for (var k = 0; k < data.complete.length; k++) {
        var value = data.complete[k];
        addItemToDOM(value, "com");
    }

    for (var m = 0; m < data.history.length; m++) {
        var value = data.history[m];
        addItemToDOM(value, "hist");
    }
}

// Local Storage
function dataObjectUpdate() {
    localStorage.setItem('todoList', JSON.stringify(data)); // can only store clear text so convert to json
}

// Remove
function removeItem() {
    var parent = this.parentNode.parentNode.parentNode;
    // grab the event not the target because depending where you click you could get the svg or img or icon OR the button, using this will ALWAYS get the button regardless of where the user clicks
    var item = this.parentNode.parentNode; // get the list item, get this by console.log and seeing where is what
    var id = parent.id;
    var value = item.innerText;

    // save to object
    if (id === "incompleted") {
        data.incomplete.splice(data.incomplete.indexOf(value), 1); // button is inside li so grab inner text
    } else if (id === "progressing") {
        data.inprogress.splice(data.inprogress.indexOf(value), 1); // button is inside li so grab inner text
    } else {
        data.complete.splice(data.complete.indexOf(value), 1); // button is inside li so grab inner text
    }
    dataObjectUpdate();

    parent.removeChild(item);
}

// Progress Item
function completeItem() {
    var parent = this.parentNode.parentNode.parentNode;
    var item = this.parentNode.parentNode;
    var id = parent.id;
    var value = item.innerText;

    // save to object
    if (id === "incompleted") {
        data.incomplete.splice(data.incomplete.indexOf(value), 1); // button is inside li so grab inner text
        data.inprogress.push(value);
    } else if (id === "progressing") {
        data.inprogress.splice(data.inprogress.indexOf(value), 1); // button is inside li so grab inner text
        data.complete.push(value);
    } else {
        data.complete.splice(data.complete.indexOf(value), 1); // button is inside li so grab inner text
        data.history.push(value);
    }
    dataObjectUpdate();

    // check if item should be moved to completed or to incompleted
    var target = (id === 'incompleted') ? document.getElementById('progressing') : (id === 'progressing') ? document.getElementById('completed') : document.getElementById('history'); // takes the places of if/else conditional statement

    parent.removeChild(item);
    target.insertBefore(item, target.childNodes[0]);
}

// Adds new item to the todo list
function addItemToDOM(text, state) {
    var list = (state === 'com') ? document.getElementById('completed') : (state === 'inp') ? document.getElementById('progressing') : (state === 'inc') ? document.getElementById('incompleted') : document.getElementById('history');

    // create an html element to add to the dom
    // adding inner html method is going to be slow, take up memory, be unstable, especially hard on mobile devices to render it up
    var item = document.createElement('li');
    item.innerText = text;

    var buttons = document.createElement('div');
    buttons.classList.add('buttons');

    var remove = document.createElement('button');
    remove.classList.add('remove');
    remove.innerHTML = removeFA;

    // add click event for toggling removing item
    remove.addEventListener('click', removeItem);

    buttons.appendChild(remove);

    if (state != "hist") {
        var done = document.createElement('button');
        done.classList.add('done');
        done.innerHTML = doneFA;
    
        // add click event for toggling completition of item 
        done.addEventListener('click', completeItem);

        buttons.appendChild(done);
    }

    item.appendChild(buttons);
 
    list.insertBefore(item, list.childNodes[0]);
}

// task history collapsible right side bar
function openHistory() {
    document.getElementById("history-overlay").style.width = "100%";
  }
  
  /* Close when someone clicks on the "x" symbol inside the overlay */
  function closeHistory() {
    document.getElementById("history-overlay").style.width = "0%";
  }