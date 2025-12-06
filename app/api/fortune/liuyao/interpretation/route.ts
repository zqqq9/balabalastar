import { NextRequest, NextResponse } from 'next/server';

interface InterpretationRequest {
  yaos: Array<{
    type: 'yang' | 'yin';
    change: 'none' | 'change';
    value: number;
  }>;
  benGua: {
    id: number;
    nameZh: string;
    nameEn: string;
    guaCi: string;
    yaoCi: string[];
    meaning: string;
  };
  bianGua: {
    id: number;
    nameZh: string;
    nameEn: string;
    guaCi: string;
    yaoCi: string[];
    meaning: string;
  } | null;
  changingYaos: number[];
  question?: string;
  locale?: string;
}

interface GLM4Response {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function POST(request: NextRequest) {
  let locale = 'zh'; // 默认语言
  try {
    const body: InterpretationRequest = await request.json();
    locale = body.locale || 'zh';
    const { yaos, benGua, bianGua, changingYaos, question } = body;

    if (!yaos || yaos.length === 0 || !benGua) {
      const errorMessage = locale === 'en' 
        ? 'Please provide hexagram information'
        : '请提供卦象信息';
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: errorMessage } },
        { status: 400 }
      );
    }

    // 获取API密钥
    const apiKey = process.env.ZHIPU_API_KEY || process.env.BIGMODEL_API_KEY || 'ec4f78991c644d3783f4b94ceb9f423c.kzDstMnJ99FyZbTD';
    
    console.log('调用六爻大师解答API，本卦:', benGua.nameZh, '变卦:', bianGua?.nameZh || '无', '语言:', locale, '问题:', question || '无');

    // 构建提示词
    const prompt = buildLiuYaoPrompt(yaos, benGua, bianGua, changingYaos, question, locale);

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
                content: 'You are an experienced I Ching (Liu Yao) divination master. You must respond entirely in English. All your responses must be in English only.'
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
      const interpretation = generateInterpretation(yaos, benGua, bianGua, changingYaos, question, locale);
      return NextResponse.json({
        success: true,
        data: interpretation,
      });
    }

    const data: GLM4Response = await response.json();
    console.log('GLM-4 API响应:', JSON.stringify(data).substring(0, 200));
    
    const aiContent = data.choices[0]?.message?.content || '';
    console.log('AI返回内容长度:', aiContent.length);

    // 解析AI返回的内容
    const interpretation = parseAIResponse(aiContent, yaos, benGua, bianGua, changingYaos, question, locale);
    console.log('解析后的解读:', interpretation.summary.substring(0, 50) + '...');

    return NextResponse.json({
      success: true,
      data: interpretation,
    });
  } catch (error) {
    console.error('大师解答API错误:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: locale === 'en' ? 'Server error, please try again later' : '服务器错误，请稍后重试' } },
      { status: 500 }
    );
  }
}

/**
 * 构建六爻占卜解读提示词（支持多语言）
 */
function buildLiuYaoPrompt(
  yaos: Array<{ type: 'yang' | 'yin'; change: 'none' | 'change'; value: number }>,
  benGua: { nameZh: string; nameEn: string; guaCi: string; yaoCi: string[]; meaning: string },
  bianGua: { nameZh: string; nameEn: string; guaCi: string; yaoCi: string[]; meaning: string } | null,
  changingYaos: number[],
  question?: string,
  locale: string = 'zh'
): string {
  const isEnglish = locale === 'en';
  
  // 构建爻的描述
  const yaoDescriptions = yaos.map((yao, index) => {
    const position = index + 1;
    const yaoType = yao.type === 'yang' ? (isEnglish ? 'Yang' : '阳爻') : (isEnglish ? 'Yin' : '阴爻');
    const yaoValue = yao.value === 9 ? (isEnglish ? 'Old Yang (9)' : '老阳(9)')
      : yao.value === 8 ? (isEnglish ? 'Young Yin (8)' : '少阴(8)')
      : yao.value === 7 ? (isEnglish ? 'Young Yang (7)' : '少阳(7)')
      : (isEnglish ? 'Old Yin (6)' : '老阴(6)');
    const isChanging = yao.change === 'change';
    const changeMark = isChanging ? (isEnglish ? ' (Changing)' : '（变爻）') : '';
    
    return `${isEnglish ? `Line ${position}` : `第${position}爻`}: ${yaoType}, ${yaoValue}${changeMark}`;
  }).join('\n');

  const benGuaInfo = isEnglish
    ? `Original Hexagram: ${benGua.nameZh} (${benGua.nameEn})\nHexagram Text: ${benGua.guaCi}\nMeaning: ${benGua.meaning}`
    : `本卦：${benGua.nameZh} (${benGua.nameEn})\n卦辞：${benGua.guaCi}\n含义：${benGua.meaning}`;

  let bianGuaInfo = '';
  if (bianGua && changingYaos.length > 0) {
    bianGuaInfo = isEnglish
      ? `\n\nChanged Hexagram: ${bianGua.nameZh} (${bianGua.nameEn})\nHexagram Text: ${bianGua.guaCi}\nMeaning: ${bianGua.meaning}\n\nChanging Lines: ${changingYaos.join(', ')}`
      : `\n\n变卦：${bianGua.nameZh} (${bianGua.nameEn})\n变卦卦辞：${bianGua.guaCi}\n变卦含义：${bianGua.meaning}\n\n变爻位置：第${changingYaos.join('、')}爻`;
    
    // 添加变爻爻辞
    const changingYaoTexts = changingYaos.map(pos => {
      const yaoIndex = pos - 1;
      return `${isEnglish ? `Line ${pos}` : `第${pos}爻`}: ${benGua.yaoCi[yaoIndex]}`;
    }).join('\n');
    bianGuaInfo += `\n\n${isEnglish ? 'Changing Line Texts' : '变爻爻辞'}:\n${changingYaoTexts}`;
  }

  const questionLabel = isEnglish ? 'User\'s question' : '用户的问题';
  const questionPart = question ? `\n\n${questionLabel}: ${question}` : '';

  const systemPrompt = isEnglish
    ? `You are an experienced I Ching (Liu Yao) divination master. You MUST respond entirely in English.

CRITICAL REQUIREMENT: All your response must be in English only. Do not use any Chinese characters.

Hexagram Information:
${yaoDescriptions}

${benGuaInfo}${bianGuaInfo}${questionPart}

You MUST provide the interpretation in the following format (all content must be in English):

【Summary】
Briefly summarize the core information of this divination in English (50-100 words). Use English only.

【Detailed Interpretation】
Provide an in-depth analysis in English of the hexagram meaning, the relationship between the original and changed hexagrams (if any), and the significance of changing lines (200-400 words). Translate any Chinese concepts into English.

【Advice】
Based on the hexagram meanings and the user's question (if any), provide specific action suggestions and guidance in English (100-200 words). Use English only.

REMEMBER: Your entire response must be in English. Do not use Chinese characters at all.`
    : `你是一位资深的六爻占卜大师，请根据以下卦象为用户提供专业的解读。

卦象信息：
${yaoDescriptions}

${benGuaInfo}${bianGuaInfo}${questionPart}

请按照以下格式提供解读：

【摘要】
简要总结这次占卜的核心信息（50-100字）

【详细解读】
深入分析本卦和变卦的含义，解读变爻的意义，并结合整体卦象进行综合分析（200-400字）

【建议】
根据卦象含义和用户的问题（如有），提供具体的行动建议和指引（100-200字）

请用专业、温和、富有启发性的语言进行解读，帮助用户理解卦象并获得指引。`;

  return systemPrompt;
}

