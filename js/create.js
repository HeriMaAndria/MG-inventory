// ========================================
// CREATE.JS - LOGIQUE CRÉATION/MODIFICATION
// ========================================

let currentEditingId = null;
let articleCounter = 0;

// ========================================
// INITIALISATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    loadSidebarInvoices();
    loadClientsAutocomplete();
    loadStockAutocomplete();
    
    document.getElementById('invoiceDate').value = new Date().toISOString().split('T')[0];
    
    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get('id');
    
    if (invoiceId) {
        loadInvoiceForEdit(invoiceId);
    } else {
        updateInvoiceNumber();
        addArticle();
    }
});

function loadSettings() {
    const settings = DB.getSettings();
    document.getElementById('companyName').value = settings.companyName;
    document.getElementById('companyActivity').value = settings.companyActivity;
    document.getElementById('companyAddress').value = settings.companyAddress;
    document.getElementById('companyStat').value = settings.companyStat;
    document.getElementById('companyNif').value = settings.companyNif;
    document.getElementById('companyPhone').value = settings.companyPhone;
}

function updateInvoiceNumber() {
    const number = DB.getNextInvoiceNumber();
    document.getElementById('invoiceNumber').textContent = `N° ${number}`;
}

// ========================================
// SIDEBAR
// ========================================
function loadSidebarInvoices() {
    const invoices = DB.getInvoices();
    const sidebarList = document.getElementById('sidebarList');
    
    if (invoices.length === 0) {
        sidebarList.innerHTML = '<div class="sidebar-empty">Aucune facture</div>';
        return;
    }
    
    const sortedInvoices = invoices.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    sidebarList.innerHTML = sortedInvoices.map(invoice => `
        <div class="sidebar-item ${invoice.id === currentEditingId ? 'active' : ''}" 
             onclick="loadInvoiceForEdit('${invoice.id}')">
            <div class="sidebar-item-title">${invoice.number}</div>
            <div class="sidebar-item-subtitle">${invoice.client.name}</div>
            <div class="sidebar-item-amount">${formatNumber(invoice.total)} Ar</div>
        </div>
    `).join('');
}

function filterSidebarInvoices() {
    const searchTerm = document.getElementById('sidebarSearch').value.toLowerCase();
    const invoices = DB.getInvoices();
    
    const filtered = invoices.filter(invoice => 
        invoice.number.toLowerCase().includes(searchTerm) ||
        invoice.client.name.toLowerCase().includes(searchTerm)
    );
    
    const sidebarList = document.getElementById('sidebarList');
    
    if (filtered.length === 0) {
        sidebarList.innerHTML = '<div class="sidebar-empty">Aucun résultat</div>';
        return;
    }
    
    sidebarList.innerHTML = filtered.map(invoice => `
        <div class="sidebar-item ${invoice.id === currentEditingId ? 'active' : ''}" 
             onclick="loadInvoiceForEdit('${invoice.id}')">
            <div class="sidebar-item-title">${invoice.number}</div>
            <div class="sidebar-item-subtitle">${invoice.client.name}</div>
            <div class="sidebar-item-amount">${formatNumber(invoice.total)} Ar</div>
        </div>
    `).join('');
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const btnOpen = document.getElementById('btnOpenSidebar');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    btnOpen.classList.toggle('hidden');
}

// ========================================
// AUTOCOMPLÉTION
// ========================================
function loadClientsAutocomplete() {
    const clients = DB.getClients();
    const datalist = document.getElementById('clientsList');
    
    datalist.innerHTML = clients.map(client => 
        `<option value="${client.name}">${client.phone ? ' - ' + client.phone : ''}</option>`
    ).join('');
}

function onClientNameChange() {
    const clientName = document.getElementById('clientName').value;
    const client = DB.getClientByName(clientName);
    
    if (client) {
        document.getElementById('clientPhone').value = client.phone || '';
        document.getElementById('clientAddress').value = client.address || '';
    }
}

function loadStockAutocomplete() {
    // Pour usage futur avec datalist sur les articles
}

// ========================================
// AJOUT RAPIDE CLIENT
// ========================================
function showQuickAddClient() {
    document.getElementById('modalQuickClient').classList.add('active');
    document.getElementById('quickClientName').value = '';
    document.getElementById('quickClientPhone').value = '';
    document.getElementById('quickClientAddress').value = '';
    document.getElementById('quickClientName').focus();
}

function closeQuickAddClient() {
    document.getElementById('modalQuickClient').classList.remove('active');
}

