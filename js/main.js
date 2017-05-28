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

function printSet(set) {
    let text = "{";
    for (let v of set) {
        if (typeof v == typeof set){
            text += printSet(v) + "; ";
        }
        else text += v + "; ";
    }
    if (text.length > 2) text = text.substring(0, text.length - 2);
    text += "}";

    return text;
}

function appendSetOnList(set, operation, set1, set2) {
    let setIndex = String.fromCharCode(65 + sets.length);
    let html;
    if (!operation) html = '<li class="collection-item animated fadeInDown">' + setIndex + ' = ' + printSet(set) + ' <span style="float: right">| ' + setIndex + ' | = ' + set.size + '</span></li>';
    else if (operation == '∩' || operation == '∪' || operation == '-' || operation == 'x') {
        html = '<li class="collection-item animated fadeInUp">' + setIndex + ' = ' + String.fromCharCode(set1 + 65) + ' ' + operation + ' ' + String.fromCharCode(set2 + 65) + ' = ' + printSet(set) + ' <span style="float: right">| ' + setIndex + ' | = ' + set.size + '</span></li>';
        sets.push(set);
    }
    else if (operation == '’') {
        html = '<li class="collection-item animated fadeInUp">' + setIndex + ' = ' + String.fromCharCode(set1 + 65)  + operation + ' = ' + printSet(set) + ' <span style="float: right">| ' + setIndex + ' | = ' + set.size + '</span></li>';
        sets.push(set);
    }
    else if (operation == 'R') {
        html = '<li class="collection-item animated fadeInUp">' + setIndex + ' = ' + String.fromCharCode(set1 + 65) + ' ' + "r" + ' ' + String.fromCharCode(set2 + 65) + " | " + operation + ' = ' + printSet(set) + ' <span style="float: right">| ' + setIndex + ' | = ' + set.size + '</span></li>';
        console.log(set);
        sets.push(set);
    }
    else{
        html = '<li class="collection-item animated fadeInUp">' + setIndex + ' = ' + operation + '(' + String.fromCharCode(set1 + 65) + ') = ' + printSet(set) + ' <span style="float: right">| ' + setIndex + ' | = ' + set.size + '</span></li>';
        console.log(set);
        sets.push(set);
        universe = universe.union(set);
        $("#universe").html("U = " + printSet(universe) + ' <span style="float: right">| U | = ' + universe.size + '</span></li>');
    }

    $(".sets").append(html);
}

function isSetValid() {
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
    let html, texto = "";
    for (let i = 0; i < textInput.length; i++) {
        if (textInput[ i ].charCodeAt(0) >= 65 && textInput[ i ].charCodeAt(0) <= 90) { // caso seja um conjunto presente
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


    appendSetOnList(set);
    sets.push(set);
    universe = universe.union(set);
    $("#universe").html("U = " + printSet(universe) + ' <span style="float: right">| U | = ' + universe.size + '</span></li>');
    input.val("");
    input.focus();
    return true;
}

$("#set").keyup(function () {
    isSetValid();
});

$("#addset").click(function () {
    addSet($("#set").val().split(';'));
});

$(document).keypress(function(e) {
    if(e.which == 13 && isSetValid() && $("#set").is(":focus")) {
        addSet($("#set").val().split(';'));
    }
});

$(".unionsets").click(function () {
    let c1 = $("#unionset1").val().charCodeAt(0) - 65;
    let c2 = $("#unionset2").val().charCodeAt(0) - 65;

    let set1 = new Set([...sets[c1]]);
    let set2 = new Set([...sets[c2]]);

    appendSetOnList(set1.union(set2), '∪', c1, c2);
    let result = printSet(set1.union(set2));

    let resultField = $("#unionsetresult");
    resultField.val(result);
    resultField.animateCss("fadeIn");
});

$(".intersectionsets").click(function () {
    let c1 = $("#intersection1").val().charCodeAt(0) - 65;
    let c2 = $("#intersection2").val().charCodeAt(0) - 65;

    let set1 = new Set([...sets[c1]]);
    let set2 = new Set([...sets[c2]]);

    appendSetOnList(set1.intersection(set2), '∩', c1, c2);
    let result = printSet(set1.intersection(set2));

    let resultField = $("#intersectionresult");
    resultField.val(result);
    resultField.animateCss("fadeIn");
});

$(".diffsets").click(function () {
    let c1 = $("#diffset1").val().charCodeAt(0) - 65;
    let c2 = $("#diffset2").val().charCodeAt(0) - 65;

    let set1 = new Set([...sets[c1]]);
    let set2 = new Set([...sets[c2]]);

    appendSetOnList(set1.difference(set2), '-', c1, c2);
    let result = printSet(set1.difference(set2));

    let resultField = $("#diffresult");
    resultField.val(result);
    resultField.animateCss("fadeIn");
});

$(".complementbtn").click(function () {
    let c1 = $("#complementset").val().charCodeAt(0) - 65;

    let set1 = new Set([...sets[c1]]);

    appendSetOnList(universe.difference(set1), '’', c1);
    let result = printSet(universe.difference(set1));

    let resultField = $("#complementresult");
    resultField.val(result);
    resultField.animateCss("fadeIn");
});

$(".partitionbtn").click(function () {
    let c1 = $("#partitionset1").val().charCodeAt(0) - 65;
    let set = new Set([...sets[(c1)]]);

    let subsets = set.subsets();

    appendSetOnList(subsets, 'P', c1);
    let result = printSet(subsets);

    let resultField = $("#partitionresult");
    resultField.val(result);
    resultField.animateCss("fadeIn");
});

$(".productbtn").click(function () {
    let c1 = $("#productset1").val().charCodeAt(0) - 65;
    let c2 = $("#productset2").val().charCodeAt(0) - 65;

    let set1 = new Set([...sets[c1]]);
    let set2 = new Set([...sets[c2]]);

    appendSetOnList(set1.productCart(set2), 'x', c1, c2);
    let result = printSet(set1.productCart(set2));

    let resultField = $("#productresult");
    resultField.val(result);
    resultField.animateCss("fadeIn");
});

$(".relationbtn").click(function () {
    let c1 = $("#relationset1").val().charCodeAt(0) - 65;
    let c2 = $("#relationset2").val().charCodeAt(0) - 65;
    let field = $("#relationfield").val();

    let set1 = new Set([...sets[c1]]);
    let set2 = new Set([...sets[c2]]);

    appendSetOnList(set1.relation(set2,field), 'R', c1, c2);
    let result = printSet(set1.relation(set2, field));

    let resultField = $("#relationresult");
    resultField.val(result);
    resultField.animateCss("fadeIn");
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
        if (text.length > 2) text = text.substring(0, text.length - 2);
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

Set.prototype.productCart = function(setB){
    var productCart = new Set();
    for (var elem1 of this){
        for (var elem2 of setB){
            let item = "(" + elem1 + ", " + elem2 + ")";
            productCart.add(item);
        }
    }
    return productCart;
};

Set.prototype.relation = function(setB,field){
    var relation = new Set();
    for (var a of this){
        for (var b of setB) {
            let item = "(" + a + ", " + b + ")";
            if (eval(field))
                relation.add(item);
        }
    }
    return relation;
};
