"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Yao, Hexagram } from '@/lib/liuyao-calculator';

interface LiuYaoDisplayProps {
  yaos: Yao[];
  benGua: Hexagram;
  bianGua: Hexagram | null;
  changingYaos: number[];
  locale?: string;
}

export function LiuYaoDisplay({ yaos, benGua, bianGua, changingYaos, locale = 'zh' }: LiuYaoDisplayProps) {
  const isZh = locale === 'zh';

  // 渲染单个爻
  const renderYao = (yao: Yao, position: number, isChanging: boolean) => {
    const isYang = yao.type === 'yang';
    const yaoLine = isYang ? '━━━' : '━ ━';
    const yaoColor = isChanging ? 'text-primary' : 'text-foreground';
    
    return (
      <div key={position} className="flex items-center gap-3 py-1">
        {/* 爻的线条 - 左对齐，固定宽度 */}
        <div className={`text-2xl md:text-3xl font-mono ${yaoColor} ${isChanging ? 'font-bold drop-shadow-sm' : ''} tracking-wider w-20 flex-shrink-0`}>
          {yaoLine}
        </div>
        {/* 爻的编号 - 固定宽度，增加左边距 */}
        <span className="text-xs font-medium text-muted-foreground w-14 flex-shrink-0 ml-1">
          {isZh ? `第${position}爻` : `Line ${position}`}
        </span>
        {/* 徽章区域 - 左对齐 */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {yao.value === 9 && (
            <Badge variant={isChanging ? 'default' : 'secondary'} className="text-xs px-2 py-0.5">
              {isZh ? '老阳' : 'Old Yang'}
            </Badge>
          )}
          {yao.value === 8 && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              {isZh ? '少阴' : 'Young Yin'}
            </Badge>
          )}
          {yao.value === 7 && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              {isZh ? '少阳' : 'Young Yang'}
            </Badge>
          )}
          {yao.value === 6 && (
            <Badge variant={isChanging ? 'default' : 'secondary'} className="text-xs px-2 py-0.5">
              {isZh ? '老阴' : 'Old Yin'}
            </Badge>
          )}
          {isChanging && (
            <Badge variant="destructive" className="text-xs px-1.5 py-0.5 font-bold">
              {isZh ? '变' : '变'}
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* 本卦 */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">
                {isZh ? '本卦' : 'Original Hexagram'}
              </CardTitle>
              <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5">
                {benGua.nameZh}
              </Badge>
              <span className="text-xs text-muted-foreground">({benGua.nameEn})</span>
            </div>
            {changingYaos.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {isZh ? `${changingYaos.length}个变爻` : `${changingYaos.length} changing`}
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs mt-0.5">
            {isZh ? '从下往上排列的六个爻' : 'Six lines arranged from bottom to top'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-4">
            {/* 卦象显示 */}
            <div className="bg-muted/30 rounded-lg p-2.5 border border-border/50">
              <div className="space-y-0.5">
                {/* 从下往上显示（第6爻在最上） */}
                {yaos.slice().reverse().map((yao, index) => {
                  const position = 6 - index; // 从下往上：1, 2, 3, 4, 5, 6
                  const isChanging = changingYaos.includes(position);
                  return renderYao(yao, position, isChanging);
                })}
              </div>
            </div>
            
            {/* 卦辞和含义 */}
            <div className="space-y-2 flex flex-col justify-center">
              <div className="flex items-start gap-2">
                <span className="text-xs font-semibold text-muted-foreground min-w-[45px] flex-shrink-0">{isZh ? '卦辞：' : 'Text: '}</span>
                <span className="text-xs leading-relaxed">{benGua.guaCi}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-semibold text-muted-foreground min-w-[45px] flex-shrink-0">{isZh ? '含义：' : 'Meaning: '}</span>
                <span className="text-xs leading-relaxed text-muted-foreground">{benGua.meaning}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 变卦（如果有） */}
      {bianGua && changingYaos.length > 0 && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader className="pb-2 pt-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">
                {isZh ? '变卦' : 'Changed Hexagram'}
              </CardTitle>
              <Badge variant="default" className="text-xs font-semibold px-2 py-0.5">
                {bianGua.nameZh}
              </Badge>
              <span className="text-xs text-muted-foreground">({bianGua.nameEn})</span>
            </div>
            <CardDescription className="text-xs mt-0.5">
              {isZh 
                ? `有${changingYaos.length}个变爻，形成变卦` 
                : `${changingYaos.length} changing line(s) form the changed hexagram`}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-4">
              {/* 变卦卦象显示 */}
              <div className="bg-primary/10 rounded-lg p-2.5 border border-primary/20">
                <div className="space-y-0.5">
                  {/* 显示变卦的爻（变爻已变化） */}
                  {yaos.slice().reverse().map((yao, index) => {
                    const position = 6 - index;
                    const isChanging = changingYaos.includes(position);
                    const changedYao: Yao = isChanging 
                      ? {
                          type: yao.type === 'yang' ? 'yin' : 'yang',
                          change: 'none',
                          value: yao.type === 'yang' ? 6 : 9,
                        }
                      : yao;
                    return renderYao(changedYao, position, false);
                  })}
                </div>
              </div>
              
              {/* 变卦卦辞和含义 */}
              <div className="space-y-2 flex flex-col justify-center">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-muted-foreground min-w-[65px] flex-shrink-0">{isZh ? '变卦卦辞：' : 'Text: '}</span>
                  <span className="text-xs leading-relaxed">{bianGua.guaCi}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-muted-foreground min-w-[65px] flex-shrink-0">{isZh ? '变卦含义：' : 'Meaning: '}</span>
                  <span className="text-xs leading-relaxed text-muted-foreground">{bianGua.meaning}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 变爻爻辞 */}
      {changingYaos.length > 0 && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Badge variant="destructive" className="text-xs">
                {isZh ? '变爻' : 'Changing'}
              </Badge>
              {isZh ? '爻辞' : 'Line Texts'}
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              {isZh 
                ? `第${changingYaos.join('、')}爻为变爻，需要特别关注` 
                : `Lines ${changingYaos.join(', ')} are changing lines`}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {changingYaos.map((position) => {
                const yaoIndex = position - 1; // 转换为0-based索引
                return (
                  <div key={position} className="p-2.5 bg-primary/5 rounded-lg border border-primary/10 hover:bg-primary/10 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="destructive" className="text-xs px-2 py-0.5">
                        {isZh ? `第${position}爻` : `Line ${position}`}
                      </Badge>
                    </div>
                    <div className="text-xs text-foreground leading-relaxed pl-0.5">
                      {benGua.yaoCi[yaoIndex]}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
