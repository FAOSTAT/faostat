FM.LayerLegend = {

    getLegend: function(l, toRendedID, isReload) {
        // based on the layer type get the legendURL or Request
        $('#' + toRendedID + '-legend-layertitle').empty();
        $('#' + toRendedID + '-legendtitle').empty();
        $('#' + toRendedID + '-legendsubtitle').empty();
        $('#' + toRendedID + '-content').empty();

        if (l.layer.layertitle) {
            $('#' + toRendedID + '-legend-layertitle').append(l.layer.layertitle);
        }
        if (l.layer.legendtitle) {
            $('#' + toRendedID + '-legendtitle').append(l.layer.legendtitle);
        }
        if (l.layer.legendsubtitle) {
            $('#' + toRendedID + '-legendsubtitle').append(l.layer.legendsubtitle);
        }


        /* TODO: handle better, especially the l.layer.openlegend value*/
        var html = '';
        if (l.layer.legendHTML) {
            html = l.layer.legendHTML;
            $('#' + toRendedID + '-content').append(html);
        }
        else {
            var url = l.layer.urlWMS  + '?';
            url += '&service=WMS' +
                '&version=1.1.0' +
                '&REQUEST=GetLegendGraphic' +
                '&layer=' + l.layer.layers +
                '&Format=image/png';
                //'&LEGEND_OPTIONS=forceRule:True;dx:0.1;dy:0.1;mx:0.1;my:0.1;border:false;fontAntiAliasing:true;fontColor:0x47576F;fontSize:10;bgColor:0xF9F7F3';
            if (l.layer.style != null && l.layer.style != '' )
                url +=  '&style=' + l.layer.style;
            if (l.layer.sldurl )
                 url +=  '&sld=' + l.layer.sldurl;

            var alternativeUrl = url;
            url += '&LEGEND_OPTIONS=forceLabels:on;forceRule:True;dx:0;dy:0;mx:0;my:0;border:false;fontAntiAliasing:true;fontColor:0x47576F;fontSize:10;bgColor:0xF9F7F3';

            FM.LayerLegend._loadLegend(url, alternativeUrl, toRendedID)
        }

        if ( isReload ) {
            if(($('#' + toRendedID + '-holder').is(":visible"))) {
                $('#' + toRendedID + '-holder').hide();
                $('#' + toRendedID + '-holder').slideDown();
                l.layer.openlegend = true;
            }
            else {
            }
        }
        else{
            if(!($('#' + toRendedID + '-holder').is(":visible"))) {
                $('#' + toRendedID + '-holder').slideDown();
                l.layer.openlegend = true;
            } else {
                $('#' + toRendedID + '-holder').slideUp();
                l.layer.openlegend = false;
            }
        }

        //$('#' + toRendedID + '-holder').draggable();
        $('#' + toRendedID+ '-remove').click({id:toRendedID + '-holder'}, function(event) {
            $('#' + event.data.id).slideUp();
            l.layer.openlegend = false;
        });
    },

    _loadLegend: function(url, alternativeUrl, toRendedID) {
        var img = new Image();
        img.name = url;
        img.src = url;

        var html = '<img id="'+toRendedID + '-img" src="'+ img.src +'" class="decoded">';
        img.onload = function() {
            $('#' + toRendedID + '-content').append(html);
            $('#' + toRendedID + '-img').css('width', this.width);
            $('#' + toRendedID + '-img').css('height', this.height);
        }
        img.onerror  = function() {
            if ( alternativeUrl )
                FM.LayerLegend._loadLegend(alternativeUrl, null, toRendedID)
            else
                FM.LayerLegend._nolegend(toRendedID);
            // reload the image with different parameters (without legend_options)
            // if returns again error, then le legend is not available
            // '&LEGEND_OPTIONS=forceRule:True;dx:0.1;dy:0.1;mx:0.1;my:0.1;border:false;fontAntiAliasing:true;fontColor:0x47576F;fontSize:10;bgColor:0xF9F7F3'+
        }
    },

    _nolegend: function(toRendedID) {
        /** TODO: getLegendURl http://gis.stackexchange.com/questions/21912/how-to-get-wms-legendgraphics-using-geoserver-and-geowebcache **/
        var html = '<div class="fm-legend-layertitle">'+ $.i18n.prop('_nolegendavailable')+ '</div>';
        $('#' + toRendedID + '-content').append(html);
    }
    
}
