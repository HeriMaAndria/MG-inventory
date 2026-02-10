document.addEventListener('DOMContentLoaded', () => { loadClients(); });
function loadClients() {
    const clients = DB.getClients();
    const tbody = document.getElementById('clientsTableBody');
    if (clients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Aucun client enregistré.</td></tr>';
        return;
    }
    const sorted = clients.sort((a, b) => new Date(b.lastPurchaseDate) - new Date(a.lastPurchaseDate));
    tbody.innerHTML = sorted.map(client => {
        const lastDate = new Date(client.lastPurchaseDate).toLocaleDateString('fr-FR');
        return `<tr><td><strong>${client.name}</strong></td><td>${client.phone || '-'}</td><td>${client.address || '-'}</td><td>${client.totalPurchases || 0}</td><td>${lastDate}</td><td class="table-actions"><button class="btn-icon btn-edit" onclick="editClient('${client.id}')" title="Modifier">✏️</button><button class="btn-icon btn-delete" onclick="deleteClient('${client.id}')" title="Supprimer">🗑️</button></td></tr>`;
    }).join('');
}
function filterClients() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const clients = DB.getClients();
    const filtered = clients.filter(c => c.name.toLowerCase().includes(search) || (c.phone && c.phone.toLowerCase().includes(search)));
    const tbody = document.getElementById('clientsTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Aucun client trouvé pour "${search}"</td></tr>`;
        return;
    }
    tbody.innerHTML = filtered.map(client => {
        const lastDate = new Date(client.lastPurchaseDate).toLocaleDateString('fr-FR');
        return `<tr><td><strong>${client.name}</strong></td><td>${client.phone || '-'}</td><td>${client.address || '-'}</td><td>${client.totalPurchases || 0}</td><td>${lastDate}</td><td class="table-actions"><button class="btn-icon btn-edit" onclick="editClient('${client.id}')">✏️</button><button class="btn-icon btn-delete" onclick="deleteClient('${client.id}')">🗑️</button></td></tr>`;
    }).join('');
}
function showAddClient() {
    document.getElementById('modalClientTitle').textContent = 'Ajouter un client';
    document.getElementById('editClientId').value = '';
    document.getElementById('clientName').value = '';
    document.getElementById('clientPhone').value = '';
    document.getElementById('clientAddress').value = '';
    document.getElementById('modalClient').classList.add('active');
    document.getElementById('clientName').focus();
}
function editClient(id) {
    const clients = DB.getClients();
    const client = clients.find(c => c.id === id);
    if (!client) return;
    document.getElementById('modalClientTitle').textContent = 'Modifier le client';
    document.getElementById('editClientId').value = id;
    document.getElementById('clientName').value = client.name;
    document.getElementById('clientPhone').value = client.phone || '';
    document.getElementById('clientAddress').value = client.address || '';
    document.getElementById('modalClient').classList.add('active');
}
function saveClient() {
    const name = document.getElementById('clientName').value.trim();
    if (!name) { alert('❌ Le nom est obligatoire'); return; }
    const client = {
        name: name,
        phone: document.getElementById('clientPhone').value.trim(),
        address: document.getElementById('clientAddress').value.trim()
    };
    const editId = document.getElementById('editClientId').value;
    if (editId) {
        DB.updateClient(editId, client);
        alert('✅ Client modifié avec succès !');
    } else {
        DB.addClient(client);
        alert('✅ Client ajouté avec succès !');
    }
    closeClientModal();
    loadClients();
}
function deleteClient(id) {
    const clients = DB.getClients();
    const client = clients.find(c => c.id === id);
    if (!client) return;
    if (confirm(`⚠️ Voulez-vous vraiment supprimer le client ${client.name} ?`)) {
        DB.deleteClient(id);
        loadClients();
        alert('✅ Client supprimé avec succès');
    }
}
function closeClientModal() {
    document.getElementById('modalClient').classList.remove('active');
}
