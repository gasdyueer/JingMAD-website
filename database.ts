// ==========================================
// 数据库配置区域 (DATABASE CONFIGURATION)
// ==========================================
// 在这里修改、添加或删除 MAD 作品数据。
// 修改后保存，网页将自动更新。

export interface MadItem {
  rank: number;          // 排名 (1-100)
  id: string;            // 唯一标识 ID
  title: string;         // 标题
  author: string;        // 作者
  coverUrl: string;      // 封面图片链接 (推荐 16:9)
  comment: string;       // 推荐评语
  tags: string[];        // 标签列表
}

// 从 mad_list.md 读取原始内容
// @ts-ignore - Vite 提供的原始导入
import madListRaw from './mad_list.md?raw';

/**
 * 解析 mad_list.md 内容并转换为 MadItem 数组
 */
function parseMadList(): MadItem[] {
  const lines = madListRaw.split('\n');
  const items: MadItem[] = [];
  let currentItem: Partial<MadItem> = {};
  let propertyIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 跳过空行
    if (trimmed === '') {
      continue;
    }

    // 检测顶级条目：以 "- " 开头且没有前导空格（或只有两个空格？）
    // 实际上 Markdown 列表可能允许最多三个空格，但这里我们简单处理
    if (line.startsWith('- ') && (line.match(/^\s*/)?.[0].length ?? 0) < 2) {
      // 如果已有正在构建的条目，则保存它（但仅当标题非空时）
      if (currentItem.title !== undefined && currentItem.title.trim() !== '') {
        finalizeItem(currentItem, items.length + 1);
        items.push(currentItem as MadItem);
      }
      // 开始新条目
      const title = trimmed.substring(2).trim(); // 移除 "- "
      // 如果标题为空，则跳过此条目（不创建 currentItem）
      if (title === '') {
        currentItem = {};
        propertyIndex = 0;
        continue;
      }
      currentItem = { title };
      propertyIndex = 0;
    } else if (line.startsWith('  - ') || line.startsWith('\t- ')) {
      // 子属性：作者、封面、评论
      const value = trimmed.substring(2).trim(); // 移除 "- "
      // 根据属性索引分配
      if (propertyIndex === 0) {
        currentItem.author = value;
      } else if (propertyIndex === 1) {
        // 移除可能存在的引号
        let coverPath = value.replace(/^['"]|['"]$/g, '');
        // 将反斜杠转换为正斜杠
        coverPath = coverPath.replace(/\\/g, '/');
        currentItem.coverUrl = coverPath;
      } else if (propertyIndex === 2) {
        currentItem.comment = value;
      }
      propertyIndex++;
    }
    // 忽略其他行
  }

  // 添加最后一个条目（仅当标题非空时）
  if (currentItem.title !== undefined && currentItem.title.trim() !== '') {
    finalizeItem(currentItem, items.length + 1);
    items.push(currentItem as MadItem);
  }

  return items;
}

/**
 * 填充缺失的属性并生成 rank、id、tags
 */
function finalizeItem(item: Partial<MadItem>, rank: number): void {
  // rank
  item.rank = rank;

  // id: 基于标题生成简单 slug
  const slug = item.title!
    .replace(/【MAD】/g, '')
    .replace(/【/g, '')
    .replace(/】/g, '')
    .replace(/[^\w\u4e00-\u9fff]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
  item.id = `mad_${slug || `item_${rank}`}`;

  // 确保 author 存在，否则随机生成
  if (!item.author) {
    const AUTHORS = ["Nelliel", "Zeryo", "Kurokage", "Sora", "MotionD", "FrameZero", "PixelHeart", "EchoVibe"];
    item.author = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
  }

  // 确保 coverUrl 存在，否则使用占位图
  if (!item.coverUrl) {
    item.coverUrl = `https://picsum.photos/seed/${item.id}/800/450.webp`;
  } else {
    // 将相对路径转换为绝对路径（针对构建版本）
    // 如果路径是相对路径（不以 http:// 或 https:// 开头），则添加 /mad_imgs/ 前缀
    if (!item.coverUrl.startsWith('http://') && !item.coverUrl.startsWith('https://')) {
      // 移除可能的前导 ./ 或 ../
      let cleanPath = item.coverUrl.replace(/^\.\//, '').replace(/^\.\.\//, '');
      // 将反斜杠转换为正斜杠
      cleanPath = cleanPath.replace(/\\/g, '/');
      // 如果路径已经是 mad_imgs/... 格式，确保有前导斜杠
      if (cleanPath.startsWith('mad_imgs/')) {
        item.coverUrl = '/' + cleanPath;
      } else {
        item.coverUrl = '/mad_imgs/' + cleanPath;
      }
    }
  }

  // 确保 comment 存在，否则生成随机评语
  if (!item.comment) {
    const comments = [
      '视觉表现力极强，分镜切换堪称教科书级别。',
      '整体色调控制出色，氛围营造到位。',
      '音乐与画面的结合令人印象深刻。',
      '剪辑节奏把握精准，情感传递直接。'
    ];
    item.comment = comments[Math.floor(Math.random() * comments.length)];
  }

  // tags 留空数组
  item.tags = [];
}

/**
 * 模拟数据生成器（备用）
 */
function generateMockData(): MadItem[] {
  const TAG_POOL = ["Typography", "Monochrome", "Glitch", "Emotional", "Cyberpunk", "Minimalist", "High Speed", "Rhythm", "Abstract", "Storytelling"];
  const AUTHORS = ["Nelliel", "Zeryo", "Kurokage", "Sora", "MotionD", "FrameZero", "PixelHeart", "EchoVibe"];
  
  const data: MadItem[] = [];
  for (let i = 1; i <= 100; i++) {
    const id = `mad_${String(i).padStart(3, '0')}`;
    const titleBase = ["Eternity", "Silence", "Noise", "Fragment", "Memory", "Protocol", "Horizon", "Decay", "Bloom", "System"];
    const titleSuffix = ["I", "II", "Overdrive", "Redux", "Final", "Concept", "Zero"];
    
    const title = `${titleBase[Math.floor(Math.random() * titleBase.length)]} ${titleSuffix[Math.floor(Math.random() * titleSuffix.length)]}`;
    const author = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
    const comment = `视觉表现力极强，在${Math.floor(Math.random()*20+10)}秒处的分镜切换堪称教科书级别。整体色调控制在${i % 2 === 0 ? '冷色系' : '暖色系'}，营造出一种${["压抑", "爆发", "宁静", "赛博"][Math.floor(Math.random()*4)]}的氛围。`;

    const tags = [];
    const tagCount = Math.floor(Math.random() * 3) + 2;
    for(let j=0; j<tagCount; j++) {
        const t = TAG_POOL[Math.floor(Math.random() * TAG_POOL.length)];
        if(!tags.includes(t)) tags.push(t);
    }

    data.push({
        rank: i,
        id: id,
        title: title.toUpperCase(),
        author: author.toUpperCase(),
        coverUrl: `https://picsum.photos/seed/${id}/800/450.webp`,
        comment: comment,
        tags: tags
    });
  }
  return data;
}

// 尝试解析 mad_list.md，失败则使用模拟数据
let madList: MadItem[];
try {
  madList = parseMadList();
  if (madList.length === 0) {
    throw new Error('解析结果为空');
  }
} catch (error) {
  console.warn('mad_list.md 解析失败，使用模拟数据:', error);
  madList = generateMockData();
}

// 导出数据列表
export const MAD_LIST: MadItem[] = madList;
