import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";


const prisma = new PrismaClient();

// --- 🔐 ค่าพื้นฐาน ---
const hashPassword = bcrypt.hashSync("123456", 10);

// --- 🧑‍💻 1. ข้อมูลผู้ใช้ ---
const userData = [
    {
        email: "buzz.l@example.com",
        password: hashPassword,
        name: "Buzz Lightyear",
        role: "USER",
        emailVerified: true,
        reviewCount: 98,
        followerCount: 152,
        createdAt: "2024-11-15T09:15:00.000Z",
        updatedAt: "2025-07-21T14:00:00.000Z",
    },
    {
        email: "admin@readit.net",
        password: hashPassword,
        name: "Admin",
        role: "ADMIN",
        emailVerified: true,
        reviewCount: 2,
        followerCount: 5,
        createdAt: "2023-01-20T08:00:00.000Z",
        updatedAt: "2025-06-30T18:45:00.000Z",
    },
    {
        email: "slinky.d@example.com",
        password: hashPassword,
        name: "Slinky Dog",
        role: "USER",
        emailVerified: true,
        reviewCount: 0,
        followerCount: 0,
        createdAt: "2025-07-22T16:30:15.000Z",
        updatedAt: "2025-07-22T16:30:15.000Z",
    }
];

// --- 🏷️ 2. ข้อมูลแท็ก ---
const tagData = [
    {
        name: 'Art',
        description: 'หนังสือที่รวบรวมผลงาน หรือให้ความรู้ด้านทัศนศิลป์ เช่น ประวัติศาสตร์ศิลปะ, เทคนิคการวาดภาพ, การออกแบบ'
    },
    {
        name: 'Biography',
        description: 'หนังสือที่เล่าเรื่องราวชีวิตจริงของบุคคลใดบุคคลหนึ่ง ตั้งแต่เกิดจนถึงช่วงเวลาสำคัญต่างๆ'
    },
    {
        name: 'Business',
        description: 'หนังสือที่ให้ความรู้และกลยุทธ์ในการทำธุรกิจ การตลาด การบริหารการเงิน และการลงทุน'
    },
    {
        name: 'Chick Lit',
        description: 'นวนิยายที่สะท้อนชีวิตผู้หญิงยุคใหม่ในเมือง เน้นเรื่องความสัมพันธ์ การทำงาน และการค้นหาตัวเอง'
    },
    {
        name: 'Children\'s',
        description: 'หนังสือสำหรับเด็ก มีเนื้อหาหลากหลายตั้งแต่นิทานภาพไปจนถึงวรรณกรรม เพื่อส่งเสริมการอ่านและจินตนาการ'
    },
    {
        name: 'Christian',
        description: 'หนังสือที่เกี่ยวกับหลักคำสอน ความเชื่อ และเรื่องราวต่างๆ ในศาสนาคริสต์'
    },
    {
        name: 'Classics',
        description: 'หนังสือวรรณกรรมที่ทรงคุณค่าและได้รับการยอมรับในระดับสากล ผ่านการพิสูจน์ของกาลเวลา'
    },
    {
        name: 'Comics',
        description: 'หนังสือการ์ตูนช่องสไตล์ตะวันตก ที่เล่าเรื่องราวผ่านภาพวาดและคำพูดเป็นหลัก'
    },
    {
        name: 'Contemporary',
        description: 'นวนิยายที่ดำเนินเรื่องในยุคสมัยปัจจุบัน สะท้อนภาพสังคมและวิถีชีวิตของคนในยุคนั้นๆ'
    },
    {
        name: 'Cookbooks',
        description: 'หนังสือที่รวบรวมสูตรและขั้นตอนการทำอาหาร ทั้งของคาว ของหวาน และเครื่องดื่ม'
    },
    {
        name: 'Crime',
        description: 'หนังสือที่เน้นเรื่องราวอาชญากรรม การสืบสวนหาตัวคนร้าย และกระบวนการทางกฎหมาย'
    },
    {
        name: 'Ebooks',
        description: 'หนังสือในรูปแบบดิจิทัล (ไฟล์) สำหรับอ่านบนอุปกรณ์อิเล็กทรอนิกส์ต่างๆ'
    },
    {
        name: 'Fantasy',
        description: 'นวนิยายที่มีฉากอยู่ในโลกจินตนาการ ประกอบด้วยเวทมนตร์ สิ่งมีชีวิตเหนือจริง และการผจญภัย'
    },
    {
        name: 'Fiction',
        description: 'หนังสือที่สร้างจากจินตนาการของผู้เขียนทั้งหมด ไม่ว่าจะเป็นนวนิยายหรือเรื่องสั้น'
    },
    {
        name: 'Gay and Lesbian',
        description: 'หนังสือที่บอกเล่าเรื่องราวความรักและชีวิตของตัวละครที่มีความหลากหลายทางเพศ (LGBTQ+)'
    },
    {
        name: 'Graphic Novels',
        description: 'หนังสือการ์ตูนที่มีเนื้อเรื่องยาวและซับซ้อนจบในเล่มเดียว เหมือนการอ่านนวนิยายผ่านภาพ'
    },
    {
        name: 'Historical Fiction',
        description: 'นวนิยายที่มีตัวละครและเรื่องราวที่แต่งขึ้นใหม่ แต่อยู่ในฉากหลังของเหตุการณ์ประวัติศาสตร์จริง'
    },
    {
        name: 'History',
        description: 'หนังสือที่เล่าข้อเท็จจริงเกี่ยวกับเหตุการณ์ บุคคล หรือยุคสมัยต่างๆ ที่เกิดขึ้นในอดีต'
    },
    {
        name: 'Horror',
        description: 'หนังสือที่สร้างบรรยากาศน่ากลัว กดดัน และสยองขวัญ ทำให้ผู้อ่านรู้สึกหวาดผวา'
    },
    {
        name: 'Humor and Comedy',
        description: 'หนังสือที่เน้นสร้างความสนุกสนานและเสียงหัวเราะ ผ่านเรื่องราวหรือมุกตลกต่างๆ'
    },
    {
        name: 'Manga',
        description: 'หนังสือการ์ตูนช่องจากประเทศญี่ปุ่น มีลายเส้นและสไตล์การเล่าเรื่องที่เป็นเอกลักษณ์'
    },
    {
        name: 'Memoir',
        description: 'หนังสือที่ผู้เขียนเล่าเรื่องราวจากประสบการณ์จริงของตนเอง โดยเน้นช่วงเวลาที่น่าจดจำเป็นพิเศษ'
    },
    {
        name: 'Music',
        description: 'หนังสือที่ให้ความรู้เกี่ยวกับดนตรี ไม่ว่าจะเป็นประวัติศาสตร์ ทฤษฎี หรือชีวประวัติศิลปิน'
    },
    {
        name: 'Mystery',
        description: 'หนังสือที่เต็มไปด้วยปริศนาลึกลับ ผู้อ่านจะต้องร่วมไขคดีหรือค้นหาความจริงไปพร้อมกับตัวละคร'
    },
    {
        name: 'Nonfiction',
        description: 'หนังสือที่เขียนจากเรื่องจริง ให้ความรู้ หรือข้อมูลตามข้อเท็จจริง (ตรงข้ามกับ Fiction)'
    },
    {
        name: 'Paranormal',
        description: 'หนังสือที่เกี่ยวกับปรากฏการณ์เหนือธรรมชาติ เช่น วิญญาณ ภูตผี หรือผู้มีพลังพิเศษ'
    },
    {
        name: 'Philosophy',
        description: 'หนังสือที่ชวนให้ขบคิดและตั้งคำถามเกี่ยวกับแนวคิดพื้นฐานของชีวิต ความจริง และการมีอยู่'
    },
    {
        name: 'Poetry',
        description: 'หนังสือที่ถ่ายทอดอารมณ์และความคิดผ่านการใช้ภาษาที่สละสลวยในรูปแบบของบทกวี'
    },
    {
        name: 'Psychology',
        description: 'หนังสือที่อธิบายการทำงานของจิตใจและความคิดที่ส่งผลต่อพฤติกรรมของมนุษย์'
    },
    {
        name: 'Religion',
        description: 'หนังสือที่ให้ความรู้เกี่ยวกับหลักคำสอน ประวัติ และความเชื่อของศาสนาต่างๆ'
    },
    {
        name: 'Romance',
        description: 'นวนิยายที่เน้นเรื่องราวความสัมพันธ์และความรักของตัวละครเป็นหัวใจสำคัญของเรื่อง'
    },
    {
        name: 'Science',
        description: 'หนังสือที่อธิบายความรู้และทฤษฎีทางวิทยาศาสตร์แขนงต่างๆ ให้เข้าใจได้ง่าย'
    },
    {
        name: 'Science Fiction',
        description: 'นวนิยายที่ผสานจินตนาการเข้ากับหลักการวิทยาศาสตร์ อาจเป็นเรื่องในโลกอนาคต อวกาศ หรือต่างดาว'
    },
    {
        name: 'Self Help',
        description: 'หนังสือที่ให้คำแนะนำและเครื่องมือเพื่อช่วยให้ผู้อ่านพัฒนาและปรับปรุงชีวิตของตนเองให้ดีขึ้น'
    },
    {
        name: 'Suspense',
        description: 'หนังสือที่ดำเนินเรื่องอย่างตึงเครียด ทำให้ผู้อ่านรู้สึกกดดันและลุ้นระทึกไปกับชะตากรรมของตัวละคร'
    },
    {
        name: 'Spirituality',
        description: 'หนังสือที่สำรวจความหมายของชีวิตและสัจธรรมภายในจิตใจ โดยไม่จำเป็นต้องอิงกับศาสนาใดศาสนาหนึ่ง'
    },
    {
        name: 'Sports',
        description: 'หนังสือที่เล่าเรื่องราวเกี่ยวกับโลกของกีฬา ไม่ว่าจะเป็นชีวประวัติคนดัง หรือเบื้องหลังการแข่งขัน'
    },
    {
        name: 'Thriller',
        description: 'หนังสือที่เดินเรื่องเร็วและตื่นเต้น มักมีการไล่ล่า การหนีเอาตัวรอด และอันตรายถึงชีวิต'
    },
    {
        name: 'Travel',
        description: 'หนังสือที่สร้างแรงบันดาลใจในการเดินทาง ผ่านบันทึกประสบการณ์หรือการแนะนำสถานที่ท่องเที่ยว'
    },
    {
        name: 'Young Adult',
        description: 'หนังสือสำหรับวัยรุ่น (YA) ที่มีเนื้อหาเข้มข้นสะท้อนปัญหาและการก้าวผ่านช่วงวัยของตัวละคร'
    }
];

