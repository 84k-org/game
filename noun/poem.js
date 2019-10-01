



function CountSyllable (w) {


    // STEP 1 -- Re-arrange characters in a romanised fashion

    // เปลี่ยน ึ เป็น อิ นิคหิต
    w = w.replace(/\ึ/g,'ิํ').replace("*","");


    var c=0;
    //สลับ เอ และ โอ
    var i=w.length- 2, j;



    for (i= w.length-2;i>-1; i--) {

        if (w.charAt(i)=="เ" || w.charAt(i)=="โ") {
            if (w.charAt(i+2)=="ฺ")
                w = w.substring(0, i).concat(w.substr(i+1,3), w.charAt(i), w.substring(i+4, w.length));
            else
                w = w.substring(0, i).concat(w.charAt(i + 1), w.charAt(i), w.substring(i + 2, w.length));
        }

    }

    //console.log (w);

    for ( i=1;i< w.length; i++) {
        if (IsVowel(w.charAt(i)))
            c++;
        else if (w.charAt(i)!="ฺ"  && IsAlphabet(w.charAt(i-1))) {
            c++;    //มีสระอะ ข้างหน้า
            w = w.substring(0,i).concat("ะ", w.substring(i, w.length))
        }
        else if (i==w.length-1)
            break;
        else if (w.charAt(i+1)=="ฺ" ) // จุด
            i++; //skip 2 loops

    }




    i=w.length-1;
    // มีสระอะที่พยางค์สุดท้าย
    if (IsAlphabet(w.charAt(i)) && (w.length==1 || IsVowel(w.charAt(i-1)) || w.charAt(i-1)=="ฺ"  || w.charAt(i-1)=="ํ"  || IsSpace(w.charAt(i-1)))) {
        c++;
        w= w.concat("ะ");
    }


    //console.log (w);

    // STEP 2- BREAK INTO SYLLABLES


    Syllable = [];
    var last_stop = 0;

    for ( i=1;i< w.length; i++) {

        if (w.charCodeAt(i)==10) {
            Syllable.push(10);
            continue;
        }
        if (IsSpace(w.charAt(i))) {
            Syllable.push(-555);
            continue;
        }

        if (!IsVowel(w.charAt(i))) {
            //if(IsSpace(w.charAt(i)))
              //last_stop++;
            continue;
        }



        while (IsSpace(w.charAt(last_stop)))
            last_stop++;


        if (w.charAt(i+1)=="ํ") {
            Syllable.push (w.substring(last_stop,i+2));
            last_stop = i+2;
            i++;
        }
        else if (w.charAt(i+2)=="ฺ") {
            Syllable.push (w.substring(last_stop,i+3));
            last_stop = i+3;
            i+=2;
        }
        else if (IsVowel(w.charAt(i+2))) {
            Syllable.push (w.substring(last_stop,i+1));
            last_stop = i+1;
        }
        else if (IsSpace(w.charAt(i+1))) {
            Syllable.push (w.substring(last_stop,i+1));
            last_stop = i+2;

        }
    }


    if (IsVowel(w.charAt(w.length-1))) {
        Syllable.push (w.substring(last_stop,w.length));

    }


    //console.log (w + " : " + c ); //" // " + w.charCodeAt(w.length-1));


    //console.log (Syllable);

    var col_count= 0, row_count= 1, text="<TR>";

    var is_transcribe_mode = (window.location.href.indexOf("thai2roman")==-1)? false:true;


    if (is_transcribe_mode) {
        text += "<TD>";
        for (i = 0; i < Syllable.length; i++) {
            if (Syllable[i] == 10)
                text += "<TR><TD>";
            else if (Syllable[i]==-555)
                text += "&nbsp;";
            else
                text += normalise(Syllable[i]);
            //console.log(text);
        }
    }

    else
        for (i=0, j=0; i<Syllable.length; i++) {
            if (Syllable[i]==10) {
                text += "<TR>";
                j=0;
                row_count++;

            }
            else if (Syllable[i]==-555)
                continue;
            else {

                //console.log (i+":"+Syllable[i] +":" +normalise(Syllable[i]));


                    text += "<TD id='t"+ (row_count-1) + "_" + (j++) +"' style='border:1px solid #cccccc;background-color: #eeeeDD'><B id='syll_"+i+"'>" + normalise(Syllable[i]) + "</B>";

                    if (is_En) {
                        text += "<BR class='s_break' style='display:none;' /><SPAN class='spell' style='display:none;'>"
                            + spell(Syllable[i]) + "</SPAN><BR />"
                            + comment(Syllable[i]) + "";

                    }
                    else text += "<BR class='s_break'/><SPAN class='spell'>"
                        + spell(Syllable[i]) + "</SPAN><BR />"
                        + comment(Syllable[i]) + "";


                    if (col_count<j) {
                        ++col_count;
                        kcomment.push(karu);
                        //console.log ("kcomment[" + (j-1) + "] = " + kcomment[j-1]);
                    }
                    else if (kcomment[j-1]!=karu && kcomment[j-1]!=-1) {
                        kcomment[j-1] = -1;
                        //console.log ("kcomment[" + (j-1) + "] = " + kcomment[j-1]);

                    }
            }
        }

    for (i=col_count; i>0; i--) {

        text = "<TD style='border:none;'>" + (i) + text;
    }

    text = "<TR style='font-size:40%;color:grey;border:none;background-color:#d3d3d3;'>"+text;

    $("#analysis").html(text);


    for (i=0; i<col_count; i++) {
        if (kcomment[i] != -1) {
            for (j = 0; j < row_count; j++) {

                if ($("#t" + i + "_" + j)) {
                    //console.log("#t" + j + "_" + i);
                    if (kcomment[i])       //karu
                        $("#t" + j + "_" + i).css("background-color", "#33FF77");
                    else
                        $("#t" + j + "_" + i).css("background-color", "#99FFCC");
                }
            }
        }
        else
            $("#t" + j + "_" + i).css("background-color", "white");
    }


    return c;
}