/**
 * 解析AI返回的内容，提取摘要、详细解读和建议（支持多语言）
 */
function parseAIResponse(
  aiContent: string,
  yaos: Array<{ type: 'yang' | 'yin'; change: 'none' | 'change'; value: number }>,
  benGua: { nameZh: string; nameEn: string; guaCi: string; yaoCi: string[]; meaning: string },
  bianGua: { nameZh: string; nameEn: string; guaCi: string; yaoCi: string[]; meaning: string } | null,
  changingYaos: number[],
  question?: string,
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
  return generateInterpretation(yaos, benGua, bianGua, changingYaos, question, locale);
}

/**
 * 生成模拟解读（备用方案，支持多语言）
 */
function generateInterpretation(
  yaos: Array<{ type: 'yang' | 'yin'; change: 'none' | 'change'; value: number }>,
  benGua: { nameZh: string; nameEn: string; guaCi: string; yaoCi: string[]; meaning: string },
  bianGua: { nameZh: string; nameEn: string; guaCi: string; yaoCi: string[]; meaning: string } | null,
  changingYaos: number[],
  question?: string,
  locale: string = 'zh'
): {
  summary: string;
  detailed: string;
  advice: string;
} {
  const isEnglish = locale === 'en';
  
  if (isEnglish) {
    return {
      summary: `The hexagram ${benGua.nameZh} (${benGua.nameEn}) represents the current situation. ${bianGua ? `With ${changingYaos.length} changing line(s), the situation will evolve into ${bianGua.nameZh} (${bianGua.nameEn}).` : 'The situation is relatively stable with no changing lines.'}`,
      detailed: `The original hexagram ${benGua.nameZh} indicates: ${benGua.meaning}. ${bianGua ? `The changed hexagram ${bianGua.nameZh} suggests future development: ${bianGua.meaning}. The changing lines at positions ${changingYaos.join(', ')} are key points of transformation.` : 'With no changing lines, the current situation is stable and can be maintained.'}`,
      advice: `Based on the hexagram guidance, maintain inner peace, assess the situation carefully, and make wise decisions. ${question ? `Regarding your question about "${question}", consider the hexagram's guidance and act accordingly.` : ''}`,
    };
  }
  
  return {
    summary: `本卦${benGua.nameZh}卦象显示当前的情况。${bianGua ? `由于有${changingYaos.length}个变爻，事情将会发生变化，变卦${bianGua.nameZh}预示着未来的发展趋势。` : '由于没有变爻，当前情况相对稳定。'}`,
    detailed: `本卦${benGua.nameZh}的含义是：${benGua.meaning}。卦辞"${benGua.guaCi}"提供了重要的指引。${bianGua ? `变卦${bianGua.nameZh}的含义是：${bianGua.meaning}。变卦卦辞"${bianGua.guaCi}"揭示了变化的方向。第${changingYaos.join('、')}爻为变爻，这些爻的爻辞特别重要，它们指出了变化的关键点。` : '由于没有变爻，可以按照本卦的指导行事，保持现状。'}`,
    advice: `根据卦象的指导，保持内心的平静，审时度势，做出明智的决策。${question ? `关于您的问题"${question}"，建议结合卦象的指引，谨慎行事，顺应时势。` : '保持耐心，等待合适的时机，相信一切都会有最好的安排。'}`,
  };
}
