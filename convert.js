const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const { Parser } = require('json2csv');

// Directory containing your JSON files
const jsonDir = './data'; // Replace with your directory
const outputCsv = './output.csv';

(async () => {
  try {
    const fields = ['id', 'title', 'upload_date']; // Fields to extract
    const rows = [];

    const files = fs.readdirSync(jsonDir).filter(file => file.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(jsonDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);

      // Convert `upload_date` to UTC-8 timezone
      let uploadDate = jsonData.upload_date || 'N/A'; // Handle missing dates
      if (uploadDate !== 'N/A') {
        // Assuming `upload_date` is in 'YYYYMMDD' format
        const formattedDate = moment(uploadDate, 'YYYYMMDD')
          .tz('America/Los_Angeles') // Convert to UTC-8 (Pacific Time)
          .format('YYYY-MM-DD'); // Format to standard date
        uploadDate = formattedDate;
      }

      rows.push({
        id: jsonData.id,
        title: jsonData.title,
        upload_date: uploadDate,
      });
    }

    // Convert rows to CSV
    const json2csvParser = new Parser({ fields });
    const csvData = json2csvParser.parse(rows);

    // Write CSV to file
    fs.writeFileSync(outputCsv, csvData);
    console.log('CSV file successfully created:', outputCsv);
  } catch (error) {
    console.error('Error processing files:', error);
  }
})();
