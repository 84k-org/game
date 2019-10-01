var swap_mode_list = [ [2,3], [3,4], [4,5], [5,6], [6,8]], MW, MH;


function SelectSwapMode (i) {

    $("#SelectModeLink").text('จับคู่ '+swap_mode_list[i][0] +'x'+swap_mode_list[i][1]);

    mode_group = 10;

    $("#NewGameLink").prop("href", "#MatchingGamePage");


}

var last_card, card_pair_left;

function prepareMatchingGame () {

    //console.log (mode_ID-10);

    MW = swap_mode_list[mode_ID-10][0];
    MH =swap_mode_list[mode_ID-10][1];

    var html = "", i, j;

    for (i=0; i<MH; i++) {
        for (j = 0; j < MW; j++) {
            html += '<BUTTON id="card'+i+'_'+j+'" onclick="turn_card('+i+','+j+');" class="ui-card ui-mini ui-btn ui-btn-inline ui-shadow ui-corner-all"></BUTTON></TD>';
        }
        html += "<BR id=line_"+i+" />";
    }



    $("#MatchingPlatform").html(html);

    for (i=0; i<MH; i++)
        for (j = 0; j < MW; j++)
            $("#card"+i+"_"+j).append($("#dark_source").clone());

    n_vibhatti_init();

    last_card = null;
    matching_click = 0;

    start_timer = jQuery.now();
}

var matching_click;

function turn_card(i, j) {
    //console.log (i + "," + j);
    //console.log ($("#card"+i+"_"+j).prop("x"));

    if ($("#card"+i+"_"+j).prop("turned")) {
        //console.log ("no effect");
        return;
    }


    matching_click++;

    if ($("#card"+i+"_"+j).prop("pali"))
        $("#card"+i+"_"+j).html($("#card"+i+"_"+j).prop("x"));
    else
        $("#card"+i+"_"+j).text($("#card"+i+"_"+j).prop("x"));



    $("#card"+i+"_"+j).addClass("ui-card-turned");

    $("#card"+i+"_"+j).prop("turned",true);


    if (last_card==null) {

        last_card= [i, j];
        return;
    }


    //var photo='<IMG src="pic/favicon_dark.png" width="15px" height="15px" />';


    if ($("#card"+i+"_"+j).prop("x") == $("#card"+last_card[0]+"_"+last_card[1]).prop("y") ||
        $("#card"+i+"_"+j).prop("y") == $("#card"+last_card[0]+"_"+last_card[1]).prop("x")
        ) {

        $("#card"+i+"_"+j).addClass("ui-card-turned-correct ui-card-hiding");
        $("#card"+last_card[0]+"_"+last_card[1]).addClass("ui-card-turned-correct ui-card-hiding");

        var this_card = last_card;
        last_card = null;

        setTimeout(function () {

            $("#card"+i+"_"+j).addClass("ui-card-hidden");
            $("#card"+this_card[0]+"_"+this_card[1]).addClass("ui-card-hidden");

                }, 2000);




        if (--card_pair_left==0) {

            var t= (jQuery.now() - start_timer)/1000;

            $("#matching_click").text(matching_click);
            $("#matching_eff").text((matching_click*2/(MW*MH)).toFixed(2) + " คลิกต่อคู่");
            $("#matching_time").text(Math.floor(t/60)+" นาที "+ Math.ceil((t%60))+" วินาที");
            $("#matching_speed").text((MW*MH*30/t).toFixed(2) + " คู่ต่อนาที");

            setTimeout(function () {
                $("#MatchingSummaryWindow").popup("open");
            },2000);

        }
    }

    else {


        var this_card = last_card;
        last_card = null;

        setTimeout(function () {

            $("#card"+i+"_"+j).text("");
            $("#card"+i+"_"+j).append($("#dark_source").clone());
            $("#card"+i+"_"+j).removeClass("ui-card-turned");
            $("#card"+i+"_"+j).prop("turned",false);

            $("#card"+this_card[0]+"_"+this_card[1]).text("");
            $("#card"+this_card[0]+"_"+this_card[1]).append($("#dark_source").clone());   //.html(photo);
            $("#card"+this_card[0]+"_"+this_card[1]).removeClass("ui-card-turned");
            $("#card"+this_card[0]+"_"+this_card[1]).prop("turned",false);
            }, 1000);


    }


}