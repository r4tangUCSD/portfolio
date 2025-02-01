import { fetchJSON, renderProjects, renderProjectCount} from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjectCount(projects); 
renderProjects(projects, projectsContainer, 'h2');