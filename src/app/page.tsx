import { getFrameMetadata } from 'frog/next';
import type { Metadata } from 'next';
import Image from 'next/image';

import styles from './page.module.css';

const now = Date.now();

const shareURL = `https://warpcast.com/~/compose?embeds%5B%5D=https%3A%2F%2Fmferbuilderdao-frames.pages.dev%2Fapi?${now}&text=do+something+mfer!+start+the+next+mferbuilder+dao+auction+from+the+feed+-+frame+by+%40beachmfer.eth`

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || 'http://localhost:3000'}/api`
  );
  return {
    other: frameTags,
  };
}

export default function Home() {
  return (
    <main className={styles.main}>
      {/* <div className={styles.description}>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>app/page.tsx</code>
          </p>
          <p>
            Head to{' '}
            <a
              href="/api/dev"
              style={{ display: 'inline', fontWeight: 'semibold' }}
            >
              <code className={styles.code}>localhost:3000/api</code>
            </a>{' '}
            for your frame endpoint.
          </p>
        </div>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div> */}
      <div className={ styles.card}>
        <div className={styles.button1}>
          <a href="https://nouns.build/dao/base/0xC9a73a58E011876aEF3f685346AfC77fbEE58bE4?referral=0x83f2af0F0aC4412F118B31f7dd596309B25b34Dd">
            <h2>mferbuilderDAO</h2>
          </a>
        </div>
        <div className={styles.button1}>
            <a href={shareURL}>
            <h2>Share mfer builderdao Frame</h2>
          </a>
        </div>
      </div>
      {/* <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>
            Learn about Next.js in an interactive course
            with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore starter templates for Next.js.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with
            Vercel.
          </p>
        </a>
      </div> */}
    </main>
  );
}
