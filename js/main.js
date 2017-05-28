var sets = new Array();
var universe = new Set();

$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

function validate() {
    let valid = true;
    let input = $("#set");
    let value = input.val();
    for (let i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) >= 65 + sets.length && value.charCodeAt(i) <= 90) {
            input.addClass('invalid');
            valid = false;
        }
    }

    if (valid) input.removeClass('invalid');

    return valid;
}

function addSet(textInput) {
    let input = $("#set");
    $("#nosets").hide();
    let set = new Set();
    let html, texto = "", conjunto;
    for (let i = 0; i < textInput.length; i++) {
        if (textInput[ i ].charCodeAt(0) >= 65 && textInput[ i ].charCodeAt(0) <= 90) { // verificando se é letra maiuscula
            let temp = textInput[ i ].charCodeAt(0) - 65;
            let conj = "{";
            for (let v of sets[temp]) {
                conj += v + ", ";
            }
            conj = conj.substring(0, conj.length - 2);
            conj += "}";
            console.log(conj);
            set.add(conj);
        }
        else
            set.add(textInput[ i ]);
    }

    for (let v of set) {
        texto += v + ", ";
    }
    texto = texto.substring(0, texto.length - 2);

    for (let i = 65; i <= 65 + sets.length; i++) {
        conjunto = String.fromCharCode(i);
    }

    html = '<li class="collection-item animated fadeInDown">' + conjunto + ' = {' + texto + '}</li>';
    $(".sets").append(html);
    sets.push(set);
    return true;
}

$("#set").keyup(function () {
    validate();
});

$("#addset").click(function () {
    addSet($("#set").val().split(';'));
    $("#set").val("");
    $("#set").focus();
});

$(document).keypress(function(e) {
    let value = $("#set").val();
    if(e.which == 13 && validate()) {
        addSet($("#set").val().split(';'));
        $("#set").val("");
        $("#set").focus();
    }
});

$(".unionsets").click(function () {
    let c1 = $("#unionset1").val().charCodeAt(0) - 65;
    let c2 = $("#unionset2").val().charCodeAt(0) - 65;

    let set1 = new Set([...sets[c1]]);
    let set2 = new Set([...sets[c2]]);

    let result = "{";
    for (let elem of set1.union(set2)) {
        result += elem + ", ";
    }
    result = result.substring(0, result.length - 2);
    console.log(result);
    result += "}";

    let resultfield = $("#unionsetresult");
    resultfield.val(result);
    resultfield.animateCss("fadeIn");
});

$(".intersectionsets").click(function () {
    let c1 = $("#intersection1").val().charCodeAt(0) - 65;
    let c2 = $("#intersection2").val().charCodeAt(0) - 65;

    let set1 = new Set([...sets[c1]]);
    let set2 = new Set([...sets[c2]]);

    let result = "{";
    for (let elem of set1.intersection(set2)) {
        result += elem + ", ";
    }
    result = result.substring(0, result.length - 2);
    console.log(result);
    result += "}";

    let resultfield = $("#intersectionresult");
    resultfield.val(result);
    resultfield.animateCss("fadeIn");
});

$(".diffsets").click(function () {
    let c1 = $("#diffset1").val().charCodeAt(0) - 65;
    let c2 = $("#diffset2").val().charCodeAt(0) - 65;

    let set1 = new Set([...sets[c1]]);
    let set2 = new Set([...sets[c2]]);

    let result = "{";
    for (let elem of set1.difference(set2)) {
        result += elem + ", ";
    }
    result = result.substring(0, result.length - 2);
    console.log(result);
    result += "}";

    let resultfield = $("#diffresult");
    resultfield.val(result);
    resultfield.animateCss("fadeIn");
});

$(".partitionbtn").click(function () {
    let c1 = $("#partitionset1").val().charCodeAt(0) - 65;
    let set = new Set([...sets[(c1)]]);

    let subsets = set.subsets();

    let result = "{{";
    for (let elem of subsets) {
        result += elem + ", ";
    }
    result = result.substring(0, result.length - 2);
    result += "}";

    let resultfield = $("#partitionresult");
    resultfield.val(result);
    resultfield.animateCss("fadeIn");
});

function generateSubsets(array) {
    var result = [];
    result.push([]);

    for (var i = 1; i < Math.pow(2, array.length); i++, result.push(subset))
        for (var j = 0, subset = []; j < array.length; j++)
            if (i & Math.pow(2, j))
                subset.push(array[j]);

    return result;
}

Set.prototype.subsets = function() {
    let setFinal = new Set();
    let array = [...this];

    let subsets = generateSubsets(array);
    console.log(subsets);

    for (let array of subsets) {
        let text = "{";
        for (let elem of array) {
            text += elem + ", ";
        }
        text = text.substring(0, text.length - 2);
        text += "}";
        setFinal.add(text);
    }

    console.log(setFinal);
    return setFinal;
}

Set.prototype.union = function(setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
};

Set.prototype.intersection = function(setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
};

Set.prototype.difference = function(setB) {
    var difference = new Set(this);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
};
