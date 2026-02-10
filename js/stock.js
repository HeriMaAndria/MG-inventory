document.addEventListener('DOMContentLoaded', () => { loadStock(); });
function loadStock() {
    const stock = DB.getStock();
    const tbody = document.getElementById('stockTableBody');
    if (stock.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Aucun article en stock.</td></tr>';
        return;
    }
    tbody.innerHTML = stock.map(item => {
        const lastDate = new Date(item.lastUpdated).toLocaleDateString('fr-FR');
        return `<tr><td><strong>${item.name}</strong></td><td>${item.unitPrice} Ar</td><td>${item.unit}</td><td>${item.quantity}</td><td>${lastDate}</td><td class="table-actions"><button class="btn-icon btn-edit" onclick="editStock('${item.id}')" title="Modifier">✏️</button><button class="btn-icon btn-delete" onclick="deleteStock('${item.id}')" title="Supprimer">🗑️</button></td></tr>`;
    }).join('');
}
function filterStock() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const stock = DB.getStock();
    const filtered = stock.filter(item => item.name.toLowerCase().includes(search));
    const tbody = document.getElementById('stockTableBody');
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Aucun article trouvé pour "${search}"</td></tr>`;
        return;
    }
    tbody.innerHTML = filtered.map(item => {
        const lastDate = new Date(item.lastUpdated).toLocaleDateString('fr-FR');
        return `<tr><td><strong>${item.name}</strong></td><td>${item.unitPrice} Ar</td><td>${item.unit}</td><td>${item.quantity}</td><td>${lastDate}</td><td class="table-actions"><button class="btn-icon btn-edit" onclick="editStock('${item.id}')">✏️</button><button class="btn-icon btn-delete" onclick="deleteStock('${item.id}')">🗑️</button></td></tr>`;
    }).join('');
}
function showAddStock() {
    document.getElementById('modalStockTitle').textContent = 'Ajouter un article';
    document.getElementById('editStockId').value = '';
    document.getElementById('stockName').value = '';
    document.getElementById('stockPrice').value = '0';
    document.getElementById('stockUnit').value = 'm';
    document.getElementById('stockQuantity').value = '0';
    document.getElementById('modalStock').classList.add('active');
    document.getElementById('stockName').focus();
}
function editStock(id) {
    const stock = DB.getStock();
    const item = stock.find(s => s.id === id);
    if (!item) return;
    document.getElementById('modalStockTitle').textContent = 'Modifier l\'article';
    document.getElementById('editStockId').value = id;
    document.getElementById('stockName').value = item.name;
    document.getElementById('stockPrice').value = item.unitPrice;
    document.getElementById('stockUnit').value = item.unit;
    document.getElementById('stockQuantity').value = item.quantity;
    document.getElementById('modalStock').classList.add('active');
}
function saveStock() {
    const name = document.getElementById('stockName').value.trim();
    if (!name) { alert('❌ Le nom est obligatoire'); return; }
    const item = {
        name: name,
        unitPrice: parseFloat(document.getElementById('stockPrice').value) || 0,
        unit: document.getElementById('stockUnit').value,
        quantity: parseFloat(document.getElementById('stockQuantity').value) || 0
    };
    const editId = document.getElementById('editStockId').value;
    if (editId) {
        DB.updateStockItem(editId, item);
        alert('✅ Article modifié avec succès !');
    } else {
        DB.addStockItem(item);
        alert('✅ Article ajouté avec succès !');
    }
    closeStockModal();
    loadStock();
}
function deleteStock(id) {
    const stock = DB.getStock();
    const item = stock.find(s => s.id === id);
    if (!item) return;
    if (confirm(`⚠️ Voulez-vous vraiment supprimer l'article ${item.name} ?`)) {
        DB.deleteStockItem(id);
        loadStock();
        alert('✅ Article supprimé avec succès');
    }
}
function closeStockModal() {
    document.getElementById('modalStock').classList.remove('active');
}
