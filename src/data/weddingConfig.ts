import bridePhoto from "@/assets/photos/Solo1.webp";
import groomPhoto from "@/assets/photos/Solo2.webp";
import bareng1 from "@/assets/photos/Bareng1.webp";
import bareng2 from "@/assets/photos/Bareng2.webp";
import bareng3 from "@/assets/photos/Bareng3.webp";
import bareng4 from "@/assets/photos/Bareng4.webp";
import weddingSong from "@/assets/audio/sampai-jadi-debu-piano.mp3";

export type GalleryImage = {
  src: string;
  alt: string;
  orientation: "portrait" | "landscape" | "square";
};

export type BankAccount = { bank: string; holder: string; number: string };

/**
 * SEMUA data pernikahan berada di file ini — cukup ubah di sini.
 * Teks yang punya dua bahasa (Indonesia/English) ada di src/lib/i18n.tsx.
 */
export const weddingConfig = {
  couple: {
    brideName: "Intan",
    brideFullName: "Ai Intan Sunarsih",
    brideNickname: "Intan",
    brideParents: "Putri dari Bapak Suwanta & Ibu Neng Mumun",
    bridePhoto,
    groomName: "Dimas",
    groomFullName: "Dimas Ichfianto",
    groomNickname: "Dimas",
    groomParents: "Putra dari Bapak Ichsananto & Almh. Ibu Fitri Ariana",
    groomPhoto,
  },

  event: {
    /* Waktu akad (ISO, zona +07:00) — countdown menuju waktu ini */
    weddingDate: "2026-12-06T09:00:00+07:00",
    weddingDateLabel: "06 . 12 . 2026",
    weddingDayLabel: "Minggu, 6 Desember 2026",
    akadTime: "09.00 – selesai WIB",
    receptionTime: "10.00 – 16.00 WIB",
    venueName: "Kediaman Mempelai Wanita",
    venueAddress:
      "Desa Pangulah Baru RT/RW 02/03, Kp. Kaliasin, Kota Baru, Karawang, Jawa Barat (Depan Balai Desa Pangulah Baru)",
    latitude: -6.385077,
    longitude: 107.498802,
    mapsUrl: "https://maps.app.goo.gl/nRW52SoLKEcYsKUv5",
  },

  media: {
    galleryImages: [
      { src: bareng1, alt: "Momen Dimas & Intan 1", orientation: "portrait" },
      { src: bareng2, alt: "Momen Dimas & Intan 2", orientation: "portrait" },
      { src: bareng3, alt: "Momen Dimas & Intan 3", orientation: "portrait" },
      { src: bareng4, alt: "Momen Dimas & Intan 4", orientation: "portrait" },
      { src: bridePhoto, alt: "Potret Ai Intan Sunarsih", orientation: "portrait" },
      { src: groomPhoto, alt: "Potret Dimas Ichfianto", orientation: "portrait" },
    ] as GalleryImage[],
    /* Foto untuk layar pembuka (sinematik) & hero (bingkai lengkung) */
    openingImage: bareng4,
    heroImage: bareng1,
    musicUrl: weddingSong,
    musicTitle: "Sampai Jadi Debu",
    musicArtist: "Banda Neira · Piano Cover",
  },

  quote: {
    arabic:
      "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
    textId:
      "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    textEn:
      "And among His signs is that He created for you spouses from among yourselves so that you may find comfort in them. And He has placed between you affection and mercy. Surely in this are signs for people who reflect.",
    source: "QS. Ar-Rum: 21",
  },

  gift: {
    note: "Doa restu Anda merupakan hadiah terindah bagi kami. Namun apabila ingin memberikan tanda kasih, kami menyediakan fitur Wedding Gift.",
    banks: [
      { bank: "Bank Mandiri", holder: "Dimas Ichfianto", number: "1330012957650" },
      { bank: "BCA", holder: "Ai Intan Sunarsih", number: "3780564422" },
    ] as BankAccount[],
    /* Tempel URL gambar QRIS di sini (mis. "/qris.png") untuk menampilkannya. Kosongkan untuk menyembunyikan. */
    qris: "",
  },

  closing: {
    textId:
      "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.",
    textEn:
      "It would be our honor and joy to have you join us and share your blessings on our special day.",
  },

  /* Nama tamu cadangan bila URL tidak memuat nama tamu (link /nama-tamu atau ?to=Nama) */
  guest: {
    guestName: "",
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
