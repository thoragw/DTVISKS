const sange = [
  {
    titel: "Antenner på Montejunto TTTT",
    fil: "musik/1. Antenner på Montejunto.mp3",
    bpm: 88,
    billeder: [
      "billeder/1. Antenner på Montejunto/går.jpg",
      "billeder/1. Antenner på Montejunto/antenehus.jpg",
      "billeder/1. Antenner på Montejunto/antennerne.jpg",
      "billeder/1. Antenner på Montejunto/container.jpg",
      "billeder/1. Antenner på Montejunto/IMG_2032.jpeg",
      "billeder/1. Antenner på Montejunto/IMG_1902.jpeg",
      "billeder/1. Antenner på Montejunto/IMG_1903.jpeg",
      "billeder/1. Antenner på Montejunto/skov.jpg"
    ]
  },
  {
    titel: "Fanger bølger i vinden",
    fil: "musik/2. Fanger bølger i vinden.mp3",
    bpm: 80,
    billeder: [
      "billeder/2. Fanger bølger i vinden/IMG_1988.jpeg",
      "billeder/2. Fanger bølger i vinden/IMG_1994.jpeg",
      "billeder/2. Fanger bølger i vinden/IMG_1998.jpeg",
      "billeder/2. Fanger bølger i vinden/IMG_2980.jpeg",
      "billeder/2. Fanger bølger i vinden/IMG_3131.jpeg",
      "billeder/2. Fanger bølger i vinden/IMG_3132.jpeg"
    ]
  },
  {
    titel: "Meddelelse modtaget",
    fil: "musik/3. Meddelelse modtaget.mp3",
    bpm: 77,
    billeder: [
      "billeder/3. Meddelelse modtaget/IMG_1762.jpeg",
      "billeder/3. Meddelelse modtaget/IMG_1766.jpeg",
      "billeder/3. Meddelelse modtaget/IMG_1767.jpeg",
      "billeder/3. Meddelelse modtaget/IMG_1857.jpeg",
      "billeder/3. Meddelelse modtaget/IMG_1897.jpeg",
      "billeder/3. Meddelelse modtaget/IMG_1898.jpeg",
      "billeder/3. Meddelelse modtaget/IMG_1899.jpeg",
      "billeder/3. Meddelelse modtaget/IMG_2091.jpeg",
      "billeder/3. Meddelelse modtaget/IMG_2103.jpeg",
      "billeder/3. Meddelelse modtaget/IMG_2143.jpeg"
    ]
  },
  {
    titel: "Ocean Atlantisk",
    fil: "musik/4. Ocean Atlantisk.mp3",
    bpm: 80,
    billeder: [
      "billeder/4. Ocean Atlantisk/IMG_1813.jpeg",
      "billeder/4. Ocean Atlantisk/IMG_1825.JPG",
      "billeder/4. Ocean Atlantisk/IMG_1933.jpeg",
      "billeder/4. Ocean Atlantisk/IMG_2131.jpeg",
      "billeder/4. Ocean Atlantisk/IMG_3053.jpeg"
    ]
  }
];

let aktuelIndex = 0;
let sidstVisteBilledIndex = -1;

const afspiller = document.getElementById("afspiller");
const billedcontainer = document.getElementById("billedcontainer");
const sangliste = document.getElementById("sangliste");
const playPauseBtn = document.getElementById("playpause");
const tilbageBtn = document.getElementById("tilbage");
const fremBtn = document.getElementById("frem");
const progress = document.getElementById("progress");
const tidVisning = document.getElementById("tid");

function visBilledeVedTakt(tid) {
  const sang = sange[aktuelIndex];
  const bpm = sang.bpm;
  const billeder = sang.billeder;
  if (!bpm || billeder.length === 0) return;

  const taktLængde = (60 / bpm) * 8;
  const taktNummer = Math.floor(tid / taktLængde);
  const billedIndex = taktNummer % billeder.length;
  const valgtSrc = billeder[billedIndex];

  let img = billedcontainer.querySelector("img");

  // Opret img hvis det ikke findes
  if (!img) {
    img = document.createElement("img");
    img.src = valgtSrc;
    billedcontainer.appendChild(img);
    sidstVisteBilledIndex = billedIndex;
  }

  // Skift kun hvis vi skal vise noget nyt
  if (billedIndex !== sidstVisteBilledIndex) {
    sidstVisteBilledIndex = billedIndex;
    img.src = valgtSrc;
  }
}

function visFørsteBillede() {
  const sang = sange[aktuelIndex];
  const billeder = sang.billeder;
  if (billeder && billeder.length > 0) {
    const img = document.createElement("img");
    img.src = billeder[0];
    billedcontainer.appendChild(img);
    sidstVisteBilledIndex = 0;
  }
}

function afspilSang(index, spil = true) {
  const sang = sange[index];
  if (!sang) return;

  aktuelIndex = index;
  sidstVisteBilledIndex = -1;
  afspiller.src = sang.fil;

  if (spil) {
    afspiller.play();
    playPauseBtn.textContent = "Pause";
  } else {
    playPauseBtn.textContent = "Afspil";
  }

  document.querySelectorAll("#sangliste li").forEach((li, i) => {
    li.classList.toggle("aktiv", i === index);
  });
}

afspiller.addEventListener("ended", () => {
  if (aktuelIndex + 1 < sange.length) {
    afspilSang(aktuelIndex + 1);
  }
});

afspiller.addEventListener("timeupdate", () => {
  progress.value = afspiller.currentTime;
  opdaterTid();
  visBilledeVedTakt(afspiller.currentTime);
});

afspiller.addEventListener("loadedmetadata", () => {
  progress.max = afspiller.duration;
  opdaterTid();
});

progress.addEventListener("input", () => {
  afspiller.currentTime = progress.value;
});

playPauseBtn.addEventListener("click", () => {
  if (afspiller.paused) {
    afspiller.play();
    playPauseBtn.textContent = "Pause";
  } else {
    afspiller.pause();
    playPauseBtn.textContent = "Afspil";
  }
});

tilbageBtn.addEventListener("click", () => {
  if (afspiller.currentTime > 3) {
    afspiller.currentTime = 0;
  } else if (aktuelIndex > 0) {
    afspilSang(aktuelIndex - 1);
  }
});

fremBtn.addEventListener("click", () => {
  if (aktuelIndex + 1 < sange.length) {
    afspilSang(aktuelIndex + 1);
  }
});

afspiller.addEventListener("playing", () => {
  sidstVisteBilledIndex = -1;
});

function opdaterTid() {
  const nu = formaterTid(afspiller.currentTime);
  const total = formaterTid(afspiller.duration || 0);
  tidVisning.textContent = `${nu} / ${total}`;
}

function formaterTid(sek) {
  const m = Math.floor(sek / 60);
  const s = Math.floor(sek % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

sange.forEach((sang, index) => {
  const li = document.createElement("li");
  li.textContent = sang.titel;
  li.addEventListener("click", () => afspilSang(index));
  sangliste.appendChild(li);
});

// Indlæs første sang uden at afspille
afspilSang(0, false);
visFørsteBillede();
