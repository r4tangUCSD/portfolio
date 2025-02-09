import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects, renderProjectCount} from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

let rolledData = d3.rollups(
    projects,
    (v) => v.length,
    (d) => d.year,
);

let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
});

let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let arcs = arcData.map((d) => arcGenerator(d));

let colors = d3.scaleOrdinal(d3.schemeSet1);

function renderPieChart(projectsGiven) {
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));

    d3.select('svg').selectAll('path').remove();
    newArcs.forEach((arc, idx) => {
        d3.select('svg')
        .append('path')
        .attr('d', arc)
        .attr('fill', colors(idx))
        .on('click', () => {
            selectedIndex = selectedIndex === idx ? -1 : idx;
            d3.select('svg')
                .selectAll('path')
                .attr('class', (_, i) => {
                    if (i === selectedIndex) {
                        return 'selected'; // Highlight the selected pie slice
                    }
                        return null; // Remove the class if not selected
                    });
            d3.select('.legend')
                .selectAll('li')
                .attr('class', (_, i) => {
                    if (i === selectedIndex) {
                        return 'selected'; // Highlight the selected pie slice
                    }
                    return null; // Remove the class if not selected
                });
            if (selectedIndex === -1) {
                renderProjects(projects, projectsContainer, 'h2');
            } else {
                let selectedYear = data[selectedIndex]?.label;
                let filteredProjects = projects.filter(project => project.year === selectedYear);
                renderProjects(filteredProjects, projectsContainer, 'h2');
            }
        })
    })

    let legend = d3.select('.legend');
    legend.selectAll('*').remove();
    newData.forEach((d, idx) => {
        legend.append('li')
            .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
    })
}

renderPieChart(projects);

let selectedIndex = -1;
let svg = d3.select('svg');
let legend = d3.select('.legend');
svg.selectAll('path').remove();
arcs.forEach((arc, i) => {
    svg
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(i))
    .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        svg
            .selectAll('path')
            .attr('class', (_, idx) => {
                if (idx === selectedIndex) {
                    return 'selected'; // Highlight the selected pie slice
                }
                    return null; // Remove the class if not selected
                });
        legend
            .selectAll('li')
            .attr('class', (_, idx) => {
                if (idx === selectedIndex) {
                    return 'selected'; // Highlight the selected pie slice
                }
                return null; // Remove the class if not selected
            });
        if (selectedIndex === -1) {
            renderProjects(projects, projectsContainer, 'h2');
        } else {
            let selectedYear = data[selectedIndex]?.label;
            let filteredProjects = projects.filter(project => project.year === selectedYear);
            renderProjects(filteredProjects, projectsContainer, 'h2');
        }
    });
});

let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('change', (event) => {
  // update query value
  query = event.target.value;
  // filter projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  // render filtered projects
  selectedIndex = -1;
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

renderProjectCount(projects); 
renderProjects(projects, projectsContainer, 'h2');