function saveQuickClient() {
    const name = document.getElementById('quickClientName').value.trim();
    
    if (!name) {
        alert('❌ Le nom du client est obligatoire');
        return;
    }
    
    const client = {
        name: name,
        phone: document.getElementById('quickClientPhone').value.trim(),
        address: document.getElementById('quickClientAddress').value.trim()
    };
    
    DB.addClient(client);
    
    document.getElementById('clientName').value = client.name;
    document.getElementById('clientPhone').value = client.phone;
    document.getElementById('clientAddress').value = client.address;
    
    loadClientsAutocomplete();
    closeQuickAddClient();
    alert('✅ Client ajouté avec succès !');
}

// ========================================
// AJOUT RAPIDE STOCK
// ========================================
function showQuickAddStock() {
    document.getElementById('modalQuickStock').classList.add('active');
    document.getElementById('quickStockName').value = '';
    document.getElementById('quickStockPrice').value = '0';
    document.getElementById('quickStockUnit').value = 'm';
    document.getElementById('quickStockQuantity').value = '0';
    document.getElementById('quickStockName').focus();
}

function closeQuickAddStock() {
    document.getElementById('modalQuickStock').classList.remove('active');
}

function saveQuickStock() {
    const name = document.getElementById('quickStockName').value.trim();
    
    if (!name) {
        alert('❌ Le nom de l\'article est obligatoire');
        return;
    }
    
    const item = {
        name: name,
        unitPrice: parseFloat(document.getElementById('quickStockPrice').value) || 0,
        unit: document.getElementById('quickStockUnit').value,
        quantity: parseFloat(document.getElementById('quickStockQuantity').value) || 0
    };
    
    DB.addStockItem(item);
    closeQuickAddStock();
    alert('✅ Article ajouté au stock avec succès !');
}

// ========================================
// CHARGEMENT FACTURE
// ========================================
function loadInvoiceForEdit(invoiceId) {
    const invoice = DB.getInvoiceById(invoiceId);
    
    if (!invoice) {
        alert('❌ Facture introuvable');
        return;
    }
    
    currentEditingId = invoiceId;
    
    document.getElementById('pageTitle').textContent = '✏️ Modifier Facture';
    document.getElementById('invoiceNumber').textContent = `N° ${invoice.number}`;
    
    document.getElementById('invoiceDate').value = invoice.date;
    document.getElementById('clientName').value = invoice.client.name;
    document.getElementById('clientPhone').value = invoice.client.phone || '';
    document.getElementById('clientAddress').value = invoice.client.address || '';
    document.getElementById('invoiceNotes').value = invoice.notes || '';
    
    document.getElementById('articlesList').innerHTML = '';
    articleCounter = 0;
    
    invoice.articles.forEach(article => {
        const articleId = addArticle();
        const articleElem = document.getElementById(articleId);
        
        articleElem.querySelector('.article-name').value = article.name;
        articleElem.querySelector('.article-unit-price').value = article.unitPrice;
        articleElem.querySelector('.article-price-unit').value = article.priceUnit;
        
        const defaultDetail = articleElem.querySelector('.detail-line');
        if (defaultDetail) defaultDetail.remove();
        
        article.details.forEach(detail => {
            addDetailLine(articleId);
            const detailLines = articleElem.querySelectorAll('.detail-line');
            const lastDetail = detailLines[detailLines.length - 1];
            
            lastDetail.querySelector('.detail-units').value = detail.units;
            lastDetail.querySelector('.detail-size').value = detail.size || '';
        });
    });
    
    if (invoice.delivery && invoice.delivery.enabled) {
        document.getElementById('enableDelivery').checked = true;
        document.getElementById('deliveryFields').style.display = 'block';
        document.getElementById('deliveryUnitPrice').value = invoice.delivery.unitPrice;
        document.getElementById('deliveryQuantity').value = invoice.delivery.quantity || 0;
    }
    
    calculateTotals();
    loadSidebarInvoices();
}

