/*global define, document, window, alert, amplify*/
define([
    'jquery',
    'loglevel',
    'underscore',
    'underscore.string',
    'config/Events',
    'amplify',
    'FileSaver'
], function ($, log, _, _s, E) {

    'use strict';

    function PIVOTEXPORTER(config) {

        this.CONFIG = {
            placeholder_id: 'placeholder',
            filename: 'PivotExport',
            url_csv2excel: 'http://localhost:8080/api/v1.0/csv2excel/',
            url_output: 'http://localhost:8080/api/v1.0/excels/'
        };

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        if (this.CONFIG.hasOwnProperty('container')) {
            this.$CONTAINER = $(this.CONFIG.container);
        }else {
            this.$CONTAINER = $('#' + this.CONFIG.placeholder_id);
        }

        log.info("PivotExporter; container", this.$CONTAINER);

    }

    PIVOTEXPORTER.prototype.excel = function (metadata) {
        var model = this.create_model(),
            csv_string = this.create_csv_string(model),
            that = this;
        $.ajax({
            type: 'POST',
            url: this.CONFIG.url_csv2excel,
            data: {
                csv: csv_string,
                filename: this.CONFIG.filename,
                metadata: metadata !== null ? metadata : '"Datasource", "FAOSTAT"\n"Domain Name", "Production, Crops"\n"Retrieved", ' + new Date()
            },
            success: function (response) {
                if (window.open(that.CONFIG.url_output + response, '_blank') === undefined) {
                    //swal('Warning', 'Your browser is blocking pop-up windows. Please change your browser settings and try again.', 'warning');
                    log.error('Warning', 'Your browser is blocking pop-up windows. Please change your browser settings and try again.', 'warning');
                    throw new Error('Warning', 'Your browser is blocking pop-up windows. Please change your browser settings and try again.', 'warning')
                }
            },
            error: function (e) {
                alert('PIVOTEXPORTER.prototype.excel ' + e);
            }
        });
    };

    PIVOTEXPORTER.prototype.csv = function () {

        log.info('!PIVOTEXPORTER')

        var matrix = this.getMatrix();

        // TODO: test properly if the matrix is valid
        if (matrix) {
            amplify.publish(E.EXPORT_MATRIX_DATA, {
                data: matrix,
                file: 'csv'
            });
        }

    };

    PIVOTEXPORTER.prototype.xls = function () {

        log.info('!PIVOTEXPORTER2')

        var matrix = this.getMatrix();

        // TODO: test properly if the matrix is valid
        if (matrix) {
            amplify.publish(E.EXPORT_MATRIX_DATA, {
                data: matrix,
                file: 'xls'
            });
        }

    };

    PIVOTEXPORTER.prototype.csv_old = function () {

        log.info("PivotExporter.csv; container", this.$CONTAINER);

       var start = new Date();

        var model = this.create_model(),
            csv_string = this.create_csv_string(model);

        // TODO: check if it works in all browser. There should be an issue with Sfari 8.0

        // TODO: fix name of the filename
        var blob = new Blob([csv_string], {type: "data:application/csv;charset=utf-8;"}),
            d = new Date(),
            filename = "FAOSTAT_Export_" + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear() + '.csv';

        log.info('EXPORT.saveAs;');

        saveAs(blob, filename);

        var time = new Date();

        log.info("Export.saveAs; Execution saveAs time: ", (time - start) / 1000 + "s");


    };

    PIVOTEXPORTER.prototype.getMatrix = function () {

        var $tr = this.$CONTAINER.find("table.pivot tbody tr"),
            rowsNumber = $tr.length, //row size
            matrix = new Array(rowsNumber), // row size
            self = this;


        for (var i = 0; i < rowsNumber; i++) {
            matrix[i] = []; // adding arry for each row
        }

        log.info("PIVOTEXPORTER.getMatrix; Matrix rows", rowsNumber);

        _.each($tr, function (tr, trIndex) {

            //log.info("-------------");
            //log.info("PIVOTEXPORTER.getMatrix; adding row", tr);
            var $tr = $(tr);
            var $th = $tr.find('th');

            // default colSpanOffset (modified if previous rowSpan already filled the matrix)
            var colSpanOffset = 0;

            // getting the right colSpanOffset if it is already been set by other previous rowSpan
            _.each(matrix[trIndex], function (m, index) {

                if (m !== undefined && m !== null) {
                    //log.info("PIVOTEXPORTER.getMatrix; colSpanOffset index: -", m, "-", index);
                    colSpanOffset = index + 1;
                }

            });

            //log.info("PIVOTEXPORTER.getMatrix; trIndex (row index)", trIndex);
            //log.info("PIVOTEXPORTER.getMatrix; colSpanOffset", colSpanOffset, " (derived from the values already filled in the matrix)");

            // default rowSpanOffset (it doesn't depends from previous values in the matrix)
            var rowSpanOffset = 0;

            // TODO: create just one function. this loop and the loop below is the same
            // getting headers
            _.each($th, function (th) {

                var $v = $(th),
                    // TODO: check if  innerText is always working
                    text = self.sanitizeLabel($v.context.innerText),
                    rowSpan = $v[0].rowSpan || 1,
                    colSpan = $v[0].colSpan || 1;

                for (var colIndex = colSpanOffset; colIndex < colSpanOffset + colSpan; colIndex++) {
                    for (var rowIndex = rowSpanOffset; rowIndex < rowSpanOffset + rowSpan; rowIndex++) {
                        //log.info((trIndex + rowIndex), colIndex, text, colSpan, rowSpan);
                        matrix[trIndex + rowIndex][colIndex] = text;
                    }
                }

                colSpanOffset += colSpan;

            });

            // getting data
            var $td = $tr.find('td');
            _.each($td, function (td) {

                var $v = $(td),
                    // TODO: check if  innerText is always working
                    //text = self.sanitizeLabel($v.context.innerText),
                    text = ($v.context.innerText),
                    rowSpan = $v[0].rowSpan || 1,
                    colSpan = $v[0].colSpan || 1;

                for (var colIndex = colSpanOffset; colIndex < colSpanOffset + colSpan; colIndex++) {
                    for (var rowIndex = rowSpanOffset; rowIndex < rowSpanOffset + rowSpan; rowIndex++) {
                        //log.info((trIndex + rowIndex), colIndex, text, colSpan, rowSpan);
                        matrix[trIndex + rowIndex][colIndex] = text;
                    }
                }

                colSpanOffset += colSpan;

            });

        });

        // remove "-all" columns
        matrix = matrix.map(function(val, index){
            return val.slice(1, val.length);
        });

        // remove first "-all" row
        matrix.shift();

        //log.info("Matrix", matrix);
        return matrix;
    };

    PIVOTEXPORTER.prototype.sanitizeLabel = function (l) {
        // TODO: check if needs sanitification
        return _s.trim(l, "-");

    };

    PIVOTEXPORTER.prototype.create_model = function () {

        /* Variables. */
        var z_titles = [],
            summary = [],
            values = [],
            ys = [],
            xs = [],
            i,
            tmp,
            y,
            top_titles,
            top_titles_objs,
            z_titles_objs,
            x,
            left_titles,
            left_titles_objs,
            tds,
            count,
            newrow,
            summary_objs;

        /* Collect Y dimension. */
        log.info("this.count_ys()", this.count_ys());
        for (y = 1; y <= this.count_ys(); y += 1) {
            top_titles = [];
            top_titles_objs = this.$CONTAINER.find('table.pivot tbody tr th.draggable.toptitle.targetY' + y);
            log.info("top_titles_objs", top_titles_objs);
            for (i = 0; i < top_titles_objs.length; i += 1) {
                if ($.inArray($(top_titles_objs[i]).html().trim(), top_titles) < 0) {
                    top_titles.push(this.remove_html($(top_titles_objs[i]).html().trim()));
                }
            }
            ys.push(top_titles);
        }
        log.info("ys", ys);

        /* Collect Z dimension. */
        z_titles_objs = this.$CONTAINER.find('table.pivot tbody tr th.draggable.ztitle');
        log.info("z_titles_objs", z_titles_objs);
        for (i = 0; i < z_titles_objs.length; i += 1) {
            if ($.inArray($(z_titles_objs[i]).html().trim(), z_titles) < 0) {
                z_titles.push(this.remove_html($(z_titles_objs[i]).html().trim()));
            }
        }
        log.info("z_titles", z_titles);

        /* Collect X dimension. */
        log.info("this.count_xs()", this.count_xs());
        for (x = 1; x <= this.count_xs(); x += 1) {
            left_titles = [];
            left_titles_objs = this.$CONTAINER.find('table.pivot tbody tr th.draggable.lefttitle.targetX' + x);
            log.info("left_titles_objs", left_titles_objs);
            for (i = 0; i < left_titles_objs.length; i += 1) {
                tmp = $(left_titles_objs[i]).html().trim();
                tmp = tmp.substring(tmp.indexOf('</a>'));

                if (_s.startsWith(tmp, '</a>')) {
                    tmp = tmp.substring(tmp.indexOf('</a>') + '</a>'.length);
                }

                // TODO: check if it could be a potential problem.
                tmp = tmp.replace(/\n/g, ' ');
                log.info('-' + tmp + '-');
                if ($.inArray(tmp, left_titles) < 0) {
                    left_titles.push(tmp);
                }
            }
            xs.push(left_titles);
        }

        log.info("xs", xs);
        log.info("top_titles", top_titles);

        /* Collect values. */
        tds = this.$CONTAINER.find('table.pivot tbody tr td');
        count = 1;
        tmp = [];
        newrow = top_titles.length * z_titles.length;
        log.info("newrow", newrow);
        for (i = 0; i < tds.length; i += 1) {
            tmp.push(this.remove_html($(tds[i]).html().trim()));
            if (count % newrow === 0) {
                values.push(tmp);
                tmp = [];
            }
            count += 1;
        }
        log.info("values", values);

        /* Collect summary. */
        summary_objs = this.$CONTAINER.find('table.pivot tbody tr td.summary');
        log.info("summary_objs", summary_objs);
        for (i = 0; i < summary_objs.length; i += 1) {
            summary.push(this.remove_html($(summary_objs[i]).html().trim()));
        }

        log.info(summary);

        /* Return model. */
        return {
            ys: ys,
            xs: xs,
            values: values,
            summary: summary,
            zs: z_titles
        };

    };

    PIVOTEXPORTER.prototype.remove_html = function (html) {
        var tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    PIVOTEXPORTER.prototype.create_csv_string = function (model) {


        var matrix = [],
            ys = model.ys,
            zs = model.zs,
            xs = model.xs,
            values = model.values,
            // TODO check if values > 0
            rowLength = xs.length + values[0].length,
            totalRows = values.length,
            csv = "";

        log.info("rowLength", rowLength);
        log.info("totalRows", totalRows);

        _.each(xs, function(x) {

        });



        // create y headers
        _.each(ys, function(y) {
            var row = [];

            // add to ys xs spacing
            _.each(xs, function() {
                // y.unshift("");
                row.push("");
            });
            // add xs spacing

            _.each(y, function(v) {
                row.push(sanitize(v));
            });

            matrix.push(row);

        });

        // create z headers
        var row = [];
        // add to ys xs spacins
        _.each(xs, function(x) {
            // y.unshift("");
            row.push("");
        });
        _.each(zs, function(z) {
            row.push(sanitize(z));
        });
        matrix.push(row);


        // creating rows
        var j,z,newrow,s,i, p;
        _.each(values, function(row, index) {
            var r = [];

            for (z = 0; z < model.xs.length; z += 1) {
                newrow = 1;
                for (p = (1 + z); p < model.xs.length; p += 1) {
                    newrow *= model.xs[p].length;
                }
                r.push('"' + model.xs[z][parseInt(j / newrow, 10) % model.xs[z].length]);
            }

            _.each(row, function(value) {

                // getting the right left columns


                r.push(value)
            });
            matrix.push(r);
        });

        /* Create body. */
        /*var j,z,newrow,s,i, p;
        for (j = 0; j < model.values.length - 1; j += 1) {
            for (z = 0; z < model.xs.length; z += 1) {
                newrow = 1;
                for (p = (1 + z); p < model.xs.length; p += 1) {
                    newrow *= model.xs[p].length;
                }
                s += '"' + model.xs[z][parseInt(j / newrow, 10) % model.xs[z].length] + '",';
            }
            for (i = 0; i < model.values[j].length; i += 1) {
                //s += '"' + model.values[j][i] + '"';
                s += '"' + _s.trim(model.values[j][i], "-") + '"';
                if (i < model.values[j].length - 1) {
                    s += ',';
                }
            }
            s += '\n';
        }*/



        log.info("metrix:", matrix);

        //csv = ConvertToCSV();



        function sanitize(v) {
            return v;

        }

        function ConvertToCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {

                    if (line !== '') {
                        line += ',';
                    }

                    line += EscapeCSV(array[i][index]);
                }

                str += line + '\r\n';
            }

            return str;
        }

        function EscapeCSV(text) {

            // TODO: escaping the ", there should be a check on the character before the " to check if it is not already escaped
            // return '"' + _s.replaceAll(text, '"', "'") + '"';
            return '"' + text.replace(/"/g, '""') + '"';

        }

    };

    PIVOTEXPORTER.prototype.create_csv_stringBK = function (model) {

        log.info(model);

        var s = '',
            i,
            j,
            z,
            y,
            newrow,
            p,
            value;

        /* Create header. */
        log.info("Create Header");
        log.info("model.xs.length", model.xs.length);
        log.info("creating model.xs.length (", model.xs.length, ") empty cells");
        for (i = 0; i < model.xs.length; i += 1) {
            s += '"",';
        }

        log.info("model.ys.length", model.ys.length);
        for (i = 0; i < model.ys.length; i += 1) {
            y = model.ys[i];
            for (j = 0; j < y.length; j += 1) {
                for (z = 0; z < model.zs.length; z += 1) {
                    log.info("TRIM '-'", y[j]);
                    s += '"' + _s.trim(y[j], "-") + '",';
                }
            }
            // the substring is for the comma at the end of each element
            s = s.substring(0, s.length - 1);
            s += '\n';

            log.info((i+1), model.ys.length -1);
            log.info("creating model.xs.length (", model.xs.length, ") empty cells");
            // there are still rows
            if ( (i+1) <= model.ys.length -1) {
                for (var k = 0; k < model.xs.length; k += 1) {
                    s += '"",';

                }
            }
        }
        //s += '\n';

        log.info("creating model.xs.length (", model.xs.length, ") empty cells");
        for (i = 0; i < model.xs.length; i += 1) {
            s += '"",';
        }

        for (i = 0; i < model.ys.length; i += 1) {
            y = model.ys[i];
            console.log("y", y);
            for (z = 0; z < y.length; z += 1) {
                console.log("z", y[z]);
                for (j = 0; j < model.zs.length; j += 1) {
                    //s += '"' + model.zs[j] + '"';
                    console.log("HERE: ", _s.trim(model.zs[j]));
                    s += '"' + _s.trim(model.zs[j], "-") + '"';
                    if (j < model.zs.length - 1) {
                        s += ',';
                    }
                }
                if (z < y.length - 1) {
                    s += ',';
                }
            }
            // TODO: check if works all the times?
            log.info("MORTACCITUA!");
            s += '\n';
        }
        // s += '\n';

        /* Create body. */
        for (j = 0; j < model.values.length - 1; j += 1) {
            for (z = 0; z < model.xs.length; z += 1) {
                newrow = 1;
                for (p = (1 + z); p < model.xs.length; p += 1) {
                    newrow *= model.xs[p].length;
                }
                s += '"' + model.xs[z][parseInt(j / newrow, 10) % model.xs[z].length] + '",';
            }
            for (i = 0; i < model.values[j].length; i += 1) {
                // TODO: remove it!
                /*value = parseFloat(model.values[j][i]);
                if (!isNaN(value)) {
                    s += '"' + value + '"';
                } else {
                    s += '"' + model.values[j][i] + '"';
                }*/

                //s += '"' + model.values[j][i] + '"';
                s += '"' + _s.trim(model.values[j][i], "-") + '"';
                if (i < model.values[j].length - 1) {
                    s += ',';
                }
            }
            s += '\n';
        }

        return s;

    };

    PIVOTEXPORTER.prototype.count_xs = function () {
        var tmp, i;
        // TODO: check why i < 100...
        for (i = 1; i < 100; i += 1) {
            tmp = this.$CONTAINER.find('table.pivot tbody tr th.draggable.lefttitle.targetX' + i);
            log.info(i, tmp);
            if (tmp.length === 0) {
                return (i - 1);
            }
        }
    };

    PIVOTEXPORTER.prototype.count_ys = function () {
        var tmp, i;
        // TODO: check why i < 100...
        for (i = 1; i < 100; i += 1) {
            tmp = this.$CONTAINER.find('table.pivot tbody tr th.draggable.toptitle.targetY' + i);
            if (tmp.length === 0) {
                return (i - 1);
            }
        }
    };

    return PIVOTEXPORTER;

});