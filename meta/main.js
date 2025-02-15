let data = [];

async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
        ...row,
        line: Number(row.line), // or just +row.line
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + 'T00:00' + row.timezone),
        datetime: new Date(row.datetime),
    }));
    displayStats() 
    processCommits();
    //console.log(commits);
    createScatterplot();
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
});

let commits = d3.groups(data, (d) => d.commit);

function processCommits() {
    commits = d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: 'https://github.com/vis-society/lab-7/commit/' + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };
  
        Object.defineProperty(ret, 'lines', {
          value: lines,
          // What other options do we need to set?
          // Hint: look up configurable, writable, and enumerable
        });
  
        return ret;
    });
}

function displayStats() {
    processCommits();
  
    d3.select('#stats').append('h1').html("Summary Stats");
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');



    function addStat(title, value) {
        const statItem = dl.append('div').attr('class', 'stat-item');
        statItem.append('dt').html(title);
        statItem.append('dd').text(value);
    }

    addStat('Total <abbr title="Lines of code">LOC</abbr>', data.length);

    addStat('Total commits', commits.length);

    addStat('Average Line Length', d3.mean(data, d => d.length).toFixed(2));

    addStat('Deepest Line', d3.max(data, d => d.depth));
    
    const workByPeriod = d3.rollups(
        data,
        v => v.length,
        d => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' })
    );
    const maxPeriod = d3.greatest(workByPeriod, d => d[1])?.[0];

    addStat('Most Work Done During', maxPeriod);
}

function createScatterplot() {
    const width = 1000;
    const height = 600;

    const xScale = d3
    .scaleTime()
    .domain(d3.extent(commits, (d) => d.datetime))
    .range([0, width])
    .nice();

    const yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);

    const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

    const dots = svg.append('g').attr('class', 'dots');

    dots
    .selectAll('circle')
    .data(commits)
    .join('circle')
    .attr('cx', (d) => xScale(d.datetime))
    .attr('cy', (d) => yScale(d.hourFrac))
    .attr('r', 5)
    .attr('fill', 'steelblue');
}
