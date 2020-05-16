$(function() {

    var baseUrl = 'http://192.168.1.220:8033'
    // init date tables
    var dictListTable = $("#dict_list").dataTable({
        "ajax": {
            url:baseUrl + "/blade-yq/api-getConfigDataInfoController/getListConfigDataInfo",
            dataSrc: ''

        },
        "ordering": false,
        "searching": true,
        //"scrollX": true,	// scroll x，close self-adaption
        "columns": [
            {

                "data" : function(row, type, set, meta) {
                    var c = meta.settings._iDisplayStart + meta.row + 1;
                    return c;
                },
                "width" : '5%',
            },
            {
                "data": 'name',
                "visible" : true,
                "width":'15%'
            },

            {
                "data": 'appGroup',
                "visible" : true,
                "width":'15%',

            },
            {
                "data": 'remark',
                "visible" : true,
                "width":'15%',

            },
            {
                "data":"data",
                "visible" : true,
                "width":'35%',

            },
            {
                "data": '操作' ,
                "width":'15%',
                "render": function ( data, type, row ) {
                    return function(){
                        // html
                        tableData[row.id] = row;
                        var html = '<p id="'+ row.id + '"  name="'+ row.id+'">'+
                            '<button class="btn btn-warning btn-xs update" type="button">编辑</button>  '+
                            '<button class="btn btn-danger btn-xs delete" type="button">删除</button>  '+
                            '</p>';

                        return html;
                    };
                }
            }
        ],
        "language" : {
            lengthMenu: '显示条数：<select class="form-control">' + '<option value="5">5</option>' + '<option value="10">10</option>' + '<option value="20">20</option>' + '<option value="30">30</option>' + '<option value="40">40</option>' + '<option value="50">50</option>' + '</select>',//左上角的分页大小显示。
            search: '<span class="">搜索：</span>', //右上角的搜索文本，可以写html标签
            processing: "载入中", //处理页面数据的时候的显示
            paginate: { //分页的样式文本内容。
                previous: "上一页",
                next: "下一页",
                first: "首页",
                last: "尾页"
            },
            zeroRecords: "没有这条记录",//table tbody内容为空时，tbody的内容。
            //下面三者构成了总体的左下角的内容。
            info: "第_PAGE_/_PAGES_ 页，共 _TOTAL_ 条数据",//显示第_START_ 到第 _END_ 左下角的信息显示，大写的词为关键字。
            infoEmpty: "0条记录",//筛选为空时左下角的显示。
            infoFiltered: "筛选之后得到 _TOTAL_ 条，初始_MAX_ 条"//筛选之后的左下角筛选提示(另一个是分页信息显示，在上面的info中已经设置，所以可以不显示)，
            }


    });

    // table data
    var tableData = {};

    // $("input[type='search']").on( 'keyup', function () {
    //     dictListTable.columns( 1 ).search($("input[type='search']").val(),true,false).draw()
    //
    // } );

    // add
    // 添加配置
    $(".add").click(function(){
        $('#addModal').modal({backdrop: false, keyboard: false}).modal('show');
        editor_add.setValue("")
    });


    var addModalValidate = $("#addModal .form").validate({
        errorElement : 'span',
        errorClass : 'help-block',
        focusInvalid : true,
        rules : {
            name : {
                required : true,
            },

            appGroup: {
                required : true,
            },
            remark: {
                required : true,
            }


        },
        messages : {
            name : {
                required :'请输入名称',
            },

            appGroup : {
                required : '请输入所属应用组',
            },
             remark: {
                required : '请输入描述',
            }

        },
        highlight : function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success : function(label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement : function(error, element) {
            element.parent('div').append(error);
        },
        submitHandler : function(form) {

            var paramData = {
                "name": $("#addModal .form input[name='name']").val(),
                "appGroup": $("#addModal .form input[name='appGroup']").val(),
                "remark": $("#addModal .form textarea[name='remark']").val(),
                "data":editor_add.getValue()
            };
            var params = JSON.stringify(paramData)

            $.ajax({
                type:"post",
                dataType:"json",
                url:baseUrl+"/blade-yq/api-getConfigDataInfoController/addConfigDataInfo",
                contentType:"application/json",
                data:params,
                success:function (res) {
                    if(res.data == 200){
                        $('#addModal').modal('hide');
                        layer.msg( '添加成功');
                        setTimeout(function () {
                            location.reload()
                        },1000)
                    }else{
                        layer.open({
                            title: '系统提示',
                            btn: [ '确认'],
                            content: (data.msg || '添加失败'),
                            icon: '2'
                        });
                    }

                }
            })

        }
    });



    $("#addModal").on('hide.bs.modal', function () {
        $("#addModal .form")[0].reset();
        editor_add.setValue("")
        addModalValidate.resetForm();
        $("#addModal .form .form-group").removeClass("has-error");
        $(".remote_panel").show();	// remote

        $("#addModal .form input[name=permission]").parents('.form-group').show();
    });

// update
    // 点击更新按钮
    $("#dict_list").on('click', '.update',function() {


        var id = $(this).parent('p').attr("id");

        var row = tableData[id];

        // // base data
        $("#updateModal .form input[name='name']").val( row.name );
        $("#updateModal .form input[name='appGroup']").val( row.appGroup );
        $("#updateModal .form textarea[name='remark']").val( row.remark );
        $("#updateModal .form input[name='field_id']").val(row.id)
        // // show
        $('#updateModal').modal({backdrop: false, keyboard: false}).modal('show');
        editor_upd.setValue(row.data)


    });


    var updateModalValidate = $("#updateModal .form").validate({
        errorElement : 'span',
        errorClass : 'help-block',
        focusInvalid : true,
        rules : {
            name : {
                required : true,
            },

            appGroup: {
                required : true,
            }

        },
        messages : {
            name : {
                required :'请输入名称',
            },

            appGroup : {
                required : '请输入所属应用组',
            },
            remark : {
                required : '请输入描述',
            }


        },
        highlight : function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success : function(label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement : function(error, element) {
            element.parent('div').append(error);
        },
        submitHandler : function(form) {

            var paramData = {
                "name": $("#updateModal .form input[name='name']").val(),
                "appGroup": $("#updateModal .form input[name='appGroup']").val(),
                "remark": $("#updateModal .form textarea[name='remark']").val(),
                "data":editor_upd.getValue()
            };
            // var params = JSON.stringify(paramData)


            var id=$("#updateModal .form input[name='field_id']").val()

            var temp ='?id='+id

            for(var key in paramData){
                if(paramData[key]){
                    temp  =temp + '&'+ key+'='+ paramData[key]
                }
            }


            $.ajax({
                type:"GET",
                dataType:"json",
                url:baseUrl+"/blade-yq/api-getConfigDataInfoController/updateConfigDataInfo"+temp,
                contentType:"application/json",
                data:{},
                success:function (res) {
                    if(res.code == 0){
                        $('#updateModal').modal('hide');
                        layer.msg( '修改成功');
                        setTimeout(function () {
                            location.reload()
                        },1000)
                    }else{
                        layer.open({
                            title: '系统提示',
                            btn: [ '确认'],
                            content: (data.msg || '修改失败'),
                            icon: '2'
                        });
                    }

                }
            })

        }
    });

    $("#updateModal").on('hide.bs.modal', function () {
        $("#updateModal .form")[0].reset();
        updateModalValidate.resetForm();
        $("#updateModal .form .form-group").removeClass("has-error");
        $(".remote_panel").show();	// remote

        $("#updateModal .form input[name=permission]").parents('.form-group').show();
    });

    // job operate
    $("#dict_list").on('click', '.delete',function() {
        var id = $(this).parent('p').attr("id");

        layer.confirm( '确认删除吗?', {
            icon: 3,
            title: '提示' ,
            btn: [ '确认', '取消' ]
        }, function(index){
            layer.close(index);

            $.ajax({
                type : 'GET',
                url : baseUrl+"/blade-yq/api-getConfigDataInfoController/deleteConfigDataInfo?id="+id,
                dataType : "json",
                success : function(res){

                    if (res.code == 0) {
                        layer.msg( '删除成功!' );

                        setTimeout(function () {
                            location.reload()
                        },1000)

                    } else {
                        layer.msg( res.message || '删除失败' );
                        // layer.msg( data.msg)
                    }
                }
            });
        });
    });


});
