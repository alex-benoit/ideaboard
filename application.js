const apiUrl = 'https://ideaboard-rails-api.herokuapp.com';
const containerId = 'ideas-container';

const buildIdea = (id, title, body) => {
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
    <div class="idea">
      <h3><input type="text"></h3>
      <p><input type="text"></p>
    </div>
  `;
};

const fetchIdeas = () => {
  const container = document.getElementById(containerId);
  let ideas = '';
  ideas += buildBlankIdea();
  fetch(`${apiUrl}/ideas`)
    .then(response => response.json())
    .then((data) => {
      data.forEach((idea) => {
        ideas += buildIdea(idea.id, idea.title, idea.body);
      });
      container.innerHTML = ideas;
    });
};

document.addEventListener('DOMContentLoaded', fetchIdeas);
