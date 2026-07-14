export interface Competition {
  id: string
  title: string
  platform: "devpost" | "kaggle" | "hackerearth" | "mlh"
  url: string
  description: string
  category: "ai_ml" | "web" | "mobile" | "data" | "blockchain" | "iot"
  prize: string
  deadline: string
  imageUrl: string
}

export const competitions: Competition[] = [
  {
    id: "1",
    title: "Global AI Impact Challenge",
    platform: "devpost",
    url: "https://devpost.com/hackathons/global-ai-impact",
    description:
      "Yapay zekâ kullanarak toplumsal sorunlara yenilikçi çözümler geliştirin. Sağlık, eğitim ve sürdürülebilirlik alanlarında projeler bekliyoruz.",
    category: "ai_ml",
    prize: "$50,000",
    deadline: "2026-08-15T23:59:00Z",
    imageUrl: "linear-gradient(135deg, #0F62FE, #6D9BFF)",
  },
  {
    id: "2",
    title: "Next-Gen Web Apps Hackathon",
    platform: "devpost",
    url: "https://devpost.com/hackathons/nextgen-web",
    description:
      "Modern web teknolojileriyle geleceğin web uygulamalarını inşa edin. React, Next.js ve edge computing odaklı.",
    category: "web",
    prize: "$30,000",
    deadline: "2026-08-22T23:59:00Z",
    imageUrl: "linear-gradient(135deg, #10B981, #34D399)",
  },
  {
    id: "3",
    title: "Kaggle Tabular Playground Series",
    platform: "kaggle",
    url: "https://www.kaggle.com/competitions/tabular-playground",
    description:
      "Büyük ölçekli veri setleri üzerinde makine öğrenmesi modelleri geliştirin. Sınıflandırma ve regresyon görevleri.",
    category: "data",
    prize: "$25,000",
    deadline: "2026-09-01T23:59:00Z",
    imageUrl: "linear-gradient(135deg, #F59E0B, #FBBF24)",
  },
  {
    id: "4",
    title: "Mobile Innovation Sprint",
    platform: "mlh",
    url: "https://mlh.io/events/mobile-innovation",
    description:
      "iOS ve Android platformlarında yenilikçi mobil uygulamalar tasarlayın. UX odaklı değerlendirme kriterleri.",
    category: "mobile",
    prize: "$20,000",
    deadline: "2026-08-28T23:59:00Z",
    imageUrl: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
  },
  {
    id: "5",
    title: "DeFi Builder Challenge",
    platform: "devpost",
    url: "https://devpost.com/hackathons/defi-builder",
    description:
      "Merkeziyetsiz finans (DeFi) protokolleri ve akıllı kontratlar geliştirin. Ethereum ve Solana destekli.",
    category: "blockchain",
    prize: "$75,000",
    deadline: "2026-09-10T23:59:00Z",
    imageUrl: "linear-gradient(135deg, #EC4899, #F472B6)",
  },
  {
    id: "6",
    title: "Smart IoT Solutions",
    platform: "hackerearth",
    url: "https://www.hackerearth.com/challenges/smart-iot",
    description:
      "IoT cihazları ve sensörlerle akıllı ev, şehir ve endüstri çözümleri oluşturun. Edge AI entegrasyonu bonus.",
    category: "iot",
    prize: "$15,000",
    deadline: "2026-08-18T23:59:00Z",
    imageUrl: "linear-gradient(135deg, #06B6D4, #67E8F9)",
  },
  {
    id: "7",
    title: "LLM Application Hackathon",
    platform: "devpost",
    url: "https://devpost.com/hackathons/llm-apps",
    description:
      "Büyük dil modelleri (LLM) kullanarak gerçek dünya problemlerini çözün. RAG, fine-tuning ve agent sistemleri.",
    category: "ai_ml",
    prize: "$40,000",
    deadline: "2026-09-05T23:59:00Z",
    imageUrl: "linear-gradient(135deg, #304DB9, #4B67D3)",
  },
  {
    id: "8",
    title: "Full-Stack SaaS Challenge",
    platform: "mlh",
    url: "https://mlh.io/events/saas-challenge",
    description:
      "Sıfırdan production-ready bir SaaS ürünü oluşturun. Ödeme, auth ve multi-tenant mimari bekleniyor.",
    category: "web",
    prize: "$35,000",
    deadline: "2026-09-12T23:59:00Z",
    imageUrl: "linear-gradient(135deg, #0EA5E9, #38BDF8)",
  },
  {
    id: "9",
    title: "Kaggle NLP Challenge",
    platform: "kaggle",
    url: "https://www.kaggle.com/competitions/nlp-challenge",
    description:
      "Doğal dil işleme alanında en gelişmiş modelleri oluşturun. Metin sınıflandırma ve duygu analizi.",
    category: "ai_ml",
    prize: "$30,000",
    deadline: "2026-08-25T23:59:00Z",
    imageUrl: "linear-gradient(135deg, #7C3AED, #C084FC)",
  },
  {
    id: "10",
    title: "Cross-Platform App Jam",
    platform: "hackerearth",
    url: "https://www.hackerearth.com/challenges/cross-platform",
    description:
      "React Native veya Flutter ile tek kod tabanından iOS ve Android uygulaması geliştirin.",
    category: "mobile",
    prize: "$18,000",
    deadline: "2026-09-08T23:59:00Z",
    imageUrl: "linear-gradient(135deg, #F97316, #FB923C)",
  },
  {
    id: "11",
    title: "Data Visualization Showdown",
    platform: "devpost",
    url: "https://devpost.com/hackathons/dataviz",
    description:
      "Karmaşık veri setlerini anlaşılır ve etkileyici görselleştirmelerle sunun. D3.js, Observable ve dashboard projeleri.",
    category: "data",
    prize: "$22,000",
    deadline: "2026-09-15T23:59:00Z",
    imageUrl: "linear-gradient(135deg, #14B8A6, #5EEAD4)",
  },
  {
    id: "12",
    title: "Web3 Gaming Hackathon",
    platform: "mlh",
    url: "https://mlh.io/events/web3-gaming",
    description:
      "Blockchain tabanlı oyunlar ve NFT ekonomileri geliştirin. Play-to-earn mekanikleri ve on-chain varlık yönetimi.",
    category: "blockchain",
    prize: "$60,000",
    deadline: "2026-08-30T23:59:00Z",
    imageUrl: "linear-gradient(135deg, #E11D48, #FB7185)",
  },
]
