
layer.layers='gaul1_3857' layer name on the WMS Server
layer.styles='' style of the layer on the WMS Server ('' uses the default)
layer.layertitle='COUNTRYSTAT LAYER GAUL1' title of the layer
layer.srs = 'EPSG:3857'; default SRS
layer.layertype = 'JOIN'; type of the layer
layer.lang='E'; language used: E, S, F

#CQL_FILTER used by the WMS Server to filter the data
layer.cql_filter="adm0_code IN (66)";

#JOIN layer (required fields)
layer.joindata='[(1041,3483),(40695,1359),(40694,2059)]' data of the join [(code, value)]

#JOIN layer type (FAOSTAT, GAUL0, ISO2, ISO3) if it's used a global layer
layer.joinboundary= 'FAOSTAT'; this will use the Gaul0 layer (using the FAOSTAT coding system)

in case can be used also directly the column_code of the layer
layer.joincolumn='adm1_code'  joincolumn of the layer (if it's known)

#Optional
layer.classification= 'equalarea';  classification types: equalarea, equalinterval, quantile, custom
layer.colorramp='Reds' color ramp that can be used: Reds, Blues, Greens (see ColorBrewer.com)
layer.intervals='4' number of intervals of the classification algorithm

layer.jointype='shaded'; there are two different jointypes: 'shaded' or 'point' (point is currently supported just at national level)

#Legend
layer.legendtitle='ha22'
layer.legendsubtitle='2001'
layer.mu='ha' used for the point popup

#Styling of the joinlayer (optional)
layer.addborders='true'
layer.borderscolor='000000'
layer.bordersstroke='1.0'
layer.bordersopacity='0.5'

#GUI
layer.switchjointype = false; this is used to hide the switch between point/shaded join type layer
layer.openlegend = true; open the legend by defualt
