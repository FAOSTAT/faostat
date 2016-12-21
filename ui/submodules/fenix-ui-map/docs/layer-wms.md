
#Required
layer.layers=layername; layer(s) to be added (current layername on the WMS Server)
layer.urlWMS='http:/fenixapps.fao.org/geoserver/wms' this is the current WMS Server location

#WMS Layer Parameters *Optional*
layer.styles='';        style applied to the layer(s)
layer.srs = 'EPSG:3857'; optional (the defaul is EPSG:3857), it's important to set the right CRS for the GetFeatureInfo
layer.visibility = true, //enabled/disabled layer and also to the wms request
layer.format = "image/png", ["image/png", "image/gif", etc]
layer.transparent = 'TRUE', [TRUE, FALSE]
layer.opacity = 1, [0, 1]
layer.cql_filter="adm0_code IN (182)"; This will execute a cql_filter on the layer (see ECQL_FILTER reference)

#Other Layer Parameters *Optional*
layer.layertitle = "title" //title of the layer This will appear in the layer list and on the legend's title.
layer.layertype  = 'WMS'; ['WMS', 'TILE', 'JOIN']
layer.openlegend = true; default is false (this open the legend onLayerAdd)
layer.defaultgfi = false; [true, false] on true enable the layer to be the default layer to be used to the GetFeatureInfo request
layer.enbalegfi = true; [true, false] enable or not the possibility to query the layer
layer.legendtitle='Legend Title';
layer.legendsubtitle='Legend Subtitle'
layer.hideLayerInControllerList = false; to don't show the layer on the layer's list
layer.geometrycolumn = 'the_geom' used to perform a spatial query on the layer

#JOIN Layer (required)
layer.joincolumn = 'adm0_code'; Join column of the layer with the data
layer.joinboundary= 'FAOSTAT'; (@Deprecated) [GAUL0, FAOSTAT, ISO2, ISO3] this is an alternative if GAUL0 of the joincolum (not supported anymore)
layer.joindata='[{"1":"0"}]' '[{"code", "value"}]'

#Optionals
layer.jointype = 'shaded'; (default) ['shaded', 'point'] Currently the point is only supported to GAUL0 layer
layer.classification='quantile'; (default) ['quantile', 'equalinterval', 'custom', 'customequal', 'equalarea'] equalarea classification can be used just with GAUL0
layer.ranges='0,100,300'; if the classification='custom' or 'customequal' this will set the thresholds
layer.colorramp='Reds' (default) ['Reds', 'Blues', 'YlOrBr', etc] see ColorBrewer reference

layer.colors='000000,CD2626'; used as alternative to colorramp with custom colors
layer.intervals='2'
layer.lang='e'; (default) ['e', 's' ,'f'] //used in the join GetFeatureInfo request
layer.decimalnumbers='3'; //used the classification and popup to round the values
layer.thousandseparator='' TODO: check defaults
layer.decimalseparator=''

#Optional Styiling and PopUp JOIN Layer
layer.mu='index';
layer.measurementunit='index';
layer.addborders='true'
layer.borderscolor='FFFFFF'
layer.bordersstroke='0.8'
layer.bordersopacity='0.4'

#SCATTER PLUGIN (Extension of JOIN Layer)
layer.geometrycolumn = 'the_geom' (required) used to perform a spatial query on the layer
layer.formula='series[i].data[j].x / series[i].data[j].y' //to be applied to the main scatter layer
layer.scatterquerylayer = true; layer to be queried on polygon selection (drawing plugin)
