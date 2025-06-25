import { GetServerSideProps, NextPage } from 'next';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Page from '@src/components/Page';
import Chip from '@src/components/Chip';
import {
  IconPlus,
  IconAddToList,
  IconLoginRed,
  IconHeart,
  IconBookmark,
  IconUserProfileOutlinedRed,
  IconDownloadWhite,
  IconCheckboxChevron,
  IconCoin,
  IconCard
} from '@src/common/assets/icons';
import {
  ENotificationActionTypes,
  ENotificationTypes,
  TUserAttributes,
  EUserTypes
} from '@src/types';
import { EUrlsPages } from '@src/constants';
import { AppContext } from '@src/state';
import ImageNext from '@src/components/ImageNext';
import Link from 'next/link';

interface IAccountDashboardPageProps {
  prevUrl: string | undefined;
};

const AccountDashboardPage: NextPage<IAccountDashboardPageProps> = ({ prevUrl }) => {
  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://pianomusicdatabase.com';
  const router = useRouter();
  const { dispatch } = useContext(AppContext);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<string | null>(null);
  const [userOccupation, setUserOccupation] = useState<string | null>(null);

  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
    if (accountData.id) {
      if (accountData.name) {
        setUserName(accountData.name);
        if (accountData.email) {
          setUserEmail(accountData.email);
        };
        if (accountData.userType) {
          setUserType(accountData.userType);
        };
        if (accountData.userOccupation) {
          setUserOccupation(accountData.userOccupation);
        };
        if (accountData.subscriptionStatus) {
          setUserSubscriptionStatus(accountData.subscriptionStatus);
        };
      };
    } else {
      localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search + window.location.hash);
      router.push(`/${EUrlsPages.LOG_IN}`, undefined, { shallow: false });
    };
  }, [router]);

  const handleLogOut = () => {
    dispatch({
      type: EUserTypes.LOG_OUT,
      payload: null
    });
    document.cookie = `jwt=; max-age=0;`;
    localStorage?.removeItem('accountData');
    router.push(`/${EUrlsPages.LOG_IN}`, undefined, { shallow: false });
    dispatch({
      type: ENotificationActionTypes.SET_MESSAGE,
      payload: {
        message: 'Logged out',
        type: ENotificationTypes.SUCCESS
      }
    });
  };

  return (
    <Page
      showBackBar={true}
      showBackBarShare={false}
      showBackBarFeedback={true}
      url={EUrlsPages.ACCOUNT_DASHBOARD}
      prevUrl={prevUrl}
      title='Account Dashboard - Piano Music Database'
      description='The account dashboard on Piano Music Database allows you to access all the relevant details, settings, features, and benefits of your account.'
      image=''
      className='!mx-0 !px-0 !max-w-full'
      classNameMain='!max-w-full !mx-0 !px-0'
    >
      <h1>Account Dashboard</h1>
      <div className='flex flex-col items-center gap-y-8 mx-auto w-full'>
        <section id='account-settings' className='flex flex-col items-center gap-y-4 px-3'>
          <div className='flex flex-col items-center gap-y-3 mt-4'>
            {userName && (
              <p className='text-lg'>Hello {userName}!</p>
            )}
            {userEmail && (
              <p className='break-all sm:break-normal'>{userEmail}</p>
            )}
            {userType && (
              <Chip title={'Type: ' + userType} />
            )}
            {userOccupation && (
              <Chip title={'Occupation(s): ' + userOccupation} />
            )}
          </div>
          <div className='flex flex-wrap justify-center items-center gap-3 mt-4'>
            <Link href={`/${EUrlsPages.FAVORITES}`}><a title='Your Favorites'>
              <div
                className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-2 rounded-lg w-48 h-36 transition-all cursor-pointer'
              >
                <div className='flex flex-col items-center gap-y-4 my-auto'>
                  <ImageNext src={IconHeart} alt='' height={48} width={48} />
                  <p className='font-extrabold text-pmdRed leading-5 tracking-[0.2px]'>
                    Your Favorites
                  </p>
                </div>
              </div>
            </a></Link>
            <Link href={`/${EUrlsPages.LISTS_CREATED}`}><a title='Your Lists'>
              <div
                className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-2 rounded-lg w-48 h-36 transition-all cursor-pointer'
              >
                <div className='flex flex-col items-center gap-y-4 my-auto'>
                  <ImageNext src={IconBookmark} alt='' height={48} width={48} />
                  <p className='font-extrabold text-pmdRed leading-5 tracking-[0.2px]'>
                    Your Lists
                  </p>
                </div>
              </div>
            </a></Link>
            <Link href={`/${EUrlsPages.ACCOUNT_SETTINGS}`}><a title='Edit Your Account Details'>
              <div
                className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-2 rounded-lg w-48 h-36 transition-all cursor-pointer'
              >
                <div className='flex flex-col items-center gap-y-4 my-auto'>
                  <ImageNext src={IconUserProfileOutlinedRed} alt='' height={48} width={48} />
                  <p className='font-extrabold text-pmdRed leading-5 tracking-[0.2px]'>
                    Edit Account Info
                  </p>
                </div>
              </div>
            </a></Link>
            <a
              title='Log Out'
              onClick={handleLogOut}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleLogOut();
                }
              }}
              tabIndex={0}
            >
              <div
                className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-2 rounded-lg w-48 h-36 transition-all cursor-pointer'
              >
                <div className='flex flex-col items-center gap-y-4 my-auto'>
                  <ImageNext src={IconLoginRed} alt='' height={48} width={48} />
                  <p className='font-extrabold text-pmdRed leading-5 tracking-[0.2px]'>
                    Log Out
                  </p>
                </div>
              </div>
            </a>
          </div>
        </section>
        <section id='pmdplus' className='flex flex-col mt-12 px-3 max-w-[600px]'>
          <h2 id='pmd-plus' className='my-4 text-center'>PMD Plus</h2>
          <div className='flex flex-wrap justify-center items-center gap-3 mt-4'>
            <Link href={`/${EUrlsPages.PRICING}`}><a id='pricing' title='Pricing'>
              <div
                className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-2 rounded-lg w-48 h-36 transition-all cursor-pointer'
              >
                <div className='flex flex-col items-center gap-y-4 my-auto'>
                  <ImageNext src={IconCoin} alt='' height={48} width={48} />
                  <p className='font-extrabold text-pmdRed leading-5 tracking-[0.2px]'>
                    Pricing
                  </p>
                </div>
              </div>
            </a></Link>
            {userSubscriptionStatus && userSubscriptionStatus == 'active' && (
              <Link href={`/${EUrlsPages.PLAN}`}><a title='Your Plan Details'>
                <div
                  id='your-plan-details'
                  className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-2 rounded-lg w-48 h-36 transition-all cursor-pointer'
                >
                  <div className='flex flex-col items-center gap-y-4 my-auto'>
                    <ImageNext src={IconCard} alt='' height={48} width={48} />
                    <p className='font-extrabold text-pmdRed leading-5 tracking-[0.2px]'>
                      Your Plan Details
                    </p>
                  </div>
                </div>
              </a></Link>
            )}
          </div>
        </section>
        <section id='free-music' className='flex flex-col mt-12 px-3 max-w-[816px]'>
          <h2 id='free-sheet-music' className='my-4 text-center'>Free Sheet Music</h2>
          <p className='text-center'>
            Thank you for creating an account during <em>PMD Early Access</em>.
          </p>
          <p className='mx-auto max-w-[600px] text-center'>
            We have partnered with publisher <Link href={`/${EUrlsPages.PUBLISHER}/K%26S%20Conservatory%20of%20Music?id=36`}><a title='K&S Conservatory of Music'>K&S Conservatory of Music</a></Link> to give every new user a free download of a 3-pack of sheet music.
          </p>
          <p className='my-4 font-medium text-center'>
            Click below to access your free music.
          </p>
          <div className='flex flex-wrap justify-center items-center gap-3 mt-2'>
            <a className='!py-3 w-full text-center cursor-pointer button' id='download-free-sheet-music' title='Download Free Sheet Music' href={`${siteUrl}/PMD Plus Free Sheet Music from K and S Music.pdf`} target='_blank' rel='noopener noreferrer'>
              <div className='flex justify-center items-center gap-4 my-auto text-center'>
                <ImageNext src={IconDownloadWhite} alt='' height={48} width={48} />
                <p>
                  Download Free Sheet Music
                </p>
              </div>
            </a>
          </div>
        </section>
        <section id='fb-group' className='flex flex-col mt-12 w-full'>
          <div className='flex flex-col justify-center items-center bg-[url("/lines.png")] bg-pmdRed bg-cover bg-no-repeat bg-bottom bg-local px-4 py-16 w-full text-white text-center'>
            <h2 id='try' className='flex justify-center items-center mb-2 font-medium text-center'>Join Our Private <br />Facebook Group</h2>
            <p><em>Just for PMD Users!</em></p>
            <div className='flex flex-row flex-wrap justify-center items-center gap-x-12 gap-y-4 mt-10 mb-10 w-full text-center align-middle'>
              <div className='flex flex-row gap-2'><ImageNext
                src={IconCheckboxChevron}
                alt=''
                height={24}
                width={24}
              />
                Connect with other users
              </div>
              <div className='flex flex-row gap-2'><ImageNext
                src={IconCheckboxChevron}
                alt=''
                height={24}
                width={24}
              />
                Share and discover music
              </div>
              <div className='flex flex-row gap-2'><ImageNext
                src={IconCheckboxChevron}
                alt=''
                height={24}
                width={24}
              />
                Learn about new features
              </div>
              <div className='flex flex-row gap-2'><ImageNext
                src={IconCheckboxChevron}
                alt=''
                height={24}
                width={24}
              />
                Database tips and tricks
              </div>
              <div className='flex flex-row gap-2'><ImageNext
                src={IconCheckboxChevron}
                alt=''
                height={24}
                width={24}
              />
                Special discounts for members
              </div>
            </div>
            <a title='Join Now Free' href='https://facebook.com/groups/371031046051751' className='!px-10 !py-3 text-lg buttonwhite'>Join Now Free</a>
          </div>
        </section>
        <section id='your-contributions' className='flex flex-col mt-12 px-3 text-center'>
          <h2 id='contributions' className='my-4'>Contributions</h2>
          <div className='flex flex-row max-[444px]:flex-col justify-start items-start gap-x-3 gap-y-12 mt-4'>
            <div className='flex flex-col justify-center items-center gap-3'>
              <Link href={`/${EUrlsPages.ADD_PUBLISHER}`}><a title='Add a Publisher'>
                <div
                  className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-2 rounded-lg w-48 h-36 transition-all cursor-pointer'
                >
                  <div className='flex flex-col items-center gap-y-4 my-auto'>
                    <ImageNext src={IconPlus} alt='' height={48} width={48} />
                    <p className='font-extrabold text-pmdRed leading-5 tracking-[0.2px]'>
                      Add a Publisher
                    </p>
                  </div>
                </div>
              </a></Link>
              <Link href={`/${EUrlsPages.ADD_COMPOSER}`}><a title='Add a Composer'>
                <div
                  className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-2 rounded-lg w-48 h-36 transition-all cursor-pointer'
                >
                  <div className='flex flex-col items-center gap-y-4 my-auto'>
                    <ImageNext src={IconPlus} alt='' height={48} width={48} />
                    <p className='font-extrabold text-pmdRed leading-5 tracking-[0.2px]'>
                      Add a Composer
                    </p>
                  </div>
                </div>
              </a></Link>
              <Link href={`/${EUrlsPages.ADD_COLLECTION}`}><a title='Add a Collection'>
                <div
                  className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-2 rounded-lg w-48 h-36 transition-all cursor-pointer'
                >
                  <div className='flex flex-col items-center gap-y-4 my-auto'>
                    <ImageNext src={IconPlus} alt='' height={48} width={48} />
                    <p className='font-extrabold text-pmdRed leading-5 tracking-[0.2px]'>
                      Add a Collection
                    </p>
                  </div>
                </div>
              </a></Link>
              <Link href={`/${EUrlsPages.ADD_WORK}`}><a title='Add a Work'>
                <div
                  className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-2 rounded-lg w-48 h-36 transition-all cursor-pointer'
                >
                  <div className='flex flex-col items-center gap-y-4 my-auto'>
                    <ImageNext src={IconPlus} alt='' height={48} width={48} />
                    <p className='font-extrabold text-pmdRed leading-5 tracking-[0.2px]'>
                      Add a Work
                    </p>
                  </div>
                </div>
              </a></Link>
            </div>
            <div className='flex flex-col justify-center items-center gap-3'>
              <Link href={`/${EUrlsPages.PUBLISHERS_ADDED}`}><a title='Publishers Added'>
                <div
                  className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-2 rounded-lg w-48 h-36 transition-all cursor-pointer'
                >
                  <div className='flex flex-col items-center gap-y-4 my-auto'>
                    <ImageNext src={IconAddToList} alt='' height={48} width={48} />
                    <p className='font-extrabold text-pmdRed leading-5 tracking-[0.2px]'>
                      Publishers Added
                    </p>
                  </div>
                </div>
              </a></Link>
              <Link href={`/${EUrlsPages.COMPOSERS_ADDED}`}><a title='Composers Added'>
                <div
                  className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-2 rounded-lg w-48 h-36 transition-all cursor-pointer'
                >
                  <div className='flex flex-col items-center gap-y-4 my-auto'>
                    <ImageNext src={IconAddToList} alt='' height={48} width={48} />
                    <p className='font-extrabold text-pmdRed leading-5 tracking-[0.2px]'>
                      Composers Added
                    </p>
                  </div>
                </div>
              </a></Link>
              <Link href={`/${EUrlsPages.COLLECTIONS_ADDED}`}><a title='Collections Added'>
                <div
                  className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-2 rounded-lg w-48 h-36 transition-all cursor-pointer'
                >
                  <div className='flex flex-col items-center gap-y-4 my-auto'>
                    <ImageNext src={IconAddToList} alt='' height={48} width={48} />
                    <p className='font-extrabold text-pmdRed leading-5 tracking-[0.2px]'>
                      Collections Added
                    </p>
                  </div>
                </div>
              </a></Link>
              <Link href={`/${EUrlsPages.WORKS_ADDED}`}><a title='Works Added'>
                <div
                  className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-2 rounded-lg w-48 h-36 transition-all cursor-pointer'
                >
                  <div className='flex flex-col items-center gap-y-4 my-auto'>
                    <ImageNext src={IconAddToList} alt='' height={48} width={48} />
                    <p className='font-extrabold text-pmdRed leading-5 tracking-[0.2px]'>
                      Works Added
                    </p>
                  </div>
                </div>
              </a></Link>
            </div>
          </div>
          {/* <div className='flex flex-wrap justify-center items-center gap-3 mt-12'>
            <Link href={`/${EUrlsPages.EDIT_HISTORY}`}><a title='Edit History'>
              <div
                className='flex flex-col items-center bg-white hover:bg-pmdGrayBright shadow-header p-2 rounded-lg w-48 h-36 transition-all cursor-pointer'
              >
                <div className='flex flex-col items-center gap-y-4 my-auto'>
                  <ImageNext src={IconAddToList} alt='' height={48} width={48} />
                  <p className='font-extrabold text-pmdRed leading-5 tracking-[0.2px]'>
                    Edit History
                  </p>
                </div>
              </div>
            </a></Link>
          </div> */}
        </section>
      </div>
    </Page >
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      prevUrl: context.req.headers.referer ?? ''
    }
  };
};

export default AccountDashboardPage;