// ========================================
// GESTION ARTICLES
// ========================================
function addArticle() {
    articleCounter++;
    const articleId = `article-${articleCounter}-${Date.now()}`;
    
    const articleHTML = `
        <div class="article-item" id="${articleId}">
            <div class="article-header">
                <h3>Article</h3>
                <button class="btn-remove-article" onclick="removeArticle('${articleId}')">🗑️ Supprimer</button>
            </div>
            
            <div class="article-main-info">
                <div class="form-group">
                    <label>Nom de l'article *</label>
                    <input type="text" class="article-name" placeholder="Ex: TPG Rouges 0.40" oninput="calculateTotals()">
                </div>
                <div class="form-group">
                    <label>Prix unitaire (Ar) *</label>
                    <input type="number" class="article-unit-price" placeholder="10000" step="1" value="0" oninput="calculateTotals()">
                </div>
                <div class="form-group">
                    <label>Unité de prix</label>
                    <select class="article-price-unit" onchange="calculateTotals()">
                        <option value="m">par mètre (m)</option>
                        <option value="m²">par m²</option>
                        <option value="kg">par kg</option>
                        <option value="pièce">par pièce</option>
                        <option value="L">par litre</option>
                        <option value="sac">par sac</option>
                    </select>
                </div>
            </div>
            
            <div class="article-details-section">
                <h4>Lignes de l'article</h4>
                <div class="details-list"></div>
                <button class="btn-add-detail" onclick="addDetailLine('${articleId}')">➕ Ajouter ligne</button>
            </div>
            
            <div class="article-total">
                Quantité totale: <span class="article-qty-total">0</span> | 
                Total article: <span class="article-total-amount">0 Ar</span>
            </div>
        </div>
    `;
    
    document.getElementById('articlesList').insertAdjacentHTML('beforeend', articleHTML);
    addDetailLine(articleId);
    
    return articleId;
}

function removeArticle(articleId) {
    const articles = document.querySelectorAll('.article-item');
    if (articles.length > 1) {
        document.getElementById(articleId).remove();
        calculateTotals();
    } else {
        alert('⚠️ Vous devez garder au moins un article');
    }
}

function addDetailLine(articleId) {
    const detailId = `detail-${Date.now()}`;
    const detailHTML = `
        <div class="detail-line" id="${detailId}">
            <input type="number" class="detail-units" placeholder="Unité" step="1" value="1" oninput="calculateTotals()">
            <input type="text" class="detail-size" placeholder="Taille (optionnel)" oninput="calculateTotals()">
            <input type="text" class="detail-calc" placeholder="Calcul" readonly>
            <button class="btn-remove-detail" onclick="removeDetailLine('${detailId}')">✖</button>
        </div>
    `;
    
    const article = document.getElementById(articleId);
    article.querySelector('.details-list').insertAdjacentHTML('beforeend', detailHTML);
    calculateTotals();
}

function removeDetailLine(detailId) {
    const detail = document.getElementById(detailId);
    const article = detail.closest('.article-item');
    const detailsCount = article.querySelectorAll('.detail-line').length;
    
    if (detailsCount > 1) {
        detail.remove();
        calculateTotals();
    } else {
        alert('⚠️ Vous devez garder au moins une ligne');
    }
}

// ========================================
// CALCULS
// ========================================
function calculateTotals() {
    let grandTotal = 0;
    
    document.querySelectorAll('.article-item').forEach(article => {
        const unitPrice = parseFloat(article.querySelector('.article-unit-price').value) || 0;
        let articleTotal = 0;
        let articleQty = 0;
        
        article.querySelectorAll('.detail-line').forEach(detail => {
            const units = parseFloat(detail.querySelector('.detail-units').value) || 1;
            const sizeInput = detail.querySelector('.detail-size').value.trim();
            
            let size = 1;
            if (sizeInput) {
                size = parseFloat(sizeInput.replace(/[^\d.,]/g, '').replace(',', '.')) || 1;
            }
            
            const qty = units * size;
            const lineTotal = qty * unitPrice;
            
            articleQty += qty;
            articleTotal += lineTotal;
            
            const calcText = sizeInput ? `${units} × ${size} = ${qty.toFixed(2)}` : `${units}`;
            detail.querySelector('.detail-calc').value = calcText;
        });
        
        article.querySelector('.article-qty-total').textContent = articleQty.toFixed(2);
        article.querySelector('.article-total-amount').textContent = formatNumber(articleTotal) + ' Ar';
        
        grandTotal += articleTotal;
    });
    
    document.getElementById('totalArticles').textContent = formatNumber(grandTotal) + ' Ar';
    
    // Livraison MODIFIÉE - quantité éditable
    const deliveryEnabled = document.getElementById('enableDelivery').checked;
    let deliveryAmount = 0;
    
    if (deliveryEnabled) {
        const deliveryUnitPrice = parseFloat(document.getElementById('deliveryUnitPrice').value) || 0;
        const deliveryQuantity = parseFloat(document.getElementById('deliveryQuantity').value) || 0;
        deliveryAmount = deliveryQuantity * deliveryUnitPrice;
        
        document.getElementById('deliveryAmount').value = formatNumber(deliveryAmount) + ' Ar';
        document.getElementById('deliveryTotal').textContent = formatNumber(deliveryAmount) + ' Ar';
        document.getElementById('deliveryTotalLine').style.display = 'block';
        
        grandTotal += deliveryAmount;
    } else {
        document.getElementById('deliveryTotalLine').style.display = 'none';
    }
    
    document.getElementById('totalAmount').textContent = formatNumber(grandTotal) + ' Ar';
}

