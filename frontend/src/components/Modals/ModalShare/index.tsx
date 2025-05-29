import { FC } from 'react';
import {
    IconBigEmail,
    IconBigFacebook,
    IconBigLinkedIn,
    IconBigPinterest,
    IconBigReddit,
    IconBigX,
    IconBigViber
} from '@src/common/assets/icons';
import Divider from '@src/components/Divider';
import ImageNext from '@src/components/ImageNext';
import Modal from '@src/components/Modal';
import Link from 'next/link';

interface IModalShareProps {
    url: string;
    text: string;
    isOpen: boolean;
    onClose: () => void;
};

const ModalShare: FC<IModalShareProps> = ({
    url,
    text,
    isOpen,
    onClose
}): JSX.Element => {
    const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://pianomusicdatabase.com';
    const urlFull = `${siteUrl}/` + url;
    const urlEncoded = `${siteUrl}/` + encodeURIComponent(url);
    const textEncoded = encodeURIComponent(text);

    return (
        <Modal
            id='modalShare'
            onClose={onClose}
            isOpen={isOpen}
            clickOutsideEnabled={true}
            layoutClassName='w-full max-h-full mx-[20px] max-w-[350px]'
            crossClassName='w-10 h-10 top-2 right-2'
        >
            <div className='flex gap-2 py-4 pr-12 pl-5'>
                <p className='pt-1 text-pmdGrayDark'><strong>Share</strong></p>
            </div>
            <div className='border-pmdGrayLight border-t max-h-[500px] overflow-auto scrollbar'>
                <div className='flex flex-row flex-wrap justify-center gap-x-4 gap-y-4 mt-4 mb-4 px-3'>
                    <Link href={`https://facebook.com/sharer/sharer.php?u=${urlEncoded}&quote=${textEncoded}%20-%20${urlEncoded}`}><a
                        className='hover:opacity-70 p-1 transition-all'
                        title='Share via Facebook'
                        target='_blank'
                        rel='noreferrer'
                    >
                        <ImageNext src={IconBigFacebook} alt='Facebook' />
                    </a></Link>
                    <Link href={`https://x.com/intent/tweet?text=${textEncoded}&url=${urlEncoded}`}><a
                        className='hover:opacity-70 p-1 transition-all'
                        title='Share via X (formerly Twitter)'
                        target='_blank'
                        rel='noreferrer'
                    >
                        <ImageNext src={IconBigX} alt='X (formerly Twitter)' />
                    </a></Link>
                    <Link href={`https://linkedin.com/sharing/share-offsite/?url=${urlEncoded}`}><a
                        className='hover:opacity-70 p-1 transition-all'
                        title='Share via LinkedIn'
                        target='_blank'
                        rel='noreferrer'
                    >
                        <ImageNext src={IconBigLinkedIn} alt='LinkedIn' />
                    </a></Link>
                    <Link href={`https://reddit.com/submit?url=${urlEncoded}`}><a
                        className='hover:opacity-70 p-1 transition-all'
                        title='Share via Reddit'
                        target='_blank'
                        rel='noreferrer'
                    >
                        <ImageNext src={IconBigReddit} alt='Reddit' />
                    </a></Link>
                    <Link href={`https://wa.me/?text=${textEncoded}%20-%20${urlEncoded}`}><a
                        className='hover:opacity-70 p-1 transition-all'
                        title='Share via WhatsApp'
                        target='_blank'
                        rel='noreferrer'
                    >
                        <ImageNext src={IconBigViber} alt='WhatsApp' />
                    </a></Link>
                    <Link href={`https://pinterest.com/pin/create/link/?url=${urlEncoded}`}><a
                        className='hover:opacity-70 p-1 transition-all'
                        title='Share via Pinterest'
                        target='_blank'
                        rel='noreferrer'
                    >
                        <ImageNext src={IconBigPinterest} alt='Pinterest' />
                    </a></Link>
                    <Link href={`mailto:?subject=${textEncoded}&body=${textEncoded}%0D%0A${urlEncoded}`}><a
                        className='hover:opacity-70 p-1 transition-all'
                        title='Share via Email'
                        target='_blank'
                        rel='noreferrer'
                    >
                        <ImageNext src={IconBigEmail} alt='Email' />
                    </a></Link>
                </div>
                <Divider className='mt-0 mb-0' />
                <div className='flex items-center gap-2 p-4'>
                    <a
                        title='Copy Link'
                        className='!p-3 !text-sm cursor-pointer button'
                        onClick={() => {
                            navigator.clipboard.writeText(`${urlFull}`);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                navigator.clipboard.writeText(`${urlFull}`);
                            }
                        }}
                        tabIndex={0}
                    >
                        Copy
                    </a>
                    <a title={urlFull} className='bg-pmdGrayLight px-1 rounded overflow-hidden text-[12px] text-pmdGrayDark hover:text-pmdGrayDark focus:text-pmdGrayDark active:text-pmdGrayDark no-underline text-ellipsis leading-[22px] whitespace-nowrap grow'>{urlFull}</a>
                </div>
            </div>
        </Modal>
    );
};

export default ModalShare;
