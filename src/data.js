const image = (relativePath) => new URL(`../assets/${relativePath}`, import.meta.url).href;

export const brand = {
  title: 'Shree Gujarati Samaj School',
  subtitle: 'Indore',
  logo: image('logo.png'),
  tagline: 'Affordable, heritage-rich education for every Gujarati family in Indore.',
  description:
    'A landmark school with a history of community service, full facilities, and holistic student growth across academics, sports and culture.',
  phone: '0731-2706468',
  altPhone: '2703447',
  email: 'sgsindore@hotmail.com',
  address: '1, Nasiya Road, Indore, M.P., India',
};

export const hero = {
  background: image('gallery1.jpg'),
  logo: image('logo.png'),
  stats: [
    { value: '1500+', label: 'Students currently enrolled' },
    { value: '55+', label: 'Experienced teaching staff' },
    { value: '1957', label: 'Heritage since' },
    { value: '24 years', label: 'Free summer sports camp' },
  ],
};

export const benefits = [
  {
    title: 'Affordable full-service education',
    description:
      'Low fees with outstanding facilities, nutritious snacks and transportation across Indore.',
  },
  {
    title: 'CBSE-aligned KG classrooms',
    description:
      'Structured early years learning with modern classrooms designed for young minds.',
  },
  {
    title: 'Free weekly nutritious snacks',
    description:
      'Nursery to grade 5 students receive healthy midweek snacks to support focused learning.',
  },
  {
    title: 'Free summer sports & activity camp',
    description:
      '24 years of free summer coaching, athletics, and team-building for school children.',
  },
  {
    title: 'City-wide bus service',
    description:
      'Convenient and affordable transport available across Indore for every student.',
  },
  {
    title: 'Montessori-trained faculty',
    description:
      'Most academic staff hold postgraduate and B.Ed Montessori qualifications for stronger learning outcomes.',
  },
];

export const about = {
  title: 'A timeless Gujarati foundation for modern education',
  paragraphs: [
    'Shree Gujarati Samaj School has been a community pillar since 1957. It began with just seven students on Jail Road and has grown into one of Indore’s most trusted schools through dedication, disciplined teaching and strong Gujarati cultural roots.',
    'The school was founded with the generous support of Shri Manilal Parikh and his wife Smt. Chanchalben Parikh. Their belief in education and community service created a learning environment that continues to nurture responsible young citizens.',
  ],
  image: image('gallery4.jpeg'),
};

export const academic = {
  title: 'Academic excellence through active learning',
  description:
    'We balance strong classroom learning with clubs, sports and practical skills so every student grows with confidence, discipline and creativity.',
  highlights: [
    'Free summer sports camp for every student',
    'CBSE-aligned KG curriculum and early learning support',
    'Holistic activities in craft, music, computer science and culture',
    'Regular training in skating, badminton, chess and table tennis',
  ],
};

export const facilities = [
  {
    title: 'Fully equipped classrooms',
    description:
      'CBSE pattern KG sections and classrooms designed to encourage early academic curiosity.',
    image: image('gallery6.jpg'),
  },
  {
    title: 'Cultural celebration spaces',
    description:
      'Regular events and performances that keep Gujarati values alive through music, dance and festivals.',
    image: image('gallery5.jpeg'),
  },
  {
    title: 'Play zone for pre-primary learners',
    description:
      'Safe, playful spaces for younger students to explore and build confidence every day.',
    image: image('gallery7.jpg'),
  },
  {
    title: 'Nutritious midweek snacks',
    description:
      'Thursday snacks for nursery through grade 5 ensure healthy growth and better concentration.',
    image: image('gallery8.jpg'),
  },
  {
    title: 'Transport across Indore',
    description:
      'Affordable bus connectivity to the school from multiple city locations.',
    image: image('gallery9.jpg'),
  },
  {
    title: 'Experienced faculty & staff',
    description:
      'A team of teachers and support staff committed to discipline, values and academic progress.',
    image: image('gallery3.jpeg'),
  },
];

export const studentLife = [
  {
    title: 'Cultural performances',
    image: image('gallery2.png'),
  },
  {
    title: 'Sports and teamwork',
    image: image('gallery7.jpg'),
  },
  {
    title: 'Creative events',
    image: image('gallery6.jpg'),
  },
  {
    title: 'Community celebrations',
    image: image('gallery1.jpg'),
  },
];

export const leadership = [
  {
    name: 'निधी मुंगी',
    role: 'Head Mistress',
    position: 'च. म. प. गुजराती प्राइमरी एव मिडिल स्कूल, इंदौर',
    image: image('img-team-2.png'),
    quote:
      'प्यारे बच्चो, हमें हमेशा आत्मविश्वास बनाए रखना है। हम अपने विद्यार्थियों को किसी भी विपरीत परिस्थितियों में कमजोर नहीं होने दें और उन्हें सशक्त राष्ट्र निर्माण की ओर प्रेरित करें।',
  },
  {
    name: 'कमलेशभाई',
    role: 'Chairman',
    position: 'च. म. प. गुजराती प्राइमरी एव मिडिल स्कूल, इंदौर',
    image: image('img-team.jpg'),
    quote:
      'आज का जीवन पूरी तरह तकनीकी हो चुका है। यदि शिक्षक छात्रों को मार्गदर्शित, संस्कारित और अनुशासित करें तो वे सफलता की ऊँचाइयों को प्राप्त करेंगे।',
  },
];

export const galleryImages = [
  image('gallery1.jpg'),
  image('gallery2.png'),
  image('gallery3.jpeg'),
  image('gallery4.jpeg'),
  image('gallery5.jpeg'),
  image('gallery6.jpg'),
  image('gallery7.jpg'),
  image('gallery8.jpg'),
  image('gallery9.jpg'),
  image('gallery10.jpg'),
  image('gallery11.jpg'),
  image('gallery12.jpg'),
];

export const admissions = {
  title: 'Admissions that welcome every family',
  description:
    'Start your child’s journey with a school that, community values, and a supportive environment for every learner.',
  steps: [
    {
      label: '01',
      title: 'Schedule a visit',
      description: 'See the campus and meet our admissions team in person.',
    },
    {
      label: '02',
      title: 'Discuss the program',
      description: 'Review classroom, transport, nutrition and fee details together.',
    },
    {
      label: '03',
      title: 'Enroll with confidence',
      description: 'Complete registration and begin the admissions process smoothly.',
    },
  ],
};

export const contact = {
  phone: '0731-2706468',
  altPhone: '2703447',
  email: 'sgsindore@hotmail.com',
  address: '1, Nasiya Road, Indore, M.P., India',
};

export const fallbackContent = {
  brand,
  hero,
  benefits,
  about,
  academic,
  facilities,
  studentLife,
  leadership,
  galleryImages,
  admissions,
  contact,
};
