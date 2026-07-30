export type DemoRole = "developer" | "designer" | "data_scientist" | "pm"

export interface DemoProfile {
  id: string
  fullName: string
  username: string
  role: DemoRole
  skills: string[]
  lookingFor: string[]
  bio: string
  matchScore?: number
  avatarUrl?: string
}

export const roleLabels: Record<DemoRole, string> = {
  developer: "Geliştirici",
  designer: "Tasarımcı",
  data_scientist: "Veri Bilimci",
  pm: "Proje Yöneticisi",
}

/**
 * Demo/seed profilleri — gerçek çok-kullanıcılı Supabase verisi bağlanana kadar
 * /match sayfasını gerçekçi verilerle test edilebilir kılmak için kullanılır.
 */
export const demoProfiles: DemoProfile[] = [
  {
    id: "p1",
    fullName: "Zeynep Yılmaz",
    username: "zeynepy",
    role: "developer",
    skills: ["TypeScript", "React", "CSS"],
    lookingFor: ["Backend Geliştirici", "Veri Bilimci"],
    bio: "Frontend'de 3 yıllık deneyim, etkileşimli arayüzlere meraklı.",
    avatarUrl: "https://github.com/zeynepy.png",
  },
  {
    id: "p2",
    fullName: "Mert Demir",
    username: "mertd",
    role: "developer",
    skills: ["Python", "Go", "Docker"],
    lookingFor: ["Frontend Geliştirici", "Tasarımcı"],
    bio: "Backend ve altyapı odaklı, ölçeklenebilir API'ler kurmayı seviyor.",
    avatarUrl: "https://github.com/mertd.png",
  },
  {
    id: "p3",
    fullName: "Elif Kaya",
    username: "elifk",
    role: "data_scientist",
    skills: ["Python", "Jupyter Notebook", "R"],
    lookingFor: ["Frontend Geliştirici"],
    bio: "Veri analizi ve makine öğrenmesi modelleri üzerine çalışıyor.",
    avatarUrl: "https://github.com/elifk.png",
  },
  {
    id: "p4",
    fullName: "Can Öztürk",
    username: "canozturk",
    role: "designer",
    skills: ["Figma", "CSS", "HTML"],
    lookingFor: ["Frontend Geliştirici", "Backend Geliştirici"],
    bio: "Ürün tasarımı ve kullanıcı deneyimi odaklı, hızlı prototipleme yapar.",
    avatarUrl: "https://github.com/canozturk.png",
  },
  {
    id: "p5",
    fullName: "Selin Arslan",
    username: "selina",
    role: "developer",
    skills: ["JavaScript", "Vue", "Node.js"],
    lookingFor: ["Veri Bilimci", "Tasarımcı"],
    bio: "Full-stack geliştirici, küçük ekiplerde hızlı MVP çıkarmayı sever.",
    avatarUrl: "https://github.com/selina.png",
  },
  {
    id: "p6",
    fullName: "Burak Şahin",
    username: "buraks",
    role: "pm",
    skills: ["Notion", "Jira"],
    lookingFor: ["Geliştirici", "Tasarımcı", "Veri Bilimci"],
    bio: "Ürün yönetimi ve ekip koordinasyonunda deneyimli, hackathon organizasyonlarına katılmış.",
    avatarUrl: "https://github.com/buraks.png",
  },
  {
    id: "p7",
    fullName: "Ayşe Yıldız",
    username: "aysey",
    role: "data_scientist",
    skills: ["Python", "TensorFlow", "SQL"],
    lookingFor: ["Backend Geliştirici"],
    bio: "NLP ve derin öğrenme projelerinde çalışıyor, Kaggle yarışmalarına katılıyor.",
    avatarUrl: "https://github.com/aysey.png",
  },
  {
    id: "p8",
    fullName: "Kerem Aydın",
    username: "keremaydin",
    role: "developer",
    skills: ["Java", "Kotlin", "Android"],
    lookingFor: ["Tasarımcı", "Veri Bilimci"],
    bio: "Mobil uygulama geliştirme konusunda uzman, Android ekosistemine hakim.",
    avatarUrl: "https://github.com/keremaydin.png",
  },
  {
    id: "p9",
    fullName: "Deniz Koç",
    username: "denizkoc",
    role: "designer",
    skills: ["Figma", "Illustrator"],
    lookingFor: ["Frontend Geliştirici"],
    bio: "Marka ve arayüz tasarımı yapıyor, görsel hikaye anlatımına önem veriyor.",
    avatarUrl: "https://github.com/denizkoc.png",
  },
  {
    id: "p10",
    fullName: "Emre Polat",
    username: "emrepolat",
    role: "developer",
    skills: ["TypeScript", "React", "Python"],
    lookingFor: ["Veri Bilimci", "Proje Yöneticisi"],
    bio: "Hem frontend hem backend'de rahat, önceki 2 hackathon'da dereceye girdi.",
    avatarUrl: "https://github.com/emrepolat.png",
  },
]

