const form = document.getElementById("transactionFrom"); /* selecciona al form */
        
form.addEventListener("submit", function(event){
    event.preventDefault(); /* para que la pag no se recargue */
    let transactionFromData = new FormData(form);
    let transactionObj = convertFormDataToTransactionObj(transactionFromData)
    console.log(transactionObj)
    // si es valido el formulario se guarda
    if(isValidTransactionForm(transactionObj)){
        saveTransactionObj(transactionObj);
        insertRowInTransactionTable(transactionObj);
        form.reset();
    }else{
        //Mostrar error
    }
    
})

function isValidTransactionForm(transactionObj){
    let isValidForm = true;
    if(!transactionObj["transactionType"]){
        alert("Tu transaction type no es valido, ponerle algo")
        isValidForm = false;
    }
    if(!transactionObj["transactionDescription"]){
        alert("Debes colocar algo en el transaction description")
        isValidForm = false;
    }

    if(!transactionObj["transactionAmount"]){
        alert("Debes colocar un monto")
        isValidForm = false;
    }else if(transactionObj ["transactionAmount"] < 0){
        alert("No puedes poner numeros negativos")
        isValidForm = false;
    }
    if(!transactionObj ["transactionCategory"]){
        alert("Debes colocar algo en el transaction categori")
        isValidForm = false;
    }
    return isValidForm;

}


function draw_category(){
    let allCategories =[
        "Alquiler", "Comida", "Diversion", "Antojo", "Gasto", "Transporte"
    ]
    for(let index =0; index < allCategories.length; index++){
        inssertCategory(allCategories[index])
    }
}

function inssertCategory(categoryName){
    const selectElement = document.getElementById("transactionCategory")
    let htmlToInsert = `<option> ${categoryName}</option>`
    selectElement.insertAdjacentHTML("beforeend", htmlToInsert)
}

document.addEventListener("DOMContentLoaded", function(event){
    draw_category()
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"))
    transactionObjArr.forEach(
        function(arrayElement){
            insertRowInTransactionTable(arrayElement)
        }
    )
})

function getNewTransantionId(){
    let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1"
    let newTransactionId = JSON.parse(lastTransactionId) +1;
    localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId))
    return newTransactionId;
}

function convertFormDataToTransactionObj(transactionFromData){
    let transactionType = transactionFromData.get("transactionType")
    let transactionDescription = transactionFromData.get("transactionDescription")
    let transactionAmount = transactionFromData.get("transactionAmount")
    let transactionCategory = transactionFromData.get("transactionCategory")
    let transactionId = getNewTransantionId();
    return{
        "transactionType": transactionType,
        "transactionDescription": transactionDescription,
        "transactionAmount": transactionAmount,
        "transactionCategory": transactionCategory,
        "transactionId" : transactionId
    }
}

function insertRowInTransactionTable(transactionObj){

    let transactionTableRef = document.getElementById("transactionTable");
    let newTransactionRowRef = transactionTableRef.insertRow(-1);
    newTransactionRowRef.setAttribute("data-transaction-id", transactionObj["transactionId"])

    let newTypeCellRef = newTransactionRowRef.insertCell(0);
    newTypeCellRef.textContent = transactionObj["transactionType"];

    newTypeCellRef = newTransactionRowRef.insertCell(1);
    newTypeCellRef.textContent = transactionObj["transactionDescription"];

    newTypeCellRef = newTransactionRowRef.insertCell(2);
    newTypeCellRef.textContent = transactionObj["transactionAmount"];

    newTypeCellRef = newTransactionRowRef.insertCell(3);
    newTypeCellRef.textContent = transactionObj["transactionCategory"];

    let newDeleteCell = newTransactionRowRef.insertCell(4);
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    newDeleteCell.appendChild(deleteButton);

    deleteButton.addEventListener("click", (event) => {
        let transactionRow = event.target.parentNode.parentNode;
        let transactionId = transactionRow.getAttribute("data-transaction-id");
        transactionRow.remove();
        deleteTransctionObj(transactionId);

    })
}

// Le paso como parametro en transactionId de la transaccion que quiero eliminar
function deleteTransctionObj(transactionId){
    // Obtengo la transaccion de mi "base de datos" (Desconvierto de json a objeto)
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"))
    //Busco el indice / la poscicion de la transaccion que quiero eliminar
    let transactionIndexInArray = transactionObjArr.findIndex(element => element.transactionId == transactionId);
    //Emimino el elemento de esa poscicion 
    transactionObjArr.splice(transactionIndexInArray,1)
    //Convierto de objeto a json
    let transactionArrayJSON = JSON.stringify(transactionObjArr);
    //Guardo mi array de transaccion en formato JSON en el local storage
    localStorage.setItem("transactionData", transactionArrayJSON)
}

function saveTransactionObj(transactionObj){
    let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];
    myTransactionArray.push(transactionObj);
    // Convierto mi array transaccion a JSON
    let transactionArrayJSON = JSON.stringify(myTransactionArray);
    //Guardo mi array de transaccion en formato JSON en el local storage
    localStorage.setItem("transactionData", transactionArrayJSON)
}