function comment (w) {

    karu = true;

    if (w.indexOf("า")!=-1 || w.indexOf("ี")!=-1 || w.indexOf("ู")!=-1 || w.indexOf("เ")!=-1 || w.indexOf("โ")!=-1) {
        return "<SPAN class='karu'>ทีฆครุ</SPAN>";
    }
    if (w.charAt(w.length-1) == "ฺ") {
        return "<SPAN class='karu'>สํโยคาทิครุ</SPAN>";
    }

    if (w.charAt(w.length-1) == "ํ") {
        return "<SPAN class='karu'>นิคฺคหิตครุ</SPAN>";
    }

    karu=false;
    return "<SPAN class=lahu>ลหุ</SPAN>";

}

function normalise (w) {

    var char_TH = ["ะ", "า", "ิ", "ี", "ุ", "ู", "เ", "โ", "ก", "ข", "ค", "ฆ", "ง", "จ", "ฉ", "ช", "ฌ", "ญ", "ฏ", "ฐ", "ฑ", "ฒ", "ณ", "ต", "ถ", "ท", "ธ", "น", "ป", "ผ", "พ", "ภ", "ม", "ย", "ร", "ล", "ว", "ส", "ห", "ฬ", "ํ"  ];
    var char_EN = ["a", "ā", "i", "ī", "u", "ū", "e", "o", "k", "kh", "g", "gh", "ṅ", "c", "ch", "j", "jh", "ñ", "ṭ", "ṭh", "ḍ", "ḍh", "ṇ", "t", "th", "d", "dh", "n", "p", "ph", "b", "bh", "m", "y", "r", "l", "v", "s", "h", "ḷ", "ṃ"];

    if (is_En) {


        for (var i= 0, r=w.replace('อ','') ;i<char_TH.length;i++)
            r=r.replace(char_TH[i]+"ฺ", char_EN[i]).replace(char_TH[i],char_EN[i]);

        //console.log ("r = "+r);

        //console.log (r.charAt(0));

        //return w+"("+r+")";
        return r;
    }



    for (var i= w.length-1;i>0; i--) {

        if (w.charAt(i)=="เ" || w.charAt(i)=="โ") {
            //console.log("|"+w+"|");
            return  w.charAt(i).concat(w.substring(0, i), w.substring(i + 1, w.length)).replace('ะ','').replace(/\ิํ/g,'ึ');

        }

    }
    //console.log (w);
    return w.replace('ะ','').replace(/\ิํ/g,'ึ');

}

