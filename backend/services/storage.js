import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');

/**
 * Simple JSON file-based storage service
 */
class JsonStorage {
  constructor(filename) {
    this.filepath = path.join(DATA_DIR, filename);
  }

  async read() {
    try {
      const data = await fs.readFile(this.filepath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async write(data) {
    await fs.writeFile(this.filepath, JSON.stringify(data, null, 2));
  }

  async findAll() {
    return this.read();
  }

  async findById(id) {
    const items = await this.read();
    return items.find(item => item.id === id);
  }

  async create(item) {
    const items = await this.read();
    items.push(item);
    await this.write(items);
    return item;
  }

  async update(id, updates) {
    const items = await this.read();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    await this.write(items);
    return items[index];
  }

  async delete(id) {
    const items = await this.read();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return false;

    items.splice(index, 1);
    await this.write(items);
    return true;
  }
}

export const projectsStorage = new JsonStorage('projects.json');
export const draftsStorage = new JsonStorage('drafts.json');

export default JsonStorage;
