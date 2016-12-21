define(function () {

        /*exemple DSD

         {
         dimensions:{
         country:{title:'country',code:"country",label:"country_EN"},
         indicator:{title:'indicator',code:"indicator",label:"indicator_EN"},
         year:{title:'year',code:"year",label:"year"}
         },
         values:{
         value:{label:"value",
         value:"value",
         attribute:["flag","um"]
         },
         poplation:{
         label:"population",
         value:"population",
         attribute:[]
         }
         ]
         }
         */

        function convertFX(FX, opt) {

            var lang = "EN";
            if (opt.lang) {lang = opt.lang;}
            var structInter = {dimensions: {}, values: {}}

            function setDimension(id, att, val, subject) {

                //console.log("setDimension ",id, att, val, subject)
                if (!structInter.dimensions[id]) {structInter.dimensions[id] = {};}
                structInter.dimensions[id][att] = val;
                if (subject) {structInter.dimensions[id]["subject"] = subject;}
            }

            function setValue(id, att, val) {
                //	console.log("setDim",id,att,val);
                if (!structInter.values[id]) {structInter.values[id] = {};}
                if (att != "attribute") {structInter.values[id][att] = val;}
                else {
                    if (!structInter.values[id]["attributes"]) {structInter.values[id]["attributes"] = [];}
                    structInter.values[id]["attributes"].push(val);
                }
            }

//console.log('inside convertFX',FX);
            for (var i in FX.columns) {
                var myColumns = FX.columns[i];
                if (myColumns.key == true)//c est le code
                {
                    //console.log("add dimension 1 ",lang,myColumns);
                    setDimension(myColumns.id, "label", myColumns.title[lang]||myColumns.id);
                    setDimension(myColumns.id, "code", myColumns.id, myColumns.subject);
                }
                else if (myColumns.id.split("_" + lang).length == 2)//label
                {
                    //console.log("add dimension 2 ",myColumns,myColumns.id.split("_" + lang)[0]);
                    setDimension(myColumns.id.split("_" + lang)[0], "title", myColumns.id)
                }


                else if (myColumns.dataType == "number" && myColumns.subject == "value") {
                    setValue(myColumns.id, "value", myColumns.id);
                    setValue(myColumns.id, "label", myColumns.id);
                    setValue(myColumns.id, "subject", myColumns.subject);
                }
                else if (myColumns.id.split("|*").length == 2) {//attribut d une valeur X
                    if (myColumns.subject == "um") {
                        setValue(myColumns.id.split("|*")[0], "unit", myColumns.id)
                    } else if (myColumns.subject == "flag") {
                        setValue(myColumns.id.split("|*")[0], "flag", myColumns.id)
                    }
                    else {
                        setValue(myColumns.id.split("|*")[0], "attributes", myColumns.id);
                    }
                }
                else//attribut de value
                {
                    if (myColumns.subject == "um") {setValue("value", "unit", myColumns.id);}
                    else if (myColumns.subject == "flag") {setValue("value", "flag", myColumns.id);}
                    else {
                        //setDimension(myColumns.id, "label", myColumns.title[lang]||myColumns.id);
                        //setDimension(myColumns.id, "code", myColumns.id, myColumns.subject);

                        setValue("value", "attribute", myColumns.id)
                    }
                }
            }
			return structInter;


        }

        function initFXT(FX, opt)//for Toolbar
        {
            var FXmod = convertFX(FX, opt);
            var hidden = [];
            var columns = [];
            var rows = [];
            var aggregations = [];
            var values = [];

            for (var i in FXmod.dimensions) {
                if (FXmod.dimensions[i].subject == "time") {
                    columns.push({value: FXmod.dimensions[i].code, label: FXmod.dimensions[i].label});
                }
                else {
                    rows.push({value: FXmod.dimensions[i].code, label: FXmod.dimensions[i].label});
                }
            }

            for (var i in FXmod.values) {
                values.push({value: FXmod.values[i].value, label: FXmod.values[i].label});
            }

            var retObj = {
                hidden: hidden,
                rows: rows,
                columns: columns,
                aggregations: aggregations,
                values: values
            }
            //	console.log(retObj)
            return retObj;
        }

        function initFXD(FX, opt)//for Data
        {
            var FXmod = convertFX(FX, opt);
            var hidden = [];
            var columns = [];
            var rows = [];
            var aggregations = [];
            var values = [];
            for (var i in FXmod.dimensions) {

                //console.log("ici",opt.ROWS,opt.COLS,FXmod.dimensions[i],"test",FXmod.dimensions[i].title||FXmod.dimensions[i].code);
                if (opt.rows[FXmod.dimensions[i].code]) {
                    rows.push(FXmod.dimensions[i].title || FXmod.dimensions[i].code)
                    if (opt.showCode == true && FXmod.dimensions[i].label != FXmod.dimensions[i].code && FXmod.dimensions[i].label != null) {
                        rows.push(FXmod.dimensions[i].code)
                    }
                }
                if (opt.columns[FXmod.dimensions[i].code]) {
                    columns.push(FXmod.dimensions[i].title || FXmod.dimensions[i].code)
                    if (opt.showCode == true && FXmod.dimensions[i].title != FXmod.dimensions[i].code && FXmod.dimensions[i].title != null) {
                        columns.push(FXmod.dimensions[i].code)
                    }
                }
            }
            for (var i in FXmod.values) {
                //console.log(FXmod.values[i])
                if (opt.values[FXmod.values[i].value]) {

                    values.push(FXmod.values[i].value)
                    if (opt.showUnit == true && FXmod.values[i].unit) {
                        values.push(FXmod.values[i].unit)
                    }

                    if (opt.showFlag == true && FXmod.values[i].flag) {
                        values.push(FXmod.values[i].flag)
                    }
                    for (var h in FXmod.values[i].attribute)
                    {hidden.push(FXmod.values[i].attribute[h])}
                    /*if(opt.showUnit==true &&
                     FXmod.values[i].title!=FXmod.values[i].code &&
                     FXmod.values[i].title!=null )
                     {VALS.push(FXmod.dimensions[i].code)}*/
                }


            }


            var retObj = {
                hidden: hidden,
                rows: rows,
                columns: columns,
                aggregations: aggregations,
                values: values
            }
//		console.log("FIN initFXD",retObj)
            return retObj;
        }

        return function () {
            return {
                convertFX: convertFX,
                initFXT: initFXT,
                initFXD: initFXD
            }
        };
    }
);