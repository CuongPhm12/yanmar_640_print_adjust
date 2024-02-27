$("#table_no_show").hide();

function getData() {
  let from_date_ym = sessionStorage.getItem("640_from_date_ym");
  let to_date_ym = sessionStorage.getItem("640_to_date_ym");
  let user_id = $("#user_id").text().trim();
  //   console.log(itemCode);
  const data_Send = {};
  data_Send.menucode = "M000000640";
  data_Send.type = "get_data";
  data_Send.header = JSON.stringify({
    from_date_ym: from_date_ym,
    to_date_ym: to_date_ym,
    user_id: user_id,
  });
  $.ajax({
    type: "post",
    url: "/ajax.do",
    data: data_Send,
    async: false,
    success: function (response, status, request) {
      const { print_data, sql } = JSON.parse(response.trim());
      console.log({ print_data, sql });

      let option_name = print_data.option_name;

      $(".option_name_id").text(option_name);

      let storage_status = print_data[0].storage_status;
      if (storage_status == "STATUS99") {
        $("#prog_status_id").text("승인 완료");
      }
      //   else{
      //       $("#prog_status_id").text('not access');
      //   }
    },
    error: function (xmlHttpRequest, txtStatus, errorThrown) {
      console.log("erorr");
    },
  });
}
getData();
