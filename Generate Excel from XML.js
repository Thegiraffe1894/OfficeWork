generateExcel: function(
    demand1SysId,
    demand2SysId,
    targetRecordSysId
) {

    try {

        // =====================================================
        // LOAD DEMANDS
        // =====================================================

        var demand1 =
            new GlideRecord('dmn_demand');

        var demand2 =
            new GlideRecord('dmn_demand');

        if (!demand1.get(demand1SysId)) {

            return 'Demand 1 not found';
        }

        if (!demand2.get(demand2SysId)) {

            return 'Demand 2 not found';
        }

        // =====================================================
        // COMPARISON FIELDS
        // =====================================================

        var fields = [

            {
                label: 'Demand Number',
                field: 'number'
            },
            {
                label: 'Demand Name',
                field: 'short_description'
            },
            {
                label: 'Priority',
                field: 'priority'
            },
            {
                label: 'State',
                field: 'state'
            },
            {
                label: 'Business Owner',
                field: 'business_owner'
            },
            {
                label: 'Business Owner Email',
                field: 'business_owner.email'
            },
            {
                label: 'Portfolio',
                field: 'portfolio'
            },
            {
                label: 'Portfolio Manager',
                field: 'portfolio.manager'
            },
            {
                label: 'Start Date',
                field: 'start_date'
            },
            {
                label: 'End Date',
                field: 'end_date'
            }

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
        // START XML
        // =====================================================

        var xml = '';

        xml += '<?xml version="1.0"?>';

        xml += '<Workbook ';

        xml += 'xmlns="urn:schemas-microsoft-com:office:spreadsheet" ';
        xml += 'xmlns:o="urn:schemas-microsoft-com:office:office" ';
        xml += 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
        xml += 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">';

        // =====================================================
        // STYLES
        // =====================================================

        xml += '<Styles>';

        // HEADER STYLE
        xml += '<Style ss:ID="Header">';

        xml += '<Font ss:Bold="1"/>';

        xml += '<Interior ss:Color="#D3D3D3" ss:Pattern="Solid"/>';

        xml += '</Style>';

        // TOTAL STYLE
        xml += '<Style ss:ID="Total">';

        xml += '<Font ss:Bold="1"/>';

        xml += '<Interior ss:Color="#C0C0C0" ss:Pattern="Solid"/>';

        xml += '</Style>';

        xml += '</Styles>';

        // =====================================================
        // WORKSHEET
        // =====================================================

        xml += '<Worksheet ss:Name="Demand Comparison">';

        xml += '<Table>';

        // =====================================================
        // TITLE
        // =====================================================

        xml += '<Row>';

        xml += '<Cell>';

        xml += '<Data ss:Type="String">';

        xml += 'Demand Comparison Report';

        xml += '</Data>';

        xml += '</Cell>';

        xml += '</Row>';

        // EMPTY ROW
        xml += '<Row></Row>';

        // =====================================================
        // TABLE 1 HEADER
        // =====================================================

        xml += '<Row>';

        xml += '<Cell ss:StyleID="Header">';
        xml += '<Data ss:Type="String">Field</Data>';
        xml += '</Cell>';

        xml += '<Cell ss:StyleID="Header">';
        xml += '<Data ss:Type="String">';
        xml += this.escapeXml(
            demand1.getDisplayValue('number')
        );
        xml += '</Data>';
        xml += '</Cell>';

        xml += '<Cell ss:StyleID="Header">';
        xml += '<Data ss:Type="String">';
        xml += this.escapeXml(
            demand2.getDisplayValue('number')
        );
        xml += '</Data>';
        xml += '</Cell>';

        xml += '</Row>';

        // =====================================================
        // TABLE 1 DATA
        // =====================================================

        for (var i = 0; i < fields.length; i++) {

            var fieldObj = fields[i];

            var value1 =
                this.getDynamicValue(
                    demand1,
                    fieldObj.field
                );

            var value2 =
                this.getDynamicValue(
                    demand2,
                    fieldObj.field
                );

            xml += '<Row>';

            xml += '<Cell>';
            xml += '<Data ss:Type="String">';
            xml += this.escapeXml(
                fieldObj.label
            );
            xml += '</Data>';
            xml += '</Cell>';

            xml += '<Cell>';
            xml += '<Data ss:Type="String">';
            xml += this.escapeXml(value1);
            xml += '</Data>';
            xml += '</Cell>';

            xml += '<Cell>';
            xml += '<Data ss:Type="String">';
            xml += this.escapeXml(value2);
            xml += '</Data>';
            xml += '</Cell>';

            xml += '</Row>';
        }

        // =====================================================
        // EMPTY ROWS
        // =====================================================

        xml += '<Row></Row>';
        xml += '<Row></Row>';

        // =====================================================
        // FINANCIAL TITLE
        // =====================================================

        xml += '<Row>';

        xml += '<Cell>';

        xml += '<Data ss:Type="String">';

        xml += 'Financial Comparison';

        xml += '</Data>';

        xml += '</Cell>';

        xml += '</Row>';

        // =====================================================
        // FINANCIAL HEADER
        // =====================================================

        xml += '<Row>';

        xml += '<Cell ss:StyleID="Header">';
        xml += '<Data ss:Type="String">Cost Type</Data>';
        xml += '</Cell>';

        xml += '<Cell ss:StyleID="Header">';
        xml += '<Data ss:Type="String">';
        xml += this.escapeXml(
            demand1.getDisplayValue('number')
        );
        xml += '</Data>';
        xml += '</Cell>';

        xml += '<Cell ss:StyleID="Header">';
        xml += '<Data ss:Type="String">Difference</Data>';
        xml += '</Cell>';

        xml += '<Cell ss:StyleID="Header">';
        xml += '<Data ss:Type="String">';
        xml += this.escapeXml(
            demand2.getDisplayValue('number')
        );
        xml += '</Data>';
        xml += '</Cell>';

        xml += '</Row>';

        // =====================================================
        // TOTALS
        // =====================================================

        var totalDemand1 = 0;
        var totalDifference = 0;
        var totalDemand2 = 0;

        // =====================================================
        // FINANCIAL DATA
        // =====================================================

        for (var j = 0;
            j < financialFields.length;
            j++) {

            var finField =
                financialFields[j];

            var raw1 =
                demand1.getValue(
                    finField.field
                ) || 0;

            var rawDifference =
                demand2.getValue(
                    finField.field
                ) || 0;

            var demand1Value =
                parseFloat(raw1) || 0;

            var differenceValue =
                parseFloat(rawDifference) || 0;

            var demand2Value =
                demand1Value +
                differenceValue;

            totalDemand1 +=
                demand1Value;

            totalDifference +=
                differenceValue;

            totalDemand2 +=
                demand2Value;

            xml += '<Row>';

            xml += '<Cell>';
            xml += '<Data ss:Type="String">';
            xml += this.escapeXml(
                finField.label
            );
            xml += '</Data>';
            xml += '</Cell>';

            xml += '<Cell>';
            xml += '<Data ss:Type="Number">';
            xml += demand1Value.toFixed(2);
            xml += '</Data>';
            xml += '</Cell>';

            xml += '<Cell>';
            xml += '<Data ss:Type="Number">';
            xml += differenceValue.toFixed(2);
            xml += '</Data>';
            xml += '</Cell>';

            xml += '<Cell>';
            xml += '<Data ss:Type="Number">';
            xml += demand2Value.toFixed(2);
            xml += '</Data>';
            xml += '</Cell>';

            xml += '</Row>';
        }

        // =====================================================
        // TOTAL ROW
        // =====================================================

        xml += '<Row>';

        xml += '<Cell ss:StyleID="Total">';
        xml += '<Data ss:Type="String">';
        xml += 'TOTAL';
        xml += '</Data>';
        xml += '</Cell>';

        xml += '<Cell ss:StyleID="Total">';
        xml += '<Data ss:Type="Number">';
        xml += totalDemand1.toFixed(2);
        xml += '</Data>';
        xml += '</Cell>';

        xml += '<Cell ss:StyleID="Total">';
        xml += '<Data ss:Type="Number">';
        xml += totalDifference.toFixed(2);
        xml += '</Data>';
        xml += '</Cell>';

        xml += '<Cell ss:StyleID="Total">';
        xml += '<Data ss:Type="Number">';
        xml += totalDemand2.toFixed(2);
        xml += '</Data>';
        xml += '</Cell>';

        xml += '</Row>';

        // =====================================================
        // CLOSE XML
        // =====================================================

        xml += '</Table>';

        xml += '</Worksheet>';

        xml += '</Workbook>';

        // =====================================================
        // ATTACH FILE
        // =====================================================

        var fileName =
            'Demand_Comparison_' +
            demand1.getDisplayValue('number') +
            '_VS_' +
            demand2.getDisplayValue('number') +
            '.xls';

        var attachment =
            new GlideSysAttachment();

        attachment.write(
            'dmn_demand',
            targetRecordSysId,
            fileName,
            'application/vnd.ms-excel',
            xml
        );

        return 'Excel generated successfully';

    } catch (ex) {

        gs.error(
            'Excel Generation Error: ' +
            ex.message
        );

        return 'Excel generation failed: ' +
            ex.message;
    }
},
escapeXml: function(text) {

    if (!text)
        return '';

    text = text.toString();

    text = text.replace(/&/g, '&amp;');
    text = text.replace(/</g, '&lt;');
    text = text.replace(/>/g, '&gt;');
    text = text.replace(/"/g, '&quot;');
    text = text.replace(/'/g, '&apos;');

    return text;
},
