(function () {
    var currentDisplayElement = document.getElementById('home');
    var changeSection = function () {
        var currentPath = window.location.hash;

        var targetElementId = currentPath.replace(/^#\/?|\/$/g, '').split('/')[0];

        console.log(targetElementId);

        if (targetElementId) {
            console.log("true");
            targetElement = document.getElementById(targetElementId);
        } else {
            console.log("false");
            targetElement = document.getElementById('home');
        }

        if (!targetElement) return;
        if (currentDisplayElement == targetElement) return;

        targetElement.style.display = 'block';
        currentDisplayElement.style.display = 'none';
        currentDisplayElement = targetElement;        
    };

    window.onhashchange = changeSection;
    window.onload = changeSection;
}());
