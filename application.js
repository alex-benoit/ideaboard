// TODO validation on forms?
// TODO responsive
// TODO no update if input textarea is empty
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
        <input type="text" class="new-idea-title" placeholder="Product Hunt">
        <textarea class="new-idea-body" rows="5" placeholder="Daily curation of the best new products"></textarea>
        <button class="idea-save-button">Save</button>
        <button class="idea-cancel-button">Cancel</button>
      </div>
    </div>
  `;
};

const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(`${response.statusText} (${response.status})`);
  }
  return response;
};

const notify = (message, error) => {
  const notificationsContianer = document.querySelector('.note-container');
  notificationsContianer.innerHTML = `<div class='note${error ? ' error' : ''}'>${message}<div>`;
};

const toggleNewIdeaForm = () => {
  const newIdeaForm = document.getElementById('new-idea-form');
  const newIdeaButton = document.getElementById('new-idea-button');

  newIdeaForm.classList.toggle('hidden');
  newIdeaButton.classList.toggle('hidden');

  const ideaTitleInput = document.querySelector('.new-idea-title');
  ideaTitleInput.focus();
};

const createIdea = () => {
  const newIdeaTitle = document.querySelector('.new-idea-title');
  const newIdeaBody = document.querySelector('.new-idea-body');
  const newIdeaContainer = document.querySelector('.new-idea-container');
  const requestBody = JSON.stringify({ title: newIdeaTitle.value, body: newIdeaBody.value });

  fetch(`${apiUrl}/ideas`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: requestBody
  })
    .then(handleErrors)
    .then(response => response.json())
    .then((data) => {
      newIdeaContainer.insertAdjacentHTML('afterend', buildIdea(data));
      newIdeaTitle.value = '';
      newIdeaBody.value = '';
      toggleNewIdeaForm();
      notify(`${data.title} created successfully!`, false);
    })
    .catch(error => notify(error, true));
};

const getUpdateRequestBody = (event) => {
  if (event.target.classList.contains('idea-title')) {
    return JSON.stringify({ title: event.target.value });
  } else if (event.target.classList.contains('idea-body')) {
    return JSON.stringify({ body: event.target.value });
  }
};

const updateIdea = (event) => {
  if (!event.target.classList.contains('idea-title') && !event.target.classList.contains('idea-body')) {
    return;
  }

  const ideaElement = event.target.parentElement;
  const ideaId = ideaElement.dataset.ideaId;
  const requestBody = getUpdateRequestBody(event);

  fetch(`${apiUrl}/ideas/${ideaId}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'PATCH',
    body: requestBody
  })
    .then(handleErrors)
    .then(response => response.json())
    .then(data => notify(`${data.title} updated successfully!`, false))
    .catch(error => notify(error, true));
};

const deleteIdea = (event) => {
  if (!event.target.classList.contains('idea-delete-button')) {
    return;
  }

  const ideaElement = event.target.parentElement;
  const ideaId = ideaElement.dataset.ideaId;
  const confirmation = window.confirm('Are you sure you want to delete this idea?');

  if (confirmation) {
    fetch(`${apiUrl}/ideas/${ideaId}`, {
      method: 'DELETE'
    })
      .then(handleErrors)
      .then(response => response.json())
      .then((data) => {
        ideaElement.remove();
        notify(`${data.title} deleted successfully!`, false);
      })
      .catch(error => notify(error, true));
  }
};

const handleFilterChange = (event) => {
  fetchIdeas(event.target.selectedOptions[0].value);
};

const addEventListeners = () => {
  const newIdeaButton = document.getElementById('new-idea-button');
  newIdeaButton.addEventListener('click', toggleNewIdeaForm);

  const cancelNewIdeaButton = document.querySelector('.idea-cancel-button');
  cancelNewIdeaButton.addEventListener('click', toggleNewIdeaForm);

  const ideasContainer = document.getElementById('ideas-container');
  ideasContainer.addEventListener('click', deleteIdea);
  ideasContainer.addEventListener('focusout', updateIdea);

  const saveNewIdeaButton = document.querySelector('.idea-save-button');
  saveNewIdeaButton.addEventListener('click', createIdea);

  const filterSelect = document.getElementById('filter-select');
  filterSelect.addEventListener('change', handleFilterChange);
};


const fetchIdeas = (order) => {
  const container = document.getElementById(containerId);
  let ideas = '';
  ideas += buildBlankIdea();
  fetch(`${apiUrl}/ideas?order=${order}`)
    .then(handleErrors)
    .then(response => response.json())
    .then((data) => {
      data.forEach((idea) => {
        ideas += buildIdea(idea);
      });
      container.innerHTML = ideas;
      addEventListeners();
    })
    .catch(error => notify(error, true));
};

document.addEventListener('DOMContentLoaded', () => fetchIdeas('created_at'));
