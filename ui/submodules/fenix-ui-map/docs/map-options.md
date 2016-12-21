
#Plugins
```
var options = {
    plugins: {
        geosearch : true,
        mouseposition: true,
        controlloading : true,
        zoomControl: 'bottomright'
    },
    guiController: {
        overlay : true,
        baselayer: true,
        wmsLoader: true
    },
    gui: {
        disclaimerfao: true
    }
}
```

#WMS servers list
```
var wmsServers = [
    {
        label: 'Alberts',
        url: 'http://maps.gov.bc.ca/arcserver/services/Province/albers_cache/MapServer/WMSServer',
        urlParameters: 'service=WMS'  // used as additional parameters
    },
    {
        label: 'Cubert',
        url: 'http://portal.cubewerx.com/cubewerx/cubeserv/cubeserv.cgi'

    },
    {
        label: 'gp map service201',
        url: 'http://geoportal.logcluster.org:8081/gp_map_service201/wms'
    }
];


var wfsServers = [
    {
        label: 'dmsolutions',
        url: 'http://www2.dmsolutions.ca/cgi-bin/mswfs_gmap'
    }
];
```