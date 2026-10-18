const welcome = document.querySelector("#welcome");
const experience = document.querySelector("#experience");
const giftButtons = document.querySelectorAll("#open-gift, #open-gift-text");
const music = document.querySelector("#birthday-music");
const musicToggle = document.querySelector("#music-toggle");
const musicLabel = document.querySelector("#music-label");
const photoDialog = document.querySelector("#photo-dialog");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxMessage = document.querySelector("#lightbox-message");
const video = document.querySelector("#special-video");
const videoFrame = document.querySelector("#video-frame");
const showVideo = document.querySelector("#show-video");
const hideVideo = document.querySelector("#hide-video");

music.volume = 0.28;
let resumeMusicAfterVideo = false;

function updateMusicControl() {
    const playing = !music.paused;
    musicToggle.setAttribute("aria-pressed", String(playing));
    musicToggle.setAttribute("aria-label", playing ? "Pausar música" : "Reanudar música");
    musicLabel.textContent = playing ? "Pausar música" : "Reanudar música";
}

async function playMusic() {
    try {
        await music.play();
    } catch {
        musicLabel.textContent = "Toca para escuchar";
    }
    updateMusicControl();
}

function openExperience() {
    if (welcome.classList.contains("is-opening")) return;

    welcome.classList.add("is-opening");
    playMusic();
    window.setTimeout(() => {
        experience.hidden = false;
        welcome.classList.add("is-gone");
        document.body.classList.add("experience-open");
        document.querySelector(".birthday-hero").classList.add("is-visible");
        welcome.setAttribute("aria-hidden", "true");
        welcome.inert = true;
        welcome.addEventListener("transitionend", () => welcome.remove(), { once: true });
    }, 850);
}

giftButtons.forEach((button) => button.addEventListener("click", openExperience));
musicToggle.addEventListener("click", () => {
    if (music.paused) playMusic();
    else music.pause();
});
music.addEventListener("play", updateMusicControl);
music.addEventListener("pause", updateMusicControl);

document.querySelectorAll(".photo-card").forEach((card) => {
    card.addEventListener("click", () => {
        lightboxImage.src = card.dataset.photo;
        lightboxImage.alt = card.dataset.alt;
        lightboxMessage.textContent = card.dataset.message;
        photoDialog.showModal();
    });
});

document.querySelector("#close-photo").addEventListener("click", () => photoDialog.close());
photoDialog.addEventListener("click", (event) => {
    if (event.target === photoDialog) photoDialog.close();
});
photoDialog.addEventListener("close", () => {
    lightboxImage.removeAttribute("src");
});

showVideo.addEventListener("click", async () => {
    resumeMusicAfterVideo = !music.paused;
    music.pause();
    videoFrame.hidden = false;
    hideVideo.hidden = false;
    showVideo.hidden = true;
    try {
        await video.play();
    } catch {
        video.focus();
    }
});

hideVideo.addEventListener("click", () => {
    video.pause();
    videoFrame.hidden = true;
    hideVideo.hidden = true;
    showVideo.hidden = false;
    if (resumeMusicAfterVideo) playMusic();
    resumeMusicAfterVideo = false;
    showVideo.focus();
});

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.16 });

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}