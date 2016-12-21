define([
"fx-common/pivotator/functions"
], function (myFunction) {

	'use strict';
	//FIG
	var MYFINALRESULT;
	var myfunc = new myFunction();

	/* var SortedSet = (function () {

		function find(val, array, comparator) {
			var l = 0;
			var r = array.length - 1;
			var i;
			var compare;
			while (l <= r) {
				i = ((l + r) / 2) | 0;
				compare = comparator(array[i], val);
				if (compare < 0) {
					l = i + 1;
					continue;
				}
				if (compare > 0) {
					r = i - 1;
					continue;
				}
				return i;
			}
			return null;
		}

		var concat = (function () {
			var a = [];
			var c = a.concat;

			function concat() {
				return c.apply(a, arguments);
			}

			return concat;
		}());


		function insert(value, comparator, values) {
			//console.log("insert",value,comparator,values)
			var r = values.length - 1;
			if (r === -1) {
				return [value];
			}
			var l = 0;
			var i, compare;
			while (l <= r) {
				i = ((l + r) / 2) | 0;
				compare = comparator(values[i], value);
				if (compare < 0) {
					//array[i] is less than our value
					l = i + 1;

				} else if (compare > 0) {
					r = i - 1;
				} else {
					//already here
					return values;
				}
			}

			if (comparator(values[i], value) < 0) {
				//insert after i
				return concat(values.slice(0, i + 1), [value], values.slice(i + 1));
			} else {
				//insert before i

				return concat(values.slice(0, i), [value], values.slice(i));
			}
		}


		function SortedSet(comparator) {
			this.comparator = comparator;
			this.values = [];
		}

		SortedSet.prototype.insert = function (value) {
			this.values = insert(value, this.comparator, this.values);
		};

		SortedSet.prototype.indexOf = function (value) {
			return find(value, this.values, this.comparator);
		};

		SortedSet.prototype.size = function () {
			return this.values.length;
		};

		return SortedSet;
	}());
*/
	var Utils = {
copyProperties: function (source, dest) {
			for (var k in source) {
				if (source.hasOwnProperty(k)) {
					dest[k] = source[k];
				}
			}
		},
isArray: function (testObject) {return testObject && !(testObject.propertyIsEnumerable('length'))&& typeof testObject === 'object' && typeof testObject.length === 'number';},
stringComparator: function (a, b) {	return a.localeCompare(b);	},
numberComparator: function (a, b) {		if (a > b) {return 1;} else if (b > a) {return -1;} else {	return 0;	}	},
defaultComparator: function () {			return 0;		},
makeComparator: function (fields, data, comparators) {
			var len = fields.length;
			var i;
			var c = [];
			for (i = 0; i < len; i++) {
				//console.log(data,fields,i)
				var entry = data[0][fields[i]];
				var entryType = typeof entry;
				if (typeof comparators[fields[i]] === 'function') {
					c[i] = comparators[fields[i]];
				} else if (entryType === 'number') {
					c[i] = this.numberComparator;
				} else if (entryType === 'string') {
					c[i] = this.stringComparator;
				} else if (Utils.isArray(entry)) {
					c[i] = this.defaultComparator;
				} else {
					c[i] = this.defaultComparator;
				}
			}
			return function (a, b) {
				var v = 0;
				for (i = 0; i < len; i++) {
					var field = fields[i];
					v = c[i](a[field], b[field]);
					if (v !== 0) {return v;}
				}
				return 0;
			}
		}
	};

	var identity =function(){return x}
	
	
	
	var toTree=function(arr,mySpan)	{
		var data=[{id:'root'}];
		var indexMap={}
		for(var i in arr){
			for(var j=1;j<= arr[i].length;j++){
				var index=arr[i].slice(0,j).join("_");
				if(!indexMap[index]){indexMap[index]=false;}
				var indexOld=""
				if(j>1){indexOld=arr[i].slice(0,j-1).join("_");}
				if(indexMap[index]==false){
					if(indexOld.length>0){data.push({"id":index,"parentId":indexOld})}
					else{data.push({"id":index,"parentId":'root'})}
				}
				indexMap[index]=true;
			}			
		}
		//		console.log(data);

		var options = {  childKey  : 'id',  parentKey : 'parentId'};


		//document.body.innerHTML += '<pre>' + JSON.stringify(tree, null, 4) + '</pre>';

		function listToTree(list, options) {
			options = options || {};
			var childKey    = options.childKey    || 'child';
			var parentKey   = options.parentKey   || 'parent';
			var childrenKey = options.childrenKey || 'children';
			var nodeFn      = options.nodeFn      || function(node, name, children) {   return { name : name, children : children };  };
			var nodeCache = {};
			return list.reduce(function(tree, node) {
				node[childrenKey] = [];
				nodeCache[node[childKey]] = node;
				if (typeof node[parentKey] === 'undefined' || node[parentKey] === '') {
					tree = nodeFn(node, node[childKey], node[childrenKey]);
				} else {
					var  parentNode = nodeCache[node[parentKey]];
					parentNode[childrenKey].push(nodeFn(node, node[childKey], node[childrenKey]));
				}
				return tree;
			}, {});
		}

		function walkTree(tree, visitorFn, parent) {
			if (visitorFn == null || typeof visitorFn !== 'function') {return tree;	}
			visitorFn.call(tree, tree, parent);
			if (tree.children && tree.children.length > 0) {
				tree.children.forEach(function(child) {walkTree(child, visitorFn, tree);});
			}
			return tree;
		}

		function pruneChildren(node, parent) {	if (node.children.length < 1) {delete node.children;}}
		
		
		function setColRowSpan(tree){
			if(!tree.children || tree.children.length==0){		tree["span"]=1}
			else{tree["span"]=0;}
			for(var i in tree.children)
			{tree["span"]+=setColRowSpan(tree.children[i])}
			return tree["span"];
		}
		
		var tree = walkTree(listToTree(data, options), pruneChildren);
		setColRowSpan(tree,mySpan)

		function treeToTab(tree,prof,profCurrent){
		var	ret=[];
			if(prof==profCurrent){
				for(var i in tree.children){
					//console.log("INSIDE",tree.children[i])	
					ret.push({id:tree.children[i].name,span:tree.children[i].span})
				}
			}
			else{for(var i in tree.children){ret=ret.concat(treeToTab(tree.children[i],prof,profCurrent+1))}}
			return ret;
		}




		var ret2=[];
		for(var i in arr[0]){//console.log("HIHI",i);
			var temp=[]
			//console.log(ret[i],treeToTab(tree,i,0))
			temp=treeToTab(tree,i,0);
			ret2.push(temp);
		}
		//console.log('final ret',ret2);
		return ret2;//tree;
	}
	var defaultOptions = {extractor: null,comparators: {}};

	function extractData(data, options) {
		var extractor = options.extractor;
		if (typeof extractor === 'function') {
			var extracted = [];
			var length = data.length;
			for (var i = 0; i < length; i++) {
				//console.log("verif",data[i])
				extracted = extracted.concat(extractor(data[i]));
				//extracted.push(extractor(data[i]));
			}
			return extracted;
		} else {return data;}
	}


	//function buildPivotResult(data, row, cols, getValue, cumulative) {
function buildPivotResult(data, opt) {

	var row=opt.rows, cols=opt.columns, getValue= myfunc.getGetValue(opt.valueOutputType), cumulative=opt.cumulative
	
		//console.log("buildPivotResult","data",data, "opt",opt);
		if (!getValue) {getValue = function (a) {return a}}//mapping

		var listTotalColumns = {};
		var listTotalRows = {};
		var columns=[];
		var rows=[];
		var len = data.length;
		var dat;

		//var result = {};
		var result = {};
		//console.log("opt",opt)
		for(var i=0;i<opt.values.length;i++){result[opt.values[i]]={};		}
		
		
		for (var i = 0; i < len; i++) {
			
			var indexR = [];
			var indexC = [];
			dat = data[i];
			for (var r in row) {indexR.push(data[i][row[r]]);}
			for (var c in cols) {indexC.push(data[i][cols[c]]);}
			indexR = indexR.join("|*");
			indexC = indexC.join("|*");
			
			for(var j=0;j<opt.values.length;j++){
			if (!result[opt.values[j]][indexR]) {result[opt.values[j]][indexR] = {};}
			

			/*if (!result[opt.VALS[j]][indexR][indexC])
			{result[opt.VALS[j]][indexR][indexC] =[dat[opt.VALS[j]]];}
			else {result[opt.VALS[j]][indexR][indexC].push(dat[opt.VALS[j]]);}
			*/
			if (!result[opt.values[j]][indexR][indexC])
			{result[opt.values[j]][indexR][indexC] =[myfunc.getGetValue(opt.values[j],"number")(dat,opt.values[j])];}
			else {result[opt.values[j]][indexR][indexC].push(myfunc.getGetValue(opt.values[j],"number")(dat,opt.values[j]));}
			
		
			}
			
			

			listTotalColumns[indexC] = true;
			listTotalRows[indexR] = true;
		}

		for(var i in listTotalColumns){columns.push(i)}
		for(var i in listTotalRows){rows.push(i)}
		rows.sort();
		cols.sort();
		//console.log("result",result)
		return {data: result,columns: columns, rows: rows};
	}


	/*  function makeHeaders(data, fieldNames) {
			var result = [];
			var dataLength = data.length;
			var namesLength = fieldNames.length;
			var i, j;
			for (i = 0; i < dataLength; i++) {
				var datum = data[i];
				var entry = [];
				for (j = 0; j < namesLength; j++) {
					entry[j] = datum[fieldNames[j]];
				}
				result[i] = entry;
			}
			return result;
		}*/
	function pivotData(data, userOptions) {
		//console.log("pivotData");
		if (userOptions === undefined) {userOptions = {};}
		var options = {};
		Utils.copyProperties(defaultOptions, options);
		if (userOptions) {Utils.copyProperties(userOptions, options);}
		// var leftSet = new SortedSet(Utils.makeComparator(rowNames, data, options));
		//var topSet = new SortedSet(Utils.makeComparator(columnNames, data, options));

		//console.log("leftSet",leftSet,"topSet",topSet)
		//ONLY if we want to use an derived attributs function or a filter attribute
		//options.extractor=function(e){return e}
		if (options.extractor) {data = extractData(data, options);}

		//return buildPivotResult(data, userOptions.ROWS, userOptions.COLS, myfunc.getGetValue(userOptions.GetValue), userOptions.cumulative);
	return buildPivotResult(data, userOptions);
	
	}

	
	function toPivotData(FX,  userOptions){
		var data = [];
		for (var i in FX.data) {
			var tmp = {}
			for (var j in FX.metadata.dsd.columns)
			{tmp[FX.metadata.dsd.columns[j].id] = FX.data[i][j];}
			data.push(tmp);
		}
		return  pivotData(data,  userOptions);
	}

	function toFX(FX,  userOptions) {
		var result = {data: [], metadata: {dsd: {columns: []}}}
		var pivotdata = toPivotData(FX,  userOptions);
		for (var ii in pivotdata.rows) {
			var i=pivotdata.rows[ii];
			var temp = i.split("|*");




			//for internaldata
			for (var jj in pivotdata.columns) {
				var j=pivotdata.columns[jj];
				/*if (pivotdata.data[i][j]) {
					temp.push(myfunc.getAgg(userOptions.Aggregator)(pivotdata.data[i][j],
						myfunc.getFormater(userOptions.Formater),userOptions.nbDecimal) )
					//temp2.push(myfunc.getAgg(userOptions.aggregator)(pivotdata.data[i][j], myfunc.getFormater(userOptions.formater), userOptions.nbDecimal));
					//console.log(pivotdata.data[i][j])
				}
				else {
					temp.push(null);
					//temp2.push(null)
				}*/


				for(var vtemp in userOptions.values)
				{
					var vindex= userOptions.values[vtemp]
					if (pivotdata.data[vindex][i][j]) {
						var myAgg=null;
						//console.log(userOptions.formatter,vindex)
						if(userOptions.aggregationFn[vindex])
						{myAgg=userOptions.aggregationFn[vindex]}
						else{myAgg="default"}
						temp.push(myfunc.getAgg(vindex,myAgg)(pivotdata.data[vindex][i][j],
							myfunc.getFormater(userOptions.formatter),
							userOptions.decimals));
					}
					else {temp.push(null)}
				}



			}
			result.data.push(temp)
			//MYFINALRESULT.data.push(temp2)
		}

		/*var moyenne = jStat(MYFINALRESULT.data).mean();

			for (var count = 0; count < MYFINALRESULT.data.length; count++) {
				var corIndex = jStat.corrcoeff(moyenne, MYFINALRESULT.data[count]);
				//console.log("corIndex",corIndex)
				if (corIndex < 0.8 || corIndex.toString() == "NaN") {
					MYFINALRESULT.nookline.push(" problem ligne " + MYFINALRESULT.rows[count] + " : " + corIndex);
				}
				else {
					MYFINALRESULT.okline.push(" ligne " + MYFINALRESULT.rows[count] + " : " + corIndex);
				}

			}*/

		var traduc = {}
		for (var i in FX.metadata.dsd.columns) {traduc[FX.metadata.dsd.columns[i].id] = FX.metadata.dsd.columns[i].title["EN"]}
		
		for (var i in userOptions.ROWS) {
			result.metadata.dsd.columns.push({id: userOptions.ROWS[i], title: {EN: traduc[userOptions.ROWS[i]]}})
			//MYFINALRESULT.rowname.push({id: rowNames[i], title: {EN: traduc[rowNames[i]]}})
		}
		for (var i in userOptions.COLS) {
			result.metadata.dsd.columns.push({id: userOptions.COLS[i], title: {EN: traduc[userOptions.COLS[i]]}})
			//MYFINALRESULT.colsname.push({id: columnNames[i], title: {EN: traduc[columnNames[i]]}})
		}
		
		
		for (var i in pivotdata.columns) {
			result.metadata.dsd.columns.push({id: i.replace(/\|\*/g, "_"),title: {EN: i.replace(/\|\*/g, "\n")},subject: "value"})
			//MYFINALRESULT.cols.push({id: i.replace(/\|\*/g, "_"),title: {EN: i.replace(/\|\*/g, "\n")}})
		}
		//console.log("MYFINALRESULT",MYFINALRESULT)
		return result;
		//return MYFINALRESULT;

	}
	
	
	function toFXJson(FX,userOptions) {
	//	console.log("toFXJon",userOptions)
		MYFINALRESULT = {data: [],unit:[],flag:[],attribute:[], rows: [], cols: [],cols2: [],cols2label: [], okline: [], nookline: [],rowname:[],colsname:[]};//to internal test and dataset function
		var pivotdata = toPivotData(FX,  userOptions);

		for (var ii in pivotdata.rows) {
			var i=pivotdata.rows[ii];
			
			var temp = i.split("|*");
			MYFINALRESULT.rows.push(temp);
			
			var temp2 = [];
			if(userOptions.hasOwnProperty("showRowHeaders") && userOptions.showRowHeaders==true)
			{temp2=JSON.parse(JSON.stringify(temp))}
			//for internaldata
			
			
			for (var jj in pivotdata.columns) {
				var j=pivotdata.columns[jj];
				
				for(var vtemp in userOptions.values)
				{
				var vindex= userOptions.values[vtemp]
				if (pivotdata.data[vindex][i][j]) {
				var myAgg=null;
				//console.log(userOptions.formatter,vindex)
				if(userOptions.aggregationFn[vindex])
				{myAgg=userOptions.aggregationFn[vindex]}
				else{myAgg="default"}
					temp2.push(myfunc.getAgg(vindex,myAgg)(pivotdata.data[vindex][i][j],
						myfunc.getFormater(userOptions.formatter),
						userOptions.decimals));
				}
				else {temp2.push(null)}
				}
			}
			
			MYFINALRESULT.data.push(temp2)
		}

		/*var moyenne = jStat(MYFINALRESULT.data).mean();

			for (var count = 0; count < MYFINALRESULT.data.length; count++) {
				var corIndex = jStat.corrcoeff(moyenne, MYFINALRESULT.data[count]);
				//console.log("corIndex",corIndex)
				if (corIndex < 0.8 || corIndex.toString() == "NaN") {
					MYFINALRESULT.nookline.push(" problem ligne " + MYFINALRESULT.rows[count] + " : " + corIndex);
				}
				else {
					MYFINALRESULT.okline.push(" ligne " + MYFINALRESULT.rows[count] + " : " + corIndex);
				}

			}*/

		var traduc = {}
		for (var i in FX.metadata.dsd.columns) {traduc[FX.metadata.dsd.columns[i].id] = FX.metadata.dsd.columns[i].title["EN"]}
		
		for (var i in userOptions.rows) {
			MYFINALRESULT.rowname.push({id: userOptions.rows[i], title: {EN: traduc[userOptions.rows[i]]}})
		}
		for (var i in userOptions.columns) {
			MYFINALRESULT.colsname.push({id:  userOptions.columns[i], title: {EN: traduc[ userOptions.columns[i]]}})
		}
		
		
		for (var ii in pivotdata.columns) {
			var i=pivotdata.columns[ii];
			MYFINALRESULT.cols.push({id: i.replace(/\|\*/g, "_"),title: {EN: i.replace(/\|\*/g, "\n")}});
			MYFINALRESULT.cols2.push(i.split("|*"))
			MYFINALRESULT.cols2label.push(i.split("|*"))
		}
		
		return MYFINALRESULT;

	}


	


	return function () {
		return {
			pivot: toFXJson,
			
			
			toFXJson:toFXJson,
			toPivotData:toPivotData,
			toFX:toFX,
			
			
			identity: identity,
			toTree:toTree
		}
	};
});
