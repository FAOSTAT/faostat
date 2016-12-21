define(function(){return{
  "metadata" : {
    "dsd" : {
      "contextSystem" : "D3P",
      "columns" : [ {
        "dataType" : "year",
        "key" : true,
        "id" : "year",
        "title" : {
          "EN" : "Year"
        },
        "subject" : "time"
      }, {
        "dataType" : "code",
        "key" : true,
        "id" : "recipientcode",
        "title" : {
          "EN" : "Country"
        },
        "domain" : {
          "codes" : [ {
            "version" : "2016",
            "idCodeList" : "crs_recipients",
            "extendedName" : {
              "EN" : "OECD Recipients"
            }
          } ]
        }
      }, {
        "dataType" : "number",
        "key" : false,
        "id" : "value",
        "title" : {
          "EN" : "Commitment Constant (USD Mil)"
        },
        "subject" : "value"
      }, {
        "dataType" : "text",
        "key" : false,
        "id" : "recipientcode_EN",
        "title" : {
          "EN" : "Country"
        },
        "virtual" : false,
        "transposed" : false
      },{
        "dataType" : "text",
        "key" : false,
        "id" : "um",
        "title" : {
          "EN" : "Unit"
        }, "subject" : "um",
        "virtual" : false,
        "transposed" : false
      }  ]
    },
    "uid" : "TMP_37864556509182883297251199358952309377"
  },
  "data" : [ [ 2008, "625", 6016.987669444498, "Afghanistan","Tonnes" ], [ 2011, "625", 7216.238413232302, "Afghanistan","Tonnes" ], [ 2002, "625", 1611.545933767999, "Afghanistan","Tonnes" ], [ 2012, "625", 5637.087473054993, "Afghanistan","Tonnes" ], [ 2007, "625", 4478.134477737805, "Afghanistan","Tonnes" ], [ 2013, "625", 6973.967282796806, "Afghanistan","Tonnes" ], [ 2006, "625", 3320.9735427992005, "Afghanistan","Tonnes" ], [ 2000, "625", 132.42698104700006, "Afghanistan","Tonnes" ], [ 2001, "625", 451.702174496, "Afghanistan","Tonnes" ], [ 2014, "625", 5287.77590235781, "Afghanistan","Tonnes" ], [ 2009, "625", 5732.213439220296, "Afghanistan","Tonnes" ], [ 2004, "625", 2893.1309985053967, "Afghanistan","Tonnes" ], [ 2005, "625", 3446.806195415703, "Afghanistan","Tonnes" ], [ 2003, "625", 2465.3925524850024, "Afghanistan","Tonnes" ], [ 2010, "625", 7287.761310402801, "Afghanistan","Tonnes" ] ],
  "size" : 15
}
});