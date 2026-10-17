import { getAvatarPhoto, type ChildProfile } from '../../store/profileStore'

/** Drawings a family can pick as a child's avatar (our own ZedSpeaks pictures) */
export const AVATAR_PICS = [
  'teddy-bear', 'toy-car', 'video-game-controller', 'colorful-toy-ball', 'building-blocks', 'headphones',
  'bicycle', 'puzzle', 'crayons', 'ice-cream', 'bus', 'tree',
]

export const picUrl = (name: string) => `${import.meta.env.BASE_URL}symbols/zs-${name}.webp`

export function Avatar({ profile, size = 96 }: { profile: Pick<ChildProfile, 'id' | 'name' | 'avatar'>; size?: number }) {
  const photo = profile.avatar === 'photo' ? getAvatarPhoto(profile.id) : null
  const pic = profile.avatar?.startsWith('pic:') ? picUrl(profile.avatar.slice(4)) : null
  const box = { width: size, height: size }
  if (photo) return <img src={photo} alt="" style={box} className="rounded-full object-cover bg-white ring-4 ring-white shadow" />
  if (pic) return <img src={pic} alt="" style={box} className="rounded-full object-contain bg-white p-2 ring-4 ring-white shadow" />
  return (
    <span style={box} className="rounded-full bg-blue-100 text-blue-800 ring-4 ring-white shadow flex items-center justify-center font-black"
      aria-hidden>
      <span style={{ fontSize: size * 0.42 }}>{profile.name.slice(0, 1).toUpperCase()}</span>
    </span>
  )
}
