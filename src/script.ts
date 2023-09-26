import fs from 'fs';
import path from 'path';

const root = 'files';
const files = fs.readdirSync(root);

// Sort files first if they are out of order.
// You can customize this sort function based on your current naming convention.
files.sort((a, b) => {
  // Assuming files are named like "file10.txt", "file2.txt", etc.
  // Extract numbers and compare. Adjust this if your naming convention is different.
  const numA = parseInt(a.match(/\d+/)?.[0] || '0');
  const numB = parseInt(b.match(/\d+/)?.[0] || '0');
  return numA - numB;
});

files.forEach((file, index) => {
  const ext = path.extname(file); // Preserving the file extension
  const newFilename = `monkey${index + 1}${ext}`;
  fs.renameSync(path.join(root, file), path.join(root, newFilename));
});

console.log('Files have been renamed!');
