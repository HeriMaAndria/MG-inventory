let currentInvoiceId = null;
let currentInvoiceData = null;

document.addEventListener('DOMContentLoaded', function() {
    loadSidebarInvoices();
    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get('id');
    
    if (invoiceId) {
        loadInvoicePreview(invoiceId);
    } else {
        const invoices = DB.getInvoices();
        if (invoices.length > 0) {
            const lastInvoice = invoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
            loadInvoicePreview(lastInvoice.id);
        } else {
            document.getElementById('invoicePreview').innerHTML = '<div style="text-align:center;padding:50px;color:#666;"><h2>Aucune facture à afficher</h2><p>Créez votre première facture.</p><a href="create.html" class="btn btn-primary">Créer une facture</a></div>';
        }
    }
});

function loadSidebarInvoices() {
    const invoices = DB.getInvoices();
    const sidebarList = document.getElementById('sidebarList');
    if (invoices.length === 0) {
        sidebarList.innerHTML = '<div class="sidebar-empty">Aucune facture</div>';
        return;
    }
    const sortedInvoices = invoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    sidebarList.innerHTML = sortedInvoices.map(invoice => `
        <div class="sidebar-item ${invoice.id === currentInvoiceId ? 'active' : ''}" onclick="loadInvoicePreview('${invoice.id}')">
            <div class="sidebar-item-title">${invoice.number}</div>
            <div class="sidebar-item-subtitle">${invoice.client.name}</div>
            <div class="sidebar-item-amount">${formatNumber(invoice.total)} Ar</div>
        </div>
    `).join('');
}

function filterSidebarInvoices() {
    const searchTerm = document.getElementById('sidebarSearch').value.toLowerCase();
    const invoices = DB.getInvoices();
    const filtered = invoices.filter(invoice => invoice.number.toLowerCase().includes(searchTerm) || invoice.client.name.toLowerCase().includes(searchTerm));
    const sidebarList = document.getElementById('sidebarList');
    if (filtered.length === 0) {
        sidebarList.innerHTML = '<div class="sidebar-empty">Aucun résultat</div>';
        return;
    }
    sidebarList.innerHTML = filtered.map(invoice => `
        <div class="sidebar-item ${invoice.id === currentInvoiceId ? 'active' : ''}" onclick="loadInvoicePreview('${invoice.id}')">
            <div class="sidebar-item-title">${invoice.number}</div>
            <div class="sidebar-item-subtitle">${invoice.client.name}</div>
            <div class="sidebar-item-amount">${formatNumber(invoice.total)} Ar</div>
        </div>
    `).join('');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebarOverlay').classList.toggle('active');
    document.getElementById('btnOpenSidebar').classList.toggle('hidden');
}

function loadInvoicePreview(invoiceId) {
    const invoice = DB.getInvoiceById(invoiceId);
    if (!invoice) { alert('❌ Facture introuvable'); return; }
    currentInvoiceId = invoiceId;
    currentInvoiceData = invoice;
    const newUrl = `${window.location.pathname}?id=${invoiceId}`;
    window.history.pushState({}, '', newUrl);
    generateInvoiceHTML(invoice);
    loadSidebarInvoices();
}

