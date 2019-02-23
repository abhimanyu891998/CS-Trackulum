$(document).ready(function(){
    
    //TO ADD UNIVERSITY
    $('#adduni_submit').on('click',function(){

        var uniname = $('#adduni_text').val();
        var unideptname = $('#adduni_textdept').val();
        $.ajax({

            url: '/users/adduniverify',
            data: {uniname: uniname , unideptname: unideptname},
            type: 'POST',
            success: function(data){
                if(data.status){
                if(data.status === 'failed')
                {   console.log("got failed");
                  
                    $('#adduni_status').html('<div class= "w3-container w3-red">University name does not match with your registered University name</div>');
                } 

                else 
                {
                    $('#adduni_status').html('<div class= "w3-container w3-green">University Successfully Added</div>');
                }
                }

                else
                {
                    var html = '<div class= "w3-container w3-red">ERROR: ' + data.sqlMessage + '</div>';
                    $('#adduni_status').html(html);
                }
                                    }


        });

        $('body, html, #containerDiv').scrollTop(0);

    });

    //TO ADD COURSE
    $('#addcourse_submit').on('click',function(){

        var uname = $('#addcourse_uniname option:selected').text();
        var uid = $('#addcourse_uniname option:selected').val();
        var coursename = $('#addcourse_coursename').val();
        var coursetype = $('#addcourse_coursetype option:selected').text();
        var lecturehours = $('#addcourse_lecturehours').val();
        var labhours = $('#addcourse_labhours').val();
        var academicyear = $('#addcourse_academicyear').val();

        $.ajax({
            url: '/users/addcourseverify',
            type: 'POST',
            data: {uname:uname,uid:uid,coursename:coursename,coursetype:coursetype,lecturehours:lecturehours,labhours:labhours,academicyear:academicyear},
            success: function(data){
                if(data.status)
                {
                    if(data.status == "failed")
                    {
                        $('#addcourse_status').html('<div class= "w3-container w3-red">University name does not match with your registered University name</div>');
                    }

                    else
                    {
                        $('#addcourse_status').html('<div class= "w3-container w3-green">Course successfully added to the database</div>');
                    }


                }

                else
                {
                    var html = '<div class= "w3-container w3-red">ERROR: ' + data.sqlMessage + '</div>';
                    $('#addcourse_status').html(html);

                }
            }

        });

        $('body, html, #containerDiv').scrollTop(0);
              

    });


    //TO ADD MODULE
    $('#addmodule_submit').on('click',function(){

        var uname = $('#addmodule_uniname option:selected').text();
        var uid = $('#addmodule_uniname option:selected').val();
        var coursename = $('#addmodule_coursename option:selected').text();
        var courseid = $('#addmodule_coursename option:selected').val();
        var modulecode = $('#addmodule_modulecode').val();
        var modulename = $('#addmodule_modulename').val();
        var moduleinfo = $('#addmodule_moduleinfo').val();
        var prerequisite = $('#addmodule_prerequisite').val();
        var corequisite = $('#addmodule_corequisite').val();

        $.ajax({

            url: '/users/addmoduleverify',
            type: 'POST',
            data: {uname:uname,uid:uid,coursename:coursename,courseid:courseid,modulecode:modulecode,modulename:modulename,moduleinfo:moduleinfo,prerequisite:prerequisite,corequisite:corequisite},
            success: function(data){

                if(data.status){
                    if(data.status === "failed")
                    {
                        $('#addmodule_status').html('<div class= "w3-container w3-red">University name does not match with your registered University name</div>');
                    }

                    else
                    {
                        $('#addmodule_status').html('<div class= "w3-container w3-green">Module successfully added to the database</div>');
                    }
                }

                else
                {
                    var html = '<div class= "w3-container w3-red">ERROR: ' + data.sqlMessage + '</div>';
                    $('#addmodule_status').html(html);

                }

            }

        });
        

        $('body, html, #containerDiv').scrollTop(0);


    });





});
