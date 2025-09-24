export const flashcards = [
  { word: "犬 (いぬ)", meaning: "Dog - Con chó" },
  { word: "猫 (ねこ)", meaning: "Cat - Con mèo" },
  { word: "水 (みず)", meaning: "Water - Nước" },
  { word: "火 (ひ)", meaning: "Fire - Lửa" },
  { word: "山 (やま)", meaning: "Mountain - Núi" },
  { word: "川 (かわ)", meaning: "River - Dòng sông" },
  { word: "空 (そら)", meaning: "Sky - Bầu trời" },
  { word: "食べる (たべる)", meaning: "To eat - Ăn" },
  { word: "行く (いく)", meaning: "To go - Đi" },
  { word: "見る (みる)", meaning: "To see/watch - Nhìn/Xem" }
];
//
export const listeningChoiceMockData = [
  {
    id: 1,
    answer: "おはよう",
    question: { question: "Good morning in Japanese" },
    listionChoiceOptions: [
      { optionText: "おはよう", correct: true },
      { optionText: "こんにちは", correct: false },
      { optionText: "こんばんは", correct: false },
      { optionText: "さようなら", correct: false },
    ]
  },
  {
    id: 2,
    answer: "ありがとう",
    question: { question: "Thank you in Japanese" },
    listionChoiceOptions: [
      { optionText: "すみません", correct: false },
      { optionText: "ありがとう", correct: true },
      { optionText: "ごめんなさい", correct: false },
      { optionText: "いらっしゃいませ", correct: false },
    ]
  },
  {
    id: 3,
    answer: "水",
    question: { question: "Water in Japanese" },
    listionChoiceOptions: [
      { optionText: "お茶", correct: false },
      { optionText: "コーヒー", correct: false },
      { optionText: "水", correct: true },
      { optionText: "ジュース", correct: false },
    ]
  },
  {
    id: 4,
    answer: "学校",
    question: { question: "School in Japanese" },
    listionChoiceOptions: [
      { optionText: "病院", correct: false },
      { optionText: "学校", correct: true },
      { optionText: "会社", correct: false },
      { optionText: "図書館", correct: false },
    ]
  },
  {
    id: 5,
    answer: "友達",
    question: { question: "Friend in Japanese" },
    listionChoiceOptions: [
      { optionText: "先生", correct: false },
      { optionText: "家族", correct: false },
      { optionText: "友達", correct: true },
      { optionText: "学生", correct: false },
    ]
  }
];
// Mock data cho gap-fill quiz
export const gapFillMockData = [
  {
    question: "私は____が好きです。あなたは____が好きですか？",
    answers: [
      { answer: "りんご" },
      { answer: "みかん" }
    ],
    feedBack: "注意: Chủ đề thường đứng trước は."
  },
  {
    question: "これは____です。あれは____です。",
    answers: [
      { answer: "本" },
      { answer: "ノート" }
    ],
    feedBack: "注意: Đây/đó được phân biệt bằng これ và あれ."
  },
  {
    question: "____に行きますか？私は____に行きます。",
    answers: [
      { answer: "学校" },
      { answer: "会社" }
    ],
    feedBack: "注意: Trợ từ に chỉ nơi chốn hướng đến."
  },
  {
    question: "私は____を食べます。そして____を飲みます。",
    answers: [
      { answer: "パン" },
      { answer: "水" }
    ],
    feedBack: "注意: を dùng để chỉ tân ngữ trực tiếp của động từ."
  },
  {
    question: "今日は____です。明日は____です。",
    answers: [
      { answer: "雨" },
      { answer: "晴れ" }
    ],
    feedBack: "注意: Các từ chỉ thời tiết thường đứng một mình làm chủ ngữ."
  }
];
export const listeningQuizMockData = [
  {
    question: { id: 1, question: "犬は英語で何ですか？" },
    options: [
      { optionText: "Dog", correct: true },
      { optionText: "Cat", correct: false },
      { optionText: "Bird", correct: false },
      { optionText: "Fish", correct: false },
    ],
  },
  {
    question: { id: 2, question: "水は英語で何ですか？" },
    options: [
      { optionText: "Water", correct: true },
      { optionText: "Tea", correct: false },
      { optionText: "Juice", correct: false },
      { optionText: "Milk", correct: false },
    ],
  },
  {
    question: { id: 3, question: "日本の首都はどこですか？" },
    options: [
      { optionText: "Tokyo", correct: true },
      { optionText: "Osaka", correct: false },
      { optionText: "Kyoto", correct: false },
      { optionText: "Nagoya", correct: false },
    ],
  },
  {
    question: { id: 4, question: "りんごは英語で何ですか？" },
    options: [
      { optionText: "Apple", correct: true },
      { optionText: "Banana", correct: false },
      { optionText: "Orange", correct: false },
      { optionText: "Grape", correct: false },
    ],
  },
  {
    question: { id: 5, question: "車は英語で何ですか？" },
    options: [
      { optionText: "Car", correct: true },
      { optionText: "Bus", correct: false },
      { optionText: "Bike", correct: false },
      { optionText: "Train", correct: false },
    ],
  },
];
export const multipleQuizMockData = [
  {
    mcqId: 1,
    question: "犬は英語で何ですか？",
    mutipleChoiceOption: [
      { optionId: 1, optionText: "Dog", correct: true },
      { optionId: 2, optionText: "Cat", correct: false },
      { optionId: 3, optionText: "Bird", correct: false },
      { optionId: 4, optionText: "Fish", correct: false },
    ],
    feedBack: "犬 (いぬ) nghĩa là 'Dog'.",
  },
  {
    mcqId: 2,
    question: "水は英語で何ですか？",
    mutipleChoiceOption: [
      { optionId: 1, optionText: "Water", correct: true },
      { optionId: 2, optionText: "Juice", correct: false },
      { optionId: 3, optionText: "Tea", correct: false },
      { optionId: 4, optionText: "Milk", correct: false },
    ],
    feedBack: "水 (みず) = Water.",
  },
  {
    mcqId: 3,
    question: "日本の首都はどこですか？",
    mutipleChoiceOption: [
      { optionId: 1, optionText: "Tokyo", correct: true },
      { optionId: 2, optionText: "Osaka", correct: false },
      { optionId: 3, optionText: "Kyoto", correct: false },
      { optionId: 4, optionText: "Nagoya", correct: false },
    ],
    feedBack: "Tokyo là thủ đô của Nhật Bản.",
  },
  {
    mcqId: 4,
    question: "りんごは英語で何ですか？",
    mutipleChoiceOption: [
      { optionId: 1, optionText: "Apple", correct: true },
      { optionId: 2, optionText: "Orange", correct: false },
      { optionId: 3, optionText: "Banana", correct: false },
      { optionId: 4, optionText: "Grape", correct: false },
    ],
    feedBack: "りんご = Apple.",
  },
  {
    mcqId: 5,
    question: "車は英語で何ですか？",
    mutipleChoiceOption: [
      { optionId: 1, optionText: "Car", correct: true },
      { optionId: 2, optionText: "Bus", correct: false },
      { optionId: 3, optionText: "Bike", correct: false },
      { optionId: 4, optionText: "Train", correct: false },
    ],
    feedBack: "車 (くるま) = Car.",
  },
];

