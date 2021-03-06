jQuery(document).ready(function($){
       
    if( 'undefined' == typeof( apl_admin_settings ) )
    {
        return;
    }
        
    var plugin_url = apl_admin_settings.plugin_url;
    
    var savePresetNonce = apl_admin_settings.savePresetNonce;
    var deletePresetNonce =  apl_admin_settings.deletePresetNonce;
    var restorePresetNonce = apl_admin_settings.restorePresetNonce;
    var exportNonce = apl_admin_settings.exportNonce;
    var importNonce = apl_admin_settings.importNonce;
    var saveSettingsNonce = apl_admin_settings.saveSettingsNonce;
    
    var presetObj = apl_admin_settings.presetDb;
    presetObj = JSON.parse(presetObj);
    
    var postTax = apl_admin_settings.postTax;
    //postTax = JSON.parse(postTax);
    
    var taxTerms = apl_admin_settings.taxTerms;
    
  
    
    
    function setPHPOutput(preset_name)
    {
        //$('#presetPHP').html('PHP code: <code>if(function_exists("kalinsPost_show"){kalinsPost_show("' + data.preset_name + '");}</code>');
      
        //$('#presetPHP').html('PHP code: <code><<b>?php</b> if(function_exists("APL_display")){APL_display("' + preset_name + '");} <b>?</b>></code>');
        $('#presetPHP').html('PHP code: <code><<b>?php</b> if (method_exists($advanced_post_list, "APL_display")){echo $advanced_post_list->APL_display("' + preset_name + '");} <b>?</b>></code>');
    }
    //build the file table - we build it all in javascript so we can 
    // simply rebuild it whenever an entry is added through ajax
    function buildPresetTable()
    {
      
        function tc(str)
        {
            return "<td style='border:solid 1px' align='center'>" + str + "</td>";
        }
      
        var tableHTML = "<table style='border:solid 1px' width='725' border='1' cellspacing='1' cellpadding='3'><tr><th scope='col'>#</th><th scope='col'>Preset Name</th><th scope='col'>Load</th><th scope='col'>Download</th><th scope='col'>Delete</th><th scope='col'>Shortcode</th></tr>";
      
        var count = 0;
        for(var i in presetObj)
        {
            var shortcode = '[post_list name="' + i + '"]';
            tableHTML += "<tr>" + tc(count) + tc(i) + tc("<button name='btnLoad_" + count + "' id='btnLoad_" + count + "'>Load</button>") + tc("<button name = 'btnDownload_" + count + "' id = 'btnDownload_" + count + "'>Download</button>") + tc("<button name='btnDelete_" + count + "' id='btnDelete_" + count + "'>Delete</button>") + tc(shortcode) + "</tr>";
            count++;
        }
      
        tableHTML += "</table>";
      
        $('#presetListDiv').html(tableHTML);
      
        count = 0;
        for(j in presetObj)
        {
        
            $('#btnDelete_' + count).attr('presetname', j);
            $('#btnDelete_' + count).click(function()
            {
                if(confirm("Are you sure you want to delete " + $(this).attr('presetname') + "?"))
                {							
                    deletePreset($(this).attr('presetname'));
                }
            });
            $('#btnDelete_' + count).button();
        
            $('#btnDownload_' + count).attr('presetname', j);
            $('#btnDownload_' + count).click(function()
            {
                //FIX - REPLACE PHP CODE
                var name = $(this).attr('presetname');
                apl_preset_export(name);
                //var url = plugin_url + "includes/export.php?presetname=" + name;
                //alert(url);
          
                //window.location = url;
            });
            $('#btnDownload_' + count).button();
        
            $('#btnLoad_' + count).attr('presetname', j);
            $('#btnLoad_' + count).click(function()
            {				
                loadPreset($(this).attr('presetname'));
            });
            $('#btnLoad_' + count).button();
        
            count++;
        }	
    }
    function apl_preset_export(preset_name)
    {
        var exportData = { 
            action : 'APL_handler_export',
            _ajax_nonce : exportNonce,
            export_type : 'preset',
            filename : $.trim(preset_name)
        };
        
        
        
        //TESTING MODE SWITCH
        //formData.append('alpha_mode', 'true');
        jQuery.ajax({
            url: ajaxurl,
            type: 'POST',
            //cache: false,
            //contentType: false,
            //processData: false,
            
            data: exportData,
            
            beforeSend: function(jqXHR, settings){
                var element = document.getElementById("APL_exportIF");
                if (element != null)
                {
                    element.parentNode.removeChild(element);
                }
            },
            dataFilter: function(data, type){
                var dataRtn = convert_JSON_data(data);
                return dataRtn;
            },
            success: function(data, textStatus, jqXHR){
                //console.log("Hooray, it worked!");
                if (data._status != 'success')
                {
                    apl_alert(data._error, (data._status.charAt(0).toUpperCase() + data._status.slice(1)));
                }
                else
                {
                    var paramStr = '';
                    paramStr += '?_ajax_nonce=' + data._ajax_nonce;
                    paramStr += '&action='      + data.action;
                    paramStr += '&filename='    + data.filename;
                    

                    var elemIF = document.createElement("iframe");
                    elemIF.id = 'APL_exportIF'
                    elemIF.style.display = "none";
                    elemIF.src = ajaxurl + paramStr;

                    document.body.appendChild(elemIF);
                    
                    //optionsHeader('Exporting Data Successful');
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert(errorThrown.stack);
            },
            complete: function(jqXHR, textStatus){
                
            }
        });
    }
    ////////////////////////////////////////////////////////////////////////////
    //// AJAX FUNCTIONS ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    function deletePreset(id)
    {
        //alert("deleting: " + id);
      
        var data = { 
            action: 'APL_handler_delete_preset',
            _ajax_nonce : deletePresetNonce
        }
      
        data.preset_name = id;
      
        $('#createStatus').html("Deleting preset...");
      
        // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
        jQuery.post(ajaxurl, data, function(response) 
        {
            //alert(response);
        
            var startPosition = response.indexOf("{");
            var responseObjString = response.substr(startPosition, response.lastIndexOf("}") - startPosition + 1);
        
            var newFileData = JSON.parse(responseObjString);
        
            /*if(newFileData.status == "success"){
                    $('#createStatus').html("Preset deleted successfully.");
                }else{
                    $('#createStatus').html(response);
                }*/
        
            presetObj = newFileData;//.preset_arr;
        
            buildPresetTable();
        
            $('#createStatus').html("Preset deleted successfully.");
        
        });
    }
    function loadPreset(id)
    {
      ////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////
        $('#divPreview').html("");
        var newValues = presetObj[id];
        $("#txtPresetName").val(id);

        set_postTax(newValues._postTax);
        set_parent(newValues._postParents);

        $("#txtDisplayAmount").val(newValues["_listCount"]);
        $("#slctOrderBy").val(newValues["_listOrderBy"]);
        $('#slctOrderBy').multiselect('refresh');
        $("#slctOrder").val(newValues["_listOrder"]);
        $('#slctOrder').multiselect('refresh');
        
        var postVisibilityArr = jQuery.makeArray(newValues._postVisibility);
        $('#cboPostVisibility').val(postVisibilityArr);
        $('#cboPostVisibility').multiselect('refresh');
        var postStatusArr = jQuery.makeArray(newValues._postStatus);
        $('#cboPostStatus').val(postStatusArr);
        $('#cboPostStatus').multiselect('refresh');

        $("#slctUserPerm").val(newValues["_userPerm"]);//ADDED //string
        $('#slctUserPerm').multiselect('refresh');
        $("#chkIgnoreSticky").attr('checked', newValues["_listIgnoreSticky"]);//ADDED //boolean
        $("#chkExcldCurrent").attr('checked', newValues["_listExcludeCurrent"]); //boolean
        $("#chkExcldDuplicates").attr('checked', newValues["_listExcludeDuplicates"]);//ADDED //boolean

        var tmpString = '';
        for (var i in newValues["_listExcludePosts"])
        {
            if (newValues["_listExcludePosts"][i] != 0)
            {
                tmpString += newValues["_listExcludePosts"][i];
                if( i < (newValues["_listExcludePosts"].length - 1) )
                {
                    tmpString += ',';
                }
            }
                
        }
        $("#txtExcldPosts").val(tmpString);//ADDED //string
        
        var postAuthorIDs = new Array();
        if (newValues["_postAuthorOperator"] === 'include' || newValues["_postAuthorOperator"] === 'exclude')
        {
            $("#slctAuthorOperator").val(newValues["_postAuthorOperator"])
            $("#cboAuthorIDs").multiselect("enable");
            
            if (newValues["_postAuthorIDs"].length > 0)
            {
                postAuthorIDs = newValues["_postAuthorIDs"];
            }
            $("#cboAuthorIDs").val(postAuthorIDs);//ADDED //array
            $('#cboAuthorIDs').multiselect('refresh');
            
            
        }
        else if (newValues["_postAuthorOperator"] === 'none')
        {
            $("#slctAuthorOperator").val(newValues["_postAuthorOperator"])
            $("#cboAuthorIDs").val(postAuthorIDs);
            $("#cboAuthorIDs").multiselect("disable");
            $('#cboAuthorIDs').multiselect('refresh');
        }
        else
        {
            $("#slctAuthorOperator").val('none')
            $("#cboAuthorIDs").val(postAuthorIDs);
            $("#cboAuthorIDs").multiselect("disable");
            $('#cboAuthorIDs').multiselect('refresh');
        }
        $('#slctAuthorOperator').multiselect('refresh');

        $("#txtExitMsg").val(newValues["_exit"]);
        $("#txtBeforeList").val(newValues["_before"]);
        $("#txtContent").val(newValues["_content"]);
        $("#txtAfterList").val(newValues["_after"]);
      
      ////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////
      
        setPHPOutput(id);
      
        setNoneHide();
    }
    
    function set_postTax(post_tax)
    {
        
        reset_postTax();
        for (var post_type_name in post_tax)
        {
            
            for (var taxonomy_name in post_tax[post_type_name]['taxonomies'])
            {
                $("#chkReqTaxonomy-" + post_type_name + "-" + taxonomy_name).attr('checked', post_tax[post_type_name]['taxonomies'][taxonomy_name]['require_taxonomy']);
                $("#chkReqTerms-" + post_type_name + "-" + taxonomy_name).attr('checked', post_tax[post_type_name]['taxonomies'][taxonomy_name]['require_terms']);
                $("#chkIncldTerms-" + post_type_name + "-" + taxonomy_name).attr('checked', post_tax[post_type_name]['taxonomies'][taxonomy_name]['include_terms']);
                
                for (var term in post_tax[post_type_name]['taxonomies'][taxonomy_name]['terms'])
                {
                    $("#chkTerm-" + post_type_name + "-" + taxonomy_name + '-' + post_tax[post_type_name]['taxonomies'][taxonomy_name]['terms'][term]).attr('checked',true)
                }
                
            }
        }
    }
    function reset_postTax()
    {
        for (var post_type_name in postTax)
        {
            for (var taxonomy_name in postTax[post_type_name].taxonomies)
            {
                $("#chkReqTaxonomy-" + post_type_name + "-" + taxonomy_name).attr('checked', false);
                $("#chkReqTerms-" + post_type_name + "-" + taxonomy_name).attr('checked', false);
                $("#chkIncldTerms-" + post_type_name + "-" + taxonomy_name).attr('checked', false);
                
                var terms = taxTerms[taxonomy_name].terms;
                
                $("#chkTerm-" + post_type_name + "-" + taxonomy_name + '-0').attr('checked',false)
                for (var term in terms)
                {
                    $("#chkTerm-" + post_type_name + "-" + taxonomy_name + '-' + terms[term]).attr('checked',false)
                }
            }
        }
    }
    function set_parent(parentArr)
    {
        reset_parent();
        //parentArr.toArray();
        parentArr = jQuery.makeArray(parentArr); 
        
        for (var post_type_name in postTax)
        {
            
            $("#slctParentSelector-" + post_type_name).val(parentArr);
            $("#slctParentSelector-" + post_type_name).multiselect('refresh');
            //$("#slctParentSelector-" + post_type_name).each(object, callback);
            
        }
        
    }
    function reset_parent()
    {
        
        for (var post_type_name in postTax)
        {
            $("#slctParentSelector-" + post_type_name).val([]);
            $("#slctParentSelector-" + post_type_name).multiselect('refresh');
            
        }
        
    }
    
    
    
    ////////////////////////////////////////////////////////////////////////////
    //// AJAX BUTTONS //////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    $('#btnSavePreset').click(function()
    {
        if (!save_preset_precheck())
        {
            save_preset();
        }
    });
    //// RETURN TRUE IF AN EVENT OCCURED
    function save_preset_precheck()
    {
        if (!check_required())
        {
            
            if (!check_preset_name())
            {
                return false;
            }
            return true;
        }
        return true;
        
    }
    function check_required()
    {
        //var event_occured = false;
        for (var post_type_name in postTax)
        {
            var require_taxonomy = new Array();
            for (var taxonomy_name in postTax[post_type_name].taxonomies)
            {
                require_taxonomy[taxonomy_name] = new Array();
                require_taxonomy[taxonomy_name]['require'] = $("#chkReqTaxonomy-" + post_type_name + "-" + taxonomy_name).is(':checked');
                var require_terms = $("#chkReqTerms-" + post_type_name + "-" + taxonomy_name).is(':checked');
                var include_terms = $("#chkIncldTerms-" + post_type_name + "-" + taxonomy_name).is(':checked');
                require_taxonomy[taxonomy_name]['count'] = 0;
                
                var terms = taxTerms[taxonomy_name].terms;
                for (var term in terms)
                {
                    if ($("#chkTerm-" + post_type_name + "-" + taxonomy_name + '-' + terms[term]).is(':checked'))
                    {
                        require_taxonomy[taxonomy_name]['count']++;
                    }
                }


                if (require_taxonomy[taxonomy_name]['count'] < 2 && require_terms === true && include_terms === false)
                {
                    $( "#d03" ).dialog({
                        resizable: false,
                        height:192,
                        modal: true,
                        buttons: {
                            "Ok": function() 
                            {
                                $( this ).dialog( "close" );
                            }
                        }
                    });
                    return true;
                }
                else if (require_taxonomy[taxonomy_name]['count'] < 2 && require_taxonomy[taxonomy_name]['require'] == true && include_terms == false)
                {
                    $( "#d04" ).dialog({
                        resizable: false,
                        height:224,
                        modal: true,
                        buttons: {
                            "Ok": function() 
                            {
                                $( this ).dialog( "close" );
                            }
                        }
                    });
                    return true;
                }

            }
            
            for(var taxonomy01 in require_taxonomy)
            {
                if (require_taxonomy[taxonomy01]['require'] == true)
                {
                    var other_taxonomy_used = false;
                    for(var taxonomy02 in require_taxonomy)
                    {
                        if (require_taxonomy[taxonomy02]['count'] > 0 && taxonomy01 != taxonomy02)
                        {
                            other_taxonomy_used = true;
                        }
                    }
                    if (other_taxonomy_used == false)
                    {

                        $( "#d05" ).dialog(
                        {
                            resizable: false,
                            height:224,
                            modal: true,
                            buttons: 
                            {
                                "Ok": function() 
                                {
                                    $( this ).dialog( "close" );
                                }
                            }
                        });
                        return true;
                                
                    }
                }
                
            }

        }
        return false;
    }
    function check_preset_name()
    {
        var preset_name = $("#txtPresetName").val();
        if(presetObj[preset_name])
        {				   
            $( "#d01" ).dialog({
                resizable: false,
                height:192,
                modal: true,
                buttons: {
                    "Save Preset": function() 
                    {
                        $( this ).dialog( "close" );
                        save_preset();
                    },
                    "Cancel": function() 
                    {
                        $( this ).dialog( "close" );
                        
                    }
                }
            });
            return true;
        }
        else if(preset_name == "")
        {
            $( "#d02" ).dialog({
                resizable: false,
                height:192,
                modal: true,
                buttons: {
                    "Ok": function() 
                    {
                        $( this ).dialog( "close" );
                        
                    }
                }
            });
            return true;
        }
        return false;
        
    }
    
    function save_preset()
    {
        var data = {
            action: 'APL_handler_save_preset',
            _ajax_nonce : savePresetNonce
        };
        //css style bug fix
        var btn_height = $('#btnSavePreset').height();
        var btn_width = $('#btnSavePreset').width();
        $('#btnSavePreset').html("Saving...");
        $('#btnSavePreset').height(btn_height);
        $('#btnSavePreset').width(btn_width);
        
        data.presetName = $("#txtPresetName").val();
        
        
        data.postParents = JSON.stringify(get_parent());
        data.postTax = JSON.stringify(get_postTax());
        
        
        data.count = $("#txtDisplayAmount").val();
        data.orderBy = $("#slctOrderBy").val();
        data.order = $("#slctOrder").val();
        
        data.postVisibility = $('#cboPostVisibility').val();//array
        data.postVisibility = JSON.stringify(data.postVisibility);
        data.postStatus = $("#cboPostStatus").val();//MODIFIED //array
        if (data.postStatus === null)
        {
            data.postStatus = new Array('any');
        }
        data.postStatus = JSON.stringify(data.postStatus);
        
        data.userPerm = $("#slctUserPerm").val();//ADDED //string
        data.ignoreSticky = $("#chkIgnoreSticky").is(':checked');//ADDED //boolean
        data.excludeCurrent = $("#chkExcldCurrent").is(':checked'); //boolean
        data.excludeDuplicates = $("#chkExcldDuplicates").is(':checked');//ADDED //boolean
        
        data.excludePosts = $("#txtExcldPosts").val();//ADDED //string - needs to be changed to an array and json string
        if (data.excludePosts === "")
        {
            data.excludePosts = new Array();
        }
        else
        {
            data.excludePosts = data.excludePosts.split(",");
        }
        data.excludePosts = JSON.stringify(data.excludePosts);
        
        data.authorOperator = $("#slctAuthorOperator").val();//ADDED //string
        
        data.authorIDs = $("#cboAuthorIDs").val();//ADDED //array
        if (data.authorIDs === null)
        {
            data.authorIDs =  new Array();
        }
        data.authorIDs = JSON.stringify(data.authorIDs);
        
        data.exit = $("#txtExitMsg").val();
        data.before = $("#txtBeforeList").val();
        data.content = $("#txtContent").val();
        data.after = $("#txtAfterList").val();
        
        
        setPHPOutput(data.presetName);
      
        
      
        //since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
        jQuery.post(ajaxurl, data, function(response) 
        {

            //alert(response);

            var startPosition = response.indexOf("{");
            if (startPosition > 10)
            {
                apl_alert(response, 'Error');
            }
            var responseObjString = response.substr(startPosition, response.lastIndexOf("}") - startPosition + 1);

            //alert(responseObjString);

            var newFileData = JSON.parse(responseObjString);

            presetObj = newFileData.preset_arr;
            buildPresetTable();
            $('#btnSavePreset').html("Save Preset");

            if($("#chkShowPreview").is(':checked'))
            {
                $('#divPreview').html(newFileData.previewOutput);
            }
            else
            {
                $('#divPreview').html("");
            }


        });
    }
    
    function get_postTax()
    {
        var rtnObject = new Object();
        var tmp_post_types = new Object();
        for (var post_type_name in postTax)
        {
            var tmp_taxonomies = new Object();
            var post_type_used = false;
            for (var taxonomy_name in postTax[post_type_name].taxonomies)
            {
                var tmp_terms = new Array();
                var i = 0;
                var terms = taxTerms[taxonomy_name].terms;
                if ($("#chkTerm-" + post_type_name + "-" + taxonomy_name + '-' + 0).is(':checked'))
                {
                    tmp_terms[i] = 0;
                    i++;
                }
                else
                {
                    for (var term in terms)
                    {
                        if ($("#chkTerm-" + post_type_name + "-" + taxonomy_name + '-' + terms[term]).is(':checked'))
                        {
                            tmp_terms[i] = terms[term];
                            i++;
                        }
                    }
                }
                
                if (i > 0 || $("#chkIncldTerms-" + post_type_name + "-" + taxonomy_name).is(':checked'))
                {
                    tmp_taxonomies[taxonomy_name] = new Object();
                    tmp_taxonomies[taxonomy_name].require_taxonomy = $("#chkReqTaxonomy-" + post_type_name + "-" + taxonomy_name).is(':checked');
                    tmp_taxonomies[taxonomy_name].require_terms = $("#chkReqTerms-" + post_type_name + "-" + taxonomy_name).is(':checked');
                    tmp_taxonomies[taxonomy_name].include_terms = $("#chkIncldTerms-" + post_type_name + "-" + taxonomy_name).is(':checked');
                    tmp_taxonomies[taxonomy_name].terms = tmp_terms;

                    post_type_used = true;
                }
            }
            if (post_type_used)
            {
                tmp_post_types[post_type_name] = new Object();
                
                tmp_post_types[post_type_name].taxonomies = tmp_taxonomies;
                
            }
            
        }
        rtnObject = tmp_post_types;
        return rtnObject;
    }
    function get_parent()
    {
        //Custom unique array function to remove any duplicates, especially
        // the current page setting.
        var unique = function(origArr) 
        {  
            var newArr = [],  
            origLen = origArr.length,  
            found,  
            x, y;  
  
            for ( x = 0; x < origLen; x++ ) 
            {  
                found = undefined;  
                for ( y = 0; y < newArr.length; y++ ) 
                {  
                    if ( origArr[x] === newArr[y] ) 
                    {  
                        found = true;  
                        break;  
                    }  
                }  
                if ( !found) newArr.push( origArr[x] );  
            }  
            return newArr;  
        };
        
        var parentIDs = new Array();
        var rtnArray = new Array();
        
        var i = 0;
        for (var post_type_name in postTax)
        {
            parentIDs =  $("#slctParentSelector-" + post_type_name).val();
            
            if (parentIDs !== null)
            {
                for (var j = 0; j < parentIDs.length; j++, i++)
                {
                    rtnArray[i] = parentIDs[j];
                }
            }
        }
        rtnArray = unique(rtnArray);
        return rtnArray;
    }
    
    
    function optionsHeader(output)
    {
        $('#optionsHeader').html('<b>' + output + '</b>');
        $('#optionsHeader').fadeOut(5000, function(){
            $('#optionsHeader').show();
            $('#optionsHeader').html('<h3 style="margin: 0px;">General Settings</h3>');
        });
        
    }
    
    
    $('#btnSaveSettings').click(function(){
        
        save_settings();
        
    });
    
    function save_settings()
    {
        var data = {
            action : 'APL_handler_save_settings',
            _ajax_nonce : saveSettingsNonce
        }
      
        var deleteDb = false;
        if ($("#rdoDeleteDbTRUE").is(':checked'))
        {
            deleteDb = true;
        }
        else if ($("#rdoDeleteDbFALSE").is(':checked'))
        {
            deleteDb = false;
        }
        data.deleteDb = deleteDb;
        
        data.theme = $('#slctUITheme').val();
        
        var defaultExit = false;
        if ($("#rdoDefaultExitMsgTRUE").is(':checked'))
        {
            defaultExit = true;
        }
        else if ($("#rdoDefaultExitMsgFALSE").is(':checked'))
        {
            defaultExit = false;
        }
        data.defaultExit = defaultExit;
        data.defaultExitMsg = $("#txtDefaultExitMsg").val();
        
        
        jQuery.post(ajaxurl, data, function(response)
        {
            var startPosition = response.indexOf("{");
            var responseObjString = response.substr(startPosition, response.lastIndexOf("}") - startPosition + 1);
            var newFileData = JSON.parse(responseObjString);
            
            
            optionsHeader('Options Saved');
            loadjscssfile('http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.21/themes/' + newFileData.theme + '/jquery-ui.css', 'css');
        });
        
    }
    function loadjscssfile(filename, filetype)
    {
        var fileref;
        //if filename is a external JavaScript file
        if (filetype === "js")
        { 
            fileref=document.createElement('script');
            fileref.setAttribute("type","text/javascript");
            fileref.setAttribute("src", filename);
        }
        //if filename is an external CSS file
        else if (filetype === "css")
        { 
            fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
        }
        if (typeof fileref !== "undefined")
        {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
            
    }
    function check_string_for_errors(input_string)
    {
        var iChars = "<>:\"/\\|,?*";
      
        for (var i = 0; i < input_string.value.length; i++) 
        {
            if (iChars.indexOf(input_string.value.charAt(i)) != -1) 
            {
                apl_alert("<p><span class=\"ui-icon ui-icon-alert\" style=\"float:left; margin:0 7px 75px 0;\"></span>Cannot use (< > : \" / \\ | , ? *).<br/>Please rename your filename.</p>", "Illegal Characters");
                return true;
            }
        
        }
        return false;
    }
    $('#txtExportFileName').change(function()
    {
        check_string_for_errors(document.frmExport.txtExportFileName);
    });
    
    function apl_alert(output_msg, title_msg)
    {
        if (!title_msg)
            title_msg = 'Alert';
        
        if (!output_msg)
            output_msg = 'No Message to Display.';
        
        $("<div></div>").html(output_msg).dialog({
            title: title_msg,
            resizable: true,
            modal: true,
            buttons: {
                "Ok": function() 
                {
                    $( this ).dialog( "close" );

                }
            }
        });
    }
    
    function convert_JSON_data(json_string)
    {
        //CONVERT RETURN/RESPONSE DATA (dataRtn)
        //SYNTAX .substr(start, length)
        //SYNTAX .substring(start, end)
        var tmpData = $.trim(json_string);
        
        
        //CHECKS DATA FOR ADDITIONAL CONTENT, FOR EX. PHP ERRORS
        //TODO ADD SUPPORT OF MULTI LANGUAGES WITH MULTILINGUAL
        var cData = tmpData.split("{\"_msg\"");
        if (cData[0].indexOf("<br />\n<font size='1'>") != -1 && cData[0].indexOf("</table></font>") != -1 && cData.length != 1)
        {
            cData[0] = $.trim(cData[0]);
            var eData = cData[0].split("<br />\n<font size='1'>");
            
            //DISPLAY EACH PHP ERROR INDIVIDUALLY
            //STARTED INDEX AT 1 SINCE eData[0] IS AN EMPTY STRING CREATED BY .split()
            for (i = 1; i < eData.length; i++)
            {
                $("<div></div>").html("<br /><font size='2'>" + eData[i]).dialog({
                    title: 'PHP Error',
                    resizable: true,
                    minWidth: 576,
                    modal: true,
                    buttons: {
                        "Ok": function() 
                        {
                            $( this ).dialog( "close" );
                        }
                    }
                });
            }
            return false;
        }
        
        var rtnData = JSON.parse(tmpData.substring(tmpData.indexOf("{\"_msg\""), tmpData.lastIndexOf("}") + 1));
        
        return rtnData;
    }
    
    
    ////////////////////////////////////////////////////////////////////////////
    //// EXPORT ////////////////////////////////////////////////////////////////
    $('#frmExport').submit(function(){
        //CHECK USER SIDE
        if (apl_export_errors())
        {
            return false;
        }
        apl_db_export();
        return false;
    });

    function apl_export_errors()
    {
        var var_filename = document.frmExport.txtExportFileName.value;
        if (check_string_for_errors(document.frmExport.txtExportFileName))
        {
            return true;
        }
        if (document.frmExport.txtExportFileName.value == "")
        {
            apl_alert("A filename doesn't exist.\nPlease enter a filename before exporting.", "Filename Required");
            return true;
        }
        return false;
    }
    
    function apl_db_export()
    {
        var formData = new FormData();
        formData.append('action', 'APL_handler_export');
        formData.append('_ajax_nonce', exportNonce);
        formData.append('export_type', 'database');
        formData.append('filename', $.trim($('#txtExportFileName').val()));
        
        //TESTING MODE SWITCH
        //formData.append('alpha_mode', 'true');
        jQuery.ajax({
            url: ajaxurl,
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            
            data: formData,
            
            beforeSend: function(jqXHR, settings){
                var a1 = jqXHR;
                var a2 = settings;
                var element = document.getElementById("APL_exportIF");
                if (element != null)
                {
                    element.parentNode.removeChild(element);
                }
            },
            dataFilter: function(data, type){
                var dataRtn = convert_JSON_data(data);
                return dataRtn;
            },
            success: function(data, textStatus, jqXHR){
                if (data._status != 'success')
                {
                    apl_alert(data._error, (data._status.charAt(0).toUpperCase() + data._status.slice(1)));
                }
                else
                {
                    var paramStr = '';
                    paramStr += '?_ajax_nonce=' + data._ajax_nonce;
                    paramStr += '&action='      + data.action;
                    paramStr += '&filename='    + data.filename;
                    

                    var elemIF = document.createElement("iframe");
                    elemIF.id = 'APL_exportIF'
                    elemIF.style.display = "none";
                    elemIF.src = ajaxurl + paramStr;

                    document.body.appendChild(elemIF);
                    
                    optionsHeader('Exporting Data Successful');
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert(errorThrown.stack);
            },
            complete: function(jqXHR, textStatus){
                var a1 = jqXHR;
                var a2 = textStatus;
                //
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////
    //// IMPORT ////////////////////////////////////////////////////////////////
    $('#frmImport').submit(function(e)
    {
        e.preventDefault();
        //CHECK USER SIDE
        if (apl_import_errors())
        {
            return false;
        }
        apl_import_db();
        return false;
    });
    
    function apl_import_errors()
    {
        for (var i = 0; i < document.frmImport.importType.length; i++)
        {
            if (document.frmImport.importType[i].checked)
            {
                var importType = document.frmImport.importType[i].value;
            }
        }
        
        
        if ($('#fileImportData').val() == '' && importType == 'file')
        {
            alert('No file(s) selected. Please choose a JSON file to upload.');
            return true;
        }
        if ($('#fileImportData').val() != '')
        {
            var ext = $('#fileImportData').val().split('.').pop().toLowerCase();
            if($.inArray(ext, ['json']) == -1) 
            {
                alert('Invalid file type. Please choose a JSON file to upload.');
                return true;
            }
        }
        
        return false;
    }
    function apl_import_db()
    {
        
        var formData = new FormData();
        jQuery.each($('#fileImportData')[0].files, function(i, file) {
            formData.append('uploadFile-'+i, file);
        });
        formData.append('action', 'APL_handler_import');
        formData.append('_ajax_nonce', importNonce);
        
        var rdoImport = document.frmImport.importType;
        for (var i = 0; i < rdoImport.length; i++)
        {
            if (rdoImport[i].checked)
            {
                formData.append('import_type', rdoImport[i].value);
            }
        }
        
        //TESTING MODE SWITCH
        //formData.append('alpha_mode', 'true');
        jQuery.ajax({
            url: ajaxurl,
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            
            data: formData,
            
            
            beforeSend: function(jqXHR, settings){
                var a1 = jqXHR;
                var a2 = settings;
                var element = document.getElementById("APL_exportIF");
                if (element != null)
                {
                    element.parentNode.removeChild(element);
                }
            },
            dataFilter: function(data, type){
                var dataRtn = convert_JSON_data(data);
                return dataRtn;
            },
            success: function(data, textStatus, jqXHR){
                if (data._msg != 'success')
                {
                    apl_alert(data._error, (data._msg.charAt(0).toUpperCase() + data._msg.slice(1)));
                }
                if ($.isEmptyObject( data.overwrite_preset_db ))
                {
                    presetObj = data._preset_db;
                    buildPresetTable();
                    
                    var paramStr = '';
                    paramStr += '?_ajax_nonce=' + data._ajax_nonce;
                    paramStr += '&action='      + data.action;
                    paramStr += '&overwrite='   + '';

                    var elemIF = document.createElement("iframe");
                    elemIF.id = 'APL_importIF'
                    elemIF.style.display = "none";
                    elemIF.src = ajaxurl + paramStr;

                    document.body.appendChild(elemIF);
                    
                    optionsHeader('Importing Data Successful');
                }
                else
                {
                    
                    var overwrite_output = '';
                    overwrite_output += '<h3 id="overwrite_select_group" style="margin: 5px 0px;" >(<a id="overwrite_select_group_all" >All</a> / <a id="overwrite_select_group_none">None</a>) Presets</h3>';

                    overwrite_output += '<div>';
                    for (var preset_key in data.overwrite_preset_db)
                    {
                        overwrite_output += '<input type="checkbox" name="' + preset_key + '" value="' + preset_key + '" id="chkGroup_overwrite_preset_' + preset_key + '" />';
                        overwrite_output += '<label for="">' + preset_key + '</label>';
                        overwrite_output += '<br />';
                    }
                    overwrite_output += '</div>';
                    $('<div id="apl_confirm_overwrite"></div>').html(overwrite_output).dialog({
                        stack: false,
                        title: 'Overwrite Presets',
                        resizable: true,
                        height: 256,
                        minWidth: 352,
                        maxWidth: 512,
                        maxHeight: 448,
                        modal: true,
                        buttons: {
                            Next: function() 
                            {
                                presetObj = data._preset_db;
                                apl_import_overwrite(data.overwrite_preset_db, data._ajax_nonce, data.action);
                                buildPresetTable();
                                
                                optionsHeader('Importing Data Successful');
                                
                                $( this ).dialog( "close" );
                                var element = document.getElementById("apl_confirm_overwrite");
                                element.parentNode.removeChild(element);
                            },
                            Cancel: function() 
                            {
                                $( this ).dialog( "close" );
                                var element = document.getElementById("apl_confirm_overwrite");
                                element.parentNode.removeChild(element);
                            }
                        },
                        open: function(){
                            $('#overwrite_select_group_all').click(function(e){
                                for (var preset_key in data.overwrite_preset_db)
                                {
                                    $('#chkGroup_overwrite_preset_' + preset_key).attr('checked', true);
                                }
                            });
                            $('#overwrite_select_group_none').click(function(e){
                                for (var preset_key in data.overwrite_preset_db)
                                {
                                    $('#chkGroup_overwrite_preset_' + preset_key).attr('checked', false);
                                }
                            });
                        }
                    });
                }   
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert(errorThrown.stack);
            },
            complete: function(jqXHR, textStatus){
                var a1 = jqXHR;
                var a2 = textStatus;
            }
        });
    }
    
    function apl_import_overwrite(overwrite_preset_db, ajax_nonce, action)
    {
        var overwrite_list = '';//array of preset names parsed by comma
        
        for (var preset_key in overwrite_preset_db)
        {
            if ($('#chkGroup_overwrite_preset_' + preset_key).is(':checked'))
            {
                overwrite_list += preset_key + ',';
                presetObj[preset_key] = overwrite_preset_db[preset_key];
            }
        }
        overwrite_list = overwrite_list.substring(0, overwrite_list.length - 1);
        
        var paramStr = '';
        paramStr += '?_ajax_nonce=' + ajax_nonce;
        paramStr += '&action='      + action;
        paramStr += '&overwrite='   + overwrite_list;
        
        var elemIF = document.createElement("iframe");
        elemIF.id = 'APL_importIF'
        elemIF.style.display = "none";
        elemIF.src = ajaxurl + paramStr;
        
        document.body.appendChild(elemIF);
        elemIF.parentNode.removeChild(elemIF);
        
    }
    
    ////////////////////////////////////////////////////////////////////////////
    //// RESTORE ///////////////////////////////////////////////////////////////
    $('#btnRestorePreset').click(function()
    {
        //alert(data.post_type);
        var data = { 
            action: 'APL_handler_restore_preset',
            _ajax_nonce : restorePresetNonce
        }
      
        if(confirm("Are you sure you want to restore all default presets? This will remove any changes you've made to the default presets, but will not delete your custom presets."))
        {
        
            //$('#createStatus').html("Restoring presets...");
            $('#divPreview').html("");
		
            // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
            jQuery.post(ajaxurl, data, function(response) 
            {
          
                var startPosition = response.indexOf("{");
                var responseObjString = response.substr(startPosition, response.lastIndexOf("}") - startPosition + 1);
          
                //alert(responseObjString);
                var newFileData = JSON.parse(responseObjString);
          
                presetObj = newFileData;//.preset_arr;
                buildPresetTable();
                //$('#createStatus').html("Preset successfully added.");
                optionsHeader('Restoring Default Presets Successful');
          
            });
        }
    });
    
    
    $('#postTypeHeader01').click(function(){
        $('#postTypeContent01').slideToggle('slow')
    });

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////// 
    $('#cboPost_type').change(function() 
    {
        setNoneHide();
    });
    
    function setNoneHide(){
      
        var postTypeVal = $("#cboPost_type").val() ;
      
        if(postTypeVal == "none")
        {
            $('.noneHide').hide();
            $('.noneShow').show();
            $('#createStatus').html("In 'None' mode, the content field will be displayed only once and all shortcodes will refer to the current page.");
        }
        else
        {
            $('.noneHide').show();
            $('.noneShow').hide();
            $('#createStatus').html("&nbsp;");
        }
      
        if(postTypeVal != "none" && postTypeVal != "post" && postTypeVal != "attachment")
        {//if it's a page or custom type, show parent selector
            $('#parentSelector').show();
        }
        else
        {
            $('#parentSelector').hide();
        }
    }
    
    buildPresetTable();
    
    //$('#outputSpan').hide();
    $('#parentSelector').hide();
    
    
});
  