function spell (w) {

    w = w.replace("ะ","ฺ+อ").replace("า","ฺ+อา").replace("ิ","ฺ+อิ").replace("ี","ฺ+อี").replace("ุ","ฺ+อุ").replace("ู","ฺ+อู").replace("เ","ฺ+เอ").replace("โ","ฺ+โอ").replace("อฺ+","").replace("*","");

    //console.log(w + ":" + w.charAt(w.length-1))
    switch (w.charAt(w.length-1)) {
        case 'ฺ': return w.substring(0,w.length-2).concat('+', w.substring(w.length-2,w.length));

        case 'ํ': return w.substring(0,w.length-1).concat('+ํ');

        default: return w;
    }

}



function IsSpace (i) {
    return (i==" " || i=="	" || i.charCodeAt()==10);
}

function IsVowel (i) {
    return (i=="ะ" || i=="า" || i=="ิ"  || i=="ี"  || i=="ุ"  || i=="ู"  || i=="เ"  || i=="โ" );
    // not including อะ
}

function IsAlphabet (i) {
    return ( (i.charCodeAt()>3584 && i.charCodeAt()<3631) || i.charCodeAt()==63232 || i.charCodeAt()==63247) //|| i=="ํ");
    //  not including นิคหิต
}

function analyse () {
    var Q = $("textarea#Q").val();
    kcomment=[];
    CountSyllable(Q);

    //console.log(''.charCodeAt()); //ญ ไม่มีเชืง 63247
    //console.log(''.charCodeAt()); // ฐ ไม่มีเชิง 63232

}




function example (i) {

    switch (i) {
        case 0: $("#Q").val("*อเสวนา จ พาลานํ\nปณฺฑิตานญฺจ เสวนา\nปูชา จ ปูชนียานํ\nเอตมฺมงฺคลมุตฺตมํ"); break;
        case 1: $("#Q").val("*สมฺมาสมฺพุทฺธมตุลํ\nสสทฺธมฺมคณุตฺตมํ\nอภิวาทิย ภาสิสฺสํ\nอภิธมฺมตฺถสงฺคหํ"); break;
        case 2: $("#Q").val("*ตถาคโต โย กรุณากโร กโร\nปยาตโมสฺสชฺช สุขปฺปทํ ปทํ\nอกา ปรตฺถํ กลิสมฺภเว ภเว\nนมามิ ตํ เกวลทุกฺกรํ กรํ"); break;
        case 3: $("#Q").val("*ยา เทวตา สนฺติ วิหารวาสินี\nถูเป ฆเร โพธิฆเร ตหึ ตหึ\nตา ธมฺมทาเนน ภวนฺตุ ปูชิตา\nโสตฺถึ กโรนฺเตธ วิหารมณฺฑเล"); break;
        case 4: $("#Q").val("พุทฺโธ สุสุทฺโธ กรุณามหณฺณโว\nโยจฺจนฺตสุทฺธพฺพรญาณโลจโน\nโลกสฺส ปาปูปกิเลสฆาตโก\nวนฺทามิ พุทฺธํ อหมาทเรน ตํ"); break;
    }

    analyse();


}



function ChangeLang () {




    if (is_En) {
        $("#LangBttn").text("อักขระไทย");
        is_En = false;
        $(".spell").show();
        $(".s_break").show();
    }
    else {
        $("#LangBttn").text("อักขระโรมัน");
        is_En = true;
        $(".spell").hide();
        $(".s_break").hide();
    }

    for (var i=0; i<Syllable.length; i++) {
        if (Syllable[i]==10)
            continue;
        $("#syll_"+i).text (normalise (Syllable[i]));

    }


}