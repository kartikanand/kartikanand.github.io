var onDisplay = document.getElementById('section-0');

window.onload = function () {

    var buttons = document.getElementsByClassName('btn');
    for (var i=0; i<buttons.length; i++) {
        addEventListenerToSection(buttons, i);
    }
}

function addEventListenerToSection (buttons, i) {
    buttons[i].addEventListener('click', function (event) {
        event.preventDefault();
        onDisplay.style.display = 'none';
        document.getElementById('section-'+i).style.display = "block";
        onDisplay = document.getElementById('section-'+i);
    }, false);
}