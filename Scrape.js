// buttons=> table 
const tableContainer = document.querySelector('.table-container');
const tableSchedule = document.querySelector('.table-schedule');
const tableBody = document.querySelector('.data-rows'); 
// add and delete buttons 
const addButton = document.querySelector('.add-btn');
const deleteButton = document.querySelector('.delete-btn');
//Search related buttons 
const searchBox = document.querySelector('.search-box');
const searchButton = document.querySelector('.search-button');

class getCsv{// get csv data class
    async getCsvData(){
        try{
            let csvParse = await fetch('courseFallNew.csv'); //Fall semester csv file 
            let response = await csvParse.text();// parsing the fetched documents as text

            let rowsMain = response.split('\n');// splits the strings into array substrings
            const rowsMainLength = rowsMain.length
            console.log(rowsMainLength);// console test 
            let totalRows = rowsMain

              totalRows = totalRows.map(rowIndex=>{ // always better to use maps for key value collection 
                    let elt = rowIndex.split(',');
                    const subjectDepartment = elt[0];
                    const subjectTitle = elt[1];
                    const subjectInstructor = elt[5];
                    
                    // status: Inactive 
                        let subjectInstructorClean;
                        if(subjectInstructor.charAt(0) === '"'){
                            subjectInstructorClean = subjectInstructor.substr(1, subjectInstructor.length - 1); //optional instructor filter
                        }

                    const subjectTime = elt[4];
                    const subjectName = elt[2];
                    const subjectCredit = elt[3]; 
                    const subjectCrn = elt[7];
                    const subjectType = elt[8];
                    return{subjectDepartment, subjectTitle, subjectInstructor,  subjectTime, subjectName, subjectCredit, subjectCrn, subjectType};
                })

                return totalRows; // returns the required number of rows needed from the map function 
                
                

        }catch{
            console.log('Failed to fetch the csv data from file')
        }
        
    }
}

class UI{// display data 
    displayData(csvElement){
        console.log(csvElement)
        let result = '';

        csvElement.forEach(elementIndex=>{
            result = result + `<tr class="columnRow">
                <td class="columnDept" data-label="Dept:">${elementIndex.subjectDepartment}</td>
                <td class="columnTitle" data-label="Title:">${elementIndex.subjectTitle}</td>
                <td class="columnName" data-label="Name:">${elementIndex.subjectName}</td>
                <td class="columnTime" data-label="Time:">${elementIndex.subjectTime}</td>
                <td class="columnCredit" data-label="Credit:">${elementIndex.subjectCredit}</td>
                <td class="columnInstructor" data-label="Instructor:">${elementIndex.subjectInstructor}</td>
                <td class="columnCourseType" data-label="GenEd:">${elementIndex.subjectType}</td>
                <td class="columnCrn" data-label="CRN:">${elementIndex.subjectCrn}</td>
                <td class="column-data-button" data-label="Add Course:"><button class="add-btn"><i class="fas fa-plus"></i></td>    
            </tr>`

    tableBody.innerHTML = result;// appending the result array into the table 
        })
    }  

    checkCourseSchedule(searchButton){ // searchBoxFilter Function 
        if(searchButton){
            const searchBoxValue = searchBox.value.trim();
            const searchValueLower = searchBoxValue.toLowerCase();

                const table = document.querySelector('.table-schedule');
                const tr = table.getElementsByTagName('tr');
                const trLength = tr.length;

                for(let rowIndex = 1; rowIndex < trLength; rowIndex++){
                    let td = tr[rowIndex].getElementsByTagName('td')[0];// using department as the row distinguisher
                    let tdGened = tr[rowIndex].getElementsByTagName('td')[6];
                    let tdName = tr[rowIndex].getElementsByTagName('td')[2];
                    let tdTitle = tr[rowIndex].getElementsByTagName('td')[1];
                    let tdCredit = tr[rowIndex].getElementsByTagName('td')[4];

                    if(td || tdGened || tdName || tdTitle || tdCredit){
                        let textValue = td.textContent || td.innerHTML;// storing either the htmltext value or the innerhtml 
                        let textValueGened = tdGened.textContent || tdGened.innerHTML;   
                        let textValueName  = tdName.textContent || tdName.innerHTML;
                        let textValueTitle = tdTitle.textContent || tdTitle.innerHTML;
                        let textValueCredit = tdCredit.textContent || tdCredit.innerHTML;

                        if(textValue.toLowerCase().indexOf(searchValueLower) > -1 || 
                        textValueGened.toLowerCase().indexOf(searchValueLower) > -1 ||
                        textValueName.toLowerCase().indexOf(searchValueLower) > -1 ||
                        textValueTitle.toLowerCase().indexOf(searchValueLower) > -1 ||
                        textValueCredit === searchValueLower){ // -1 will be the default value if the search does not retrieve it
                            tr[rowIndex].style.display = '';// displays the entire row
                        }else{
                            tr[rowIndex].style.display = 'none';                           
                        }
                    }
                }
            }
    } 

