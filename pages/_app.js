import '../styles/global.css'
import 'bootstrap/dist/css/bootstrap.css'
import Head from 'next/head'

export const siteTitle = 'TRX mini app'

export default function App({ Component, pageProps }) {
    return(
        <>
        <Head>
            <link rel="icon" href="/favicon.ico" />
            <meta
            name="description"
            content="TRX mini app for generating exercise plans."
            />
            <meta
            property="og:image"
            content={`https://og-image.vercel.app/${encodeURI(
                siteTitle
            )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
            />
            <meta name="og:title" content={siteTitle} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <Component {...pageProps} />
        </>
    );
}