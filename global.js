console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let navLinks = $$("nav a")
let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname
);

if (currentLink) {
  currentLink.classList.add('current');
}

let pages = [
  { url: '', title: 'Home'},
  { url: 'projects/', title: 'Projects'},
  { url: 'contact/', title: 'Contact'},
  { url: 'resume/', title: 'Resume'},
  { url: 'https://github.com/r4tangUCSD', title: 'GitHub'}
];

let nav = document.createElement('nav');
document.body.prepend(nav)

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  if (!ARE_WE_HOME && !url.startsWith('http')) {
    url = '../' + url;
  }

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }
  if (a.host !== location.host) {
    a.target = "_blank";
  }

  nav.append(a);
}

if ('colorScheme' in localStorage) {
  document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
			<option>Automatic</option>
      <option>Light</option>
      <option>Dark</option>
		</select>
	</label>`
);

let select = document.querySelector("select");
select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value;
});