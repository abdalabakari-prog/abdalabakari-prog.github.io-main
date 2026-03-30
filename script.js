const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const errorMessage = document.getElementById('error-message');

const wordEl = document.getElementById('word');
const phoneticEl = document.getElementById('phonetic');
const audioEl = document.getElementById('audio');
const definitionsEl = document.getElementById('definitions');
const synonymsEl = document.getElementById('synonyms');

form.addEventListener('submit', handleSearch);

function handleSearch(event) {
  event.preventDefault();
  const word = input.value.trim();

  if (!word) {
    displayError('Please enter a word.');
    return;
  }

  fetchWord(word);
}

function fetchWord(word) {
  clearResults();

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Word not found');
      }
      return response.json();
    })
    .then(data => displayResults(data[0]))
    .catch(() => displayError('Word not found. Please try another.'));
}

function displayResults(data) {
  errorMessage.classList.add('hidden');

  wordEl.textContent = data.word;
  phoneticEl.textContent = data.phonetic || '';

  // Audio
  const audioSource = data.phonetics.find(p => p.audio);
  if (audioSource) {
    audioEl.src = audioSource.audio;
    audioEl.classList.remove('hidden');
  } else {
    audioEl.classList.add('hidden');
  }

  // Definitions
  data.meanings.forEach(meaning => {
    meaning.definitions.forEach(def => {
      const p = document.createElement('p');
      p.textContent = `${meaning.partOfSpeech}: ${def.definition}`;
      definitionsEl.appendChild(p);
    });
  });

  // Synonyms
  const synonyms = data.meanings.flatMap(m => m.synonyms || []);
  if (synonyms.length > 0) {
    synonymsEl.textContent = `Synonyms: ${synonyms.join(', ')}`;
  }
}

function displayError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

function clearResults() {
  wordEl.textContent = '';
  phoneticEl.textContent = '';
  definitionsEl.innerHTML = '';
  synonymsEl.textContent = '';
  audioEl.classList.add('hidden');
}

