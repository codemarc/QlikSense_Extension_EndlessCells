Each cell have 5 options

* Label - plain text. It just indication
* Row - on which row the cell to be added
* Column - on which column the cell to be added
* Expression - if the text here starts with `=` it will be passed to QS engine for evaluation otherwise will be represented as plain text 
* Styles - css formated string which will reflect this call only

If the row/column is not present - it will be generated. For example - if there is no cells in the table and we specify `Row = 5 and Column = 6` then all the cells before this one will be generated and will be empty