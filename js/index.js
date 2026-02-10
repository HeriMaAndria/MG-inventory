// ========================================
// INDEX.JS - LOGIQUE TABLEAU DE BORD
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
});

function loadDashboard() {
    loadStats();
    loadRecentInvoicesPreview();
    loadInvoices();
}

function loadStats() {
    const stats = DB.getStats();
    const stock = DB.getStock();
    const clients = DB.getClients();
    
    document.getElementById('statMonthTotal').textContent = formatNumber(stats.monthTotal) + ' Ar';
    document.getElementById('statTotalInvoices').textContent = stats.totalInvoices;
    document.getElementById('statTotalClients').textContent = clients.length;
    document.getElementById('statStockItems').textContent = stock.length;
}

function loadRecentInvoicesPreview() {
    const invoices = DB.getInvoices();
    const container = document.getElementById('recentInvoicesPreview');
    
    if (invoices.length === 0) {
        container.innerHTML = `
            <div class="empty-preview">
                <p>Aucune facture récente</p>
                <a href="create.html" class="btn btn-primary">Créer votre première facture</a>
            </div>
        `;
        return;
    }
    
    const recentInvoices = invoices
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);
    
    container.innerHTML = recentInvoices.map(invoice => {
        const date = new Date(invoice.date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short'
        });
        
        return `
            <div class="invoice-preview-card" onclick="window.location.href='depot.html?id=${invoice.id}'">
                <div class="invoice-preview-header">
                    <span class="invoice-preview-number">${invoice.number}</span>
                    <span class="invoice-preview-date">${date}</span>
                </div>
                <div class="invoice-preview-client">${invoice.client.name}</div>
                <div class="invoice-preview-amount">${formatNumber(invoice.total)} Ar</div>
                <div class="invoice-preview-actions">
                    <button onclick="event.stopPropagation(); window.location.href='depot.html?id=${invoice.id}'" class="btn-mini btn-view" title="Voir">👁️</button>
                    <button onclick="event.stopPropagation(); window.location.href='create.html?id=${invoice.id}'" class="btn-mini btn-edit" title="Modifier">✏️</button>
                    <button onclick="event.stopPropagation(); deleteInvoice('${invoice.id}')" class="btn-mini btn-delete" title="Supprimer">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

function loadInvoices() {
    const invoices = DB.getInvoices();
    const tbody = document.getElementById('invoiceTableBody');
    
    if (invoices.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    Aucune facture pour le moment. Créez votre première facture !
                </td>
            </tr>
        `;
        return;
    }
    
    const sortedInvoices = invoices.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    tbody.innerHTML = sortedInvoices.map(invoice => {
        const date = new Date(invoice.date).toLocaleDateString('fr-FR');
        
        return `
            <tr>
                <td><strong>${invoice.number}</strong></td>
                <td>${date}</td>
                <td>${invoice.client.name}</td>
                <td><strong>${formatNumber(invoice.total)} Ar</strong></td>
                <td class="table-actions">
                    <a href="depot.html?id=${invoice.id}" class="btn-icon btn-view" title="Voir">👁️</a>
                    <a href="create.html?id=${invoice.id}" class="btn-icon btn-edit" title="Modifier">✏️</a>
                    <button class="btn-icon btn-delete" onclick="deleteInvoice('${invoice.id}')" title="Supprimer">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterInvoices() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const invoices = DB.getInvoices();
    
    const filtered = invoices.filter(invoice => 
        invoice.number.toLowerCase().includes(searchTerm) ||
        invoice.client.name.toLowerCase().includes(searchTerm) ||
        (invoice.client.phone && invoice.client.phone.toLowerCase().includes(searchTerm))
    );
    
    const tbody = document.getElementById('invoiceTableBody');
    
    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    Aucune facture trouvée pour "${searchTerm}"
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filtered.map(invoice => {
        const date = new Date(invoice.date).toLocaleDateString('fr-FR');
        
        return `
            <tr>
                <td><strong>${invoice.number}</strong></td>
                <td>${date}</td>
                <td>${invoice.client.name}</td>
                <td><strong>${formatNumber(invoice.total)} Ar</strong></td>
                <td class="table-actions">
                    <a href="depot.html?id=${invoice.id}" class="btn-icon btn-view" title="Voir">👁️</a>
                    <a href="create.html?id=${invoice.id}" class="btn-icon btn-edit" title="Modifier">✏️</a>
                    <button class="btn-icon btn-delete" onclick="deleteInvoice('${invoice.id}')" title="Supprimer">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

function deleteInvoice(id) {
    const invoice = DB.getInvoiceById(id);
    
    if (!invoice) {
        alert('❌ Facture introuvable');
        return;
    }
    
    if (confirm(`⚠️ Voulez-vous vraiment supprimer la facture ${invoice.number} ?`)) {
        DB.deleteInvoice(id);
        loadDashboard();
        alert('✅ Facture supprimée avec succès');
    }
}

function exportData() {
    const data = DB.exportAllData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `factures_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert('✅ Données exportées avec succès !');
}

function resetData() {
    if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer TOUTES les données ? Cette action est irréversible !')) {
        if (confirm('🔴 DERNIÈRE CONFIRMATION : Toutes les factures, clients et stock seront définitivement supprimés !')) {
            DB.resetAllData();
            loadDashboard();
            alert('✅ Toutes les données ont été supprimées');
        }
    }
}

function formatNumber(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