    showAlert(message, classCall){ // alert function activates => Invalid department Name 
        const div = document.createElement('div');
        div.className = `alert alert-${classCall}`;
        div.appendChild(document.createTextNode(message))

        const tableSection = document.querySelector('.table-section');
        const tContainer = document.querySelector('.table-container');

        tableSection.insertBefore(div, tContainer);

        setTimeout(()=> document.querySelector('.alert').remove(), 2000); // timeout feature to get rid of warnings after 2 secs 
    }

    // function to add courses to a new table 
    courseAdd(addButton){ 
        addButton.addEventListener('click', e=>{
            let addValue = e.target;
            let buttonRow = addValue.parentElement.parentElement.parentElement;
            // row Headers element 
            let rowDept = buttonRow.getElementsByTagName('td')[0].innerText;
            let rowTitle = buttonRow.getElementsByTagName('td')[1].innerText;
            let rowName = buttonRow.getElementsByTagName('td')[2].innerText;
            let rowTime = buttonRow.getElementsByTagName('td')[3].innerText;
            let rowCredit = buttonRow.getElementsByTagName('td')[4].innerText;
            let rowInstructor = buttonRow.getElementsByTagName('td')[5].innerText;
            let rowCRN = buttonRow.getElementsByTagName('td')[6].innerText;
            let rowGened = buttonRow.getElementsByTagName('td')[7].innerText;

            let addButtonDetails = [rowDept,rowTitle,rowName,rowTime,rowCredit,rowInstructor,rowCRN, rowGened]; 

            const tableBody = document.querySelector('.add-body');
            const tr = document.createElement('tr');
            tr.classList.add('addRow');

            let addButtonIndex = 0;// local index for td elements 
            for(let index = 0; index < 8; index++){
                const td = document.createElement('td');
                td.classList.add('addRowData');
                td.innerText = addButtonDetails[addButtonIndex];
                if(addButtonIndex === 4){
                    td.classList.add('creditNumber');
                    td.classList.remove('addRowData');
                }
                if(addButtonIndex === 7){
                    td.classList.add('addCRN');
                    td.classList.remove('addRowData');
                }
                addButtonIndex = addButtonIndex + 1;
                tr.appendChild(td)
            }
            
            const tdAddDrop = document.createElement('td');
            tdAddDrop.classList.add('addDrop');
            tdAddDrop.innerHTML=`<button class="add"><i class = "fas fa-plus"></i>
            </button><button class="drop"><i class="fa fa-trash"></i></button>`
            tr.appendChild(tdAddDrop);

             // prevent repetition of same course addition 
             var crnData = document.getElementsByClassName('addCRN');
             for(let crnIndex = 0; crnIndex < crnData.length; crnIndex++){
                if(crnData[crnIndex].innerHTML === addButtonDetails[7]){ // index 7 after the add table is constructed 
                    this.showAlert('This Course Has Already Been Added', 'danger');
                    return;
                }
             }
            tableBody.appendChild(tr);
            
            //passing the deleteButtons to the subFunction
            const dropCourse = tdAddDrop.querySelector('.drop');
            this.courseDrop(dropCourse);

            // passing the addbuttons to the subfunction 
            const addCourse = tdAddDrop.querySelector('.add');
            this.courseAddLocal(addCourse);
        }) 
    }

    //subfunction to calculate credit
    // creditNumber(tr){
    //     const credit = tr.querySelector('.creditNumber').innerHTML;
    //     this.totalCredit(parseFloat(credit));
    // }

    // totalCredit(credit){
    //     var creditTotal = 0;
    //     var creditFinalTotal = 0;
    //     const tableBody = document.querySelector('.add-body');
    //     const tr = tableBody.getElementsByTagName('tr');
    //     for(let index = 1; index < tr.length; index++){
    //         let tdCredit = tr[index].getElementsByTagName('td')[4];
    //         if(tdCredit){
    //             let creditValue = parseFloat(tdCredit.innerHTML)
    //             console.log(creditValue);
    //             if(creditValue === credit){
    //                 creditTotal += credit;
    //             }
    //         }
    //     }
    //     console.log(creditTotal);
    //     const tdCredit = document.querySelector('.credit-total');
    //     tdCredit.innerHTML = creditTotal;
        
    // }

    //subfunction to remove the course
    courseDrop(dropCourseButton){
        dropCourseButton.addEventListener('click', e=>{
            let dropValue = e.target;
            dropValue.parentElement.parentElement.parentElement.remove();
            totalCredit();
        })
    }

    // subfunction to add the course to local storage
    courseAddLocal(addCourseButton){
        addCourseButton.addEventListener('click', e=>{
            let addValue = e.target;
            let addStorage = addValue.parentElement.parentElement.parentElement;
            storage.addCourseRow(addStorage);
        })
    }

