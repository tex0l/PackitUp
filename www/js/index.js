var id = 1;
var user_name = "default";

function ide(value) {
    console.log(value);
    id = value;
    window.location.hash = '#home';
    f();
}

function ajouter(name) {
    $.post('http://api-packmeup.herokuapp.com/users', {
        "user": {
            "name": name,
            "password": "pass"
        }
    }, function (data) {
        getUserId(name);
        user_name = name;
        $.getJSON('http://api-packmeup.herokuapp.com/users.json',
            function (data) {
                console.log(JSON.stringify(data));
                for (k = 0; k < data.length; k++) {
                    if (data[k].name == name) {
                        console.log((data[k].id));
                        id = data[k].id;
                    }
                }
                alert('Vous avez bien �t� ajout�, votre ID est : ' + id);
                window.location.hash = '#home#';
                f();
            });

    });
}

function getUserId(name) {
    $.getJSON('http://api-packmeup.herokuapp.com/users.json', function (data) {
        console.log(JSON.stringify(data));
        for (k = 0; k < data.length; k++) {
            if (data[k].name == name) {
                console.log((data[k].id));
                id = data[k].id;
            }
        }
    });
}

var countries = {
    "countries": []
};
var valisees = {
    "valisees": []
};

var itemsValiseEnCours = {
    "items": []
};
var valises = {
    "val": []

};

$.getJSON("http://api-packmeup.herokuapp.com/items.json", function (item) {
    items = item;
    console.log('items charges');
});

function f() {
    $
        .getJSON(
        "http://api-packmeup.herokuapp.com/users.json",
        function (data) {

            for (k = 0; k < data.length; k++) {
                if (data[k].id == id) {
                    console.log((data[k].id));
                    user_name = data[k].name;
                    console.log(user_name);
                }
            }


            $
                .getJSON(
                "http://api-packmeup.herokuapp.com/countries.json",
                function (country) {
                    countries = country;
                    console.log('pays charges');

                    $
                        .post(
                        'http://api-packmeup.herokuapp.com/u_suitcases/get_u_suitcases',
                        {
                            "u_suitcase": {
                                "user_id": id
                            }
                        },
                        function (data) {
                            console
                                .log({
                                    "user_id": id

                                });
                            console
                                .log('dataValises : '
                                    + JSON
                                    .stringify(data));
                            valises = {
                                "val": []
                            };
                            for (k = 0; k < data.suitcases.length; k++) {
                                valises.val[k] = {
                                    "country_id": data.suitcases[k].country_id,
                                    "destination": countries.countries[data.suitcases[k].country_id - 1].name
                                }
                            }
                            console
                                .log('valises : '
                                    + JSON
                                    .stringify(valises));
                            route();

                        });

                });
        });
}

f();

function addValise() {
    if (i == -1) {
        alert('vous n avez pas choisi de pays !');
        return;
    }
    for (k = 0; k < valises.val.length; k++) {
        if (countries.countries[i].name == valises.val[k].destination) {
            alert('Vous poss�dez d�j� cette valise'
                + countries.countries[i].name);
            return;
        }
    }

    valises.val[valises.val.length] = {
        "id": i,
        "destination": countries.countries[i].name,
        "temp": "0"
    };

    window.location.hash = "#valiseEnCours";
    console.log(valises);

}

var indexValiseEnCours = 0;
var valEnCours;
var i = 0;// index de la valise en cours dans les pays

var items = {
    "items": [
        {
            "index": "0",
            "name": "chapeau",
            "check": "btn btn-warning"
        },
        {
            "index": "1",
            "name": "T-Shirt",
            "check": "btn btn-warning"
        },
        {
            "index": "2",
            "name": "Short",
            "check": "btn btn-warning"
        },
        {
            "index": "3",
            "name": "lunettes",
            "check": "btn btn-warning"
        }

    ]

};
/*
 * var pays = { "pays" : [ {"name":"France"}, {"name":"Patagonie"},
 * {"name":"Iraq"} ] };
 */
function valiseEnCours(i) {

    valEnCours = {
        "val": [
            {
                "destination": countries.countries[i].name,
                "temp": "0"
            }
        ]

    };
    console.log(valEnCours);
    ;
}
var urlMeteo = "http://api.openweathermap.org/data/2.5/forecast?q=paris";

function meteoValiseEnCours() {
    urlMeteo = countries.countries[i].weatherLink;

}
function indexPaysEnCours(nom) {

    for (j = 0; j < countries.countries.length; j++) {
        var name = countries.countries[j].name;
        console.log(name + "-" + nom);
        if (name == nom) {
            i = j;
            console.log('i :' + i);
            return;
        }
    }
    i = -1
}

$(window).on('hashchange', route);

