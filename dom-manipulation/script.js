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
//Add new quotes
function addQuote() {
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
// add an event listener
window.onload = function () {
  loadQuotes();
  displayLastViewedQuote();
  document.getElementById("newQuote") .addEventListener("click", showRandomQuote);
};

// Initialize the add quote form
createAddQuoteForm();
