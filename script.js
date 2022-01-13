import { data } from './data.js'

const table = document.querySelector('#table');

const prevOrder = data.slice(0);

const blockPag = document.querySelector('.pagination');

const maxCellOnPage = 10;


let currentPage = 1;




// Create table or update it

function createTable(update = true) {
    let tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    // Create data cell
    for (let i = (currentPage - 1) * maxCellOnPage; i < currentPage * maxCellOnPage; i++) {
        let tr = document.createElement('tr');
        tr.id = data[i].id;
        // Add data to the appropriate columns
        tr.append(createCell(data[i].name.firstName, 'firstName'));
        tr.append(createCell(data[i].name.lastName, 'lastName'));
        tr.append(createCell(data[i].about, 'about'));
        tr.append(createCell(data[i].eyeColor, 'eyeColor'));

        // Start change data cell
        tr.addEventListener('click', e => e.target.closest('td') && changeCell(data[i], e));

        tbody.append(tr);

    }

    function createCell(dataCell, dataType, show = true) {
        let td = document.createElement('td');
        td.setAttribute('data-type-cell', dataType);
        if (dataType.includes('eyeColor')) td.style.backgroundColor = dataCell;
        td.innerHTML = dataCell;
        return td;
    }

    // Create Pagination if  
    if (!update && data.length > maxCellOnPage) createPagination(tbody);

    // Hiding elements
    let hiddenColumns = document.querySelectorAll('.table__hidden.active');
    if (hiddenColumns) hiddenColumns.forEach(el => hideDataCell(el));

}

// Create table
createTable(false);


// Pagination 

function createPagination(tbody) {
    let allCountPage = Math.ceil(data.length / maxCellOnPage);
    blockPag.classList.add('show');
    blockPag.children[currentPage].classList.add('current');

    // Creating btns pagination(copy node and change attribute)
    for (let i = 3; i <= allCountPage; i++) {
        let btn = document.querySelector('#pag_1').cloneNode(true);
        btn.id = 'pag_' + i;
        btn.innerHTML = i;
        btn.classList.remove('current');
        blockPag.children[i].before(btn);
    }

    // Add event listener to the btns
    Array.from(blockPag.children).forEach(el => el.addEventListener('click', e => changePage(e.target.id.split('_')[1], allCountPage)))

}

function changePage(page, allCountPage = Math.ceil(data.length / maxCellOnPage)) {


    // Defining the next page
    let newPage = +page || (page === 'next' ? currentPage + 1 : currentPage - 1);

    // if page incorrect 
    if (newPage < 1) newPage = allCountPage;
    if (newPage > allCountPage) newPage = 1;


    blockPag.children[currentPage].classList.remove('current');
    blockPag.children[newPage].classList.add('current');

    currentPage = newPage;

    createTable();
}


// Sort

document.querySelector('#sortNameUp').addEventListener('click', (e) => sortBy(e.target.closest('button')));
document.querySelector('#sortLastUp').addEventListener('click', (e) => sortBy(e.target.closest('button')));
document.querySelector('#sortAboutUp').addEventListener('click', (e) => sortBy(e.target.closest('button')));
document.querySelector('#sortEyeUp').addEventListener('click', (e) => sortBy(e.target.closest('button')));
document.querySelector('#sortNameDown').addEventListener('click', (e) => sortBy(e.target.closest('button')));
document.querySelector('#sortLastDown').addEventListener('click', (e) => sortBy(e.target.closest('button')));
document.querySelector('#sortAboutDown').addEventListener('click', (e) => sortBy(e.target.closest('button')));
document.querySelector('#sortEyeDown').addEventListener('click', (e) => sortBy(e.target.closest('button')));



function sortBy(elem, updatePosChangeCell = false) {
    // Move on the first page after after
    if (!updatePosChangeCell) {
        changePage(1)
    };


    let param = elem.getAttribute('data-type-sort');


    let sortUp = elem.id.includes('Down') ? -1 : 1;

    // Going back to the original order
    if (elem.classList.contains('selected') && !updatePosChangeCell) {
        data.splice(0, data.length, ...prevOrder);
        elem.classList.remove('selected');
        createTable();
        return;
    }

    if (param.includes('Name')) {
        data.sort((a, b) => {
            if (a.name[param] > b.name[param]) {
                return 1 * sortUp;
            } else {
                if (a.name[param] === b.name[param]) { return 0 };
                return -1 * sortUp;
            }
        });
    } else {
        data.sort((a, b) => {
            if (a[param] > b[param]) {
                return 1 * sortUp;
            } else {
                if (a[param] === b[param]) { return 0 };
                return -1 * sortUp;
            }
        });
    }
    //  Delete the previous selection
    table.querySelectorAll('button.selected').forEach(el => el.classList.remove('selected'));

    // Add style for selected element
    elem.classList.add('selected');

    // Update table
    createTable();
}

// Change Cell

function changeCell(data, e) {
    //  Delete the previous selection
    document.querySelectorAll('.change__line').forEach(el => el.remove());

    // Add style for selected element
    let elem = e.target.closest('tr');
    elem.classList.add('select');

    // Create edit form
    let coverDiv = document.createElement('div');
    coverDiv.classList.add('cover');
    let div = createDivChange(data, elem);
    coverDiv.append(div);
    coverDiv.addEventListener('click', e => undoChange(e, coverDiv, elem));
    elem.append(coverDiv);

    // Coordinate form
    div.style.left = (elem.offsetLeft + elem.offsetWidth + 5) + 'px';
    div.style.opacity = '1';

};

function createDivChange(data, elem) {
    let div = document.createElement('div');
    div.classList.add('change__line');

    // Add data to the appropriate columns
    div.append(createInput(data.name.firstName, 'firstName'));
    div.append(createInput(data.name.lastName, 'lastName'));
    div.append(createInput(data.about, 'about', true));
    div.append(createInput(data.eyeColor, 'eyeColor'));

    // Add btn save
    let btnSave = document.createElement('button');
    btnSave.innerHTML = 'Save';

    btnSave.addEventListener('click', e => saveCellChange(div, data.id));
    div.append(btnSave);
    return div;
}

// Create columns for the form
function createInput(value, dataType, textarea = false) {
    let input = document.createElement('input');
    if (textarea) input = document.createElement('textarea');
    input.value = value;
    input.setAttribute('data-type-cell', dataType);
    return input;
}



function saveCellChange(div, id) {
    // Finding the index in JSON
    let index = data.findIndex(item => item.id === id);

    // Update value in JSON
    data[index].name.firstName = div.querySelector('[data-type-cell="firstName"]').value;
    data[index].name.lastName = div.querySelector('[data-type-cell="lastName"]').value;
    data[index].about = div.querySelector('[data-type-cell="about"]').value;
    data[index].eyeColor = div.querySelector('[data-type-cell="eyeColor"]').value;

    // Update table
    createTable();
    let selectSort = document.querySelector('.table__sort.selected');
    if (selectSort) sortBy(selectSort, true);

}

function undoChange(e, coverDiv, elem) {

    // if tap into edit form exit
    if (e.target.closest('.change__line')) return;

    elem.classList.remove('select');
    coverDiv.remove();
}


// hidden data cell

document.querySelectorAll('.table__hidden').forEach(el => el.addEventListener('click', e => hideDataCell(el, e)))

function hideDataCell(btn, e = null) {
    if (e) btn.classList.toggle('active');
    let param = btn.getAttribute('data-type-hidden');
    document.querySelectorAll('[data-type-cell="' + param + '"]').forEach(el => el.classList.toggle('hidden'));

}