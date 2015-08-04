window.onload = function () {

    var buttons = document.getElementsByClassName('btn');
    for (var i=0; i<buttons.length; i++) {
        addEventListenerToSection(buttons, i);
    }
}

function hideSections () {
    var sections = document.getElementsByClassName("hidden-section");

    for (var i=0; i<sections.length; i++) {
        sections[i].style.display = "none";
    }
}

function addEventListenerToSection (buttons, i) {
    buttons[i].addEventListener('click', function (event) {
        event.preventDefault();
        hideSections(); // To hide previously displayed section
        document.getElementById('section-'+i).style.display = "block";
    }, false);
}