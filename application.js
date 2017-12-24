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
  const ideaElement = event.target.parentElement;
  const ideaId = ideaElement.dataset.ideaId;
  const confirmation = window.confirm('Are you sure you want to delete this idea?');
  if (confirmation) {
    fetch(`${apiUrl}/ideas/${ideaId}`, { method: 'delete' })
      .then(ideaElement.remove());
  }
};

const addEventListeners = () => {
  const newIdeaButton = document.getElementById('new-idea-button');
  const cancelNewIdeaButton = document.querySelector('.idea-cancel-button');
  const ideasDeleteButtons = document.querySelectorAll('.idea-delete-button');

  newIdeaButton.addEventListener('click', toggleNewIdeaForm);
  cancelNewIdeaButton.addEventListener('click', toggleNewIdeaForm);
  ideasDeleteButtons.forEach(button => button.addEventListener('click', deleteIdea));
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
