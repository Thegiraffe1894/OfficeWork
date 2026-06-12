var DemandComparisonPDF = Class.create();
DemandComparisonPDF.prototype = {
initialize: function () {
},
generatePDF: function (demand1SysId, demand2SysId, targetRecordSysId) {
try {
// =====================================================
// LOAD DEMAND RECORDS
// =====================================================
var demand1 = new GlideRecord('dmn_demand');
var demand2 = new GlideRecord('dmn_demand');
if (!demand1.get(demand1SysId)) {
return 'First demand not found';
}
if (!demand2.get(demand2SysId)) {
return 'Second demand not found';
}
// =====================================================
// LOAD COMPANY LOGO
// =====================================================
// Replace with your actual db_image name
var logo = this.getCompanyLogo('company_logo');
// =====================================================
// COMPARISON FIELDS
// =====================================================
var fields = [
{label: 'Demand Number', field: 'number'},
{label: 'Demand Name', field: 'short_description'},
{label: 'Description', field: 'description'},
{label: 'Priority', field: 'priority'},
{label: 'State', field: 'state'},
{label: 'Risk', field: 'risk'},
{label: 'Business Owner', field: 'business_owner'},
{label: 'Business Owner Email', field: 'business_owner.email'},
{label: 'Sponsor', field: 'sponsor'},
{label: 'Portfolio', field: 'portfolio'},
{label: 'Portfolio Manager', field: 'portfolio.manager'},
{label: 'Planned Cost', field: 'planned_cost'},
{label: 'Start Date', field: 'start_date'},
{label: 'End Date', field: 'end_date'}
];
// =====================================================
// FINANCIAL FIELDS
// =====================================================
var financialFields = [
{
label: 'Infrastructure Cost',
field: 'u_infrastructure_cost'
},
{
label: 'Licensing Cost',
field: 'u_licensing_cost'
},
{
label: 'Support Cost',
field: 'u_support_cost'
},
{
label: 'Resource Cost',
field: 'u_resource_cost'
}
];
// =====================================================
// BUILD HTML
// =====================================================
var html = '';
html += '<html>';
html += '<head>';
html += '<style>';
html += '@page {';
html += 'margin-top: 100px;';
html += '}';
html += 'body {';
html += 'font-family: Arial, sans-serif;';
html += 'font-size: 11px;';
html += '}';
html += '.page-header {';
html += 'position: fixed;';
html += 'top: -80px;';
html += 'left: 0;';
html += 'right: 0;';
html += 'height: 70px;';
html += '}';
html += 'h1 {';
html += 'text-align:center;';
html += 'margin:0;';
html += '}';
html += 'h2 {';
html += 'margin-top:30px;';
html += 'margin-bottom:10px;';
html += '}';
html += 'table {';
html += 'border-collapse: collapse;';
html += 'width: 100%;';
html += '}';
html += 'th {';
html += 'background-color: #d3d3d3;';
html += 'border: 1px solid black;';
html += 'padding: 6px;';
html += 'text-align:left;';
html += '}';
html += 'td {';
html += 'border: 1px solid black;';
html += 'padding: 6px;';
html += 'vertical-align: top;';
html += '}';
html += '.different {';
html += 'background-color: #ffe6e6;';
html += '}';
html += '</style>';
html += '</head>';
html += '<body>';
// =====================================================
// HEADER
// =====================================================
html += '<div class="page-header">';
html += '<table style="border:none;">';
html += '<tr>';
html += '<td style="border:none; width:20%;">';
if (logo) {
html += '<img src="' + logo + '" ' +
'style="height:60px; width:auto;" />';
}
html += '</td>';
html += '<td style="border:none; text-align:center;">';
html += '<h1>Demand Comparison Report</h1>';
html += '</td>';
html += '</tr>';
html += '</table>';
html += '</div>';
// =====================================================
// COMPARISON TABLE
// =====================================================
html += '<h2>Field Comparison</h2>';
html += '<table>';
html += '<tr>';
html += '<th style="width:25%;">Field</th>';
html += '<th style="width:37.5%;">' +
this.escapeHtml(
demand1.getDisplayValue('number')
) +
'</th>';
html += '<th style="width:37.5%;">' +
this.escapeHtml(
demand2.getDisplayValue('number')
) +
'</th>';
html += '</tr>';
for (var i = 0; i < fields.length; i++) {
var fieldObj = fields[i];
var value1 = this.getDynamicValue(
demand1,
fieldObj.field
);
var value2 = this.getDynamicValue(
demand2,
fieldObj.field
);
value1 = this.escapeHtml(value1);
value2 = this.escapeHtml(value2);
var changed = value1 != value2;
var cssClass = changed ? 'different' : '';
html += '<tr>';
html += '<td>';
html += fieldObj.label;
html += '</td>';
html += '<td class="' + cssClass + '">';
html += value1;
html += '</td>';
html += '<td class="' + cssClass + '">';
html += value2;
html += '</td>';
html += '</tr>';
}
html += '</table>';
// =====================================================
// FINANCIAL TABLE
// =====================================================
html += '<br/><br/>';
html += '<h2>Financial Comparison</h2>';
html += '<table>';
html += '<tr>';
html += '<th style="width:40%;">Cost Type</th>';
html += '<th style="width:20%;">' +
this.escapeHtml(
demand1.getDisplayValue('number')
) +
'</th>';
html += '<th style="width:20%;">' +
this.escapeHtml(
demand2.getDisplayValue('number')
) +
'</th>';
html += '<th style="width:20%;">Difference</th>';
html += '</tr>';
var total1 = 0;
var total2 = 0;
for (var j = 0; j < financialFields.length; j++) {
var finField = financialFields[j];
var raw1 =
demand1.getValue(finField.field) || 0;
var raw2 =
demand2.getValue(finField.field) || 0;
var value1 = parseFloat(raw1) || 0;
var value2 = parseFloat(raw2) || 0;
var difference = value2 - value1;
total1 += value1;
total2 += value2;
var cssClass2 =
difference != 0 ? 'different' : '';
html += '<tr>';
html += '<td>';
html += this.escapeHtml(finField.label);
html += '</td>';
html += '<td class="' + cssClass2 + '">';
html += value1.toFixed(2);
html += '</td>';
html += '<td class="' + cssClass2 + '">';
html += value2.toFixed(2);
html += '</td>';
html += '<td class="' + cssClass2 + '">';
html += difference.toFixed(2);
html += '</td>';
html += '</tr>';
}
// =====================================================
// TOTALS ROW
// =====================================================
var totalDifference = total2 - total1;
html += '<tr>';
html += '<td><b>GRAND TOTAL</b></td>';
html += '<td><b>' +
total1.toFixed(2) +
'</b></td>';
html += '<td><b>' +
total2.toFixed(2) +
'</b></td>';
html += '<td><b>' +
totalDifference.toFixed(2) +
'</b></td>';
html += '</tr>';
html += '</table>';
// =====================================================
// FOOTER
// =====================================================
html += '<br/><br/>';
html += '<div>';
html += '<b>Generated On:</b> ';
html += new GlideDateTime().getDisplayValue();
html += '</div>';
html += '</body>';
html += '</html>';
// =====================================================
// GENERATE PDF
// =====================================================
var pdfApi =
new sn_pdfgeneratorutils.PDFGenerationAPI();
var fileName =
'Demand_Comparison_' +
demand1.getDisplayValue('number') +
'_VS_' +
demand2.getDisplayValue('number') +
'.pdf';
pdfApi.convertToPDF(
html,
'dmn_demand',
targetRecordSysId,
fileName
);
return 'PDF generated successfully';
} catch (ex) {
gs.error(
'DemandComparisonPDF Error: ' +
ex.message
);
return 'Error generating PDF: ' + ex.message;
}
},
// =====================================================
// DYNAMIC FIELD VALUE
// SUPPORTS DOT WALKING
// =====================================================
getDynamicValue: function(gr, fieldPath) {
try {
if (!fieldPath)
return '';
if (fieldPath.indexOf('.') == -1) {
return gr.getDisplayValue(fieldPath) || '';
}
var parts = fieldPath.split('.');
var currentObject = gr;
for (var i = 0; i < parts.length; i++) {
if (!currentObject)
return '';
var part = parts[i];
if (i == parts.length - 1) {
if (
typeof currentObject.getDisplayValue
=== 'function'
) {
return currentObject
.getDisplayValue(part) || '';
}
return currentObject[part] + '';
}
currentObject = currentObject[part];
}
return '';
} catch (ex) {
gs.error(
'Dot walk error: ' +
fieldPath +
' : ' +
ex.message
);
return '';
}
},
// =====================================================
// ESCAPE HTML
// =====================================================
escapeHtml: function(text) {
if (!text)
return '';
text = text.toString();
text = text.replace(/&/g, '&amp;');
text = text.replace(/</g, '&lt;');
text = text.replace(/>/g, '&gt;');
text = text.replace(/"/g, '&quot;');
text = text.replace(/'/g, '&#39;');
return text;
},
// =====================================================
// GET COMPANY LOGO FROM db_image
// =====================================================
getCompanyLogo: function(imageName) {
try {
var imageGR = new GlideRecord('db_image');
imageGR.addQuery('name', imageName);
imageGR.query();
if (!imageGR.next()) {
gs.error(
'Logo not found in db_image'
);
return '';
}
var attachment =
new GlideSysAttachment();
var bytes =
attachment.getBytes(imageGR);
if (!bytes)
return '';
var base64 =
GlideStringUtil.base64Encode(bytes);
return 'data:image/png;base64,' +
base64;
} catch (ex) {
gs.error(
'Logo Error: ' +
ex.message
);
return '';
}
},
type: 'DemandComparisonPDF'
};
