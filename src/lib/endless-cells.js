/*globals define*/
define(["qlik", "jquery", "text!./style.css"], function (qlik, $, cssContent) {
    'use strict';
    $("<style>").html(cssContent).appendTo("head");
    return {
        initialProperties: {
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: []
            }
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                // dimensions: {
                // 	uses: "dimensions",
                // 	min: 0
                // },
                // measures: {
                // 	uses: "measures",
                // 	min: 0
                // },
                // sorting: {
                // 	uses: "sorting"
                // },
                // settings: {
                // 	uses: "settings"
                // },
                style: {
                    label: "Global settings",
                    type: "items",
                    items: {
                        tablecss: {
                            type: "string",
                            ref: "tablecss",
                            label: "Table CSS",
                            expression: "",
                            defaultValue: "border-top: 0px; border-bottom: 0px; border-right: 0px;"
                        },
                        trcss: {
                            type: "string",
                            ref: "trcss",
                            label: "TR CSS",
                            expression: ""
                        },
                        emptycell: {
                            type: "string",
                            ref: "emptycell",
                            label: "Empty Cell Content",
                            expression: "",
                            defaultValue: '&nbsp;'
                        },
                        emptycellstyle: {
                            type: "string",
                            ref: "emptycellstyle",
                            label: "Empty Cell Style",
                            expression: "",
                            defaultValue: 'border-top: 1px; border-bottom: 1px; border-right: 1px; border-style: solid'
                        }
                    }
                },
                cells: {
                    type: "array",
                    ref: "cells",
                    label: "Cells",
                    itemTitleRef: "label",
                    allowAdd: true,
                    allowRemove: true,
                    addTranslation: "Add Alternative",
                    items: {
                        label: {
                            type: "string",
                            ref: "label",
                            label: "Label",
                            expression: ""
                        },
                        row: {
                            type: "number",
                            ref: "row",
                            label: "Row",
                            expression: "optional"
                        },
                        column: {
                            type: "number",
                            ref: "column",
                            label: "Column",
                            expression: "optional"
                        },
                        expression: {
                            type: "string",
                            ref: "expression",
                            label: "Expression",
                            expression: "optional"
                        },
                        styles: {
                            type: "string",
                            ref: "styles",
                            label: "Styles",
                            expression: ""
                        }
                    },
                    show: function (data) {
                        return true; //  data.render === "b" || data.render === "s";
                    }
                },
            }
        },
        snapshot: {
            canTakeSnapshot: true
        },
        paint: function ($element, layout) {
            $element.html('');

            var app = qlik.currApp();

            var cubeDef = {
                qDimensions: [],
                qMeasures: [],
                qInterColumnSortOrder: [],
                qInitialDataFetch: [
                    {
                        qTop: 0,
                        qLeft: 0,
                        qHeight: 1,
                        qWidth: 10
                    }
                ]
            };

            var rows = [];
            var columns = [];

            if (layout.cells) {
                layout.cells.forEach(function (alt) {
                    rows.push(alt.row);
                    columns.push(alt.column);

                    cubeDef.qMeasures.push({
                        qDef: {
                            qDef: alt.expression,
                            row: alt.row,
                            column: alt.column,
                            styles: alt.styles
                        }
                    })
                });

                if (!layout.emptycell) {
                    layout.emptycell = '&nbsp;';
                }

                var maxRow = Math.max(...rows);
                var maxColumn = Math.max(...columns);
                //console.log(maxRow + ' ' + maxColumn)
                var html = '';
                for (var r = 0; r < maxRow + 1; r++) {
                    html += '<tr style="' + layout.trcss + '">'
                    for (var c = 0; c < maxColumn + 1; c++) {
                        html += '<td style="' + layout.emptycellstyle + '">' + layout.emptycell + '</td>'
                    }
                    html += '</tr>'
                }

                html = '<table id="myFinalTable" style="' + layout.tablecss + '">' + html + '</table>';


                app.createCube(cubeDef, function (reply) {
                    //console.log(reply.qHyperCube)

                    for (var i = 0; i < reply.qHyperCube.qMeasureInfo.length; i++) {
                        var content = reply.qHyperCube.qMeasureInfo[i].qFallbackTitle;
                        var row = reply.qHyperCube.qMeasureInfo[i].row;
                        var column = reply.qHyperCube.qMeasureInfo[i].column;
                        var styles = reply.qHyperCube.qMeasureInfo[i].styles;

                        var myTable = document.getElementById('myFinalTable');
                        myTable.rows[row].cells[column].innerHTML = content;
                        myTable.rows[row].cells[column].style = styles;
                    }
                });
            } else {
                html = 'Error'
            }
            $element.html(html);
        }
    }
});
