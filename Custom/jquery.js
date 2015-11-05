
$(document).ready(function () {

    //Put Player mode button description on top if screen is less than 768px
    if (screen.width < 768) {
        $(".playerNameInput").attr("data-placement", "top");
    };

    var tuples;
    var countClick = 0;
    var lastClicked;
    var playerMode;
    var firstPlayer;
    var secondPlayer;
    var currentId;
    var firstPlayerPoints = 0;
    var secondPlayerPoints = 0;
    var activePlayer = "player1";
    var clicked;
    var playerWin = $("#playerWin");
    var pointsDifference = $("#pointsDifference");
    var playerLoose = $("#playerLoose");
    var numberOfBlock = [];
    var idOfBlock = [];
    var blockNumber = 1;

    // Navbar set active button 
    $(".nav a").on("click", function () {
        $(".nav").find(".active").removeClass("active");
        $(this).parent().addClass("active");
    });
    // Navbar remove active button 
    $(".navHeaderCollapse").focusout(function () {
        $(".active").removeClass("active");
    });
    // If 1 player mode is chosen
    $(".btn1").on("click", function () {
        $(".firstPageRow").addClass("invisible");
        $(".chooseMode").removeClass("invisible");
        playerMode = "mode1";
    });

    // If 2 players mode is chosen
    $(".btn2").on("click", function () {
        $(".firstPageRow").addClass("invisible");
        $(".playerName").removeClass("invisible");
        playerMode = "mode2";
    });

    // Validator for Name Input in 2 players mode
    $(".nameNext").on("click", function () {
        $(".playerNameInput").each(function () {
            if ($(this).val() == '') {
                $(this).addClass("invalid").attr("placeholder", "Please Insert Name");;
            };
            if ($(this).val().length > 20) {
                $(this).val("").addClass("invalid").attr("placeholder", "Name to long(20 Characters Max)");
            };
        });
        if (($("#inputPlayer1").val() != '' && $("#inputPlayer2").val() != '') && ($("#inputPlayer1").val().length <= 20 && $("#inputPlayer2").val().length <= 20)) {
            $(".playerName").addClass("invisible");
            $(".chooseMode").removeClass("invisible");
            firstPlayer = $("#inputPlayer1").val();
            secondPlayer = $("#inputPlayer2").val();
        };
    });

    //Player mode button description
    $('[data-toggle="tooltip"]').tooltip();

    //Start Game by choosing one of the modes
    $(".chooseModeBtn").on("click", function () {

        currentId = $(this).attr('id');
        //Configure game if one player or two player mode is chosen
        if (playerMode == "mode2") {
            $(".mode2").removeClass("invisible");
            $("#name1").html(firstPlayer + ": ");
            $("#name2").html(secondPlayer + ": ");
            $("#activePlayerHolder").html(firstPlayer + "'s turn");
        } else {
            $(".mode1").removeClass("invisible");
            $("#countDown").countdown({ since: new Date(), format: 'MS' });
        };

        $(".chooseMode").addClass("invisible");
        $(".jumbotron").css("padding-bottom", "50px");

        startGame();
    });

    function startGame() {
        //Check for chosen game mode, configure the blocks and get tuples
        tuples = ConfigureGame(currentId);

        //shuffle created tuples
        tuples = shuffle(tuples);

        $(".primary").click(function () {
            //Check if clicked block has already been clicked before or if it is open 
            if (countClick == 2 || $(this).hasClass("secondary") || $(this).hasClass("hit")) {
                return false;
            };

            var thisId = $(this).attr("id");

            // Push the ID and HTML in separate arrays to know which one is clicked
            numberOfBlock.push($(this).html());
            idOfBlock.push(thisId);

            //Change the clicked block
            $(this).removeClass("primary").addClass("secondary").html("<span class='glyphicon " + tuples[thisId] + "'></span>");

            countClick++;

            if (playerMode == "mode1") {
                clicked = checkHit1Player($(this));
            } else {
                clicked = checkHit2Players($(this));
            };
        });
    }


    //Check for hit and game complete 2 players mode
    function checkHit2Players(clicked) {
        if (countClick == 2) {
            //Check if we have a hit
            if (clicked.html() == lastClicked) {
                // Check to which player to asign point
                if (activePlayer == "player1") {
                    firstPlayerPoints++;
                } else {
                    secondPlayerPoints++;
                };

                $(".secondary").addClass("hit").removeClass("secondary");
                idOfBlock = [];
                numberOfBlock = [];
                $("#points1").html(" " + firstPlayerPoints);
                $("#points2").html(" " + secondPlayerPoints);
                countClick = 0;
                //Set the game for other player if there is no hit
            } else {
                setTimeout(function () {
                    $("#" + idOfBlock[0] + "").addClass("primary").removeClass("secondary").html(numberOfBlock[0]);
                    $("#" + idOfBlock[1] + "").addClass("primary").removeClass("secondary").html(numberOfBlock[1]);
                    numberOfBlock = [];
                    idOfBlock = [];
                    //Change the active player state because of no hit
                    if (activePlayer == "player1") {
                        activePlayer = "player2";
                        $("#activePlayerHolder").html(secondPlayer + "'s turn").css("color", "red");
                    } else {
                        activePlayer = "player1";
                        $("#activePlayerHolder").html(firstPlayer + "'s turn").css("color", "#62c462");
                    }
                    countClick = 0;
                }, 1000);
            }
        }
        //Check for game completion and a winner
        if ($(".primary").length == 0) {

            if (firstPlayerPoints > secondPlayerPoints) {
                $("#activePlayerHolder").html(firstPlayer + " won the game!!!");
                //Configuration of the congrats modal 
                var pointsDifference = firstPlayerPoints - secondPlayerPoints;
                $("#modalTitle").html("Congrats to " + firstPlayer + " for winning the game !!!");
                $("#modalMessage").html(firstPlayer + " has won the game against " + secondPlayer + " with " + pointsDifference + " points difference");
                $("#congratsMode").modal('show');
            };

            if (secondPlayerPoints > firstPlayerPoints) {
                $("#activePlayerHolder").html(secondPlayer + " won the game!!!");
                //Configuration of the congrats modal 
                var pointsDifference = secondPlayerPoints - firstPlayerPoints;
                $("#modalTitle").html("Congrats to " + secondPlayer + " for winning the game !!!");
                $("#modalMessage").html(secondPlayer + " has won the game against " + firstPlayer + " with " + pointsDifference + " points difference");
                $("#congratsMode").modal('show');
            };

            if (firstPlayerPoints == secondPlayerPoints) {
                blockNumber = 1;
                $("#tieMode").modal('show');
                $(".hit").remove();
                startGame();
            };

        }
        lastClicked = clicked.html();
    }

    //Check for hit and game complete 1 player mode
    function checkHit1Player(clicked) {
        if (countClick == 2) {
            if (clicked.html() == lastClicked) {
                $(".secondary").addClass("hit").removeClass("secondary");
                numberOfBlock = [];
                idOfBlock = [];
                countClick = 0;
            } else {
                setTimeout(function () {
                    $("#" + idOfBlock[0] + "").addClass("primary").removeClass("secondary").html(numberOfBlock[0]);
                    $("#" + idOfBlock[1] + "").addClass("primary").removeClass("secondary").html(numberOfBlock[1]);
                    numberOfBlock = [];
                    idOfBlock = [];
                    countClick = 0;
                }, 1000);
            }
        }
        //Check for game completion
        if ($(".primary").length == 0) {
            $("#countDown").countdown("pause");
            var time = $("#countDown").countdown("getTimes");
            var minutes = time[5];
            var seconds = time[6];
            //Configuration of the congrats modal 
            $("#modalTitle").html("Well done, you have done it !!!");
            $("#modalMessage").html("You have finished the game in " + minutes + " minutes and " + seconds + " seconds...");
            $("#congratsMode").modal('show');
        }
        lastClicked = clicked.html();
    }

    // Configure Game
    function ConfigureGame(currentId) {
        var tuples;
        if (currentId == "choose4") {
            configureBlocks(4, 3);
            tuples = getTuples(8);
        };

        if (currentId == "choose6") {
            configureBlocks(6, 2);
            tuples = getTuples(18);
        };

        if (currentId == "choose8") {
            configureBlocks(8, 1);
            tuples = getTuples(32);
        };

        return tuples;
    }

    //Configure Game blocks
    function configureBlocks(dimension, cell) {
        var idCounter = 0;
        for (var i = 0; i < dimension; i++) {
            $(".jumbotron").append("<div class='row rowHolder' id='row" + i + "'></div>");
            for (var j = 0; j < dimension; j++) {
                $("#row" + i + "").append("<div class='col-xs-" + cell + " block primary' id='" + idCounter + "'>" + blockNumber + "</div>");
                blockNumber++;
                idCounter++;
            }
        };
    };

    // Make array of images for the game
    function getTuples(number) {
        var tuples = new Array();
        var images = getImagesArray();
        for (var i = 0; i < number; i++) {
            tuples.push(images[i]);
            tuples.push(images[i]);
        }
        return tuples;
    };


    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        };

        return array;
    };

    function getImagesArray() {
        var images = [
            "glyphicon-off",
            "glyphicon-plus",
            "glyphicon-minus",
            "glyphicon-envelope",
            "glyphicon-glass",
            "glyphicon-music",
            "glyphicon-heart",
            "glyphicon-star",
            "glyphicon-user",
            "glyphicon-flag",
            "glyphicon-headphones",
            "glyphicon-camera",
            "glyphicon-stop",
            "glyphicon-eye-open",
            "glyphicon-thumbs-up",
            "glyphicon-thumbs-down",
            "glyphicon-phone-alt",
            "glyphicon-tree-deciduous",
            "glyphicon-off",
            "glyphicon-plus",
            "glyphicon-minus",
            "glyphicon-envelope",
            "glyphicon-glass",
            "glyphicon-music",
            "glyphicon-heart",
            "glyphicon-star",
            "glyphicon-user",
            "glyphicon-flag",
            "glyphicon-headphones",
            "glyphicon-camera",
            "glyphicon-stop",
            "glyphicon-eye-open",
        ];

        return images;
    };


});
