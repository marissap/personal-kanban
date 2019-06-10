
var removeFA = '<i class="fas fa-times"></i>';
var doneFA = '<i class="fas fa-arrow-right"></i>';

function removeItem() {
    var parent = this.parentNode.parentNode.parentNode;
    // grab the event not the target because depending where you click you could get the svg or img or icon OR the button, using this will ALWAYS get the button regardless of where the user clicks
    var item = this.parentNode.parentNode; // get the list item, get this by console.log and seeing where is what

    parent.removeChild(item);
}

function completeItem() {
    var parent = this.parentNode.parentNode.parentNode;
    var item = this.parentNode.parentNode;
    var id = parent.id;

    // check if item should be moved to completed or to incompleted
    var target = (id === 'incompleted') ? document.getElementById('completed'):document.getElementById('incompleted'); // takes the places of if/else conditional statement

    parent.removeChild(item);
    target.insertBefore(item, target.childNodes[0]);
}

// Adds new item to the todo list
function addItemTodo(text) {
    var list = document.getElementById('incompleted');

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

// if there was only one button this function could just go in the event listener creation
// but breaking down code into functions is key for reusability, obviously
document.getElementById('add').addEventListener('click', function(){
    var value = document.getElementById('item').value;
    if (value) { // empty string is always false
        addItemTodo(value); // if there is any text in the item field, add that text to the todo list
        document.getElementById('item').value = ''; // reset value so input field is empty
    }
});