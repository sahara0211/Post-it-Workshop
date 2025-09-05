const NOTE_STORE = 'sticky-notes:v1';
const THEME_KEY = 'sticky-notes:theme';

const noteInput = document.getElementById('new-note-input');
const addButton = document.getElementById('add-note-button');
const notesContainer = document.getElementById('notes-container');
const toggleThemeButton = document.getElementById('toggle-theme-button');

const COLORS = ['note-yellow', 'note-blue', 'note-pink', 'note-green'];

const uid = () => crypto ? Math.random() : 0;

function loadNotes() {
    try {
        const raw = localStorage.getItem(NOTE_STORE);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveNotes(notes) {
    localStorage.setItem(NOTE_STORE, JSON.stringify(notes));
}

let state = loadNotes();

function render() {
    notesContainer.innerHTML = '';
    if (!state.length) {
        notesContainer.innerHTML = '<p>No hay notas. Crea la primera</p>';
        return;
    }
    for (const note of state) {
        const card = document.createElement('div');
        card.className = 'note ' + (note.color || COLORS[0]);
        card.dataset.id = note.id;

        const del = document.createElement('button');
        del.className = 'delete-btn';
        del.textContent = '✕';
        del.addEventListener('click', () => deleteNote(note.id));

        const content = document.createElement('div');
        content.className = 'content';
        content.textContent = note.text;

        card.appendChild(del);
        card.appendChild(content);

        card.addEventListener('dblclick', () => startEditing(card, note));
        notesContainer.appendChild(card);
    }
}

function addNote(text) {
    const t = text.trim();
    if (!t) return;
    const newNote = { id: uid(), text: t, color: COLORS[Math.floor(Math.random() * COLORS.length)] };
    state.unshift(newNote);
    saveNotes(state);
    render();
}

function deleteNote(id) {
    state = state.filter(n => n.id !== id);
    saveNotes(state);
    render();
}

function updateNote(id, text) {
    state = state.map(n => n.id === id ? {...n, text } : n);
    saveNotes(state);
    render();
}

function startEditing(card, note) {
    card.classList.add('editing');
    card.innerHTML = '';
    const textarea = document.createElement('textarea');
    textarea.value = note.text;
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn';
    saveBtn.textContent = 'Guardar';
    saveBtn.addEventListener('click', () => updateNote(note.id, textarea.value));
    card.appendChild(textarea);
    card.appendChild(saveBtn);
    textarea.focus();
}

noteInput.addEventListener('input', () => {
    addButton.disabled = noteInput.value.trim() === '';
});
addButton.addEventListener('click', () => {
    addNote(noteInput.value);
    noteInput.value = '';
    addButton.disabled = true;
});

toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem(THEME_KEY, document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

if (localStorage.getItem(THEME_KEY) === 'dark') {
    document.body.classList.add('dark-mode');
}

render();