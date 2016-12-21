FM.LayerSwipe = {

    swipeActivate: function(l, handleID, containerID, map) {
        l.layer.swipeActive = true;
        var l_parent = l.leafletLayer._container,
           // handle = document.getElementById(fenixMap.suffix +  '-handle'),
            handle = document.getElementById(handleID),
            dragging = false;
/*        console.log('L_parent');
        console.log(l_parent);*/
        handle.onmousedown = function() { dragging = true; return false;}
        document.onmouseup = function() { dragging = false; }
        document.onmousemove = function(e) {
            if (!dragging) return;
            setDivide(e.x);
        }

        var _this = this;

        l.redraw = function( e ) {
            l_parent = l.leafletLayer._container;
            setDivide(parseInt(handle.style.left));
        };

        l.mousemoveSwipe = function( e ) {
            l_parent = l.leafletLayer._container;
            setDivide(e.containerPoint.x);
        };

        map.on( "zoomend", l.redraw);
        map.on( "moveend", l.redraw);
        map.on( "drag", l.redraw);
        map.on( "mousemove", l.mousemoveSwipe );

        function setDivide(x) {
            x = Math.max(0, Math.min(x, map.getSize()['x']));
            handle.style.left = (x) + 'px';
            var layerX = map.containerPointToLayerPoint(x,0).x
            l_parent.style.clip = 'rect(-99999px ' + layerX + 'px 999999px -99999px)';
        }

        // set 50% of the width, maybe start with 0?
       // var mydiv =  $('#' + fenixMap.suffix + '-map').width();
        var mydiv =  $('#' + containerID).width();
       // console.log(mydiv);
        setDivide(mydiv / 2);
    },

    swipeDeactivate: function(l, map) {
        map.off( "zoomend", l.redraw);
        map.off( "moveend", l.redraw);
        map.off( "drag", l.redraw);
        map.off( "mousemove", l.mousemoveSwipe );
        l.layer.swipeActive = false;

        var l_parent = l.leafletLayer._container;
        l_parent.style.clip = 'auto';
    }

}
