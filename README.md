<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Garis Property | Estimasi RAB Profesional</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- PDF -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Arial}
body{background:#f1f5f9}
header{background:#020617;color:white;padding:20px 40px;display:flex;justify-content:space-between}
nav a{color:white;margin-left:20px;text-decoration:none;font-weight:bold}
.hero{background:#0f172a;color:white;padding:70px 40px}
.hero h1{font-size:38px}
section{background:white;padding:60px 40px;margin-top:10px}
.section-title{text-align:center;font-size:32px;margin-bottom:30px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
.card{background:#f8fafc;padding:20px;border-radius:10px;box-shadow:0 4px 10px rgba(0,0,0,.1)}
label{font-weight:bold}
input,select{width:100%;padding:10px;margin:8px 0 15px}
.btn{background:#22c55e;color:white;padding:12px;border:none;border-radius:6px;font-weight:bold;cursor:pointer}
table{width:100%;border-collapse:collapse;margin-top:10px}
th,td{border:1px solid #ccc;padding:10px;text-align:right}
th{text-align:left;background:#e2e8f0}
tfoot td{font-weight:bold;background:#c7d2fe}
footer{background:#020617;color:white;text-align:center;padding:20px}
.wa{position:fixed;bottom:20px;right:20px;background:#25D366;color:white;padding:15px 20px;border-radius:50px;text-decoration:none;font-weight:bold}
.admin{background:#fef3c7;padding:15px;border-radius:10px;margin-bottom:20px}
</style>
</head>

<body>

<header>
  <h2>Garis Property</h2>
  <nav>
    <a href="#rab">Estimasi RAB</a>
    <a href="#admin">Admin</a>
  </nav>
</header>

<div class="hero">
  <h1>Estimasi RAB Bangunan Profesional</h1>
  <p>Rumah • Ruko • Interior | Transparan & Cepat</p>
</div>

<section id="admin">
<h2 class="section-title">Admin Harga (Editable)</h2>
<div class="admin">
  <label>Harga Standar / m²</label>
  <input type="number" id="hargaAdmin">
  <button class="btn" onclick="simpanHarga()">Simpan Harga</button>
</div>
</section>

<section id="rab">
<h2 class="section-title">Estimasi RAB Otomatis</h2>

<div class="grid">
<div class="card">
<label>Nama</label>
<input id="nama" placeholder="Nama Anda">

<label>Luas Bangunan (m²)</label>
<input type="number" id="luas">

<label>Jumlah Lantai</label>
<select id="lantai">
  <option value="1">1 Lantai</option>
  <option value="1.8">2 Lantai</option>
  <option value="2.5">3 Lantai</option>
</select>

<label>Jenis Bangunan</label>
<select id="jenis">
  <option value="1">Rumah</option>
  <option value="1.2">Ruko</option>
  <option value="0.8">Interior</option>
</select>

<button class="btn" onclick="hitung()">Hitung RAB</button>
</div>

<div class="card">
<h3>Rincian Biaya</h3>
<table>
<thead><tr><th>Item</th><th>Biaya</th></tr></thead>
<tbody id="rincian"></tbody>
<tfoot><tr><td>Total</td><td id="total"></td></tr></tfoot>
</table>
<br>
<button class="btn" onclick="exportPDF()">Export PDF</button>
<br><br>
<a id="btnWA" class="btn" target="_blank" style="display:none">Kirim ke WhatsApp</a>
</div>
</div>
</section>

<footer>
© 2026 Garis Property
</footer>

<a href="https://wa.me/62812XXXXXXXX" class="wa">💬 WhatsApp</a>

<script>
// ===== CONFIG =====
const SHEET_URL = "ISI_URL_GOOGLE_SCRIPT_KAMU";
const WA_NUMBER = "62812XXXXXXXX";

// ===== UTILITY =====
function rupiah(x){
  return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR'}).format(x);
}

// ===== ADMIN =====
function simpanHarga(){
  let h=document.getElementById("hargaAdmin").value;
  localStorage.setItem("harga",h);
  alert("Harga disimpan");
}
document.getElementById("hargaAdmin").value = localStorage.getItem("harga") || 3500000;

// ===== HITUNG =====
let hasilData={};

function hitung(){
  let nama=document.getElementById("nama").value;
  let luas=+document.getElementById("luas").value;
  let lantai=+document.getElementById("lantai").value;
  let jenis=+document.getElementById("jenis").value;
  let harga=+localStorage.getItem("harga")||3500000;

  let dasar=luas*harga*lantai*jenis;

  let item={
    "Persiapan (5%)":0.05,
    "Pondasi (15%)":0.15,
    "Struktur (30%)":0.30,
    "Dinding (15%)":0.15,
    "Atap (10%)":0.10,
    "Finishing (25%)":0.25
  };

  let html="",total=0;
  for(let k in item){
    let v=dasar*item[k];
    total+=v;
    html+=`<tr><td>${k}</td><td>${rupiah(v)}</td></tr>`;
  }

  document.getElementById("rincian").innerHTML=html;
  document.getElementById("total").innerHTML=rupiah(total);

  hasilData={nama,luas,lantai,jenis,total};

  let waText=encodeURIComponent(
    "Halo Garis Property\nNama: "+nama+
    "\nLuas: "+luas+" m2"+
    "\nTotal RAB: "+rupiah(total)
  );

  let btn=document.getElementById("btnWA");
  btn.href="https://wa.me/"+WA_NUMBER+"?text="+waText;
  btn.style.display="inline-block";

  kirimSheet();
}

// ===== GOOGLE SHEETS =====
function kirimSheet(){
  fetch(SHEET_URL,{
    method:"POST",
    body:JSON.stringify(hasilData)
  });
}

// ===== PDF =====
function exportPDF(){
  const {jsPDF}=window.jspdf;
  let pdf=new jsPDF();
  pdf.text("RAB GARIS PROPERTY",20,20);
  let y=40;
  document.querySelectorAll("#rincian tr").forEach(r=>{
    let c=r.querySelectorAll("td");
    pdf.text(c[0].innerText,20,y);
    pdf.text(c[1].innerText,130,y);
    y+=10;
  });
  pdf.text("TOTAL: "+document.getElementById("total").innerText,20,y+10);
  pdf.save("RAB-Garis-Property.pdf");
}
</script>

</body>
</html>
