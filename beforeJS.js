$(".action-btn").css({"display":"block"});
$("#save_btn").hide();
$("#del_btn").hide();
$("#excelupload").hide();
$("#header-addrow").hide();
$("#header-delrow").hide();
$("#dfile_Conn").hide();
$("#search_btn").trigger("click");

$(`#${itmobj1["from_date"]}`).MonthPicker({ 
    SelectedMonth: new Date(),
    MonthFormat: "yy-mm"
});

$(`#${itmobj1["to_date"]}`).MonthPicker({ 
    SelectedMonth: new Date(),
    MonthFormat: "yy-mm"
});

//$(`.editer-content1 .${itmobj1["user_id_ser"]}-ITEM`).hide();
$(`#${itmobj1["user_id_ser"]}`).val($("#UID").val());
$("#search_btn").trigger("click");

// 2023.10.24 by jplle
// 사용자코드는 초기화할 필요 없음.
// -> 초기회를 하더라도 해당 대리점만 조회가 되어야 함.
//$("#reset_btn").on("click", function() {
//    $(`#${itmobj1["user_id_ser"]}`).val($("#UID").val());
//})


// 2023.10.27 by truongnq
$("#printSel_Save").after(`<button class="menuadd-btn" id="printSel_Save_custom">인쇄</button>`)
$("#print_btn").on("click",()=>{
    let printEnable = true
    let data_change = ""
    const listChecked = grid1.getCheckedRows()
    //save to sessionStorage for printing by Cuong 2023-02-26
    sessionStorage.setItem(
    "640_from_date_ym",
    nvl($("#" + itmobj1["from_date"]).val(), "")
  );
      sessionStorage.setItem(
    "640_to_date_ym",
    nvl($("#" + itmobj1["to_date"]).val(), "")
  );
    
    if(listChecked.length > 0){
        for(let index = 0; index<listChecked.length;index++){
             if(index == 0){
               data_change = listChecked[index][itmobj1["change_date"]]
            }else{
                if(data_change!=listChecked[index][itmobj1["change_date"]]){
                    printEnable = false
                    break
                }
            }
        }

        if(!printEnable){
            $("#printSel_Save_custom").show()
            $("#printSel_Save").hide()
            $("#printSel_Save_custom").on("click",()=>{
                msg("동일날짜를 선택하십시요.", null, "N");
                
            })
        }else{
            $("#printSel_Save_custom").hide()
            $("#printSel_Save").show()
        }
    }
})

// confirm button
$("#cust_btn1").on("click", function () {
    const checked = grid1.getCheckedRows();
    if (checked.length > 0) {
        let check_flag = true;
        let error_msg = "";
        for(let i = 0; i < checked.length; i++) {
            if (nvl(checked[i][itmobj1["storage_status"]],"") !== "STATUS02") {
                error_msg = "이미 판매전환 승인된 건입니다."
                check_flag = false;
                break;
            }
        }    
        
        if (check_flag) {
            if (confirm("판매전환 승인처리하시겠습니까?")) {
                let header = [];
                for(let i = 0; i < checked.length; i++) {
                    const item = {};
                    item.release_no = checked[i][itmobj1["release_no"]];
                    item.sorder = checked[i][itmobj1["sorder"]];
                    item.change_date = checked[i][itmobj1["change_date"]];
                    header.push(item);
                }

                var data = {};
                data.type = "cust_btn1";
                data.menucode = "M000000640";
                data.header = JSON.stringify(header);
                data.UID = $("#UID").val();
                $.ajax({
                type: "POST",
                url: "/ajax.do",
                data: data,
                success: function(response, status, request) {
                    response = JSON.parse(response.trim());
                    if (response.result == "Success.") {
                        msg("판매전환 승인처리되었습니다!", null, "N");
                        $("#search_btn").trigger("click")
                    } else {
                        msg(response.result, null, "N");
                    }
                },
                error: function(xmlHttpRequest, txtStatus, errorThrown) {}
                });
            }
        } else {
            msg(error_msg);
        }
    }
})

// confirm cancel button
$("#cust_btn2").on("click", function () {
    const checked = grid1.getCheckedRows();
    if (checked.length > 0) {
        let check_flag = true;
        let error_msg = "";
        for(let i = 0; i < checked.length; i++) {
            if (nvl(checked[i][itmobj1["storage_status"]],"") !== "STATUS99") {
                error_msg = "아직 판매전환 승인되지 않은 건입니다."
                check_flag = false;
                break;
            }
        }    
        
        if (check_flag) {
            if (confirm("판매전환 승인취소하시겠습니까?")) {
                let header = [];
                for(let i = 0; i < checked.length; i++) {
                    const item = {};
                    item.release_no = checked[i][itmobj1["release_no"]];
                    item.sorder = checked[i][itmobj1["sorder"]];
                    item.change_date = checked[i][itmobj1["change_date"]];
                    header.push(item);
                }

                var data = {};
                data.type = "cust_btn2";
                data.menucode = "M000000640";
                data.header = JSON.stringify(header);
                data.UID = $("#UID").val();
                $.ajax({
                type: "POST",
                url: "/ajax.do",
                data: data,
                success: function(response, status, request) {
                    response = JSON.parse(response.trim());
                    if (response.result == "Success.") {
                        msg("판매전환 승인취소되었습니다!", null, "N");
                        $("#search_btn").trigger("click")
                    } else {
                        msg(response.result, null, "N");
                    }
                },
                error: function(xmlHttpRequest, txtStatus, errorThrown) {}
                });
            }
        } else {
            msg(error_msg);
        }
    }
})

