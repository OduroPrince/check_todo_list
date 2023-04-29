
const setUpTasksLayout = (data, email) => {
    var items = [];
    var importantItems = [];

    data.forEach(element => {
        items.push({
            id: element.id,
            ...element.data()
        });
    });

    document.querySelector('.theContainer').innerHTML = todoLayout(items, "active");
    document.querySelector('.doneContainer').innerHTML = todoLayout(items, "completed");
    document.querySelector(".collab").innerHTML = todoLayout(items);

    //Copying the important items into the important list
    importantItems = items.filter(function (obj) {
        return obj.important === true;
    });

    //Displays all the important tasks    
    const emptyMessage = `<h2 class="error-message">There is no important message here!</h2>`;
    if (importantItems.length == 0) {
        document.querySelector('.important-container').innerHTML = emptyMessage;
    } else {
        document.querySelector('.important-container').innerHTML = todoLayout(importantItems);

    }

    createEventListeners(email);
    createEventListenersDelete(email);
    createEventListenersImportant(email);
}

//Creates an eventListener for every single checkbox
function createEventListeners(Email) {
    var todoCheckMarks = document.querySelectorAll('.item_container .check-mark');

    todoCheckMarks.forEach((checkMark) => {
        checkMark.addEventListener("click", function () {
            markCompleted(checkMark.dataset.id, Email);
        });
    });
}

//Creates an eventListener for every single delete
function createEventListenersDelete(Email) {
    var todoCheckMarks = document.querySelectorAll('.item_container .delete-text');

    todoCheckMarks.forEach((checkMark) => {
        checkMark.addEventListener("click", function () {
            deleteTask(checkMark.dataset.id, Email);
        });
    });
}

//Creates an eventListener for every single important
function createEventListenersImportant(Email) {
    var todoImportant = document.querySelectorAll('.item_container .star-container');

    todoImportant.forEach((important) => {
        important.addEventListener("click", function () {
            importantTask(important.dataset.id, Email);
        });
    });
}

//Function that fires when a checkbox is clicked
function markCompleted(id, e) {
    let item = db.collection(e).doc(id);
    item.get().then(function (doc) {
        if (doc.exists) {
            let status = doc.data().status;
            if (status == "active") {
                item.update({
                    status: "completed"
                })
            } else if (status == "completed") {
                item.update({
                    status: "active"
                })
            }
        }
    });
}

//Function that deletes a task
function deleteTask(id, e) {
    let item = db.collection(e).doc(id);
    item.delete().catch(error => {
        alert("Error deleting document: ", error);
    })
}

//Function that adds a task to important
function importantTask(id, e) {
    let item = db.collection(e).doc(id);
    item.get().then(function (doc) {
        if (doc.exists) {
            let priority = doc.data().important;
            if (priority == true) {
                item.update({
                    important: false
                })
            } else if (priority == false) {
                item.update({
                    important: true
                })
            }
        }
    });
}

//Function that formats the date object to string
function formateDate(dateValue) {
    var result = Date(dateValue).toString();
    return result;
}


function todoLayout(items, status) {
    let container = '';
    if (status == null) {
        items.forEach(docs => {
            const li = `
         <div class="item_container" title="Created on: ${formateDate(docs.createdDate)}">
             <div data-id="${docs.id}" class="check-mark ${docs.status == "completed" ? "checked" : ""}">
                 <img src="images/icon-check.svg">
             </div>
             <div class="text-container">
                 <p class="task_name ${docs.status == "completed" ? "checked" : ""}">${docs.text}</p>
                 <div>
                     <label class="task_category">${docs.category}</label> 
                     <label class="task_endDate ${docs.endDate == "" ? "empty" : ""}"><i>Due in: ${timeLeft(docs.createdDate, docs.endDate)}</i></label>
                 </div>           
             </div>
           <div class="star-container ${docs.important == true ? "important" : ""}" data-id="${docs.id}" title="Mark as important">
             <i class="fa-solid fa-star"></i>
           </div>
           <div title="Delete task" data-id="${docs.id}" class="delete-text ${docs.status == "completed" ? "checked" : ""}">
             <i class="fa-regular fa-trash-can fa-bounce fa-xl" style="color: #ff0000;"></i>
           </div>
         </div>
     `;
            container += li;
        });
    }else{
        items.forEach(docs => {
            if (docs.status == status) {
                const li = `
        <div class="item_container" title="Created on: ${formateDate(docs.createdDate)}">
            <div data-id="${docs.id}" class="check-mark ${docs.status == "completed" ? "checked" : ""}">
                <img src="images/icon-check.svg">
            </div>
            <div class="text-container">
                <p class="task_name ${docs.status == "completed" ? "checked" : ""}">${docs.text}</p>
                <div>
                    <label class="task_category">${docs.category}</label> 
                    <label class="task_endDate ${docs.endDate == "" ? "empty" : ""}"><i>Due in: ${timeLeft(docs.createdDate, docs.endDate)}</i></label>
                </div>           
            </div>
          <div class="star-container ${docs.important == true ? "important" : ""}" data-id="${docs.id}" title="Mark as important">
            <i class="fa-solid fa-star"></i>
          </div>
          <div title="Delete task" data-id="${docs.id}" class="delete-text ${docs.status == "completed" ? "checked" : ""}">
            <i class="fa-regular fa-trash-can fa-bounce fa-xl" style="color: #ff0000;"></i>
          </div>
        </div>
    `;
                container += li;
            }
        });
    }
    return container;
}

function timeLeft(createdDate, endDate) {
    const createDate = new Date(createdDate);
    const futureDate = new Date(endDate);

    const diffInMs = futureDate - createDate;

    return convertTimeLeft(diffInMs);

}

function convertTimeLeft(milliseconds) {
    let result;

    const minutes = milliseconds / 60000;

    if (minutes < 60) {
        result = `${Math.floor(minutes)} minutes`;
    } else if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.floor(minutes % 60);
        result = `${hours} hour${hours !== 1 ? 's' : ''}, ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
    } else if (minutes < 525600) {
        const days = Math.floor(minutes / 1440);
        const remainingHours = Math.floor((minutes % 1440) / 60);
        result = `${days} day${days !== 1 ? 's' : ''}, ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
    } else {
        const years = Math.floor(minutes / 525600);
        const remainingMonths = Math.floor((minutes % 525600) / 43200);
        result = `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }

    return result;
}