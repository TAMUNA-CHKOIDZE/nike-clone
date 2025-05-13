// header and footer components
export function loadComponent(id, file, callback) {
  fetch(file)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById(id).innerHTML = html;
      if (callback) callback(); 
    });
}