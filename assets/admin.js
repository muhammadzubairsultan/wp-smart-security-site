document.addEventListener('DOMContentLoaded', function() {

    // Toggle switches AJAX save
    const toggles = document.querySelectorAll('.wpss-toggle input[type="checkbox"]');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const data = {
                action: 'wpss_toggle_update',
                setting: toggle.name,
                value: toggle.checked ? 1 : 0,
                _ajax_nonce: wpss_admin.nonce
            };

            fetch(ajaxurl, {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data)
            })
            .then(res => res.json())
            .then(res => {
                if(res.success){
                    console.log(`${toggle.name} updated successfully`);
                } else {
                    alert('Failed to save setting.');
                }
            });
        });
    });

    // Pro feature alert
    document.querySelectorAll('.wpss-btn.upgrade').forEach(btn => {
        btn.addEventListener('click', function(e){ e.preventDefault(); alert('This feature is only available in WP Smart Security Pro!'); });
    });

    // Table filtering
    const filterInput = document.querySelector('.wpss-table-filter');
    if(filterInput){
        filterInput.addEventListener('input', function(){
            const filter = filterInput.value.toLowerCase();
            const rows = document.querySelectorAll('.wpss-table tbody tr');
            rows.forEach(row => {
                const ip = row.cells[0].textContent.toLowerCase();
                row.style.display = ip.includes(filter) ? '' : 'none';
            });
        });
    }

    // Table sorting
    const table = document.querySelector('.wpss-table');
    if(table){
        const headers = table.querySelectorAll('th');
        headers.forEach((th,index)=>{
            th.addEventListener('click', () => {
                const tbody = table.tBodies[0];
                Array.from(tbody.rows)
                     .sort((a,b)=>a.cells[index].textContent.localeCompare(b.cells[index].textContent))
                     .forEach(row=>tbody.appendChild(row));
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
    const table = document.querySelector('.wpss-table');

    if(table){
        const exportBtn = table.parentElement.querySelector('.wpss-export-btn');
        const resetBtn = table.parentElement.querySelector('.wpss-reset-btn');

        // ---------------- Export CSV ----------------
        exportBtn.addEventListener('click', function(e){
            e.preventDefault();

            let csv = [];
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const cols = row.querySelectorAll('th, td');
                const rowData = [];
                cols.forEach(col => {
                    let text = col.textContent.replace(/"/g, '""');
                    rowData.push(`"${text}"`);
                });
                csv.push(rowData.join(','));
            });

            const csvFile = new Blob([csv.join("\n")], {type: "text/csv"});
            const downloadLink = document.createElement("a");
            downloadLink.download = "login_attempts.csv";
            downloadLink.href = window.URL.createObjectURL(csvFile);
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });

        // ---------------- Reset Table ----------------
        resetBtn.addEventListener('click', function(e){
            e.preventDefault();
            if(confirm('Are you sure you want to reset the login attempts log?')){
                const tbody = table.tBodies[0];
                tbody.innerHTML = ''; // Clear all rows
                alert('Login attempts log has been reset!');
            }
        });
    }
});


});
