/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput, parseEther } from 'frog';
import { devtools } from 'frog/dev';
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next';
import { serveStatic } from 'frog/serve-static';
import { env } from 'process';
import { createPublicClient, http, formatEther } from 'viem';
import { base } from 'viem/chains';
import { wagmiAbi } from '../../abi/wagmiAbi';
import { metaDataAbi } from '../../abi/metaDataAbi';
import axios from 'axios';
import { parse } from 'path';

const now = Date.now();

const shareURL = `https://warpcast.com/~/compose?embeds%5B%5D=https%3A%2F%2Fmferbuilderdao-frames.pages.dev%2Fapi?${now}&text=do+something+mfer!+start+the+next+mferbuilder+dao+auction+from+the+feed+-+frame+by+%40beachmfer.eth`


// Airstack API Token
export interface Env {
  AIRSTACK_API_TOKEN: string;
}

// contract variables
let tokenURI: string;
const reservePrice = formatEther(parseEther('.0069'));

let auction: readonly [
  bigint,
  bigint,
  `0x${string}`,
  number,
  number,
  boolean
];

const client = createPublicClient({
  chain: base,
  transport: http(),
});

let bid: string;
let bidRaw: bigint;
let token: string;
let minBidIncrementBigInt: bigint;
let minBid: number;

