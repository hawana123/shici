function search(search_id,result_id) {
	/*
	window.open(
		document.getElementById("search_form").getAttribute("action_e") +
			" " +
			document.getElementById("search_value").value
	);
	return false;
	*/
	//console.log("search.....");

	var keyword = document.getElementById(search_id).value.trim().toLowerCase();

	if(keyword.length<2 ){
		$("#"+result_id).html("");
		return;
	}
	//console.log(keyword);
	$.ajax({
        url: "/search.xml",
        dataType: "xml",
        success: function( xmlResponse ) {
            // get the contents from search data
            var datas = $("entry", xmlResponse).map(function() {
                return {
                    title: $("title", this).text(),
                    content: $("content",this).text(),
					url: $("url",this).text()
                };
            }).get();
			//console.log(datas);
			var find_num = 0;
			var str = '<ul class=\"search-result-list\">';
			datas.forEach(function (data) {
				//console.log(data);
				if(find_num>20){
					return;
				}
				var isMatch = false;
				var index_title = -1;
				var index_content = -1;
				var data_title = data.title.trim().toLowerCase();
				if(data_title!==''){
					index_title = data_title.indexOf(keyword);
				}
				var data_content = data.content.trim().replace(/<[^>]+>/g, "").toLowerCase();
				if(data_content!==''){
					index_content = data_content.indexOf(keyword);
				}
				if (index_title >= 0 || index_content >= 0) {
					isMatch = true;
					find_num ++;
				}
				if (isMatch) {
					str += "<li><a href='" + data.url + "' class='search-result-title'>" + data_title + "</a>";
					if (index_content >= 0) {
						// cut out 100 characters
						var start = index_content - 20;
						var end = index_content + 40;

						if (start < 0) {
							start = 0;
						}
						if (start == 0) {
							end = 60;
						}
						if (end > data_content.length) {
							end = data_content.length;
						}
						var match_content = data_content.substring(start, end);
						// highlight all keywords
						//keyword.forEach(function (word) {
						var regS = new RegExp(keyword, "gi");
						match_content = match_content.replace(regS, "<em class=\"search-keyword\">" + keyword + "</em>");
						//});
						str += "<p class=\"search-result\">" + match_content + "...</p>"
					}
					str += "</li>";
				}
			});
            str += "</ul>";
			//console.log(str);
            document.getElementById(result_id).innerHTML = str;
        }
    });
}

let display = false;
function displayAll() {
	let elements = document.querySelectorAll(".catalogue .hidden");
	if (!display) {
		for (let elem of elements) {
			elem.style.display = "block";
			display = true;
		}
	} else {
		for (let elem of elements) {
			elem.style.display = "none";
			display = false;
		}
	}
}