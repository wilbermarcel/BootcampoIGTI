window.addEventListener('load', start);

function addStyle(styles) {
    var css = document.createElement('style');
    css.type = 'text/css';

    if (css.styleSheet) css.styleSheet.cssText = styles;
    else css.appendChild(document.createTextNode(styles));

    document.getElementsByTagName('head')[0].appendChild(css);
}

function start(event) {
    function setValueInput(event) {
        if (event.target.id === 'myRangeRed') {
            var myInputRed = document.querySelector('#myInputRed');
            myInputRed.value = myRangeRed.value;
        } else if (event.target.id === 'myRangeGreen') {
            var myInputGreen = document.querySelector('#myInputGreen');
            myInputGreen.value = myRangeGreen.value;
        } else if (event.target.id === 'myRangeBlue') {
            var myInputBlue = document.querySelector('#myInputBlue');
            myInputBlue.value = myRangeBlue.value;
        }

        var style =
            '#mySquareRGB {background-color:rgb(' +
            myRangeRed.value +
            ',' +
            myRangeGreen.value +
            ',' +
            myRangeBlue.value +
            ');}';
        addStyle(style);
    }
    event.preventDefault();
    console.log('Todos os recursos terminaram o carregamento!');

    var myRangeRed = document.querySelector('#myRangeRed');
    var myRangeGreen = document.querySelector('#myRangeGreen');
    var myRangeBlue = document.querySelector('#myRangeBlue');

    myRangeRed.addEventListener('change', setValueInput);
    myRangeGreen.addEventListener('change', setValueInput);
    myRangeBlue.addEventListener('change', setValueInput);
}
