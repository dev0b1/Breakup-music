import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'HeartHeal';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 50%, #f3f4f6 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 120,
            marginBottom: 40,
          }}
        >
          💔🎵
        </div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #be123c 0%, #fda4af 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 20,
          }}
        >
          HeartHeal
        </div>
        <div
          style={{
            fontSize: 30,
            color: '#6b7280',
          }}
        >
          Turn your pain into songs that heal
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
