
FM.UIUtils = {

    loadingPanel: function (id, height) {
        var h = '25px';
        if ( height ) document.getElementById(id).innerHTML = "<div class='fm-loadingPanel' style='height:"+ h +"'></div>";
        else document.getElementById(id).innerHTML = "<div class='fm-loadingPanel'></div>";
//        document.getElementById(id).innerHTML = "<div class='fm-loadingPanel' style='height:"+ h +"'><img src='"+ FMCONFIG.BASEURL +'/images/loading.gif' +"'></div>";
    }

};

