import express from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { WorkOrder } from '../types';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// In-memory storage for work orders (replace with database in production)
let workOrders: WorkOrder[] = [];

// Get all work orders
router.get('/', (req, res) => {
  res.json(workOrders);
});

// Create a new work order
router.post('/', (req, res) => {
  try {
    const workOrder: WorkOrder = req.body;
    workOrders.push(workOrder);
    res.status(201).json(workOrder);
  } catch (error) {
    res.status(400).json({ error: 'Invalid work order data' });
  }
});

// Upload Excel file
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<any>(worksheet);

    const newWorkOrders = data.map((row: any) => ({
      workOrderNo: row['Work Order No.'] || row['workOrderNo'],
      partNo: row['Part No.'] || row['partNo'],
      quantity: Number(row['Quantity'] || row['quantity']),
      startDate: row['Start Date'] || row['startDate'],
      endDate: row['End Date'] || row['endDate'],
      status: row['Status'] || row['status'] || 'Open',
      priority: row['Priority'] || row['priority'] || 'Medium',
      description: row['Description'] || row['description'] || ''
    }));

    workOrders = [...workOrders, ...newWorkOrders];
    res.json({ message: 'File uploaded successfully', count: newWorkOrders.length });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(400).json({ error: 'Failed to process file' });
  }
});

export { router }; 