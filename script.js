// ===== CLOUDINARY =====
const cloudName = "dbll1h2zc";
const uploadPreset = "dmr0121";

// 🔐 GİRİŞ BİLGİLERİ
const USERNAME = "dmr";
const PASSWORD = "9999";

// ===== ELEMENTLER =====
const galeriDiv = document.getElementById("galeri");
const modal = document.getElementById("modal");
const bigImg = document.getElementById("bigImg");

// ===== LOGIN =====
function login(){
    const u = document.getElementById("user").value.trim();
    const p = document.getElementById("pass").value.trim();

    if(u === USERNAME && p === PASSWORD){
        localStorage.setItem("login","true");
        location.reload();
    }else{
        alert("Giriş hatalı");
    }
}

function logout(){
    localStorage.removeItem("login");
    location.reload();
}

// ===== GİRİŞ YOKSA GİZLE =====
window.onload = () => {
    if(!localStorage.getItem("login")){
        galeriDiv.innerHTML = "<h3>Giriş yapmadan göremezsin</h3>";
    } else {
        render();
    }
};

// ===== UPLOAD =====
async function uploadImage(){

    if(!localStorage.getItem("login")){
        alert("Önce giriş yap");
        return;
    }

    const file = document.getElementById("fileInput").files[0];

    if(!file){
        alert("Foto seç");
        return;
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);

    try{
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,{
            method:"POST",
            body:fd
        });

        const data = await res.json();

        if(!data.secure_url){
            console.log(data);
            alert("Yükleme hatası");
            return;
        }

        let galeri = JSON.parse(localStorage.getItem("galeri")) || [];

        galeri.push({
            url:data.secure_url,
            like:0
        });

        localStorage.setItem("galeri", JSON.stringify(galeri));

        render();

    }catch(e){
        console.error(e);
        alert("Hata oluştu");
    }
}

// ===== RENDER =====
function render(){

    let galeri = JSON.parse(localStorage.getItem("galeri")) || [];

    galeriDiv.innerHTML="";

    galeri.forEach((g,i)=>{
        galeriDiv.innerHTML+=`
        <div class="card">
            <img src="${g.url}" onclick="openModal('${g.url}')">
            <br>
            ❤️ <span onclick="like(${i})">${g.like}</span>
            <br><br>
            <button onclick="indir('${g.url}')">⬇</button>
            <button onclick="sil(${i})">🗑</button>
        </div>
        `;
    });
}

// ===== LIKE =====
function like(i){
    let galeri = JSON.parse(localStorage.getItem("galeri")) || [];
    galeri[i].like++;
    localStorage.setItem("galeri", JSON.stringify(galeri));
    render();
}

// ===== SİL =====
function sil(i){
    let galeri = JSON.parse(localStorage.getItem("galeri")) || [];
    galeri.splice(i,1);
    localStorage.setItem("galeri", JSON.stringify(galeri));
    render();
}

// ===== İNDİR =====
function indir(url){
    const a = document.createElement("a");
    a.href = url;
    a.download = "foto.jpg";
    a.click();
}

// ===== MODAL =====
function openModal(url){
    modal.style.display="flex";
    bigImg.src = url;
}

function closeModal(){
    modal.style.display="none";
}

// ESC ile kapatma
document.addEventListener("keydown", e=>{
    if(e.key==="Escape") closeModal();
});