function generateInvoiceHTML(data) {
    const formattedDate = new Date(data.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    let tableRows = '';
    data.articles.forEach(article => {
        article.details.forEach((detail, index) => {
            const isFirstLine = index === 0;
            const units = detail.units;
            const size = detail.size || '';
            const calc = size ? `${units} × ${detail.size} = ${detail.quantity.toFixed(2)}` : `${units}`;
            tableRows += `<tr><td class="col-units">${units}</td><td class="col-size">${size}</td><td class="col-calc">${calc}</td><td class="col-designation">${isFirstLine ? article.name : ''}</td><td class="col-unit-price">${isFirstLine ? formatNumber(article.unitPrice) + ' Ar/' + article.priceUnit : ''}</td><td class="col-amount">${formatNumber(detail.total)} Ar</td></tr>`;
        });
    });
    let deliveryRow = '';
    let total = data.total;
    if (data.delivery && data.delivery.enabled) {
        deliveryRow = `<tr><td colspan="3" style="text-align:right;padding-right:10px;"><strong>Livraison:</strong></td><td>${data.delivery.quantity.toFixed(2)} m</td><td>${formatNumber(data.delivery.unitPrice)} Ar/m</td><td class="col-amount">${formatNumber(data.delivery.amount)} Ar</td></tr>`;
    }
    const totalWords = numberToWords(total);
    const previewHTML = `<div class="invoice-border"><table class="invoice-header-table"><tr><td style="width:60%;"><div class="company-name">${data.company.name}</div><div class="company-activity">${data.company.activity}</div><div class="company-address">${data.company.address}</div><div class="company-address">Stat: ${data.company.stat}</div><div class="company-address">NIF: ${data.company.nif}</div><div class="company-address">Tél: ${data.company.phone}</div></td><td style="width:40%;"><div class="invoice-type">FACTURE PROFORMA</div><div style="margin-top:10px;">N°: ${data.number}</div><div style="margin-top:5px;">Date: ${formattedDate}</div><div style="margin-top:5px;">Client: ${data.client.name}</div>${data.client.phone ? `<div style="margin-top:5px;">Tél: ${data.client.phone}</div>` : ''}${data.client.address ? `<div style="margin-top:5px;">Adresse: ${data.client.address}</div>` : ''}</td></tr></table><div class="invoice-disclaimer">Nos marchandises vendues ne sont ni reprises ni échangées<br><em>Ny entana efa lalo dia tsy averina na soloina</em></div><table class="invoice-content-table"><thead><tr><th class="col-units">Unité</th><th class="col-size">Taille</th><th class="col-calc">Calcul + Qté</th><th class="col-designation">DÉSIGNATION</th><th class="col-unit-price">Prix unit</th><th class="col-amount">Montant</th></tr></thead><tbody>${tableRows}${deliveryRow}<tr class="total-row"><td colspan="5" style="text-align:right;padding-right:10px;">TOTAL:</td><td class="col-amount">${formatNumber(total)} Ar</td></tr><tr><td colspan="6" class="total-words">Arrêté la présente facture à la somme de: <strong>${totalWords}</strong></td></tr></tbody></table>${data.notes ? `<div style="border-left:2px solid #000;border-right:2px solid #000;border-bottom:2px solid #000;padding:10px;font-size:10px;"><strong>Notes:</strong> ${data.notes}</div>` : ''}<div class="signature-section"><div class="signature-box"><h4>LE FOURNISSEUR</h4><div class="signature-line">Signature et cachet</div></div><div class="signature-box"><h4>LE CLIENT</h4><div class="signature-line">Signature</div></div></div></div>`;
    document.getElementById('invoicePreview').innerHTML = previewHTML;
}

function editInvoice() { if (currentInvoiceId) window.location.href = `create.html?id=${currentInvoiceId}`; }
function printInvoice() { window.print(); }
function downloadPDF() {
    if (!currentInvoiceData) { alert('❌ Aucune facture à télécharger'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const element = document.getElementById('invoicePreview');
    html2canvas(element, { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        doc.save(`${currentInvoiceData.number}.pdf`);
        alert('✅ PDF téléchargé avec succès !');
    });
}

function numberToWords(num) {
    if (num === 0) return 'Zéro Ariary';
    const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
    const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
    const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
    function convertHundreds(n) {
        let result = '';
        const hundreds = Math.floor(n / 100);
        if (hundreds > 0) result += hundreds === 1 ? 'cent ' : units[hundreds] + ' cent ';
        n %= 100;
        if (n >= 20) {
            const tensDigit = Math.floor(n / 10);
            const unitsDigit = n % 10;
            result += tens[tensDigit];
            if (unitsDigit > 0) result += '-' + units[unitsDigit];
        } else if (n >= 10) {
            result += teens[n - 10];
        } else if (n > 0) {
            result += units[n];
        }
        return result.trim();
    }
    let words = '';
    if (num >= 1000000000) {
        const billions = Math.floor(num / 1000000000);
        words += billions === 1 ? 'un milliard ' : convertHundreds(billions) + ' milliards ';
        num %= 1000000000;
    }
    if (num >= 1000000) {
        const millions = Math.floor(num / 1000000);
        words += millions === 1 ? 'un million ' : convertHundreds(millions) + ' millions ';
        num %= 1000000;
    }
    if (num >= 1000) {
        const thousands = Math.floor(num / 1000);
        words += thousands === 1 ? 'mille ' : convertHundreds(thousands) + ' mille ';
        num %= 1000;
    }
    if (num > 0) words += convertHundreds(num);
    return words.trim().charAt(0).toUpperCase() + words.trim().slice(1) + ' Ariary';
}

function formatNumber(num) { return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
