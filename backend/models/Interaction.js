const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const INTERACTIONS_FILE = path.join(DATA_DIR, 'interactions.json');

class Interaction {
    constructor(data) {
        this.type = data.type;
        this.page = data.page;
        this.element = data.element || '';
        this.userAgent = data.userAgent || '';
        this.ip = data.ip || '';
        this.timestamp = data.timestamp || new Date().toISOString();
        this.sessionId = data.sessionId || '';
        this.metadata = data.metadata || {};
    }

    static async ensureDataDir() {
        try {
            await fs.access(DATA_DIR);
        } catch {
            await fs.mkdir(DATA_DIR, { recursive: true });
        }
    }

    static async save(interaction) {
        await this.ensureDataDir();
        const interactions = await this.getAll();
        interactions.push(interaction);
        await fs.writeFile(INTERACTIONS_FILE, JSON.stringify(interactions, null, 2));
    }

    static async getAll() {
        try {
            const data = await fs.readFile(INTERACTIONS_FILE, 'utf8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    static async countDocuments(filter = {}) {
        const interactions = await this.getAll();
        return interactions.filter(item => {
            return Object.keys(filter).every(key => item[key] === filter[key]);
        }).length;
    }

    static async find(query = {}) {
        const interactions = await this.getAll();
        let results = interactions;

        if (query.type) {
            results = results.filter(item => item.type === query.type);
        }

        // Sort by timestamp descending
        results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Limit
        if (query.limit) {
            results = results.slice(0, query.limit);
        }

        return results;
    }
}

module.exports = Interaction;
