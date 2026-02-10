// ========================================
// DATABASE.JS - SOURCE DE VÉRITÉ
// Gestion centralisée de toutes les données
// ========================================

const DB = {
    // Clés localStorage
    KEYS: {
        INVOICES: 'invoices',
        CLIENTS: 'clients',
        STOCK: 'stock',
        SETTINGS: 'settings'
    },

    // ========================================
    // INITIALISATION
    // ========================================
    init() {
        if (!localStorage.getItem(this.KEYS.INVOICES)) {
            this.saveInvoices([]);
        }
        if (!localStorage.getItem(this.KEYS.CLIENTS)) {
            this.saveClients([]);
        }
        if (!localStorage.getItem(this.KEYS.STOCK)) {
            this.saveStock([]);
        }
        if (!localStorage.getItem(this.KEYS.SETTINGS)) {
            this.saveSettings(this.getDefaultSettings());
        }
    },

    getDefaultSettings() {
        return {
            companyName: 'FOIBENNY TSARA TOLES BY PASS',
            companyActivity: 'VENTES DES MATÉRIAUX DE CONSTRUCTION',
            companyAddress: 'Près Lavage Raitra',
            companyStat: '47521201201901044',
            companyNif: '6003278760',
            companyPhone: '0345476294 / 0389015842',
            invoicePrefix: 'FACT',
            currentYear: new Date().getFullYear()
        };
    },

    // ========================================
    // FACTURES (INVOICES)
    // ========================================
    getInvoices() {
        const data = localStorage.getItem(this.KEYS.INVOICES);
        return data ? JSON.parse(data) : [];
    },

    saveInvoices(invoices) {
        localStorage.setItem(this.KEYS.INVOICES, JSON.stringify(invoices));
    },

    addInvoice(invoice) {
        const invoices = this.getInvoices();
        invoice.id = this.generateId();
        invoice.createdAt = new Date().toISOString();
        invoice.updatedAt = new Date().toISOString();
        invoices.push(invoice);
        this.saveInvoices(invoices);
        
        this.updateOrAddClient(invoice.client);
        
        return invoice;
    },

    updateInvoice(id, updatedInvoice) {
        const invoices = this.getInvoices();
        const index = invoices.findIndex(inv => inv.id === id);
        
        if (index !== -1) {
            updatedInvoice.id = id;
            updatedInvoice.updatedAt = new Date().toISOString();
            updatedInvoice.createdAt = invoices[index].createdAt;
            invoices[index] = updatedInvoice;
            this.saveInvoices(invoices);
            
            this.updateOrAddClient(updatedInvoice.client);
            
            return true;
        }
        return false;
    },

    deleteInvoice(id) {
        const invoices = this.getInvoices();
        const filtered = invoices.filter(inv => inv.id !== id);
        this.saveInvoices(filtered);
        return true;
    },

    getInvoiceById(id) {
        const invoices = this.getInvoices();
        return invoices.find(inv => inv.id === id);
    },

    getNextInvoiceNumber() {
        const invoices = this.getInvoices();
        const settings = this.getSettings();
        const currentYear = new Date().getFullYear();
        
        const thisYearInvoices = invoices.filter(inv => {
            const invYear = new Date(inv.date).getFullYear();
            return invYear === currentYear;
        });
        
        const nextNumber = thisYearInvoices.length + 1;
        return `${settings.invoicePrefix}-${currentYear}-${String(nextNumber).padStart(3, '0')}`;
    },

    // ========================================
    // CLIENTS
    // ========================================
    getClients() {
        const data = localStorage.getItem(this.KEYS.CLIENTS);
        return data ? JSON.parse(data) : [];
    },

    saveClients(clients) {
        localStorage.setItem(this.KEYS.CLIENTS, JSON.stringify(clients));
    },

    addClient(client) {
        const clients = this.getClients();
        client.id = this.generateId();
        client.createdAt = new Date().toISOString();
        client.totalPurchases = 0;
        clients.push(client);
        this.saveClients(clients);
        return client;
    },

    updateClient(id, updatedClient) {
        const clients = this.getClients();
        const index = clients.findIndex(c => c.id === id);
        
        if (index !== -1) {
            updatedClient.id = id;
            updatedClient.createdAt = clients[index].createdAt;
            updatedClient.totalPurchases = clients[index].totalPurchases;
            clients[index] = updatedClient;
            this.saveClients(clients);
            return true;
        }
        return false;
    },

    deleteClient(id) {
        const clients = this.getClients();
        const filtered = clients.filter(c => c.id !== id);
        this.saveClients(filtered);
        return true;
    },

    updateOrAddClient(clientData) {
        if (!clientData.name) return;
        
        const clients = this.getClients();
        const existingIndex = clients.findIndex(c => 
            c.name.toLowerCase() === clientData.name.toLowerCase()
        );
        
        const client = {
            name: clientData.name,
            phone: clientData.phone || '',
            address: clientData.address || '',
            lastPurchaseDate: new Date().toISOString()
        };
        
        if (existingIndex !== -1) {
            client.id = clients[existingIndex].id;
            client.createdAt = clients[existingIndex].createdAt;
            client.totalPurchases = (clients[existingIndex].totalPurchases || 0) + 1;
            clients[existingIndex] = client;
        } else {
            client.id = this.generateId();
            client.createdAt = new Date().toISOString();
            client.totalPurchases = 1;
            clients.push(client);
        }
        
        this.saveClients(clients);
    },

    getClientByName(name) {
        const clients = this.getClients();
        return clients.find(c => c.name.toLowerCase() === name.toLowerCase());
    },

    // ========================================
    // STOCK
    // ========================================
    getStock() {
        const data = localStorage.getItem(this.KEYS.STOCK);
        return data ? JSON.parse(data) : [];
    },

    saveStock(stock) {
        localStorage.setItem(this.KEYS.STOCK, JSON.stringify(stock));
    },

    addStockItem(item) {
        const stock = this.getStock();
        item.id = this.generateId();
        item.createdAt = new Date().toISOString();
        item.lastUpdated = new Date().toISOString();
        stock.push(item);
        this.saveStock(stock);
        return item;
    },

    updateStockItem(id, updatedItem) {
        const stock = this.getStock();
        const index = stock.findIndex(s => s.id === id);
        
        if (index !== -1) {
            updatedItem.id = id;
            updatedItem.createdAt = stock[index].createdAt;
            updatedItem.lastUpdated = new Date().toISOString();
            stock[index] = updatedItem;
            this.saveStock(stock);
            return true;
        }
        return false;
    },

    deleteStockItem(id) {
        const stock = this.getStock();
        const filtered = stock.filter(s => s.id !== id);
        this.saveStock(filtered);
        return true;
    },

    // ========================================
    // PARAMÈTRES
    // ========================================
    getSettings() {
        const data = localStorage.getItem(this.KEYS.SETTINGS);
        return data ? JSON.parse(data) : this.getDefaultSettings();
    },

    saveSettings(settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    },

    // ========================================
    // STATISTIQUES
    // ========================================
    getStats() {
        const invoices = this.getInvoices();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthTotal = invoices
            .filter(inv => {
                const invDate = new Date(inv.date);
                return invDate.getMonth() === currentMonth && 
                       invDate.getFullYear() === currentYear;
            })
            .reduce((sum, inv) => sum + inv.total, 0);
        
        const totalInvoices = invoices.length;
        
        const lastInvoice = invoices.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        )[0];
        const lastClient = lastInvoice ? lastInvoice.client.name : '-';
        
        return {
            monthTotal,
            totalInvoices,
            lastClient
        };
    },

    // ========================================
    // UTILITAIRES
    // ========================================
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    exportAllData() {
        return {
            invoices: this.getInvoices(),
            clients: this.getClients(),
            stock: this.getStock(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
    },

    importData(data) {
        if (data.invoices) this.saveInvoices(data.invoices);
        if (data.clients) this.saveClients(data.clients);
        if (data.stock) this.saveStock(data.stock);
        if (data.settings) this.saveSettings(data.settings);
    },

    resetAllData() {
        localStorage.removeItem(this.KEYS.INVOICES);
        localStorage.removeItem(this.KEYS.CLIENTS);
        localStorage.removeItem(this.KEYS.STOCK);
        localStorage.removeItem(this.KEYS.SETTINGS);
        this.init();
    }
};

DB.init();
