document.querySelectorAll('.day-column').forEach(column => {
  const list = column.querySelector('.task-list');
  const input = column.querySelector('input[type="text"]');
  const dateInput = column.querySelector('.task-date');
  const timeInput = column.querySelector('.task-time');
  const button = column.querySelector('button');
  const progressFill = column.querySelector('.progress-fill');

  if(!list || !input || !button) return;

  const day = column.dataset.day;
  const savedTasks = JSON.parse(localStorage.getItem(day)) || [];
  savedTasks.forEach(task => addTask(task.text, task.date, task.time, task.checked));

  updateProgress();

  button.addEventListener('click', () => {
    const text = input.value.trim();
    if(text){
      addTask(text, dateInput.value, timeInput.value, false);
      input.value = '';
      dateInput.value = '';
      timeInput.value = '';
      saveTasks();
      updateProgress();
    }
  });

  input.addEventListener('keypress', e => {
    if(e.key === 'Enter') button.click();
  });

  function addTask(text, date, time, checked) {
    const li = document.createElement('li');

    li.innerHTML = `
      <div class="task-header">
        <span>${text}</span>
        <input type="checkbox" ${checked ? 'checked' : ''}>
      </div>
      <div class="task-dropdown">
        ${date || time ? `<small>${date} ${time}</small>` : ''}
        <div style="display:flex;gap:5px;margin-top:4px">
          <button class="done">${checked ? 'Undo' : 'Done'}</button>
          <button class="edit">Edit</button>
          <button class="remove">Remove</button>
        </div>
      </div>
    `;

    const header = li.querySelector('.task-header');
    const dropdown = li.querySelector('.task-dropdown');
    const checkbox = li.querySelector('input[type="checkbox"]');
    const doneBtn = li.querySelector('.done');
    const removeBtn = li.querySelector('.remove');
    const editBtn = li.querySelector('.edit');

    // Toggle dropdown smoothly
    header.addEventListener('click', () => {
      li.classList.toggle('show-dropdown');
    });

    // Checkbox change
    checkbox.addEventListener('change', () => {
      li.classList.toggle('checked');
      doneBtn.textContent = checkbox.checked ? 'Undo' : 'Done';
      saveTasks();
      updateProgress();
    });

    // Done/Undo button
    doneBtn.addEventListener('click', e => {
      e.stopPropagation();
      checkbox.checked = !checkbox.checked;
      li.classList.toggle('checked');
      doneBtn.textContent = checkbox.checked ? 'Undo' : 'Done';
      saveTasks();
      updateProgress();
    });

    // Remove task
    removeBtn.addEventListener('click', e => {
      e.stopPropagation();
      list.removeChild(li);
      saveTasks();
      updateProgress();
    });

    // Edit task
    editBtn.addEventListener('click', e => {
      e.stopPropagation();
      const newText = prompt('Edit task', header.querySelector('span').textContent);
      if(newText) {
        header.querySelector('span').textContent = newText;
        saveTasks();
      }
    });

    if(checked) li.classList.add('checked');
    list.appendChild(li);
  }

  function saveTasks(){
    const tasks = Array.from(list.querySelectorAll('li')).map(li => {
      const checkbox = li.querySelector('input[type="checkbox"]');
      const text = li.querySelector('span').textContent;
      const info = li.querySelector('small') ? li.querySelector('small').textContent.split(' ') : [];
      return {
        text: text,
        date: info[0] || '',
        time: info[1] || '',
        checked: checkbox.checked
      };
    });
    localStorage.setItem(day, JSON.stringify(tasks));
  }

  function updateProgress(){
    const total = list.querySelectorAll('li').length;
    const done = list.querySelectorAll('li input:checked').length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    progressFill.style.width = percent + '%';
  }
});

// Fade-in on page load
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('fade-in');
});

// Back button with fade-out before redirect
const backButton = document.getElementById('backButton');
backButton.addEventListener('click', () => {
  document.body.classList.remove('fade-in'); // trigger fade-out
  setTimeout(() => {
    window.location.href = 'index.html'; // back to welcome page
  }, 500); // match half a second for smooth fade
});


// Notes persistence
const notesArea = document.querySelector('.notes-column textarea');
const savedNotes = localStorage.getItem('weeklyNotes');
if(savedNotes) notesArea.value = savedNotes;

notesArea.addEventListener('input', () => {
  localStorage.setItem('weeklyNotes', notesArea.value);
});

// Back button functionality
const backBtn = document.getElementById('backButton');
if(backBtn) {
  backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}
