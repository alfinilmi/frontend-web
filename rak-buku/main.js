const bookshelf = [];
const RENDER_EVENT = 'render-bookshelf';

const SAVED_EVENT = 'saved-bookshelf';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateId() {
  return +new Date();
}

function generateBookshelfObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}

function findBook(bookId) {
  for (const bookshelfItem of bookshelf) {
    if (bookshelfItem.id === bookId) {
      return bookshelfItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in bookshelf) {
    if (bookshelf[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelf);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const bs of data) {
      bookshelf.push(bs);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}


function makeBookshelf(bookshelfObject) {

  const {id, title, author, year, isComplete} = bookshelfObject;

  const textTitle = document.createElement('h3');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = author;

  const textYear = document.createElement('p');
  textYear.innerText = year;

  const divAction = document.createElement('div');
  divAction.classList.add('action');

  const container = document.createElement('article');
  container.classList.add('book_item');
  container.append(textTitle, textAuthor, textYear, divAction);

  if (isComplete) {

    const btnBelumSelesai = document.createElement('button');
    btnBelumSelesai.classList.add('green');
    btnBelumSelesai.innerText = 'Belum selesai dibaca';
    btnBelumSelesai.setAttribute('id', id);
    btnBelumSelesai.addEventListener('click', function () {
      undoBookFromCompleted(id);
    });

    const btnHapus = document.createElement('button');
    btnHapus.classList.add('red');
    btnHapus.innerText = 'Hapus Buku';
    btnHapus.setAttribute('id', id);
    btnHapus.addEventListener('click', function () {
      removeBook(id);
    });

    divAction.append(btnBelumSelesai, btnHapus);
  } else {

    const btnSelesai = document.createElement('button');
    btnSelesai.classList.add('green');
    btnSelesai.innerText = 'Selesai Dibaca';
    btnSelesai.setAttribute('id', id);
    btnSelesai.addEventListener('click', function () {
      addBookToCompleted(id);
    });

    const btnHapus = document.createElement('button');
    btnHapus.classList.add('red');
    btnHapus.innerText = 'Hapus Buku';
    btnHapus.setAttribute('id', id);
    btnHapus.addEventListener('click', function () {
      removeBook(id);
    });

    divAction.append(btnSelesai, btnHapus);
  }
  return container;
}

function addBook() {
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const status = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const bookshelfObject = generateBookshelfObject(generatedID, title, author, year, status);
  bookshelf.push(bookshelfObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToCompleted(bookId) {

  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  let text = "Apakah anda yakin ingin menghapus buku ini?";
  if (confirm(text) == true) {
	const bookTarget = findBookIndex(bookId);

	if (bookTarget === -1) return;

	bookshelf.splice(bookTarget, 1);
	document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
  } else {

  }
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedList = document.getElementById('incompleteBookshelfList');
  const listCompleted = document.getElementById('completeBookshelfList');

  uncompletedList.innerHTML = '';
  listCompleted.innerHTML = '';


  for (const bookshelfItem of bookshelf) {
    const bookElement = makeBookshelf(bookshelfItem);
    if (bookshelfItem.isComplete) {
      listCompleted.append(bookElement);
    } else {
      uncompletedList.append(bookElement);
    }
  }

});