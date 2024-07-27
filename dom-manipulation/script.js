const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

//create an array to hold quotes
const quotes = [
  { text: "Keep calm and carry on.", category: "Life" },
  { text: "There is no perfection, only life.", category: "Wise" },
  { text: "Happiness shared is happiness doubled.", category: "Happy" },
];

// export quotes as JSON
function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
//  import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.length = 0; // Clear existing quotes
                quotes.push(...importedQuotes);
                saveQuotes(); // Save to local storage
                alert('Quotes imported successfully!');
                showRandomQuote(); // Optionally show a quote after import
            } else {
                alert('Invalid file format.');
            }
        } catch (e) {
            alert('Error importing quotes.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}


//From session storage display last viewed quote
function displayLastViewedQuote() {
    const lastQuote = sessionStorage.getItem('lastQuote');
    if (lastQuote) {
        document.getElementById('quoteDisplay').innerHTML = lastQuote;
    }
}
//Implement functions to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" - <strong>${quote.category}</strong>`;
  sessionStorage.setItem('lastQuote', quoteHtml);
}
//function to create and display add quote form
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteFormContainer");

  // Create form elements using createElement and appendChild
  const div = document.createElement("div");

  const inputQuote = document.createElement("input");
  inputQuote.id = "newQuoteText";
  inputQuote.type = "text";
  inputQuote.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const button = document.createElement("button");
  button.id = "addQuote";
  button.textContent = "Add Quote";

  // Append elements to the div
  div.appendChild(inputQuote);
  div.appendChild(inputCategory);
  div.appendChild(button);

  // Append div to formContainer
  formContainer.appendChild(div);

  // Attach event listener to the add quote button
  document.getElementById("addQuote").addEventListener("click", addQuote);
}
//load quotes from local storage
function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes.push(...JSON.parse(savedQuotes));
    }
}
//save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function saveSelectedCategory() {
    const categoryFilter = document.getElementById("categoryFilter").value;
    localStorage.setItem('selectedCategory', categoryFilter);
}

//save and restore the last selected category
function loadSelectedCategory() {
    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory) {
        document.getElementById("categoryFilter").value = selectedCategory;
        filterQuotes();
    }
}

document.getElementById("categoryFilter").addEventListener("change", saveSelectedCategory);

// Populate categories 
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    // Clear existing options except for "All Categories"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Add unique categories to the dropdown
    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}


//fetch quotes from server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(serverUrl);
        const serverQuotes = await response.json();
        return serverQuotes;
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        return [];
    }
}

//  sync local quotes with server
async function syncQuotesWithServer() {
    const serverQuotes = await fetchQuotesFromServer();

    // Merge server quotes with local quotes, giving precedence to server quotes
    const mergedQuotes = [...serverQuotes, ...quotes.filter(localQuote => 
        !serverQuotes.some(serverQuote => serverQuote.text === localQuote.text)
    )];

    quotes.length = 0;
    quotes.push(...mergedQuotes);
    saveQuotes();
}


// create a function to post new quotes to the server
async function postQuoteToServer(quote) {
    try {
        await fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quote),
        });
    } catch (error) {
        console.error('Error posting quote to server:', error);
    }
}


//Add new quotes
 async function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("New quote added successfully!");
  } else {
    alert(" Enter both quote text and category.");
  }
}

function filterQuotes() {
    const categoryFilter = document.getElementById("categoryFilter").value;
    const filteredQuotes = categoryFilter === "all" 
        ? quotes 
        : quotes.filter(quote => quote.category === categoryFilter);
    
    displayQuotes(filteredQuotes);
}

function displayQuotes(quotesToDisplay) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";

    quotesToDisplay.forEach(quote => {
        const quoteElement = document.createElement("p");
        quoteElement.innerHTML = `"${quote.text}" - <strong>${quote.category}</strong>`;
        quoteDisplay.appendChild(quoteElement);
    });
}

//user  notified of data updates
function notifyUser(message) {
    alert(message);
}

//sync 
setInterval(async () => {
    await syncQuotesWithServer();
    notifyUser('Quotes synced with server!');
}, 30000);


// add an event listener
window.onload = function () {
  loadQuotes();
  displayLastViewedQuote();
  createAddQuoteForm();
  populateCategories();
  loadSelectedCategory();
  document.getElementById("newQuote") .addEventListener("click", showRandomQuote);
  document.getElementById("importQuotes").addEventListener("change", importFromJsonFile);
  document.getElementById("exportQuotes").addEventListener("click", exportQuotes);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  syncQuotesWithServer();
};

// Initialize the add quote form
createAddQuoteForm();