function route() {
    var page, hash = window.location.hash;

    switch (hash) {
        case "#valiseEnCours":
            console.log(id);
            valiseEnCours(i);
            meteoValiseEnCours();
            console.log(urlMeteo);

            $
                .get(
                'js/templates.html',
                function (templates) {

                    $
                        .getJSON(
                        urlMeteo,
                        function (met) {
                            valEnCours.val[0].temp = Math
                                .round(
                                    met.list[0].main.temp - 273,
                                    16);
                            console
                                .log('meteo : '
                                    + valEnCours.val[0].temp);

                            if (!valisees[i]) {
                                valisees[i] = {
                                    "suitcase": []
                                };

                                $
                                    .post(
                                    'http://api-packmeup.herokuapp.com/suitcases.json',
                                    {
                                        "suitcase": {
                                            "country": countries.countries[i].name,
                                            "weather": "cold"

                                        }
                                    },
                                    function (data) {
                                        console
                                            .log('data :'
                                                + data.suitcase);
                                        for (k = 0; k < data.suitcase.length; k++) {
                                            valisees[i].suitcase[k] = {
                                                "index": k,
                                                "name": data.suitcase[k].name,
                                                "check": "btn btn-warning"
                                            };
                                        }
                                        $
                                            .get(
                                            'js/check.html',
                                            function (templates) {

                                                var template = $(
                                                    templates)
                                                    .filter(
                                                        '#check')
                                                    .html();
                                                page = Mustache
                                                    .render(
                                                        template,
                                                        valisees[i]);
                                                document
                                                    .getElementById("checkList").innerHTML = page;
                                            },
                                            'html');

                                    });

                            } else {
                                $
                                    .get(
                                    'js/check.html',
                                    function (templates) {

                                        var template = $(
                                            templates)
                                            .filter(
                                                '#check')
                                            .html();
                                        page = Mustache
                                            .render(
                                                template,
                                                valisees[i]);
                                        document
                                            .getElementById("checkList").innerHTML = page;
                                    }, 'html');

                            }
                            var template = $(templates)
                                .filter(
                                    '#valiseEnCours')
                                .html();
                            page = Mustache.render(
                                template, {"username": user_name, "val": valEnCours.val});


                            document
                                .getElementById("container").innerHTML = page;

                        });

                }, 'html');

            document.getElementById("checkList").innerHTML = page;
            break;

        case "#nouvelleValise":

            $.get('js/templates.html', function (templates) {
                var template = $(templates).filter('#nouvelleValise').html();

                page = Mustache.render(template, {"username": user_name, "countries": countries.countries});

                document.getElementById("container").innerHTML = page;

            }, 'html');

		$.get('js/check.html', function(templates) {
			var template = $(templates).filter('#absurde').html();
			page = Mustache.render(template, items);
			document.getElementById("checkList").innerHTML = page;
		}, 'html');
            break;
        case "#parametres":


            console.log('id : ' + id);

            $.get('js/templates.html', function (templates) {
                var template = $(templates).filter('#parametres').html();
                page = Mustache.render(template, {"username": user_name})
                $('#container').html(page); // with jQuery
            }, 'html');
            $.get('js/check.html', function (templates) {
                var template = $(templates).filter('#absurde').html();
                page = Mustache.render(template, items);
                document.getElementById("checkList").innerHTML = page;
            }, 'html');

            break;

        case "#modify":
            $.get('js/templates.html', function (templates) {
                console.log(JSON.stringify(items));
                var template = $(templates).filter('#modify').html();
                page = Mustache.render(template, {"username": user_name, "val": valEnCours.val});

                $('#container').html(page); // with jQuery
            }, 'html');
            $.get('js/modify.html', function (templates) {

                for (k = 0; k < items.items.length; k++) {
                    itemsValiseEnCours.items[k] = {
                        "indice": k,
                        "id": items.items[k].id,
                        "name": items.items[k].name,
                        "contient": contient(k),
                        "classe": classe(contient(k))
                    }
                }
                console.log(JSON.stringify(itemsValiseEnCours));
                var template = $(templates).filter('#check').html();
                page = Mustache.render(template, itemsValiseEnCours);
                document.getElementById("checkList").innerHTML = page;
            }, 'html');

            break;

        default:

            $.get('js/templates.html', function (templates) {
                var template = $(templates).filter('#nouvelleValise').html();
                var page = $(templates).filter('#home').html();
                page2 = Mustache.render(page, {"username": user_name})
                $('#container').html(page2); // with jQuery

            }, 'html');

            $.get('js/valises.html', function (templates) {
                var template = $(templates).filter('#valises').html();
                page = Mustache.render(template, valises);
                document.getElementById("checkList").innerHTML = page;
            }, 'html');

            break;
    }
}

function contient(k) {
    for (l = 0; l < valisees[i].suitcase.length; l++) {
        if (items.items[k].name == valisees[i].suitcase[l].name) {
            return 1;
        }
    }
    return 0;
}

function classe(k) {
    if (k == 1)
        return 'btn btn-primary';
    return 'btn btn-default';
}

function enregistrer() {
    console.log('debut de l enregistrement');
    console.log(JSON.stringify(valisees[i]));
    valisees[i] = {
        "suitcase": []
    };
    var compteur = 0;
    for (k = 0; k < items.items.length; k++) {
        if (itemsValiseEnCours.items[k].contient == 1) {
            valisees[i].suitcase[compteur] = {
                "name": itemsValiseEnCours.items[k].name,
                "index": compteur,
                "id": itemsValiseEnCours.items[k].id,

                "check": "btn btn-warning"
            };
            compteur++;
        }
    }
    console.log(JSON.stringify(valisees[i]));
    window.hash = "#valiseEnCours";
}
