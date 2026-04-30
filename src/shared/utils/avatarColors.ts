const AVATAR_COLORS = [
  "bg-red-500!",
  "bg-blue-500!",
  "bg-green-500!",
  "bg-yellow-500!",
  "bg-purple-500!",
  "bg-pink-500!",
  "bg-indigo-500!",
  "bg-teal-500!",
  "bg-orange-500!",
  "bg-cyan-500!",
];

export function getAvatarColor(id: string): string {
  if (!id) return AVATAR_COLORS[0] as string;

  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % AVATAR_COLORS.length;

  return AVATAR_COLORS[index] as string;
}