// set excel download custom
$(".detail-exceldown").unbind("click");
$(".detail-exceldown").click(function() {
     var e = [],
        t = grid1.getColumns(),
        i = [];
    //for (T in t) t[T].hidden && i.push(t[T].name);
    for (T in t) i.push(t[T].name);
    var a = $("#MTETC5").val();
    if (null != a && "" != a && null != a && "undefined" != a) {
        var n = JSON.parse(decodeURIComponent(a));
        if (0 < n.length)
            for (var l = 0 in n)
                if (null != n[l].name && -1 < n[l].name.indexOf("MERGE")) {
                    var s = {};
                    s.name = n[l].name, s.childNames = n[l].childNames;
                    var d, r, o = !0;
                    for (d in n[l].childNames) {
                        var c = n[l].childNames[d]; - 1 < i.indexOf(c) && (o = !1)
                    }
                    o && (null != n[l].lang && "" != n[l].lang && (r = JSON.parse(decodeURIComponent(n[l].lang)), s.title = r[$("#lang").val()]), e.push(s))
                }
    }
    var m = $("#JSONHEADER").val();
    "Y" == $("#LOADYN").val() && $.isLoading({
        tpl: "<span class=\"isloading-wrapper %wrapper%\"><div class=\"loadingio-spinner-ellipsis-bus78131cg\"><div class=\"ldio-8a4hfl22cb6\"><div></div><div></div><div></div><div></div><div></div></div></div></span>"
    });
    var u = [];
    null != m && "" != m ? u = JSON.parse(m) : "Y" == $("#LOADYN").val() && setTimeout(function() {
        $.isLoading("hide")
    }, 500);
    var p = [],
        g = [];
    for (f in t) p.push(t[f]);
    if (0 < e.length) {
        var h = [],
            v = {},
            E = {};
        if (0 < g.length)
            for (var f = 0 in e) {
                var b = [];
                for (T in e[f].childNames) - 1 < g.indexOf(e[f].childNames[T]) || b.push(e[f].childNames[T]);
                e[f].childNames = b
            }
        for (f in e) {
            for (var T = 0 in h.push(e[f].childNames), e[f].childNames) {
                var L = "NONTITLE";
                0 == T && (L = e[f].title), v[e[f].childNames[T]] = L, E[e[f].childNames[T]] = e[f].childNames.length
            }
        }
    }
    var _ = [],
        N = [],
        D = [],
        O = [];
    for (T in e)
        for (f in _.push(e[T].title), N.push(e[T].childNames.length + ""), D.push(e[T].childNames[0]), h = e[T].childNames) O.push(h[f]);
    var I = {},
        a = $("#menucode").val();
    null != a && "" != a || (a = "download");
    m = I.MENUCODE = a;
      
    //hiden col not use when download excel
    const listArrHideInExcel = ["prog_status", "change_date_ser", "end_agency_cd","user_id","user_id_ser", "sorder"];
    const p_convert = p.filter(item => {
        if(item.name == "SCELLTP"){
            return false
        } else {
            return !listArrHideInExcel.includes(item.targetcode) && item.title != "SIMBIZSETTYPE"
        }
    })
    
    "" != menuNmobj[a] && null != menuNmobj[a] && (m = menuNmobj[a]), I.MENUNAME = encodeURIComponent(m), I.xlsData = encodeURIComponent(JSON.stringify(grid1.getRows())), I.colData = encodeURIComponent(JSON.stringify(p_convert)), I.compData1 = encodeURIComponent(JSON.stringify(_)), I.compData2 = encodeURIComponent(JSON.stringify(N)), I.compData3 = encodeURIComponent(JSON.stringify(D)), I.compData4 = encodeURIComponent(JSON.stringify(O)), $.fileDownload("bigXlsxDownload.do", {
        httpMethod: "POST",
        data: I,
        successCallback: function(e) {
            setTimeout(function() {
                "Y" == $("#LOADYN").val() && $.isLoading("hide")
            }, 10)
        },
        failCallback: function(e, t) {
            setTimeout(function() {
                "Y" == $("#LOADYN").val() && $.isLoading("hide")
            }, 10), msg(langObj.JS0000004, null, "Y")
        }
    })
});


$(window).on("resize", function(){
  var height = $(".right-content").height() - ($(".ui-widget-header").height() + $(".editer-content1").height() + 100);
    grid1.setHeight(height);
});