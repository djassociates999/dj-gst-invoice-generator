document.addEventListener("DOMContentLoaded", function () {

addItemRow();

loadProfile();

const addBtn = document.getElementById("addItemBtn");

if(addBtn){
    addBtn.addEventListener("click", addItemRow);
}

}); 
function addItemRow() {

const row = ` 
    <tr>
        <td><input type="text" class="desc"></td>
        <td><input type="text" class="hsn"></td>
        <td><input type="number" class="qty" value="1" oninput="calculateTotals()"></td>
        <td><input type="number" class="rate" value="0" oninput="calculateTotals()"></td>
        <td>
            <select class="gst" onchange="calculateTotals()">
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18" selected>18%</option>
                <option value="28">28%</option>
            </select>
        </td>
        <td class="amount">0.00</td>
<td>
    <button type="button" onclick="deleteRow(this)">
        Delete
    </button>
</td> 
    </tr>
    `;

    document.getElementById("itemBody")
        .insertAdjacentHTML("beforeend", row);
}

// Calculate Totals
function calculateTotals() {

    let taxable = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    const rows = document.querySelectorAll("#itemBody tr");

    rows.forEach(row => {

        const qty = parseFloat(row.querySelector(".qty").value) || 0;
        const rate = parseFloat(row.querySelector(".rate").value) || 0;
        const gstRate = parseFloat(row.querySelector(".gst").value) || 0;

        const amount = qty * rate;

        row.querySelector(".amount").innerText =
            amount.toFixed(2);

        taxable += amount;

        if (document.getElementById("transactionType").value === "intra") {

            cgst += amount * (gstRate / 2) / 100;
            sgst += amount * (gstRate / 2) / 100;

        } else {

            igst += amount * gstRate / 100;
        }

    });

    const grandTotal =
        taxable + cgst + sgst + igst;

    document.getElementById("taxableValue").innerText =
        taxable.toFixed(2);

    document.getElementById("cgstTotal").innerText =
        cgst.toFixed(2);

    document.getElementById("sgstTotal").innerText =
        sgst.toFixed(2);

    document.getElementById("igstTotal").innerText =
        igst.toFixed(2);

    document.getElementById("grandTotal").innerText =
        grandTotal.toFixed(2);

    document.getElementById("amountWords").innerText =
        numberToWords(Math.round(grandTotal)) + " Only";
}

// Save Seller Profile
function saveProfile() {

    const profile = {
        sellerName: sellerName.value,
        sellerGSTIN: sellerGSTIN.value,
        sellerAddress: sellerAddress.value,
        sellerMobile: sellerMobile.value,
        sellerEmail: sellerEmail.value
    };

    localStorage.setItem(
        "djSellerProfile",
        JSON.stringify(profile)
    );

    alert("Seller Profile Saved");
}

// Load Seller Profile
function loadProfile() {

    const profile =
        JSON.parse(localStorage.getItem("djSellerProfile"));

    if (!profile) return;

    sellerName.value = profile.sellerName || "";
    sellerGSTIN.value = profile.sellerGSTIN || "";
    sellerAddress.value = profile.sellerAddress || "";
    sellerMobile.value = profile.sellerMobile || "";
    sellerEmail.value = profile.sellerEmail || "";
}

// Generate Invoice
function generateInvoice() {
    calculateTotals();
    alert("Invoice Generated Successfully");
}

// Amount in Words
function numberToWords(num) {

    const a = [
        "", "One", "Two", "Three", "Four",
        "Five", "Six", "Seven", "Eight",
        "Nine", "Ten", "Eleven", "Twelve",
        "Thirteen", "Fourteen", "Fifteen",
        "Sixteen", "Seventeen", "Eighteen",
        "Nineteen"
    ];

    const b = [
        "", "", "Twenty", "Thirty",
        "Forty", "Fifty", "Sixty",
        "Seventy", "Eighty", "Ninety"
    ];

    if (num < 20) return a[num];

    if (num < 100)
        return b[Math.floor(num / 10)] +
        " " + a[num % 10];

    if (num < 1000)
        return a[Math.floor(num / 100)] +
        " Hundred " +
        numberToWords(num % 100);

    if (num < 100000)
        return numberToWords(Math.floor(num / 1000)) +
        " Thousand " +
        numberToWords(num % 1000);

    if (num < 10000000)
        return numberToWords(Math.floor(num / 100000)) +
        " Lakh " +
        numberToWords(num % 100000);

    return num.toString();
}

// Recalculate when state type changes
document.getElementById("transactionType")
    .addEventListener("change", calculateTotals);
unction deleteRow(button) {

    const row = button.closest("tr");

    row.remove();

    calculateTotals();
} 