export const mockPassageData = [
  {
    passageId: 1,
    text: `日本にはたくさんの文化や名所があります。東京は日本の首都であり、経済や政治の中心です。
また、日本には有名な食べ物や自然もあります。例えば、寿司やラーメンは世界中で人気です。
さらに、日本で一番有名な山は富士山で、多くの観光客が訪れます。
日本人は朝ごはんにパンやごはんを食べることが多いです。週末には友達と映画を見たり、
公園で散歩したりして楽しみます。`,
    questions: [
      {
        mcqId: 1,
        question: "東京は日本の____です。",
        feedBack: "ヒント: 国の中心を表す言葉です。",
        readingQuestionOptions: [
          { optionId: 1, optionText: "首都", correct: true },
          { optionId: 2, optionText: "町", correct: false },
          { optionId: 3, optionText: "村", correct: false }
        ]
      },
      {
        mcqId: 2,
        question: "日本で一番有名な山は____です。",
        feedBack: "注意: 世界遺産にも登録されています。",
        readingQuestionOptions: [
          { optionId: 1, optionText: "富士山", correct: true },
          { optionId: 2, optionText: "エベレスト", correct: false },
          { optionId: 3, optionText: "アルプス", correct: false }
        ]
      },
      {
        mcqId: 3,
        question: "朝ごはんにパンと____を食べました。",
        feedBack: "ヒント: よくパンと一緒に飲むもの。",
        readingQuestionOptions: [
          { optionId: 1, optionText: "コーヒー", correct: true },
          { optionId: 2, optionText: "水", correct: false },
          { optionId: 3, optionText: "お茶", correct: false }
        ]
      },
      {
        mcqId: 4,
        question: "昨日、友達と____を見ました。",
        feedBack: "注意: 映画館に行くときによく見るもの。",
        readingQuestionOptions: [
          { optionId: 1, optionText: "映画", correct: true },
          { optionId: 2, optionText: "新聞", correct: false },
          { optionId: 3, optionText: "雑誌", correct: false }
        ]
      },
      {
        mcqId: 5,
        question: "寿司やラーメンは____です。",
        feedBack: "ヒント: 世界中で知られています。",
        readingQuestionOptions: [
          { optionId: 1, optionText: "有名", correct: true },
          { optionId: 2, optionText: "安い", correct: false },
          { optionId: 3, optionText: "難しい", correct: false }
        ]
      }
    ]
  },
  {
    passageId: 2,
    text: `京都は日本の古い都で、多くの寺や神社があります。春には桜が咲き、秋には紅葉が美しく、多くの観光客が訪れます。
京都には伝統的な食べ物や祭りもあり、日本の歴史や文化を体験することができます。
特に祇園祭は有名で、毎年夏に開催されます。`,
    questions: [
      {
        mcqId: 1,
        question: "京都は日本の____です。",
        feedBack: "ヒント: 古い都を意味します。",
        readingQuestionOptions: [
          { optionId: 1, optionText: "古都", correct: true },
          { optionId: 2, optionText: "新都", correct: false },
          { optionId: 3, optionText: "首都", correct: false }
        ]
      },
      {
        mcqId: 2,
        question: "春には____が咲きます。",
        feedBack: "日本の花見で有名な花です。",
        readingQuestionOptions: [
          { optionId: 1, optionText: "桜", correct: true },
          { optionId: 2, optionText: "バラ", correct: false },
          { optionId: 3, optionText: "ひまわり", correct: false }
        ]
      },
      {
        mcqId: 3,
        question: "秋には____が美しいです。",
        feedBack: "山や木の葉の色が変わることです。",
        readingQuestionOptions: [
          { optionId: 1, optionText: "紅葉", correct: true },
          { optionId: 2, optionText: "雪", correct: false },
          { optionId: 3, optionText: "雨", correct: false }
        ]
      },
      {
        mcqId: 4,
        question: "祇園祭は____に行われます。",
        feedBack: "季節を答えてください。",
        readingQuestionOptions: [
          { optionId: 1, optionText: "夏", correct: true },
          { optionId: 2, optionText: "冬", correct: false },
          { optionId: 3, optionText: "春", correct: false }
        ]
      }
    ]
  },
  {
    passageId: 3,
    text: `北海道は日本の北にあり、冬は雪が多いです。スキーやスノーボードを楽しむことができ、世界中から観光客が訪れます。
夏には涼しく、美しい花畑を見ることができます。北海道の有名な食べ物にはジンギスカンやラーメンがあります。`,
    questions: [
      {
        mcqId: 1,
        question: "北海道は日本の____にあります。",
        feedBack: "方向を答えてください。",
        readingQuestionOptions: [
          { optionId: 1, optionText: "北", correct: true },
          { optionId: 2, optionText: "南", correct: false },
          { optionId: 3, optionText: "西", correct: false }
        ]
      },
      {
        mcqId: 2,
        question: "冬には____を楽しむことができます。",
        feedBack: "雪のスポーツです。",
        readingQuestionOptions: [
          { optionId: 1, optionText: "スキー", correct: true },
          { optionId: 2, optionText: "サッカー", correct: false },
          { optionId: 3, optionText: "テニス", correct: false }
        ]
      },
      {
        mcqId: 3,
        question: "夏には美しい____を見ることができます。",
        feedBack: "色とりどりで観光客に人気です。",
        readingQuestionOptions: [
          { optionId: 1, optionText: "花畑", correct: true },
          { optionId: 2, optionText: "海", correct: false },
          { optionId: 3, optionText: "山", correct: false }
        ]
      },
      {
        mcqId: 4,
        question: "北海道の有名な食べ物には____があります。",
        feedBack: "羊肉料理です。",
        readingQuestionOptions: [
          { optionId: 1, optionText: "ジンギスカン", correct: true },
          { optionId: 2, optionText: "寿司", correct: false },
          { optionId: 3, optionText: "天ぷら", correct: false }
        ]
      }
    ]
  }
];

//
export const urlvideo ={
    videoUrl:"/video/video1.mp4"
}

//
 export const writingMock = {
    img: "https://via.placeholder.com/1000x600.png?text=Describe+the+picture",
    question:
      "Describe the picture in your own words. Focus on the main elements and details you find interesting. Consider the colors, objects, atmosphere, and any actions taking place. Write at least 150 words.",
  };
  //
  export const mockParagraphsData = [
  {
    passageText: `
      Climate change is one of the most pressing issues of our time. Rising global temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to become more extreme. Scientists around the world are working together to find solutions to reduce carbon emissions and develop renewable energy sources.
      
      The transition to clean energy is not just an environmental necessity but also an economic opportunity. Countries that invest early in solar, wind, and hydroelectric power are positioning themselves as leaders in the new green economy. However, this transition requires significant investment and political will from governments worldwide.
    `
  },
  {
    passageText: `
      Artificial Intelligence has revolutionized many aspects of our daily lives. From voice assistants in our homes to recommendation algorithms on streaming platforms, AI is everywhere. Machine learning models can now diagnose diseases, predict market trends, and even create art.
      
      However, with great power comes great responsibility. As AI becomes more sophisticated, questions about ethics, privacy, and job displacement become increasingly important. Society must work together to ensure that AI development benefits everyone and doesn't leave anyone behind.
    `
  },
  {
    passageText: `
      The importance of mental health awareness has grown significantly in recent years. More people are recognizing that psychological well-being is just as crucial as physical health. Stress, anxiety, and depression affect millions of people worldwide, but many still hesitate to seek help due to social stigma.
      
      Educational institutions and workplaces are implementing mental health programs to support their communities. These initiatives include counseling services, stress management workshops, and creating environments where people feel safe to discuss their mental health challenges without fear of judgment.
    `
  },
  {
    passageText: `
      Space exploration has entered a new era with private companies joining government agencies in the race to explore the cosmos. Companies like SpaceX and Blue Origin are making space travel more accessible and cost-effective than ever before.
      
      The benefits of space exploration extend far beyond satisfying human curiosity. Technologies developed for space missions often find applications in everyday life, from GPS navigation to medical imaging devices. Furthermore, studying other planets helps us better understand Earth and how to protect our own environment.
    `
  }
];
//
export const mockPictureAndQuestionsData = [
  {
    pictureUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500",
    speakingPictureListQuestions: [
      "What do you see in this image?",
      "Describe the activities people are doing in the picture.",
      "How does this place make you feel and why?",
      "Would you like to visit a place like this? Explain your reasons.",
      "What time of day do you think this photo was taken? How can you tell?"
    ]
  },
  {
    pictureUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    speakingPictureListQuestions: [
      "What kind of food can you identify in this image?",
      "Describe the presentation and colors of the food.",
      "Do you think this meal looks healthy? Why or why not?",
      "What would you add or change to make this meal better?",
      "Tell me about your favorite type of cuisine and compare it to what you see here."
    ]
  },
  {
    pictureUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500",
    speakingPictureListQuestions: [
      "What is the main focus of this workplace image?",
      "Describe the atmosphere and environment shown in the picture.",
      "What kind of work do you think is being done here?",
      "How does this workplace compare to your ideal work environment?",
      "What advantages and disadvantages can you see in this type of workspace?"
    ]
  },
  {
    pictureUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
    speakingPictureListQuestions: [
      "Describe the natural landscape you see in this image.",
      "What season do you think this photo represents and why?",
      "What activities could someone do in this location?",
      "How does nature like this benefit people's well-being?",
      "Compare this natural setting to the area where you live."
    ]
  },
  {
    pictureUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500",
    speakingPictureListQuestions: [
      "What mode of transportation is shown in this image?",
      "Describe the setting and time period this photo might represent.",
      "What are the advantages and disadvantages of this type of travel?",
      "How has transportation changed over the years in your country?",
      "What is your preferred way to travel long distances and why?"
    ]
  },
  {
    pictureUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
    speakingPictureListQuestions: [
      "What learning environment is depicted in this image?",
      "Describe the tools and resources visible in the picture.",
      "What subject do you think is being taught or studied here?",
      "How has education changed since you were a student?",
      "What do you think makes an effective learning environment?"
    ]
  }
];