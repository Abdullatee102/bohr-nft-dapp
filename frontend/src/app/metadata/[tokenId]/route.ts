import { NextResponse } from 'next/server';

type MetadataRouteContext = {
  params: Promise<{ tokenId: string }>;
};

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: MetadataRouteContext
) {
  const { tokenId } = await params;

  // Support both /metadata/1 and /metadata/1.json
  const cleanId = (tokenId || '').replace(/\.json$/i, '').trim();

  // Token IDs start from 1.
if (!/^\d+$/.test(cleanId) || BigInt(cleanId) === BigInt(0)) {    return NextResponse.json(
      {
        error: 'Invalid token ID. Must be a positive integer.',
      },
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }

  /**
   * Derive the application origin from the incoming request.
   *
   * This allows the metadata route to work on:
   * - localhost
   * - Vercel production
   * - Vercel preview deployments
   */
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost || request.headers.get('host');

  const forwardedProto = request.headers.get('x-forwarded-proto');

  let baseUrl = '';

  if (host) {
    const isLocal =
      host.includes('localhost') || host.includes('127.0.0.1');

    const protocol = isLocal
      ? 'http'
      : forwardedProto || 'https';

    baseUrl = `${protocol}://${host}`;
  } else if (process.env.NEXT_PUBLIC_APP_URL) {
    baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  } else {
    baseUrl = 'https://bohr-nft-dapp-lk9w.vercel.app';
  }

  // Remove trailing slashes.
  baseUrl = baseUrl.replace(/\/+$/, '');

  /**
   * Public image stored in /public.
   *
   * Therefore:
   * /public/bot-genesis-card.png
   * becomes:
   * https://your-domain.com/bot-genesis-card.png
   */
  const imageUrl = `${baseUrl}/bot-genesis-card.png`;

  const metadata = {
    name: `BOT Genesis #${cleanId}`,
    description:
      'The official BOT Genesis NFT from the Bohr Network.',
    image: imageUrl,
    external_url: 'https://bohr.life',

    attributes: [
      {
        trait_type: 'Collection',
        value: 'BOT Genesis',
      },
      {
        trait_type: 'Network',
        value: 'Bohr Testnet',
      },
      {
        trait_type: 'Chain ID',
        value: 968,
      },
      {
        trait_type: 'Token Standard',
        value: 'ERC-721',
      },
      {
        trait_type: 'Token ID',
        value: Number(cleanId),
      },
    ],
  };

  return NextResponse.json(metadata, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}