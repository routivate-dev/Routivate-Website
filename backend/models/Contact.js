const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

class Contact {
    constructor(data) {
        this.name = data.name;
        this.email = data.email;
        this.mobile = data.mobile;
        this.message = data.message;
        this.timestamp = data.timestamp || new Date().toISOString();
        this.ip = data.ip || '';
        this.userAgent = data.userAgent || '';
    }

    static async ensureDataDir() {
        try {
            await fs.access(DATA_DIR);
        } catch {
            await fs.mkdir(DATA_DIR, { recursive: true });
        }
    }

    static async save(contact) {
        await this.ensureDataDir();
        const contacts = await this.getAll();
        contacts.push(contact);
        await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
    }

    static async getAll() {
        try {
            const data = await fs.readFile(CONTACTS_FILE, 'utf8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    static async countDocuments() {
        const contacts = await this.getAll();
        return contacts.length;
    }
}

module.exports = Contact;