function toggleDelivery() {
    const enabled = document.getElementById('enableDelivery').checked;
    document.getElementById('deliveryFields').style.display = enabled ? 'block' : 'none';
    calculateTotals();
}

// ========================================
// VALIDATION ET SAUVEGARDE
// ========================================
function validateForm() {
    const clientName = document.getElementById('clientName').value.trim();
    const invoiceDate = document.getElementById('invoiceDate').value;
    
    if (!clientName) {
        alert('❌ Le nom du client est obligatoire');
        return false;
    }
    
    if (!invoiceDate) {
        alert('❌ La date de la facture est obligatoire');
        return false;
    }
    
    const articles = getArticlesData();
    if (articles.length === 0) {
        alert('❌ Vous devez ajouter au moins un article avec un nom');
        return false;
    }
    
    return true;
}

function getFormData() {
    const articles = getArticlesData();
    const deliveryEnabled = document.getElementById('enableDelivery').checked;
    
    let total = articles.reduce((sum, article) => sum + article.total, 0);
    let deliveryData = null;
    
    if (deliveryEnabled) {
        const deliveryQuantity = parseFloat(document.getElementById('deliveryQuantity').value) || 0;
        const deliveryUnitPrice = parseFloat(document.getElementById('deliveryUnitPrice').value) || 0;
        const deliveryAmount = deliveryQuantity * deliveryUnitPrice;
        
        deliveryData = {
            enabled: true,
            quantity: deliveryQuantity,
            unitPrice: deliveryUnitPrice,
            amount: deliveryAmount
        };
        
        total += deliveryAmount;
    }
    
    return {
        number: currentEditingId ? DB.getInvoiceById(currentEditingId).number : DB.getNextInvoiceNumber(),
        date: document.getElementById('invoiceDate').value,
        client: {
            name: document.getElementById('clientName').value.trim(),
            phone: document.getElementById('clientPhone').value.trim(),
            address: document.getElementById('clientAddress').value.trim()
        },
        company: {
            name: document.getElementById('companyName').value.trim(),
            activity: document.getElementById('companyActivity').value.trim(),
            address: document.getElementById('companyAddress').value.trim(),
            stat: document.getElementById('companyStat').value.trim(),
            nif: document.getElementById('companyNif').value.trim(),
            phone: document.getElementById('companyPhone').value.trim()
        },
        articles: articles,
        delivery: deliveryData,
        notes: document.getElementById('invoiceNotes').value.trim(),
        total: total
    };
}

function getArticlesData() {
    const articles = [];
    
    document.querySelectorAll('.article-item').forEach(article => {
        const name = article.querySelector('.article-name').value.trim();
        
        if (!name) return;
        
        const unitPrice = parseFloat(article.querySelector('.article-unit-price').value) || 0;
        const priceUnit = article.querySelector('.article-price-unit').value;
        
        const details = [];
        let articleTotal = 0;
        
        article.querySelectorAll('.detail-line').forEach(detail => {
            const units = parseFloat(detail.querySelector('.detail-units').value) || 1;
            const sizeInput = detail.querySelector('.detail-size').value.trim();
            const size = sizeInput ? (parseFloat(sizeInput.replace(/[^\d.,]/g, '').replace(',', '.')) || 1) : 1;
            
            const qty = units * size;
            const lineTotal = qty * unitPrice;
            
            details.push({
                units: units,
                size: sizeInput || '',
                quantity: qty,
                total: lineTotal
            });
            
            articleTotal += lineTotal;
        });
        
        articles.push({
            name: name,
            unitPrice: unitPrice,
            priceUnit: priceUnit,
            details: details,
            total: articleTotal
        });
    });
    
    return articles;
}

function saveInvoiceDraft() {
    if (!validateForm()) {
        return;
    }
    
    const data = getFormData();
    
    if (currentEditingId) {
        DB.updateInvoice(currentEditingId, data);
        alert('✅ Facture modifiée avec succès !');
    } else {
        const invoice = DB.addInvoice(data);
        currentEditingId = invoice.id;
        alert('✅ Facture enregistrée avec succès !');
    }
    
    loadSidebarInvoices();
}

function goToPreview() {
    if (!validateForm()) {
        return;
    }
    
    const data = getFormData();
    
    if (currentEditingId) {
        DB.updateInvoice(currentEditingId, data);
    } else {
        const invoice = DB.addInvoice(data);
        currentEditingId = invoice.id;
    }
    
    window.location.href = `depot.html?id=${currentEditingId}`;
}

function formatNumber(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