// --- 🧑‍🎨 3. ข้อมูลนักเขียน ---
const authors = [
    {
        "author_id": 1,
        "name": "R. F. Kuang",
        "bio": "Chinese-American novelist blending cultural critique with genre fantasy; breakout with Yellowface after acclaimed Poppy War series.",
        "profileImage": null
    },
    {
        "author_id": 2,
        "name": "Emilia Hart",
        "bio": "British-Australian debut author of Weyward, weaving intergenerational women\u2019s stories with mystical heritage.",
        "profileImage": null
    },
    {
        "author_id": 3,
        "name": "Freida McFadden",
        "bio": "American physician-turned-thriller author known for twisty psychological suspense and multiple Kindle bestsellers.",
        "profileImage": null
    },
    {
        "author_id": 4,
        "name": "Emily Henry",
        "bio": "Bestselling contemporary romance author celebrated for witty, emotional stories about relationships and self-discovery.",
        "profileImage": null
    },
    {
        "author_id": 5,
        "name": "Rebecca Yarros",
        "bio": "Fantasy novelist behind the Empyrean series; mixes high-stakes adventure with romance, often hitting bestseller lists.",
        "profileImage": null
    },
    {
        "author_id": 6,
        "name": "Leigh Bardugo",
        "bio": "Fantasy writer creator of the Grishaverse and dark academia novels; renowned for rich worldbuilding and diverse casts.",
        "profileImage": null
    },
    {
        "author_id": 7,
        "name": "T. J. Klune",
        "bio": "Author of inclusive, heart-driven fantasy; known for stories about found family, identity, and emotional healing.",
        "profileImage": null
    },
    {
        "author_id": 8,
        "name": "Stephen King",
        "bio": "Prolific author of horror, suspense, and thriller fiction, blending psychological depth with page-turning dread.",
        "profileImage": null
    },
    {
        "author_id": 9,
        "name": "Rebecca Ross",
        "bio": "YA fantasy author whose work combines romance and epic stakes with lyrical worldbuilding.",
        "profileImage": null
    },
    {
        "author_id": 10,
        "name": "Ali Hazelwood",
        "bio": "Neuroscientist-turned-romance author, famous for STEM-centered rom-coms with empowered female leads.",
        "profileImage": null
    },
    {
        "author_id": 11,
        "name": "James McBride",
        "bio": "Author and musician blending history and community in emotionally resonant fiction; National Book Award winner.",
        "profileImage": null
    },
    {
        "author_id": 12,
        "name": "Dennis Lehane",
        "bio": "Crime novelist and screenwriter from Boston, known for gritty, morally complex stories in urban settings.",
        "profileImage": null
    },
    {
        "author_id": 13,
        "name": "Ann Napolitano",
        "bio": "Literary fiction writer exploring family bonds and trauma; author of Oprah Book Club picks.",
        "profileImage": null
    },
    {
        "author_id": 14,
        "name": "Bonnie Garmus",
        "bio": "Late-blooming novelist whose Lessons in Chemistry became a cultural phenomenon for blending feminism and humor.",
        "profileImage": null
    },
    {
        "author_id": 15,
        "name": "Colleen Hoover",
        "bio": "Viral romance author whose emotionally intense contemporary novels dominate bestseller lists and social media.",
        "profileImage": null
    },
    {
        "author_id": 16,
        "name": "Gabrielle Zevin",
        "bio": "Versatile novelist and screenwriter; writes layered stories about creativity, friendship, and identity across time.",
        "profileImage": null
    },
    {
        "author_id": 17,
        "name": "Rick Riordan",
        "bio": "Mythology-based adventure author for young readers; creator of Percy Jackson universe blending ancient gods with modern life.",
        "profileImage": null
    },
    {
        "author_id": 18,
        "name": "Kristin Hannah",
        "bio": "Historical fiction author focused on women's resilience; writes emotionally powerful sagas about forgotten stories.",
        "profileImage": null
    },
    {
        "author_id": 19,
        "name": "Abraham Verghese",
        "bio": "Physician-author merging medicine and storytelling; known for epic, character-driven novels with deep cultural roots.",
        "profileImage": null
    },
    {
        "author_id": 20,
        "name": "Matthew Desmond",
        "bio": "Pulitzer-winning sociologist examining systemic poverty in America; author of Poverty, by America.",
        "profileImage": null
    },
    {
        "author_id": 21,
        "name": "Britney Spears",
        "bio": "Pop star sharing her personal journey in memoir form; candid voice on fame, control, and reclaiming identity.",
        "profileImage": null
    },
    {
        "author_id": 22,
        "name": "David Grann",
        "bio": "Investigative journalist and nonfiction storyteller known for immersive historical narratives blending suspense and fact.",
        "profileImage": null
    },
    {
        "author_id": 23,
        "name": "Henry Winkler",
        "bio": "Actor and author whose memoir blends humor and life lessons; longtime advocate for learning differences.",
        "profileImage": null
    },
    {
        "author_id": 24,
        "name": "Prince Harry, Duke of Sussex",
        "bio": "Royal-turned-advocate chronicling his life and struggles with identity, family, and public scrutiny in his memoir.",
        "profileImage": null
    },
    {
        "author_id": 25,
        "name": "Jonathan Eig",
        "bio": "Biographer and journalist delivering deeply researched portraits of historical figures, including MLK Jr.",
        "profileImage": null
    },
    {
        "author_id": 26,
        "name": "Walter Isaacson",
        "bio": "Biographer famed for definitive portraits of innovators; known for intensive research and clear narrative style.",
        "profileImage": null
    },
    {
        "author_id": 27,
        "name": "Dr. Peter Attia",
        "bio": "Physician specializing in longevity science, translating complex health data into actionable lifestyle strategies.",
        "profileImage": null
    },
    {
        "author_id": 28,
        "name": "Jennette McCurdy",
        "bio": "Former child actor turned writer, candidly recounting trauma and recovery in her memoir.",
        "profileImage": null
    },
    {
        "author_id": 29,
        "name": "Michael Finkel",
        "bio": "Journalist and true-crime author whose narrative nonfiction often reads like tightly plotted thrillers.",
        "profileImage": null
    },
    {
        "author_id": 30,
        "name": "Rick Rubin",
        "bio": "Legendary music producer and creative thinker who distills decades of artistic insight into practical philosophy about creation and presence.",
        "profileImage": null
    },
    {
        "author_id": 31,
        "name": "Alex Michaelides",
        "bio": "British-Cypriot author and screenwriter; rocketed to fame with his debut psychological thriller, The Silent Patient.",
        "profileImage": null
    },
    {
        "author_id": 32,
        "name": "James Clear",
        "bio": "Author and speaker focused on habits and continuous improvement; known for his massively popular book Atomic Habits.",
        "profileImage": null
    },
    {
        "author_id": 33,
        "name": "Michelle Obama",
        "bio": "Former First Lady of the United States, lawyer, and author whose memoir 'Becoming' was a global phenomenon.",
        "profileImage": null
    },
    {
        "author_id": 34,
        "name": "Celeste Ng",
        "bio": "American writer whose novels explore family dynamics, secrets, and race relations in suburban America.",
        "profileImage": null
    },
    {
        "author_id": 35,
        "name": "Matt Haig",
        "bio": "British author known for his fiction and non-fiction works that often explore mental health, philosophy, and humanity.",
        "profileImage": null
    },
    {
        "author_id": 36,
        "name": "Andy Weir",
        "bio": "American sci-fi novelist who blends rigorous scientific accuracy with thrilling, problem-solving narratives.",
        "profileImage": null
    },
    {
        "author_id": 37,
        "name": "Tara Westover",
        "bio": "American memoirist whose book 'Educated' recounts her journey from a survivalist family to earning a PhD from Cambridge.",
        "profileImage": null
    },
    {
        "author_id": 38,
        "name": "Yuval Noah Harari",
        "bio": "Israeli historian and professor, author of bestselling books that examine the grand narrative of human history and its future.",
        "profileImage": null
    },
    {
        "author_id": 39,
        "name": "Delia Owens",
        "bio": "American author and zoologist whose debut novel 'Where the Crawdads Sing' became a bestselling cultural touchstone.",
        "profileImage": null
    },
    {
        "author_id": 40,
        "name": "Madeline Miller",
        "bio": "American novelist who reimagines Greek myths with lyrical prose and deep character studies, known for 'Circe' and 'The Song of Achilles'.",
        "profileImage": null
    },
    {
        "author_id": 41,
        "name": "Anthony Doerr",
        "bio": "American author of novels and short stories who won the Pulitzer Prize for his historical novel 'All the Light We Cannot See'.",
        "profileImage": null
    },
    {
        "author_id": 42,
        "name": "Casey McQuiston",
        "bio": "American author of romance novels, celebrated for witty, contemporary stories featuring LGBTQ+ characters.",
        "profileImage": null
    },
    {
        "author_id": 43,
        "name": "Richard Osman",
        "bio": "British television presenter and author who created the wildly popular 'The Thursday Murder Club' cozy mystery series.",
        "profileImage": null
    },
    {
        "author_id": 44,
        "name": "Taylor Jenkins Reid",
        "bio": "American author known for her immersive novels about the lives of fictional celebrities, blending glamour with emotional depth.",
        "profileImage": null
    },
    {
        "author_id": 45,
        "name": "Suzanne Collins",
        "bio": "American author and screenwriter, creator of the dystopian 'The Hunger Games' series that became a global phenomenon.",
        "profileImage": null
    },
    {
        "author_id": 46,
        "name": "George Orwell",
        "bio": "Influential English novelist, essayist, and critic known for his dystopian novel '1984' and allegorical novella 'Animal Farm'.",
        "profileImage": null
    },
    {
        "author_id": 47,
        "name": "J.R.R. Tolkien",
        "bio": "English writer, poet, and academic who is best known as the author of the high fantasy classics 'The Hobbit' and 'The Lord of the Rings'.",
        "profileImage": null
    },
    {
        "author_id": 48,
        "name": "Frank Herbert",
        "bio": "American science fiction author best known for the novel 'Dune' and its five sequels, a cornerstone of the genre.",
        "profileImage": null
    },
    {
        "author_id": 49,
        "name": "Ocean Vuong",
        "bio": "Vietnamese-American poet and novelist whose work explores trauma, identity, and family with lyrical and powerful prose.",
        "profileImage": null
    },
    {
        "author_id": 50,
        "name": "Mark Manson",
        "bio": "American self-help author and blogger known for his counterintuitive, no-nonsense approach to life and happiness.",
        "profileImage": null
    },
    {
        "author_id": 51,
        "name": "Brené Brown",
        "bio": "American research professor and author whose work on vulnerability, courage, and shame has made her a prominent public speaker.",
        "profileImage": null
    },
    {
        "author_id": 52,
        "name": "Gillian Flynn",
        "bio": "American author known for her dark, twisty psychological thrillers, including the international bestseller 'Gone Girl'.",
        "profileImage": null
    },
    {
        "author_id": 53,
        "name": "Sarah J. Maas",
        "bio": "American fantasy author renowned for her bestselling series 'A Court of Thorns and Roses' and 'Throne of Glass', which blend romance and epic adventure.",
        "profileImage": null
    },
    {
        "author_id": 54,
        "name": "V. E. Schwab",
        "bio": "American author of fantasy novels known for intricate magic systems and morally complex characters, such as in 'The Invisible Life of Addie LaRue'.",
        "profileImage": null
    },
    {
        "author_id": 55,
        "name": "Paulo Coelho",
        "bio": "Brazilian lyricist and novelist, best known for his international bestseller 'The Alchemist,' which weaves spiritual themes into a compelling narrative.",
        "profileImage": null
    },
    {
        "author_id": 56,
        "name": "Neil Gaiman",
        "bio": "English author of short fiction, novels, comic books, and graphic novels, known for his modern and dark fantasy works like 'American Gods'.",
        "profileImage": null
    },
    {
        "author_id": 57,
        "name": "Kazuo Ishiguro",
        "bio": "Nobel Prize-winning British novelist of Japanese origin, whose works explore memory, identity, and the passage of time with subtle emotional power.",
        "profileImage": null
    },
    {
        "author_id": 58,
        "name": "Stephen Hawking",
        "bio": "Renowned theoretical physicist and cosmologist whose book 'A Brief History of Time' made complex scientific concepts accessible to a mass audience.",
        "profileImage": null
    },
    {
        "author_id": 59,
        "name": "Haruki Murakami",
        "bio": "Japanese writer whose surreal, melancholic novels and short stories blend pop-culture references with themes of loneliness and alienation.",
        "profileImage": null
    },
    {
        "author_id": 60,
        "name": "Angie Thomas",
        "bio": "American young adult author whose debut novel, 'The Hate U Give,' offered a powerful commentary on race and police brutality.",
        "profileImage": null
    },
    {
        "author_id": 61,
        "name": "J.K. Rowling",
        "bio": "British author who created the 'Harry Potter' series, one of the most popular and influential book series in history, defining a generation of readers.",
        "profileImage": null
    }
]
// --- 📚 4. ข้อมูลหนังสือ ---
const books = [
    {
        author_id: 1,
        title: "Yellowface",
        page: 336,
        isbn: "978-0063250892",
        publishedYear: 2023,
        description: "A writer steals her late friend's manuscript, igniting debates on cultural appropriation and the ethics of publishing. Tension spirals as identity and ambition clash.",
        bookImage: "https://m.media-amazon.com/images/I/51hxRAoHuxL._SL1500_.jpg",
        tag: ["Fiction", "Contemporary", "Suspense"]
    },
    {
        author_id: 2,
        title: "Weyward",
        page: 336,
        isbn: "978-1250285652",
        publishedYear: 2023,
        description: "Three women across eras discover linked witchy powers, confronting patriarchy and legacy while reshaping their destinies.",
        bookImage: "https://m.media-amazon.com/images/I/91qCWeahwpL.jpg",
        tag: ["Fantasy", "Historical Fiction", "Fiction"]
    },
    {
        author_id: 3,
        title: "The Housemaid’s Secret",
        page: 352,
        isbn: "978-1542037466",
        publishedYear: 2023,
        description: "A housekeeper uncovers hidden horrors while working for a wealthy couple; every rule and locked door conceals deadly truth.",
        bookImage: "https://m.media-amazon.com/images/I/81Xf0YFEpwL.jpg",
        tag: ["Thriller", "Crime", "Suspense"]
    },
    {
        author_id: 4,
        title: "Happy Place",
        page: 400,
        isbn: "978-0593441275",
        publishedYear: 2023,
        description: "Exes pretend to be together on vacation, rekindling old feelings amid laughter and carefully guarded secrets.",
        bookImage: "https://m.media-amazon.com/images/I/71OS-CG85lL.jpg",
        tag: ["Chick Lit", "Romance", "Contemporary"]
    },
    {
        author_id: 5,
        title: "Fourth Wing",
        page: 512,
        isbn: "978-1649374042",
        publishedYear: 2023,
        description: "A reluctant recruit enters a brutal dragon rider academy, fighting deadly trials while forming a forbidden bond.",
        bookImage: "https://m.media-amazon.com/images/I/71bXcusLgJL._UF1000,1000_QL80_.jpg",
        tag: ["Fantasy", "Romance", "Young Adult"]
    },
    {
        author_id: 6,
        title: "Hell Bent",
        page: 481,
        isbn: "978-1250886362",
        publishedYear: 2023,
        description: "Dark academia and occult forces collide as Alex Stern dives back into Yale’s dangerous secret societies to rescue a friend.",
        bookImage: "https://m.media-amazon.com/images/I/71Ovi8nl0gL.jpg",
        tag: ["Fantasy", "Horror", "Suspense"]
    },
    {
        author_id: 7,
        title: "In the Lives of Puppets",
        page: 432,
        isbn: "978-1250882937",
        publishedYear: 2023,
        description: "A heartfelt quest in a world of sentient robots, where found family fights authoritarian machines to save a captured father.",
        bookImage: "https://m.media-amazon.com/images/I/81JkA0m5pDL.jpg",
        tag: ["Fantasy", "Fiction", "Gay and Lesbian"]
    },
    {
        author_id: 8,
        title: "Holly",
        page: 449,
        isbn: "978-1668011689",
        publishedYear: 2023,
        description: "Investigator Holly Gibney uncovers gruesome secrets behind missing persons, facing both human depravity and supernatural hints.",
        bookImage: "https://m.media-amazon.com/images/I/815oQ6G6HDL.jpg",
        tag: ["Crime", "Thriller", "Suspense"]
    },
    {
        author_id: 9,
        title: "Divine Rivals",
        page: 368,
        isbn: "978-1250857430",
        publishedYear: 2023,
        description: "Rival writers exchange magical letters amid a divine war, discovering unexpected love while gods wage chaos.",
        bookImage: "https://m.media-amazon.com/images/I/81c9zivzkDL.jpg",
        tag: ["Fantasy", "Young Adult", "Romance"]
    },
    {
        author_id: 10,
        title: "Check & Mate",
        page: 368,
        isbn: "978-0593377413",
        publishedYear: 2023,
        description: "A former chess prodigy reenters competition, balancing family pressure and a budding romance across the chessboard.",
        bookImage: "https://m.media-amazon.com/images/I/81MGyLRNtZL._UF1000,1000_QL80_.jpg",
        tag: ["Young Adult", "Contemporary", "Romance"]
    },
    {
        author_id: 11,
        title: "The Heaven & Earth Grocery Store",
        page: 400,
        isbn: "978-0593422953",
        publishedYear: 2023,
        description: "A small-town mystery unravels decades of secrets, centering on a grocery store that binds a fractured multicultural community.",
        bookImage: "https://m.media-amazon.com/images/I/81FS3wyevDL._UF1000,1000_QL80_.jpg",
        tag: ["Historical Fiction", "Fiction"]
    },
    {
        author_id: 12,
        title: "Small Mercies",
        page: 320,
        isbn: "978-0063294322",
        publishedYear: 2023,
        description: "In 1970s Boston, a mother hunts her missing daughter amid racial tension and urban unrest, pushing against systemic injustice.",
        bookImage: "https://m.media-amazon.com/images/I/814RsaMtNuL.jpg",
        tag: ["Crime", "Historical Fiction", "Suspense"]
    },
    {
        author_id: 13,
        title: "Hello Beautiful",
        page: 416,
        isbn: "978-0593593813",
        publishedYear: 2023,
        description: "Sisterhood is tested by love and betrayal in a family drama that spans decades and asks what forgiveness really means.",
        bookImage: "https://m.media-amazon.com/images/I/91CQZ+V4ypL.jpg",
        tag: ["Contemporary", "Fiction", "Chick Lit"]
    },
    {
        author_id: 14,
        title: "Lessons in Chemistry",
        page: 400,
        isbn: "978-0385547345",
        publishedYear: 2022,
        description: "A brilliant female chemist in the 1960s uses a cooking show to teach science and challenge sexist norms.",
        bookImage: "https://m.media-amazon.com/images/I/71dQACXhz6L.jpg",
        tag: ["Historical Fiction", "Humor and Comedy", "Fiction"]
    },
    {
        author_id: 15,
        title: "It Starts With Us",
        page: 336,
        isbn: "978-1668001222",
        publishedYear: 2022,
        description: "Lily navigates trauma recovery and rekindled love while co-parenting, determined to build a healthier future.",
        bookImage: "https://m.media-amazon.com/images/I/81uIph9QW7L.jpg",
        tag: ["Romance", "Contemporary", "Fiction"]
    },
    {
        author_id: 16,
        title: "Tomorrow, and Tomorrow, and Tomorrow",
        page: 416,
        isbn: "978-0593321201",
        publishedYear: 2022,
        description: "Two friends build a video game empire over decades, their creative partnership reflecting love, loss, and identity.",
        bookImage: "https://m.media-amazon.com/images/I/91KugvH+FwL._UF1000,1000_QL80_.jpg",
        tag: ["Contemporary", "Fiction", "Young Adult"]
    },
    {
        author_id: 17,
        title: "Percy Jackson and the Chalice of the Gods",
        page: 256,
        isbn: "978-1368098175",
        publishedYear: 2023,
        description: "Percy must recover a divine chalice to secure a recommendation, juggling mythic quests with everyday teenage life.",
        bookImage: "https://m.media-amazon.com/images/I/91prhAgYTNL._UF1000,1000_QL80_.jpg",
        tag: ["Fantasy", "Young Adult"]
    },
    {
        author_id: 18,
        title: "The Women",
        page: 480,
        isbn: "978-1250178633",
        publishedYear: 2024,
        description: "A Vietnam War nurse faces combat trauma abroad and silence at home, revealing forgotten sacrifices of female veterans.",
        bookImage: "https://m.media-amazon.com/images/I/913C+MR3S5L.jpg",
        tag: ["Historical Fiction", "Fiction"]
    },
    {
        author_id: 19,
        title: "The Covenant of Water",
        page: 736,
        isbn: "978-0802162175",
        publishedYear: 2023,
        description: "An Indian family’s multigenerational secret unfolds in Kerala, mixing medical mystery with cultural legacy.",
        bookImage: "https://m.media-amazon.com/images/I/91b7tm523VL._UF1000,1000_QL80_.jpg",
        tag: ["Historical Fiction", "Fiction"]
    },
    {
        author_id: 20,
        title: "Poverty, by America",
        page: 304,
        isbn: "978-0593239912",
        publishedYear: 2023,
        description: "Investigates how affluent Americans perpetuate poverty through policy and practice, calling for systemic transformation.",
        bookImage: "https://m.media-amazon.com/images/I/61DAx72G7ZL.jpg",
        tag: ["Nonfiction", "Business"]
    },
    {
        author_id: 21,
        title: "The Woman in Me",
        page: 288,
        isbn: "978-1668009044",
        publishedYear: 2023,
        description: "Britney Spears tells her story of fame, control, and reclaiming autonomy after years under a conservatorship.",
        bookImage: "https://m.media-amazon.com/images/I/71GrNYSQfFL.jpg",
        tag: ["Memoir", "Nonfiction"]
    },
    {
        author_id: 22,
        title: "The Wager: A Tale of Shipwreck, Mutiny and Murder",
        page: 352,
        isbn: "978-0385542463",
        publishedYear: 2023,
        description: "True maritime survival saga of a shipwrecked crew, descending into mutiny and moral collapse during 18th-century trial.",
        bookImage: "https://m.media-amazon.com/images/I/91lUa7PChXL._UF1000,1000_QL80_.jpg",
        tag: ["History", "Nonfiction"]
    },
    {
        author_id: 23,
        title: "Being Henry: The Fonz… and Beyond",
        page: 256,
        isbn: "978-1250888090",
        publishedYear: 2023,
        description: "Henry Winkler reflects on life, dyslexia, career highs and reinventions with warmth and humor.",
        bookImage: "https://m.media-amazon.com/images/I/81nSEldf7jL.jpg",
        tag: ["Memoir", "Humor and Comedy"]
    },
    {
        author_id: 24,
        title: "Spare",
        page: 416,
        isbn: "978-0593593806",
        publishedYear: 2023,
        description: "Prince Harry’s revealing memoir exploring royal family pressures, grief, and his quest for identity beyond duty.",
        bookImage: "https://m.media-amazon.com/images/I/81E0qrtQKiL._UF1000,1000_QL80_.jpg",
        tag: ["Memoir", "Biography"]
    },
    {
        author_id: 25,
        title: "King: A Life",
        page: 688,
        isbn: "978-0374605928",
        publishedYear: 2023,
        description: "Definitive biography of Martin Luther King Jr., revealing strategic brilliance and personal complexity through new sources.",
        bookImage: "https://m.media-amazon.com/images/I/81d0FQ-l2dL.jpg",
        tag: ["Biography", "History"]
    },
    {
        author_id: 26,
        title: "Elon Musk",
        page: 688,
        isbn: "978-1982181284",
        publishedYear: 2023,
        description: "Intimate biography exploring the ambition, contradictions, and innovations of tech magnate Elon Musk.",
        bookImage: "https://m.media-amazon.com/images/I/81SlrVsShvL.jpg",
        tag: ["Biography", "Business"]
    },
    {
        author_id: 27,
        title: "Outlive: The Science and Art of Longevity",
        page: 496,
        isbn: "978-0593236591",
        publishedYear: 2023,
        description: "Evidence-based guide to extending healthspan; reframes aging and offers practical habits to live longer and better.",
        bookImage: "https://m.media-amazon.com/images/I/71X9FMy66NL._UF1000,1000_QL80_.jpg",
        tag: ["Science", "Self Help"]
    },
    {
        author_id: 28,
        title: "I’m Glad My Mom Died",
        page: 320,
        isbn: "978-1982185824",
        publishedYear: 2022,
        description: "Memoir of escaping an abusive stage-mother; dark humor meets trauma recovery in a raw, empowering narrative.",
        bookImage: "https://m.media-amazon.com/images/I/71Z2AwOxq+L._UF1000,1000_QL80_.jpg",
        tag: ["Memoir", "Psychology"]
    },
    {
        author_id: 29,
        title: "The Art Thief: A True Story of Love, Crime, and a Dangerous Obsession",
        page: 240,
        isbn: "978-0593319987",
        publishedYear: 2023,
        description: "Investigation into Stéphane Breitwieser’s theft spree, revealing obsession and audacity behind major art crimes.",
        bookImage: "https://m.media-amazon.com/images/I/91+M6sHPekL._UF1000,1000_QL80_.jpg",
        tag: ["History", "Nonfiction"]
    },
    {
        author_id: 30,
        title: "The Creative Act: A Way of Being",
        page: 432,
        isbn: "978-0593652882",
        publishedYear: 2023,
        description: "Rick Rubin shares his philosophy and creative process drawn from decades of experience, offering a practical guide that makes artistic creation accessible to everyone by blending deep insight with actionable advice.",
        bookImage: "https://books.google.com/books/content?id=jW5tEAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
        tag: ["Music", "Self Help", "Nonfiction", "Philosophy"]
    },
    {
        author_id: 31,
        title: "The Silent Patient",
        page: 336,
        isbn: "978-1250301697",
        publishedYear: 2019,
        description: "A psychotherapist becomes obsessed with his famous patient, a woman who went silent after murdering her husband. The quest for truth uncovers shocking twists.",
        bookImage: "https://m.media-amazon.com/images/I/91BbLCJOruL.jpg",
        tag: ["Thriller", "Mystery", "Suspense", "Fiction"]
    },
    {
        author_id: 43,
        title: "The Thursday Murder Club",
        page: 384,
        isbn: "978-1984880963",
        publishedYear: 2020,
        description: "Four friends in a retirement village meet weekly to investigate unsolved murders. When a real killing happens on their doorstep, they find themselves in the middle of their first live case.",
        bookImage: "https://m.media-amazon.com/images/I/81uHYq+cvkL._UF1000,1000_QL80_.jpg",
        tag: ["Mystery", "Crime", "Fiction", "Humor and Comedy"]
    },
    {
        author_id: 52,
        title: "Gone Girl",
        page: 432,
        isbn: "978-0307588371",
        publishedYear: 2012,
        description: "On their fifth wedding anniversary, a woman disappears, leaving her husband as the primary suspect. The story, told from dual perspectives, reveals a dark and manipulative marriage.",
        bookImage: "https://m.media-amazon.com/images/I/713e4Yk6brL._UF1000,1000_QL80_.jpg",
        tag: ["Thriller", "Mystery", "Fiction", "Suspense"]
    },
    {
        author_id: 3,
        title: "The Inmate",
        page: 350,
        isbn: "978-1542037411",
        publishedYear: 2022,
        description: "A nurse practitioner working in a prison is shocked to find her high school crush as an inmate. He claims he's innocent, forcing her to confront a dark past to uncover the truth.",
        bookImage: "https://m.media-amazon.com/images/I/815jGv4g6SL.jpg",
        tag: ["Thriller", "Suspense", "Mystery", "Crime"]
    },
    {
        author_id: 12,
        title: "Shutter Island",
        page: 369,
        isbn: "978-0061898822",
        publishedYear: 2003,
        description: "In 1954, a U.S. Marshal investigates the disappearance of a murderer who escaped from a hospital for the criminally insane. A web of deceit and psychological horror ensues.",
        bookImage: "https://m.media-amazon.com/images/I/81290CKRxTL._UF1000,1000_QL80_.jpg",
        tag: ["Thriller", "Mystery", "Suspense", "Historical Fiction"]
    },
    {
        author_id: 32,
        title: "Atomic Habits",
        page: 320,
        isbn: "978-0735211292",
        publishedYear: 2018,
        description: "A practical guide on how to build good habits and break bad ones through tiny, incremental changes. This book offers a system for improving every day by focusing on small wins.",
        bookImage: "https://m.media-amazon.com/images/I/81ANaVZk5LL._UF1000,1000_QL80_.jpg",
        tag: ["Self Help", "Nonfiction", "Psychology", "Business"]
    },
    {
        author_id: 33,
        title: "Becoming",
        page: 448,
        isbn: "978-1524763138",
        publishedYear: 2018,
        description: "Michelle Obama's intimate memoir chronicles her journey from the South Side of Chicago to the White House, reflecting on her life, work, and public service with profound honesty.",
        bookImage: "https://m.media-amazon.com/images/I/81cJTmFpG-L.jpg",
        tag: ["Memoir", "Nonfiction", "Biography"]
    },
    {
        author_id: 37,
        title: "Educated: A Memoir",
        page: 352,
        isbn: "978-0399590504",
        publishedYear: 2018,
        description: "The unforgettable memoir of a young woman who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
        bookImage: "https://m.media-amazon.com/images/I/71-4MkLN5jL.jpg",
        tag: ["Memoir", "Nonfiction", "Biography", "Psychology"]
    },
    {
        author_id: 38,
        title: "Sapiens: A Brief History of Humankind",
        page: 464,
        isbn: "978-0062316097",
        publishedYear: 2011,
        description: "A groundbreaking narrative of humanity's creation and evolution, exploring how Homo sapiens came to dominate the planet and what our future might hold.",
        bookImage: "https://m.media-amazon.com/images/I/713jIoMO3UL._UF1000,1000_QL80_.jpg",
        tag: ["History", "Nonfiction", "Science", "Philosophy"]
    },
    {
        author_id: 50,
        title: "The Subtle Art of Not Giving a F*ck",
        page: 224,
        isbn: "978-0062457714",
        publishedYear: 2016,
        description: "A counterintuitive approach to living a good life. This generation-defining self-help guide argues that improving our lives hinges not on turning lemons into lemonade, but on learning to stomach lemons better.",
        bookImage: "https://m.media-amazon.com/images/I/71QKQ9mwV7L.jpg",
        tag: ["Self Help", "Nonfiction", "Psychology", "Philosophy"]
    },
    {
        author_id: 51,
        title: "Daring Greatly",
        page: 320,
        isbn: "978-1592408412",
        publishedYear: 2012,
        description: "Brené Brown challenges our perception of vulnerability, arguing it's not a weakness but our most accurate measure of courage. She explains how to embrace imperfection and live a more wholehearted life.",
        bookImage: "https://m.media-amazon.com/images/I/81GOZ+-+yiL.jpg",
        tag: ["Self Help", "Psychology", "Nonfiction"]
    },
    {
        author_id: 58,
        title: "A Brief History of Time",
        page: 256,
        isbn: "978-0553380163",
        publishedYear: 1988,
        description: "From the Big Bang to black holes, Stephen Hawking's classic work provides an accessible overview of the universe's origins and fate, making complex cosmology understandable for the general reader.",
        bookImage: "https://m.media-amazon.com/images/I/51XWyS363pL._UF1000,1000_QL80_.jpg",
        tag: ["Science", "Nonfiction", "Philosophy"]
    },
    {
        author_id: 5,
        title: "Iron Flame",
        page: 624,
        isbn: "978-1649374172",
        publishedYear: 2023,
        description: "The sequel to 'Fourth Wing,' this book continues Violet Sorrengail's journey at Basgiath War College. As secrets unravel and the threat of war looms, her strength and bonds are tested like never before.",
        bookImage: "https://m.media-amazon.com/images/I/81cL2H23nVL.jpg",
        tag: ["Fantasy", "Romance", "Young Adult"]
    },
    {
        author_id: 40,
        title: "Circe",
        page: 400,
        isbn: "978-0316556347",
        publishedYear: 2018,
        description: "The story of the mythical witch Circe, reimagined as a powerful and independent woman. Banished to a deserted island, she hones her craft and crosses paths with famous figures of Greek mythology.",
        bookImage: "https://m.media-amazon.com/images/I/B1eAVSHxJ4L.jpg",
        tag: ["Fantasy", "Historical Fiction", "Fiction", "Mythology"]
    },
    {
        author_id: 53,
        title: "A Court of Thorns and Roses",
        page: 448,
        isbn: "978-1635575569",
        publishedYear: 2015,
        description: "A huntress is dragged to a magical land she only knows from legends after killing a wolf in the woods. There, she discovers her captor is not an animal, but a lethal, immortal fae.",
        bookImage: "https://m.media-amazon.com/images/I/81A-T+X6ukL._UF1000,1000_QL80_.jpg",
        tag: ["Fantasy", "Romance", "Young Adult", "Fiction"]
    },
    {
        author_id: 54,
        title: "The Invisible Life of Addie LaRue",
        page: 448,
        isbn: "978-0765387561",
        publishedYear: 2020,
        description: "In 1714 France, a young woman makes a Faustian bargain to live forever, but is cursed to be forgotten by everyone she meets. Her lonely existence spans centuries until she meets a man who remembers her.",
        bookImage: "https://m.media-amazon.com/images/I/91Ql48Y0mqL.jpg",
        tag: ["Fantasy", "Historical Fiction", "Romance", "Fiction"]
    },
    {
        author_id: 47,
        title: "The Hobbit",
        page: 310,
        isbn: "978-0547928227",
        publishedYear: 1937,
        description: "The charming tale of Bilbo Baggins, a comfort-loving hobbit who is whisked away on an epic quest with a band of dwarves to reclaim their treasure from a dragon, setting the stage for a grander adventure.",
        bookImage: "https://m.media-amazon.com/images/I/712cDO7d73L.jpg",
        tag: ["Fantasy", "Classics", "Fiction", "Children's"]
    },
    {
        author_id: 6,
        title: "Six of Crows",
        page: 465,
        isbn: "978-1250076960",
        publishedYear: 2015,
        description: "A crew of six dangerous outcasts attempts an impossible heist in a fantasy world. Led by a criminal prodigy, they must rely on their wits and each other to survive betrayal and powerful magic.",
        bookImage: "https://m.media-amazon.com/images/I/91v7vX+P9SL._UF1000,1000_QL80_.jpg",
        tag: ["Fantasy", "Young Adult", "Fiction"]
    },
    {
        author_id: 56,
        title: "American Gods",
        page: 560,
        isbn: "978-0062476517",
        publishedYear: 2001,
        description: "An ex-convict named Shadow Moon is hired as a bodyguard for the enigmatic Mr. Wednesday. He soon finds himself in a hidden world where a war is brewing between the Old Gods and the New Gods.",
        bookImage: "https://m.media-amazon.com/images/I/716LpMKQ3iL._UF1000,1000_QL80_.jpg",
        tag: ["Fantasy", "Fiction", "Contemporary", "Mythology"]
    },
    {
        author_id: 53,
        title: "House of Earth and Blood",
        page: 816,
        isbn: "978-1635574043",
        publishedYear: 2020,
        description: "In a modern fantasy city, half-Fae, half-human Bryce Quinlan seeks revenge for her friends' murders. Teaming up with a fallen angel, she uncovers a dark power that threatens their entire world.",
        bookImage: "https://m.media-amazon.com/images/I/81WblhV3ymL.jpg",
        tag: ["Fantasy", "Romance", "Fiction"]
    },
    {
        author_id: 36,
        title: "Project Hail Mary",
        page: 496,
        isbn: "978-0593135204",
        publishedYear: 2021,
        description: "An amnesiac astronaut wakes up millions of miles from Earth on a solo mission to save humanity. He must piece together his past and solve an impossible scientific puzzle to prevent extinction.",
        bookImage: "https://m.media-amazon.com/images/I/81yx0rw3MaL._UF350,350_QL50_.jpg",
        tag: ["Science Fiction", "Thriller", "Fiction"]
    },
    {
        author_id: 48,
        title: "Dune",
        page: 688,
        isbn: "978-0441013593",
        publishedYear: 1965,
        description: "The story of young Paul Atreides, whose noble family accepts stewardship of the desert planet Arrakis. A tale of politics, religion, and humanity's relationship with nature unfolds.",
        bookImage: "https://m.media-amazon.com/images/I/81Ua99CURsL._UF1000,1000_QL80_.jpg",
        tag: ["Science Fiction", "Fantasy", "Classics", "Fiction"]
    },
    {
        author_id: 46,
        title: "1984",
        page: 328,
        isbn: "978-0451524935",
        publishedYear: 1949,
        description: "A classic dystopian novel depicting a totalitarian society under constant surveillance by Big Brother. One man's struggle with oppressive conformity explores themes of truth, power, and individuality.",
        bookImage: "https://m.media-amazon.com/images/I/71wANojhEKL.jpg",
        tag: ["Science Fiction", "Classics", "Fiction", "Dystopian"]
    },
    {
        author_id: 57,
        title: "Klara and the Sun",
        page: 320,
        isbn: "978-0593318171",
        publishedYear: 2021,
        description: "Told from the perspective of an 'Artificial Friend,' this novel explores love, humanity, and our changing world through the eyes of a unique observer as she cares for a sickly human child.",
        bookImage: "https://m.media-amazon.com/images/I/61tqFlvlU3L.jpg",
        tag: ["Science Fiction", "Fiction", "Contemporary"]
    },
    {
        author_id: 34,
        title: "Little Fires Everywhere",
        page: 352,
        isbn: "978-0735224315",
        publishedYear: 2017,
        description: "In a placid Ohio suburb, the intertwined fates of a picture-perfect family and an enigmatic mother-daughter duo ignite tensions over secrets, motherhood, and identity.",
        bookImage: "https://m.media-amazon.com/images/I/81ccchV7FML.jpg",
        tag: ["Fiction", "Contemporary", "Mystery"]
    },
    {
        author_id: 35,
        title: "The Midnight Library",
        page: 304,
        isbn: "978-0525559474",
        publishedYear: 2020,
        description: "Between life and death, there is a library where one can try out alternative lives they could have lived. A woman gets the chance to undo her regrets and find what truly makes life worth living.",
        bookImage: "https://m.media-amazon.com/images/I/71ls-I6A5KL.jpg",
        tag: ["Fiction", "Fantasy", "Contemporary", "Philosophy"]
    },
    {
        author_id: 39,
        title: "Where the Crawdads Sing",
        page: 384,
        isbn: "978-0735219090",
        publishedYear: 2018,
        description: "A haunting coming-of-age story and murder mystery set in the marshes of North Carolina. It follows a young girl, abandoned by her family, who raises herself in isolation and becomes a suspect in a local crime.",
        bookImage: "https://m.media-amazon.com/images/I/81F0NTrPdCL._UF1000,1000_QL80_.jpg",
        tag: ["Fiction", "Historical Fiction", "Mystery", "Contemporary"]
    },
    {
        author_id: 41,
        title: "All the Light We Cannot See",
        page: 544,
        isbn: "978-1501173219",
        publishedYear: 2014,
        description: "The story of a blind French girl and a German boy whose paths collide in occupied France during World War II, exploring human connection and the invisible ways people try to be good to one another.",
        bookImage: "https://m.media-amazon.com/images/I/81WY6M9XikL._UF1000,1000_QL80_.jpg",
        tag: ["Historical Fiction", "Fiction", "Classics"]
    },
    {
        author_id: 44,
        title: "The Seven Husbands of Evelyn Hugo",
        page: 400,
        isbn: "978-1501161933",
        publishedYear: 2017,
        description: "A reclusive Old Hollywood movie icon decides to tell her life story to an unknown magazine reporter, revealing a scandalous and heartbreaking tale of ambition, friendship, and forbidden love.",
        bookImage: "https://m.media-amazon.com/images/I/71pIEVU3EeL.jpg",
        tag: ["Historical Fiction", "Fiction", "Romance", "Contemporary"]
    },
    {
        author_id: 49,
        title: "On Earth We're Briefly Gorgeous",
        page: 256,
        isbn: "978-0525562023",
        publishedYear: 2019,
        description: "A son's letter to his illiterate mother, this novel is a shattering portrait of a family, a first love, and the redemptive power of storytelling, exploring class, race, and masculinity.",
        bookImage: "https://m.media-amazon.com/images/I/81sSWzjCftL._UF1000,1000_QL80_.jpg",
        tag: ["Fiction", "Contemporary", "Gay and Lesbian", "Poetry"]
    },
    {
        author_id: 55,
        title: "The Alchemist",
        page: 208,
        isbn: "978-0062315007",
        publishedYear: 1988,
        description: "A mystical story of Santiago, an Andalusian shepherd boy who journeys to the Egyptian pyramids in search of a treasure. His quest becomes a powerful tale of self-discovery and listening to one's heart.",
        bookImage: "https://m.media-amazon.com/images/I/71+2-t7M35L.jpg",
        tag: ["Fiction", "Classics", "Philosophy", "Fantasy"]
    },
    {
        author_id: 59,
        title: "Kafka on the Shore",
        page: 505,
        isbn: "978-1400079278",
        publishedYear: 2002,
        description: "A surreal, metaphysical epic that follows two distinct but related plots. One is a teenage boy running away from home, the other an old man who can talk to cats, their fates intertwining.",
        bookImage: "https://m.media-amazon.com/images/I/81tdbrewW0L.jpg",
        tag: ["Fiction", "Fantasy", "Magical Realism", "Contemporary"]
    },
    {
        author_id: 42,
        title: "Red, White & Royal Blue",
        page: 432,
        isbn: "978-1250316776",
        publishedYear: 2019,
        description: "America's First Son falls into a secret romance with a British prince. What begins as a staged friendship for PR soon blossoms into something deeper, with international political implications.",
        bookImage: "https://m.media-amazon.com/images/I/71skR7IaVEL.jpg",
        tag: ["Romance", "Contemporary", "Gay and Lesbian", "Chick Lit"]
    },
    {
        author_id: 10,
        title: "The Love Hypothesis",
        page: 384,
        isbn: "978-0593336823",
        publishedYear: 2021,
        description: "A PhD candidate fakes a relationship with a notoriously difficult professor to convince her friends she's dating. The experiment spirals into a real exploration of attraction and vulnerability.",
        bookImage: "https://m.media-amazon.com/images/I/71QDhHvv7wL._UF1000,1000_QL80_.jpg",
        tag: ["Romance", "Contemporary", "Fiction", "Humor and Comedy"]
    },
    {
        author_id: 4,
        title: "Book Lovers",
        page: 384,
        isbn: "978-0593334836",
        publishedYear: 2022,
        description: "A literary agent who is no one's idea of a heroine and a brooding book editor find themselves in a real-life trope-filled romance when they keep meeting in a small town.",
        bookImage: "https://m.media-amazon.com/images/I/71Xy4AL7jKL._UF1000,1000_QL80_.jpg",
        tag: ["Romance", "Contemporary", "Fiction", "Chick Lit"]
    },
    {
        author_id: 45,
        title: "The Hunger Games",
        page: 374,
        isbn: "978-0439023528",
        publishedYear: 2008,
        description: "In a dystopian nation, a teenage girl volunteers to take her younger sister's place in a televised fight to the death. She must navigate alliances, survival, and a brutal political landscape.",
        bookImage: "https://m.media-amazon.com/images/I/71un2hI4mcL.jpg",
        tag: ["Young Adult", "Science Fiction", "Dystopian", "Fiction"]
    },
    {
        author_id: 60,
        title: "The Hate U Give",
        page: 464,
        isbn: "978-0062498533",
        publishedYear: 2017,
        description: "A teenage girl witnesses the fatal police shooting of her childhood best friend. She finds herself torn between her poor, mostly black neighborhood and her wealthy, mostly white prep school as she finds her voice.",
        bookImage: "https://m.media-amazon.com/images/I/71DZv5+s67L.jpg",
        tag: ["Young Adult", "Contemporary", "Fiction"]
    },
    {
        author_id: 61,
        title: "Harry Potter and the Sorcerer's Stone",
        page: 309,
        isbn: "978-0590353427",
        publishedYear: 1997,
        description: "An orphaned boy discovers on his eleventh birthday that he is a wizard. Whisked away to a magical boarding school, he uncovers the truth about his parents' deaths and his own destiny.",
        bookImage: "https://m.media-amazon.com/images/I/819GoteowlL._UF1000,1000_QL80_.jpg",
        tag: ["Fantasy", "Young Adult", "Fiction", "Classics"]
    },
    {
        author_id: 15,
        title: "Verity",
        page: 336,
        isbn: "978-1538724736",
        publishedYear: 2018,
        description: "A struggling writer accepts a job to finish the book series of an injured bestselling author. She uncovers the author's horrifying, unfinished autobiography, which details a chilling version of her life.",
        bookImage: "https://m.media-amazon.com/images/I/81A7EtrGHRL._UF1000,1000_QL80_.jpg",
        tag: ["Thriller", "Romance", "Suspense", "Fiction"]
    },
    {
        author_id: 44,
        title: "Daisy Jones & The Six",
        page: 368,
        isbn: "978-1524798925",
        publishedYear: 2019,
        description: "Chronicled in an oral-history format, this novel tells the story of the whirlwind rise and fall of a fictional 1970s rock band, exploring the passion and conflict behind their music.",
        bookImage: "https://m.media-amazon.com/images/I/81cxxjQd57L.jpg",
        tag: ["Historical Fiction", "Fiction", "Music", "Contemporary"]
    },
    {
        author_id: 1,
        title: "Babel: An Arcane History",
        page: 560,
        isbn: "978-0063021423",
        publishedYear: 2022,
        description: "A Chinese orphan is brought to England to study at Oxford's translation institute, Babel. He discovers that the magic of silver-working that powers the empire is fueled by colonialism and exploitation.",
        bookImage: "https://m.media-amazon.com/images/I/91sU6Iw-0BL._UF1000,1000_QL80_.jpg",
        tag: ["Fantasy", "Historical Fiction", "Fiction"]
    },
    {
        author_id: 8,
        title: "Fairy Tale",
        page: 608,
        isbn: "978-1668002175",
        publishedYear: 2022,
        description: "A seventeen-year-old boy inherits keys to a parallel world where good and evil are at war. He must lead the fight against a great evil to save this other world and, possibly, our own.",
        bookImage: "https://m.media-amazon.com/images/I/81blQfKsLtL.jpg",
        tag: ["Fantasy", "Horror", "Thriller", "Fiction"]
    },
    {
        author_id: 18,
        title: "The Nightingale",
        page: 440,
        isbn: "978-0312577223",
        publishedYear: 2015,
        description: "Two sisters in occupied France during WWII navigate the war in different ways. One joins the Resistance, while the other protects her family at home, both displaying immense courage.",
        bookImage: "https://m.media-amazon.com/images/I/8151hnV9SrL._UF1000,1000_QL80_.jpg",
        tag: ["Historical Fiction", "Fiction"]
    },
    {
        author_id: 22,
        title: "Killers of the Flower Moon",
        page: 416,
        isbn: "978-0385544955",
        publishedYear: 2017,
        description: "The true story of the Osage Nation murders in the 1920s, after oil was discovered on their land. The investigation that followed marked the birth of the FBI and uncovered a vast conspiracy.",
        bookImage: "https://m.media-amazon.com/images/I/819bD-wfwoL.jpg",
        tag: ["History", "Nonfiction", "Crime", "Biography"]
    },
    {
        author_id: 26,
        title: "Steve Jobs",
        page: 656,
        isbn: "978-1451648539",
        publishedYear: 2011,
        description: "The definitive biography of Apple's co-founder, based on over forty interviews with Jobs himself. It's an unflinching look at a creative genius whose passions drove the digital revolution.",
        bookImage: "https://m.media-amazon.com/images/I/71sVQDj0SCL.jpg",
        tag: ["Biography", "Business", "Nonfiction", "Technology"]
    },
    {
        author_id: 36,
        title: "The Martian",
        page: 384,
        isbn: "978-0804139021",
        publishedYear: 2011,
        description: "An astronaut is presumed dead and left behind on Mars. He must use his ingenuity to survive on a hostile planet and find a way to signal to Earth that he is still alive.",
        bookImage: "https://m.media-amazon.com/images/I/810W+zAp2DL._UF1000,1000_QL80_.jpg",
        tag: ["Science Fiction", "Fiction", "Thriller"]
    },
    {
        author_id: 40,
        title: "The Song of Achilles",
        page: 416,
        isbn: "978-0062060624",
        publishedYear: 2011,
        description: "A breathtakingly original retelling of the Trojan War and the legendary love between Achilles and Patroclus. It's a tale of gods, kings, and the devastating consequences of war.",
        bookImage: "https://m.media-amazon.com/images/I/81msb6gUBTL.jpg",
        tag: ["Historical Fiction", "Fantasy", "Romance", "Gay and Lesbian"]
    },
    {
        author_id: 51,
        title: "The Gifts of Imperfection",
        page: 160,
        isbn: "978-1592858491",
        publishedYear: 2010,
        description: "A guide to wholehearted living, this book presents ten guideposts on the power of embracing your flaws. It’s a call to cultivate the courage, compassion, and connection to live a fulfilling life.",
        bookImage: "https://m.media-amazon.com/images/I/71I4yv9v+LL._UF1000,1000_QL80_.jpg",
        tag: ["Self Help", "Psychology", "Nonfiction", "Spirituality"]
    },
    {
        author_id: 61,
        title: "The Ink Black Heart",
        page: 1024,
        isbn: "978-0316413039",
        publishedYear: 2022,
        description: "Private detectives Cormoran Strike and Robin Ellacott investigate the murder of a cartoon creator who was being persecuted by an online troll. They dive into the dark world of internet fandom and obsession.",
        bookImage: "https://m.media-amazon.com/images/I/A1Pt49HukQL._UF1000,1000_QL80_.jpg",
        tag: ["Crime", "Mystery", "Thriller", "Fiction"]
    },
    {
        author_id: 13,
        title: "Dear Edward",
        page: 352,
        isbn: "978-0593188989",
        publishedYear: 2020,
        description: "A 12-year-old boy is the sole survivor of a plane crash that kills his entire family. The story follows his journey of healing and finding his place in a world forever changed by tragedy.",
        bookImage: "https://m.media-amazon.com/images/I/814helrpQJL.jpg",
        tag: ["Fiction", "Contemporary", "Young Adult"]
    },
    {
        author_id: 31,
        title: "The Maidens",
        page: 352,
        isbn: "978-1250173669",
        publishedYear: 2021,
        description: "A group therapist becomes convinced that a charismatic classics professor at Cambridge is a murderer after a student is found dead. Her obsession to prove his guilt puts her in grave danger.",
        bookImage: "https://m.media-amazon.com/images/I/81K05pTbJUL._UF1000,1000_QL80_.jpg",
        tag: ["Thriller", "Mystery", "Suspense"]
    },
    {
        author_id: 44,
        title: "Malibu Rising",
        page: 384,
        isbn: "978-1524798628",
        publishedYear: 2021,
        description: "Over the course of one night at an epic end-of-summer party, the secrets of four famous siblings—children of a legendary singer—come to the surface, leading to a life-altering fire.",
        bookImage: "https://m.media-amazon.com/images/I/81vtfglyzsL.jpg",
        tag: ["Historical Fiction", "Fiction", "Contemporary"]
    },
    {
        author_id: 34,
        title: "Everything I Never Told You",
        page: 304,
        isbn: "978-0143127550",
        publishedYear: 2014,
        description: "A profound novel about a mixed-race Chinese-American family in 1970s Ohio. The mysterious death of their favorite daughter unravels the long-held secrets and pressures that have shaped them.",
        bookImage: "https://m.media-amazon.com/images/I/81MDdbYh-8L.jpg",
        tag: ["Fiction", "Mystery", "Contemporary", "Historical Fiction"]
    },
    {
        author_id: 57,
        title: "The Remains of the Day",
        page: 256,
        isbn: "978-0679731726",
        publishedYear: 1989,
        description: "A butler reflects on his life of service to an English lord in the years leading up to WWII. It's a poignant exploration of memory, duty, and the painful consequences of unwavering loyalty.",
        bookImage: "https://m.media-amazon.com/images/I/71+HFMIHZeL.jpg",
        tag: ["Fiction", "Classics", "Historical Fiction"]
    },
    {
        author_id: 56,
        title: "The Ocean at the End of the Lane",
        page: 192,
        isbn: "978-0062255655",
        publishedYear: 2013,
        description: "A middle-aged man returns to his childhood home and remembers a series of fantastical and terrifying events from his youth, involving a strange girl and ancient forces that threatened his world.",
        bookImage: "https://m.media-amazon.com/images/I/91q+Aa0wIvL._UF1000,1000_QL80_.jpg",
        tag: ["Fantasy", "Fiction", "Horror"]
    },
    {
        author_id: 8,
        title: "The Stand",
        page: 1153,
        isbn: "978-0307947307",
        publishedYear: 1978,
        description: "A super-flu pandemic wipes out most of the world's population, leaving the survivors to choose sides in an elemental struggle between good and evil, led by two charismatic figures.",
        bookImage: "https://m.media-amazon.com/images/I/71-Hcgk9ErL._UF1000,1000_QL80_.jpg",
        tag: ["Horror", "Fantasy", "Science Fiction", "Thriller"]
    },
    {
        author_id: 45,
        title: "The Ballad of Songbirds and Snakes",
        page: 528,
        isbn: "978-0735265431",
        publishedYear: 2020,
        description: "A prequel to The Hunger Games, this novel follows a young Coriolanus Snow as he mentors a tribute from District 12, revealing the origins of his tyranny and the darkness within Panem.",
        bookImage: "https://m.media-amazon.com/images/I/819tY-gDcWL.jpg",
        tag: ["Young Adult", "Science Fiction", "Dystopian", "Fiction"]
    },
    {
        author_id: 15,
        title: "Ugly Love",
        page: 336,
        isbn: "978-1476753188",
        publishedYear: 2014,
        description: "An airline pilot and a nursing student enter a no-strings-attached arrangement. Their simple rules—never ask about the past, don't expect a future—get complicated when real emotions emerge.",
        bookImage: "https://m.media-amazon.com/images/I/71E8VNPC1dL.jpg",
        tag: ["Romance", "Contemporary", "Fiction"]
    },
    {
        author_id: 53,
        title: "Throne of Glass",
        page: 432,
        isbn: "978-1619630345",
        publishedYear: 2012,
        description: "A deadly assassin is freed from slavery to compete for the king's favor and become his champion. She must survive brutal contests while uncovering a dark conspiracy within the castle.",
        bookImage: "https://m.media-amazon.com/images/I/81DW1r3CIwL._UF1000,1000_QL80_.jpg",
        tag: ["Fantasy", "Young Adult", "Romance", "Fiction"]
    },
    {
        author_id: 42,
        title: "One Last Stop",
        page: 432,
        isbn: "978-1250244499",
        publishedYear: 2021,
        description: "A cynical college student finds her subway commute transformed when she meets a mysterious, charming girl who is literally displaced in time from the 1970s, and must figure out how to help her.",
        bookImage: "https://m.media-amazon.com/images/I/7125eYIFBxL._UF1000,1000_QL80_.jpg",
        tag: ["Romance", "Gay and Lesbian", "Fantasy", "Contemporary"]
    },
    {
        author_id: 43,
        title: "The Man Who Died Twice",
        page: 432,
        isbn: "978-1984880994",
        publishedYear: 2021,
        description: "The Thursday Murder Club returns when an old friend with a dangerous past asks for their help. They are soon entangled in a world of stolen diamonds, international mobsters, and murder.",
        bookImage: "https://m.media-amazon.com/images/I/71ZvpyRv3VL._UF1000,1000_QL80_.jpg",
        tag: ["Mystery", "Crime", "Fiction", "Humor and Comedy"]
    },
    {
        author_id: 38,
        title: "Homo Deus: A Brief History of Tomorrow",
        page: 464,
        isbn: "978-0062474339",
        publishedYear: 2015,
        description: "Harari explores the future of humanity, examining the projects, dreams, and nightmares that will shape the 21st century—from overcoming death to creating artificial life and achieving godlike powers.",
        bookImage: "https://m.media-amazon.com/images/I/71KBDP3mDfL.jpg",
        tag: ["Nonfiction", "Science", "Philosophy", "History"]
    },
    {
        author_id: 30,
        title: "The Creative Act: A Way of Being",
        page: 432,
        isbn: "978-0593652882",
        publishedYear: 2023,
        description: "Rick Rubin shares his philosophy and creative process, offering a practical guide that makes artistic creation accessible to everyone by blending deep insight with actionable advice.",
        bookImage: "https://m.media-amazon.com/images/I/918EkrTDaRL.jpg",
        tag: ["Self Help", "Philosophy", "Art", "Nonfiction"]
    },
    {
        author_id: 7,
        title: "The House in the Cerulean Sea",
        page: 394,
        isbn: "978-1250217288",
        publishedYear: 2020,
        description: "A prim case worker is sent to an orphanage for magical children to determine if they are dangerous. He finds an unlikely family and discovers that home can be found in the most unexpected places.",
        bookImage: "https://m.media-amazon.com/images/I/81MnY8Q7OLL._UF1000,1000_QL80_.jpg",
        tag: ["Fantasy", "Gay and Lesbian", "Romance", "Fiction"]
    },
    {
        author_id: 9,
        title: "A River Enchanted",
        page: 480,
        isbn: "978-0063056128",
        publishedYear: 2022,
        description: "A musician returns to his magical island home to solve the mystery of missing girls. He must team up with his childhood rival, using music and old magic to confront an ancient spirit.",
        bookImage: "https://m.media-amazon.com/images/I/81hSiJ-cZkL._UF1000,1000_QL80_.jpg",
        tag: ["Fantasy", "Romance", "Mystery", "Fiction"]
    },
    {
        author_id: 16,
        title: "The Storied Life of A.J. Fikry",
        page: 288,
        isbn: "978-1616204518",
        publishedYear: 2014,
        description: "A grumpy, widowed bookstore owner's life is transformed by the arrival of a mysterious package. This charming novel celebrates books, human connection, and the power of second chances.",
        bookImage: "https://m.media-amazon.com/images/I/91kiqmZBJML.jpg",
        tag: ["Fiction", "Contemporary", "Romance"]
    },
    {
        author_id: 59,
        title: "Norwegian Wood",
        page: 296,
        isbn: "978-0375704024",
        publishedYear: 1987,
        description: "A nostalgic story of loss and burgeoning sexuality. A young man's relationships with two very different women force him to confront his past and choose between passion and stability.",
        bookImage: "https://m.media-amazon.com/images/I/81zqVhvbHbL.jpg",
        tag: ["Fiction", "Contemporary", "Classics", "Romance"]
    },
    {
        author_id: 47,
        title: "The Lord of the Rings",
        page: 1216,
        isbn: "978-0618640157",
        publishedYear: 1954,
        description: "A hobbit named Frodo Baggins inherits a powerful, dark ring and must embark on a perilous quest across Middle-earth to destroy it, facing overwhelming evil and forging unbreakable bonds.",
        bookImage: "https://m.media-amazon.com/images/I/81y6vNgQTgL._UF350,350_QL50_.jpg",
        tag: ["Fantasy", "Classics", "Fiction"]
    },
    {
        author_id: 29,
        title: "The Stranger in the Woods",
        page: 224,
        isbn: "978-1101875681",
        publishedYear: 2017,
        description: "The true story of Christopher Knight, a man who lived alone in the Maine woods for 27 years without any human contact. It's a gripping exploration of solitude, community, and what it means to be human.",
        bookImage: "https://m.media-amazon.com/images/I/91kKzqT8ziL._UF1000,1000_QL80_.jpg",
        tag: ["Nonfiction", "Biography", "Psychology"]
    },
    {
        author_id: 20,
        title: "Evicted: Poverty and Profit in the American City",
        page: 432,
        isbn: "978-0553447453",
        publishedYear: 2016,
        description: "A searing ethnographic study of eight families in Milwaukee swept up in the eviction crisis. Desmond provides a powerful, ground-level view of poverty in America and its devastating consequences.",
        bookImage: "https://m.media-amazon.com/images/I/71XdUWOYKDL.jpg",
        tag: ["Nonfiction", "Sociology", "History", "Business"]
    },
    {
        author_id: 19,
        title: "Cutting for Stone",
        page: 688,
        isbn: "978-0375705021",
        publishedYear: 2009,
        description: "An epic story of twin brothers born in Ethiopia, orphaned by their mother's death and abandoned by their father. Bound by a shared love for medicine, their lives diverge and converge across continents.",
        bookImage: "https://m.media-amazon.com/images/I/91RLhQ5C2DL.jpg",
        tag: ["Fiction", "Historical Fiction", "Contemporary"]
    },
    {
        author_id: 6,
        title: "Ninth House",
        page: 480,
        isbn: "978-1250313072",
        publishedYear: 2019,
        description: "A high school dropout with the ability to see ghosts is given a full scholarship to Yale. Her task is to monitor the secret societies of the elite, uncovering a world of dark magic and murder.",
        bookImage: "https://m.media-amazon.com/images/I/81pqCEtTAgL._UF1000,1000_QL80_.jpg",
        tag: ["Fantasy", "Horror", "Mystery", "Thriller"]
    },
    {
        author_id: 4,
        title: "People We Meet on Vacation",
        page: 384,
        isbn: "978-1984806758",
        publishedYear: 2021,
        description: "Two best friends with nothing in common except their annual summer vacation trip have a falling out. Years later, they decide to take one last trip to see if they can fix everything.",
        bookImage: "https://m.media-amazon.com/images/I/71HADF3dRUL._UF1000,1000_QL80_.jpg",
        tag: ["Romance", "Contemporary", "Chick Lit", "Fiction"]
    },
    {
        author_id: 14,
        title: "Lessons in Chemistry",
        page: 400,
        isbn: "978-0385547345",
        publishedYear: 2022,
        description: "A brilliant female chemist in the 1960s is forced out of her field. She accepts a job hosting a cooking show, using her platform to teach science and challenge sexist norms with unexpected results.",
        bookImage: "https://m.media-amazon.com/images/I/71dQACXhz6L.jpg",
        tag: ["Historical Fiction", "Fiction", "Humor and Comedy"]
    },
    {
        author_id: 52,
        title: "Dark Places",
        page: 368,
        isbn: "978-0307341570",
        publishedYear: 2009,
        description: "A woman who survived the brutal murder of her family as a child is forced to confront her past when a secret society obsessed with notorious crimes contacts her for information.",
        bookImage: "https://m.media-amazon.com/images/I/81-tFgQtHxL.jpg",
        tag: ["Thriller", "Mystery", "Crime", "Fiction"]
    },
    {
        author_id: 41,
        title: "Cloud Cuckoo Land",
        page: 640,
        isbn: "978-1476746562",
        publishedYear: 2021,
        description: "An ancient Greek story connects the lives of five characters across time: an orphan in 15th-century Constantinople, a modern-day boy in Idaho, and a girl on an interstellar ship in the future.",
        bookImage: "https://m.media-amazon.com/images/I/81Go8gn1LGL.jpg",
        tag: ["Historical Fiction", "Science Fiction", "Fiction"]
    },
    {
        author_id: 3,
        title: "Never Lie",
        page: 400,
        isbn: "978-1542036735",
        publishedYear: 2022,
        description: "A newlywed couple gets snowed in at a remote manor that was once home to a famous psychiatrist who vanished. The wife discovers hidden tapes from the doctor's sessions, revealing a dark history.",
        bookImage: "https://m.media-amazon.com/images/I/8196x-1wIOL._UF1000,1000_QL80_.jpg",
        tag: ["Thriller", "Suspense", "Mystery", "Crime"]
    },

    {
        author_id: 11,
        title: "Deacon King Kong",
        page: 384,
        isbn: "978-0735216723",
        publishedYear: 2020,
        description: "In a 1960s Brooklyn housing project, a grumpy old church deacon shoots a notorious drug dealer. The event sets off a chain reaction, revealing the interconnected lives of the community's residents.",
        bookImage: "https://m.media-amazon.com/images/I/81YigpTZ+VL.jpg",
        tag: ["Historical Fiction", "Fiction", "Crime", "Humor and Comedy"]
    },
    {
        author_id: 25,
        title: "The Devil in the White City",
        page: 447,
        isbn: "978-0375725609",
        publishedYear: 2003,
        description: "A non-fiction narrative that interweaves the true tales of the brilliant architect behind the 1893 Chicago World's Fair and a cunning serial killer who used the fair to lure his victims to their deaths.",
        bookImage: "https://m.media-amazon.com/images/I/81Zrtd8NRoL._UF1000,1000_QL80_.jpg",
        tag: ["History", "Nonfiction", "Crime", "Biography"]
    },

    {
        author_id: 17,
        title: "The Sun and the Star",
        page: 480,
        isbn: "978-1368096928",
        publishedYear: 2023,
        description: "Nico di Angelo and Will Solace journey into the depths of Tartarus to rescue an old friend. This thrilling quest tests their relationship and forces them to confront their inner demons.",
        bookImage: "https://m.media-amazon.com/images/I/81FEUvR+NnL.jpg",
        tag: ["Fantasy", "Young Adult", "Gay and Lesbian"]
    },
    {
        author_id: 2,
        title: "Weyward",
        page: 336,
        isbn: "978-1250285652",
        publishedYear: 2023,
        description: "Weaving together the stories of three women across five centuries, this novel explores their connection to the natural world and a secret legacy of female power and resilience against patriarchy.",
        bookImage: "https://m.media-amazon.com/images/I/91qCWeahwpL.jpg",
        tag: ["Historical Fiction", "Fantasy", "Fiction"]
    },
    {
        author_id: 54,
        title: "A Darker Shade of Magic",
        page: 416,
        isbn: "978-0765376466",
        publishedYear: 2015,
        description: "A magician who can travel between parallel Londons—Red, Grey, White, and the lost Black—smuggles artifacts across worlds. His dangerous hobby leads him to a thief and a deadly conspiracy.",
        bookImage: "https://m.media-amazon.com/images/I/91Is3oizclL.jpg",
        tag: ["Fantasy", "Fiction", "Young Adult"]
    },
    {
        author_id: 35,
        title: "How to Stop Time",
        page: 352,
        isbn: "978-0525522874",
        publishedYear: 2017,
        description: "A man who looks 41 but was born centuries ago has a rare condition that causes him to age slowly. He's lived through history, but the one rule is to never fall in love. A rule he's about to break.",
        bookImage: "https://m.media-amazon.com/images/I/71lyw7iDC8L._UF1000,1000_QL80_.jpg",
        tag: ["Fiction", "Fantasy", "Historical Fiction", "Romance"]
    },
    {
        author_id: 10,
        title: "Love on the Brain",
        page: 368,
        isbn: "978-0593336847",
        publishedYear: 2022,
        description: "A neuroscientist is forced to co-lead a project with her work nemesis, a brilliant but aloof engineer. As they collaborate, she discovers there's more to him than his cold exterior suggests.",
        bookImage: "https://m.media-amazon.com/images/I/71ZCpKii3JL.jpg",
        tag: ["Romance", "Contemporary", "Fiction", "Humor and Comedy"]
    },
    {
        author_id: 8,
        title: "It",
        page: 1168,
        isbn: "978-1501175466",
        publishedYear: 1986,
        description: "Seven children in a small town are terrorized by an evil entity that preys on their deepest fears. Decades later, as adults, they must return to confront the creature once and for all.",
        bookImage: "https://m.media-amazon.com/images/I/71I9hVz4IKL.jpg",
        tag: ["Horror", "Thriller", "Fantasy", "Fiction"]
    }
];

