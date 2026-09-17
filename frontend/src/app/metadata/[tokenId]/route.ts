import { NextResponse } from 'next/server';

type MetadataRouteContext = {
  params: Promise<{ tokenId: string }>;
};

export async function GET(request: Request, { params }: MetadataRouteContext) {
  const { tokenId } = await params;

  if (!/^\d+$/.test(tokenId)) {
    return NextResponse.json({ error: 'Invalid token ID' }, { status: 400 });
  }

  const image = new URL('/bot-genesis-card.svg', request.url).toString();

  return NextResponse.json({
    name: `BOT Genesis #${tokenId}`,
    description: 'The official BOT Genesis NFT from the Bohr Network.',
    image,
    external_url: 'https://bohr.life',
    attributes: [
      { trait_type: 'Collection', value: 'BOT Genesis' },
      { trait_type: 'Network', value: 'Bohr Testnet' },
      { trait_type: 'Token Standard', value: 'ERC-721' },
    ],
  });
}