    selectCourseDepartmentFeature(elements){// function to implement a select course department feature
        var deptList = '';
        elements.forEach(index=>{
            deptList = deptList + `<option value="dept-list" class="department-list">${index.subjectDepartment}</option>`
        })
        const deptSelect = document.querySelector('.dept-select'); //note: queryselector Corresponds with node elements
        deptSelect.innerHTML = deptList;// inserting the html inside the div 
      
        var optUsed=[];// for removing the copied department names 
        for(let index = 0; index < deptSelect.options.length; index++){
            var opt = optUsed.indexOf(deptSelect.options[index].innerHTML);
            if(opt === -1){
                optUsed.push(deptSelect.options[index].innerHTML);
            }else if(opt != -1){
                deptSelect.options[index].parentNode.remove(deptSelect.options[index].parentNode);
            }
        }
        this.selectOtionNoRepeat(optUsed)// passing the nonRepeated Departments into function 
    }

    selectOtionNoRepeat(optNoRepeat){
        // removing the previous elements
        const deptSelect = document.querySelector('.dept-select');
        while(deptSelect.firstChild){
            deptSelect.removeChild(deptSelect.firstChild);
            // removes all the option elements as a first child
        }

        // setting default option for department selection 
        const defaultOption = document.createElement('option');
        const defaultOptionText = document.createTextNode('--Choose A Department--');
        defaultOption.appendChild(defaultOptionText);
        defaultOption.setAttribute('value', '');
        deptSelect.appendChild(defaultOption);

        for(let index = 0; index < optNoRepeat.length; index++){
            const option = document.createElement('option');
            option.classList.add('dept-NoRepeat');
            option.innerHTML = optNoRepeat[index];
            deptSelect.appendChild(option);// adding the new elements;
        }
    }

    // select search function 
    selectSearchFunction(selectTarget){
        selectTarget.addEventListener('change', e=>{
            let selectValue = e.target.value;
            let selectValueLower = selectValue.toLowerCase();

            const table = document.querySelector('.table-schedule');
            const tr = table.getElementsByTagName('tr');

            for(let index = 0; index < tr.length; index++){
                let td = tr[index].getElementsByTagName('td')[0];// grabbing the department name
                if(td){
                    let textValue = td.innerHTML || td.textContent;
                    if(textValue.toLowerCase().indexOf(selectValueLower) > -1){
                        tr[index].style.display = ''; // displays all the rows with the select department names
                    }else{
                        tr[index].style.display = 'none';
                    }
                }
            }
        })
   
    }
            // status: inactive => transition function 
                transAlert(){// adding transition to the alert message 
                    const alert = document.querySelector('.alert');
                    alert.classList.add('transition');
                    window.setTimeout(()=>{
                        const alert = document.querySelector('.alert');
                        alert.classList.remove('transition');
                    }, 1000);
                }
}

class storage{
    // statically local storing of data
    static storeData(storeElement){ 
        localStorage.setItem('storeElement', JSON.stringify(storeElement));
    }

    static addCourseRow(courseAdd){// adding the course after its added
        localStorage.setItem('courseAdd', JSON.stringify(courseAdd));
    }
}

document.addEventListener('DOMContentLoaded', ()=>{ 
    const ui = new UI();
    const getCsvObject = new getCsv();

        // display Data function 
        getCsvObject.getCsvData().then(dataIndex=>{
            ui.displayData(dataIndex);
            ui.selectCourseDepartmentFeature(dataIndex);
            storage.storeData(dataIndex);
        }).then(e=>{ 
            // searchBlock event listener
            const searchButton = document.querySelector('.search-button');// activating search button 
            searchButton.addEventListener('click', e=>{
                e.preventDefault();
                let searchTarget = e.target;
                ui.checkCourseSchedule(searchTarget);
            })
            // selectSearchFunction()
            const selectDepartment = document.getElementById('dept-select-option');
            selectDepartment.addEventListener('click', e=>{
                e.preventDefault();
                let targetSelect = e.target;
                ui.selectSearchFunction(targetSelect); // sends the targeted select option list tp function
            })
            
            //courseAdd Function  
            const table = document.querySelector('.table-schedule');
            let tr = table.getElementsByTagName('tr');
            let trLength = tr.length;
            for(let tableIndex=1; tableIndex<trLength; tableIndex++){
                let tdButton=tr[tableIndex].getElementsByTagName('Button')[0];
                ui.courseAdd(tdButton);
            }
             
            //alert Box Function 
            const checkSearchBox = document.querySelector('.search-box');
            searchButton.addEventListener('click', e=>{
                e.preventDefault();
                if(checkSearchBox.value === ''){
                    ui.showAlert('No Department Name Entered', 'danger');
                }
            })
        })
})