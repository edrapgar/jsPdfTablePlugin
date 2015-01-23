/** ====================================================================
 * jsPDF table plugin
 * Copyright (c) 2014 Nelli.Prashanth,https://github.com/Prashanth-Nelli
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

( function(jsPDFAPI) {

		jsPDFAPI.drawColumns = function(columnCount, dimensions) {
			var x = dimensions[0];
			var y = dimensions[1];
			var width = dimensions[2] / columnCount;
			var height = dimensions[3];
			for (var counter = 0; counter < columnCount; counter++) {
				this.rect(x, y, width, height);
				x += width;
			}
		};

		jsPDFAPI.drawRows = function(rowCount, dimensions, rowHeights) {
			var x = dimensions[0];
			var y = dimensions[1];
			var width = dimensions[2];
			var height = dimensions[3] / rowCount;
			for (var j = 0; j < rowCount; j++) {
				this.rect(x, y, width, rowHeights[j]);
				y += rowHeights[j];
			}
		};

		jsPDFAPI.insertData = function(noOfRows, noOfColumns, dimensions, data) {
			var y = dimensions[1] + yOffset;
			var x, i, cell;
			var yOffset = 0;
			var xOffset = 0;
			var width;
			var fontSize = this.internal.getFontSize();
			var start = 0, end = 0, obj = {};
			var linehight = 0;

			for ( i = 0; i < noOfRows; i++) {
				obj = data[i];
				x = dimensions[0] + xOffset;
				for (var key in obj) {
					cell = (obj[key]) ? obj[key].toString() : '';
					if (((cell.length * fontSize) + xOffset) > (width)) {
						start = 0;
						end = 0;
						linehight = 0;
						for ( end = 0; end < cell.length; ) {
							end += Math.floor(2 * width / fontSize) - Math.ceil(xOffset / fontSize);
							this.text(x, y + linehight, cell.substring(start, end));
							start = end;
							linehight += fontSize;
						}
					} else {
						this.text(x, y, cell);
					}
					x += dimensions[2] / noOfColumns;
				}
				this.setFont("times", "normal");
				y += heights[i];
			}
			return y;
		};

		jsPDFAPI.drawTable = function(table_DATA, marginConfig) {
			var fontSize = this.internal.getFontSize();
			var xOffset, yOffset, pageStart;

			var defaultConfig = {
				xstart : 20,
				ystart : 20,
				tablestart : 20,
				marginright : 20,
				xOffset : 10,
				yOffset : 10
			};

			if (!marginConfig) {
				marginConfig = {
					xstart : 20,
					ystart : 20,
					tablestart : 20,
					marginright : 20,
					xOffset : 10,
					yOffset : 10
				}
			} else {
				for (var key in defaultConfig) {
					if (!marginConfig[key]) {
						marginConfig[key] = defaultConfig[key];
					}
				}
			}

			pageStart = marginConfig.tablestart;
			xOffset = marginConfig.xOffset;
			yOffset = marginConfig.yOffset;
			intializePdf(table_DATA, marginConfig);

			if ((dim[3] + marginConfig.tablestart) > (this.internal.pageSize.height)) {
				cSplitIndex.push(table_DATA.length);
				for (var ig = 0; ig < cSplitIndex.length; ig++) {
					tabledata = [];
					tabledata = table_DATA.slice(jg, cSplitIndex[ig]);
					this.insertHeader(tabledata);
					drawTableOnPdf(tabledata, dim, true, false);
					pageStart = marginConfig.ystart;
					intializePdf(tabledata, marginConfig);
					jg = cSplitIndex[ig];
					if ((ig + 1) != cSplitIndex.length) {
						this.addPage();
					}
				}
			} else {
				insertHeader(table_DATA)
				drawTableOnPdf(table_DATA, dim, true, false);
			}
			return nextStart;
		};

		function intializePdf(data, marginConfig) {
			marginConfig.xOffset = marginConfig.xOffset || 5;
			marginConfig.yOffset = marginConfig.yOffset || 5
			marginConfig.pageWidth = this.internal.pageSize.width - marginConfig.xstart - 20;
			columnCount = calColumnCount(data);
			rowCount = data.length;
			width = dim[2] / columnCount;
			height = dim[2] / rowCount;
			dim[3] = calculateDimensions(data, marginConfig);
		};

		function drawTableOnPdf(table, dimensions, hControl, bControl) {
			columnCount = calColumnCount(table);
			rowCount = table.length;
			dimensions[3] = this.caldimensions(table, dimensions);
			width = dimensions[2] / columnCount;
			height = dimensions[2] / rowCount;
			drawRows(rowCount, dimensions, hControl);
			drawColumns(columnCount, dimensions);
			nextStart = jsPDFAPI.insertData(rowCount, columnCount, dimensions, table, bControl);
			return nextStart;
		};

		function tableToJson(id) {
			var table = document.getElementById(id);
			var keys = [];
			var rows = table.rows;
			var noOfRows = rows.length;
			var noOfCells = table.rows[0].cells.length;
			var i = 0;
			var j = 0;
			var data = [];
			var obj = {};

			for ( i = 0; i < noOfCells; i++) {
				keys.push(rows[0].cells[i].textContent);
			}
			for ( j = 0; j < noOfRows; j++) {
				obj = {};
				for ( i = 0; i < noOfCells; i++) {
					try {
						obj[keys[i]] = rows[j].cells[i].textContent.replace(/^\s+|\s+$/gm, '');
					} catch(ex) {
						obj[keys[i]] = '';
					}
				}
				data.push(obj);
			}
			return data.splice(1);
		};

		function insertHeader(data) {
			var header = {};
			for (var key in data[0]) {
				header[key] = key;
			}
			data.unshift(header);
			return data;
		};

		function calculateDimensions(data, dimensions) {
			var row = 0;
			var x = dimensions[0];
			var y = dimensions[1];
			var textLengths = [];
			var obj;
			var textHeights = [];
			var length = 0;
			var noOfLines = 0;
			var value = 0;
			var indexHelper = 0;
			var pagingIndexes = [];
			var docPageHeight = jsPDFAPI.internal.pageSize.height;

			for (var i = 0; i < data.length; i++) {
				obj = data[i];
				length = 0;
				for (var key in obj) {
					if (obj[key]) {
						if (length < obj[key].length) {
							textLengths[row] = obj[key].length;
							length = textLengths[row];
						}
					}
				}++row;
			}

			for ( i = 0; i < textLengths.length; i++) {
				if ((textLengths[i] * (fontSize)) > (width - dimensions[5])) {
					noOfLines = Math.ceil((textLengths[i] * (fontSize)) / width);
					textHeights[i] = (noOfLines) * (fontSize / 2) + dimensions[6] + 10;
				} else {
					textHeights[i] = (fontSize + (fontSize / 2)) + dimensions[6] + 10;
				}
			}

			for ( i = 0; i < textHeights.length; i++) {
				value += textHeights[i];
				indexHelper += textHeights[i];
				if (indexHelper > (docPageHeight - pageStart)) {
					pagingIndexes.push(i);
					indexHelper = 0;
					pageStart = dimensions[4] + 30;
				}
			}
			return value;
		};

		function calColumnCount(data) {
			var noOfColumns = 0;
			var obj = data[0];
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {++noOfColumns;
				}
			}
			return noOfColumns;
		};

	}(jsPDF.API));

