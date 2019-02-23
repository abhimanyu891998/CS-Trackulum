$(document).ready(function(){
    
    $(".sql_table_list").on('click',function(){
        $.ajax({

            url: '/sql_db_dat/?queryname=SELECT * FROM ' + $(this).data('id'),
            success: function(data){
                
                var fields = data.fields;
                var rowdata = data.results;
                
                var html = '<table border="1" cellpadding="7" cellspacing="7" class="w3-table w3-striped"><tr>';
                for(var i=0 ; i<fields.length ; i++)
                {
                    html += '<th>' + fields[i].name + '</th>';
                }

                html+= '</tr>';

                for(var j = 0 ; j<rowdata.length ; j++)
                {
                    html+= '<tr>';
                    for( var k=0 ; k<fields.length ; k++)
                    {
                        
                        html+= '<td>'  + (rowdata[j])[fields[k].name] + '</td>';
                    }
                    html+= '</tr>';

                }

                html+= '</table>';

                $('#testdat').html(html);


                

            } 

        });
    });


    $('#GO').on('click',function(){
        var query = $('#query_text').val();

        $.ajax({

            url: '/sql_db_dat/?queryname=' + query,
            success: function(data){
                
                if(data.status['status'] === "passed"){
                var fields = data.fields;
                var rowdata = data.results;
                
                var html = '<table  border="1" cellpadding="7" cellspacing="7" class="w3-table w3-striped"><tr>';
                for(var i=0 ; i<fields.length ; i++)
                {
                    html += '<th>' + fields[i].name + '</th>';
                }

                html+= '</tr>';

                for(var j = 0 ; j<rowdata.length ; j++)
                {
                    html+= '<tr>';
                    for( var k=0 ; k<fields.length ; k++)
                    {
                        
                        html+= '<td>'  + (rowdata[j])[fields[k].name] + '</td>';
                    }
                    html+= '</tr>';

                }
                
                html+= '</table>';

                $('#testdat').html(html);
                                                        }    
                                                        
                else
                {
                    var errhtml = 'ERROR CODE: ' + data.err.code + '<br>  ERROR MESSAGE: ' + data.err.sqlMessage;
                    $('#testdat').html(errhtml);
                }


                

            } 

        });

    });
});