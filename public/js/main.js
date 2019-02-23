$(document).ready(function(){
    



//For filtering courses


//UG Courses
function UGCoursefilter() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("ugInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("ugcourses");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

//PG Courses
function PGCoursefilter() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("pgInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("pgcourses");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}


});