function createRealisticRating() {
    const fiveStarCount = faker.number.int({ min: 5, max: 1000 });
    const fourStarCount = faker.number.int({ min: 5, max: 800 });
    const threeStarCount = faker.number.int({ min: 2, max: 500 });
    const twoStarCount = faker.number.int({ min: 1, max: 100 });
    const oneStarCount = faker.number.int({ min: 0, max: 50 });

    const ratingCount = fiveStarCount + fourStarCount + threeStarCount + twoStarCount + oneStarCount;
    const totalScore = (5 * fiveStarCount) + (4 * fourStarCount) + (3 * threeStarCount) + (2 * twoStarCount) + (1 * oneStarCount);
    const averageRating = ratingCount > 0 ? parseFloat((totalScore / ratingCount).toFixed(2)) : 0;

    return {
        oneStarCount,
        twoStarCount,
        threeStarCount,
        fourStarCount,
        fiveStarCount,
        ratingCount,
        averageRating
    };
}


/**
 * ฟังก์ชันหลักในการ Seed ข้อมูลทั้งหมด
 */
async function main() {
    console.log("🌱 Starting the seeding process...");

    // --- 🧹 STEP 1: ล้างข้อมูลเก่า (เรียงจากตารางที่ залежить มากที่สุด) ---
    console.log("🗑️  Clearing previous data...");
    await prisma.bookTag.deleteMany();
    await prisma.edition.deleteMany();
    await prisma.book.deleteMany();
    await prisma.author.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();
    console.log("✅ Previous data cleared.");

    // --- 🧑‍💻 STEP 2: สร้างข้อมูล User ---
    console.log(`🧑‍💻 Seeding ${userData.length} users...`);
    await prisma.user.createMany({
        data: userData,
        skipDuplicates: true,
    });
    console.log("✅ Users seeded.");

    // --- 🏷️ STEP 3: สร้างข้อมูล Tag ---
    console.log(`🏷️  Seeding ${tagData.length} tags...`);
    await prisma.tag.createMany({
        data: tagData,
        skipDuplicates: true,
    });
    console.log("✅ Tags seeded.");

    // --- 🧑‍🎨 STEP 4: สร้างข้อมูล Author ---
    // --- 🧑‍🎨 STEP 4: สร้างข้อมูล Author (ฉบับแก้ไข) ---
    console.log(`🧑‍🎨 Seeding ${authors.length} authors...`);
    const authorMap = new Map();
    for (const author of authors) {
        const newAuthor = await prisma.author.create({
            data: {
                name: author.name,
                bio: author.bio,
                profileImage: author.profileImage,
            },
        });
        // ✅ แก้ไขให้เก็บ object ที่มีทั้ง id และ name
        authorMap.set(author.author_id, { id: newAuthor.id, name: newAuthor.name });
    }
    console.log("✅ Authors seeded and mapped.");

    // --- 📚 STEP 5: สร้างข้อมูล Book พร้อมเชื่อมความสัมพันธ์ ---
    // สร้าง Map สำหรับ Tags เพื่อใช้อ้างอิง ID
    const allTags = await prisma.tag.findMany();
    const tagMap = new Map(allTags.map(tag => [tag.name, tag.id]));

    console.log(`📚 Seeding ${books.length} books with relations...`);
    for (const book of books) {
        let rating = createRealisticRating()
    // ดึง object ของนักเขียนออกมา
    const authorInfo = authorMap.get(book.author_id); 
    
    if (!authorInfo) {
        console.warn(`⚠️  Author with original id ${book.author_id} not found for book "${book.title}". Skipping.`);
        continue;
    }
    
    // แยก id และ name ออกมาใช้งาน
    const authorId = authorInfo.id;
    const authorName = authorInfo.name;

        const searchKey = book.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        await prisma.book.create({
            data: {
                title: book.title,
                searchKey: `${book.title}|${book.description}|${authorName}|${book.isbn}|${book.page}|${book.publishedYear}`,
                description: book.description,
                authorId: authorId,
                oneStarCount: rating.oneStarCount,
                twoStarCount: rating.twoStarCount,
                threeStarCount: rating.threeStarCount,
                fourStarCount: rating.fourStarCount,
                fiveStarCount: rating.fiveStarCount,
                ratingCount: rating.ratingCount,
                averageRating: rating.averageRating,
                edition: {
                    create: {
                        pages: book.page,
                        coverImage: book.bookImage,
                        isLatest: true,
                        publishedYear: book.publishedYear,
                        isbn: book.isbn
                    },
                },
                bookTag: {
                    create: book.tag
                        .map(tagName => {
                            const tagId = tagMap.get(tagName);
                            if (!tagId) return null; // ถ้าไม่เจอ Tag ใน Map ให้ข้ามไป
                            return {
                                tag: { connect: { id: tagId } },
                            };
                        })
                        .filter(Boolean), // กรองค่า null ออก
                },
            },
        });
    }
    console.log("✅ Books seeded.");
}

// --- 🚀 รันสคริปต์ ---
main()
    .then(() => {
        console.log("🎉 Seeding completed successfully!");
    })
    .catch((e) => {
        console.error("❌ An error occurred during seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });