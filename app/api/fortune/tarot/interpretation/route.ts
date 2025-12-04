import { NextRequest, NextResponse } from 'next/server';
import type { TarotCard } from '@/lib/tarot-cards-complete';

interface InterpretationRequest {
  cards: TarotCard[];
  question?: string;
  spread: 'single' | 'three' | 'five';
  locale?: string; // 语言设置，默认为中文
}

interface GLM4Response {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function POST(request: NextRequest) {
  try {
    const body: InterpretationRequest = await request.json();
    const { cards, question, spread, locale = 'zh' } = body;

    if (!cards || cards.length === 0) {
      const errorMessage = locale === 'en' 
        ? 'Please provide tarot card information'
        : '请提供塔罗牌信息';
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: errorMessage } },
        { status: 400 }
      );
    }

    // 获取API密钥（优先使用环境变量，如果没有则使用默认密钥）
    const apiKey = process.env.ZHIPU_API_KEY || process.env.BIGMODEL_API_KEY || 'ec4f78991c644d3783f4b94ceb9f423c.kzDstMnJ99FyZbTD';
    
    console.log('调用大师解答API，牌数:', cards.length, '牌阵:', spread, '语言:', locale, '问题:', question || '无');

    // 构建提示词（根据语言）
    const prompt = buildTarotPrompt(cards, question, spread, locale);

    // 调用智谱AI API
    const apiUrl = 'https://www.bigmodel.cn/api/paas/v4/chat/completions';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'glm-4-flash-250414',
        messages: locale === 'en' 
          ? [
              {
                role: 'system',
                content: 'You are an experienced tarot card reader. You must respond entirely in English. Even if card meanings are provided in Chinese, you must translate and interpret them into English. All your responses must be in English only.'
              },
              {
                role: 'user',
                content: prompt
              }
            ]
          : [
              {
                role: 'user',
                content: prompt
              }
            ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GLM-4 API error:', response.status, errorText);
      // API调用失败时，返回模拟数据作为备用
      console.log('API调用失败，使用模拟数据');
      const interpretation = generateInterpretation(cards, question, spread, locale);
      return NextResponse.json({
        success: true,
        data: interpretation,
      });
    }

    const data: GLM4Response = await response.json();
    console.log('GLM-4 API响应:', JSON.stringify(data).substring(0, 200));
    
    const aiContent = data.choices[0]?.message?.content || '';
    console.log('AI返回内容长度:', aiContent.length);

    // 解析AI返回的内容（根据语言）
    const interpretation = parseAIResponse(aiContent, cards, question, spread, locale);
    console.log('解析后的解读:', interpretation.summary.substring(0, 50) + '...');

    return NextResponse.json({
      success: true,
      data: interpretation,
    });
  } catch (error) {
    console.error('大师解答API错误:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: '服务器错误，请稍后重试' } },
      { status: 500 }
    );
  }
}

/**
 * 构建塔罗牌解读提示词（支持多语言）
 */
function buildTarotPrompt(
  cards: TarotCard[],
  question?: string,
  spread?: 'single' | 'three' | 'five',
  locale: string = 'zh'
): string {
  const isEnglish = locale === 'en';
  
  // 根据语言选择位置标签
  const positionLabels = {
    zh: {
      single: '单张牌',
      three: ['过去', '现在', '未来'],
      five: ['现状', '挑战', '过去', '未来', '建议'],
      reversed: '（逆位）',
      upright: '（正位）',
    },
    en: {
      single: 'Single Card',
      three: ['Past', 'Present', 'Future'],
      five: ['Situation', 'Challenge', 'Past', 'Future', 'Advice'],
      reversed: ' (Reversed)',
      upright: ' (Upright)',
    },
  };

  const labels = isEnglish ? positionLabels.en : positionLabels.zh;

  const cardDescriptions = cards.map((card, index) => {
    const position = spread === 'single' 
      ? labels.single
      : spread === 'three'
      ? labels.three[index]
      : labels.five[index];
    
    const cardName = isEnglish ? card.nameEn : card.nameZh;
    const cardStatus = card.reversed ? labels.reversed : labels.upright;
    // 注意：卡片含义目前只有中文，如果是英文环境，AI会理解并翻译
    const cardMeaning = card.reversed ? card.reversedMeaning : card.meaning;
    
    return `${position}: ${cardName}${cardStatus} - ${cardMeaning}`;
  }).join('\n');

  const questionLabel = isEnglish ? 'User\'s question' : '用户的问题';
  const questionPart = question ? `\n\n${questionLabel}: ${question}` : '';

  const systemPrompt = isEnglish
    ? `You are an experienced tarot card reader. You MUST respond entirely in English. 

CRITICAL REQUIREMENT: All your response must be in English only. Do not use any Chinese characters.

The card meanings below are provided in Chinese, but you must translate and interpret them into English.

${cardDescriptions}${questionPart}

You MUST provide the interpretation in the following format (all content must be in English):

【Summary】
Briefly summarize the core information of this divination in English (50-100 words). Use English only.

【Detailed Interpretation】
Provide an in-depth analysis in English of the meaning of each card, combined with the overall meaning of the spread (200-400 words). Translate the Chinese card meanings into English.

【Advice】
Based on the card meanings and the user's question (if any), provide specific action suggestions and guidance in English (100-200 words). Use English only.

REMEMBER: Your entire response must be in English. Do not use Chinese characters at all.`
    : `你是一位资深的塔罗牌占卜师，请根据以下抽到的塔罗牌为用户提供专业的解读。

${cardDescriptions}${questionPart}

请按照以下格式提供解读：

【摘要】
简要总结这次占卜的核心信息（50-100字）

【详细解读】
深入分析每张牌的含义，并结合牌阵的整体意义进行解读（200-400字）

【建议】
根据牌意和用户的问题（如有），提供具体的行动建议和指引（100-200字）

请用专业、温和、富有启发性的语言进行解读，帮助用户理解牌意并获得指引。`;

  return systemPrompt;
}

/**
 * 解析AI返回的内容，提取摘要、详细解读和建议（支持多语言）
 */
function parseAIResponse(
  aiContent: string,
  cards: TarotCard[],
  question?: string,
  spread?: 'single' | 'three' | 'five',
  locale: string = 'zh'
): {
  summary: string;
  detailed: string;
  advice: string;
} {
  const isEnglish = locale === 'en';
  
  // 根据语言匹配不同的标签
  const summaryPattern = isEnglish 
    ? /【Summary】\s*([\s\S]*?)(?=【Detailed Interpretation】|【Advice】|$)/i
    : /【摘要】\s*([\s\S]*?)(?=【详细解读】|【建议】|$)/;
  
  const detailedPattern = isEnglish
    ? /【Detailed Interpretation】\s*([\s\S]*?)(?=【Advice】|$)/i
    : /【详细解读】\s*([\s\S]*?)(?=【建议】|$)/;
  
  const advicePattern = isEnglish
    ? /【Advice】\s*([\s\S]*?)$/i
    : /【建议】\s*([\s\S]*?)$/;

  // 尝试从AI响应中提取结构化内容
  const summaryMatch = aiContent.match(summaryPattern);
  const detailedMatch = aiContent.match(detailedPattern);
  const adviceMatch = aiContent.match(advicePattern);

  // 如果成功提取到结构化内容，使用AI的解读
  if (summaryMatch && detailedMatch && adviceMatch) {
    return {
      summary: summaryMatch[1].trim(),
      detailed: detailedMatch[1].trim(),
      advice: adviceMatch[1].trim(),
    };
  }

  // 如果AI返回的格式不符合预期，使用备用方案
  return generateInterpretation(cards, question, spread, locale);
}

/**
 * 生成模拟解读（备用方案，支持多语言）
 */
function generateInterpretation(
  cards: TarotCard[],
  question?: string,
  spread?: 'single' | 'three' | 'five',
  locale: string = 'zh'
): {
  summary: string;
  detailed: string;
  advice: string;
} {
  const isEnglish = locale === 'en';
  
  // 根据语言选择文本
  const texts = {
    zh: {
      singleCard: '您抽到的牌是',
      threeCards: '您抽到的三张牌分别是：',
      fiveCards: '您抽到的五张牌分别是：',
      reversed: '（逆位）',
      upright: '（正位）',
      positions: {
        three: ['过去', '现在', '未来'],
        five: ['现状', '挑战', '过去', '未来', '建议'],
      },
      advice: {
        single: (q: string | undefined, reversed: boolean) => 
          q ? `针对您的问题"${q}"，这张牌提示您需要${reversed ? '注意避免' : '积极面对'}相关的情况。` 
          : '建议您静心思考，结合当前情况理解牌意。',
        three: (q: string | undefined) =>
          q ? `针对您的问题"${q}"，这三张牌展现了事情的发展脉络。建议您回顾过去，把握现在，展望未来。`
          : '建议您结合三张牌的含义，理解事情的整体发展趋势。',
        five: (q: string | undefined) =>
          q ? `针对您的问题"${q}"，这五张牌提供了全面的指引。建议您关注现状，面对挑战，从过去中学习，为未来做准备。`
          : '建议您全面分析这五张牌的含义，它们为您提供了多角度的指引。',
      },
    },
    en: {
      singleCard: 'You drew',
      threeCards: 'You drew three cards:',
      fiveCards: 'You drew five cards:',
      reversed: ' (Reversed)',
      upright: ' (Upright)',
      positions: {
        three: ['Past', 'Present', 'Future'],
        five: ['Situation', 'Challenge', 'Past', 'Future', 'Advice'],
      },
      advice: {
        single: (q: string | undefined, reversed: boolean) =>
          q ? `Regarding your question "${q}", this card suggests you need to ${reversed ? 'avoid' : 'actively face'} related situations.`
          : 'Please reflect calmly and understand the card meaning in the context of your current situation.',
        three: (q: string | undefined) =>
          q ? `Regarding your question "${q}", these three cards show the development of things. It is suggested that you review the past, grasp the present, and look forward to the future.`
          : 'It is suggested that you combine the meanings of the three cards to understand the overall development trend.',
        five: (q: string | undefined) =>
          q ? `Regarding your question "${q}", these five cards provide comprehensive guidance. It is suggested that you focus on the current situation, face challenges, learn from the past, and prepare for the future.`
          : 'It is suggested that you comprehensively analyze the meanings of these five cards, which provide multi-angle guidance.',
      },
    },
  };

  const t = isEnglish ? texts.en : texts.zh;
  
  let summary = '';
  let detailed = '';
  let advice = '';

  if (spread === 'single') {
    const card = cards[0];
    const cardName = isEnglish ? card.nameEn : card.nameZh;
    const cardStatus = card.reversed ? t.reversed : t.upright;
    summary = `${t.singleCard} ${cardName}${cardStatus}.`;
    detailed = `${summary} ${card.reversed ? card.reversedMeaning : card.meaning}`;
    advice = t.advice.single(question, card.reversed);
  } else if (spread === 'three') {
    const cardNames = cards.map(card => {
      const cardName = isEnglish ? card.nameEn : card.nameZh;
      const cardStatus = card.reversed ? t.reversed : t.upright;
      return `${cardName}${cardStatus}`;
    }).join(', ');
    summary = `${t.threeCards} ${cardNames}.`;
    detailed = `${summary}\n\n${cards.map((card, index) => {
      const cardName = isEnglish ? card.nameEn : card.nameZh;
      const cardStatus = card.reversed ? t.reversed : t.upright;
      return `${t.positions.three[index]}: ${cardName}${cardStatus} - ${card.reversed ? card.reversedMeaning : card.meaning}`;
    }).join('\n')}`;
    advice = t.advice.three(question);
  } else if (spread === 'five') {
    const cardNames = cards.map(card => {
      const cardName = isEnglish ? card.nameEn : card.nameZh;
      const cardStatus = card.reversed ? t.reversed : t.upright;
      return `${cardName}${cardStatus}`;
    }).join(', ');
    summary = `${t.fiveCards} ${cardNames}.`;
    detailed = `${summary}\n\n${cards.map((card, index) => {
      const cardName = isEnglish ? card.nameEn : card.nameZh;
      const cardStatus = card.reversed ? t.reversed : t.upright;
      return `${t.positions.five[index]}: ${cardName}${cardStatus} - ${card.reversed ? card.reversedMeaning : card.meaning}`;
    }).join('\n')}`;
    advice = t.advice.five(question);
  }

  return {
    summary,
    detailed,
    advice,
  };
}

