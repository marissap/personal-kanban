
// object for storing in local storage
var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')): {
    incomplete: [],
    complete: []
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
    addItemToDOM(value, false); // if there is any text in the item field, add that text to the todo list
    document.getElementById('item').value = ''; // reset value so input field is empty
    
    data.incomplete.push(value);
    dataObjectUpdate();
}

// On start up, get data in local storage
function renderTodoList() {
    if (!data.incomplete.length && !data.complete.length) return;

    for (var i = 0; i < data.incomplete.length; i++) {
        var value = data.incomplete[i];
        addItemToDOM(value, false);
    }

    for (var j = 0; j < data.complete.length; j++) {
        var value = data.complete[j];
        addItemToDOM(value, true);
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
    } else {
        data.complete.splice(data.complete.indexOf(value), 1); // button is inside li so grab inner text
    }
    dataObjectUpdate();

    parent.removeChild(item);
}

// Complete
function completeItem() {
    var parent = this.parentNode.parentNode.parentNode;
    var item = this.parentNode.parentNode;
    var id = parent.id;
    var value = item.innerText;

    // save to object
    if (id === "incompleted") {
        data.incomplete.splice(data.incomplete.indexOf(value), 1); // button is inside li so grab inner text
        data.complete.push(value);
    } else {
        data.complete.splice(data.complete.indexOf(value), 1); // button is inside li so grab inner text
        data.incomplete.push(value);
    }
    dataObjectUpdate();

    // check if item should be moved to completed or to incompleted
    var target = (id === 'incompleted') ? document.getElementById('completed'):document.getElementById('incompleted'); // takes the places of if/else conditional statement

    parent.removeChild(item);
    target.insertBefore(item, target.childNodes[0]);
}

// Adds new item to the todo list
function addItemToDOM(text, flag) {
    var list = (flag) ? document.getElementById('completed'):document.getElementById('incompleted');

    // create an html element to add to the dom
    // adding inner html method is going to be slow, take up memory, be unstable, especially hard on mobile devices to render it up
    var item = document.createElement('li');
    item.innerText = text;

    var buttons = document.createElement('div');
    buttons.classList.add('buttons');

    var remove = document.createElement('button');
    remove.classList.add('remove');
    // remove.innerHTML(removeFA);

    // add click event for removing item 
    remove.addEventListener('click', removeItem);

    var done = document.createElement('button');
    done.classList.add('done');
    // done.innerHTML(doneFA);

    // add click event for toggling completition of item 
    done.addEventListener('click', completeItem);

    buttons.appendChild(remove);
    buttons.appendChild(done);
    item.appendChild(buttons);
 
    list.insertBefore(item, list.childNodes[0]);
}