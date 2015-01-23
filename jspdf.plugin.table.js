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

		jsPDFAPI.calculateDimensions = function(data, dimensions) {
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
				if (indexHelper > (this.internal.pageSize.height - pageStart)) {
					pagingIndexes.push(i);
					indexHelper = 0;
					pageStart = dimensions[4] + 30;
				}
			}
			return value;
		};

		jsPDFAPI.calColumnCount = function(data) {
			var noOfColumns = 0;
			var obj = data[0];
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {++noOfColumns;
				}
			}
			return noOfColumns;
		};

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

		jsPDFAPI.tableToJson = function(id) {
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

	}(jsPDF.API));

