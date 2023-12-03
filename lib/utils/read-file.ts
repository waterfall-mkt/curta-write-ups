import fs from 'fs';
import path from 'path';

const readFile = async (filename: string) => {
  const root = process.cwd();
  const filePath = path.join(root, filename);
  const source = fs.readFileSync(filePath, 'utf8');

  return source;
};

export default readFile;
