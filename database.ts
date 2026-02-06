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
 * 解析 mad_list.md 内容并转换为 MadItem 数组（新约定版本）
 * 新约定格式：
 * - MAD标题
 *   作者名
 *   推荐语
 * 图片文件：mad_imgs/MAD标题.jpg（或.png等）
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

    // 检测顶级条目：以 "- " 开头
    if (line.startsWith('- ') && (line.match(/^\s*/)?.[0].length ?? 0) < 2) {
      // 保存上一个条目
      if (currentItem.title !== undefined && currentItem.title.trim() !== '') {
        finalizeItem(currentItem, items.length + 1);
        items.push(currentItem as MadItem);
      }
      
      // 开始新条目
      const title = trimmed.substring(2).trim();
      if (title === '') {
        currentItem = {};
        propertyIndex = 0;
        continue;
      }
      currentItem = { title };
      propertyIndex = 0;
    } 
    // 子属性：作者（第1个子项）
    else if ((line.startsWith('  - ') || line.startsWith('\t- ')) && propertyIndex === 0) {
      currentItem.author = trimmed.substring(2).trim();
      propertyIndex = 1;
    }
    // 子属性：推荐语（第2个子项）
    else if ((line.startsWith('  - ') || line.startsWith('\t- ')) && propertyIndex === 1) {
      currentItem.comment = trimmed.substring(2).trim();
      propertyIndex = 2;
    }
  }

  // 添加最后一个条目
  if (currentItem.title !== undefined && currentItem.title.trim() !== '') {
    finalizeItem(currentItem, items.length + 1);
    items.push(currentItem as MadItem);
  }

  return items;
}

/**
 * 生成安全的文件名（替换非法字符）
 */
function generateSafeFilename(title: string): string {
  return title
    .replace(/[/\\?%*:|"<>]/g, '_') // 替换非法文件名字符
    .trim();
}

/**
 * 生成图片路径
 * 由于mad_imgs被设置为publicDir，图片应该通过根路径访问
 * 注意：在 GitHub Pages 上，路径需要包含仓库名
 */
function generateImagePath(filename: string): string {
  // 对于public目录中的文件，直接使用原始文件名
  // 现代浏览器能正确处理包含中文和特殊字符的URL
  // 只需要编码空格为%20
  const safeFilename = filename.replace(/ /g, '%20');
  
  // 使用环境变量中的 BASE_URL，如果未定义则使用根路径
  // 在 vite.config.ts 中我们定义了 process.env.BASE_URL
  const baseUrl = (process.env.BASE_URL || '/').replace(/\/$/, '');
  
  // 图片在 mad_imgs 目录中
  return `${baseUrl}/mad_imgs/${safeFilename}`;
}

/**
 * 检查图片是否存在（简化版本）
 * 在实际项目中，这里可以添加更复杂的检查逻辑
 * 目前我们假设图片存在，因为文件名是基于标题生成的
 */
function checkImageExists(filename: string): boolean {
  // 这里可以添加更复杂的检查逻辑
  // 目前返回true，假设图片存在
  return true;
}

/**
 * 填充缺失的属性并生成 rank、id、tags、coverUrl
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

  // 确保 author 存在
  if (!item.author) {
    const AUTHORS = ["Nelliel", "Zeryo", "Kurokage", "Sora", "MotionD", "FrameZero", "PixelHeart", "EchoVibe"];
    item.author = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
  }

  // 生成图片路径：根据标题在mad_imgs目录中查找图片
  // 首先尝试.png，然后尝试.jpg（因为大部分图片是.png格式）
  const titleForFilename = generateSafeFilename(item.title!);
  
  const possibleExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
  let foundImage = false;
  
  for (const ext of possibleExtensions) {
    const filename = `${titleForFilename}${ext}`;
    // 检查图片是否存在
    if (checkImageExists(filename)) {
      item.coverUrl = generateImagePath(filename);
      foundImage = true;
      break;
    }
  }
  
  // 如果没找到图片，使用占位图
  if (!foundImage) {
    item.coverUrl = `https://picsum.photos/seed/${item.id}/800/450.webp`;
  }

  // 确保 comment 存在
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
