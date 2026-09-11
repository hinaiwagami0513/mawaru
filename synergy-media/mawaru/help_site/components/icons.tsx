/**
 * アイコンは Tabler のみ（DESIGN.md / vault: tabler-icons）。
 * 絵文字は UI に使わない。マスコットは画像アセットで出す。
 */
import {
  IconAd2,
  IconAlertTriangle,
  IconBan,
  IconBook2,
  IconBulb,
  IconChartBar,
  IconCheck,
  IconHelpCircle,
  IconInfoCircle,
  IconList,
  IconPhoto,
  IconReceipt2,
  IconRocket,
  IconSeedlingFilled,
  IconSettings,
  IconSparkles,
} from '@tabler/icons-react';

import type { IconKey, NoteKind } from '@/content/types';

export const categoryIcon: Record<IconKey, typeof IconRocket> = {
  rocket: IconRocket,
  sparkles: IconSparkles,
  photo: IconPhoto,
  list: IconList,
  chart: IconChartBar,
  book: IconBook2,
  ad: IconAd2,
  settings: IconSettings,
  receipt: IconReceipt2,
  help: IconHelpCircle,
};

export const noteIcon: Record<NoteKind, typeof IconBulb> = {
  point: IconBulb,
  caution: IconAlertTriangle,
  ref: IconInfoCircle,
  danger: IconBan,
};

export { IconCheck };

/**
 * 「はじめての方へ」の初心者マーク。
 * 若葉マーク（道路標識）そのものは Tabler の 6250 個に無いので自作していたが、
 * 自作 SVG は形が安定しないためやめた。同じ「新芽＝初心者」の意味を持つ
 * IconSeedlingFilled をそのまま使う。塗りのほうが小サイズで読める。
 */
export { IconSeedlingFilled as BeginnerIcon };
