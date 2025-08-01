import xlsx from 'xlsx';
import fs from 'fs';

export const uploadExcel = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    fs.unlinkSync(req.file.path); // remove file after processing
    res.json({ sheet: sheetName, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};