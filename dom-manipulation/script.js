//create an array to hold quotes
const quotes = [
    {text:"Keep calm and carry on.",category:"Life"}, 
    {text:"There is no perfection, only life.", category:"Wise"},
    {text:"Happiness shared is happiness doubled.", category:"Happy"},
];
//Implement functions to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
  }
//function to create and display add quote form
function createAddQuoteForm() {
    const formContainer = document.getElementById('addQuoteFormContainer');
  
    //  input for new quote text
    const newQuoteTextInput = document.createElement('input');
    newQuoteTextInput.id = 'newQuoteText';
    newQuoteTextInput.type = 'text';
    newQuoteTextInput.placeholder = 'Enter a new quote';
    formContainer.appendChild(newQuoteTextInput);
  
    //  input for new quote category
    const newQuoteCategoryInput = document.createElement('input');
    newQuoteCategoryInput.id = 'newQuoteCategory';
    newQuoteCategoryInput.type = 'text';
    newQuoteCategoryInput.placeholder = 'Enter quote category';
    formContainer.appendChild(newQuoteCategoryInput);
  
    //  button to add the new quote
    const addQuoteButton = document.createElement('button');
    addQuoteButton.id = 'addQuote';
    addQuoteButton.textContent = 'Add Quote';
    formContainer.appendChild(addQuoteButton);
  
    // Attach event listener to the add quote button
    addQuoteButton.addEventListener('click', addQuote);
  }
  //Add new quotes
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      alert('New quote added successfully!');
    } else {
      alert(' Enter both quote text and category.');
    }
  }
  // add an event listener 
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initialize the add quote form
createAddQuoteForm();
  