const app = new Frog({
  hub: {
    apiUrl: 'https://hubs.airstack.xyz',
    fetchOptions: {
      headers: {
        'x-airstack-hubs': env.AIRSTACK_API_TOKEN ?? '',
      },
    },
  },
  verify: 'silent',
  title: 'mferbuilderDAO Frames',
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

export const runtime = 'edge';

app.frame('/', async (c) => {
  try {
    // Return auction from mferbuilderDAO
    auction = await client.readContract({
      address: '0x9e573b2cb501af606c40ee59ad4fede5ef4f0c5c',
      abi: wagmiAbi,
      functionName: 'auction',
    });
  } catch {}

  token = auction[0].toString();

  // Return tokenURI from mferbuilderDAO
  try {
    tokenURI = await client.readContract({
      address: '0xb29582a4e0ec47f197e10853d1ff89a6707d6460',
      abi: metaDataAbi,
      functionName: 'tokenURI',
      args: [BigInt(token)],
    });
  } catch {
    return c.res({
      image: (
        <div
          style={{
            alignItems: 'center',
            background: '#ffb66f',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              color: 'black',
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
            Error, refresh frame
          </div>
        </div>
      ),
      // Resets the frame back to the initial/start URL.
      intents: [<Button.Reset>Reset</Button.Reset>],
    });
  }

  const mferbuilderDAOToken = (await axios.get(tokenURI)).data;

  return c.res({
    image: mferbuilderDAOToken.image,
    intents: [
      <Button action={`/join`} value="join">
        join mferbuilder dao
      </Button>,
    ],
  });
});

app.frame('/join', async (c) => {
  try {
    // Return auction from mferbuilderDAOToken
    auction = await client.readContract({
      address: '0x9e573b2cb501af606c40ee59ad4fede5ef4f0c5c',
      abi: wagmiAbi,
      functionName: 'auction',
    });
  } catch {}

  try {
    minBidIncrementBigInt = await client.readContract({
      address: '0x9e573b2cb501af606c40ee59ad4fede5ef4f0c5c',
      abi: wagmiAbi,
      functionName: 'minBidIncrement',
    });
  } catch {}

  token = auction[0].toString();
  bidRaw = auction[1];
  bid = formatEther(auction[1]);

  if (bidRaw === BigInt(0)) {
    minBid = Number(reservePrice);
  } else {
    minBid =
      Number(bid) / Number(minBidIncrementBigInt) + Number(bid);
  }
  // if auction is active show bid frame, else show

  if (Date.now() > auction[4] * 1000) {
    return c.res({
      image: (
        <div
          style={{
            alignItems: 'center',
            background: '#ffb66f',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              color: 'black',
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
            There are no active auctions, start the next one
          </div>
        </div>
      ),
      intents: [
        <Button.Transaction target={`/startAuction`}>
          Start next auction
        </Button.Transaction>,
        <Button.Link href="https://nouns.build/dao/base/0xC9a73a58E011876aEF3f685346AfC77fbEE58bE4?referral=0x83f2af0F0aC4412F118B31f7dd596309B25b34Dd">
          mferbuilderDAO Auction page
        </Button.Link>,
        <Button.Link href={shareURL}>
          Share
        </Button.Link>,
      ],
    });
  }

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: '#ffb66f',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'black',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {`Current bid: ${bid}`}
        </div>
      </div>
    ),
    intents: [
      // <TextInput placeholder={`minimum bid ${minBid.toString()}`} />,
      <Button.Transaction target={`/mint`}>
        Bid {minBid.toString()}
      </Button.Transaction>,
      <Button.Link href="https://nouns.build/dao/base/0xC9a73a58E011876aEF3f685346AfC77fbEE58bE4?referral=0x83f2af0F0aC4412F118B31f7dd596309B25b34Dd">
        mferbuilderDAO Auction page
      </Button.Link>,
      <Button.Link href={shareURL}>
          Share
        </Button.Link>,
    ],
  });
});

app.transaction('/startAuction', async (c) => {
  try {
    // Return auction from mferbuilderDAOToken
    auction = await client.readContract({
      address: '0x9e573b2cb501af606c40ee59ad4fede5ef4f0c5c',
      abi: wagmiAbi,
      functionName: 'auction',
    });
  } catch {}

  try {
    minBidIncrementBigInt = await client.readContract({
      address: '0x9e573b2cb501af606c40ee59ad4fede5ef4f0c5c',
      abi: wagmiAbi,
      functionName: 'minBidIncrement',
    });
  } catch {}

  token = auction[0].toString();

  // if auction is active show bid frame, else show
  // Contract transaction response.
  const balance = await client.getBalance({
    address: c.address as `0x${string}`,
  });

  if (balance < BigInt(parseEther(reservePrice))) {
    return c.error({
      message: 'Insufficient balance',
    });
  }

  try {
    return c.contract({
      abi: wagmiAbi,
      chainId: 'eip155:8453',
      // chainId: 'eip155:84532',
      functionName: 'settleCurrentAndCreateNewAuction',
      args: [],
      // to: '0x03855976fcb91bf23110e2c425dcfb1ba0635b79',
      to: '0x9e573b2cb501af606c40ee59ad4fede5ef4f0c5c',
    });
  } catch {
    return c.error({
      message: 'Transaction failed',
    });
  }
});

app.transaction('/mint', async (c) => {
  try {
    // Return auction from mferbuilderDAOToken
    auction = await client.readContract({
      address: '0x9e573b2cb501af606c40ee59ad4fede5ef4f0c5c',
      abi: wagmiAbi,
      functionName: 'auction',
    });
  } catch {}

  try {
    minBidIncrementBigInt = await client.readContract({
      address: '0x9e573b2cb501af606c40ee59ad4fede5ef4f0c5c',
      abi: wagmiAbi,
      functionName: 'minBidIncrement',
    });
  } catch {}

  token = auction[0].toString();
  bidRaw = auction[1];
  bid = formatEther(auction[1]);
  // Contract transaction response.

  if (bidRaw === BigInt(0)) {
    minBid = Number(reservePrice);
  } else {
    minBid =
      Number(bid) / Number(minBidIncrementBigInt) + Number(bid);
  }
  // Contract transaction response.

  const balance = await client.getBalance({
    address: c.address as `0x${string}`,
  });

  if (BigInt(balance) < BigInt(parseEther(minBid.toString()))) {
    return c.error({
      message: 'Insufficient balance',
    });
  }

  try {
    return c.contract({
      abi: wagmiAbi,
      chainId: 'eip155:8453',
      // chainId: 'eip155:84532',
      functionName: 'createBidWithReferral',
      value: BigInt(parseEther(minBid.toString())),
      args: [
        BigInt(token),
        '0x83f2af0f0ac4412f118b31f7dd596309b25b34dd',
      ],
      // to: '0x03855976fcb91bf23110e2c425dcfb1ba0635b79',
      to: '0x9e573b2cb501af606c40ee59ad4fede5ef4f0c5c',
    });
  } catch {
    return c.error({
      message: 'Could not create bid',
    });
  }
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

// NOTE: That if you are using the devtools and enable Edge Runtime, you will need to copy the devtools
// static assets to the public folder. You can do this by adding a script to your package.json:
// ```json
// {
//   scripts: {
//     "copy-static": "cp -r ./node_modules/frog/_lib/ui/.frog ./public/.frog"
//   }
// }
// ```
// Next, you'll want to set up the devtools to use the correct assets path:
// ```ts
// devtools(app, { assetsPath: '/.frog' })
// ```
