// TODO validation on forms?
// const apiUrl = 'https://ideaboard-rails-api.herokuapp.com';
const apiUrl = 'http://localhost:3000';
const containerId = 'ideas-container';

const buildIdea = ({ id, title, body }) => {
  return `
    <div data-idea-id="${id}" class="idea">
      <input type="text" class="idea-title" value="${title}">
      <textarea class="idea-body" rows="5">${body}</textarea>
      <button class="idea-delete-button">Delete</button>
    </div>
  `;
};

const buildBlankIdea = () => {
  return `
    <div class="idea new-idea-container">
      <div class="flex-center full" id="new-idea-button">
        <span>Add New Idea</span>
      </div>
      <div class="hidden" id="new-idea-form">
        <input type="text" class="idea-title" placeholder="Product Hunt">
        <textarea class="idea-body" rows="5" placeholder="Daily curation of the best new products"></textarea>
        <button class="idea-save-button">Save</button>
        <button class="idea-cancel-button">Cancel</button>
      </div>
    </div>
  `;
};

const toggleNewIdeaForm = () => {
  const newIdeaForm = document.getElementById('new-idea-form');
  const newIdeaButton = document.getElementById('new-idea-button');

  newIdeaForm.classList.toggle('hidden');
  newIdeaButton.classList.toggle('hidden');

  const ideaTitleInput = document.querySelector('.idea-title');
  ideaTitleInput.focus();
};

const deleteIdea = (event) => {
  if (!event.target.classList.contains('idea-delete-button')) {
    return;
  }
  const ideaElement = event.target.parentElement;
  const ideaId = ideaElement.dataset.ideaId;
  const confirmation = window.confirm('Are you sure you want to delete this idea?');
  if (confirmation) {
    fetch(`${apiUrl}/ideas/${ideaId}`, { method: 'delete' })
      .then(ideaElement.remove());
  }
};

const createIdea = () => {
  const newIdeaTitle = document.querySelector('.idea-title').value;
  const newIdeaBody = document.querySelector('.idea-body').value
  const requestBody = JSON.stringify({ title: newIdeaTitle, body: newIdeaBody })

  fetch(`${apiUrl}/ideas`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    body: requestBody
  })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
    });
};

const addEventListeners = () => {
  const newIdeaButton = document.getElementById('new-idea-button');
  newIdeaButton.addEventListener('click', toggleNewIdeaForm);

  const cancelNewIdeaButton = document.querySelector('.idea-cancel-button');
  cancelNewIdeaButton.addEventListener('click', toggleNewIdeaForm);

  const ideasContainer = document.getElementById('ideas-container');
  ideasContainer.addEventListener('click', deleteIdea);

  const saveNewIdeaButton = document.querySelector('.idea-save-button');
  saveNewIdeaButton.addEventListener('click', createIdea);
};

const fetchIdeas = () => {
  const container = document.getElementById(containerId);
  let ideas = '';
  ideas += buildBlankIdea();
  fetch(`${apiUrl}/ideas`)
    .then(response => response.json())
    .then((data) => {
      data.forEach((idea) => {
        ideas += buildIdea(idea);
      });
      container.innerHTML = ideas;
      addEventListeners();
    });
};

document.addEventListener('DOMContentLoaded', fetchIdeas);
