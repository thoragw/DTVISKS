const sange = [
    {
      titel: "Antenner på Montejunto",
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
        "billeder/1. Antenner på Montejunto/IMG_2038.jpeg",
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
  let billedTimer;
  let aktuelBilledIndex = 0;
  
  const afspiller = document.getElementById("afspiller");
  const billedcontainer = document.getElementById("billedcontainer");
  const sangliste = document.getElementById("sangliste");
  const playPauseBtn = document.getElementById("playpause");
  const tilbageBtn = document.getElementById("tilbage");
  const fremBtn = document.getElementById("frem");
  const progress = document.getElementById("progress");
  const tidVisning = document.getElementById("tid");
  
  // Viser kun første billede og forbereder skift
  function visBillederEnAdGangen(billeder) {
    clearInterval(billedTimer);
    billedcontainer.innerHTML = "";
  
    if (billeder.length === 0) return;
  
    aktuelBilledIndex = 0;
  
    const img = document.createElement("img");
    img.src = billeder[aktuelBilledIndex];
    billedcontainer.appendChild(img);
  }
  
  // Starter billedskift baseret på sangens bpm
  function startBilledskift(bpm, billeder) {
    clearInterval(billedTimer);
    const img = billedcontainer.querySelector("img");
    if (!img || billeder.length === 0) return;
  
    const intervalMs = 60000 / bpm * 4;
  
    billedTimer = setInterval(() => {
      aktuelBilledIndex = (aktuelBilledIndex + 1) % billeder.length;
      img.src = billeder[aktuelBilledIndex];
    }, intervalMs);
  }
  
  function afspilSang(index, spil = true) {
    const sang = sange[index];
    if (!sang) return;
  
    aktuelIndex = index;
    afspiller.src = sang.fil;
  
    visBillederEnAdGangen(sang.billeder);
  
    if (spil) {
      afspiller.play();
      playPauseBtn.textContent = "Pause";
      startBilledskift(sang.bpm, sang.billeder);
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
  });
  
  afspiller.addEventListener("loadedmetadata", () => {
    progress.max = afspiller.duration;
    opdaterTid();
  });
  
  progress.addEventListener("input", () => {
    afspiller.currentTime = progress.value;
  });
  
  playPauseBtn.addEventListener("click", () => {
    const sang = sange[aktuelIndex];
    if (afspiller.paused) {
      afspiller.play();
      playPauseBtn.textContent = "Pause";
      startBilledskift(sang.bpm, sang.billeder);
    } else {
      afspiller.pause();
      playPauseBtn.textContent = "Afspil";
      clearInterval(billedTimer);
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
  
  // Indlæs første sang, men afspil ikke med det samme
  afspilSang(0, false);