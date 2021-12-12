//to do ekleme de kullanılacak tüm  elementler

const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListener();

function eventListener(e){ //all event listerners
    form.addEventListener("submit",addTodo);

    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);

    secondCardBody.addEventListener("click",deleteTodo);

    filter.addEventListener("keyup",filterTodos);

    clearButton.addEventListener("click",clearAllTodos);

}


function clearAllTodos(e){
    if(confirm("Tüm Todo'ları silmek istediğinize emin misiniz?"))
    { //arayüzden todo temizleme
        while(todoList.firstElementChild !== null){
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");

    }
}


function filterTodos(e){
    const filterValue = e.target.value.toLowerCase();

    const listItems  = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();

        if(text.indexOf(filterValue)===-1)
        { //aranan to do bulunamadı
            listItem.setAttribute("style", "display: none !important");
            //bulunmadığı için sayfada herhangi bir şey yapma görünmez ol.
        }
        else
        {
            listItem.setAttribute("style","display: block");
        }

    });



}


function loadAllTodosToUI(){
    let todos = getTodosFromStorage(); //storage'den todo yu getir.

    todos.forEach(function(todo) {
        addTodoToUI(todo); //bu fonksiyon ile arayüze eklendi.
    });

}


function addTodo(e){
    const newTodo = todoInput.value.trim();

    if(newTodo === "")
    {
       showAlert("danger","Lütfen bir Todo giriniz..!");
    }
    else{
        addTodoToUI(newTodo); //arayüze todo ları ekleme.
        addTodoToStorage(newTodo);
        showAlert("success","Todo başarılı bir şekilde listeye eklendi");
    }

    e.preventDefault();
    todoInput.value="";
}


function deleteTodo(e){
    // tıklanan terdeki objeyi buluo silmeişlemi yapılıyor.
    if(e.target.className=== "fa fa-remove")
    {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent.trim());
        showAlert("warning","Başarıyla silindi..."); //arayüzden silme işlemi
    }

}

function deleteTodoFromStorage(deleteTodo){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo,index){
        if (todo === deleteTodo) {
            todos.splice(index,1); //arrayden değeri silme
        }
    });

    //silme ve ekleme gibi işlemlerden sonra değerler güncellenir.
    localStorage.setItem("todos",JSON.stringify(todos));

}


function showAlert(type,message){

    const alertdiv = document.createElement("div");

    alertdiv.className =  `alert alert-${type}`;
    
    alertdiv.textContent=message;

    firstCardBody.appendChild(alertdiv);

   
    setTimeout(function(){          //window objesinin setTimeOut metodu kullanılarak zamanalyıcı aayarlandı.
        alertdiv.remove();
    },2000);
}


function getTodosFromStorage(){

    //storage dan bütün todoları almış olacak

    if(localStorage.getItem("todos") === null){
        todos = [];
    }
    else{
        todos = JSON.parse(localStorage.getItem("todos"));//string gelen değer arraye çevrildi.
    }
    return todos;
}


function addTodoToStorage(newTodo){
     
    //ilk kontrol bir key var mı?

    let todos = getTodosFromStorage();

    todos.push(newTodo);

    localStorage.setItem("todos",JSON.stringify(todos));//storage güncellemsi
    
}

function addTodoToUI(newTodo){//string item değerini list item olarak UI'ya ekleme işlemi
    
    //yeni bir li elementi oluşturuluyor.
    const listItem = document.createElement("li");


    //Link oluşturma İşlemleri
    const link = document.createElement("a");
    link.href="#";
    link.className="delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i> "  //oluşturulan a elementının içine i elemnti ekleme= innerHTML ile yapıldı.
  
    listItem.className = "list-group-item d-flex justify-content-between"


    //text Node Ekleme işlemi
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);//appendchild ile tüm çocuklar eklenmiş oldu.

    //Todo list'e List Item'ı ekleme işlemi
    todoList.appendChild(listItem);

}